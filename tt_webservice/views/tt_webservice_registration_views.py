from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import logging
import base64
import traceback
from .tt_webservice_views import *
import time
import copy
_logger = logging.getLogger("rodextrip_logger")

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'get_requirement_list_doc':
            res = get_requirement_list_doc(request)
        elif req_data['action'] == 'agent_registration':
            res = register(request)
        elif req_data['action'] == 'get_promotions':
            res = get_promotions(request)
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
            "co_user": request.session['username'] or user_default,
            "co_password": request.session['password'] or password_default,
            "co_uid": ""
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        time.sleep(1)
        request.session['signature'] = res['result']['response']['signature']
        _logger.info(json.dumps(request.session['signature']))
        request.session.modified = True
        if func == 'get_config':
            res = get_config(request)
        elif func == 'register':
            res = register(request)
        elif func == 'get_requirement':
            res = get_requirement_list_doc(request)
        elif func == 'get_promotions':
            res = get_promotions(request)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_requirement_list_doc(request):
    try:
        data = {
            'provider': 'rodextrip_agent_registration'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_requirement_list_doc",
            'signature': request.session.get('signature') or ''
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')
    if res['result']['error_code'] != 0:
        res = login(request, 'get_requirement')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_requirement_list_doc_agent_regis SIGNATURE " + request.session['signature'])
        else:
            _logger.error("ERROR get_requirement_list_doc_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_config(request):
    try:
        data = {
            'provider': 'rodextrip_agent_registration'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            'signature': request.session.get('signature') or ''
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')

    if res['result']['error_code'] != 0:
        res = login(request, 'get_config')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_config_agent_regis SIGNATURE " + request.session['signature'])
        else:
            _logger.error("ERROR get_config_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_promotions(request):
    try:
        data = {
            'provider': 'rodextrip_agent_registration'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_promotions",
            'signature': request.session.get('signature') or ''
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')

    if res['result']['error_code'] != 0:
        res = login(request, 'get_promotions')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_promotion_agent_regis SIGNATURE " + request.session['signature'])
        else:
            _logger.error("ERROR get_promotion_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def register(request):
    check = 0
    try:
        data = copy.deepcopy(request.session['registration_request'])
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_agent",
            "signature": request.session.get('signature') or ''
        }
        if request.session.get('register_done_data') == data:
            check = 1
        else:
            data['regis_doc'] = upload_image_agent_regis(data['regis_doc'], data['company']['name'], request.session.get('signature') or '')
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    if check == 0:
        res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')
    else:
        res = request.session['register_result_done']
    try:
        if res['result']['error_code'] != 0:
            res = login(request, 'register')
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    if res['result']['error_code'] != 0:
        res = login(request, 'register')
    try:
        if res['result']['error_code'] == 0:
            request.session['register_done_data'] = copy.deepcopy(request.session['registration_request'])
            request.session['register_result_done'] = res
            request.session.modified = True
            _logger.info("SUCCESS create_agent_agent_regis SIGNATURE " + request.session['signature'])
        else:
            _logger.error("ERROR create_agent_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def upload_image_agent_regis(data, name, signature):
    try:
        imgData = []

        for img in data:
            imgData.append({
                'filename': name + '_' + img['name'],
                'file_reference': name + '_' + img['type'],
                'file': base64.b64encode(str.encode(img['data'])).decode('ascii'),
                'type': img['content_type'],
                'agent_type': img['type']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "upload_file",
            "signature": signature,
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    list_img = []
    for img in imgData:
        data = img
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
        list_img.append([res['result']['response']['seq_id'], 4, img['agent_type']])
    return list_img