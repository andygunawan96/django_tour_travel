from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import logging
import traceback
from .tt_webservice_views import *
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

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'get_seat_map':
            res = seat_map(request)
        elif req_data['action'] == 'assign_seats':
            res = assign_seats(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
    try:
        data = {
            "user": user_global,
            "password": password_global,
            "api_key": api_key,
            "co_user": request.session['username'],
            "co_password": request.session['password'],
            "co_uid": ""
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "signin",
            "signature": '',
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session", data=data, headers=headers, method='POST')
    try:
        request.session['train_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
        logging.getLogger("info_logger").info("SIGNIN TRAIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        file = open(var_log_path()+"train_cache_data.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data TRAIN SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return response

def search(request):
    #train
    try:
        train_destinations = []
        file = open(var_log_path() + "train_cache_data.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()
        for country in response:
            train_destinations.append({
                'code': country['code'],
                'name': country['name'],
            })

        journey_list = []
        for idx, request_train in enumerate(request.session['train_request']['departure']):
            departure_date = '%s-%s-%s' % (
                request.session['train_request']['departure'][idx].split(' ')[2],
                month[request.session['train_request']['departure'][idx].split(' ')[1]],
                request.session['train_request']['departure'][idx].split(' ')[0])
            journey_list.append({
                'origin': request.session['train_request']['origin'][idx].split(' - ')[0],
                'destination': request.session['train_request']['destination'][idx].split(' - ')[0],
                'departure_date': departure_date
            })

        data = {
            "journey_list": journey_list,
            "direction": request.session['train_request']['direction'],
            "adult": int(request.session['train_request']['adult']),
            "infant": int(request.session['train_request']['infant']),
            "provider": provider_kai
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/train', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            for journey_list in res['result']['response']['schedules']:
                for journey in journey_list['journeys']:
                    journey.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date']+':00')),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']+':00'))
                    })
                    check = 0
                    for destination in train_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_name': destination['name'],
                            })
                            check = check + 1
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_name': destination['name'],
                            })
                            check = check + 1
                        if check == 2:
                            break
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def commit_booking(request):
    try:
        booker = request.session['train_create_passengers']['booker']
        contacts = request.session['train_create_passengers']['contact']
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
        passenger = []
        for pax_type in request.session['train_create_passengers']:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in request.session['train_create_passengers'][pax_type]:
                    if pax['nationality_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['nationality_name'] == country['name']:
                                pax['nationality_code'] = country['code']
                                break
                    pax.update({
                        'birth_date': '%s-%s-%s' % (
                            pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                            pax['birth_date'].split(' ')[0]),
                    })
                    if pax['pax_type'] == 'ADT' and pax['identity_expdate'] != '':
                        pax.update({
                            'identity_expdate': '%s-%s-%s' % (
                                pax['identity_expdate'].split(' ')[2], month[pax['identity_expdate'].split(' ')[1]],
                                pax['identity_expdate'].split(' ')[0])
                        })
                        if pax['identity_country_of_issued_name'] != '':
                            for country in response['result']['response']['airline']['country']:
                                if pax['identity_country_of_issued_name'] == country['name']:
                                    pax['identity_country_of_issued_code'] = country['code']
                                    break
                        pax['identity'] = {
                            "identity_country_of_issued_name": pax.pop('identity_country_of_issued_name'),
                            "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                            "identity_expdate": pax.pop('identity_expdate'),
                            "identity_number": pax.pop('identity_number'),
                            "identity_type": pax.pop('identity_type'),
                        }
                    elif pax['pax_type'] == 'ADT':
                        pax.pop('identity_country_of_issued_name')
                        pax.pop('identity_expdate')
                        pax.pop('identity_number')
                        pax.pop('identity_type')
                    passenger.append(pax)
        data = {
            "contacts": contacts,
            "passengers": passenger,
            "schedules": request.session['train_booking'],
            "booker": booker
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/train', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            request.session['train_order_number'] = res['result']['response']['order_number']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_booking(request):
    try:
        train_destinations = []
        file = open(var_log_path() + "train_cache_data.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()
        for country in response:
            train_destinations.append({
                'code': country['code'],
                'name': country['name'],
            })
        data = {
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/train', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            for provider_booking in res['result']['response']['provider_bookings']:
                for journey in provider_booking['journeys']:
                    journey.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'] + ':00')),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date'] + ':00'))
                    })
                    check = 0
                    for destination in train_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_name': destination['name'],
                            })
                            check = check + 1
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_name': destination['name'],
                            })
                            check = check + 1
                        if check == 2:
                            break
            for pax in res['result']['response']['passengers']:
                pax.update({
                    'birth_date': '%s %s %s' % (
                        pax['birth_date'].split(' ')[0].split('-')[2],
                        month[pax['birth_date'].split(' ')[0].split('-')[1]],
                        pax['birth_date'].split(' ')[0].split('-')[0])
                })
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
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

def seat_map(request):
    try:
        seat_map_request_input = request.session['train_seat_map_request']
        seat_request = []
        for i in seat_map_request_input:
            seat_request.append(i['fare_code'])
        data = {
            "fare_codes": seat_request,
            "provider": provider_kai
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_seat_availability",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/train', data=data, headers=headers, method='POST')

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

    res = util.send_request(url=url + 'booking/train', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS issued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR issued AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel(request):
    try:
        data = {
            "order_number": request.POST['order_number'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/train', data=data, headers=headers, method='POST')

    return res

def assign_seats(request):
    try:
        passengers = json.loads(request.POST['pax'])
        provider_bookings = []

        for idx, pax in enumerate(passengers):
            for idy, seat in enumerate(pax['seat']):
                journeys = []
                seats = []
                if seat['wagon'] != '':
                    if len(provider_bookings) > idy:
                        seats = provider_bookings[idy]['journeys'][0]['seats']
                    seats.append({
                        "cabin_code": seat['wagon'],
                        "seat_row": int(seat['seat']),
                        "seat_column": seat['column'],
                        "passenger_sequence": idx + 1
                    })
                    journeys.append({
                        "sequence": 1,
                        "seats": seats
                    })
                    if len(provider_bookings) > idy:
                        provider_bookings[idy].update({
                            "journeys": journeys
                        })
                    else:
                        provider_bookings.append({
                            "provider": provider_kai,
                            "sequence": idy + 1,
                            "journeys": journeys
                        })
        data = {
            "order_number": request.POST['order_number'],
            "provider_bookings": provider_bookings
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "assign_seats",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/train', data=data, headers=headers, method='POST')

    return res