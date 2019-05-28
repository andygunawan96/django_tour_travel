from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.config import *
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
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)


def signin(request):
    data = {
        "user": user_global,
        "password": password_global,
        "api_key": api_key_tour,
        "co_user": user_default,  # request.POST['username'],
        "co_password": password_default,  # request.POST['password'],
        "co_uid": "",
        "provider": "skytors_tour"
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

