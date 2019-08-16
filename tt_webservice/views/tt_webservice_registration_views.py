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
_logger = logging.getLogger(__name__)

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

def login(request,func):
    try:
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
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        request.session['signature'] = res['result']['response']['signature']
        if func == 'get_config':
            get_config(request)
        elif func == 'register':
            register(request)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_config(request):
    try:
        data = {
            'provider': 'skytors_agent_registration'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            'signature': request.session['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')

    if res['result']['error_code'] != 0:
        login(request, 'get_config')
    return res

def register(request):
    try:
        data = request.session['registration_request']
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_agent",
            "signature": request.session['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] != 0:
            login(request, 'register')
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res
