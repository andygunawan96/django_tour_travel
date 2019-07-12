from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.config import *
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
        if req_data['action'] == 'signin':
            res = signin(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_countries':
            res = get_countries(request)
        elif req_data['action'] == 'get_details':
            res = get_details(request)
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


def signin(request):
    data = {
        "user": user_global,
        "password": password_global,
        "api_key": api_key,
        "co_user": user_default,  # request.POST['username'],
        "co_password": password_default,  # request.POST['password'],
        "co_uid": "",
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signin",
        "signature": ''
    }

    res = util.send_request(url=url + "session", data=data, headers=headers, method='POST')
    request.session['tour_signature'] = res['result']['response']['signature']

    return res


def search(request):

    data = {
        'provider': 'skytors_tour',
        'country_id': request.session['tour_request']['country_id'],
        'month': request.session['tour_request']['month'],
        'year': request.session['tour_request']['year'],
        'budget_min': request.session['tour_request']['budget_min'],
        'budget_max': request.session['tour_request']['budget_max'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "search",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')

    data_tour = []
    counter = 0
    try:
        if int(request.POST['offset']) != 0:
            for data in request.session['tour_search']:
                data_tour.append(data)
                counter += 1
    except:
        print('no data')

    for i in res['result']['response']['response']['result']:
        i.update({
            'sequence': counter
        })
        data_tour.append(i)
        counter += 1

    request.session['tour_search'] = data_tour

    return res


def get_countries(request):
    data = {
        'provider': 'skytors_tour',
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_countries",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def get_details(request):
    data = {
        'provider': 'skytors_tour',
        'id': request.POST['id'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_details",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def update_passenger(request):
    temp_booking_data = request.session['booking_data']

    temp_booking_data.update({
        'all_pax': json.loads(request.POST['pax_list_js']),
    })

    request.session['booking_data'] = temp_booking_data

    data = {
        'provider': 'skytors_tour',
        'booking_data': request.session['booking_data'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_passenger",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def get_booking(request):
    data = {
        'provider': 'skytors_tour',
        'order_number': request.POST['order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_booking",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    return res


def commit_booking(request):
    data = {
        'provider': 'skytors_tour',
        'force_issued': request.POST['value'],
        'booker_id': request.POST['booker_id'],
        'pax_ids': request.POST['pax_ids'],
        'payment_method': request.POST['payment_method'],
        'book_line_ids': request.POST['book_line_ids'],
        'booking_data': request.session['booking_data'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "commit_booking",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def issued(request):
    data = {
        'provider': 'skytors_tour',
        'order_number': request.POST['order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "issued",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


def get_payment_rules(request):
    data = {
        'provider': 'skytors_tour',
        'id': request.POST['id']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_payment_rules",
        "signature": request.session['tour_signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    return res


