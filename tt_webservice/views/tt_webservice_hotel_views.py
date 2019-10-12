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
        elif req_data['action'] == 'get_auto_complete':
            res = get_auto_complete(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'detail':
            res = detail(request)
        elif req_data['action'] == 'get_cancellation_policy':
            res = get_cancellation_policy(request)
        elif req_data['action'] == 'provision':
            res = provision(request)
        elif req_data['action'] == 'issued':
            res = create_booking(request)
        elif req_data['action'] == 'get_top_facility':
            res = get_top_facility(request)
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
        request.session['signature'] = res['result']['response']['signature']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res


def get_auto_complete(request):
    def find_hotel_ilike(search_str, record_cache, limit=10):
        hotel_list = []
        for rec in record_cache:
            if len(hotel_list) == limit:
                return hotel_list
            is_true = True
            name = rec['name'].lower()
            for list_str in search_str.split(' '):
                if list_str in ['hotel', 'hotels']:
                    pass
                if list_str not in name:
                    is_true = False
                    break
            if is_true:
                hotel_list.append(rec)
        return hotel_list

    limit = 25
    req = request.POST
    try:
        file = open("hotel_cache_data.txt", "r")
        for line in file:
            record_cache = json.loads(line)
        file.close()

        record_json = []
        # for rec in filter(lambda x: req['name'].lower() in x['name'].lower(), record_cache):
        for rec in find_hotel_ilike(req['name'].lower(), record_cache, limit):
            if len(record_json) < limit:
                record_json.append(rec['name'] + ' - ' + rec['type'])
            else:
                break

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_autocomplete HOTEL SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    return record_json

def search(request):
    try:
        child_age = []
        if request.POST['child_age'] != '':
            request.POST['child_age'].split(',')
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
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
            'search_name': request.POST['destination'].split(' - ')[0],
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
            'checkin_date': request.POST['checkin_date'] and str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10] or data['checkin_date'],
            'checkout_date': request.POST['checkout_date'] and str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10] or data['checkout_date'],
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
       # request.session['hotel_detail'] = res
        res = res
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_cancellation_policy(request):
    try:
        data = {
            # "hotel_code": request.session['hotel_detail']['external_code'][request.POST['provider']],
            "hotel_code": request.session['hotel_detail']['id'],
            "price_code": request.POST['price_code'],
            "provider": request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_cancellation_policy",
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/hotel", data=data, headers=headers, method='POST')
    try:
        request.session['hotel_cancellation_policy'] = res
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_top_facility(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_top_facility",
            "signature": request.session['hotel_signature'],
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
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        for pax_type in request.session['hotel_review_pax']:
            if pax_type != 'contact' and pax_type != 'booker':
                for pax in request.session['hotel_review_pax'][pax_type]:
                    if pax['nationality_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['nationality_name'] == country['name']:
                                pax['nationality_code'] = country['code']
                                break
                    passenger.append(pax)
        booker = request.session['hotel_review_pax']['booker']
        contacts = request.session['hotel_review_pax']['contact']
        for country in response['result']['response']['airline']['country']:
            if booker['nationality_name'] == country['name']:
                booker['nationality_code'] = country['code']
                booker['country_code'] = country['code']
                break

        for pax in contacts:
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break
        data = {
            "passengers": passenger,
            'user_id': request.session.get('co_uid') or '',
            'search_data': request.session['hotel_request'],
            # 'cancellation_policy': request.session['hotel_cancellation_policy']['result']['response'],
            'cancellation_policy': [],
            'promotion_codes_booking': [],
            # Remove Versi Baru
            # 'hotel_code': [{
            #     "hotel_code": request.session['hotel_detail']['result']['hotel_code'][request.session['hotel_room_pick']['provider']],
            #     "provider": request.session['hotel_room_pick']['provider']
            # }],
            # Must set as list prepare buat issued multi vendor
            'price_codes': [request.session['hotel_room_pick']['price_code'],],
            "contact": contacts,
            "booker": booker,
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
            "action": "issued",
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