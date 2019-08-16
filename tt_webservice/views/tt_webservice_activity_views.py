from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json

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
        elif req_data['action'] == 'search2':
            res = search2(request)
        elif req_data['action'] == 'get_details2':
            res = get_details2(request)
        elif req_data['action'] == 'get_pricing2':
            res = get_pricing2(request)
        elif req_data['action'] == 'create_booking':
            res = create_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'get_voucher':
            res = get_voucher(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)


def login(request):
    data = {
        "user": user,
        "password": password,
        'api_key': api_key_activity,
        'co_uid': int(request.session['co_uid'])
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": 'signin'
    }
    res = util.send_request(url=url + "themespark/session", data=data, headers=headers, method='POST')
    request.session['activity_sid'] = res['result']['sid']
    request.session['activity_cookie'] = res['result']['cookies']
    res = search2(request)

    return res

def search2(request):

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
        "action": "search2",
        "sid": request.session['activity_sid'],
    }

    res = util.send_request(url=url + 'themespark/booking', data=data, headers=headers, cookies=request.session['activity_cookie'], method='POST')

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

def get_details2(request):

    data = {
        'uuid': request.POST['uuid']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_details2",
        "sid": request.session['activity_sid'],
    }

    res = util.send_request(url=url + 'themespark/booking', data=data, headers=headers, cookies=request.session['activity_cookie'], method='POST')
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

def get_pricing2(request):

    data = {
        'product_type_uuid': request.POST['product_type_uuid'],
        'date_start': to_date_now(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))[:10],
        'date_end': to_date_now((datetime.now()+timedelta(days=365)).strftime('%Y-%m-%d %H:%M:%S'))[:10],
        "provider": request.POST['provider']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_pricing2",
        "sid": request.session['activity_sid'],
    }

    res = util.send_request(url=url + 'themespark/booking', data=data, headers=headers, cookies=request.session['activity_cookie'], method='POST')
    request.session['activity_price'] = res
    return res

def create_booking(request):

    passenger = []

    file = open("version_cache.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()

    file = open(str(file_cache_name) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()

    countries = response['result']['response']['airline']['country']

    for pax in request.session['activity_review_booking']['adult']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
            pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
        })
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['senior']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0])
        })
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['child']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0])
        })
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['infant']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0])
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
                    if country['code'] == item.value:
                        item.update({
                            'value': country['name']
                        })
                        break
        print('a')
    data = {
        "passengers": passenger,
        "option": {
            "perBooking": perbooking,
            "perPax": perpax
        },
        "kwargs": {
            "is_themespark": True,
            'payment_amount': 1,
            "force_issued": True
        },
        "promotion_codes_booking": [],
        "create_booking_type": "issued_book",
        "contact": request.session['activity_review_booking']['booker'],
        "search_request": request.session['activity_review_booking']['search_request'],
        "transaction_type": "issued_book",
        "provider": request.session['activity_pick']['provider'],
        "upload_value": request.session['activity_review_booking']['upload_value']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_booking",
        "sid": request.session['activity_sid'],
    }

    res = util.send_request(url=url + 'themespark/booking', data=data, headers=headers,
                            cookies=request.session['activity_cookie'], method='POST')
    if res['result']['error_code'] == 0:
        request.session['activity_order_number'] = res['result']['response']['order_number']

    return res

def get_booking(request):

    data = {
        'order_number': request.POST['order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_booking2",
        "sid": request.session['activity_sid'],
    }

    res = util.send_request(url=url + 'themespark/booking', data=data, headers=headers, cookies=request.session['activity_cookie'], method='POST')
    return res

def get_voucher(request):

    data = {
        'order_number': request.session['activity_order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_vouchers2",
        "sid": request.session['activity_sid'],
    }

    res = util.send_request(url=url + 'themespark/booking', data=data, headers=headers, cookies=request.session['activity_cookie'], method='POST')
    return res