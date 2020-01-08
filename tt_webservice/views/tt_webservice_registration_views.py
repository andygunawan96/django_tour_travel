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
_logger = logging.getLogger(__name__)

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

def get_requirement_list_doc(request):
    try:
        data = {
            'provider': 'rodextrip_agent_registration'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_requirement_list_doc",
            'signature': request.session['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS get_requirement_list_doc_agent_regis SIGNATURE " + request.session['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR get_requirement_list_doc_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
            'signature': request.session['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')

    if res['result']['error_code'] != 0:
        login(request, 'get_config')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS get_config_agent_regis SIGNATURE " + request.session['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR get_config_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
            'signature': request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')

    if res['result']['error_code'] != 0:
        login(request, 'get_config')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS get_promotion_agent_regis SIGNATURE " + request.session['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR get_promotion_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def register(request):
    try:
        data = request.session['registration_request']
        data['regis_doc'] = upload_image_agent_regis(data['regis_doc'], data['company']['name'], request.POST['signature'])
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_agent",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "session/agent_registration", data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] != 0:
            login(request, 'register')
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS create_agent_agent_regis SIGNATURE " + request.session['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR create_agent_agent_regis SIGNATURE " + request.session['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

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