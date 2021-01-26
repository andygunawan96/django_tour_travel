from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import datetime
from tools.parser import *
from ..static.tt_webservice.url import *
from .tt_webservice_views import *
from .tt_webservice_voucher_views import *
from .tt_webservice import *
import json
import logging
import traceback
import copy
import time
_logger = logging.getLogger("rodextrip_logger")

month = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',

}

cabin_class_list = {
    'All': 'ALL',
    'Y': 'Economy',
    'W': 'Premium Economy',
    'C': 'Business',
    'F': 'First',
    'ALL': 'All',
    'Economy': 'Y',
    'Premium': 'W',
    'Business': 'C',
    'First': 'F',
}

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'get_carrier_providers':
            res = get_carrier_providers(request)
        elif req_data['action'] == 'get_carriers_search':
            res = get_carriers_search(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'get_provider_description':
            res = get_provider_description(request)
        elif req_data['action'] == 'get_carrier_code_list':
            res = get_carrier_code_list(request)
        elif req_data['action'] == 'search':
            res = search2(request)
        elif req_data['action'] == 'get_price_itinerary':
            res = get_price_itinerary(request, False, 1)
        elif req_data['action'] == 'get_fare_rules':
            res = get_fare_rules(request)
        elif req_data['action'] == 'sell_journeys':
            res = sell_journeys(request)
        elif req_data['action'] == 'get_ssr_availability':
            res = get_ssr_availability(request)
        elif req_data['action'] == 'get_seat_availability':
            res = get_seat_availability(request)
        elif req_data['action'] == 'get_post_ssr_availability':
            res = get_post_ssr_availability(request)
        elif req_data['action'] == 'get_post_seat_availability':
            res = get_post_seat_availability(request)
        elif req_data['action'] == 'get_ff_availability':
            res = get_ff_availability(request)
        elif req_data['action'] == 'get_seat_map_response':
            res = get_seat_map_response(request)
        elif req_data['action'] == 'get_pax':
            res = get_pax(request)
        elif req_data['action'] == 'update_contacts':
            res = update_contacts(request)
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'sell_ssrs':
            res = sell_ssrs(request)
        elif req_data['action'] == 'assign_seats':
            res = assign_seats(request)
        elif req_data['action'] == 'sell_post_ssrs':
            res = sell_post_ssrs(request)
        elif req_data['action'] == 'assign_post_seats':
            res = assign_post_seats(request)
        elif req_data['action'] == 'update_booking':
            res = update_booking(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'cancel':
            res = cancel(request)
        elif req_data['action'] == 'update_refund_booking':
            res = update_refund_booking(request)
        elif req_data['action'] == 'reissue':
            res = reissue(request)
        elif req_data['action'] == 'sell_journey_reissue_construct':
            res = sell_journey_reissue_construct(request, False, 1)
        elif req_data['action'] == 'command_cryptic':
            res = command_cryptic(request)
        elif req_data['action'] == 'get_refund_booking':
            res = get_refund_booking(request)
        elif req_data['action'] == 'pre_refund_login':
            res = pre_refund_login(request)
        elif req_data['action'] == 'get_provider_booking_from_vendor':
            res = get_provider_booking_from_vendor(request)
        elif req_data['action'] == 'get_retrieve_booking_from_vendor':
            res = get_retrieve_booking_from_vendor(request)
        elif req_data['action'] == 'save_retrieve_booking_from_vendor':
            res = save_retrieve_booking_from_vendor(request)

        # elif req_data['action'] == 'get_buy_information':
        #     res = get_buy_information(request)
        # elif req_data['action'] == 'create_passengers':
        #     res = create_passengers(request)
        # elif req_data['action'] == 'ssr':
        #     res = set_ssr_ff(request)

        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "signin",
            "signature": ''
        }

        data = {
            "user": user_global,
            "password": password_global,
            "api_key": api_key,
            # "co_user": request.session['username'],
            # "co_password": request.session['password'],
            "co_user": request.session.get('username') or user_default,
            "co_password": request.session.get('password') or password_default,
            "co_uid": ""
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'airline_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])

            _logger.info(json.dumps(request.session['airline_signature']))
            _logger.info("SIGNIN AIRLINE SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_carrier_code_list(request):
    try:
        data = {
            'provider_type': 'airline'
        }
        signature = ''
        try:
            signature = request.POST['signature']
        except:
            signature = request.data['signature']
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers",
            "signature": signature
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_with_folder_path("get_airline_active_carriers")
    if not file:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                res.update({
                    'GA1': {
                        'name': 'Garuda Indonesia - AGS',
                        'code': 'GA1',
                        'icao': 'GIA',
                        'call_sign': 'INDONESIA',
                        'provider_type': 'airline',
                        'active': True,
                        'is_favorite': False
                    },
                    # 'GA2': {
                    #     'name': 'Garuda Indonesia - Althea',
                    #     'code': 'GA2',
                    #     'icao': 'GIA',
                    #     'call_sign': 'INDONESIA',
                    #     'provider_type': 'airline',
                    #     'active': True,
                    #     'is_favorite': False
                    # },
                    'GA3': {
                        'name': 'Garuda Indonesia - Amadeus (GDS)',
                        'code': 'GA3',
                        'icao': 'GIA',
                        'call_sign': 'INDONESIA',
                        'provider_type': 'airline',
                        'active': True,
                        'is_favorite': False
                    },
                    # 'SQ1': {
                    #     'name': 'Singapore Airlines - NDC',
                    #     'code': 'SQ1',
                    #     'icao': 'SIA',
                    #     'call_sign': 'SINGAPORE',
                    #     'provider_type': 'airline',
                    #     'active': True,
                    #     'is_favorite': True
                    # },
                    'SQ2': {
                        'name': 'Singapore Airlines - Amadeus (GDS)',
                        'code': 'SQ2',
                        'icao': 'SIA',
                        'call_sign': 'SINGAPORE',
                        'provider_type': 'airline',
                        'active': True,
                        'is_favorite': True
                    }
                })
                fav = {}
                carrier_code_list = {}
                for key in res:
                    if res[key]['is_favorite'] == True:
                        fav.update({
                            key: res[key]
                        })
                    else:
                        carrier_code_list.update({
                            res[key]['name']: key
                        })

                for key in sorted(carrier_code_list):
                    fav.update({
                        carrier_code_list[key]: res[carrier_code_list[key]]
                    })

                res = fav
                try:
                    write_cache_with_folder(res, "get_airline_active_carriers")
                    _logger.info("get_carriers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_airline_active_carriers file \n' + str(e) + '\n' + traceback.format_exc())
            else:
                try:
                    file = read_cache_with_folder_path("get_airline_active_carriers", 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers AIRLINE ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_airline_active_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_airline_active_carriers", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_airline_active_carriers file\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_carrier_providers(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carrier_providers",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_list_provider")
    if not file:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_list_provider")
                _logger.info("get_carrier_providers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_list_provider")
                    if file:
                        res = file
                    _logger.info("get_carrier_providers ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carrier_provider file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_list_provider", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_list_provider file\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_carriers(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_airline_carriers")
    if not file:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_airline_carriers")
                _logger.info("get_carriers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_airline_carriers")
                    if file:
                        res = file
                    _logger.info("get_carriers AIRLINE ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_airline_carriers", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_airline_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_carriers_search(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers_search",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_airline_active_carriers")
    if not file:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_airline_active_carriers")
                _logger.info("get_carriers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_airline_active_carriers")
                    if file:
                        res = file
                    _logger.info("get_carriers AIRLINE ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_airline_active_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_airline_active_carriers", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_airline_active_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_provider_description(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_list",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_list_provider_data")
    if not file:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                temp = {}
                for i in res['result']['response']['providers']:
                    temp[i['provider']] = i
                res = temp
                write_cache_with_folder(temp, "get_list_provider_data")
                _logger.info("get_provider_list AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_list_provider_data")
                    if file:
                        res = file
                    _logger.info("get_provider_list ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_list_provider_data file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_list_provider_data", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_list_provider_data file\n' + str(e) + '\n' + traceback.format_exc())
    return res

def search2(request):
    # get_data_awal
    try:
        # airline
        airline_destinations = []
        file = read_cache_with_folder_path("airline_destination", 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country'],
            })
        data_search = json.loads(request.POST['search_request'])
        direction = 'MC'
        journey_list = []
        if data_search['is_combo_price'] == 'false':
            is_combo_price = False
        else:
            is_combo_price = True
        if data_search['direction'] == 'MC':
            for idx, i in enumerate(data_search['origin']):
                departure_date = '%s-%s-%s' % (
                    data_search['departure'][idx].split(' ')[2],
                    month[data_search['departure'][idx].split(' ')[1]],
                    data_search['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': data_search['origin'][idx].split(' - ')[0],
                    'destination': data_search['destination'][idx].split(' - ')[0],
                    'departure_date': departure_date
                })
            cabin_class = data_search['cabin_class'][0]
        elif data_search['direction'] == 'RT':
            for idx, i in enumerate(data_search['origin']):
                departure_date = '%s-%s-%s' % (
                    data_search['departure'][idx].split(' ')[2],
                    month[data_search['departure'][idx].split(' ')[1]],
                    data_search['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': data_search['origin'][idx].split(' - ')[0],
                    'destination': data_search['destination'][idx].split(' - ')[0],
                    'departure_date': departure_date
                })
            cabin_class = data_search['cabin_class'][0]
        else:
            #default
            departure_date = '%s-%s-%s' % (
                data_search['departure'][int(request.POST['counter_search'])].split(' ')[2],
                month[data_search['departure'][int(request.POST['counter_search'])].split(' ')[1]],
                data_search['departure'][int(request.POST['counter_search'])].split(' ')[0])
            journey_list.append({
                'origin': data_search['origin'][int(request.POST['counter_search'])].split(' - ')[0],
                'destination': data_search['destination'][int(request.POST['counter_search'])].split(' - ')[0],
                'departure_date': departure_date
            })
            cabin_class = data_search['cabin_class'][int(request.POST['counter_search'])]
            is_combo_price = False

        data = {
            "journey_list": journey_list,
            "direction": direction,
            "is_combo_price": is_combo_price,
            "adult": int(data_search['adult']),
            "child": int(data_search['child']),
            "infant": int(data_search['infant']),
            "cabin_class": cabin_class,
            "provider": request.POST['provider'],
            # "provider": 'amadeus',
            "carrier_codes": json.loads(request.POST['carrier_codes']),
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['airline_search']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['signature']
            }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=120)
    try:
        if res['result']['error_code'] == 0:
            if 'airline_search' not in request.session._session:
                set_session(request, 'airline_search', data)
            for journey_list in res['result']['response']['schedules']:
                for journey in journey_list['journeys']:
                    journey['is_combo_price'] = False
                    journey.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']))
                    })
                    if journey.get('arrival_date_return'):
                        journey.update({
                            'departure_date_return': parse_date_time_front_end(string_to_datetime(journey['departure_date_return'])),
                            'arrival_date_return': parse_date_time_front_end(string_to_datetime(journey['arrival_date_return']))
                        })
                    if journey.get('return_date'):
                        journey.update({
                            'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                        })
                    for destination in airline_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                                'origin_country': destination['country'],
                            })
                            break
                    for destination in airline_destinations:
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                                'destination_country': destination['country'],
                            })
                            break
                    for segment in journey['segments']:
                        segment.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(segment['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                        })
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break

                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': parse_date_time_front_end(string_to_datetime(leg['departure_date'])),
                                'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                            })

                            for destination in airline_destinations:
                                if destination['code'] == leg['origin']:
                                    leg.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                        'origin_country': destination['country'],
                                    })
                                    break

                            for destination in airline_destinations:
                                if destination['code'] == leg['destination']:
                                    leg.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                        'destination_country': destination['country'],
                                    })
                                    break
            logging.getLogger("error_info").error("SUCCESS SEARCH AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR SEARCH AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error('Error response airline search\n' + str(e) + '\n' + traceback.format_exc())
    try:
        response_search = res['result']

    except:
        response_search = {
            'result': res
        }
    return response_search

def get_data(request):
    try:
        file = read_cache_with_folder_path("airline_destination", 90911)
        if file:
            response = file

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error('ERROR airline_destination file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def get_price_itinerary(request, boolean, counter):
    try:
        #baru
        airline_destinations = []
        file = read_cache_with_folder_path("airline_destination", 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country'],
            })
        #baru
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])
        for idx, journey in enumerate(journey_booking):
            if boolean == True:
                #NO COMBO
                journeys.append({'segments': journey['segments']})
                schedules.append({'journeys': journeys, 'provider': journey['provider']})
                journeys = []
            else:
                #COMBO
                check = 0
                journeys.append({'segments': journey['segments']})
                for schedule in schedules:
                    if schedule['provider'] == journey['provider']:
                        schedule['journeys'].append({
                            'segments': journey['segments']
                        })
                        check = 1
                        break
                    # for segment in journey['segments']:
                    #     if segment['carrier_code'] in schedule['carrier_code']:
                    #         schedule['journeys'].append({
                    #             'segments': journey['segments']
                    #         })
                    #         check = 1
                    #         break
                    if check == 1:
                        break
                if check == 0:
                    carrier_code = []
                    for segment in journey['segments']:
                        carrier_code.append(segment['carrier_code'])
                    schedules.append({
                        'journeys': journeys,
                        'provider': journey['provider'],
                        'carrier_code': carrier_code
                    })
                journeys = []
        airline_request = copy.deepcopy(request.session['airline_request'])
        data = {
            "promo_codes": json.loads(request.POST['promo_codes']),
            "adult": int(airline_request['adult']),
            "child": int(airline_request['child']),
            "infant": int(airline_request['infant']),
            "schedules": schedules,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_price_itinerary",
            "signature": request.POST['signature'],
        }

        set_session(request, 'airline_get_price_request', data)
        _logger.info(json.dumps(request.session['airline_get_price_request']))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        data = json.loads(request.POST['data'])
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_price_itinerary",
            "signature": request.POST['signature']
        }

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=120)

    try:
        if res['result']['error_code'] == 0:
            try:
                for price_itinerary_provider in res['result']['response']['price_itinerary_provider']:
                    for journey in price_itinerary_provider['journeys']:
                        journey.update({
                            'rules': [],
                            'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']))
                        })
                        if journey.get('arrival_date_return'):
                            journey.update({
                                'departure_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['departure_date_return'])),
                                'arrival_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['arrival_date_return']))
                            })
                        if journey.get('return_date'):
                            journey.update({
                                'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                            })
                        for destination in airline_destinations:
                            if destination['code'] == journey['origin']:
                                journey.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == journey['destination']:
                                journey.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break
                        for segment in journey['segments']:
                            segment.update({
                                'departure_date': parse_date_time_front_end(string_to_datetime(segment['departure_date'])),
                                'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                            })
                            for destination in airline_destinations:
                                if destination['code'] == segment['origin']:
                                    segment.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                        'origin_country': destination['country'],
                                    })
                                    break

                            for destination in airline_destinations:
                                if destination['code'] == segment['destination']:
                                    segment.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                        'destination_country': destination['country'],
                                    })
                                    break

                            for leg in segment['legs']:
                                leg.update({
                                    'departure_date': parse_date_time_front_end(string_to_datetime(leg['departure_date'])),
                                    'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                                })

                                for destination in airline_destinations:
                                    if destination['code'] == leg['origin']:
                                        leg.update({
                                            'origin_city': destination['city'],
                                            'origin_name': destination['name'],
                                            'origin_country': destination['country'],
                                        })
                                        break

                                for destination in airline_destinations:
                                    if destination['code'] == leg['destination']:
                                        leg.update({
                                            'destination_city': destination['city'],
                                            'destination_name': destination['name'],
                                            'destination_country': destination['country'],
                                        })
                                        break
            except:
                pass
            _logger.info("SUCCESS get_price_itinerary AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
            try:
                set_session(request, 'airline_price_itinerary', res['result']['response'])
                _logger.info(json.dumps(request.session['airline_price_itinerary']))
            except:
                pass
        elif boolean == True:
            pass
        else:
            # if(request.session['airline_request']['direction'] == 'RT'):
            #MC atau RT SEPARATE
            counter += 1
            if counter < 4:
                res = get_price_itinerary(request, True, counter)
                boolean = True
    except Exception as e:
        counter += 1
        if counter < 4:
            get_price_itinerary(request, True, counter)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    try:
        if boolean == False:
            check_special_price = True
            for schedule in data['schedules']:
                if len(schedule['journeys']) > 1:
                    check_special_price = False
                    break
            res['result']['response'].update({
                'is_combo_price': not check_special_price
            })
        else:
            res['result']['response'].update({
                'is_combo_price': not boolean
            })
        res['result']['request'] = data
    except Exception as e:
        pass
    return res

def get_fare_rules(request):
    try:
        data = request.session['airline_get_price_request']
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_fare_rules",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        data = json.loads(request.POST['data'])
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_fare_rules",
            "signature": request.POST['signature'],
        }
        _logger.error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')

    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_fare_rules AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_fare_rules_airline ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_journeys(request):
    #nanti ganti ke select journey
    try:
        data = request.session['airline_get_price_request']
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_journeys",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        if request.POST.get('data'):
            data = json.loads(request.POST['data'])
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "sell_journeys",
                "signature": request.POST['signature'],
            }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    if 'sell_journey' + request.POST['signature'] not in request.session or request.session.get('sell_journey_data' + request.POST['signature']) != data:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    else:
        res = request.session['sell_journey'+request.POST['signature']]
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'sell_journey'+request.POST['signature'], res)
            set_session(request, 'sell_journey_data'+request.POST['signature'], data)
            _logger.info("SUCCESS sell_journeys AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR sell_journeys_airline AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_ssr_availability(request):
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_ssr_availability",
        "signature": request.POST['signature'],
    }
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            try:
                logging.getLogger("error_info").info("get_ssr_availability AIRLINE SIGNATURE " + request.POST['signature'])
                for ssr_availability_provider in res['result']['response']['ssr_availability_provider']:
                    for ssr_availability in ssr_availability_provider['ssr_availability']:
                        for ssrs in ssr_availability_provider['ssr_availability'][ssr_availability]:
                            ssrs.update({
                                'origin': ssrs['segments'][0]['origin'],
                                'destination': ssrs['segments'][len(ssrs['segments']) - 1]['destination']
                            })
                            for ssr in ssrs['ssrs']:
                                total = 0
                                currency = ''
                                for service_charge in ssr['service_charges']:
                                    currency = service_charge['currency']
                                    total += service_charge['amount']
                                ssr['total_price'] = total
                                ssr['currency'] = currency

            except:
                pass
                _logger.error("get_ssr_availability_airline AIRLINE SIGNATURE " + request.POST['signature'] + json.dumps(res))

            set_session(request, 'airline_get_ssr', res)
            _logger.info(json.dumps(request.session['airline_get_ssr']))
        else:
            set_session(request, 'airline_get_ssr', res)
            _logger.info(json.dumps(request.session['airline_get_ssr']))

            _logger.error("get_ssr_availability_airline ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        set_session(request, 'airline_get_ssr', res)
        _logger.info(json.dumps(request.session['airline_get_ssr']))
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_seat_availability(request):
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_seat_availability",
        "signature": request.POST['signature'],
    }
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    set_session(request, 'airline_get_seat_availability', res)
    _logger.info(json.dumps(request.session['airline_get_seat_availability']))
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("error_info").info("get_seat_availability AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_seat_availability ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_ff_availability(request):
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_ff_availability",
        "signature": request.POST['signature'],
    }
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    set_session(request, 'airline_get_ff_availability', res)
    _logger.info(json.dumps(request.session['airline_get_ff_availability']))
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("error_info").info("get_ff_availability AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_ff_availability ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_seat_map_response(request):
    return request.session['airline_get_seat_availability']['result']['response']

def get_pax(request):
    return request.session['airline_create_passengers']

def update_contacts(request):
    try:
        booker = copy.deepcopy(request.session['airline_create_passengers']['booker'])
        contacts = copy.deepcopy(request.session['airline_create_passengers']['contact'])
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        for country in response['result']['response']['airline']['country']:
            if booker['nationality_name'] == country['name']:
                booker['nationality_code'] = country['code']
                break

        for pax in contacts:
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break
        data = {
            'booker': booker,
            'contacts': contacts
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_contacts",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    if 'airline_update_contact' + request.POST['signature'] not in request.session or request.session.get('airline_update_contact_data' + request.POST['signature']) != data:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    else:
        res = request.session['airline_update_contact'+request.POST['signature']]
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'airline_update_contact'+request.POST['signature'], res)
            set_session(request, 'airline_update_contact_data'+request.POST['signature'], data)
            _logger.info("SUCCESS update_contacts AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_contacts_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_passengers(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        passenger = []
        passenger_cache = copy.deepcopy(request.session['airline_create_passengers'])
        for pax_type in passenger_cache:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in passenger_cache[pax_type]:
                    if pax['nationality_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['nationality_name'] == country['name']:
                                pax['nationality_code'] = country['code']
                                break

                    if pax['identity_country_of_issued_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['identity_country_of_issued_name'] == country['name']:
                                pax['identity_country_of_issued_code'] = country['code']
                                break
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s-%s-%s' % (
                                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                                pax['birth_date'].split(' ')[0]),
                        })
                    if pax['identity_expdate'] != '':
                        pax.update({
                            'identity_expdate': '%s-%s-%s' % (
                                pax['identity_expdate'].split(' ')[2], month[pax['identity_expdate'].split(' ')[1]],
                                pax['identity_expdate'].split(' ')[0])
                        })
                        pax['identity'] = {
                            "identity_country_of_issued_name": pax.pop('identity_country_of_issued_name'),
                            "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                            "identity_expdate": pax.pop('identity_expdate'),
                            "identity_number": pax.pop('identity_number'),
                            "identity_type": pax.pop('identity_type'),
                        }

                    else:
                        pax.pop('identity_country_of_issued_name')
                        pax.pop('identity_expdate')
                        pax.pop('identity_number')
                        pax.pop('identity_type')
                    passenger.append(pax)

        data = {
            'passengers': passenger
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_passengers",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    if 'airline_update_passengers' + request.POST['signature'] not in request.session or request.session.get('airline_update_passengers_data' + request.POST['signature']) != data:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    else:
        res = request.session['airline_update_passengers' + request.POST['signature']]
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'airline_update_passengers' + request.POST['signature'], res)
            set_session(request, 'airline_update_passengers_data' + request.POST['signature'], data)
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_ssrs(request):
    try:
        data = {
            'sell_ssrs_request': request.session['airline_ssr_request']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_ssrs",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    if 'airline_sell_ssrs' + request.POST['signature'] in request.session:
        res = request.session['airline_sell_ssrs' + request.POST['signature']]
    elif request.session['airline_ssr_request'] != {}:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST',timeout=300)
    try:
        if res['result']['error_code'] == 0:

            set_session(request, 'airline_sell_ssrs' + request.POST['signature'], res)
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        if request.session['airline_ssr_request'] == {}:
            _logger.error("NO SSR")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'sell_ssr_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def assign_seats(request):
    try:
        data = {
            'segment_seat_request': request.session['airline_seat_request']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "assign_seats",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    if 'airline_seat_request' + request.POST['signature'] in request.session:
        res = request.POST['airline_seat_request' + request.POST['signature']]
    elif len(request.session['airline_seat_request']) != 0:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST',timeout=300)
    try:
        if res['result']['error_code'] == 0:
            request.POST['airline_seat_request' + request.POST['signature']] = res
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        if len(request.session['airline_seat_request']) == 0:
            _logger.error("NO seat")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'seat_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    #nanti ganti ke get_ssr_availability
    try:
        data = {
            'force_issued': bool(int(request.POST['value']))
        }
        try:
            if bool(int(request.POST['value'])) == True:
                if request.POST['member'] == 'non_member':
                    member = False
                else:
                    member = True
                data.update({
                    'member': member,
                    'seq_id': request.POST['seq_id'],
                    'voucher': {}
                })
            provider = []
            for provider_type in request.session['airline_price_itinerary']['price_itinerary_provider']:
                if not provider_type['provider'] in provider:
                    provider.append(provider_type['provider'])
            if request.POST['voucher_code'] != '':
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'airline', provider),
                })
            # data.update({
            #     'bypass_psg_validator': request.POST['bypass_psg_validator']
            # })
        except:
            pass
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR commit_booking_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def get_booking(request):
    try:
        sync = False
        try:
            if request.POST['sync'] == 'true':
                sync = True
        except Exception as e:
            _logger.error('get refund booking')
        data = {
            'order_number': request.POST['order_number'],
            'force_sync': sync
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        file = read_cache_with_folder_path("airline_destination", 90911)
        if file:
            response = file
        airline_destinations = []
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city']
            })
        if res['result']['error_code'] == 0:
            for pax in res['result']['response']['passengers']:
                try:
                    if len(pax['birth_date'].split(' ')[0].split('-')) == 3:
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split(' ')[0].split('-')[2], month[pax['birth_date'].split(' ')[0].split('-')[1]],
                                pax['birth_date'].split(' ')[0].split('-')[0])
                        })
                except:
                    pass
            for provider in res['result']['response']['provider_bookings']:
                for journey in provider['journeys']:
                    journey.update({
                        'departure_date': convert_string_to_date_to_string_front_end_with_time(journey['departure_date']),
                        'arrival_date': convert_string_to_date_to_string_front_end_with_time(journey['arrival_date'])
                    })
                    for destination in airline_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break
                    for destination in airline_destinations:
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break
                    for segment in journey['segments']:
                        segment.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']),
                        })
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': convert_string_to_date_to_string_front_end_with_time(
                                    leg['departure_date']),
                                'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                            })
                            for destination in airline_destinations:
                                if destination['code'] == leg['origin']:
                                    leg.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                    })
                                    break
                            for destination in airline_destinations:
                                if destination['code'] == leg['destination']:
                                    leg.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                    })
                                    break
            if res['result']['response'].get('reschedule_list'):
                for reschedule in res['result']['response']['reschedule_list']:
                    for provider in reschedule['provider_bookings']:
                        for journey in provider['journeys']:
                            journey.update({
                                'departure_date': convert_string_to_date_to_string_front_end_with_time(journey['departure_date']),
                                'arrival_date': convert_string_to_date_to_string_front_end_with_time(journey['arrival_date'])
                            })
                            for destination in airline_destinations:
                                if destination['code'] == journey['origin']:
                                    journey.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                    })
                                    break
                            for destination in airline_destinations:
                                if destination['code'] == journey['destination']:
                                    journey.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                    })
                                    break
                            for segment in journey['segments']:
                                segment.update({
                                    'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']),
                                    'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']),
                                })
                                for destination in airline_destinations:
                                    if destination['code'] == segment['origin']:
                                        segment.update({
                                            'origin_city': destination['city'],
                                            'origin_name': destination['name'],
                                        })
                                        break
                                for destination in airline_destinations:
                                    if destination['code'] == segment['destination']:
                                        segment.update({
                                            'destination_city': destination['city'],
                                            'destination_name': destination['name'],
                                        })
                                        break
                                for leg in segment['legs']:
                                    leg.update({
                                        'departure_date': convert_string_to_date_to_string_front_end_with_time(
                                            leg['departure_date']),
                                        'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                                    })
                                    for destination in airline_destinations:
                                        if destination['code'] == leg['origin']:
                                            leg.update({
                                                'origin_city': destination['city'],
                                                'origin_name': destination['name'],
                                            })
                                            break
                                    for destination in airline_destinations:
                                        if destination['code'] == leg['destination']:
                                            leg.update({
                                                'destination_city': destination['city'],
                                                'destination_name': destination['name'],
                                            })
                                            break
                    for segment in reschedule['new_segments']:
                        segment.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date'])
                        })
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': convert_string_to_date_to_string_front_end_with_time(
                                    leg['departure_date']),
                                'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                            })
                            for destination in airline_destinations:
                                if destination['code'] == leg['origin']:
                                    leg.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                    })
                                    break
                            for destination in airline_destinations:
                                if destination['code'] == leg['destination']:
                                    leg.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                    })
                                    break
            response = copy.deepcopy(res)
            for rec in response['result']['response']['provider_bookings']:
                rec['error_msg'] = ''
            time.sleep(2)
            set_session(request, 'airline_get_booking_response', response)

            _logger.info(json.dumps(request.session['airline_get_booking_response']))

            _logger.info("SUCCESS get_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        print(str(e))
        set_session(request, 'airline_get_booking_response', res)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_service_charge(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': json.loads(request.POST['order_number']),
            'passengers': json.loads(request.POST['passengers'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pricing_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'airline_upsell_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['airline_upsell_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_refund_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        provider_bookings = request.POST.get('passengers') and compute_pax_js_new(request.POST['passengers']) or []
        remarks = json.loads(request.POST['remarks'])
        fees = json.loads(request.POST['list_price_refund'])
        provider = json.loads(request.POST['provider'])
        for idx, provider_booking in enumerate(provider_bookings):
            provider_booking['provider'] = provider[idx]
            if provider_booking['provider'] == 'amadeus' and len(provider_booking['journeys']) > 1:
                provider_booking['journeys'].pop()
            for journey in provider_booking['journeys']:
                journey['passengers'] = []
                for fee in fees:
                    if provider_booking['pnr'] == fee['pnr']:
                        add_fee = True
                        for pax_obj in journey['passengers']:
                            if pax_obj['sequence'] == fee['sequence']:
                                add_fee = False
                                pax_obj['fees'].append(fee)

                        if add_fee == True:
                            journey['passengers'].append({
                                'first_name': fee['first_name'],
                                'last_name': fee['last_name'],
                                'sequence': fee['sequence'],
                                'fees': [fee],
                                'remark': ''
                            })
        for remark in remarks:
            if remark['value'] != '':
                remark['id'] = remark['id'].split(' - ')[0].split('~')
                for provider_booking in provider_bookings:
                    if remark['id'][1] == provider_booking['pnr']:
                        for journey in provider_booking['journeys']:
                            if remark['id'][3] == journey['origin'] and remark['id'][4] == journey['destination'] and convert_frontend_datetime_to_server_format(remark['id'][5]) == journey['departure_date']:
                                for pax in journey['passengers']:
                                    if pax['sequence'] == int(remark['id'][2]):
                                        pax['remark'] = remark['value']
        data = {
            'order_number': request.POST['order_number'],
            'provider_bookings': provider_bookings
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_refund_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': request.POST['order_number'],
            'passengers': request.POST.get('passengers') and compute_pax_js(request.POST['passengers']) or [],
            'provider_bookings': request.POST.get('passengers') and compute_pax_js_new(request.POST['passengers']) or []
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def issued(request):
    # nanti ganti ke get_ssr_availability
    try:
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number'],
            'member': member,
            'seq_id': request.POST['seq_id'],
            'voucher': {}
        }
        provider = []
        for provider_type in request.session['airline_get_booking_response']['result']['response']['provider_bookings']:
            if not provider_type['provider'] in provider:
                provider.append(provider_type['provider'])
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'airline', provider),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def reissue(request):
    # nanti ganti ke get_ssr_availability
    try:
        order_number = request.session['airline_get_booking_response']['result']['response']['order_number']
        data_request = json.loads(request.POST['data'])
        cabin_class = ''
        for provider in data_request:
            for journey in provider['journeys']:
                journey['departure_date'] = parse_date_time_to_server(journey['departure_date'])
            cabin_class = provider.pop('cabin_class')
        data = {
            'reschedule_list': data_request,
            'cabin_class': cabin_class,
            'order_number': order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_reschedule_availability",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            airline_destinations = []
            file = read_cache_with_folder_path("airline_destination", 90911)
            if file:
                response = file
            for country in response:
                airline_destinations.append({
                    'code': country['code'],
                    'name': country['name'],
                    'city': country['city']
                })
            for provider in res['result']['response']['reschedule_availability_provider']:
                for journey_list in provider['schedules']:
                    for journey in journey_list['journeys']:
                        journey['is_combo_price'] = False
                        journey.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']))
                        })
                        if journey.get('arrival_date_return'):
                            journey.update({
                                'departure_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['departure_date_return'])),
                                'arrival_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['arrival_date_return']))
                            })
                        if journey.get('return_date'):
                            journey.update({
                                'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                            })
                        for destination in airline_destinations:
                            if destination['code'] == journey['origin']:
                                journey.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == journey['destination']:
                                journey.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
                        for segment in journey['segments']:
                            segment.update({
                                'departure_date': parse_date_time_front_end(
                                    string_to_datetime(segment['departure_date'])),
                                'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                            })
                            for destination in airline_destinations:
                                if destination['code'] == segment['origin']:
                                    segment.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                    })
                                    break

                            for destination in airline_destinations:
                                if destination['code'] == segment['destination']:
                                    segment.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                    })
                                    break

                            for leg in segment['legs']:
                                leg.update({
                                    'departure_date': parse_date_time_front_end(
                                        string_to_datetime(leg['departure_date'])),
                                    'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                                })

                                for destination in airline_destinations:
                                    if destination['code'] == leg['origin']:
                                        leg.update({
                                            'origin_city': destination['city'],
                                            'origin_name': destination['name'],
                                        })
                                        break

                                for destination in airline_destinations:
                                    if destination['code'] == leg['destination']:
                                        leg.update({
                                            'destination_city': destination['city'],
                                            'destination_name': destination['name'],
                                        })
                                        break

            _logger.info("SUCCESS reissued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR reissued_airline AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_journey_reissue_construct(request,boolean, counter):
    try:
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])
        passengers = json.loads(request.POST['passengers'])
        data_booking = request.session['airline_get_booking_response']
        order_number = data_booking['result']['response']['order_number']
        pnr_list = json.loads(request.POST['pnr'])

        for idx, journey in enumerate(journey_booking):
            if boolean == True:
                # NO COMBO
                journeys.append({'segments': journey['segments']})
                try:
                    schedules.append({'journeys': journeys, 'pnr': pnr_list[idx]})
                except:
                    schedules.append({'journeys': journeys})
                journeys = []
            else:
                # COMBO
                check = 0
                journeys.append({'segments': journey['segments']})
                for schedule in schedules:
                    if schedule['provider'] == journey['provider']:
                        schedule['journeys'].append({
                            'segments': journey['segments']
                        })
                        check = 1
                        break
                    # for segment in journey['segments']:
                    #     if segment['carrier_code'] in schedule['carrier_code']:
                    #         schedule['journeys'].append({
                    #             'segments': journey['segments']
                    #         })
                    #         check = 1
                    #         break
                    if check == 1:
                        break
                if check == 0:
                    carrier_code = []
                    for segment in journey['segments']:
                        carrier_code.append(segment['carrier_code'])
                    try:
                        schedules.append({
                            'journeys': journeys,
                            'provider': journey['provider'],
                            'pnr': pnr_list[idx]
                        })
                    except:
                        schedules.append({
                            'journeys': journeys,
                            'provider': journey['provider'],
                        })
                journeys = []
        data = {
            "schedules": schedules,
            "order_number": order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_reschedule",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)

    if res['result']['error_code'] == 0:
        airline_destinations = []
        file = read_cache_with_folder_path("airline_destination", 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city']
            })
        for price_itinerary_provider in res['result']['response']['sell_reschedule_provider']:
            for journey in price_itinerary_provider['journeys']:
                journey.update({
                    'rules': []
                })
                if journey.get('arrival_date_return'):
                    journey.update({
                        'departure_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['departure_date_return'])),
                        'arrival_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['arrival_date_return']))
                    })
                if journey.get('return_date'):
                    journey.update({
                        'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                    })
                for destination in airline_destinations:
                    if destination['code'] == journey['origin']:
                        journey.update({
                            'origin_city': destination['city'],
                            'origin_name': destination['name'],
                        })
                        break
                for destination in airline_destinations:
                    if destination['code'] == journey['destination']:
                        journey.update({
                            'destination_city': destination['city'],
                            'destination_name': destination['name'],
                        })
                        break
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(segment['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                    })
                    for destination in airline_destinations:
                        if destination['code'] == segment['origin']:
                            segment.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break

                    for destination in airline_destinations:
                        if destination['code'] == segment['destination']:
                            segment.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break

                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(leg['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                        })

                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
    elif boolean == True:
        pass
    else:
        counter += 1
        if counter < 3:
            res = sell_journey_reissue_construct(request, True, counter)
        boolean = True
    return res

def command_cryptic(request):
    try:
        data = {
            'text_string': request.POST['text_string'],
            'provider': request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "command_cryptic",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    return res


def compute_pnr_pax_js(paxs):
    # Input: ['pnr~AABBCC~0','pnr~AABBCC~1','pnr~BBCCDD~0']
    # Output: [{'pnr':AABBCC, 'pax':[0,1]},{'pnr':BBCCDD, 'pax':[0]},]
    pnrs = []
    for rec in json.loads(paxs):
        rec = rec.split('~')
        exist = False
        for pnr in pnrs:
            if rec[1] == pnr['pnr']:
                exist = True
                break

        if not exist:
            pnr = {'pnr': rec[1], 'pax':[]}
            pnrs.append(pnr)
        pnr['pax'].append(rec[2])
    return pnrs

def compute_pax_js(paxs):
    pax_list = []
    for rec in json.loads(paxs):
        rec_pax = rec.split('~')
        if rec_pax[2] not in pax_list:
            pax_list.append(rec_pax[2])
    return [{'passenger_number': int(rec)} for rec in pax_list]

def compute_pax_js_new(paxs):
    # {PNR: lalala
    #  journeys:[{
    #      'desti'
    #      'origin'
    #      'departure_date':
    #      'pax':[{}]
    #  }]
    # }
    journeys = []
    for journey in json.loads(paxs):
        for rec in journey.split(' - '):
            rec_pax = rec.split('~')
            check = True
            for pnr in journeys:
                if pnr['pnr'] == rec_pax[1]:
                    for journey in pnr['journeys']:
                        if rec_pax[3] == journey['destination'] and rec_pax[4] == journey['origin'] and convert_frontend_datetime_to_server_format(rec_pax[5]) == journey['departure_date'] and rec_pax[2] not in journey['pax']:
                            journey['pax'].append(int(rec_pax[2]))
                            check = False
                    if check == True:
                        pnr['journeys'].append({
                            'destination': rec_pax[4],
                            'origin': rec_pax[3],
                            'departure_date': convert_frontend_datetime_to_server_format(rec_pax[5]),
                            'pax': []
                        })
                        journeys[len(journeys) - 1]['journeys'][len(journeys[len(journeys) - 1]['journeys']) - 1]['pax'].append(int(rec_pax[2]))
                    check = False

            if check == True:
                journeys.append({
                    'pnr': rec_pax[1],
                    'journeys': []
                })
                journeys[len(journeys)-1]['journeys'].append({
                    'destination': rec_pax[4],
                    'origin': rec_pax[3],
                    'departure_date': convert_frontend_datetime_to_server_format(rec_pax[5]),
                    'pax': []
                })
                journeys[len(journeys) - 1]['journeys'][len(journeys[len(journeys) - 1]['journeys']) -1]['pax'].append(int(rec_pax[2]))

    return journeys

def pre_refund_login(request):
    try:
        provider = []
        pnr = []
        for provider_bookings in request.session['airline_get_booking_response']['result']['response']['provider_bookings']:
            provider.append(provider_bookings['provider'])
            pnr.append(provider_bookings['pnr'])
        data = {
            "provider": provider,
            "pnr": pnr
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pre_refund_login",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_provider_booking_from_vendor(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_booking_from_vendor",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_provider_booking_from_vendor_airline", 86400)
    if not file:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
        try:
            if res['result']['error_code'] == 0:
                write_cache_with_folder(res, "get_provider_booking_from_vendor_airline")
                _logger.info("SUCCESS get_provider_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'])
            else:
                _logger.error("ERROR get_provider_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_provider_booking_from_vendor_airline", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_airline_active_carriers file\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_retrieve_booking_from_vendor(request):
    try:
        data = {
            'proxy_co_uid': False,
            'pnr': request.POST.get('pnr'),
            'provider': request.POST.get('provider'),
            'is_retrieved': False,
            'pricing_date': False
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking_frontend_check_pnr",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            javascript_version = get_cache_version()
            response = get_cache_data(javascript_version)
            file = read_cache_with_folder_path("airline_destination", 90911)
            if file:
                response = file
            airline_destinations = []
            for country in response:
                airline_destinations.append({
                    'code': country['code'],
                    'name': country['name'],
                    'city': country['city']
                })
            for journey in res['result']['response']['journeys']:
                journey.update({
                    'departure_date': convert_string_to_date_to_string_front_end_with_time(journey['departure_date']),
                    'arrival_date': convert_string_to_date_to_string_front_end_with_time(journey['arrival_date'])
                })
                for destination in airline_destinations:
                    if destination['code'] == journey['origin']:
                        journey.update({
                            'origin_city': destination['city'],
                            'origin_name': destination['name'],
                        })
                        break
                for destination in airline_destinations:
                    if destination['code'] == journey['destination']:
                        journey.update({
                            'destination_city': destination['city'],
                            'destination_name': destination['name'],
                        })
                        break
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']),
                        'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']),
                    })
                    for destination in airline_destinations:
                        if destination['code'] == segment['origin']:
                            segment.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break
                    for destination in airline_destinations:
                        if destination['code'] == segment['destination']:
                            segment.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break
                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(
                                leg['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                        })
                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def save_retrieve_booking_from_vendor(request):
    try:
        response = json.loads(request.POST['response'])
        response['result']['signature'] = request.POST['signature']
        for journey in response['result']['response']['journeys']:
            journey.update({
                'departure_date': convert_frontend_datetime_to_server_format(journey['departure_date']),
                'arrival_date': convert_frontend_datetime_to_server_format(journey['arrival_date'])
            })
            for segment in journey['segments']:
                segment.update({
                    'departure_date': convert_frontend_datetime_to_server_format(segment['departure_date']),
                    'arrival_date': convert_frontend_datetime_to_server_format(segment['arrival_date']),
                })
                for leg in segment['legs']:
                    leg.update({
                        'departure_date': convert_frontend_datetime_to_server_format(
                            leg['departure_date']),
                        'arrival_date': convert_frontend_datetime_to_server_format(leg['arrival_date']),
                    })
        # if request.POST.get('duplicate_pnr') == 'true':
        #     bool_pnr = True
        # else:
        #     bool_pnr = False
        bool_pnr = False
        data = {
            'booker_id': request.POST.get('booker_id'),
            'response': response['result'],
            'duplicate_pnr': bool_pnr,
            'customer_parent_id': request.POST.get('customer_parent_id')
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "save_retrieve_booking_frontend",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_refund_booking(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
            'passengers': request.POST.get('passengers') and compute_pax_js(request.POST['passengers']) or [],
            'provider_bookings': request.POST.get('passengers') and compute_pax_js_new(request.POST['passengers']) or [],
            "captcha": json.loads(request.POST['captcha']),
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_refund_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

# POST
def get_post_ssr_availability(request):
    data_booking = request.session['airline_get_booking_response']
    schedules = []
    order_number = data_booking['result']['response']['order_number']
    for rec in data_booking['result']['response']['provider_bookings']:
        schedules.append({"pnr": rec['pnr']})
    data = {
        "schedules": schedules,
        "order_number": order_number
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_post_ssr_availability",
        "signature": request.POST['signature'],
    }
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            try:
                logging.getLogger("error_info").info("get_ssr_availability AIRLINE SIGNATURE " + request.POST['signature'])
                for ssr_availability_provider in res['result']['response']['ssr_availability_provider']:
                    for ssr_availability in ssr_availability_provider['ssr_availability']:
                        for ssrs in ssr_availability_provider['ssr_availability'][ssr_availability]:
                            ssrs.update({
                                'origin': ssrs['segments'][0]['origin'],
                                'destination': ssrs['segments'][len(ssrs['segments']) - 1]['destination']
                            })
                            for ssr in ssrs['ssrs']:
                                total = 0
                                currency = ''
                                for service_charge in ssr['service_charges']:
                                    currency = service_charge['currency']
                                    total += service_charge['amount']
                                ssr['total_price'] = total
                                ssr['currency'] = currency

            except:
                pass
                _logger.error("get_ssr_availability_airline AIRLINE SIGNATURE " + request.POST['signature'] + json.dumps(res))
            set_session(request, 'airline_get_ssr', res)
            _logger.info(json.dumps(request.session['airline_get_ssr']))
        else:
            set_session(request, 'airline_get_ssr', res)
            _logger.info(json.dumps(request.session['airline_get_ssr']))

            _logger.error("get_ssr_availability_airline ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        set_session(request, 'airline_get_ssr', res)
        _logger.info(json.dumps(request.session['airline_get_ssr']))
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_post_seat_availability(request):
    data_booking = request.session['airline_get_booking_response']
    schedules = []
    order_number = data_booking['result']['response']['order_number']
    for rec in data_booking['result']['response']['provider_bookings']:
        schedules.append({"pnr": rec['pnr']})
    data = {
        "schedules": schedules,
        "order_number": order_number
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_post_seat_availability",
        "signature": request.POST['signature'],
    }
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    set_session(request, 'airline_get_seat_availability', res)
    _logger.info(json.dumps(request.session['airline_get_seat_availability']))

    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("error_info").info("get_seat_availability AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_seat_availability ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_post_ssrs(request):
    try:
        order_number = request.session['airline_get_booking_response']['result']['response']['order_number']
        data = {
            'sell_ssrs_request': request.session['airline_ssr_request'],
            'order_number': order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_post_ssrs",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    if 'airline_sell_ssrs' + request.POST['signature'] in request.session:
        res = request.session['airline_sell_ssrs' + request.POST['signature']]
    elif request.session['airline_ssr_request'] != {}:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST',timeout=300)
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'airline_sell_ssrs' + request.POST['signature'], res)
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        if request.session['airline_ssr_request'] == {}:
            _logger.error("NO SSR")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'sell_ssr_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def assign_post_seats(request):
    try:
        order_number = request.session['airline_get_booking_response']['result']['response']['order_number']
        data = {
            'segment_seat_request': request.session['airline_seat_request'],
            'order_number': order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "assign_post_seats",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    if 'airline_seat_request' + request.POST['signature'] in request.session:
        res = request.POST['airline_seat_request' + request.POST['signature']]
    elif len(request.session['airline_seat_request']) != 0:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST',timeout=300)
    try:
        if res['result']['error_code'] == 0:
            request.POST['airline_seat_request' + request.POST['signature']] = res
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        if len(request.session['airline_seat_request']) == 0:
            _logger.error("NO seat")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'seat_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_booking(request):
    #nanti ganti ke get_ssr_availability
    try:
        data_booking = request.session['airline_get_booking_response']
        schedules = []
        order_number = data_booking['result']['response']['order_number']
        for rec in data_booking['result']['response']['provider_bookings']:
            schedules.append({"pnr": rec['pnr']})
        data = {
            "schedules": schedules,
            "order_number": order_number,
        }
        try:
            if request.POST['member'] == 'non_member':
                member = False
            else:
                member = True
            data.update({
                'member': member,
                'seq_id': request.POST['seq_id'],
            })
        except:
            pass
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR commit_booking_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res
