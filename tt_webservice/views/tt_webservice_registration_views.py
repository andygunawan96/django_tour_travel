from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.config import *
from ..static.tt_webservice.url import *
import json


@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'agent_registration':
            res = register(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signin",
        "signature": '',
    }

    data = {
        "user": user_global,
        "password": password_global,
        "api_key": api_key,
        "co_user": user_default,  # request.POST['username'],
        "co_password": password_default,  # request.POST['password'],
        "co_uid": ""
    }
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')

    request.session['signature'] = res['result']['response']['signature']
    get_config(request)
    return res

def get_config(request):
    data = {
        'provider': 'skytors_agent_registration'
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_config",
        'signature': request.session['signature']
    }
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')
    if res['result']['error_code'] != 0:
        login(request)
    return res

def register(request):
    data = {
        'comp_name': request.session['registration_request']['comp_name'],
        'birth_date': request.session['registration_request']['birth_date'],
        'name': request.session['registration_request']['name'],
        'email': request.session['registration_request']['email'],
        'socmed_id': 1,
        'agent_type': request.session['registration_request']['agent_type'],
        'city_id': 269,
        'phone': request.session['registration_request']['phone'],
        'mobile': request.session['registration_request']['mobile'],
        'street': request.session['registration_request']['street'],
        'street2': request.session['registration_request']['street2'],
        'zip': request.session['registration_request']['zip'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "agent_registration",
        "signature": request.session['issued_offline_signature'],
    }
    res = util.send_request(url=url + "agent/session", data=data, headers=headers, method='POST')

    return res
