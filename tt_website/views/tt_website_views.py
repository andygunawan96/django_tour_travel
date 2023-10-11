from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice_content_views import *
from tt_webservice.views.tt_webservice_airline_views import *
from tt_webservice.views.tt_webservice_payment_views import *
from tt_webservice.views.tt_webservice_views import *
import logging
import traceback
from tools import path_util
from django.utils import translation
import json
import base64
from django.core.files.storage import FileSystemStorage
import os
from tools.parser import *
from datetime import *
import copy
import math
import requests
_logger = logging.getLogger("website_logger")

MODEL_NAME = 'tt_website'
# _dest_env = TtDestinations()
provider_type = {
    'AL': 'airline',
    'TN': 'train',
    'PS': 'passport',
    'VS': 'visa',
    'AT': 'activity',
    'TR': 'tour',
    'RESV': 'hotel',
    'BT': 'ppob',
    'VT': 'event',
    'PK': 'medical',
    'PH': 'medical',
    'BU': 'bus',
    'MK': 'mitrakeluarga',
    'SE': 'swabexpress',
    'SM': 'sentramedika',
    'LP': 'labpintar',
    'GB': 'groupbooking',
}

def check_banner(page, banner_type, request):
    check_banner = 0
    try:
        if banner_type == 'big_banner':
            file = get_banner_data(request, 'big_banner')
        elif banner_type == 'small_banner':
            file = get_banner_data(request, 'small_banner')
        elif banner_type == 'promotion':
            file = get_banner_data(request, 'promotion')
        elif banner_type == 'dynamic_page':
            file = get_dynamic_page(request)
        else:
            file = False
        if file:
            for banner in file['result']['response']:
                if banner.get('active'):
                    if page == 'home':
                        check_banner = 1
                        break
                    elif banner_type == 'dynamic_page' and not page:
                        check_banner = 1
                    else:
                        if banner.get('provider_type') and banner['provider_type'] == page:
                            check_banner = 1
                            break
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    return check_banner

def check_terms_condition(request):
    check_terms = 0
    read_cache("term_and_condition", 'cache_web', request, 90911)
    try:
        file = read_cache("term_and_condition", 'cache_web', request, 90911)
        if file:
            for idx, line in enumerate(file.split('\n')):
                if idx == 2:
                    active = line.split('\n')[0]

            if active == 'active':
                check_terms = 1
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    return check_terms

def check_captcha(request):
    try:
        secret_key = ''
        file = read_cache("google_recaptcha", 'cache_web', request, 90911)
        if file:
            for idx, line in enumerate(file.split('\n')):
                if idx == 2 and line != '':
                    secret_key = line

        # captcha verification
        data = {
            'response': request.POST.get('g-recaptcha-response'),
            'secret': secret_key
        }
        _logger.info(json.dumps(data))
        if secret_key != '':
            resp = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
            result_json = resp.json()

            _logger.info(json.dumps(result_json))

            if not result_json.get('success') and request.session.get('airline_recaptcha') == False:
                raise Exception('Make response code 500!')
            else:
                request.session['airline_recaptcha'] = True
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    # end captcha verification

# Create your views here.
def index(request):
    if not get_credential(request, 'dict'):
        return no_credential(request)
    try:
        values = get_data_template(request)
        user_default = get_credential_user_default(request, 'dict')
        if not request.session.get('user_account') and values['website_mode'] == 'btc' or not request.session.get('user_account') and values['website_mode'] == 'btc_btb':
            provider = signin_btc(request)
            try:
                if provider['result']['response'].get('provider'):
                    values = get_data_template(request, 'home', provider['result']['response']['provider'])
                else:
                    raise Exception('Make response code 409!')
                    # return no_credential_b2c(request)
            except Exception as e:
                _logger.error('Error user b2c auto sign in')
                if provider['result']['error_code'] == 4002 and 'connection refused' not in provider['result']['error_msg'].lower() or str(e) == 'Make response code 409!':
                    raise Exception('Make response code 409!')
                ## GW MATI OR BACKEND MATI
                elif 'httpconnectionpool' in provider['result']['error_msg'].lower() or 'connection refused' in provider['result']['error_msg'].lower():
                    raise Exception('Make response code 408!')
        elif request.session.get('user_account') and values['website_mode'] == 'btb' or request.session.get('user_account') and values['website_mode'] == 'btb_with_signup_b2c':
            if request.session.get('user_account').get('co_user_login') == user_default.get('user_name', ''):
                for key in reversed(list(request.session._session.keys())):
                    if key != '_language':
                        del request.session[key]
                request.session.modified = True
                return no_session_logout(request)
        try:
            if request.session.get('medical_passenger_cache'):
                del request.session['medical_passenger_cache']
        except:
            pass
        try:
            if request.session.get('medical_data_cache'):
                del request.session['medical_data_cache']
        except:
            pass

        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        if request.POST.get('logout'):
            request.session.flush()
            # if request.session._session:
            #     for key in reversed(list(request.session._session.keys())):
            #         if key != '_language':
            #             del request.session[key]
            #     request.session.modified = True
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'countries': airline_country,
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'phone_code': phone_code,
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
        })

        if 'login' in request.session['user_account']['co_agent_frontend_security']:
            airline_cabin_class_list = [
                {
                    'name': 'Economy',
                    'value': 'Y',
                }, {
                    'name': 'Premium Economy',
                    'value': 'W',
                }, {
                    'name': 'Business',
                    'value': 'C',
                }, {
                    'name': 'First Class',
                    'value': 'F',
                }
            ]
            # airline

            # activity
            try:
                activity_categories = response['result']['response']['activity']['categories']
            except Exception as e:
                activity_categories = []
                _logger.error(str(e) + '\n' + traceback.format_exc())
            try:
                activity_types = response['result']['response']['activity']['types']
            except Exception as e:
                activity_types = []
                _logger.error(str(e) + '\n' + traceback.format_exc())

            # tour
            try:
                tour_countries = response['result']['response']['tour']['countries']
            except Exception as e:
                tour_countries = []
                _logger.error(str(e) + '\n' + traceback.format_exc())
            # tour
            try:
                if 'hotel_error' in request.session._session:
                    del request.session['hotel_error']
            except:
                pass

            # get_data_awal
            cache = {}
            try:
                file = read_cache_file(request, '', 'airline_request')
                if file:
                    cache['airline'] = {
                        'origin': file['origin'][0],
                        'destination': file['destination'][0],
                        'departure': file['departure'][0],
                    }
                if cache['airline']['departure'] == 'Invalid date':
                    cache['airline']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
                # if request.session['airline_request']['origin'][0].split('-')[1] != ' ':
                #     cache['airline'] = {
                #         'origin': request.session['airline_request']['origin'][0],
                #         'destination': request.session['airline_request']['destination'][0],
                #         'departure': request.session['airline_request']['departure'][0],
                #     }
                #     if cache['airline']['departure'] == 'Invalid date':
                #         cache['airline']['departure'] = convert_string_to_date_to_string_front_end(
                #             str(datetime.now())[:10])
            except:
                pass

            try:
                file = read_cache_file(request, '', 'train_request')
                if file:
                    cache['train'] = {
                        'origin': file['origin'][0],
                        'destination': file['destination'][0],
                        'departure': file['departure'][0],
                    }
                # if request.session['train_request']['origin'][0].split('-')[1] != ' ':
                #     cache['train'] = {
                #         'origin': request.session['train_request']['origin'][0],
                #         'destination': request.session['train_request']['destination'][0],
                #         'departure': request.session['train_request']['departure'][0],
                #     }
                if cache['train']['departure'] == 'Invalid date':
                    cache['train']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
            except:
                pass

            try:
                file = read_cache_file(request, '', 'hotel_request')
                if file:
                    cache['airline'] = {
                        'checkin': file['checkin_date'],
                        'checkout': file['checkou_date']
                    }

                # cache['hotel'] = {
                #     'checkin': request.session['hotel_request']['checkin_date'],
                #     'checkout': request.session['hotel_request']['checkout_date']
                # }
                if cache['hotel']['checkin'] == 'Invalid date' or cache['hotel']['checkout'] == 'Invalid date':
                    cache['hotel']['checkin'] = convert_string_to_date_to_string_front_end(
                        str(datetime.now() + relativedelta(days=1))[:10])
                    cache['hotel']['checkout'] = convert_string_to_date_to_string_front_end(
                        str(datetime.now() + relativedelta(days=2))[:10])
            except:
                pass

            try:
                file = read_cache_file(request, '', 'activity_search_request')
                if file:
                    cache['activity'] = {
                        'name': file['query']
                    }

                # cache['activity'] = {
                #     'name': request.session['activity_request']['query']
                # }
            except:
                pass

            try:
                file = read_cache_file(request, '', 'tour_request')
                if file:
                    cache['tour'] = {
                        'name': file['tour_query']
                    }
                # cache['tour'] = {
                #     'name': request.session['tour_request']['tour_query']
                # }
            except:
                pass

            try:
                file = read_cache_file(request, '', 'visa_request')
                if file:
                    cache['visa'] = {
                        'departure_date': file['departure_date'],
                        'destination': file['destination'],
                        'consulate': file['consulate']
                    }
                # cache['visa'] = {
                #     'destination': request.session['visa_request']['destination'],
                #     'departure_date': request.session['visa_request']['departure_date'],
                #     'consulate': request.session['visa_request']['consulate']
                # }
                if cache['visa']['departure_date'] == 'Invalid date':
                    cache['visa']['departure_date'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
            except:
                pass

            try:
                file = read_cache_file(request, '', 'event_request')
                if file:
                    cache['event'] = {
                        'event_name': file['event_name']
                    }
                # cache['event'] = {
                #     'event_name': request.session['event_request']['event_name']
                # }
            except:
                pass
            try:
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'cache': cache,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],

                    'countries': airline_country,
                    'phone_code': phone_code,
                    # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                    'username': request.session['user_account'],
                    # 'co_uid': request.session['co_uid'],
                    'airline_cabin_class_list': airline_cabin_class_list,
                    # activity
                    'activity_categories': activity_categories,
                    'activity_types': activity_types,
                    # tour
                    'tour_countries': tour_countries,
                    'javascript_version': javascript_version,
                    'update_data': 'false',
                    'static_path_url_server': get_url_static_path(),
                    'signature': request.session['signature'],
                    'terms_value': check_terms_condition(request),

                    'big_banner_value': check_banner('home', 'big_banner', request),
                    'small_banner_value': check_banner('home', 'small_banner', request),
                    'promotion_banner_value': check_banner('home', 'promotion', request),
                    'dynamic_page_value': check_banner('', 'dynamic_page', request),
                })
                values.update(get_airline_advance_pax_type(request))
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')
            return render(request, MODEL_NAME + '/home_templates.html', values)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        if str(e) == 'Make response code 409!':
            return error_credential(request)
        elif str(e) == 'Make response code 408!':
            return error_timeout(request)
        else:
            pass
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

    return no_session_logout(request)

def set_currency(request, data):
    set_session(request, 'currency', data)
    next_url = "/".join(request.META.get('HTTP_REFERER').split('/')[3:])
    if not next_url:
        next_url = '/'
    else:
        next_url = '/'+next_url

    return redirect(next_url)

def webcam(request):
    javascript_version = get_javascript_version(request)
    values = get_data_template(request, 'login')
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
    })
    return render(request, MODEL_NAME + '/webcam.html', values)

def no_session_logout(request):
    try:
        language = request.session['_language']
    except:
        language = ''
    return redirect(language+'/login')

def no_credential(request):
    try:
        language = request.session['_language']
    except:
        language = ''
    return redirect(language+'/credential')

def no_credential_b2c(request):
    try:
        language = request.session['_language']
    except:
        language = ''
    return redirect(language+'/credential_b2c')

def credential(request):
    values = get_data_template(request)
    javascript_version = get_javascript_version(request)
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
    })
    return render(request, MODEL_NAME + '/credential_templates.html', values)

def credential_b2c(request):
    values = get_data_template(request)
    javascript_version = get_javascript_version(request)
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
    })
    return render(request, MODEL_NAME + '/credential_b2c_templates.html', values)

def goto_dashboard(request):
    try:
        language = request.session['_language']
    except:
        language = ''
    return redirect(language+'/')

def testing_chat(request):
    try:
        if 'user_account' in request.session._session and 'admin' in request.session['user_account']['co_agent_frontend_security']:
            values = get_data_template(request)
            values.update({
                'static_path_url_server': get_url_static_path(),
                'static_path': path_util.get_static_path(MODEL_NAME),
                'signature': request.session['signature'],
                'username': request.session['user_account'],
            })
            return render(request, MODEL_NAME+'/testing_chat.html', values)
        else:
            try:
                language = request.session['_language']
            except:
                language = ''
            return redirect(language + '/')
    except:
        return no_session_logout(request)

def assign_analyst(request, vendor):
    if 'user_account' in request.session._session:
        if 'analyst_phc' in request.session['user_account']['co_agent_frontend_security'] and vendor == 'phc' or 'assign_analyst_phc' in request.session['user_account']['co_agent_frontend_security'] and vendor == 'phc' or \
            'analyst_periksain' in request.session['user_account']['co_agent_frontend_security'] and vendor == 'periksain' or 'assign_analyst_periksain' in request.session['user_account']['co_agent_frontend_security'] and vendor == 'periksain':
            try:
                javascript_version = get_javascript_version(request)
                response = get_cache_data(request)
                airline_country = response['result']['response']['airline']['country']
                phone_code = []
                for i in airline_country:
                    if i['phone_code'] not in phone_code:
                        phone_code.append(i['phone_code'])
                phone_code = sorted(phone_code)

                file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
                if file:
                    airline_carriers = file
                else:
                    airline_carriers = {}
                values = get_data_template(request)

                new_airline_carriers = {}
                for key, value in airline_carriers.items():
                    new_airline_carriers[key] = value

                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'airline_carriers': new_airline_carriers,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                    'username': request.session['user_account'],
                    'static_path_url_server': get_url_static_path(),
                    'javascript_version': javascript_version,
                    'signature': request.session['signature'],
                    'vendor': vendor
                })
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')
            return render(request, MODEL_NAME+'/backend/analyst_assign_templates.html', values)
        else:
            return goto_dashboard
    else:
        return no_session_logout(request)

def page(request, data):
    javascript_version = get_javascript_version(request)
    values = get_data_template(request, 'login')
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
        'data': data
    })
    return render(request, MODEL_NAME + '/page.html', values)

def page_mobile(request, data):
    javascript_version = get_javascript_version(request)
    values = get_data_template(request, 'login')
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
        'data': data
    })
    return render(request, MODEL_NAME + '/page_mobile.html', values)

def payment_method(request, provider, order_number):
    javascript_version = get_javascript_version(request)
    values = get_data_template(request, 'login')
    if not request.session.get('signature'):
        signin_btc(request)
    data = {
        'signature': request.session['signature'],
        'order_number': order_number
    }
    time_limit = ''
    nomor_rekening = ''
    amount = ''
    create_date = ''
    bank_name = ''
    va_number = ''
    account_name = ''
    data_payment = []
    currency = ''
    data = get_order_number_frontend(data)
    if data['result']['error_code'] == 0:
        time_limit = data['result']['response']['time_limit']
        nomor_rekening = data['result']['response']['nomor_rekening']
        amount = data['result']['response']['amount']
        va_number = data['result']['response']['va_number']
        bank_name = data['result']['response']['bank_name']
        account_name = data['result']['response']['account_name']
        currency = data['result']['response']['currency']
        create_date = convert_string_to_date_to_string_front_end_with_time(to_date_now(data['result']['response']['create_date']))
        data_payment = []
        file = read_cache(data['result']['response']['acquirer_seq_id'], "payment_information", request, 90911)
        if file:
            data_payment.append({
                "heading": '',
                "html": '',
                "acquirer_seq_id": data['result']['response']['acquirer_seq_id']
            })
            for idx, data_cache in enumerate(file.split('\n')):
                if idx == 0:
                    data_payment[len(data_payment)-1]['heading'] = data_cache
                elif idx == 1:
                    data_payment[len(data_payment) - 1]['html'] = data_cache.replace('<br>', '\n')
        file = read_cache("other_bank", "payment_information", request, 90911)
        if file:
            data_payment.append({
                "heading": '',
                "html": '',
                "acquirer_seq_id": 'other_bank'
            })
            for idx, data_cache in enumerate(file.split('\n')):
                if idx == 0:
                    data_payment[len(data_payment)-1]['heading'] = 'Other'
                elif idx == 1:
                    data_payment[len(data_payment) - 1]['html'] = data_cache.replace('<br>', '\n')

    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
        'order_number': order_number,
        'provider_type': provider_type[order_number.split('.')[0]],
        'provider_payment': provider,
        'time_limit': time_limit,
        'nomor_rekening': nomor_rekening,
        'amount': amount,
        'create_date': create_date,
        'va_number': va_number,
        'bank_name': bank_name,
        'account_name': account_name,
        'signature': request.session['signature'],
        'data_payments': data_payment,
        'currency': currency
    })
    return render(request, MODEL_NAME + '/payment_method_embed.html', values)

def login(request):
    if not get_credential(request, 'dict'):
        return no_credential(request)
    javascript_version = get_javascript_version(request)
    values = get_data_template(request, 'login')
    if request.POST.get('logout') == 'true':
        if request.session._session:
            for key in reversed(list(request.session._session.keys())):
                if key != '_language':
                    del request.session[key]
            request.session.modified = True
            request.session.save()
    try:
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            'big_banner_value': check_banner('home', 'big_banner', request),
            'small_banner_value': check_banner('home', 'small_banner', request),
            'promotion_banner_value': check_banner('home', 'promotion', request),
            'dynamic_page_value': check_banner('', 'dynamic_page', request),
            'terms_value': check_terms_condition(request),
            'username': {'co_user_login': ''}
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    # return goto_dashboard()
    if values['website_mode'] == 'btb' or values['website_mode'] == 'btb_with_signup_b2c':
        return render(request, MODEL_NAME + '/login_templates.html', values)
    else:
        try:
            language = request.session['_language']
        except:
            language = ''
        return redirect(language + '/')

def admin(request):
    if 'user_account' in request.session._session and request.session.get('user_account') and 'admin' in request.session['user_account']['co_agent_frontend_security']:
        if 'edit_appearance' in request.session['user_account']['co_agent_frontend_security']:
            #save
            try:
                if request.POST != {}:
                    ## AMBIL CACHE DATA HANYA 1x Loop
                    file = read_cache("data_cache_template", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        for idx, line in enumerate(file.split('\n')):
                            if idx == 0:
                                if line != '':
                                    data_cache['logo'] = line.split('\n')[0]
                            elif idx == 1:
                                if line != '':
                                    data_cache['template'] = line.split('\n')[0]
                            elif idx == 2:
                                if line != '':
                                    data_cache['color_pick'] = line.split('\n')[0]
                            elif idx == 3:
                                if line != '':
                                    data_cache['website_name'] = line.split('\n')[0]
                            elif idx == 4:
                                if line != '':
                                    data_cache['background'] = line.split('\n')[0]
                            elif idx == 5:
                                if line != '':
                                    data_cache['bg_login'] = line.split('\n')[0]
                            elif idx == 6:
                                if line != '':
                                    data_cache['bg_search'] = line.split('\n')[0]
                            elif idx == 7:
                                pass
                                # if line != '':
                                #     tawk_chat = int(line)
                            elif idx == 8:
                                pass
                                # if line != '':
                                #     tawk_code = line.split('\n')[0]
                            elif idx == 9:
                                if line != '':
                                    data_cache['text_color'] = line.split('\n')[0]
                            elif idx == 10:
                                if line != '':
                                    data_cache['tab_color'] = line.split('\n')[0]
                            elif idx == 11:
                                if line != '':
                                    data_cache['logo_icon'] = line.split('\n')[0]
                            elif idx == 12:
                                if line != '':
                                    data_cache['bg_regis'] = line.split('\n')[0]
                            elif idx == 13:
                                if line != '':
                                    data_cache['espay_api_key'] = line.split('\n')[0]
                            elif idx == 14:
                                if line != '':
                                    data_cache['espay_api_key_callback_url'] = line.split('\n')[0]
                            elif idx == 15:
                                if line != '':
                                    data_cache['backend_url'] = line.split('\n')[0]
                            elif idx == 16:
                                if line != '':
                                    data_cache['website_mode'] = line.split('\n')[0]
                            elif idx == 17:
                                if line != '':
                                    data_cache['script_espay'] = line.split('\n')[0]
                            elif idx == 18:
                                if line != '':
                                    data_cache['google_analytics'] = line.split('\n')[0]
                            elif idx == 19:
                                data_cache['contact_us'] = '\n'.join(line.split('<br>'))
                            elif idx == 20:
                                if line != '':
                                    data_cache['tab_login_background'] = line.split('\n')[0]
                            elif idx == 21:
                                if line != '':
                                    data_cache['text_color_login'] = line.split('\n')[0]
                            elif idx == 22:
                                pass
                                # if line != '':
                                #     wa_chat = int(line.split('\n')[0])
                            elif idx == 23:
                                pass
                                # if line != '':
                                #     wa_number = line.split('\n')[0]
                            elif idx == 24:
                                if line != '':
                                    data_cache['google_api_key'] = line.split('\n')[0]
                            elif idx == 25:
                                if line != '':
                                    data_cache['setting_login_page'] = line.split('\n')[0]
                            elif idx == 26:
                                if line != '':
                                    data_cache['tour_search_template'] = line.split('\n')[0]


                    text = ''
                    fs = FileSystemStorage()
                    fs.location = media_path(request, fs.location, '')
                    if request.POST.get('empty_logo'):
                        pass
                    elif request.FILES.get('fileToUpload'):
                        if request.FILES['fileToUpload'].content_type in ['image/jpeg', 'image/png', 'image/png']:
                            file = request.FILES['fileToUpload']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + request.META['HTTP_HOST'].split(':')[0] + '/' + filename
                    elif data_cache.get('logo'):
                        text += data_cache['logo']
                    text += '\n'

                    # DATA CACHE TEMPLATE
                    if 'template' in request.POST:
                        text += request.POST['template']
                    elif data_cache.get('template'):
                        text += data_cache['template']
                    text += '\n'

                    if 'color_pick' in request.POST:
                        text += "#" + request.POST['color_pick']
                    elif data_cache.get('color_pick'):
                        text += data_cache['color_pick']
                    text += '\n'

                    if 'website_name' in request.POST:
                        text += request.POST['website_name']
                    elif data_cache.get('background'):
                        text += data_cache['background']
                    text += '\n'

                    if request.POST.get('empty_image_home'):
                        pass
                    elif request.FILES.get('fileBackgroundHome'):
                        if request.FILES['fileBackgroundHome'].content_type.split('/')[0] in ['image', 'video']:
                            file = request.FILES['fileBackgroundHome']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + request.META['HTTP_HOST'].split(':')[0] + '/' + filename
                    elif data_cache.get('background'):
                        text += data_cache['background']
                    text += '\n'

                    if request.POST.get('empty_image_login'):
                        pass
                    elif request.FILES.get('fileBackgroundLogin'):
                        if request.FILES['fileBackgroundLogin'].content_type.split('/')[0] in ['image', 'video']:
                            file = request.FILES['fileBackgroundLogin']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + request.META['HTTP_HOST'].split(':')[0] + '/' + filename
                    elif data_cache.get('bg_login'):
                        text += data_cache['bg_login']
                    text += '\n'

                    if request.POST.get('empty_image_search'):
                        pass
                    elif request.FILES.get('fileBackgroundSearch'):
                        if request.FILES['fileBackgroundSearch'].content_type.split('/')[0] in ['image', 'video']:
                            file = request.FILES['fileBackgroundSearch']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + request.META['HTTP_HOST'].split(':')[0] + '/' + filename
                    elif data_cache.get('bg_search'):
                        text += data_cache['bg_search']
                    text += '\n'

                    text += '\n' ## tawk to yg lama deprecated
                    text += '\n' ## tawk to yg lama deprecated

                    if 'text_pick' in request.POST:
                        text += "#" + request.POST['text_pick']
                    elif data_cache.get('text_color'):
                        text += data_cache['text_color']
                    text += '\n'

                    opacity = 'FF'
                    if 'bg_tab_pick_checkbox' in request.POST:
                        opacity = 'B3'
                    if 'bg_tab_pick' in request.POST and request.POST.get('bg_tab_pick') == '':
                        text += 'none'
                    elif 'bg_tab_pick' in request.POST and request.POST.get('bg_tab_pick') != '':
                        text += "#" + request.POST.get('bg_tab_pick') + opacity
                    elif data_cache.get('tab_color'):
                        text += data_cache['tab_color']
                    text += '\n'

                    if request.POST.get('empty_logo_icon'):
                        pass
                    elif request.FILES.get('filelogoicon'):
                        if request.FILES['filelogoicon'].content_type in ['image/jpeg', 'image/png', 'image/png']:
                            file = request.FILES['filelogoicon']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + request.META['HTTP_HOST'].split(':')[0] + '/' + filename
                    elif data_cache.get('logo_icon'):
                        text += data_cache['logo_icon']
                    text += '\n'

                    if request.POST.get('empty_image_regis'):
                        pass
                    elif request.FILES.get('fileRegistrationBanner'):
                        if request.FILES['fileRegistrationBanner'].content_type.split('/')[0] in ['image', 'video']:
                            file = request.FILES['fileRegistrationBanner']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + request.META['HTTP_HOST'].split(':')[0] + '/' + filename
                    elif data_cache.get('bg_regis'):
                        text += data_cache['bg_regis']
                    text += '\n'

                    text += '\n'
                    text += '\n'

                    if 'backend_url' in request.POST:
                        text += request.POST['backend_url']
                    elif data_cache.get('backend_url'):
                        text += data_cache['backend_url']
                    text += '\n'

                    if 'website_mode' in request.POST:
                        text += request.POST['website_mode']
                    elif data_cache.get('website_mode'):
                        text += data_cache['website_mode']
                    text += '\n'

                    text += '\n'

                    if 'google_analytics' in request.POST:
                        text += request.POST['google_analytics']
                    elif 'google_analytics' in data_cache:
                        text += data_cache['google_analytics']
                    text += '\n'

                    if 'contact_us' in request.POST:
                        text += '<br>'.join(''.join(request.POST['contact_us'].split('\r')).split('\n'))
                    elif data_cache.get('contact_us'):
                        text += data_cache['contact_us']
                    text += '\n'

                    opacity = 'FF'
                    if request.POST.get('tab_login_background_checkbox'):
                        opacity = 'B3'
                    if 'tab_login_background' in request.POST:
                        text += "#" + request.POST['tab_login_background'] + opacity
                    elif data_cache.get('tab_login_background'):
                        text += data_cache['tab_login_background']
                    text += '\n'

                    if 'text_pick_login' in request.POST:
                        text += "#" + request.POST['text_pick_login']
                    elif data_cache.get('text_color_login'):
                        text += data_cache['text_color_login']
                    text += '\n'

                    text += '\n' ## wa chat yg lama deprecated
                    text += '\n' ## wa chat yg lama deprecated

                    if 'google_api_key' in request.POST:
                        text += request.POST['google_api_key']
                    elif 'google_api_key' in data_cache:
                        text += data_cache['google_api_key']
                    text += '\n'

                    if 'setting_login_page' in request.POST:
                        text += request.POST['setting_login_page']
                    elif data_cache.get('setting_login_page'):
                        text += data_cache['setting_login_page']
                    text += '\n'

                    if 'tour_search_template' in request.POST:
                        text += request.POST['tour_search_template']
                    elif data_cache.get('tour_search_template'):
                        text += data_cache['tour_search_template']
                    text += '\n'

                    ### KALAU ADA CACHE BARU MAU MASUK DATA CACHE TEMPLATE TAMBAH DI ATAS SINI ###

                    if request.session.get('username'): ## LAST UPDATE USER
                        text += request.session['username']
                    text += '\n'

                    write_cache(text, "data_cache_template", request, 'cache_web')
                    temp = text.split('\n')
                    for idx, rec in enumerate(temp):
                        try:
                            temp[idx] = rec.split('/')[len(rec.split('/'))-1]
                        except:
                            pass
                    #delete file ga pake
                    for file in os.listdir(fs.location):
                        if not file in temp and file not in ['image_dynamic', 'image_payment_partner', 'image_about_us', 'live_chat']:
                            os.remove(fs.location+'/'+file)

                    # file cache origin destination
                    file = read_cache("data_cache_product", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        for idx, line in enumerate(file.split('\n')):
                            if idx == 0:
                                data_cache['airline_origin'] = line.split('\n')[0]
                            elif idx == 1:
                                data_cache['airline_destination'] = line.split('\n')[0]
                            elif idx == 2:
                                data_cache['train_origin'] = line.split('\n')[0]
                            elif idx == 3:
                                data_cache['train_destination'] = line.split('\n')[0]
                    text = ''
                    if 'airline_origin' in request.POST:
                        text += request.POST['airline_origin']
                    elif data_cache.get('airline_origin'):
                        text += data_cache['airline_origin']
                    text += '\n'
                    if 'airline_destination' in request.POST:
                        text += request.POST['airline_destination']
                    elif data_cache.get('airline_destination'):
                        text += data_cache['airline_destination']
                    text += '\n'
                    if 'train_origin' in request.POST:
                        text += request.POST['train_origin']
                    elif data_cache.get('train_origin'):
                        text += data_cache['train_origin']
                    text += '\n'
                    if 'train_destination' in request.POST:
                        text += request.POST['train_destination']
                    elif data_cache.get('train_destination'):
                        text += data_cache['train_destination']
                    text += '\n'
                    write_cache(text, "data_cache_product", request, 'cache_web')

                    ## FITUR TIDAK DAPAT DI PAKAI KARENA PINDAH OAUTH2
                    # text = ''
                    # text += request.POST.get('api_key_youtube') + '\n' or '' + '\n'
                    # text += request.POST.get('channel_id_youtube') or ''
                    # write_cache_with_folder(text, "youtube")
                    ##

                    ## LIVE CHAT
                    path = var_log_path(request, 'live_chat')
                    if not os.path.exists(path):
                        os.mkdir(path)
                    fs_live_chat = FileSystemStorage()
                    fs_live_chat.location += media_path(request, fs_live_chat.location, 'live_chat')

                    live_chat_total_number = int(request.POST.get('number_of_live_chat', 0))
                    if live_chat_total_number != 0:
                        live_chat_total_number += 1
                    data = os.listdir(path)

                    ## hapus data yg sudah ada
                    for rec in data:
                        os.remove('%s/%s' % (path, rec))

                    ## add data baru
                    for i in range(1,live_chat_total_number):
                        try:
                            filename = ''
                            try:
                                if request.FILES['live_chat_image'+str(i)].content_type in ['image/jpeg', 'image/png']:
                                    file = request.FILES['live_chat_image'+str(i)]
                                    filename = fs_live_chat.save(file.name, file)
                                    filename = fs_live_chat.base_url + request.META['HTTP_HOST'].split(':')[0] + "/live_chat/" + filename
                            except Exception as e:
                                _logger.error('no image dynamic page')

                            if filename == '':
                                is_default_icon = request.POST.get('is_vendor_whatsapp_icon'+str(i), 'off')
                                if is_default_icon == 'on' or request.POST.get('live_chat_image_str' + str(i)) == '':
                                    filename = 'default'
                                else:
                                    filename = request.POST.get('live_chat_image_str' + str(i))

                            text = ''
                            is_vendor_whatsapp = request.POST.get('is_vendor_whatsapp'+str(i), 'off')
                            if is_vendor_whatsapp == 'off':
                                text += request.POST.get('live_chat_vendor'+str(i)) + '\n' or '' + '\n'
                            else:
                                text += 'Whatsapp\n'
                            text += request.POST.get('live_chat_visible'+str(i)) + '\n' or '' + '\n'
                            if is_vendor_whatsapp == 'on':
                                text += request.POST.get('live_chat_number'+str(i)) + '\n' or '' + '\n'
                            else:
                                text += '\n'
                            text += filename + '\n'
                            if request.POST.get('live_chat_vendor'+str(i)) not in ['', 'Whatsapp']:
                                text += request.POST.get('live_chat_embed_code'+str(i)).replace('\n', '####')
                            else:
                                text += '\n'
                            write_cache(text, "live_chat_%s" % str(i), request, 'live_chat')
                        except Exception as e:
                            _logger.error('%s, %s' % (str(e), traceback.format_exc()))

                    ## ONESIGNAL
                    file = read_cache("one_signal", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        for idx, line in enumerate(file.split('\n')):
                            if idx == 0:
                                data_cache['app_id_one_signal'] = line.split('\n')[0]
                            elif idx == 1:
                                data_cache['url_one_signal'] = line.split('\n')[0]
                            elif idx == 2:
                                data_cache['authorization_one_signal'] = line.split('\n')[0]
                    text = ''
                    if 'app_id_one_signal' in request.POST:
                        text += request.POST.get('app_id_one_signal')
                    elif data_cache.get('app_id_one_signal'):
                        text += data_cache['app_id_one_signal']
                    text += '\n'

                    if 'url_one_signal' in request.POST:
                        text += request.POST.get('url_one_signal')
                    elif data_cache.get('url_one_signal'):
                        text += data_cache['url_one_signal']
                    text += '\n'

                    if 'authorization_one_signal' in request.POST:
                        text += request.POST.get('authorization_one_signal')
                    elif data_cache.get('authorization_one_signal'):
                        text += data_cache['authorization_one_signal']
                    text += '\n'
                    write_cache(text, "one_signal", request, 'cache_web')

                    ## TOPUP TERM
                    file = read_cache("top_up_term", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        data_cache['top_up_term'] = file
                    text = ''
                    if 'top_up_term' in request.POST:
                        text += request.POST.get('top_up_term')
                    elif data_cache.get('top_up_term'):
                        text += data_cache['top_up_term']
                    write_cache(text, "top_up_term", request, 'cache_web')

                    ## DELETE CACHE
                    file = read_cache("delete_cache_user", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        data_cache['delete_cache_user'] = file
                    text = ''
                    if 'delete_cache_user' in request.POST:
                        text += request.POST.get('delete_cache_user')
                    elif data_cache.get('delete_cache_user'):
                        text += data_cache['delete_cache_user']
                    write_cache(text, "delete_cache_user", request, 'cache_web')

                    ## GOOGLE MAPS & RECAPTCHA
                    file = read_cache("google_recaptcha", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        for idx, line in enumerate(file.split('\n')):
                            if idx == 0:
                                data_cache['google_recaptcha'] = line.split('\n')[0]
                            elif idx == 1:
                                data_cache['site_key'] = line.split('\n')[0]
                            elif idx == 2:
                                data_cache['secret_key'] = line.split('\n')[0]
                    text = ''
                    if 'google_recaptcha' in request.POST:
                        text += request.POST.get('google_recaptcha')
                    elif data_cache.get('google_recaptcha'):
                        text += data_cache['google_recaptcha']
                    text += '\n'
                    if 'site_key' in request.POST:
                        text += request.POST.get('site_key')
                    elif data_cache.get('site_key'):
                        text += data_cache['site_key']
                    text += '\n'
                    if 'secret_key' in request.POST:
                        text += request.POST.get('secret_key')
                    elif data_cache.get('secret_key'):
                        text += data_cache['secret_key']
                    text += '\n'
                    write_cache(text, "google_recaptcha", request, 'cache_web')

                    ## GOOGLE TAG
                    file = read_cache("google_tag_manager", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        data_cache['google_tag_manager_key'] = file
                    text = ''
                    if request.POST.get('google_tag_manager_key'):
                        text += request.POST.get('google_tag_manager_key')
                    elif data_cache.get('google_tag_manager_key'):
                        text += data_cache['google_tag_manager_key']
                    text += '\n'
                    write_cache(text, "google_tag_manager", request, 'cache_web')

                    ## CRED B2C ##
                    # text = ''
                    # if request.POST.get('signup_btb_text'):
                    #     text += request.POST.get('signup_btb_text')
                    # text += '\n'
                    # if request.POST.get('signup_btb_btn'):
                    #     text += request.POST.get('signup_btb_btn')
                    # text += '\n'
                    # write_cache(text, "signup_b2b", request, 'cache_web')

                    ## FONT
                    file = read_cache("font", 'cache_web', request, 90911)
                    data_cache = {}
                    if file:
                        data_cache['font'] = file
                    text = {}
                    if 'font' in request.POST:
                        text.update({
                            'name': request.POST.get('font').split('.')[0],
                            'font': request.POST.get('font'),
                        })
                    elif data_cache.get('font'):
                        text = data_cache['font']
                    if text != {}:
                        write_cache(text, "font", request, 'cache_web')

                    ## PROVIDER TYPE SEQUENCE
                    text = {}
                    provider = copy.deepcopy(request.session.get('provider'))
                    if 'health_care' not in provider:
                        provider.append('health_care')
                    for idx, data in enumerate(request.session.get('provider'), start=1):
                        try:
                            text[request.POST['product_name'+str(idx)]] = {
                                "sequence": request.POST['product_sequence'+str(idx)],
                                "display": request.POST['product_display_name'+str(idx)],
                            }
                        except Exception as e:
                            pass
                    if len(text) > 0:
                        write_cache(text, "provider_types_sequence", request, 'cache_web')

            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')

        javascript_version = get_javascript_version(request)
        # get font
        fs = FileSystemStorage()
        directory = fs.location.split('/')
        directory.pop()
        directory = '/'.join(directory)
        directory += '/tt_website/static/tt_website/custom_font/'
        data_font = []
        for font in os.listdir(directory):
            data_font.append({
                'name': font.split('.')[0],
                'font': font
            })
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)
        values = get_data_template(request,'admin')
        values.update(get_credential(request, 'dict'))
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'bg_tab_color': copy.deepcopy(values['tab_color'])[:7],
                'bg_login_background_color': copy.deepcopy(values['login_background_color'])[:7],
                'checkbox_tab_color': copy.deepcopy(values['tab_color'])[7:],
                'checkbox_login_background_color': copy.deepcopy(values['login_background_color'])[7:],

                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'data_font': data_font
            })
            values.update(get_airline_advance_pax_type(request))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/admin_templates.html', values)
    else:
        return no_session_logout(request)

def setting_footer_printout(request):
    if 'user_account' in request.session._session and 'agent_setting_printout' in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
            if file:
                airline_carriers = file
            else:
                airline_carriers = {}
            values = get_data_template(request)

            new_airline_carriers = {}
            for key, value in airline_carriers.items():
                new_airline_carriers[key] = value

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'airline_carriers': new_airline_carriers,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/printout_footer_templates.html', values)
    else:
        return no_session_logout(request)

def history_transaction_ledger(request):
    default_user, default_password = get_credential_user_default(request)
    if 'user_account' in request.session._session and request.session['user_account']['co_user_login'] != default_user:
        try:
            javascript_version = get_javascript_version(request)
            values = get_data_template(request)
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/history_transaction_templates.html', values)
    else:
        return no_session_logout(request)

def reservation(request):
    default_user, default_password = get_credential_user_default(request)
    if 'user_account' in request.session._session and request.session['user_account']['co_user_login'] != default_user:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
            if file:
                airline_carriers = file
            else:
                airline_carriers = {}
            values = get_data_template(request)

            new_airline_carriers = {}
            for key, value in airline_carriers.items():
                new_airline_carriers[key] = value

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'airline_carriers': new_airline_carriers,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/reservation_templates.html', values)
    else:
        return no_session_logout(request)

def reservation_request(request):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/backend/reservation_request_templates.html', values)

def create_passenger_request(request, signature):
    try:
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)
        values = get_data_template(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': {},
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': signature,
            'countries': airline_country,
            'phone_code': phone_code,
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/create_passenger_agent_templates.html', values)

def create_cor_request(request, signature):
    try:
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)
        values = get_data_template(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': {},
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': signature,
            'countries': airline_country,
            'phone_code': phone_code,
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/create_cor_agent_templates.html', values)

def get_reservation_request(request, request_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)

        try:
            conv_req_num = base64.b64decode(request_number).decode('ascii')
        except:
            conv_req_num = request_number

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'request_number': conv_req_num,
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/backend/get_reservation_request_templates.html', values)

def live(request, data):
    try:
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
        if file:
            airline_carriers = file
        else:
            airline_carriers = {}
        values = get_data_template(request)

        new_airline_carriers = {}
        for key, value in airline_carriers.items():
            new_airline_carriers[key] = value

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_carriers': new_airline_carriers,
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'phone_code': phone_code,
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'embed_id': data
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/live_embed.html', values)

def mobile_live(request, data):
    try:
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
        if file:
            airline_carriers = file
        else:
            airline_carriers = {}
        values = get_data_template(request)

        new_airline_carriers = {}
        for key, value in airline_carriers.items():
            new_airline_carriers[key] = value

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_carriers': new_airline_carriers,
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'phone_code': phone_code,
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': {},
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': request.session.get('signature') or '',
            'embed_id': data
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/live_embed_mobile.html', values)

def highlight_setting(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
            if file:
                airline_carriers = file

            values = get_data_template(request)

            new_airline_carriers = {}
            for key, value in airline_carriers.items():
                new_airline_carriers[key] = value

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'airline_carriers': new_airline_carriers,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/highlight_templates.html', values)
    else:
        return no_session_logout(request)

def top_up(request):
    if 'user_account' in request.session._session and 'b2c_limitation' not in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/top_up_templates.html', values)
    else:
        return no_session_logout(request)

def payment(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            signature = request.POST['signature']
            passengers = json.loads(request.POST['passengers'])
            for pax_type in passengers:
                if isinstance(passengers[pax_type], list):
                    for pax in passengers[pax_type]:
                        if pax.get('behaviors'):
                            pax.pop('behaviors')
            provider = request.POST['provider']
            discount_voucher = json.loads(request.POST['discount'])
            voucher_code = request.POST['voucher_code']
            type = request.POST['type'] #tipe airline_review
            values = get_data_template(request)
            try:
                payment = request.POST['payment']
            except:
                payment = {}
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'signature': signature,
                'passengers': passengers,
                'order_number': request.POST['order_number'] or '',
                'provider_payment': provider,
                'type': type,
                'payment': payment,
                'time_limit': request.POST['session_time_input'],
                'discount_voucher': discount_voucher,
                'voucher_code': voucher_code,
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/payment_force_issued.html', values)
    else:
        return no_session_logout(request)

def top_up_history(request):
    if 'user_account' in request.session._session and 'b2c_limitation' not in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/top_up_history_templates.html', values)
    else:
        return no_session_logout(request)

def get_javascript_version(request):
    javascript_version = 0
    try:
        file = read_cache("javascript_version", 'cache_web', request, 90911, True)
        if file:
            javascript_version = int(file)
        else:
            javascript_version = 1
            try:
                file = open("/var/log/django/global/file_cache/cache_web/javascript_version.txt", "r")
                data = file.read()
                file.close()
                if data:
                    javascript_version += int(data)
            except Exception as e:
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            write_cache(javascript_version, 'javascript_version', request, 'cache_web', True)
    except Exception as e:
        _logger.error('ERROR javascript_version file\n' + str(e) + '\n' + traceback.format_exc())
    return javascript_version

def get_cache_data(request):
    try:
        file = read_cache("version", 'cache_web', request, 90911)
        if file:
            response = file
        else:
            response = {}
    except Exception as e:
        response = {}
        _logger.error('ERROR version cache file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def get_web_mode(request):
    file = read_cache("data_cache_template", 'cache_web', request, 90911)
    web_mode = 'btb'
    if file:
        file = file.split('\n')
        web_mode = file[16]

    return web_mode

def get_ip_address(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    _logger.info('User:%s IP:%s' % (request.session['user_account']['user_login'] if request.session.get('user_account') else '', ip))

def get_data_template(request, type='home', provider_type = []):
    get_ip_address(request)
    path = var_log_path(request, 'live_chat')
    if not os.path.exists(path):
        os.mkdir(path)
    template = 1
    logo = '/static/tt_website/images/logo/default/orbis_logo.png'
    logo_icon = '/static/tt_website/images/logo/default/orbis_title.png'
    if type == 'registration':
        background = '/static/tt_website/images/background/default/def_bg_home.jpg'
    else:
        background = '/static/tt_website/images/background/default/def_bg_home.jpg'
    color = '#205B95'
    airline_country = []
    phone_code = []
    website_name = 'Orbis'
    tour_search_template = 'default_search'
    # tawk_chat = 0
    # wa_chat = 0
    # wa_number = ''
    # tawk_code = ''
    website_mode = 'btb'
    tab_color = '#333333'
    text_color = '#FFFFFF'
    text_color_login = '#333333'
    espay_api_key = ''
    espay_api_key_callback_url = ''
    backend_url = ''
    script_espay = ''
    contact_us = ''
    bg_login = '/static/tt_website/images/background/default/def_bg_home.jpg'
    bg_search = '/static/tt_website/images/background/default/def_bg_home.jpg'
    bg_regis = '/static/tt_website/images/background/default/def_bg_registration.jpg'
    google_analytics = ''
    login_background_color = '#FFFFFF'
    airline_origin = ''
    airline_destination = ''
    train_origin = ''
    train_destination = ''
    google_recaptcha = 0
    site_key = ''
    secret_key = ''
    printout_color = '#FF0000'
    api_key_youtube = ''
    channel_id_youtube = ''
    google_api_key = ''
    app_id_one_signal = ''
    url_one_signal = ''
    authorization_one_signal = ''
    signup_btb_text = 'Want to join us as an agent?'
    signup_btb_btn = 'Sign Up Agent Here'
    setting_login_page = 'website_name'
    google_tag_manager_key = ''
    get_frequent_flyer = []
    font = {
        "name": '',
        "font": ''
    }
    ## live chat
    live_chat = []
    live_chat_vendor = ''
    live_chat_visible = 0
    live_chat_number = ''
    live_chat_embed_code = ''
    default_user = ''
    default_password = ''
    is_show_breakdown_price = False
    keep_me_signin = False
    currency = []
    currency_pick = ''
    delete_cache_user = '2'
    if request.session.get('signature') and request.session.get('user_account'):
        currency = get_ho_currency_api(request, request.session['signature'])
        currency_pick = currency.get('default_currency')
    ## live chat
    if request.session.get('keep_me_signin'):
        keep_me_signin = request.session['keep_me_signin']
    top_up_term = ''

    if request.session.get('currency'):
        currency_pick = request.session['currency']

    file = read_cache("data_cache_product", 'cache_web', request, 90911)
    if file:
        for idx, line in enumerate(file.split('\n')):
            if idx == 0 and line != '':
                airline_origin = line
            elif idx == 1 and line != '':
                airline_destination = line
            elif idx == 2 and line != '':
                train_origin = line
            elif idx == 3 and line != '':
                train_destination = line
    ## FITUR TIDAK DAPAT DI PAKAI KARENA PINDAH OAUTH2
    # file = read_cache("youtube", 'cache_web', 90911)
    # if file:
    #     for idx, line in enumerate(file.split('\n')):
    #         if idx == 0 and line != '':
    #             api_key_youtube = line
    #         elif idx == 1 and line != '':
    #             channel_id_youtube = line
    ##

    # printout color
    file = read_cache("color_printout", 'cache_web', request, 90911)
    if file:
        printout_color = file

    # one signal
    file = read_cache("one_signal", 'cache_web', request, 90911)
    if file:
        for idx, line in enumerate(file.split('\n')):
            if idx == 0 and line != '':
                app_id_one_signal = line
            elif idx == 1 and line != '':
                url_one_signal = line
            elif idx == 2 and line != '':
                authorization_one_signal = line

    # signup b2b
    file = read_cache("signup_b2b", 'cache_web', request, 90911)
    if file:
        for idx, line in enumerate(file.split('\n')):
            if idx == 0 and line != '':
                signup_btb_text = line
            elif idx == 1 and line != '':
                signup_btb_btn = line

    # google re-captcha
    file = read_cache("google_recaptcha", 'cache_web', request, 90911)
    if file:
        for idx, line in enumerate(file.split('\n')):
            if idx == 0 and line != '':
                google_recaptcha = line
            elif idx == 1 and line != '':
                site_key = line
            elif idx == 2 and line != '':
                secret_key = line

    ##google tag manager
    file = read_cache("google_tag_manager", 'cache_web', request, 90911)
    if file:
        for idx, line in enumerate(file.split('\n')):
            if line != '':
                google_tag_manager_key = line

    # font
    file = read_cache("font", 'cache_web', request, 90911)
    if file:
        font = file

    file = read_cache("top_up_term", 'cache_web', request, 90911)
    if file:
        top_up_term = file
    try:
        if type != 'login':
            is_session_expiry_need_to_update = False
            if request.session.get('signin_date'):
                if datetime.now().timestamp() > request.session['signin_date'] + 36000: ## sudah 1 jam update expiry
                    is_session_expiry_need_to_update = True
            else:
                set_session(request, 'signin_date', datetime.now().timestamp())
                is_session_expiry_need_to_update = True

            if is_session_expiry_need_to_update:
                request.session.set_expiry(3 * 60 * 60) # jam detik menit
                request.session.modified = True
        response = get_cache_data(request)
        phone_code = []
        try:
            airline_country = response['result']['response']['airline']['country']
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
        except:
            _logger.error('no cache')
        phone_code = sorted(phone_code)
        if len(provider_type) != 0:
            provider_type = provider_type
            provider_types_sequence = provider_type
        else:
            try:
                provider_type = request.session.get('provider') and request.session.get('provider') or []
                provider_types_sequence = provider_type
                if 'health_care' not in provider_types_sequence:
                    provider_types_sequence.append('health_care')
            except:
                provider_type = []
                provider_types_sequence = []

        # data awal provider_type_sequence
        temp_provider_types_sequence = []
        sequence = {}
        provider_start = 1
        for rec in provider_type:
            if rec != 'offline' and rec != 'bank' and rec != 'issued_offline' and rec != 'payment':
                sequence[rec] = provider_start
                provider_start += 1
        for idx, rec in enumerate(sequence, start=1):
            temp_provider_types_sequence.append({
                'code': rec,
                'name': "%s%s" % (rec[0].upper(), rec[1:].replace('_',' ')),
                'sequence': sequence.get(rec) or idx
            })
        #kalau tidak ada provider health_care buat frontend
        if not any(temporary['code'] == 'health_care' for temporary in temp_provider_types_sequence):
            temp_provider_types_sequence.append({
                'code': 'health_care',
                'name': 'Health Care',
                'sequence': ''
            })
        provider_types_sequence = temp_provider_types_sequence

        file = read_cache("provider_types_sequence", 'cache_web', request, 90911)
        if file:
            provider_types_sequence_file = file
            for rec in provider_types_sequence:
                try:
                    rec['sequence'] = provider_types_sequence_file.get(rec['code'], '')['sequence']
                    rec['display'] = provider_types_sequence_file.get(rec['code'], '')['display']
                except:
                    try:
                        rec['sequence'] = provider_types_sequence_file.get(rec['code'], '')
                        rec['display'] = ''
                    except:
                        pass

        #check sequence
        last_sequence = 0
        empty_sequence = False
        try:
            for provider_obj in provider_types_sequence:
                try:
                    if provider_obj['sequence'] == '':
                        empty_sequence = True
                    elif isinstance(int(provider_obj['sequence']), int) and last_sequence < int(provider_obj['sequence']): #check isi int atau tidak
                        last_sequence = int(provider_obj['sequence'])
                except:
                    provider_obj['sequence'] = ''
                    empty_sequence = True
            if empty_sequence:
                for provider_obj in provider_types_sequence:
                    if provider_obj['sequence'] == '':
                        last_sequence += 1
                        provider_obj['sequence'] = str(last_sequence)

            provider_types_sequence = sorted(provider_types_sequence, key=lambda k: int(k['sequence']))
        except Exception as e:
            _logger.error("%s, %s" % (str(e), traceback.format_exc()))
        try:
            get_frequent_flyer = get_frequent_flyer_all_data({}, request.session.get('signature', ''))
        except Exception as e:
            _logger.error("%s, %s" % (str(e), traceback.format_exc()))

        path = var_log_path(request, 'live_chat')
        data = os.listdir(path)
        for index, rec in enumerate(data):
            file = read_cache(rec[:-4], 'live_chat', request, 90911)
            live_chat_vendor = ''
            live_chat_visible = ''
            live_chat_number = ''
            live_chat_image = ''
            live_chat_embed_code = ''
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 0:
                        if line != '':
                            live_chat_vendor = line.split('\n')[0]
                    elif idx == 1:
                        if line != '':
                            live_chat_visible = line.split('\n')[0]
                    elif idx == 2:
                        if line != '':
                            live_chat_number = line.split('\n')[0]
                    elif idx == 3:
                        if line != '':
                            live_chat_image = line.split('\n')[0]
                    elif idx == 4:
                        if line != '':
                            live_chat_embed_code = line.split('\n')[0].replace('####','\n')
                live_chat.append({
                    "live_chat_vendor": live_chat_vendor,
                    "live_chat_visible": live_chat_visible,
                    "live_chat_number": live_chat_number,
                    "live_chat_image": live_chat_image,
                    "live_chat_embed_code": live_chat_embed_code,
                    "sequence": index,
                })

        default_user, default_password = get_credential_user_default(request)

        file = read_cache("show_breakdown_price", 'cache_web', request, 90911)
        if file:
            is_show_breakdown_price = file

        file = read_cache("delete_cache_user", 'cache_web', request, 90911)
        if file:
            delete_cache_user = file

        file = read_cache("data_cache_template", 'cache_web', request, 90911)
        if file:
            for idx, line in enumerate(file.split('\n')):
                if idx == 0:
                    if line != '':
                        logo = line.split('\n')[0]
                elif idx == 1:
                    if line != '':
                        template = int(line)
                elif idx == 2:
                    if line != '':
                        color = line.split('\n')[0]
                elif idx == 3:
                    if line != '':
                        website_name = line.split('\n')[0]
                elif idx == 4 and type == 'home' or type == 'admin' and idx == 4:
                    if line != '':
                        background = line.split('\n')[0]
                elif idx == 5 and type == 'login' or type == 'admin' and idx == 5:
                    if line != '':
                        if type == 'admin':
                            bg_login = line.split('\n')[0]
                        else:
                            background = line.split('\n')[0]
                elif idx == 6 and type == 'search' or type == 'admin' and idx == 6:
                    if line != '':
                        if type == 'admin':
                            bg_search = line.split('\n')[0]
                        else:
                            background = line.split('\n')[0]
                elif idx == 7:
                    pass
                    # if line != '':
                    #     tawk_chat = int(line)
                elif idx == 8:
                    pass
                    # if line != '':
                    #     tawk_code = line.split('\n')[0]
                elif idx == 9:
                    if line != '':
                        text_color = line.split('\n')[0]
                elif idx == 10:
                    if line != '':
                        if line.split('\n')[0] == 'none':
                            tab_color = 'transparent'
                        else:
                            tab_color = line.split('\n')[0]
                elif idx == 11:
                    if line != '':
                        logo_icon = line.split('\n')[0]
                elif idx == 12 and type == 'registration' or type == 'admin' and idx == 12:
                    if line != '':
                        if type == 'admin':
                            bg_regis = line.split('\n')[0]
                        else:
                            background = line.split('\n')[0]
                    else:
                        if type == 'admin':
                            bg_regis = '/static/tt_website/images/background/default/def_bg_registration.jpg'
                        else:
                            background = '/static/tt_website/images/background/default/def_bg_registration.jpg'
                elif idx == 13:
                    if line != '':
                        espay_api_key = line.split('\n')[0]
                elif idx == 14:
                    if line != '':
                        espay_api_key_callback_url = line.split('\n')[0]
                elif idx == 15:
                    if line != '':
                        backend_url = line.split('\n')[0]
                elif idx == 16:
                    if line != '':
                        website_mode = line.split('\n')[0]
                elif idx == 17:
                    if line != '':
                        script_espay = line.split('\n')[0]
                elif idx == 18:
                    if line != '':
                        google_analytics = line.split('\n')[0]
                elif idx == 19:
                    if line.split('<br>')[len(line.split('<br>'))-1] == '\n':
                        contact_us = '\n'.join(line.split('<br>')[:-1])
                    else:
                        contact_us = '\n'.join(line.split('<br>'))
                elif idx == 20:
                    if line != '':
                        if line.split('\n')[0] == 'none':
                            if type != 'login':
                                login_background_color = 'transparent'
                            else:
                                tab_color = 'transparent'
                                login_background_color = 'transparent'
                        else:
                            if type != 'login':
                                login_background_color = line.split('\n')[0]
                            else:
                                tab_color = line.split('\n')[0]
                                login_background_color = line.split('\n')[0]
                elif idx == 21:
                    if line != '':
                        text_color_login = line.split('\n')[0]
                elif idx == 22:
                    pass
                    # if line != '':
                    #     wa_chat = int(line.split('\n')[0])
                elif idx == 23:
                    pass
                    # if line != '':
                    #     wa_number = line.split('\n')[0]
                elif idx == 24:
                    if line != '':
                        google_api_key = line.split('\n')[0]
                elif idx == 25:
                    if line != '':
                        setting_login_page = line.split('\n')[0]
                elif idx == 26:
                    if line != '':
                        tour_search_template = line.split('\n')[0]
            if color == '':
                color = '#205B95'
            if len(background.split('\n')) > 1:
                background = background.split('\n')[0]
    except Exception as e:
        _logger.error('ERROR GET CACHE TEMPLATE DJANGO RUN USING DEFAULT\n' + str(e) + '\n' + traceback.format_exc())
    if not top_up_term:
        top_up_term = '''
        <h6>BANK TRANSFER / CASH</h6>
        <li>1. Before you click SUBMIT, please make sure you have inputted the correct amount of TOP UP. If there is a mismatch data, such as the transferred amount/bank account is different from the requested amount/bank account, so the TOP UP will be approved by tomorrow (D+1).<br></li>
        <li>2. Bank Transfer / CASH TOP UP can be used on Monday-Sunday: 8 AM - 8 PM (GMT +7)<br></li>
        <li>3. Bank Transfer (BCA or Mandiri) auto validate in 15 minutes<br></li>
        <h6>National Holiday included</h6>
        <h6>For CASH you have to send money to %s</h6><br>
        <h6>VIRTUAL ACCOUNT</h6>
    
        <li>1. Top Up Transaction from ATM / LLG open for 24 hours. Balance will be added automatically (REAL TIME) after payment. Top up fee will be charged to user and if there's other charge for LLG it will be charged to user too. LLG will be added ± 2 hours from payment.<br><br></li>
        <h6>MANDIRI INTERNET BANKING</h6>
        <li>1. Transaction Top up from internet banking mandiri open for 24 hours. Balance will be added automatically (REAL TIME) after payment with additional admin Top Up.<br><br></li>
            ''' % website_name

    return {
        'logo': logo,
        'website_mode': website_mode,
        'logo_icon': logo_icon,
        'template': template,
        'tour_search_template': tour_search_template,
        'color': color,
        'name': website_name,
        'background': background,
        # 'tawk_chat': tawk_chat,
        # 'tawk_code': tawk_code,
        'text_color': text_color,
        'text_color_login': text_color_login,
        'tab_color': tab_color,
        'update_data': '',
        'espay_api_key': espay_api_key,
        'espay_api_key_callback_url': espay_api_key_callback_url,
        'backend_url': backend_url,
        'espay_script': script_espay,
        'countries': airline_country,
        'phone_code': phone_code,
        'provider': provider_type,
        'provider_types': provider_type,
        'provider_divider_start': math.ceil(len(provider_type) / 2) + 1,
        'provider_divider_end': math.ceil(len(provider_type) / 2),
        'contact_us': contact_us.split('\n'),
        'bg_login': bg_login,
        'bg_search': bg_search,
        'bg_regis': bg_regis,
        'google_analytics': google_analytics,
        'login_background_color': login_background_color,
        'airline_origin': airline_origin,
        'airline_destination': airline_destination,
        'train_origin': train_origin,
        'train_destination': train_destination,
        'top_up_term': top_up_term,
        'google_recaptcha': google_recaptcha,
        'site_key': site_key,
        'secret_key': secret_key,
        # 'wa_chat': wa_chat,
        # 'wa_number': wa_number,
        'printout_color': printout_color,
        'provider_types_sequence': provider_types_sequence,
        'font': font,
        'api_key_youtube': api_key_youtube,
        'channel_id_youtube': channel_id_youtube,
        'google_api_key': google_api_key,
        'app_id_one_signal': app_id_one_signal,
        'url_one_signal': url_one_signal,
        'authorization_one_signal': authorization_one_signal,
        'type_page': type,
        'setting_login_page': setting_login_page,
        'signup_btb_text': signup_btb_text,
        'signup_btb_btn': signup_btb_btn,
        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
        'google_tag_manager_key': google_tag_manager_key,
        'get_frequent_flyer': get_frequent_flyer,
        # 'live_chat_vendor': live_chat_vendor,
        # 'live_chat_visible': live_chat_visible,
        # 'live_chat_number': live_chat_number,
        # 'live_chat_embed_code': live_chat_embed_code,
        'live_chat': live_chat,
        'default_user': default_user,
        'default_password': default_password,
        'is_show_breakdown_price': is_show_breakdown_price,
        'keep_me_signin': keep_me_signin,
        'currency': currency,
        'currency_pick': currency_pick,
        'delete_cache_user': delete_cache_user,
        'is_show_other_currency': True if len(currency) > 0 else False
    }

def tutorial_re_order_phc(request):
    data = []
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'data': data,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/guide/guide_re_order_phc.html', values)
    else:
        return no_session_logout(request)

def tutorial(request):
    data = []
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'data': data,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/guide/guide.html', values)
    else:
        return no_session_logout(request)

def contact_us(request):
    data = []
    try:
        file = read_cache("contact_data", 'cache_web', request, 90911)
        if file:
            for line in file.split('\n'):
                if line != '\n':
                    data.append(line.split('~'))
    except:
        pass
    # values = {
    #     'data': data
    # }
    # return render(request, MODEL_NAME+'/html_page/contact_us.html', values)

    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'data': data,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/html_page/contact_us.html', values)
    else:
        return no_session_logout(request)

def faq(request):
    data = []
    try:
        file = read_cache("faq_data", 'cache_web', request, 90911)
        if file:
            for line in file.split('\n'):
                if line != '\n':
                    data.append(line.split('~'))
    except:
        pass
    # values = {
    #     'data': data
    # }
    # return render(request, MODEL_NAME+'/html_page/contact_us.html', values)

    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'data': data,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/html_page/faq.html', values)
    else:
        return no_session_logout(request)

def about_us(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/html_page/about_us.html', values)
    else:
        return no_session_logout(request)

def terms_and_condition(request):
    javascript_version = get_javascript_version(request)
    values = get_data_template(request, 'login')
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
    })
    return render(request, MODEL_NAME + '/html_page/terms.html', values)

def privacy_policy(request):
    javascript_version = get_javascript_version(request)
    values = get_data_template(request, 'login')
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
    })
    return render(request, MODEL_NAME + '/html_page/policy.html', values)

def error_credential(request):
    values = get_data_template(request, 'login')
    javascript_version = get_javascript_version(request)
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
    })
    return render(request, MODEL_NAME + '/error/409.html', values)

def error_timeout(request):
    values = get_data_template(request, 'login')
    javascript_version = get_javascript_version(request)
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
    })
    return render(request, MODEL_NAME + '/error/408.html', values)

# @api_view(['GET'])
# def testing(request):
#     return Response(_dest_env.test())
#
#
# @api_view(['GET'])
# @permission_classes((IsAuthenticated, ))
# def testing2(request):
#     return Response(_dest_env.test_2())
