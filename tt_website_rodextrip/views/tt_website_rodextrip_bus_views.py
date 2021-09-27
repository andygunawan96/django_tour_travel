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

id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def bus(request):
    if 'user_account' in request.session._session and 'ticketing_bus' in request.session['user_account']['co_agent_frontend_security']:
        try:
            values = get_data_template(request)
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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
                cache['bus'] = {
                    'origin': request.session['bus_request']['origin'][0],
                    'destination': request.session['bus_request']['destination'][0],
                    'departure': request.session['bus_request']['departure'][0],
                }
                if cache['bus']['departure'] == 'Invalid date':
                    cache['bus']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
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
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/bus/bus_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            # check_captcha(request)
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
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
                if request.POST['radio_bus_type'] == 'roundtrip':
                    direction = 'RT'
                    try:
                        departure.append(request.POST['bus_departure_return'].split(' - ')[0])
                        departure.append(request.POST['bus_departure_return'].split(' - ')[1])
                    except:
                        departure.append(request.POST['bus_departure'].split(' - ')[0])
                        departure.append(request.POST['bus_departure'].split(' - ')[1])
                    origin.append(request.POST['bus_origin'])
                    origin.append(request.POST['bus_destination'])
                    destination.append(request.POST['bus_destination'])
                    destination.append(request.POST['bus_origin'])
                elif request.POST['radio_bus_type'] == 'oneway':
                    direction = 'OW'
                    departure.append(request.POST['bus_departure'])
                    origin.append(request.POST['bus_origin'])
                    destination.append(request.POST['bus_destination'])
                set_session(request, 'bus_request', {
                    'direction': direction,
                    'adult': request.POST['bus_adult'],
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
                'bus_request': request.session['bus_request'],
                'static_path_url_server': get_url_static_path(),
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/bus/bus_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)

            values = get_data_template(request)

            # agent
            adult_title = ['MR', 'MRS', 'MS']

            infant_title = ['MSTR', 'MISS']

            # agent

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)


            try:
                set_session(request, 'time_limit', int(request.POST['time_limit_input']))
                set_session(request, 'bus_pick', json.loads(request.POST['response']))
                set_session(request, 'bus_signature', request.POST['signature'])
            except:
                pass

            file = read_cache_with_folder_path("get_bus_config",90911)
            if file:
                carrier = file

            #pax
            adult = []
            infant = []
            for i in range(int(request.session['bus_request']['adult'])):
                adult.append('')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'adults': adult,
                'bus_carriers': carrier,
                'adult_title': adult_title,
                'bus_request': request.session['bus_request'],
                'id_types': id_type,
                'time_limit': request.session['time_limit'],
                'response': request.session['bus_pick'],
                'username': request.session['user_account'],
                'signature': request.session['bus_signature'],
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/bus/bus_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)

            values = get_data_template(request)
            seat_list = []
            for rec in request.session['bus_pick']:
                seat_list.append({
                    "origin": rec['origin_name'],
                    "destination": rec['destination_name'],
                    "seat": '',
                    "seat_code": ''
                })
            adult = []
            infant = []
            contact = []
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
            for i in range(int(request.session['bus_request']['adult'])):
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
                    "seat_list": seat_list
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

            set_session(request, 'bus_create_passengers', {
                'booker': booker,
                'adult': adult,
                'infant': infant,
                'contact': contact
            })
            schedules = []
            journeys = []
            for journey in request.session['bus_pick']:
                journeys.append({
                    'journey_code': journey['journey_code'],
                    'fare_code': journey['fares'][0]['fare_code']
                })
                schedules.append({
                    'journeys': journeys,
                    'provider': journey['provider'],
                })
                journeys = []
            set_session(request, 'bus_booking', schedules)
            try:
                set_session(request, 'time_limit', request.POST['time_limit_input'])
                set_session(request, 'bus_signature', request.POST['signature'])
            except:
                pass
            time_limit = request.session['time_limit']
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        except Exception as e:
            # coba pakai cache
            try:
                set_session(request, 'time_limit', request.POST['time_limit_input'])
                set_session(request, 'bus_signature', request.POST['signature'])
            except:
                pass
            time_limit = request.session['time_limit']
        try:
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'bus_request': request.session['bus_request'],
                'response': request.session['bus_pick'],
                'upsell': request.session.get(
                    'bus_upsell_' + request.session['bus_signature']) and request.session.get(
                    'bus_upsell_' + request.session['bus_signature']) or 0,
                'username': request.session['user_account'],
                'passenger': request.session['bus_create_passengers'],
                'javascript_version': javascript_version,
                'signature': request.session['bus_signature'],
                'static_path_url_server': get_url_static_path(),
                # 'cookies': json.dumps(res['result']['cookies']),

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/bus/bus_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            set_session(request, 'bus_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'bus_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': request.session['bus_order_number'],
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/bus/bus_booking_templates.html', values)

def seat_map(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            values = get_data_template(request)
            try:
                set_session(request, 'bus_seat_map_request', json.loads(request.POST['seat_map_request_input']))
                set_session(request, 'bus_passenger_request', json.loads(request.POST['passenger_input']))
            except:
                pass
            paxs = []
            for pax_type in request.session['bus_passenger_request']:
                for rec in request.session['bus_passenger_request'][pax_type]:
                    paxs.append(rec)
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'paxs': paxs,
                'username': request.session['user_account'],
                'signature': request.session['bus_signature'],
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/bus/bus_seat_map_templates.html', values)
    else:
        return no_session_logout(request)