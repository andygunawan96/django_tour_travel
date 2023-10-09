from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from django.utils import translation
import random
import json
import base64
import re
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_views import *
from tools.parser import *
_logger = logging.getLogger("website_logger")

MODEL_NAME = 'tt_website'

cabin_class_type = [
    ['E', 'Executive'],
    ['K', 'Economy'],
    ['B', 'Business'],
]

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def mitra_keluarga(request):
    if 'user_account' in request.session._session and 'ticketing_mitrakeluarga' in request.session['user_account']['co_agent_frontend_security']:
        try:
            values = get_data_template(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
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
            # get_data_awal
            cache = {}
            try:
                file = read_cache_file(request, '', 'mitra_keluarga_request')
                if file:
                    cache['mitra_keluarga'] = {
                        'name': file['name'],
                        'date': file['date']
                    }

                # cache['mitra_keluarga'] = {
                #     'name': request.session['mitra_keluarga_request']['name'],
                #     'date': request.session['mitra_keluarga_request']['date'],
                # }
                if cache['mitra_keluarga']['date'] == 'Invalid date':
                    cache['mitra_keluarga']['date'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
            except:
                pass
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
                'javascript_version': javascript_version,
                'update_data': 'false',
                'static_path_url_server': get_url_static_path(),
                'big_banner_value': check_banner('mitrakeluarga', 'big_banner', request),
                'small_banner_value': check_banner('mitrakeluarga', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/mitra_keluarga/mitra_keluarga_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request, test_type=''):
    try:
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
        values = get_data_template(request)
        user_default = get_credential_user_default(request, 'dict')
        ## kalau belum signin, web btc & ada user default
        if not request.session.get('user_account') and values['website_mode'] in ['btc','btc_btb'] and user_default:
            signin_btc(request)
        

        # agent
        adult_title = ['', 'MR', 'MRS', 'MS']

        infant_title = ['', 'MSTR', 'MISS']

        # agent

        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        frontend_signature = generate_signature()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        try:
            passengers = json.loads(request.POST['data'])
            write_cache_file(request, frontend_signature, 'mitra_keluarga_passenger_cache', passengers)
            # set_session(request, 'mitra_keluarga_passenger_cache', passengers)
        except:
            file = read_cache_file(request, frontend_signature, 'mitra_keluarga_passenger_cache')
            if file:
                passengers = file
            else:
                passengers = []
            # try:
            #     passengers = request.session['mitra_keluarga_passenger_cache']
            # except:
            #     passengers = []

        try:
            booking_data = json.loads(request.POST['booking_data'])
            write_cache_file(request, frontend_signature, 'mitra_keluarga_data_cache', booking_data)
            # set_session(request, 'mitra_keluarga_data_cache', booking_data)
        except:
            pass

        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'phone_code': phone_code,
            'adult_title': adult_title,
            'infant_title': infant_title,
            'id_types': id_type,
            'time_limit': 1200,
            'username': request.session['user_account'],
            'frontend_signature': frontend_signature,
            'signature': request.session['signature'],
            'update_data': 'true',
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            'vendor': 'mitrakeluarga',
            'test_type': test_type,
            'total_passengers_rebooking': len(passengers)
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/mitra_keluarga/mitra_keluarga_passenger_templates.html', values)

def review(request, signature=''):
    if 'user_account' in request.session._session:
        try:
            passenger_booker = {}
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)

            values = get_data_template(request)
            try:
                data = json.loads(request.POST['data'])
            except Exception as e:
                _logger.error('Data POST for data not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                try:
                    file = read_cache_file(request, request.POST['signature'], 'airline_request')
                    if file:
                        data = file
                    # data = request.session.get('mitra_keluarga_data_%s' % request.POST['signature'])
                except:
                    pass
            adult = data['passenger']

            adult['first_name'] = re.sub(r'\s', '', adult['first_name']).replace(':', '')
            adult['last_name'] = re.sub(r'\s', '', adult['last_name']).replace(':', '')

            booker = data['booker']

            booker['first_name'] = re.sub(r'\s', '', booker['first_name']).replace(':', '')
            booker['last_name'] = re.sub(r'\s', '', booker['last_name']).replace(':', '')
            booker['email'] = re.sub(r'\s', '', booker['email']).replace(':', '')
            booker['mobile'] = re.sub(r'\s', '', booker['mobile']).replace(':', '')

            contact = data['contact_person']

            contact['first_name'] = re.sub(r'\s', '', contact['first_name']).replace(':', '')
            contact['last_name'] = re.sub(r'\s', '', contact['last_name']).replace(':', '')
            contact['email'] = re.sub(r'\s', '', contact['email']).replace(':', '')
            contact['mobile'] = re.sub(r'\s', '', contact['mobile']).replace(':', '')

            data = data['data']
            passenger_booker['booker'] = {
                "booker_seq_id": booker['booker_seq_id']
            }
            mitra_keluarga_passenger = copy.deepcopy(adult)
            for rec in mitra_keluarga_passenger:
                identity_number = re.sub(r'\s', '', rec['identity']['identity_number']).replace(':', '')
                rec['identity_country_of_issued_code'] = rec['identity']['identity_country_of_issued_code']
                rec['identity_number'] = identity_number
                rec['identity_expdate'] = rec['identity']['identity_expdate']
                rec['identity_type'] = rec['identity']['identity_type']

            write_cache_file(request, signature, 'mitra_keluarga_data', {
                'booker': booker,
                'passengers': adult,
                'contacts': contact,
                'data': data
            })
            write_cache_file(request, signature, 'mitra_keluarga_passenger_cache', mitra_keluarga_passenger)
            write_cache_file(request, signature, 'mitra_keluarga_data_cache', data)

            # set_session(request, 'mitra_keluarga_data_%s' % request.POST['signature'], {
            #     'booker': booker,
            #     'passengers': adult,
            #     'contacts': contact,
            #     'data': data
            # })
            # set_session(request, 'mitra_keluarga_passenger_cache', mitra_keluarga_passenger)
            # set_session(request, 'mitra_keluarga_data_cache', data)

            try:
                time_limit = get_timelimit_product(request, 'mitra_keluarga', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            try:
                write_cache_file(request, signature, 'mitra_keluarga_signature', signature)
                write_cache_file(request, signature, 'vendor', request.POST['vendor'])
                write_cache_file(request, signature, 'test_type', request.POST['test_type'])

                # set_session(request, 'mitra_keluarga_signature', request.POST['signature'])
                # set_session(request, 'vendor_%s' % request.POST['signature'], request.POST['vendor'])
                # set_session(request, 'test_type_%s' % request.POST['signature'], request.POST['test_type'])
            except:
                pass
            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file
            # time_limit = request.session['time_limit']

            file = read_cache_file(request, signature, 'vendor')
            if file:
                vendor = file
            # vendor = request.session['vendor']

            file = read_cache_file(request, signature, 'test_type')
            if file:
                test_type = file
            # test_type = request.session['test_type']
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        except Exception as e:
            # coba pakai cache
            _logger.error("ERROR no data POST in mitra keluarga review page\n%s, %s" % (str(e), traceback.format_exc()))
            # try:
            #     set_session(request, 'time_limit', request.session['time_limit'])
            #     set_session(request, 'mitra_keluarga_signature', request.session['mitra_keluarga_signature'])
            #     set_session(request, 'vendor_%s' % request.POST['signature'], request.session['vendor'])
            #     set_session(request, 'test_type_%s' % request.POST['signature'], request.session['test_type'])
            # except:
            #     pass

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file
            # time_limit = request.session['time_limit']

            file = read_cache_file(request, signature, 'vendor')
            if file:
                vendor = file
            # vendor = request.session['vendor_%s' % request.POST['signature']]

            file = read_cache_file(request, signature, 'test_type')
            if file:
                test_type = file
            # test_type = request.session['test_type_%s' % request.POST['signature']]

        try:
            passenger_booker = {}
            file = read_cache_file(request, signature, 'mitra_keluarga_data')
            if file:
                passenger_booker['booker'] = {
                    "booker_seq_id": file['booker']['booker_seq_id']
                }

            file = read_cache_file(request, signature, 'mitra_keluarga_upsell')
            if file:
                mitra_keluarga_upsell = file
            else:
                mitra_keluarga_upsell = 0

            file = read_cache_file(request, signature, 'mitra_keluarga_data')
            if file:
                mitra_keluarga_data = file

            file = read_cache_file(request, request.POST['signature'], 'vendor')
            if file:
                vendor = file
            file = read_cache_file(request, request.POST['signature'], 'test_type')
            if file:
                test_type = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'passenger_booker': passenger_booker,
                'upsell': mitra_keluarga_upsell,
                'username': request.session['user_account'],
                'data': mitra_keluarga_data,
                'javascript_version': javascript_version,
                'signature': signature,
                'static_path_url_server': get_url_static_path(),
                'vendor': vendor,
                'test_type': test_type,
                'go_back_url': request.META['HTTP_REFERER'],
                # 'cookies': json.dumps(res['result']['cookies']),

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/mitra_keluarga/mitra_keluarga_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Mitra Keluarga get booking without login in btb web')
        try:
            mitra_keluarga_order_number = base64.b64decode(order_number).decode('ascii')
            # set_session(request, 'mitra_keluarga_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                mitra_keluarga_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
                # set_session(request, 'mitra_keluarga_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
            except:
                mitra_keluarga_order_number = order_number
                # set_session(request, 'mitra_keluarga_order_number', order_number)
        write_cache_file(request, request.session['signature'], 'mitra_keluarga_order_number', mitra_keluarga_order_number)
        # try:
        #     if request.session.get('mitra_keluarga_passenger_cache'):
        #         del request.session['mitra_keluarga_passenger_cache']
        # except:
        #     pass
        # try:
        #     if request.session.get('mitra_keluarga_data_cache'):
        #         del request.session['mitra_keluarga_data_cache']
        # except:
        #     pass
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': mitra_keluarga_order_number,
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/mitra_keluarga/mitra_keluarga_booking_templates.html', values)


def confirm_order(request):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/mitra_keluarga/mitra_keluarga_confirm_order_templates.html', values)


def confirm_order_booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            set_session(request, 'mitra_keluarga_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'mitra_keluarga_order_number', order_number)
        try:
            if request.session.get('mitra_keluarga_passenger_cache'):
                del request.session['mitra_keluarga_passenger_cache']
        except:
            pass
        try:
            if request.session.get('mitra_keluarga_data_cache'):
                del request.session['mitra_keluarga_data_cache']
        except:
            pass
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': request.session['mitra_keluarga_order_number'],
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/mitra_keluarga/mitra_keluarga_booking_templates.html', values)
