from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
import datetime
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
        if req_data['action'] == 'get_balance':
            res = get_balance(request)
        elif req_data['action'] == 'get_account':
            res = get_account(request)
        elif req_data['action'] == 'get_transactions':
            res = get_transactions(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def get_account(request):

    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_account",
        "signature": request.session['signature'],
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    request.session['user_account'] = res['result']['response']
    if res['result']['error_code'] == 0:
        pass
    return res

def get_balance(request):

    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_balance",
        "signature": request.session['signature'],
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')

    if res['result']['error_code'] == 0:
        pass
    return res

def get_transactions(request):

    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_transactions",
        "signature": request.session['signature'],
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')

    if res['result']['error_code'] == 0:
        pass
    return res

