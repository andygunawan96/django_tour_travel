from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
from .tt_webservice_views import *
from .tt_webservice_voucher_views import *
import json
import logging
import traceback
_logger = logging.getLogger(__name__)

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

class provider_airline:
    def __init__(self, name):
        self.get_time_provider_airline = name
        self.get_time_provider_airline_first_time = True
        self.get_time_carrier_airline = name
        self.get_time_carrier_airline_first_time = True
        self.get_time_provider_list_data = name
        self.get_time_provider_list_data_first_time = True
    def set_new_time_out(self, val):
        if val == 'provider':
            self.get_time_provider_airline = datetime.now()
        elif val == 'carrier':
            self.get_time_carrier_airline = datetime.now()
        elif val == 'provider_list_data':
            self.get_time_provider_list_data = datetime.now()
    def set_first_time(self,val):
        if val == 'provider':
            self.get_time_provider_airline_first_time = False
        elif val == 'carrier':
            self.get_time_carrier_airline_first_time = False
        elif val == 'provider_list_data':
            self.get_time_provider_list_data_first_time = False

a = provider_airline(datetime.now())

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
        elif req_data['action'] == 'get_ssr_availabilty':
            res = get_ssr_availabilty(request)
        elif req_data['action'] == 'get_seat_availability':
            res = get_seat_availability(request)
        elif req_data['action'] == 'get_seat_map_response':
            res = get_seat_map_response(request)
        elif req_data['action'] == 'update_contacts':
            res = update_contacts(request)
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'sell_ssrs':
            res = sell_ssrs(request)
        elif req_data['action'] == 'assign_seats':
            res = assign_seats(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'reissue':
            res = reissue(request)
        elif req_data['action'] == 'sell_journey_reissue_construct':
            res = sell_journey_reissue_construct(request)

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
            "co_user": request.session['username'],
            "co_password": request.session['password'],
            "co_uid": ""
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        request.session['airline_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
        logging.getLogger("info_logger").info("SIGNIN AIRLINE SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
        date_time = datetime.now() - a.get_time_carrier_airline
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    if date_time.seconds >= 300 or a.get_time_carrier_airline_first_time == True:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                a.set_new_time_out('carrier')
                a.set_first_time('carrier')
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
                file = open(var_log_path()+"get_airline_active_carriers" + ".txt", "w+")
                file.write(json.dumps(res))
                file.close()
                logging.getLogger("info_logger").info("get_carriers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                file = open(var_log_path()+"get_airline_active_carriers.txt", "r")
                for line in file:
                    res = json.loads(line)
                file.close()
                logging.getLogger("info_logger").info("get_carriers AIRLINE ERROR USE CACHE SIGNATURE " + request.POST['signature'])
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = open(var_log_path()+"get_airline_active_carriers.txt", "r")
            for line in file:
                res = json.loads(line)
            file.close()
        except Exception as e:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())

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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    date_time = datetime.now() - a.get_time_provider_airline
    if date_time.seconds >= 300 or a.get_time_provider_airline_first_time == True:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                a.set_new_time_out('provider')
                a.set_first_time('provider')
                res = json.dumps(res['result']['response'])
                file = open(var_log_path()+"get_list_provider.txt", "w+")
                file.write(res)
                file.close()
                logging.getLogger("info_logger").info("get_carrier_providers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                file = open(var_log_path()+"get_list_provider.txt", "r")
                for line in file:
                    res = line
                file.close()
                logging.getLogger("info_logger").info("get_carrier_providers ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = open(var_log_path()+"get_list_provider.txt", "r")
            for line in file:
                res = line
            file.close()
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return res

def get_provider_description(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_description",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    date_time = datetime.now() - a.get_time_provider_airline
    if date_time.seconds >= 300 or a.get_time_provider_list_data_first_time == True:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                a.set_new_time_out('provider_list_data')
                a.set_first_time('provider_list_data')
                res = json.dumps(res['result']['response'])
                file = open(var_log_path()+"get_list_provider_data.txt", "w+")
                file.write(res)
                file.close()
                logging.getLogger("info_logger").info("get_provider_list AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                file = open(var_log_path()+"get_list_provider_data.txt", "r")
                for line in file:
                    res = line
                file.close()
                logging.getLogger("info_logger").info("get_provider_list ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = open(var_log_path()+"get_list_provider_data.txt", "r")
            for line in file:
                res = line
            file.close()
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return res

def search2(request):
    # get_data_awal
    try:
        # airline
        airline_destinations = []
        file = open(var_log_path()+"airline_destination.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country'],
            })

        # get_data_awal
        # direction = request.session['airline_request']['direction']
        # departure_date = '%s-%s-%s' % (request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[2],
        #                                month[request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[1]],
        #                                request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[0])
        # return_date = '%s-%s-%s' % (request.session['airline_request']['return'][int(request.POST['counter_search'])].split(' ')[2],
        #                             month[request.session['airline_request']['return'][int(request.POST['counter_search'])].split(' ')[1]],
        #                             request.session['airline_request']['return'][int(request.POST['counter_search'])].split(' ')[0])

        # origin = request.session['airline_request']['origin'][int(request.POST['counter_search'])][-4:][:3]
        # destination = request.session['airline_request']['destination'][int(request.POST['counter_search'])][-4:][:3]
        direction = 'MC'
        journey_list = []
        if request.session['airline_request']['is_combo_price'] == 'false':
            is_combo_price = False
        else:
            is_combo_price = True
        if request.session['airline_request']['direction'] == 'MC':
            for idx, i in enumerate(request.session['airline_request']['origin']):
                departure_date = '%s-%s-%s' % (
                    request.session['airline_request']['departure'][idx].split(' ')[2],
                    month[request.session['airline_request']['departure'][idx].split(' ')[1]],
                    request.session['airline_request']['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': request.session['airline_request']['origin'][idx].split(' - ')[0],
                    'destination': request.session['airline_request']['destination'][idx].split(' - ')[0],
                    'departure_date': departure_date
                })
            cabin_class = request.session['airline_request']['cabin_class'][0]
        elif request.session['airline_request']['direction'] == 'RT':
            for idx, i in enumerate(request.session['airline_request']['origin']):
                departure_date = '%s-%s-%s' % (
                    request.session['airline_request']['departure'][idx].split(' ')[2],
                    month[request.session['airline_request']['departure'][idx].split(' ')[1]],
                    request.session['airline_request']['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': request.session['airline_request']['origin'][idx].split(' - ')[0],
                    'destination': request.session['airline_request']['destination'][idx].split(' - ')[0],
                    'departure_date': departure_date
                })
            cabin_class = request.session['airline_request']['cabin_class'][0]
        else:
            #default
            departure_date = '%s-%s-%s' % (
                request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[2],
                month[request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[1]],
                request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[0])
            journey_list.append({
                'origin': request.session['airline_request']['origin'][int(request.POST['counter_search'])].split(' - ')[0],
                'destination': request.session['airline_request']['destination'][int(request.POST['counter_search'])].split(' - ')[0],
                'departure_date': departure_date
            })
            cabin_class = request.session['airline_request']['cabin_class'][int(request.POST['counter_search'])]
            is_combo_price = False

        # if request.session['airline_request']['is_combo_price'] == 'true':
        #     is_combo_price = True
        # else:
        #     is_combo_price = False

        data = {
            "journey_list": journey_list,
            "direction": direction,
            "is_combo_price": is_combo_price,
            "adult": int(request.session['airline_request']['adult']),
            "child": int(request.session['airline_request']['child']),
            "infant": int(request.session['airline_request']['infant']),
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=60)
    try:
        print(res)
        if res['result']['error_code'] == 0:
            for journey_list in res['result']['response']['schedules']:
                for journey in journey_list['journeys']:
                    if len(journey_list['journey_list']) > 1:
                        journey['is_combo_price'] = True
                    else:
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
            logging.getLogger("error_logger").error("ERROR SEARCH AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    try:
        response_search = res['result']
    except:
        response_search = {
            'result': res
        }
    return response_search

def get_data(request):
    try:
        file = open(var_log_path()+"airline_destination.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return response

def get_price_itinerary(request, boolean, counter):
    try:
        #baru
        airline_destinations = []
        file = open(var_log_path()+"airline_destination.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()
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
        request.session['airline_promotion_code'] = json.loads(request.POST['promotion_code'])
        data = {
            "promotion_code": request.session['airline_promotion_code'],
            "adult": int(request.session['airline_request']['adult']),
            "child": int(request.session['airline_request']['child']),
            "infant": int(request.session['airline_request']['infant']),
            "schedules": schedules,
        }
        request.session['airline_get_price_request'] = data
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_price_itinerary",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())


    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=120)

    try:
        if res['result']['error_code'] == 0:
            for price_itinerary_provider in res['result']['response']['price_itinerary_provider']:
                for journey in price_itinerary_provider['price_itinerary']:
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
            request.session['airline_price_itinerary'] = res['result']['response']
            logging.getLogger("info_logger").info("SUCCESS get_price_itinerary AIRLINE SIGNATURE " + request.POST['signature'])
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    try:
        if boolean == False:
            check_special_price = True
            for schedule in data['schedules']:
                if len(schedule['journey']) > 1:
                    check_special_price = False
                    break
            res['result']['response'].update({
                'is_combo_price': not check_special_price
            })
        else:
            res['result']['response'].update({
                'is_combo_price': not boolean
            })
    except:
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')

    try:
        if res['result']['error_code'] == 0:
            request.session['get_fare_rules'] = res['result']['response']
            logging.getLogger("info_logger").info("SUCCESS get_fare_rules AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS sell_journeys AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR sell_journeys AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_ssr_availabilty(request):
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_ssr_availability",
        "signature": request.POST['signature'],
    }
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    try:
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
                            total = service_charge['amount']
                        ssr['total_price'] = total
                        ssr['currency'] = currency
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    request.session['airline_get_ssr'] = res
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
    request.session['airline_get_seat_availability'] = res
    return res

def get_seat_map_response(request):
    return request.session['airline_get_seat_availability']['result']['response']



def update_contacts(request):
    try:
        booker = request.session['airline_create_passengers']['booker']
        contacts = request.session['airline_create_passengers']['contact']
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_contacts AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_contacts AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def update_passengers(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        passenger = []
        for pax_type in request.session['airline_create_passengers']:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in request.session['airline_create_passengers'][pax_type]:
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())


    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    if request.session['airline_ssr_request'] != {}:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        if request.session['airline_ssr_request'] == {}:
            logging.getLogger("error_logger").error("NO SSR")
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
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    if len(request.session['airline_seat_request']) != 0:
        res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        if len(request.session['airline_seat_request']) == 0:
            logging.getLogger("error_logger").error("NO seat")
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
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
                    # 'voucher': {}
                })
            # if request.POST['voucher_code'] != '':
            #     data.update({
            #         'voucher': data_voucher(request.POST['voucher_code'], 'visa', 'visa_rodextrip'),
            #     })
        except:
            pass
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS commit_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR commit_booking AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return res

def get_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        file = open(var_log_path()+"airline_destination.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()
        airline_destinations = []
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city']
            })
        # airline

        #pax
        for pax in res['result']['response']['passengers']:
            pax.update({
                'birth_date': '%s %s %s' % (
                    pax['birth_date'].split(' ')[0].split('-')[2], month[pax['birth_date'].split(' ')[0].split('-')[1]],
                    pax['birth_date'].split(' ')[0].split('-')[0])
            })
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
        request.session['airline_get_booking_response'] = res
        logging.getLogger("info_logger").info("SUCCESS get_booking AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_service_charge AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_service_charge AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
            # 'voucher': {}
        }
        # provider = []
        # for provider_type in request.session['airline_get_booking_response']['result']['response']['provider_bookings']:
        #     if not provider_type['provider'] in provider:
        #         provider.append(provider_type['provider'])
        # if request.POST['voucher_code'] != '':
        #     data.update({
        #         'voucher': data_voucher(request.POST['voucher_code'], 'airline', provider_type),
        #     })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS issued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR issued AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def reissue(request):
    # nanti ganti ke get_ssr_availability
    try:
        data_request = json.loads(request.POST['data'])
        for provider in data_request:
            for journey in provider['journey_list']:
                journey['departure_date'] = parse_date_time_to_server(journey['departure_date'])
        data = {
            # 'order_number': 'TB.190329533467'
            'provider_list': data_request,
            # 'member': member,
            # 'seq_id': request.POST['seq_id'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "reissue",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            airline_destinations = []
            file = open(var_log_path()+"airline_destination.txt", "r")
            for line in file:
                response = json.loads(line)
            file.close()
            for country in response:
                airline_destinations.append({
                    'code': country['code'],
                    'name': country['name'],
                    'city': country['city']
                })
            for provider in res['result']['response']['reissue_provider']:
                for journey in provider['journeys']:
                    journey.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']))
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
                                'destination_name': destination['name']
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
                                    'destination_name': destination['name']
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
                                        'destination_name': destination['name']
                                    })
                                    break

            logging.getLogger("info_logger").info("SUCCESS issued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR issued AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_journey_reissue_construct(request):
    try:
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])
        passengers = json.loads(request.POST['passengers'])
        for idx, journey in enumerate(journey_booking):
            # NO COMBO
            journeys.append({'segments': journey['segments']})
            schedules.append({'journeys': journeys, 'provider': journey['provider']})
            journeys = []
        request.session['airline_get_price_request'] = {
            "promotion_code": [],
            "adult": int(passengers['adult']),
            "child": int(passengers['child']),
            "infant": int(passengers['infant']),
            "schedules": schedules
        }
        return True
    except:
        return False