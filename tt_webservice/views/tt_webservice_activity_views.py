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
        if req_data['action'] == 'login':
            res = login(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_details':
            res = get_details(request)
        elif req_data['action'] == 'get_pricing':
            res = get_pricing(request)
        elif req_data['action'] == 'create_booking':
            res = create_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'get_voucher':
            res = get_voucher(request)
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
        request.session['activity_signature'] = res['result']['response']['signature']
        logging.getLogger("info_logger").info(
            "SIGNIN ACTIVITY SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res


def search(request):
    data = {
        'query': request.session['activity_request']['query'],
        'country': request.session['activity_request']['country'],
        'city': request.session['activity_request']['city'],
        'sort': request.POST['sort'],
        'type_id': request.session['activity_request']['type_id'],
        'category': request.session['activity_request']['category'],
        'sub_category': request.session['activity_request']['sub_category'],
        'limit': int(request.POST['limit']),
        'offset': int(request.POST['offset']),
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "search",
        "signature": request.session['activity_signature']
    }

    res = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST')

    data_activity = []
    counter = 0
    try:
        if int(request.POST['offset']) != 0:
            for data in request.session['activity_search']:
                data_activity.append(data)
                counter += 1
    except:
        print('no data')


    for i in res['result']['response']:
        i.update({
            'sequence': counter
        })
        data_activity.append(i)
        counter += 1

    request.session['activity_search'] = data_activity

    return res


def get_details(request):
    data = {
        'uuid': request.POST['uuid'],
        'provider_id': request.POST['provider_id']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_details",
        "signature": request.session['activity_signature']
    }

    res = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST')
    try:
        if res['error_code'] == 0:
            res['response'] = json.loads(res['response'])
            for response in res['response']['result']:
                for option in response['options']['perBooking']:
                    option.update({
                        'price_pick': 0
                    })
                for option in response['options']['perPax']:
                    option.update({
                        'price_pick': 0
                    })

            request.session['activity_detail'] = res['response']
    except:
        print('error')
    return res


def get_pricing(request):
    pricing_days = int(request.POST['pricing_days'])
    startingDate = request.POST['startingDate']
    data = {
        'product_type_uuid': request.POST['product_type_uuid'],
        'date_start': to_date_now(datetime.strptime(startingDate, '%d %b %Y').strftime('%Y-%m-%d %H:%M:%S'))[:10],
        'date_end': to_date_now((datetime.strptime(startingDate, '%d %b %Y')+timedelta(days=pricing_days)).strftime('%Y-%m-%d %H:%M:%S'))[:10],
        "provider": request.POST['provider']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_pricing_provider",
        "signature": request.session['activity_signature']
    }

    res = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST')
    request.session['activity_price'] = res
    return res


def create_booking(request):
    if request.POST['member'] == 'non_member':
        member = False
    else:
        member = True
    passenger = []
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)

    countries = response['result']['response']['airline']['country']

    for pax in request.session['activity_review_booking']['adult']:
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
        if pax['identity_expdate'] == '':
            pax.update({
                "identity_type": ""
            })
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['senior']:
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
        if pax['identity_expdate'] == '':
            pax.update({
                "identity_type": ""
            })
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['child']:
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
        if pax['identity_expdate'] == '':
            pax.update({
                "identity_type": ""
            })
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['infant']:
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
        if pax['identity_expdate'] == '':
            pax.update({
                "identity_type": ""
            })
        passenger.append(pax)

    perbooking = request.session['activity_perbooking']
    for booking in perbooking:
        if booking['name'] == 'Nationality':
            for country in countries:
                if country['code'] == booking.value:
                    booking.update({
                        'value': country['name']
                    })
                    break

    perpax = request.session['activity_perpax']
    for pax in perpax:
        for item in pax:
            if item['name'] == 'Nationality':
                for country in countries:
                    if country['code'] == item['value']:
                        item.update({
                            'value': country['name']
                        })
                        break
        print('a')

    booker = request.session['activity_review_booking']['booker']
    contacts = request.session['activity_review_booking']['contacts']
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
        "passengers": passenger,
        "option": {
            "perBooking": perbooking,
            "perPax": perpax
        },
        "kwargs": {
            "is_activity": True,
            'payment_amount': 1,
            "force_issued": True
        },
        "promotion_codes_booking": [],
        "create_booking_type": "issued_book",
        "booker": booker,
        "contacts": contacts,
        "search_request": request.session['activity_review_booking']['search_request'],
        "transaction_type": "issued_book",
        "provider": request.session['activity_pick']['provider'],
        "upload_value": request.session['activity_review_booking']['upload_value'],
        "pricing": request.session['activity_review_booking']['pricing'],
        'member': member,
        'seq_id': request.POST['seq_id'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_booking",
        "signature": request.session['activity_signature']
    }

    res = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST')
    if res['result']['error_code'] == 0:
        request.session['activity_order_number'] = res['result']['response']['order_number']

    return res


def get_booking(request):
    data = {
        'order_number': request.POST['order_number']}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_booking",
        "signature": request.session['activity_signature']
    }

    res = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST')
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

    res = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_service_charge ACTIVITY SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_service_charge ACTIVITY SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res


def get_voucher(request):
    data = {
        'order_number': request.POST['order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_vouchers",
        "signature": request.session['activity_signature']
    }

    res = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST')
    return res