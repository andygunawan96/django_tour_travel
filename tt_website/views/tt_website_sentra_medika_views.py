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

def sentra_medika(request):
    if 'user_account' in request.session._session and 'ticketing_sentramedika' in request.session['user_account']['co_agent_frontend_security']:
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
                cache['sentra_medika'] = {
                    'name': request.session['sentra_medika_request']['name'],
                    'date': request.session['sentra_medika_request']['date'],
                }
                if cache['sentra_medika']['date'] == 'Invalid date':
                    cache['sentra_medika']['date'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
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
                'big_banner_value': check_banner('sentramedika', 'big_banner', request),
                'small_banner_value': check_banner('sentramedika', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/sentra_medika/sentra_medika_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request, test_type=''):
    try:
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)

        values = get_data_template(request)

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


        set_session(request, 'time_limit', 1200)


        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        try:
            passengers = json.loads(request.POST['data'])
            set_session(request, 'sentra_medika_passenger_cache', passengers)
        except:
            try:
                passengers = request.session['sentra_medika_passenger_cache']
            except:
                passengers = []

        try:
            booking_data = json.loads(request.POST['booking_data'])
            set_session(request, 'sentra_medika_data_cache', booking_data)
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
            'time_limit': request.session['time_limit'],
            'username': request.session['user_account'],
            'signature': request.session['signature'],
            'update_data': 'true',
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            'vendor': 'sentramedika',
            'test_type': test_type,
            'total_passengers_rebooking': len(passengers)
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/sentra_medika/sentra_medika_passenger_templates.html', values)

def review(request):
    if 'user_account' in request.session._session:
        try:
            passenger_booker = {}
            javascript_version = get_javascript_version(request)

            values = get_data_template(request)
            try:
                data = json.loads(request.POST['data'])
            except Exception as e:
                _logger.error('Data POST for data not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                try:
                    data = request.session.get('sentra_medika_data_%s' % request.POST['signature'])
                except:
                    pass
            adult = data['passenger']
            booker = data['booker']
            contact = data['contact_person']
            data = data['data']
            passenger_booker['booker'] = {
                "booker_seq_id": booker['booker_seq_id']
            }
            sentra_medika_passenger = copy.deepcopy(adult)
            for rec in sentra_medika_passenger:
                rec['identity_country_of_issued_code'] = rec['identity']['identity_country_of_issued_code']
                rec['identity_number'] = rec['identity']['identity_number']
                rec['identity_expdate'] = rec['identity']['identity_expdate']
                rec['identity_type'] = rec['identity']['identity_type']

            set_session(request, 'sentra_medika_data_%s' % request.POST['signature'], {
                'booker': booker,
                'passengers': adult,
                'contacts': contact,
                'data': data
            })
            set_session(request, 'sentra_medika_passenger_cache', sentra_medika_passenger)
            set_session(request, 'sentra_medika_data_cache', data)
            try:
                time_limit = get_timelimit_product(request, 'sentra_medika')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
            except:
                pass

            try:
                set_session(request, 'sentra_medika_signature', request.POST['signature'])
                set_session(request, 'vendor_%s' % request.POST['signature'], request.POST['vendor'])
                set_session(request, 'test_type_%s' % request.POST['signature'], request.POST['test_type'])
            except:
                pass
            time_limit = request.session['time_limit']
            vendor = request.session['vendor']
            test_type = request.session['test_type']
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        except Exception as e:
            # coba pakai cache
            try:
                set_session(request, 'time_limit', request.session['time_limit'])
                set_session(request, 'sentra_medika_signature', request.session['sentra_medika_signature'])
                set_session(request, 'vendor_%s' % request.POST['signature'], request.session['vendor'])
                set_session(request, 'test_type_%s' % request.POST['signature'], request.session['test_type'])
            except:
                pass
            time_limit = request.session['time_limit']
            vendor = request.session['vendor_%s' % request.POST['signature']]
            test_type = request.session['test_type_%s' % request.POST['signature']]

        try:
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'passenger_booker': passenger_booker,
                'upsell': request.session.get('sentra_medika_upsell_' + request.session['sentra_medika_signature']) and request.session.get('sentra_medika_upsell_' + request.session['sentra_medika_signature']) or 0,
                'username': request.session['user_account'],
                'data': request.session['sentra_medika_data_%s' % request.POST['signature']],
                'javascript_version': javascript_version,
                'signature': request.session['sentra_medika_signature'],
                'static_path_url_server': get_url_static_path(),
                'vendor': vendor,
                'test_type': test_type,
                'go_back_url': request.META['HTTP_REFERER'],
                # 'cookies': json.dumps(res['result']['cookies']),

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/sentra_medika/sentra_medika_review_templates.html', values)
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
            raise Exception('Sentra Medika get booking without login in btb web')
        try:
            set_session(request, 'sentra_medika_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                set_session(request, 'sentra_medika_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
            except:
                set_session(request, 'sentra_medika_order_number', order_number)
        try:
            if request.session.get('sentra_medika_passenger_cache'):
                del request.session['sentra_medika_passenger_cache']
        except:
            pass
        try:
            if request.session.get('sentra_medika_data_cache'):
                del request.session['sentra_medika_data_cache']
        except:
            pass
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': request.session['sentra_medika_order_number'],
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
    return render(request, MODEL_NAME+'/sentra_medika/sentra_medika_booking_templates.html', values)


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
    return render(request, MODEL_NAME+'/sentra_medika/sentra_medika_confirm_order_templates.html', values)


def confirm_order_booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            set_session(request, 'sentra_medika_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'sentra_medika_order_number', order_number)
        try:
            if request.session.get('sentra_medika_passenger_cache'):
                del request.session['sentra_medika_passenger_cache']
        except:
            pass
        try:
            if request.session.get('sentra_medika_data_cache'):
                del request.session['sentra_medika_data_cache']
        except:
            pass
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': request.session['sentra_medika_order_number'],
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/sentra_medika/sentra_medika_booking_templates.html', values)
