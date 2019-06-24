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
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
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
    headers.update({
        "action": 'signin'
    })
    res = util.send_request(url=url + "session", data=data, headers=headers, method='POST')
    request.session['tour_signature'] = res['result']['response']['signature']
    res = get_countries(request)

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
    headers.update({
        "action": "search",
        "signature": request.session['tour_signature'],
    })

    res = util.send_request(url=url + 'tour/booking', data=data, headers=headers, method='POST')

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
    headers.update({
        "action": "get_countries",
        "signature": request.session['tour_signature'],
    })

    res = util.send_request(url=url + 'tour/booking', data=data, headers=headers, method='POST')
    return res


def get_details(request):
    data = {
        'provider': 'skytors_tour',
        'id': request.POST['id'],
    }
    headers.update({
        "action": "get_details",
        "signature": request.session['tour_signature'],
    })

    res = util.send_request(url=url + 'tour/booking', data=data, headers=headers, method='POST')
    return res


def get_booking(request):
    data = {
        'order_number': request.POST['order_number']
    }
    headers.update({
        "action": "get_booking",
        "signature": request.session['tour_signature'],
    })

    res = util.send_request(url=url + 'tour/booking', data=data, headers=headers, method='POST')
    return res


def commit_booking(request):
    data = {
        'force_issued': bool(request.POST['value'])
    }
    headers.update({
        "action": "commit_booking",
        "signature": request.session['tour_signature'],
    })

    res = util.send_request(url=url + 'tour/booking', data=data, headers=headers, method='POST')
    return res


def issued(request):
    data = {
        'order_number': request.POST['order_number']
    }
    headers.update({
        "action": "issued",
        "signature": request.session['tour_signature'],
    })

    res = util.send_request(url=url + 'tour/booking', data=data, headers=headers, method='POST')
    return res


