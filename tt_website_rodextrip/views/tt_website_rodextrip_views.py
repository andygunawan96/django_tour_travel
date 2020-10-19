from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tt_webservice.views.tt_webservice_agent_views import *
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
_logger = logging.getLogger("rodextrip_logger")

MODEL_NAME = 'tt_website_rodextrip'
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
    'VT': 'event'
}

# Create your views here.
def index(request):
    try:
        values = get_data_template(request)
        if not request.session.get('user_account') and values['website_mode'] == 'btc' or not request.session.get('user_account') and values['website_mode'] == 'btc_btb':
            provider = signin_btc(request)
            values = get_data_template(request, provider['result']['response']['provider'])
        elif request.session.get('user_account').get('co_user_login') == user_default and values['website_mode'] == 'btb':
            for key in reversed(list(request.session._session.keys())):
                if key != '_language':
                    del request.session[key]
            request.session.modified = True
            return no_session_logout(request)
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        if request.POST.get('logout'):
            if request.session._session:
                for key in reversed(list(request.session._session.keys())):
                    if key != '_language':
                        del request.session[key]
                request.session.modified = True
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
            })
        else:
            try:
                if 'login' not in request.session['user_account']['co_agent_frontend_security']:
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                        'countries': airline_country,
                        'phone_code': phone_code,
                        'static_path_url_server': get_url_static_path(),
                        'javascript_version': javascript_version,
                    })
                elif bool(request.session._session):
                    #get_data_awal
                    try:
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
                        try:
                            activity_locations = response['result']['response']['activity']['locations']
                        except Exception as e:
                            activity_locations = []
                            _logger.error(str(e) + '\n' + traceback.format_exc())
                        # activity

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

                        #get_data_awal
                        cache = {}
                        try:
                            cache['airline'] = {
                                    'origin': request.session['airline_request']['origin'][0],
                                    'destination': request.session['airline_request']['destination'][0],
                                    'departure': request.session['airline_request']['departure'][0],
                                }
                            if cache['airline']['departure'] == 'Invalid date':
                                cache['airline']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
                        except:
                            pass

                        try:
                            cache['train'] = {
                                    'origin': request.session['train_request']['origin'][0],
                                    'destination': request.session['train_request']['destination'][0],
                                    'departure': request.session['train_request']['departure'][0],
                                }
                            if cache['train']['departure'] == 'Invalid date':
                                cache['train']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
                        except:
                            pass

                        try:
                            cache['hotel'] = {
                                    'checkin': request.session['hotel_request']['checkin_date'],
                                    'checkout': request.session['hotel_request']['checkout_date']
                                }
                            if cache['hotel']['checkin'] == 'Invalid date' or cache['hotel']['checkout'] == 'Invalid date':
                                cache['hotel']['checkin'] = convert_string_to_date_to_string_front_end(str(datetime.now() + relativedelta(days=1))[:10])
                                cache['hotel']['checkout'] = convert_string_to_date_to_string_front_end(str(datetime.now() + relativedelta(days=2))[:10])
                        except:
                            pass

                        try:
                            cache['activity'] = {
                                    'name': request.session['activity_request']['query']
                                }
                        except:
                            pass

                        try:
                            cache['tour'] = {
                                    'name': request.session['tour_request']['tour_query']
                                }
                        except:
                            pass

                        try:
                            cache['visa'] = {
                                    'destination': request.session['visa_request']['destination'],
                                    'departure_date': request.session['visa_request']['departure_date'],
                                    'consulate': request.session['visa_request']['consulate']
                                }
                            if cache['visa']['departure_date'] == 'Invalid date':
                                cache['visa']['departure_date'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
                        except:
                            pass

                        try:
                            cache['event'] = {
                                    'event_name': request.session['event_request']['event_name']
                                }
                        except:
                            pass
                        try:
                            values.update({
                                'static_path': path_util.get_static_path(MODEL_NAME),
                                'cache': json.dumps(cache),
                                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],

                                'countries': airline_country,
                                'phone_code': phone_code,
                                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                                'username': request.session['user_account'],
                                # 'co_uid': request.session['co_uid'],
                                'airline_cabin_class_list': airline_cabin_class_list,
                                #activity
                                'activity_categories': activity_categories,
                                'activity_types': activity_types,
                                'activity_locations': activity_locations,
                                #tour
                                'tour_countries': tour_countries,
                                'javascript_version': javascript_version,
                                'update_data': 'false',
                                'static_path_url_server': get_url_static_path(),
                                'signature': request.session['signature'],

                            })
                        except Exception as e:
                            _logger.error(str(e) + '\n' + traceback.format_exc())
                            raise Exception('Make response code 500!')
                        return render(request, MODEL_NAME + '/home_templates.html', values)
                        # return render(request, MODEL_NAME + '/testing.html', {})
                    except:
                        if request.session._session:
                            for key in reversed(list(request.session._session.keys())):
                                if key != '_language':
                                    del request.session[key]
                            request.session.modified = True
                        values.update({
                            'static_path': path_util.get_static_path(MODEL_NAME),
                            'javascript_version': javascript_version,
                            'static_path_url_server': get_url_static_path(),
                        })
                else:
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                        'countries': airline_country,
                        'phone_code': phone_code,
                        'javascript_version': javascript_version,
                        'static_path_url_server': get_url_static_path(),
                    })
            except:
                if request.session.get('user_account'):
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'javascript_version': javascript_version,
                        'static_path_url_server': get_url_static_path(),
                        'username': request.session.get('user_account') or '',
                    })
                else:
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'javascript_version': javascript_version,
                        'static_path_url_server': get_url_static_path(),
                    })
    except:
        pass
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

    return no_session_logout(request)

def no_session_logout(request):
    try:
        language = request.session['_language']
    except:
        language = ''
    return redirect(language+'/login')

def goto_dashboard(request):
    try:
        language = request.session['_language']
    except:
        language = ''
    return redirect(language+'/')

def testing(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
        values = {
            'static_path_url_server': get_url_static_path(),
            'static_path': path_util.get_static_path(MODEL_NAME),
        }
        return render(request, MODEL_NAME+'/testing.html', values)
    else:
        return no_session_logout(request)

def testing_chat(request):
    try:
        values = get_data_template(request)
        values.update({
            'static_path_url_server': get_url_static_path(),
            'static_path': path_util.get_static_path(MODEL_NAME),
            'signature': request.session['signature'],
            'username': request.session['user_account'],
        })
        return render(request, MODEL_NAME+'/testing_chat.html', values)
    except:
        return no_session_logout(request)

def page(request, data):
    javascript_version = get_javascript_version()
    values = get_data_template(request, 'login')
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
        'data': data
    })
    return render(request, MODEL_NAME + '/page.html', values)

def payment_method(request, provider, order_number):
    javascript_version = get_javascript_version()
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

    data = get_order_number_frontend(data)
    if data['result']['error_code'] == 0:
        time_limit = convert_string_to_date_to_string_front_end_with_time(to_date_now(data['result']['response']['time_limit']))
        nomor_rekening = data['result']['response']['nomor_rekening']
        amount = data['result']['response']['amount']
        va_number = data['result']['response']['va_number']
        bank_name = data['result']['response']['bank_name']
        create_date = convert_string_to_date_to_string_front_end_with_time(to_date_now(data['result']['response']['create_date']))
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account') or {'co_user_login': ''},
        'order_number': order_number,
        'provider_type': provider_type[order_number.split('.')[0]],
        'provider': provider,
        'time_limit': time_limit,
        'nomor_rekening': nomor_rekening,
        'amount': amount,
        'create_date': create_date,
        'va_number': va_number,
        'bank_name': bank_name,
        'signature': request.session['signature']
    })
    return render(request, MODEL_NAME + '/payment_method_embed.html', values)

def login(request):
    javascript_version = get_javascript_version()
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
                'username': {'co_user_login': ''}
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        # return goto_dashboard()
        if values['website_mode'] == 'btb':
            return render(request, MODEL_NAME+'/login_templates.html', values)
        else:
            try:
                language = request.session['_language']
            except:
                language = ''
            return redirect(language + '/')
    else:
        # if 'session' in request:
        if request.session.get('user_account') and 'login' in request.session['user_account'].get('co_agent_frontend_security', []):
            try:
                language = request.session['_language']
            except:
                language = ''
            return redirect(language + '/')
        elif values['website_mode'] == 'btc' or values['website_mode'] == 'btc_btb':
            try:
                language = request.session['_language']
            except:
                language = ''
            return redirect(language + '/')
        else:
            request.session.delete()
            try:
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'static_path_url_server': get_url_static_path(),
                    'username': {'co_user_login': ''}
                })
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')
            # return goto_dashboard()
            return render(request, MODEL_NAME + '/login_templates.html', values)


def admin(request):
    if 'user_account' in request.session._session:
        if 'admin' in request.session['user_account']['co_agent_frontend_security']:
            #save
            try:
                if request.POST != {}:
                    text = ''
                    fs = FileSystemStorage()
                    try:
                        if request.POST.get('empty_logo'):
                            text += '\n'
                        elif request.FILES['fileToUpload'].content_type == 'image/jpeg' or request.FILES['fileToUpload'].content_type == 'image/png' or request.FILES['fileToUpload'].content_type == 'image/png':
                            file = request.FILES['fileToUpload']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                        else:
                            file = read_cache_with_folder_path("data_cache_template")
                            if file:
                                for idx, line in enumerate(file.split('\n')):
                                    if idx == 0:
                                        text = line + '\n'
                    except:
                        try:
                            file = read_cache_with_folder_path("data_cache_template")
                            if file:
                                for idx, line in enumerate(file.split('\n')):
                                    if idx == 0:
                                        text = line
                                        break
                            else:
                                text += '\n'
                        except:
                            text += '\n'
                            pass
                    # logo template color name desc backgroundhome backgroundlogin
                    text += request.POST['template'] + '\n'
                    text += "#" + request.POST['color_pick'] + '\n'
                    text += request.POST['website_name'] + '\n'
                    try:
                        if request.POST.get('empty_image_home'):
                            text += '\n'
                        elif request.FILES['fileBackgroundHome'].content_type == 'image/jpeg' or request.FILES['fileBackgroundHome'].content_type == 'image/png' or request.FILES['fileBackgroundHome'].content_type == 'image/png':
                            file = request.FILES['fileBackgroundHome']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'

                    except:
                        try:
                            file = read_cache_with_folder_path("data_cache_template")
                            if file:
                                for idx, line in enumerate(file.split('\n')):
                                    if idx == 4:
                                        text += line
                                        check = 1
                                        break
                            else:
                                text += '\n'
                        except:
                            pass

                    try:
                        if request.POST.get('empty_image_login'):
                            text += '\n'
                        elif request.FILES['fileBackgroundLogin'].content_type == 'image/jpeg' or request.FILES['fileBackgroundLogin'].content_type == 'image/png' or request.FILES['fileBackgroundLogin'].content_type == 'image/png':
                            file = request.FILES['fileBackgroundLogin']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                    except:
                        try:
                            file = read_cache_with_folder_path("data_cache_template")
                            if file:
                                for idx, line in enumerate(file.split('\n')):
                                    if idx == 5:
                                        text += line
                                        check = 1
                                        break
                            else:
                                text += '\n'
                        except:
                            pass

                    try:
                        if request.POST.get('empty_image_search'):
                            text += '\n'
                        elif request.FILES['fileBackgroundSearch'].content_type == 'image/jpeg' or request.FILES['fileBackgroundSearch'].content_type == 'image/png' or request.FILES['fileBackgroundSearch'].content_type == 'image/png':
                            file = request.FILES['fileBackgroundSearch']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                    except:
                        try:
                            file = read_cache_with_folder_path("data_cache_template")
                            if file:
                                for idx, line in enumerate(file.split('\n')):
                                    if idx == 6:
                                        text += line
                                        check = 1
                                        break
                            else:
                                text += '\n'
                        except:
                            pass
                    text += request.POST['tawk_chat'] + '\n'
                    text += request.POST['tawk_code'] + '\n'
                    text += "#" + request.POST['text_pick'] + '\n'
                    if request.POST['bg_tab_pick'] == '':
                        text += 'none'
                    else:
                        text += "#" + request.POST['bg_tab_pick'] + 'B3'
                    text += '\n'
                    try:
                        if request.POST.get('empty_logo_icon'):
                            text += '\n'
                        elif request.FILES['filelogoicon'].content_type == 'image/jpeg' or request.FILES['filelogoicon'].content_type == 'image/png' or request.FILES['filelogoicon'].content_type == 'image/png':
                            file = request.FILES['filelogoicon']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                    except:
                        try:
                            file = read_cache_with_folder_path("data_cache_template")
                            if file:
                                for idx, line in enumerate(file.split('\n')):
                                    if idx == 11:
                                        text += line
                                        check = 1
                                        break
                            else:
                                text += '\n'
                        except:
                            pass
                    try:
                        if request.POST.get('empty_image_regis'):
                            text += '\n'
                        elif request.FILES['fileRegistrationBanner'].content_type == 'image/jpeg' or request.FILES['fileRegistrationBanner'].content_type == 'image/png' or request.FILES['fileRegistrationBanner'].content_type == 'image/png':
                            file = request.FILES['fileRegistrationBanner']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                    except:
                        try:
                            file = read_cache_with_folder_path("data_cache_template")
                            if file:
                                for idx, line in enumerate(file.split('\n')):
                                    if idx == 12:
                                        text += line
                                        check = 1
                                        break
                            else:
                                text += '\n'
                        except:
                            pass
                    text += request.POST['espay_key'] + '\n'
                    text += request.POST['espay_key_callback_url'] + '\n'
                    text += request.POST['backend_url'] + '\n'
                    text += request.POST['website_mode'] + '\n'
                    text += request.POST['espay_script'] + '\n'
                    text += '<br>'.join(''.join(request.POST['contact_us'].split('\r')).split('\n'))

                    write_cache_with_folder(text, "data_cache_template")
                    temp = text.split('\n')
                    for idx, rec in enumerate(temp):
                        try:
                            temp[idx] = rec.split('/')[len(rec.split('/'))-1]
                        except:
                            pass
                    #delete file ga pake
                    for file in os.listdir(fs.location):
                        if not file in temp and file != 'image_dynamic' and file != 'image_payment_partner' and file != 'image_about_us':
                            os.remove(fs.location+'/'+file)
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            values = get_data_template(request,'admin')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            try:
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'bg_tab_color': copy.deepcopy(values['tab_color'])[:7],
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
            return render(request, MODEL_NAME+'/backend/admin_templates.html', values)
        else:
            return no_session_logout(request)
    else:
        return no_session_logout(request)

def reservation(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            file = read_cache_with_folder_path("get_airline_active_carriers")
            if file:
                airline_carriers = json.loads(file)

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

def highlight_setting(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            file = read_cache_with_folder_path("get_airline_active_carriers")
            if file:
                for line in file:
                    airline_carriers = json.loads(line)

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
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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

def top_up_quota_pnr(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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
        return render(request, MODEL_NAME+'/backend/top_up_quota_pnr_templates.html', values)
    else:
        return no_session_logout(request)

def payment(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            signature = request.POST['signature']
            passengers = json.loads(request.POST['passengers'])
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
                'provider': provider,
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
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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

def get_javascript_version():
    javascript_version = 0
    try:
        file = read_cache_with_folder_path("javascript_version")
        if file:
            javascript_version = int(file)
    except Exception as e:
        _logger.error('ERROR javascript_version file\n' + str(e) + '\n' + traceback.format_exc())
    return javascript_version

def get_cache_version():
    cache_version = 0
    try:
        file = read_cache_with_folder_path("cache_version")
        if file:
            cache_version = int(file)
    except Exception as e:
        _logger.error('ERROR cache_version file\n' + str(e) + '\n' + traceback.format_exc())
    return cache_version

def get_cache_data(javascript_version):
    try:
        file = read_cache_with_folder_path("version" + str(javascript_version))
        if file:
            response = json.loads(file)
    except Exception as e:
        response = {}
        _logger.error('ERROR version cache file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def get_data_template(request, type='home', provider_type = []):
    template = 1
    logo = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
    logo_icon = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
    if type == 'registration':
        background = 'https://www.skytors.id/web/image/28381'
    else:
        background = '/static/tt_website_rodextrip/images/bg_7.jpg'
    color = '#f15a22'
    airline_country = []
    phone_code = []
    website_name = 'Rodextrip'
    tawk_chat = 0
    website_mode = 'btb'
    tawk_code = ''
    tab_color = '#333333'
    text_color = '#FFFFFF'
    espay_api_key = ''
    espay_api_key_callback_url = ''
    backend_url = ''
    script_espay = ''
    contact_us = ''
    bg_login = ''
    bg_search = ''
    bg_regis = ''
    try:
        if type != 'login':
            if request.session.get('keep_me_signin') == True:
                request.session.set_expiry(1200)
                request.session.modified = True
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)
        if len(provider_type) != 0:
            provider_type = provider_type
        else:
            try:
                provider_type = request.session.get('provider') and request.session.get('provider') or []
            except:
                provider_type = []

        file = read_cache_with_folder_path("data_cache_template")
        if file:
            for idx, line in enumerate(file.split('\n')):
                if idx == 0:
                    if line == '':
                        logo = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
                    else:
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
                    if line != '':
                        tawk_chat = int(line)
                elif idx == 8:
                    if line != '':
                        tawk_code = line.split('\n')[0]
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
                    if line == '':
                        logo_icon = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
                    else:
                        logo_icon = line.split('\n')[0]
                elif idx == 12 and type == 'registration' or type == 'admin' and idx == 12:
                    if line != '':
                        if type == 'admin':
                            bg_regis = line.split('\n')[0]
                        else:
                            background = line.split('\n')[0]
                    else:
                        if type == 'admin':
                            bg_regis = 'https://www.skytors.id/web/image/28381'
                        else:
                            background = 'https://www.skytors.id/web/image/28381'
                elif idx == 13:
                    if line == '':
                        espay_api_key = ''
                    else:
                        espay_api_key = line.split('\n')[0]
                elif idx == 14:
                    if line == '':
                        espay_api_key_callback_url = ''
                    else:
                        espay_api_key_callback_url = line.split('\n')[0]
                elif idx == 15:
                    if line == '':
                        backend_url = ''
                    else:
                        backend_url = line.split('\n')[0]
                elif idx == 16:
                    if line == '':
                        pass
                    else:
                        website_mode = line.split('\n')[0]
                elif idx == 17:
                    if line == '':
                        pass
                    else:
                        script_espay = line.split('\n')[0]
                elif idx == 18:
                    if line.split('<br>')[len(line.split('<br>'))-1] == '\n':
                        contact_us = '\n'.join(line.split('<br>')[:-1])
                    else:
                        contact_us = '\n'.join(line.split('<br>'))
            if color == '':
                color = '#f15a22'
            if len(background.split('\n')) > 1:
                background = background.split('\n')[0]
    except Exception as e:
        _logger.error('ERROR GET CACHE TEMPLATE DJANGO RUN USING DEFAULT\n' + str(e) + '\n' + traceback.format_exc())
    return {
        'logo': logo,
        'website_mode': website_mode,
        'logo_icon': logo_icon,
        'template': template,
        'color': color,
        'name': website_name,
        'background': background,
        'tawk_chat': tawk_chat,
        'tawk_code': tawk_code,
        'text_color': text_color,
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
        'bg_regis': bg_regis
    }


def contact_us(request):
    data = []
    try:
        file = read_cache_with_folder_path("contact_data")
        if file:
            for line in file:
                if line != '\n':
                    data.append(line.split('~'))
    except:
        pass
    # values = {
    #     'data': data
    # }
    # return render(request, MODEL_NAME+'/contact_us.html', values)

    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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
        return render(request, MODEL_NAME+'/contact_us.html', values)
    else:
        return no_session_logout(request)


def faq(request):
    data = []
    try:
        file = read_cache_with_folder_path("faq_data")
        if file:
            for line in file:
                if line != '\n':
                    data.append(line.split('~'))
    except:
        pass
    # values = {
    #     'data': data
    # }
    # return render(request, MODEL_NAME+'/contact_us.html', values)

    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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
        return render(request, MODEL_NAME+'/faq.html', values)
    else:
        return no_session_logout(request)


def about_us(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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
        return render(request, MODEL_NAME+'/about_us.html', values)
    else:
        return no_session_logout(request)


# @api_view(['GET'])
# def testing(request):
#     return Response(_dest_env.test())
#
#
# @api_view(['GET'])
# @permission_classes((IsAuthenticated, ))
# def testing2(request):
#     return Response(_dest_env.test_2())
