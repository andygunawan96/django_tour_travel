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
        elif req_data['action'] == 'create_booking':
            res = create_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued_booking(request)
        elif req_data['action'] == 'get_seat_map':
            res = seat_map(request)
        elif req_data['action'] == 'manual_seat':
            res = manual_seat(request)
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

def create_booking(request):
    try:
        passenger = []

        for pax in request.session['train_review_booking']['adult']:
            pax.update({
                'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
            })
            passenger.append(pax)
        for pax in request.session['train_review_booking']['infant']:
            pax.update({
                'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
            })
            passenger.append(pax)
        data = {
            "contact": request.session['train_review_booking']['booker'],
            "passengers": passenger,
            "journeys_booking": request.session['train_review_booking']['journeys_booking'],
            "promotion_codes_booking": [],
            "transaction_type": "hold_book",
            "create_booking_type": "hold_book",
            "kwargs": {
                "force_issued": 0
            },

        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_booking",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'train/booking', data=data, headers=headers,
                                         cookies=request.session['train_cookie'], method='POST')
    try:
        if res['result']['error_code'] == 0:
            request.session['train_order_number'] = res['result']['response']['order_number']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_booking(request):
    try:
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
    res = util.send_request(url=url + 'train/booking', data=data, headers=headers,
                                         cookies=request.session['train_cookie'], method='POST')
    try:
        if res['result']['error_code'] == 0:
            request.session['train_pick'] = {
                'origin': res['result']['response']['journeys'][0]['origin']['code'],
                'destination': res['result']['response']['journeys'][0]['destination']['code'],
                'departure_date': str(datetime.strptime('30-Mar-2019', '%d-%b-%Y'))[:10],
                'carrier_code': res['result']['response']['journeys'][0]['segments'][0]['carrier']['code'],
                'class_of_service': res['result']['response']['journeys'][0]['segments'][0]['class_of_service'],
                'pnr': res['result']['response']['pnrs'][0]['pnr']
            }
            request.session['train_pnr'] = res['result']['response']['pnrs'][0]['pnr']
            passenger = []
            for pax in res['result']['response']['journeys'][0]['segments'][0]['seats']:
                passenger.append(pax)
            request.session['train_pax'] = passenger
        #     pax
            for pnr in res['result']['response']['pnrs']:
                hold_date = to_date_now(pnr['hold_date'])
                pnr.update({
                    'date': '%s %s %s %s:%s' % (pnr['departure_date'].split(' ')[0].split('-')[2],
                                                month[pnr['departure_date'].split(' ')[0].split('-')[1]],
                                                pnr['departure_date'].split(' ')[0].split('-')[0],
                                                pnr['departure_date'].split(' ')[1].split(':')[0],
                                                pnr['departure_date'].split(' ')[1].split(':')[1]),
                    'hold_date': '%s %s %s %s:%s' % (hold_date.split(' ')[0].split('-')[2],
                                                     month[hold_date.split(' ')[0].split('-')[
                                                         1]],
                                                     hold_date.split(' ')[0].split('-')[0],
                                                     hold_date.split(' ')[1].split(':')[0],
                                                     hold_date.split(' ')[1].split(':')[1]),
                    'status': pnr['status'].capitalize()
                })
            for journey in res['result']['response']['journeys']:
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': '%s %s %s' % (segment['departure_date'].split('-')[0], segment['departure_date'].split('-')[1], segment['departure_date'].split('-')[2]),
                        'arrival_date': '%s %s %s' % (segment['arrival_date'].split('-')[0], segment['arrival_date'].split('-')[1], segment['arrival_date'].split('-')[2])
                    })
                    for seat in segment['seats']:
                        seat['passenger'].update({
                            'birth_date': '%s %s %s' % (
                            seat['passenger']['birth_date'].split('-')[2], month[seat['passenger']['birth_date'].split('-')[1]],
                            seat['passenger']['birth_date'].split('-')[0])
                        })
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def seat_map(request):
    try:
        data = {
            "origin": request.session['train_pick']['origin'],
            "departure_date": request.session['train_pick']['departure_date'],
            "carrier_number": request.session['train_pick']['carrier_code'],
            "destination": request.session['train_pick']['destination'],
            "class_of_service": request.session['train_pick']['class_of_service'],
            "pnr": request.session['train_pick']['pnr'],
            "provider": provider_kai
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_seat_map",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'train/booking', data=data, headers=headers,
                                         cookies=request.session['train_cookie'], method='POST')

    return res

def issued_booking(request):
    try:
        data = {
            "order_number": request.session['train_order_number'],

        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'train/booking', data=data, headers=headers,
                                         cookies=request.session['train_cookie'], method='POST')

    return res

def manual_seat(request):
    try:
        passenger = json.loads(request.POST['pax'])
        wagon_seats_number = []
        for pax in passenger:
            wagon_seats_number.append({
                'wagon_name': pax['seat'].split('/')[0],
                'seat_number': pax['seat'].split('/')[1]
            })

        seats_request = [{
            'pnr': request.session['train_pnr'],
            'wagon_seats_number': wagon_seats_number

        }]
        data = {
            "order_number": request.session['train_order_number'],
            "seats_request": seats_request,
            "provider": provider_kai
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "manual_seat",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'train/booking', data=data, headers=headers,
                                         cookies=request.session['train_cookie'], method='POST')

    return res