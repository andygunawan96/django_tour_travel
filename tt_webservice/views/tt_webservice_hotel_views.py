from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import copy
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
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'detail':
            res = detail(request)
        elif req_data['action'] == 'get_cancellation_policy':
            res = get_cancellation_policy(request)
        elif req_data['action'] == 'provision':
            res = provision(request)
        elif req_data['action'] == 'create_booking':
            res = create_booking(request)
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
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        request.session['hotel_signature'] = res['result']['response']['signature']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def search(request):
    try:
        child_age = []
        if request.POST['child_age'] != '':
            request.POST['child_age'].split(',')
        file = open("javascript_version.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open('version' + str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()
        id = ''
        country_id = ''
        destination_id = ''
        hotel_id = ''
        landmark_id = ''
        try:
            for hotel in response['result']['response']['hotel_config']:
                if request.POST['destination'] == hotel['name']:
                    if hotel['type'] == 'Country':
                        country_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'City':
                        destination_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Hotel':
                        hotel_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Landmark':
                        landmark_id = int(hotel['id'])
                        id = int(hotel['id'])
                    break
        except:
            pass

        data = {
            'child': int(request.POST['child']),
            'hotel_id': hotel_id,
            'search_name': request.POST['destination'],
            'room': int(request.POST['room']),
            'checkout_date': str(datetime.strptime(request.POST['checkout'], '%d %b %Y'))[:10],
            'checkin_date': str(datetime.strptime(request.POST['checkin'], '%d %b %Y'))[:10],
            'adult': int(request.POST['adult']),
            'destination_id': destination_id,
            'child_ages': child_age,

        }
        request.session['hotel_request_data'] = data
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.session['hotel_signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/hotel", data=data, headers=headers, method='POST', timeout=300)
    try:
        counter = 0
        sequence = 0
        if res['result']['error_code'] == 0:
            hotel_data = []
            for hotel in res['result']['response']['city_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['country_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['hotel_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['landmark_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def detail(request):
    try:
        data = request.session['hotel_request_data']
        data.update({
            'hotel_id': request.session['hotel_detail']['id'],
            'checkin_date': str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10],
            'checkout_date': str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10],
            'pax_country': False
        })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_details",
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/hotel", data=data, headers=headers, method='POST')
    try:
       request.session['hotel_detail'] = res
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_cancellation_policy(request):
    try:
        data = {
            "hotel_code": request.session['hotel_detail']['result']['hotel_code'][request.session['hotel_room_pick']['provider']],
            "price_code": request.POST['price_code'],
            "provider": request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_cancellation_policy",
            "signature": request.session['train_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/hotel", data=data, headers=headers, method='POST')
    try:
        request.session['hotel_cancellation_policy'] = res
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def provision(request):
    try:
        data = {
            'price_code': request.POST['price_code'],
            'provider': request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "provision",
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/hotel", data=data, headers=headers, method='POST')

    try:
        request.session['hotel_provision'] = res
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def create_booking(request):
    try:
        passenger = []

        for pax in request.session['hotel_review_pax']['adult']:
            pax.update({
                'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
            })
            passenger.append(pax)
        for pax in request.session['hotel_review_pax']['child']:
            pax.update({
                'birth_date': '%s-%s-%s' % (
                    pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                    pax['birth_date'].split(' ')[0])
            })
            passenger.append(pax)

        data = {
            "passengers": passenger,
            'user_id': request.session['co_uid'],
            'search_data': request.session['hotel_request'],
            'cancellation_policy': [
            ],
            'promotion_codes_booking': [],
            'hotel_code': [{
                "hotel_code": request.session['hotel_detail']['result']['hotel_code'][request.session['hotel_room_pick']['provider']],
                "provider": request.session['hotel_room_pick']['provider']
            }],
            'room_codes': request.session['hotel_room_pick']['price_code'],
            "contact": request.session['hotel_review_pax']['booker'],
            'kwargs': {
                'force_issued': 'False'
            },
            'special_request': request.POST['special_request'],
            'resv_name': '',
            'os_res_no': '',
            'journeys_booking': ''
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_booking",
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/hotel", data=data, headers=headers, method='POST')

    try:
        request.session['hotel_booking'] = res['result']['response']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res