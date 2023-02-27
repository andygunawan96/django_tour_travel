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
from .tt_website_rodextrip_views import *
from tools.parser import *
_logger = logging.getLogger("rodextrip_logger")

MODEL_NAME = 'tt_website_rodextrip'

cabin_class_type = [
    ['E', 'Executive'],
    ['K', 'Economy'],
    ['B', 'Business'],
]

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

id_type = [['ktp', 'KTP/NIK'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def train(request):
    if 'user_account' in request.session._session and 'ticketing_train' in request.session['user_account']['co_agent_frontend_security']:
        try:
            values = get_data_template(request)
            javascript_version = get_javascript_version()
            response = get_cache_data()
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
                cache['train'] = {
                    'origin': request.session['train_request']['origin'][0],
                    'destination': request.session['train_request']['destination'][0],
                    'departure': request.session['train_request']['departure'][0],
                }
                if cache['train']['departure'] == 'Invalid date':
                    cache['train']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
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
                'big_banner_value': check_banner('train', 'big_banner'),
                'small_banner_value': check_banner('train', 'small_banner'),
                'dynamic_page_value': check_banner('', 'dynamic_page'),
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/train/train_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            # check_captcha(request)
            javascript_version = get_javascript_version()
            response = get_cache_data()
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            values = get_data_template(request, 'search')
            try:
                origin = []
                destination = []
                departure = []
                if request.POST['radio_train_type'] == 'roundtrip':
                    direction = 'RT'
                    try:
                        departure.append(request.POST['train_departure_return'].split(' - ')[0])
                        departure.append(request.POST['train_departure_return'].split(' - ')[1])
                    except:
                        departure.append(request.POST['train_departure'].split(' - ')[0])
                        departure.append(request.POST['train_departure'].split(' - ')[1])
                    origin.append(request.POST['train_origin'])
                    origin.append(request.POST['train_destination'])
                    destination.append(request.POST['train_destination'])
                    destination.append(request.POST['train_origin'])
                elif request.POST['radio_train_type'] == 'oneway':
                    direction = 'OW'
                    departure.append(request.POST['train_departure'])
                    origin.append(request.POST['train_origin'])
                    destination.append(request.POST['train_destination'])
                set_session(request, 'train_request', {
                    'direction': direction,
                    'adult': request.POST['train_adult'],
                    'infant': request.POST['train_infant'],
                    'departure': departure,
                    'origin': origin,
                    'destination': destination
                })
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'train_request': request.session['train_request'],
                'static_path_url_server': get_url_static_path(),
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            response = get_cache_data()

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


            try:
                time_limit = get_timelimit_product(request, 'train')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
                set_session(request, 'train_pick', json.loads(request.POST['response']))
            except:
                pass
            set_session(request, 'train_signature', signature)
            file = read_cache("get_train_carriers", 'cache_web',90911)
            if file:
                carrier = file

            #pax
            adult = []
            infant = []
            for i in range(int(request.session['train_request']['adult'])):
                adult.append('')
            for i in range(int(request.session['train_request']['infant'])):
                infant.append('')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            is_adult_birth_date_required = False
            for rec in request.session['train_pick']:
                if carrier[rec['carrier_code']]['is_adult_birth_date_required']:
                    is_adult_birth_date_required = True
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'adults': adult,
                'infants': infant,
                'train_carriers': carrier,
                'adult_title': adult_title,
                'infant_title': infant_title,
                'train_request': request.session['train_request'],
                'id_types': id_type,
                'is_adult_birth_date_required': is_adult_birth_date_required,
                'time_limit': request.session['time_limit'],
                'response': request.session['train_pick'],
                'username': request.session['user_account'],
                'signature': request.session['train_signature'],
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            response = get_cache_data()

            values = get_data_template(request)

            adult = []
            infant = []
            contact = []
            try:
                img_list_data = json.loads(request.POST['image_list_data'])
            except:
                img_list_data = []

            booker = {
                'title': request.POST['booker_title'],
                'first_name': request.POST['booker_first_name'],
                'last_name': request.POST['booker_last_name'],
                'email': request.POST['booker_email'],
                'calling_code': request.POST['booker_phone_code'],
                'mobile': request.POST['booker_phone'],
                'nationality_name': request.POST['booker_nationality'],
                'booker_seq_id': request.POST['booker_id']
            }
            for i in range(int(request.session['train_request']['adult'])):
                img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                adult.append({
                    "pax_type": "ADT",
                    "first_name": request.POST['adult_first_name' + str(i + 1)],
                    "last_name": request.POST['adult_last_name' + str(i + 1)],
                    "title": request.POST['adult_title' + str(i + 1)],
                    "birth_date": request.POST.get('adult_birth_date' + str(i + 1)),
                    "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                    "identity_country_of_issued_name": request.POST['adult_country_of_issued' + str(i + 1)],
                    "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                    "identity_number": request.POST['adult_passport_number' + str(i + 1)],
                    "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                    "identity_type": request.POST['adult_id_type' + str(i + 1)],
                    "identity_image": img_identity_data,
                })

                if i == 0:
                    if request.POST['myRadios'] == 'yes':
                        adult[len(adult) - 1].update({
                            'is_also_booker': True,
                            'is_also_contact': True
                        })
                    else:
                        adult[len(adult) - 1].update({
                            'is_also_booker': False
                        })
                else:
                    adult[len(adult) - 1].update({
                        'is_also_booker': False
                    })
                try:
                    if request.POST['adult_cp' + str(i + 1)] == 'on':
                        adult[len(adult) - 1].update({
                            'is_also_contact': True
                        })
                    else:
                        adult[len(adult) - 1].update({
                            'is_also_contact': False
                        })
                except:
                    if i == 0 and request.POST['myRadios'] == 'yes':
                        continue
                    else:
                        adult[len(adult) - 1].update({
                            'is_also_contact': False
                        })
                try:
                    if request.POST['adult_cp' + str(i + 1)] == 'on':
                        contact.append({
                            "first_name": request.POST['adult_first_name' + str(i + 1)],
                            "last_name": request.POST['adult_last_name' + str(i + 1)],
                            "title": request.POST['adult_title' + str(i + 1)],
                            "email": request.POST['adult_email' + str(i + 1)],
                            "calling_code": request.POST['adult_phone_code' + str(i + 1)],
                            "mobile": request.POST['adult_phone' + str(i + 1)],
                            "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                            "contact_seq_id": request.POST['adult_id' + str(i + 1)]
                        })
                    if i == 0:
                        if request.POST['myRadios'] == 'yes':
                            contact[len(contact)].update({
                                'is_also_booker': True
                            })
                        else:
                            contact[len(contact)].update({
                                'is_also_booker': False
                            })
                except:
                    pass

            if len(contact) == 0:
                contact.append({
                    'title': request.POST['booker_title'],
                    'first_name': request.POST['booker_first_name'],
                    'last_name': request.POST['booker_last_name'],
                    'email': request.POST['booker_email'],
                    'calling_code': request.POST['booker_phone_code'],
                    'mobile': request.POST['booker_phone'],
                    'nationality_name': request.POST['booker_nationality'],
                    'contact_seq_id': request.POST['booker_id'],
                    'is_also_booker': True
                })

            for i in range(int(request.session['train_request']['infant'])):
                img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'infant' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                infant.append({
                    "pax_type": "INF",
                    "first_name": request.POST['infant_first_name' + str(i + 1)],
                    "last_name": request.POST['infant_last_name' + str(i + 1)],
                    "title": request.POST['infant_title' + str(i + 1)],
                    "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                    "nationality_name": request.POST['infant_nationality' + str(i + 1)],
                    "passenger_seq_id": request.POST['infant_id' + str(i + 1)],
                    "identity_country_of_issued_name": request.POST['infant_country_of_issued' + str(i + 1)],
                    "identity_expdate": request.POST['infant_passport_expired_date' + str(i + 1)],
                    "identity_number": request.POST['infant_passport_number' + str(i + 1)],
                    "identity_type": request.POST['infant_id_type' + str(i + 1)],
                    "identity_image": img_identity_data,
                })
            set_session(request, 'train_create_passengers', {
                'booker': booker,
                'adult': adult,
                'infant': infant,
                'contact': contact
            })
            schedules = []
            journeys = []
            for journey in request.session['train_pick']:
                journeys.append({
                    'journey_code': journey['journey_code'],
                    'fare_code': journey['fares'][0]['fare_code']
                })
                schedules.append({
                    'journeys': journeys,
                    'provider': journey['provider'],
                })
                journeys = []
            set_session(request, 'train_booking', schedules)
            try:
                time_limit = get_timelimit_product(request, 'train')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
                set_session(request, 'train_signature', request.POST['signature'])
            except:
                pass
            time_limit = request.session['time_limit']
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        except Exception as e:
            # coba pakai cache
            try:
                set_session(request, 'time_limit', request.POST['time_limit_input'])
                set_session(request, 'train_signature', request.POST['signature'])
            except:
                pass
            time_limit = request.session['time_limit']
        try:
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'train_request': request.session['train_request'],
                'response': request.session['train_pick'],
                'upsell': request.session.get(
                    'train_upsell_' + request.session['train_signature']) and request.session.get(
                    'train_upsell_' + request.session['train_signature']) or 0,
                'username': request.session['user_account'],
                'passenger': request.session['train_create_passengers'],
                'javascript_version': javascript_version,
                'signature': request.session['train_signature'],
                'static_path_url_server': get_url_static_path(),
                # 'cookies': json.dumps(res['result']['cookies']),

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            set_session(request, 'train_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                set_session(request, 'train_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
            except:
                set_session(request, 'train_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': request.session['train_order_number'],
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/train/train_booking_templates.html', values)

def seat_map(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            values = get_data_template(request)
            is_b2c_field_from_review = {'value': False}
            value = False
            try:
                if 'b2c_limitation' in request.session['user_account']['co_agent_frontend_security']:
                    value = True
            except:
                pass
            try:
                set_session(request, 'train_seat_map_request', json.loads(request.POST['seat_map_request_input']))
                set_session(request, 'train_passenger_request', json.loads(request.POST['passenger_input']))
            except:
                pass

            try:
                is_b2c_field_from_review.update({
                    "discount": json.loads(request.POST['discount']),
                    "voucher_code": request.POST['voucher_code'],
                    "type": request.POST['type'],
                    "passengers": json.loads(request.POST['passengers']),
                    "signature": request.POST['signature'],
                    "order_number": request.POST['order_number'],
                    "provider": request.POST['provider'],
                    "session_time_input": request.POST['session_time_input'],
                    "value": value
                })
            except:
                is_b2c_field_from_review.update({
                    'value': False
                })

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'paxs': request.session['train_passenger_request'],
                'order_number': request.POST['order_number'],
                'username': request.session['user_account'],
                'signature': request.session['train_signature'],
                "is_b2c_field": is_b2c_field_from_review,
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_seat_map_templates.html', values)
    else:
        return no_session_logout(request)