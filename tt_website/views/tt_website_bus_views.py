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

id_type = [['',''], ['ktp', 'KTP'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def bus(request):
    if 'user_account' in request.session._session and 'ticketing_bus' in request.session['user_account']['co_agent_frontend_security']:
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
                file = read_cache_file(request, '', 'bus_request')
                if file:
                    cache['bus'] = {
                        'origin': file['origin'][0],
                        'destination': file['destination'][0],
                        'departure': file['departure'][0],
                    }
                # cache['bus'] = {
                #     'origin': request.session['bus_request']['origin'][0],
                #     'destination': request.session['bus_request']['destination'][0],
                #     'departure': request.session['bus_request']['departure'][0],
                # }
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
                'big_banner_value': check_banner('bus', 'big_banner', request),
                'small_banner_value': check_banner('bus', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
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
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            frontend_signature = generate_signature()

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

                bus_request = {
                    'direction': direction,
                    'adult': request.POST['bus_adult'],
                    'departure': departure,
                    'origin': origin,
                    'destination': destination
                }
                write_cache_file(request, frontend_signature, 'bus_request', bus_request)
                write_cache_file(request, '', 'bus_request', bus_request)

                # set_session(request, 'bus_request', {
                #     'direction': direction,
                #     'adult': request.POST['bus_adult'],
                #     'departure': departure,
                #     'origin': origin,
                #     'destination': destination
                # })
            except Exception as e:
                _logger.error('Data POST for bus_request not found use cache')
                _logger.error(str(e) + '\n' + traceback.format_exc())

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            file = read_cache_file(request, frontend_signature, 'bus_request')
            if file:
                bus_request = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'frontend_signature': frontend_signature,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'bus_request': bus_request,
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

def passenger(request, signature= ''):
    if 'user_account' in request.session._session:
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

            try:
                time_limit = get_timelimit_product(request, 'bus', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            try:
                set_session(request, 'bus_pick', json.loads(request.POST['response']))
                set_session(request, 'bus_signature', request.POST['signature'])
            except Exception as e:
                _logger.error('Data POST for bus_pick, bus_signature not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache("get_bus_config", 'cache_web', request,90911)
            if file:
                carrier = file

            #pax
            adult = []
            infant = []

            file = read_cache_file(request, signature, 'bus_request')
            if file:
                bus_request = file

                for i in range(int(bus_request['adult'])):
                    adult.append('')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            is_need_identity = False

            file = read_cache_file(request, signature, 'bus_request')
            if file:
                bus_pick = file
                for rec in bus_pick:
                    if rec['is_need_identity']:
                        is_need_identity = rec['is_need_identity']

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            file = read_cache_file(request, signature, 'bus_pick')
            if file:
                bus_pick = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'adults': adult,
                'bus_carriers': carrier,
                'adult_title': adult_title,
                'bus_request': bus_request,
                'id_types': id_type,
                'time_limit': time_limit,
                'response': bus_pick,
                'username': request.session['user_account'],
                'signature': signature,
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'is_need_identity': is_need_identity
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/bus/bus_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request, signature=''):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)

            values = get_data_template(request)
            try:
                if request.META.get('HTTP_REFERER'):
                    if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/')) - 1] == 'seat_map':
                        pax_request_seat = request.POST.get('paxs')
                        if pax_request_seat:
                            pax_request_seat = json.loads(pax_request_seat)

                        file = read_cache_file(request, signature, 'bus_booking')
                        if file:
                            schedules = file
                        # schedules = request.session['bus_booking']
                        for schedule_count, schedule in enumerate(schedules):
                            for journey_count, journey in enumerate(schedule['journeys']):
                                journey['seat'] = [] # RESET SEAT
                        for schedule_count, schedule in enumerate(schedules):
                            for journey_count, journey in enumerate(schedule['journeys']):
                                if not journey.get('seat'):
                                    journey['seat'] = []
                                if pax_request_seat:
                                    for idx, request_seat in enumerate(pax_request_seat):
                                        if len(request_seat['seat_pick']) >= schedule_count:
                                            if request_seat['seat_pick'][schedule_count]['seat_code'] != '':
                                                journey['seat'].append(request_seat['seat_pick'][schedule_count])
                                                journey['seat'][len(journey['seat']) - 1].update({
                                                    "sequence": idx + 1
                                                })
                        write_cache_file(request, signature, 'bus_booking', schedules)
                        set_session(request, 'bus_booking', schedules)
                    else:
                        seat_list = []
                        file = read_cache_file(request, signature, 'bus_pick')
                        if file:
                            bus_pick = file
                        for rec in bus_pick:
                            seat_list.append({
                                "origin": rec['origin_name'],
                                "destination": rec['destination_name'],
                                "seat": '',
                                "seat_code": ''
                            })
                        adult = []
                        infant = []
                        contact = []

                        try:
                            img_list_data = json.loads(request.POST['image_list_data'])
                        except:
                            img_list_data = []

                        first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                        last_name = re.sub(r'\s', ' ', request.POST['booker_last_name']).replace(':', '').strip()
                        email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                        mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                        booker = {
                            'title': request.POST['booker_title'],
                            'first_name': first_name,
                            'last_name': last_name,
                            'email': email,
                            'calling_code': request.POST['booker_phone_code_id'],
                            'mobile': mobile,
                            'nationality_code': request.POST['booker_nationality_id'],
                            'booker_seq_id': request.POST['booker_id']
                        }

                        file = read_cache_file(request, signature, 'bus_request')
                        if file:
                            bus_request = file

                        for i in range(int(bus_request['adult'])):
                            img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                            behaviors = {}
                            if request.POST.get('adult_behaviors_' + str(i + 1)):
                                behaviors = {'bus': request.POST['adult_behaviors_' + str(i + 1)]}

                            first_name = re.sub(r'\s', ' ', request.POST['adult_first_name' + str(i + 1)]).replace(':', '').strip()
                            last_name = re.sub(r'\s', ' ', request.POST['adult_last_name' + str(i + 1)]).replace(':', '').strip()
                            email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                            mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1))).replace(':', '').strip()
                            passport_number = re.sub(r'\s', ' ', request.POST['adult_passport_number' + str(i + 1)] if request.POST.get('adult_passport_number' + str(i + 1)) else '').replace(':', '').strip()

                            adult.append({
                                "pax_type": "ADT",
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['adult_title' + str(i + 1)],
                                "birth_date": request.POST.get('adult_birth_date' + str(i + 1)),
                                "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                                "identity_country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1) + '_id'],
                                "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                                "identity_number": passport_number,
                                "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                                "identity_type": request.POST['adult_id_type' + str(i + 1)],
                                "seat_list": seat_list,
                                "behaviors": behaviors,
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
                                        "first_name": first_name,
                                        "last_name": last_name,
                                        "title": request.POST['adult_title' + str(i + 1)],
                                        "email": email,
                                        "calling_code": request.POST['adult_phone_code' + str(i + 1) + '_id'],
                                        "mobile": mobile,
                                        "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
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
                            first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                            last_name = re.sub(r'\s', ' ', request.POST['booker_last_name']).replace(':', '').strip()
                            email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                            mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                            contact.append({
                                'title': request.POST['booker_title'],
                                'first_name': first_name,
                                'last_name': last_name,
                                'email': email,
                                'calling_code': request.POST['booker_phone_code_id'],
                                'mobile': mobile,
                                'nationality_code': request.POST['booker_nationality_id'],
                                'contact_seq_id': request.POST['booker_id'],
                                'is_also_booker': True
                            })

                        write_cache_file(request, signature, 'bus_create_passengers', {
                            'booker': booker,
                            'adult': adult,
                            'infant': infant,
                            'contact': contact
                        })
                        # set_session(request, 'bus_create_passengers', {
                        #     'booker': booker,
                        #     'adult': adult,
                        #     'infant': infant,
                        #     'contact': contact
                        # })
                        schedules = []
                        journeys = []
                        file = read_cache_file(request, signature, 'bus_pick')
                        if file:
                            bus_pick = file
                        for journey in bus_pick:
                            journeys.append({
                                'journey_code': journey['journey_code'],
                                'fare_code': journey['fares'][0]['fare_code']
                            })
                            schedules.append({
                                'journeys': journeys,
                                'provider': journey['provider'],
                            })
                            journeys = []
                        write_cache_file(request, signature, 'bus_booking', schedules)
                        # set_session(request, 'bus_booking', schedules)
            except Exception as e:
                _logger.error('Data POST for bus_booking not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            try:
                time_limit = get_timelimit_product(request, 'bus', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        except Exception as e:
            _logger.error("%s, %s" % (str(e), traceback.format_exc()))
        try:
            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            file = read_cache_file(request, signature, 'bus_request')
            if file:
                bus_request = file

            file = read_cache_file(request, signature, 'bus_pick')
            if file:
                bus_pick = file

            file = read_cache_file(request, signature, 'bus_upsell')
            if file:
                bus_upsell = file
            else:
                bus_upsell = 0

            file = read_cache_file(request, signature, 'bus_create_passengers')
            if file:
                bus_create_passengers = file

            # time_limit = request.session['time_limit']
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'bus_request': bus_request,
                'response': bus_pick,
                'upsell': bus_upsell,
                'username': request.session['user_account'],
                'passenger': bus_create_passengers,
                'javascript_version': javascript_version,
                'signature': signature,
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
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Bus get booking without login in btb web')
        try:
            bus_order_number = base64.b64decode(order_number).decode('ascii')
            # set_session(request, 'bus_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                bus_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
                # set_session(request, 'bus_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
            except:
                bus_order_number = order_number
                # set_session(request, 'bus_order_number', order_number)

        write_cache_file(request, request.session['signature'], 'bus_order_number', bus_order_number)

        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': bus_order_number,
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
    return render(request, MODEL_NAME+'/bus/bus_booking_templates.html', values)

def seat_map(request, signature=''):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            values = get_data_template(request)
            try:
                write_cache_file(request, signature, 'bus_seat_map_request', json.loads(request.POST['seat_map_request_input']))
                write_cache_file(request, signature, 'bus_passenger_request', json.loads(request.POST['passenger_input']))
                # set_session(request, 'bus_seat_map_request', json.loads(request.POST['seat_map_request_input']))
                # set_session(request, 'bus_passenger_request', json.loads(request.POST['passenger_input']))
            except:
                pass
            paxs = []
            file = read_cache_file(request, signature, 'bus_passenger_request')
            if file:
                bus_passenger_request = file
            for pax_type in bus_passenger_request:
                for rec in bus_passenger_request[pax_type]:
                    paxs.append(rec)
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'paxs': paxs,
                'username': request.session['user_account'],
                'signature': signature,
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