from django.shortcuts import render, redirect
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
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_rodextrip_views import *
from tools.parser import *
import base64
_logger = logging.getLogger("rodextrip_logger")

MODEL_NAME = 'tt_website_rodextrip'

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def airline(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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
                cache['airline'] = {
                    'origin': request.session['airline_request']['origin'][0],
                    'destination': request.session['airline_request']['destination'][0],
                    'departure': request.session['airline_request']['departure'][0],
                }
                if cache['airline']['departure'] == 'Invalid date':
                    cache['airline']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
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
        return render(request, MODEL_NAME + '/airline/airline_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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
            # airline
            file = open(var_log_path()+"airline_destination.txt", "r")
            for line in file:
                airline_destinations = json.loads(line)
            file.close()
            file = open(var_log_path() + "get_airline_carriers.txt", "r")
            for line in file:
                carrier = json.loads(line)
            file.close()
            airline_destinations = []
            try:
                file = open(var_log_path()+"get_airline_active_carriers.txt", "r")
                for line in file:
                    response = json.loads(line)
                file.close()
            except Exception as e:
                _logger.error('ERROR get_airline_active_carriers file\n' + str(e) + '\n' + traceback.format_exc())
            values = get_data_template(request, 'search')

            airline_carriers = {'All': {'name': 'All', 'code': 'all','is_excluded_from_b2c': False}}
            for i in response:
                airline_carriers[i] = {
                    'name': response[i]['name'],
                    'code': response[i]['code'],
                    'icao': response[i]['icao'],
                    'call_sign': response[i]['call_sign']
                }

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

            providers = []
            try:

                #check MC OW RT
                try:
                    if request.POST['radio_airline_type'] == 'multicity':
                        direction = 'MC'
                        try:
                            if request.POST['is_combo_price'] == '':
                                is_combo_price = 'true'
                        except:
                            is_combo_price = 'false'

                        airline_carriers = []
                        airline_carrier = {'All': {'name': 'All', 'code': 'all'}}
                        for j in response:
                            airline_carrier[j] = {
                                'name': response[j]['name'],
                                'code': response[j]['code'],
                                'display_name': response[j]['display_name'],
                                'icao': response[j]['icao'],
                                'call_sign': response[j]['call_sign'],
                                'is_favorite': response[j]['is_favorite'],
                                'provider': response[j]['provider'],
                                'is_excluded_from_b2c': response[j]['is_excluded_from_b2c']
                            }
                        airline_carriers.append(airline_carrier)
                        airline_carrier = []

                        for idx, arr in enumerate(airline_carriers):
                            for provider in arr:
                                try:
                                    if (request.POST['provider_box_' + provider+'_1']):
                                        airline_carriers[idx][provider]['bool'] = True
                                    else:
                                        airline_carriers[idx][provider]['bool'] = False
                                except:
                                    airline_carriers[idx][provider]['bool'] = False

                        origin = []
                        destination = []
                        departure = []
                        cabin_class = []
                        return_date = []
                        cabin_class.append(request.POST['cabin_class_flight1'])
                        for i in range(int(request.POST['counter'])):
                            origin.append(request.POST['origin_id_flight'+str(i+1)])
                            destination.append(request.POST['destination_id_flight'+str(i+1)])
                            departure.append(request.POST['airline_departure'+str(i+1)])
                            return_date.append(request.POST['airline_departure'+str(i+1)])

                    else:
                        try:
                            if request.POST['is_combo_price'] == '':
                                is_combo_price = 'true'
                        except:
                            is_combo_price = 'false'

                        airline_carriers = []
                        airline_carrier = {'All': {'name': 'All', 'code': 'all', 'is_favorite': False}}
                        for j in response:
                            airline_carrier[j] = {
                                'name': response[j]['name'],
                                'display_name': response[j]['display_name'],
                                'code': response[j]['code'],
                                'icao': response[j]['icao'],
                                'call_sign': response[j]['call_sign'],
                                'is_favorite': response[j]['is_favorite'],
                                'provider': response[j]['provider'],
                                'is_excluded_from_b2c': response[j]['is_excluded_from_b2c']
                            }
                        airline_carriers.append(airline_carrier)
                        airline_carrier = []

                        for idx, arr in enumerate(airline_carriers):
                            for provider in arr:
                                try:
                                    if (request.POST['provider_box_' + provider]):
                                        airline_carriers[idx][provider]['bool'] = True
                                    else:
                                        airline_carriers[idx][provider]['bool'] = False
                                except:
                                    airline_carriers[idx][provider]['bool'] = False
                        origin = []
                        destination = []
                        departure = []
                        cabin_class = []
                        return_date = []

                        origin.append(request.POST['origin_id_flight'])
                        destination.append(request.POST['destination_id_flight'])
                        try:
                            departure.append(request.POST['airline_departure_return'].split(' - ')[0])
                        except:
                            departure.append(request.POST['airline_departure'])
                        cabin_class.append(request.POST['cabin_class_flight'])

                        if request.POST['radio_airline_type'] == 'roundtrip':
                            direction = 'RT'
                            departure.append(request.POST['airline_departure_return'].split(' - ')[1])
                            return_date.append(request.POST['airline_departure_return'].split(' - ')[1])
                            origin.append(request.POST['destination_id_flight'])
                            destination.append(request.POST['origin_id_flight'])
                        elif request.POST['radio_airline_type'] == 'oneway':
                            direction = 'OW'
                            return_date.append(request.POST['airline_departure'])
                except:
                    direction = 'OW'
                    return_date = request.POST['airline_departure']
                    print('airline no return')


                airline_request = {
                    'origin': origin,
                    'destination': destination,
                    'departure': departure,
                    'return': return_date,
                    'direction': direction,
                    'adult': direction == 'MC' and int(request.POST['adult_flight1']) or int(request.POST['adult_flight']),
                    'child': direction == 'MC' and int(request.POST['child_flight1']) or int(request.POST['child_flight']),
                    'infant': direction == 'MC' and int(request.POST['infant_flight1']) or int(request.POST['infant_flight']),
                    'cabin_class': cabin_class,
                    'is_combo_price': is_combo_price,
                    'carrier_codes': [],
                    'counter': request.POST['counter']
                }
                set_session(request, 'airline_carriers_request', airline_carriers)

                request.session.modified = True
            except:
                airline_request = request.session['airline_request']
                airline_carriers = request.session['airline_carriers_request']

            flight = ''

            check = 2
            for idx, airline_request_search in enumerate(airline_request['origin']):
                for list_airline in airline_destinations:
                    if list_airline['name'] == airline_request['origin'][idx].split(' - ')[0] or list_airline['name'] == \
                            airline_request['destination'][idx].split(' - ')[0] or list_airline['code'] == \
                            airline_request['origin'][idx].split(' - ')[0] or list_airline['code'] == \
                            airline_request['destination'][idx].split(' - ')[0] or list_airline['city'] == \
                            airline_request['origin'][idx].split(' - ')[0] or list_airline['city'] == \
                            airline_request['destination'][idx].split(' - ')[0]:
                        if list_airline['country'] == 'Indonesia':
                            if flight == 'domestic' or flight == '':
                                flight = 'domestic'
                        else:
                            flight = 'international'
                        check -= 1
                    if check == 0:
                        break

            airline_request['flight'] = flight
            set_session(request, 'airline_request', airline_request)
            set_session(request, 'airline_mc_counter', 0)

            # get_balance(request)

            # airline

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'journeys': journeys,
                'airline_request': airline_request,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'airline_destinations': airline_destinations,
                'flight': flight,
                'airline_cabin_class_list': airline_cabin_class_list,
                'airline_carriers': airline_carriers,
                'airline_all_carriers': carrier,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'static_path_url_server': get_url_static_path(),
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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
            file = open(var_log_path()+"get_airline_carriers.txt", "r")
            for line in file:
                carrier = json.loads(line)
            file.close()

            values = get_data_template(request)

            # agent
            adult_title = ['MR', 'MRS', 'MS']

            infant_title = ['MSTR', 'MISS']

            id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

            # agent

            # get_balance(request)

            #pax
            adult = []
            infant = []
            child = []
            pax = copy.deepcopy(request.session['airline_request'])
            for i in range(int(pax['adult'])):
                adult.append('')
            for i in range(int(pax['child'])):
                child.append('')
            for i in range(int(pax['infant'])):
                infant.append('')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            #CHECK INI
            set_session(request, 'time_limit', int(request.POST['time_limit_input']))
        except:
            pass

        is_lionair = False
        is_international = False
        for airline in request.session['airline_price_itinerary']['price_itinerary_provider']:
            for journey in airline['journeys']:
                for segment in journey['segments']:
                    for leg in segment['legs']:
                        if leg['origin_country'] != 'Indonesia' or leg['destination_country'] != 'Indonesia':
                            is_international = True
                            break
                        elif is_international == True:
                            break
            if airline['provider'] == 'lionair':
                is_lionair = True
            try:
                ff_request = request.session['airline_get_ff_availability']['result']['response']['ff_availability_provider']
            except:
                ff_request = []
        try:
            _logger.info('AIRLINE PASSENGER')
            values.update({
                'ff_request': ff_request,
                'static_path': path_util.get_static_path(MODEL_NAME),
                'is_lionair': is_lionair,
                'is_international': is_international,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'airline_request': request.session['airline_request'],
                'price': request.session['airline_price_itinerary'],
                'airline_carriers': carrier,
                'airline_pick': request.session['airline_price_itinerary']['price_itinerary_provider'],
                'adults': adult,
                'childs': child,
                'infants': infant,
                'adult_title': adult_title,
                'infant_title': infant_title,
                'id_types': id_type,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'signature': request.session['airline_signature'],
                'time_limit': request.session['time_limit'],
                'static_path_url_server': get_url_static_path(),
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def ssr(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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
            file = open(var_log_path()+"get_airline_carriers.txt", "r")
            carrier = json.loads(file.read())
            file.close()

            values = get_data_template(request)

            try:
                passenger = []
                for pax in request.session['airline_create_passengers']['adult']:
                    passenger.append(pax)
                for pax in request.session['airline_create_passengers']['child']:
                    passenger.append(pax)
                additional_price_input = ''
                additional_price = request.POST['additional_price_input'].split(',')
                for i in additional_price:
                    additional_price_input += i
                airline_ssr = request.session['airline_get_ssr']['result']['response']
                airline_list = []
                for ssr_provider in airline_ssr['ssr_availability_provider']:
                    for available in ssr_provider['ssr_availability']:
                        for journey in ssr_provider['ssr_availability'][available]:
                            for segment in journey['segments']:
                                if segment['carrier_code'] not in airline_list:
                                    airline_list.append(segment['carrier_code'])
                        break
                    ssr_provider.update({
                        'airline_list': airline_list
                    })
                    airline_list = []
                passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'airline_request': request.session['airline_request'],
                    'price': request.session['airline_price_itinerary'],
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'after_sales': 0,
                    'additional_price': float(additional_price_input),
                    'airline_carriers': carrier,
                    # 'airline_destinations': airline_destinations,
                    'airline_pick': request.session['airline_price_itinerary']['price_itinerary_provider'],
                    'upsell': request.session.get('airline_upsell_'+request.session['airline_signature']) and request.session.get('airline_upsell_'+request.session['airline_signature']) or 0,
                    'signature': request.session['airline_signature'],
                    'airline_ssrs': airline_ssr,
                    'passengers': passenger,
                    'username': request.session['user_account'],
                    'javascript_version': javascript_version,
                    'static_path_url_server': get_url_static_path(),
                    'time_limit': int(request.POST['time_limit_input']),
                    'airline_getbooking': ''
                })
            except:
                #dari getbooking
                #pax

                #CHECK SINI TEMBAK KO SAM
                adult = []
                infant = []
                child = []
                for pax in request.session['airline_get_booking_response']['result']['response']['passengers']:
                    if (datetime.now() - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 > 2:
                        pax_type = ''
                        if (datetime.now() - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 < 12:
                            adult.append({
                                "pax_type": 'CHD',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "passenger_id": pax['sequence']
                            })
                        else:
                            adult.append({
                                "pax_type": 'ADT',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "passenger_id": pax['sequence']
                            })
                    else:
                        adult.append({
                            "pax_type": 'INF',
                            "first_name": pax['first_name'],
                            "last_name": pax['last_name'],
                            "title": pax['title'],
                            "birth_date": pax['birth_date'],
                            "nationality_code": pax['nationality_code'],
                            "passport_number": pax['identity_number'],
                            "passport_expdate": pax['identity_expdate'],
                            "country_of_issued_code": pax['identity_country_of_issued_code'],
                            "identity_type": pax['identity_type'],
                            "passenger_id": pax['sequence']
                        })
                title_booker = 'MR'
                title_contact = 'MR'
                if request.session['airline_get_booking_response']['result']['response']['booker']['gender'] == 'female':
                    if request.session['airline_get_booking_response']['result']['response']['booker']['marital_status'] != '':
                        title_booker = 'MRS'
                    else:
                        title_booker = 'MS'
                airline_create_passengers = {
                    'booker': {
                        "first_name":
                            request.session['airline_get_booking_response']['result']['response']['booker'][
                                'first_name'],
                        "last_name":
                            request.session['airline_get_booking_response']['result']['response']['booker'][
                                'last_name'],
                        "title": title_booker,
                        "email":
                            request.session['airline_get_booking_response']['result']['response']['booker'][
                                'email'],
                        "calling_code":
                            request.session['airline_get_booking_response']['result']['response']['booker'][
                                'phones'][len(
                                request.session['airline_get_booking_response']['result']['response']['booker'][
                                    'phones']) - 1]['calling_code'],
                        "mobile":
                            request.session['airline_get_booking_response']['result']['response']['booker'][
                                'phones'][len(
                                request.session['airline_get_booking_response']['result']['response']['booker'][
                                    'phones']) - 1]['calling_number'],
                        "nationality_name":
                            request.session['airline_get_booking_response']['result']['response']['booker'][
                                'nationality_name'],
                        "contact_seq_id":
                            request.session['airline_get_booking_response']['result']['response']['booker'][
                                'seq_id']
                    },
                    'adult': adult,
                    'child': child,
                    'infant': infant
                }
                set_session(request, 'airline_create_passengers', airline_create_passengers)

                passenger = []
                for pax in adult:
                    passenger.append(pax)
                for pax in child:
                    passenger.append(pax)

                airline_ssr = request.session['airline_get_ssr']['result']['response']
                airline_list = []
                for ssr_provider in airline_ssr['ssr_availability_provider']:
                    for available in ssr_provider['ssr_availability']:
                        for journey in ssr_provider['ssr_availability'][available]:
                            for segment in journey['segments']:
                                if segment['carrier_code'] not in airline_list:
                                    airline_list.append(segment['carrier_code'])
                        break
                    ssr_provider.update({
                        'airline_list': airline_list
                    })
                    airline_list = []
                upsell = 0
                for pax in request.session['airline_get_booking_response']['result']['response']['passengers']:
                    if pax.get('channel_service_charges'):
                        upsell = pax.get('channel_service_charges')
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'after_sales': 1,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'airline_carriers': carrier,
                    'upsell': upsell,
                    'airline_getbooking': request.session['airline_get_booking_response']['result']['response'],
                    'airline_ssrs': airline_ssr,
                    'passengers': passenger,
                    'username': request.session['user_account'],
                    'static_path_url_server': get_url_static_path(),
                    'javascript_version': javascript_version,
                    'airline_request': '',
                    'price': '',
                    'additional_price': '',
                    'airline_pick': '',
                    'signature': request.session['airline_signature'],
                    'time_limit': '',
                })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_ssr_templates.html', values)
    else:
        return no_session_logout(request)

def seat_map(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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
            file = open(var_log_path()+"get_airline_carriers.txt", "r")
            for line in file:
                carrier = json.loads(line)
            file.close()

            values = get_data_template(request)

            ssr = []

            try:
                passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
                for pax in passenger:
                    if not 'seat_list' in pax:
                        pax['seat_list'] = []
                        for seat_provider in request.session['airline_get_seat_availability']['result']['response']['seat_availability_provider']:
                            for segment in seat_provider['segments']:
                                pax['seat_list'].append({
                                    'segment_code': segment['segment_code2'],
                                    'departure_date': segment['departure_date'],
                                    'seat_pick': '',
                                    'seat_code': '',
                                    'seat_name': '',
                                    'description': '',
                                    'currency': '',
                                    'price': ''
                                })
            except:
                #dari getbooking
                #CHECK SINI TEMBAK KO SAM
                #pax
                adult = []
                infant = []
                child = []
                for pax in request.session['airline_get_booking_response']['result']['response']['passengers']:
                    if (datetime.now() - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 > 2:
                        pax_type = ''
                        if (datetime.now() - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 < 12:
                            adult.append({
                                "pax_type": 'CHD',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "passenger_id": pax['sequence']
                            })
                        else:
                            adult.append({
                                "pax_type": 'ADT',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "passenger_id": pax['sequence']
                            })
                    else:
                        adult.append({
                            "pax_type": 'INF',
                            "first_name": pax['first_name'],
                            "last_name": pax['last_name'],
                            "title": pax['title'],
                            "birth_date": pax['birth_date'],
                            "nationality_code": pax['nationality_code'],
                            "passport_number": pax['identity_number'],
                            "passport_expdate": pax['identity_expdate'],
                            "country_of_issued_code": pax['identity_country_of_issued_code'],
                            "identity_type": pax['identity_type'],
                            "passenger_id": pax['sequence']
                        })
                title_booker = 'MR'
                title_contact = 'MR'
                if request.session['airline_get_booking_response']['result']['response']['booker']['gender'] == 'female':
                    if request.session['airline_get_booking_response']['result']['response']['booker']['marital_status'] != '':
                        title_booker = 'MRS'
                    else:
                        title_booker = 'MS'
                airline_create_passengers = {
                    'booker': {
                        "first_name": request.session['airline_get_booking_response']['result']['response']['booker'][
                            'first_name'],
                        "last_name": request.session['airline_get_booking_response']['result']['response']['booker'][
                            'last_name'],
                        "title": title_booker,
                        "email": request.session['airline_get_booking_response']['result']['response']['booker']['email'],
                        "calling_code":
                            request.session['airline_get_booking_response']['result']['response']['booker']['phones'][len(
                                request.session['airline_get_booking_response']['result']['response']['booker'][
                                    'phones']) - 1]['calling_code'],
                        "mobile": request.session['airline_get_booking_response']['result']['response']['booker']['phones'][
                            len(request.session['airline_get_booking_response']['result']['response']['booker'][
                                    'phones']) - 1]['calling_number'],
                        "nationality_code": request.session['airline_get_booking_response']['result']['response']['booker'][
                            'nationality_name'],
                        "contact_seq_id": request.session['airline_get_booking_response']['result']['response']['booker'][
                            'seq_id']
                    },
                    'adult': adult,
                    'child': child,
                    'infant': infant
                }
                set_session(request, 'airline_create_passengers', airline_create_passengers)
                passenger = []
                for pax in adult:
                    passenger.append(pax)
                for pax in child:
                    passenger.append(pax)

                passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
                for pax in passenger:
                    pax['seat_list'] = []
                    for seat_provider in request.session['airline_get_seat_availability']['result']['response']['seat_availability_provider']:
                        for segment in seat_provider['segments']:
                            pax['seat_list'].append({
                                'segment_code': segment['segment_code2'],
                                'departure_date': segment['departure_date'],
                                'seat_pick': '',
                                'seat_code': '',
                                'seat_name': '',
                                'description': '',
                                'currency': '',
                                'price': ''
                            })
            try:
                additional_price_input = ''
                additional_price = request.POST['additional_price_input'].split(',')
                for i in additional_price:
                    additional_price_input += i
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'airline_carriers': carrier,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'after_sales': 0,
                    'upsell': request.session.get('airline_upsell_'+request.session['airline_signature']) and request.session.get('airline_upsell_'+request.session['airline_signature']) or 0,
                    'airline_request': request.session['airline_request'],
                    'price': request.session['airline_price_itinerary'],
                    'additional_price': float(additional_price_input),
                    'passengers': passenger,
                    'username': request.session['user_account'],
                    'static_path_url_server': get_url_static_path(),
                    'javascript_version': javascript_version,
                    'time_limit': int(request.POST['time_limit_input']),
                    'airline_getbooking': ''
                })
            except:
                upsell = 0
                for pax in request.session['airline_get_booking_response']['result']['response']['passengers']:
                    if pax.get('channel_service_charges'):
                        upsell = pax.get('channel_service_charges')
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'airline_carriers': carrier,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'after_sales': 1,
                    'upsell': upsell,
                    'airline_getbooking': request.session['airline_get_booking_response']['result']['response'],
                    'additional_price': '',
                    'passengers': passenger,
                    'static_path_url_server': get_url_static_path(),
                    'username': request.session['user_account'],
                    'javascript_version': javascript_version,
                    'airline_request': '',
                    'price': '',
                    'time_limit': ''
                })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_seat_map_templates.html', values)
    else:
        return no_session_logout(request)

def seat_map_public(request, signature=-1):
    if signature != -1:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)
        file = open(var_log_path()+"get_airline_carriers.txt", "r")
        for line in file:
            carrier = json.loads(line)
        file.close()

        values = get_data_template(request)


        additional_price_input = '0'

        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_carriers': carrier,
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'phone_code': phone_code,
            'after_sales': 0,
            'additional_price': float(additional_price_input),
            # 'airline_destinations': airline_destinations,
            # 'airline_seat_map': request.session['airline_get_seat_availability']['result']['response'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            # 'cookies': json.dumps(res['result']['cookies']),
        })
        return render(request, MODEL_NAME+'/airline/airline_seat_map_public_templates.html', values)
    else:
        #error 404
        return no_session_logout(request)

def review(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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

            ssr = []
            if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-1] == 'ssr':
                try:
                    passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
                    sell_ssrs = []
                    sell_ssrs_request = []
                    passengers_list = []
                    for pax in passenger:
                        pax['ssr_list'] = []
                    ssr_response = request.session['airline_get_ssr']['result']['response']
                    for counter_ssr_availability_provider, ssr_package in enumerate(ssr_response['ssr_availability_provider']):
                        for ssr_key in ssr_package['ssr_availability']:
                            for counter_journey, journey_ssr in enumerate(ssr_package['ssr_availability'][ssr_key]):
                                for idx, pax in enumerate(passenger):
                                    try:
                                        passengers_list.append({
                                            "passenger_number": idx,
                                            "ssr_code": request.POST[ssr_key+'_'+str(counter_ssr_availability_provider+1)+'_'+str(idx+1)+'_'+str(counter_journey+1)].split('_')[0]
                                        })
                                        for list_ssr in journey_ssr['ssrs']:
                                            if request.POST[ssr_key +'_'+str(counter_ssr_availability_provider+1)+ '_' + str(idx + 1) + '_' + str(counter_journey + 1)].split('_')[0] == list_ssr['ssr_code']:
                                                pax['ssr_list'].append(list_ssr)
                                                break
                                    except:
                                        pass
                                if len(passengers_list) > 0:
                                    sell_ssrs_request.append({
                                        'journey_code': journey_ssr['journey_code'],
                                        'passengers': passengers_list,
                                        'availability_type': ssr_key
                                    })
                                passengers_list = []
                        if len(sell_ssrs_request) != 0:
                            sell_ssrs.append({
                                'sell_ssrs': sell_ssrs_request,
                                'provider': ssr_package['provider']
                            })
                        sell_ssrs_request = []
                    if len(sell_ssrs) > 0:
                        set_session(request, 'airline_ssr_request', sell_ssrs)
                    sell_ssrs = []
                except:
                    print('airline no ssr')

            #SEAT
            if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-1] == 'seat_map':
                try:
                    passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
                    passengers = json.loads(request.POST['passenger'])
                    #
                    for idx, pax in enumerate(passengers):
                        passenger[idx]['seat_list'] = passengers[idx]['seat_list']
                    seat_map_list = request.session['airline_get_seat_availability']['result']['response']
                    segment_seat_request = []

                    for seat_map_provider in seat_map_list['seat_availability_provider']:
                        for seat_segment in seat_map_provider['segments']:
                            pax_request = []
                            for idx, pax in enumerate(passengers):
                                for pax_seat in pax['seat_list']:
                                    if pax_seat['segment_code'] == seat_segment['segment_code2']:
                                        if pax_seat['seat_code'] != '':
                                            pax_request.append({
                                                'passenger_number': idx,
                                                'seat_code': pax_seat['seat_code']
                                            })
                                        break
                            if len(pax_request) != 0:
                                segment_seat_request.append({
                                    'segment_code': seat_segment['segment_code'],
                                    'provider': seat_segment['provider'],
                                    'passengers': pax_request
                                })
                            pax_request = []
                    set_session(request, 'airline_seat_request', segment_seat_request)

                except:
                    print('airline no seatmap')


            if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-1] == 'passenger':
                set_session(request, 'airline_seat_request', {})
                set_session(request, 'airline_ssr_request', {})
                adult = []
                child = []
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
                for i in range(int(request.session['airline_request']['adult'])):
                    ff_number = []
                    try:
                        ff_request = request.session['airline_get_ff_availability']['result']['response']['ff_availability_provider']
                    except:
                        ff_request = []
                    counter = 0
                    for j in ff_request:
                        if request.POST['adult_ff_number' + str(i + 1)+'_' + str(counter + 1)] != '':
                            code = ''
                            for k in j['ff_availability']:
                                if request.POST['adult_ff_request' + str(i + 1)+'_' + str(counter + 1)] == k['name']:
                                    code = k['ff_code']
                                    break
                            ff_number.append({
                                "schedule_id": j['schedule_id'],
                                "ff_number": request.POST['adult_ff_number' + str(i + 1)+'_' + str(counter + 1)],
                                "ff_code": code
                            })
                        counter += 1
                    adult.append({
                        "pax_type": "ADT",
                        "first_name": request.POST['adult_first_name' + str(i + 1)],
                        "last_name": request.POST['adult_last_name' + str(i + 1)],
                        "title": request.POST['adult_title' + str(i + 1)],
                        "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                        "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                        "identity_country_of_issued_name": request.POST['adult_country_of_issued' + str(i + 1)],
                        "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                        "identity_number": request.POST['adult_passport_number' + str(i + 1)],
                        "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                        "identity_type": "passport",
                        "ff_numbers": ff_number
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
                        if request.POST['adult_cp' + str(i+1)] == 'on':
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

                for i in range(int(request.session['airline_request']['child'])):
                    ff_number = []
                    try:
                        ff_request = request.session['airline_get_ff_availability']['result']['response']['ff_availability_provider']
                    except:
                        ff_request = []
                    counter = 0
                    for j in ff_request:
                        if request.POST['child_ff_number' + str(i + 1) + '_' + str(counter + 1)] != '':
                            code = ''
                            for k in j['ff_availability']:
                                if request.POST['child_ff_request' + str(i + 1) + '_' + str(counter + 1)] == k['name']:
                                    code = k['ff_code']
                                    break
                            ff_number.append({
                                "schedule_id": j['schedule_id'],
                                "ff_number": request.POST['child_ff_number' + str(i + 1) + '_' + str(counter + 1)],
                                "ff_code": code
                            })
                        counter += 1
                    child.append({
                        "pax_type": "CHD",
                        "first_name": request.POST['child_first_name' + str(i + 1)],
                        "last_name": request.POST['child_last_name' + str(i + 1)],
                        "title": request.POST['child_title' + str(i + 1)],
                        "birth_date": request.POST['child_birth_date' + str(i + 1)],
                        "nationality_name": request.POST['child_nationality' + str(i + 1)],
                        "identity_number": request.POST['child_passport_number' + str(i + 1)],
                        "identity_expdate": request.POST['child_passport_expired_date' + str(i + 1)],
                        "identity_country_of_issued_name": request.POST['child_country_of_issued' + str(i + 1)],
                        "passenger_seq_id": request.POST['child_id' + str(i + 1)],
                        "identity_type": "passport",
                        "ff_numbers": ff_number
                    })

                for i in range(int(request.session['airline_request']['infant'])):
                    infant.append({
                        "pax_type": "INF",
                        "first_name": request.POST['infant_first_name' + str(i + 1)],
                        "last_name": request.POST['infant_last_name' + str(i + 1)],
                        "title": request.POST['infant_title' + str(i + 1)],
                        "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                        "nationality_name": request.POST['infant_nationality' + str(i + 1)],
                        "identity_number": request.POST['infant_passport_number' + str(i + 1)],
                        "identity_expdate": request.POST['infant_passport_expired_date' + str(i + 1)],
                        "identity_country_of_issued_name": request.POST['infant_country_of_issued' + str(i + 1)],
                        "passenger_seq_id": request.POST['infant_id' + str(i + 1)],
                        "identity_type": "passport",
                    })
                airline_create_passengers = {
                    'booker': booker,
                    'adult': adult,
                    'child': child,
                    'infant': infant,
                    'contact': contact
                }
                set_session(request, 'airline_create_passengers', airline_create_passengers)

                request.session.modified = True
                passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
                for pax in passenger:
                    pax['ssr_list'] = []
            else:
                passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
            file = open(var_log_path()+"get_airline_carriers.txt", "r")
            for line in file:
                airline_carriers = json.loads(line)
            file.close()
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            additional_price_input = ''
            additional_price = request.POST['additional_price_input'].split(',')
            for i in additional_price:
                additional_price_input += i
            force_issued = True
            for airline in request.session['airline_price_itinerary']['price_itinerary_provider']:
                if airline['provider'] == 'traveloka':
                    force_issued = False


            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'upsell': request.session.get('airline_upsell_'+request.session['airline_signature']) and request.session.get('airline_upsell_'+request.session['airline_signature']) or 0,
                'ssr': request.session.get('airline_get_ssr')['result']['error_code'] if request.session.get('airline_get_ssr') else 1,
                'seat': request.session.get('airline_get_seat_availability')['result']['error_code'] if request.session.get('airline_get_seat_availability') else 1,
                'airline_request': request.session['airline_request'],
                'price': request.session['airline_price_itinerary'],
                'airline_pick': request.session['airline_price_itinerary']['price_itinerary_provider'],
                'back_page': request.META.get('HTTP_REFERER'),
                'json_airline_pick': request.session['airline_price_itinerary']['price_itinerary_provider'],
                'airline_carriers': airline_carriers,
                'additional_price': float(additional_price_input.split(' ')[len(additional_price_input.split(' '))-1]),
                'username': request.session['user_account'],
                'passengers': request.session['airline_create_passengers'],
                'passengers_ssr': passenger,
                'force_issued': force_issued,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'signature': request.session['airline_signature'],
                'time_limit': int(request.POST['time_limit_input']),
                # 'co_uid': request.session['co_uid'],
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_review_templates.html', values)
    else:
        return no_session_logout(request)

def review_after_sales(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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
            goto = 0
            ssr = []

            if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-1] == 'ssr':
                try:
                    passenger = request.session['airline_create_passengers']['adult'] + request.session['airline_create_passengers']['child']
                    sell_ssrs = []
                    sell_ssrs_request = []
                    passengers_list = []
                    page = 'ssr'
                    for pax in passenger:
                        pax['ssr_list'] = []
                    ssr_response = request.session['airline_get_ssr']['result']['response']
                    data_booking = request.session['airline_get_booking_response']['result']['response']['provider_bookings']
                    for counter_ssr_availability_provider, ssr_package in enumerate(ssr_response['ssr_availability_provider']):
                        for ssr_key in ssr_package['ssr_availability']:
                            for counter_journey, journey_ssr in enumerate(ssr_package['ssr_availability'][ssr_key]):
                                for idx, pax in enumerate(passenger):
                                    try:
                                        passengers_list.append({
                                            "passenger_number": idx,
                                            "ssr_code": request.POST[ssr_key+'_'+str(counter_ssr_availability_provider+1)+'_'+str(idx+1)+'_'+str(counter_journey+1)].split('_')[0]
                                        })
                                        for list_ssr in journey_ssr['ssrs']:
                                            if request.POST[ssr_key +'_'+str(counter_ssr_availability_provider+1)+ '_' + str(idx + 1) + '_' + str(counter_journey + 1)].split('_')[0] == list_ssr['ssr_code']:
                                                pax['ssr_list'].append(list_ssr)
                                                break
                                    except:
                                        pass
                                if len(passengers_list) > 0:
                                    sell_ssrs_request.append({
                                        'journey_code': journey_ssr['journey_code'],
                                        'passengers': passengers_list,
                                        'availability_type': ssr_key
                                    })
                                passengers_list = []
                        if len(sell_ssrs_request) != 0:
                            sell_ssrs.append({
                                'sell_ssrs': sell_ssrs_request,
                                'pnr': data_booking[counter_ssr_availability_provider]['pnr']
                                # 'provider': ssr_package['provider'] ganti ke pnr
                            })
                        sell_ssrs_request = []
                    if len(sell_ssrs) > 0:
                        request.session['airline_ssr_request'] = sell_ssrs
                    sell_ssrs = []
                except:
                    print('airline no ssr')

            # SEAT
            if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/')) - 1] == 'seat_map':
                try:
                    passenger = request.session['airline_create_passengers']['adult'] + \
                                request.session['airline_create_passengers']['child']
                    passengers = json.loads(request.POST['passenger'])
                    #
                    page = 'seat'
                    for idx, pax in enumerate(passengers):
                        passenger[idx]['seat_list'] = passengers[idx]['seat_list']
                    seat_map_list = request.session['airline_get_seat_availability']['result']['response']
                    segment_seat_request = []
                    data_booking = request.session['airline_get_booking_response']['result']['response']['provider_bookings']
                    for counter_seat_availability_provider, seat_map_provider in enumerate(seat_map_list['seat_availability_provider']):
                        for seat_segment in seat_map_provider['segments']:
                            pax_request = []
                            for idx, pax in enumerate(passengers):
                                for pax_seat in pax['seat_list']:
                                    if pax_seat['segment_code'] == seat_segment['segment_code2']:
                                        if pax_seat['seat_code'] != '':
                                            pax_request.append({
                                                'passenger_number': idx,
                                                'seat_code': pax_seat['seat_code']
                                            })
                                        break
                            if len(pax_request) != 0:
                                segment_seat_request.append({
                                    'segment_code': seat_segment['segment_code'],
                                    'pnr': data_booking[counter_seat_availability_provider]['pnr'],
                                    # 'provider': seat_segment['provider'], ganti ke pnr
                                    'passengers': pax_request
                                })
                            pax_request = []
                    set_session(request, 'airline_seat_request', segment_seat_request)
                except:
                    print('airline no seatmap')

            # agent
            # TODO LIST INTRO SSR sudah list perpassenger --> list per segment --> isi semua ssr tinggal dipisah
            # tampilkan ssr ke depan & pisah send api

            # get_balance(request)
            try:
                additional_price_input = ''
                additional_price = request.POST['additional_price_input'].split(',')
                for i in additional_price:
                    additional_price_input += i
            except:
                additional_price_input = 0

            file = open(var_log_path()+"get_airline_carriers.txt", "r")
            for line in file:
                airline_carriers = json.loads(line)
            file.close()

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'back_page': request.META.get('HTTP_REFERER'),
                'airline_carriers': airline_carriers,
                'goto': goto,
                'airline_getbooking': request.session['airline_get_booking_response']['result']['response'],
                'additional_price': float(additional_price_input.split(' ')[len(additional_price_input.split(' '))-1]),
                'username': request.session['user_account'],
                'passengers': request.session['airline_create_passengers'],
                'passengers_ssr': passenger,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'signature': request.session['airline_signature'],
                'time_limit': 1200,
                'page': page
                # 'co_uid': request.session['co_uid'],
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/airline/airline_review_after_sales_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()
        if 'airline_create_passengers' in request.session:
            del request.session['airline_create_passengers']
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            file = open(var_log_path()+"get_airline_carriers.txt", "r")
            for line in file:
                airline_carriers = json.loads(line)
            file.close()
        except Exception as e:
            _logger.error('ERROR get_airline_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        values = get_data_template(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            set_session(request, 'airline_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'airline_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'airline_carriers': airline_carriers,
            'order_number': request.session['airline_order_number'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/airline/airline_booking_templates.html', values)

def refund(request, order_number):
    try:
        javascript_version = get_javascript_version()
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            file = open(var_log_path()+"get_airline_carriers.txt", "r")
            for line in file:
                airline_carriers = json.loads(line)
            file.close()
        except Exception as e:
            _logger.error('ERROR get_airline_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        values = get_data_template(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            set_session(request, 'airline_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'airline_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'airline_carriers': airline_carriers,
            'order_number': request.session['airline_order_number'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/airline/airline_booking_refund_templates.html', values)
