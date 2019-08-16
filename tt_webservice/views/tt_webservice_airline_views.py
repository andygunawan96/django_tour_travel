from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
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
        self.get_time_carrier_airline = name
    def set_new_time_out(self, val):
        if val == 'provider':
            self.get_time_provider_airline = datetime.now()
        elif val == 'carrier':
            self.get_time_carrier_airline = datetime.now()

a = provider_airline(datetime.now())

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'get_provider_list':
            res = get_provider_list(request)
        elif req_data['action'] == 'get_carrier_code_list':
            res = get_carrier_code_list(request)
        elif req_data['action'] == 'search':
            res = search2(request)
        elif req_data['action'] == 'get_price_itinerary':
            res = get_price_itinerary(request, False)
        elif req_data['action'] == 'get_fare_rules':
            res = get_fare_rules(request)
        elif req_data['action'] == 'sell_journeys':
            res = sell_journeys(request)
        elif req_data['action'] == 'update_contacts':
            res = update_contacts(request)
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'get_buy_information':
            res = get_buy_information(request)
        elif req_data['action'] == 'create_passengers':
            res = create_passengers(request)
        elif req_data['action'] == 'ssr':
            res = set_ssr_ff(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
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
        logging.getLogger("info_logger").info("SIGNIN AIRLINE SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_carrier_code_list(request):
    try:
        data = {
            'provider_type': 'airline'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers",
            "signature": request.POST['signature'],
        }
        date_time = datetime.now() - a.get_time_carrier_airline
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    if date_time.seconds >= 300:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                a.set_new_time_out('carrier')
                res = res['result']['response']
                file = open("get_airline_active_carriers" + ".txt", "w+")
                file.write(json.dumps(res))
                file.close()
                logging.getLogger("info_logger").info("get_carriers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                file = open("get_airline_active_carriers.txt", "r")
                for line in file:
                    res = json.loads(line)
                file.close()
                logging.getLogger("info_logger").info("get_carriers AIRLINE ERROR USE CACHE SIGNATURE " + request.POST['signature'])
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = open("get_airline_active_carriers.txt", "r")
            for line in file:
                res = json.loads(line)
            file.close()
        except Exception as e:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_provider_list(request):
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
    if date_time.seconds >= 300:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                a.set_new_time_out('provider')
                res = json.dumps(res['result']['response'])
                file = open("get_list_provider.txt", "w+")
                file.write(res)
                file.close()
                logging.getLogger("info_logger").info("get_carrier_providers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                file = open("get_list_provider.txt", "r")
                for line in file:
                    res = line
                file.close()
                logging.getLogger("info_logger").info("get_carrier_providers ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = open("get_list_provider.txt", "r")
            for line in file:
                res = line
            file.close()
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return res

def search2(request):
    # get_data_awal
    try:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # airline
        airline_destinations = []
        for country in response['result']['response']['airline']['destination']:
            for des in response['result']['response']['airline']['destination'][country]:
                des.update({
                    'country': country
                })
                airline_destinations.append(des)

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
        provider = ['amadeus', 'sabre', 'sia']
        direction = 'MC'
        journey_list = []
        if request.session['airline_request']['is_combo_price'] == 'false':
            is_combo_price = False
        else:
            is_combo_price = True
        if request.session['airline_request']['direction'] == 'MC' and request.POST['provider'] in provider:
            for idx, i in enumerate(request.session['airline_request']['origin']):
                departure_date = '%s-%s-%s' % (
                    request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[2],
                    month[request.session['airline_request']['departure'][idx].split(' ')[1]],
                    request.session['airline_request']['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': request.session['airline_request']['origin'][idx][-4:][:3],
                    'destination': request.session['airline_request']['destination'][idx][-4:][:3],
                    'departure_date': departure_date
                })
            cabin_class = request.session['airline_request']['cabin_class'][0]
        elif request.session['airline_request']['direction'] == 'RT' and request.POST['provider'] in provider:
            for idx, i in enumerate(request.session['airline_request']['origin']):
                departure_date = '%s-%s-%s' % (
                    request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[2],
                    month[request.session['airline_request']['departure'][idx].split(' ')[1]],
                    request.session['airline_request']['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': request.session['airline_request']['origin'][idx][-4:][:3],
                    'destination': request.session['airline_request']['destination'][idx][-4:][:3],
                    'departure_date': departure_date
                })
            cabin_class = request.session['airline_request']['cabin_class'][0]

        elif request.session['airline_request']['direction'] == 'RT' and int(request.POST['counter_search']) != 0:
            #RT
            departure_date = '%s-%s-%s' % (
                request.session['airline_request']['return'][0].split(' ')[2],
                month[request.session['airline_request']['return'][0].split(' ')[1]],
                request.session['airline_request']['return'][0].split(' ')[0])
            journey_list.append({
                'origin': request.session['airline_request']['destination'][0][-4:][:3],
                'destination': request.session['airline_request']['origin'][0][-4:][:3],
                'departure_date': departure_date
            })
            cabin_class = request.session['airline_request']['cabin_class'][0]
            is_combo_price = False
        else:
            #default
            departure_date = '%s-%s-%s' % (
                request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[2],
                month[request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[1]],
                request.session['airline_request']['departure'][int(request.POST['counter_search'])].split(' ')[0])
            journey_list.append({
                'origin': request.session['airline_request']['origin'][0][-4:][:3],
                'destination': request.session['airline_request']['destination'][0][-4:][:3],
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
            # "origin": origin,
            # "destination": destination,
            # "departure_date": departure_date,
            # "return_date": return_date,
            "is_combo_price": is_combo_price,
            "adult": int(request.session['airline_request']['adult']),
            "child": int(request.session['airline_request']['child']),
            "infant": int(request.session['airline_request']['infant']),
            "cabin_class": cabin_class,
            # "provider": request.POST['provider'],
            "provider": 'amadeus',
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
    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            for journey_list in res['result']['response']['journey_list']:
                for journey in journey_list['journeys']:
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
            logging.getLogger("error_info").error("SUCCESS SEARCH AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR SEARCH AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res['result']

def get_data(request):
    try:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        airline_destinations = []
        for country in response['result']['response']['airline']['destination']:
            for des in response['result']['response']['airline']['destination'][country]:
                des.update({
                    'country': country
                })
                airline_destinations.append(des)
        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return airline_destinations

def get_price_itinerary(request, boolean):
    try:
        #baru
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # airline
        airline_destinations = []
        for country in response['result']['response']['airline']['destination']:
            for des in response['result']['response']['airline']['destination'][country]:
                des.update({
                    'country': country
                })
                airline_destinations.append(des)
        #baru
        journey_booking = json.loads(request.POST['journeys_booking'])
        for idx, journey in enumerate(journey_booking):
            if idx != 0:
                if request.session['airline_request']['direction'] == 'MC':
                    for idx1, segment in enumerate(journey['segments']):
                        segment.update({
                            'journey_type': 'RET'
                        })
                journey.update({
                    "separate_journey": boolean
                })
        data = {
            "promotion_code": [],
            "adult": int(request.session['airline_request']['adult']),
            "child": int(request.session['airline_request']['child']),
            "infant": int(request.session['airline_request']['infant']),
            "journeys_booking": journey_booking,

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


    res = util.send_request(url=url + 'booking/airline', data=data, headers=headers, method='POST')

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
            request.session['airline_price_itinerary'] = res['result']['response']
            logging.getLogger("info_logger").info("SUCCESS get_price_itinerary AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            # if(request.session['airline_request']['direction'] == 'RT'):
            #MC atau RT SEPARATE
            get_price_itinerary(request, True)
    except Exception as e:
        get_price_itinerary(request, True)
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_fare_rules(request):
    try:
        data = {
            "promotion_code": [],
            "adult": int(request.session['airline_request']['adult']),
            "child": int(request.session['airline_request']['child']),
            "infant": int(request.session['airline_request']['infant']),
            "journeys_booking": json.loads(request.POST['journeys_booking'])
        }
        request.session['airline_get_price_request'] = data
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
        journeys_booking = request.session['airline_get_price_request']['journeys_booking']
        for journey in journeys_booking:
            for segment in journey['segments']:
                try:
                    segment.pop('fare_pick')
                except:
                    continue
        data = {
            "promotion_code": [],
            "adult": request.session['airline_get_price_request']['adult'],
            "child": request.session['airline_get_price_request']['child'],
            "infant": request.session['airline_get_price_request']['infant'],
            "journeys_booking": journeys_booking
        }
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

def update_contacts(request):
    try:
        data = {
            'booker': request.session['airline_create_passengers']['booker'],
            'contacts': request.session['airline_create_passengers']['contact']
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
        passenger = []
        for pax in request.session['airline_create_passengers']['adult']:
            pax.update({
                'birth_date': '%s-%s-%s' % (
                    pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                    pax['birth_date'].split(' ')[0])
            })
            if pax['passport_expdate'] != '':
                pax.update({
                    'passport_expdate': '%s-%s-%s' % (
                        pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                        pax['passport_expdate'].split(' ')[0])
                })
            passenger.append(pax)
        for pax in request.session['airline_create_passengers']['child']:
            pax.update({
                'birth_date': '%s-%s-%s' % (
                    pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                    pax['birth_date'].split(' ')[0])
            })
            if pax['passport_expdate'] != '':
                pax.update({
                    'passport_expdate': '%s-%s-%s' % (
                        pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                        pax['passport_expdate'].split(' ')[0])
                })
            passenger.append(pax)
            for pax in request.session['airline_create_passengers']['infant']:
                pax.update({
                    'birth_date': '%s-%s-%s' % (
                        pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                        pax['birth_date'].split(' ')[0])
                })
                if pax['passport_expdate'] != '':
                    pax.update({
                        'passport_expdate': '%s-%s-%s' % (
                            pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                            pax['passport_expdate'].split(' ')[0])
                    })
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

def commit_booking(request):
    #nanti ganti ke get_ssr_availability
    try:
        data = {
            'force_issued': bool(int(request.POST['value']))
        }
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
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # airline
        airline_destinations = []
        for country in response['result']['response']['airline']['destination']:
            for des in response['result']['response']['airline']['destination'][country]:
                des.update({
                    'country': country
                })
                airline_destinations.append(des)

        #pax
        for pax in res['result']['response']['passengers']:
            pax.update({
                'birth_date': '%s %s %s' % (
                    pax['birth_date'].split(' ')[0].split('-')[2], month[pax['birth_date'].split(' ')[0].split('-')[1]],
                    pax['birth_date'].split(' ')[0].split('-')[0])
            })
            pass
        for provider in res['result']['response']['provider_bookings']:
            for journey in provider['journeys']:
                journey.update({
                    'departure_date': convert_string_to_date_to_string_front_end_with_time(journey['departure_date']),
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
        }
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

#GAK PAKE
def get_buy_information(request):
    #nanti ganti ke get_ssr_availability
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_buy_information",
        "signature": request.session['airline_signature'],
    }


    res = util.send_request(url=url + 'airlines/booking', data=data, headers=headers, cookies=request.session['airline_cookie'], method='POST')

    try:
        for baggage in res['result']['response']['ssr_codes']['baggage_per_route']:
            for code in baggage['ssr_codes']:
                code.update({
                    'amount': int(code['amount'])
                })
    except:
        print('no baggage')
    try:
        for equip in res['result']['response']['ssr_codes']['equip_per_route']:
            for code in equip['ssr_codes']:
                code.update({
                    'amount': int(code['amount'])
                })
    except:
        print('no equip')
    try:
        for for_free in res['result']['response']['ssr_codes']['for_free_per_route']:
            for code in for_free['ssr_codes']:
                code.update({
                    'amount': int(code['amount'])
                })
    except:
        print('no for_free')
    try:
        for meal in res['result']['response']['ssr_codes']['meal_per_segment']:
            for code in meal['ssr_codes']:
                code.update({
                    'amount': int(code['amount'])
                })
    except:
        print('no meals')


    request.session['airline_ssr'] = res['result']['response']

    return res

def create_passengers(request):
    #nanti ganti ke get_ssr_availability
    passenger = []
    for pax in request.session['airline_create_passengers']['adult']:
        pax.update({
            'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
        })
        if pax['passport_expdate'] != '':
            pax.update({
                'passport_expdate': '%s-%s-%s' % (pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                                            pax['passport_expdate'].split(' ')[0])
            })
        passenger.append(pax)

    for pax in request.session['airline_create_passengers']['child']:
        pax.update({
            'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
        })
        if pax['passport_expdate'] != '':
            pax.update({
                'passport_expdate': '%s-%s-%s' % (pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                                            pax['passport_expdate'].split(' ')[0])
            })
        passenger.append(pax)

    for pax in request.session['airline_create_passengers']['infant']:
        pax.update({
            'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
        })
        if pax['passport_expdate'] != '':
            pax.update({
                'passport_expdate': '%s-%s-%s' % (pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                                            pax['passport_expdate'].split(' ')[0])
            })
        passenger.append(pax)


    data = {
        "contacts": request.session['airline_create_passengers']['booker'],
        "passengers": passenger,
        "kwargs": {},
        "promotion_codes_request": []
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_passengers",
        "signature": request.session['airline_signature'],
    }

    res = util.send_request(url=url + 'airlines/booking', data=data, headers=headers, cookies=request.session['airline_cookie'], method='POST')

    return res

def set_ssr_ff(request):
    #nanti ganti ke get_ssr_availability
    ff_request = []
    buy_ssrs_request = []

    segments = []
    segment_list = []
    pax = []
    ssr_code = []
    segment_code = ''
    check = 0
    for journey in request.session['airline_request_ssr']:
        for segment in journey:
            check = 0
            for list in segment_list:
                if segment['segment_code'] == list:
                    check = 1
            if check == 0:
                segment_list.append(segment['segment_code'])
            segment_code = segment['segment_code']
            for ssr in segment['passengers']['ssr_codes']:
                ssr_code.append(ssr['ssr_code'])
            print('a')
            pax.append({
                'segment_code': segment_code,
                'passenger_number': segment['passengers']['passenger_number'],
                'ssr_codes': ssr_code
            })
            ssr_code = []
        segments.append({
            'passengers': pax
        })
        pax = []

    for segment in segments:
        for passenger in segment['passengers']:
            pax.append(passenger)

    segments = []
    new_pax = []
    for segment in segment_list:
        for idx, passenger in enumerate(pax):
            if passenger['segment_code'] == segment:
                new_pax.append({
                    'passenger_number': passenger['passenger_number'],
                    'ssr_codes': passenger['ssr_codes']
                })
        buy_ssrs_request.append({
            "segment_code": segment,
            "passengers": new_pax
        })
        new_pax = []

    #ff_request nanti perbaiki belom di coding
    data = {
        "buy_ssrs_request": buy_ssrs_request,
        "ff_request": ff_request
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "set_ssr_ff",
        "signature": request.session['airline_signature'],
    }

    res = util.send_request(url=url + 'airlines/booking', data=data, headers=headers, cookies=request.session['airline_cookie'], method='POST')

    return res