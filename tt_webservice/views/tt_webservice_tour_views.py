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
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_details':
            res = get_details(request)
        elif req_data['action'] == 'get_pricing':
            res = get_pricing(request)
        elif req_data['action'] == 'get_pricing_cache':
            res = get_pricing_cache(request)
        elif req_data['action'] == 'update_passenger':
            res = update_passenger(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'get_payment_rules':
            res = get_payment_rules(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)


def login(request):
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
        "action": 'signin'
    }
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        request.session['tour_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
        logging.getLogger("info_logger").info(
            "SIGNIN TOUR SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res


def search(request):
    try:
        data = {
            'country_id': request.session['tour_request']['country_id'],
            'city_id': request.session['tour_request']['city_id'],
            'month': request.session['tour_request']['month'],
            'year': request.session['tour_request']['year'],
            'tour_query': request.session['tour_request']['tour_query'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.session['tour_signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    try:
        data_tour = []
        counter = 0
        try:
            if int(request.POST['offset']) != 0:
                for data in request.session['tour_search']:
                    data_tour.append(data)
                    counter += 1
        except:
            print('no data')

        for i in res['result']['response']['result']:
            i.update({
                'sequence': counter
            })
            data_tour.append(i)
            counter += 1

        request.session['tour_search'] = data_tour
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res


def get_details(request):
    try:
        data = {
            'provider': request.session['tour_pick']['provider'],
            'id': request.POST['id'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_details",
            "signature": request.session['tour_signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def get_pricing(request):
    try:
        data = {
            'provider': request.session['tour_pick']['provider'],
            'req': request.POST['req'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_pricing",
            "signature": request.session['tour_signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    if res.get('result'):
        res['result'].update({
            'tour_info': {
                'name': request.session['tour_pick']['name'],
                'departure_date': request.session['tour_pick']['departure_date'],
                'return_date': request.session['tour_pick']['return_date'],
            }
        })
    request.session['tour_price'] = res
    return res


def get_pricing_cache(request):
    try:
        res = request.session['tour_price']
        if res.get('result'):
            res['result'].update({
                'tour_info': {
                    'name': request.session['tour_pick']['name'],
                    'departure_date': request.session['tour_pick']['departure_date'],
                    'return_date': request.session['tour_pick']['return_date'],
                }
            })
    except Exception as e:
        res = {}
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def sell_tour(request):
    data = {
        "promotion_codes_booking": [],
        "search_request": request.session['activity_review_booking']['search_request'],
        'provider': request.session['tour_pick']['provider'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "sell_tour",
        "signature": request.POST['signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def update_contact(request):
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)

    booker = request.session['tour_booking_data']['booker']
    contacts = request.session['tour_booking_data']['contact']
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
        "booker": booker,
        "contacts": contacts,
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_contact",
        "signature": request.POST['signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def update_passengers(request):
    passenger = []
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)

    countries = response['result']['response']['airline']['country']
    passenger = []
    for pax in request.session['tour_booking_data']['adult_pax']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0]),
        })
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        if pax['identity_country_of_issued_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['identity_country_of_issued_code'] = country['code']
                    break
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

    for pax in request.session['tour_booking_data']['child_pax']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0]),
        })
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        if pax['identity_country_of_issued_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['identity_country_of_issued_code'] = country['code']
                    break
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

    for pax in request.session['tour_booking_data']['infant_pax']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0]),
        })
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        if pax['identity_country_of_issued_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['identity_country_of_issued_code'] = country['code']
                    break
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
        "passengers": passenger,
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_passengers",
        "signature": request.POST['signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def commit_booking(request):
    try:
        data = {
            'provider': request.session['tour_pick']['provider'],
            'force_issued': request.POST['value'],
            'booker_id': request.POST['booker_id'],
            'pax_ids': request.POST['pax_ids'],
            'payment_method': request.POST['payment_method'],
            'book_line_ids': request.POST['book_line_ids'],
            'tour_booking_data': request.session['tour_booking_data'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.session['tour_signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def get_booking(request):
    try:
        data = {
            'provider': request.session['tour_pick']['provider'],
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.session['tour_signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    return res


def issued(request):
    try:
        data = {
            'provider': request.session['tour_pick']['provider'],
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.session['tour_signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def get_payment_rules(request):
    data = {
        'provider': request.session['tour_pick']['provider'],
        'id': request.POST['id']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_payment_rules_provider",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


