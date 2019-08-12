from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.config import *
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

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'search2':
            res = search2(request)
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
            # "user": user,
            # "password": password,
            # 'api_key': api_key_train,
            # 'co_uid': int(request.session['co_uid'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "signin",
            "signature": '',
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "train/session", data=data, headers=headers, method='POST')
    try:
        request.session['train_sid'] = res['result']['sid']
        request.session['train_cookie'] = res['result']['cookies']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def search2(request):
    #train
    try:
        date = '%s-%s-%s' % (request.POST['departure'].split(' ')[2],
                             month[request.POST['departure'].split(' ')[1]],
                             request.POST['departure'].split(' ')[0])

        data = {
            "origin": request.POST['origin'].split(' - ')[0],
            "destination": request.POST['destination'].split(' - ')[0],
            "departure_date": date,
            "direction": 'RT',
            "return_date": date,
            "adult": int(request.POST['adult']),
            "child": 0,
            "infant": int(request.POST['infant']),
            "provider": provider_kai
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search2",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'train/booking', data=data, headers=headers, cookies=request.session['train_cookie'], method='POST')
    try:
        request.session['train_adult'] = request.POST['adult']
        request.session['train_infant'] = request.POST['infant']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    # if res_origin_train['result']['error_code'] == 0:
    #     res['result'].update({
    #         'response': res_origin_train['result']['response']
    #     })
    # else:
    #     res['result'].update({
    #         'error_code': res_origin_train['result']['error_code'],
    #         'response': res_origin_train['result']['error_msg']
    #     })

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