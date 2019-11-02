from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import base64
import logging
import traceback
from .tt_webservice_views import *
_logger = logging.getLogger(__name__)

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

cabin_class_list = {
    'All': 'ALL',
    'Y': 'Economy',
    'W': 'Premium Economy',
    'C': 'Business',
    'F': 'First',
    'ALL': 'All',
    'Economy': 'Y',
    'Premium': 'W',
    'Business': 'C',
    'First': 'F',
}

data_bca = {
    'client_id': 'cd7db9f2-8107-46c7-aeec-a1fc4d62b376',
    'client_secret': 'b02a586f-4c41-40ed-9682-c674799750dd',
    'key': "ae20ad3c-cc2c-4676-82a6-e22484af05b1",
    'api_secret': 'aa7d2816-32a1-4779-beb2-4a04fa063cd4'
}

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'upload_file':
            res = upload_file(request)
        elif req_data['action'] == 'add_banner':
            res = add_banner(request)
        elif req_data['action'] == 'get_banner':
            res = get_banner(request)
        elif req_data['action'] == 'set_inactive_delete_banner':
            res = set_inactive_delete_banner(request)
        elif req_data['action'] == 'get_country':
            res = get_country()
        elif req_data['action'] == 'update_image_passenger':
            res = update_image_passenger(request)
        elif req_data['action'] == 'get_public_holiday':
            res = get_public_holiday(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
    credential = '%s:%s' % (data_bca['client_id'], data_bca['client_secret'])
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + str(base64.b64encode(credential.encode('utf-8')), 'utf-8').replace('\n', '')
    }

    data = 'grant_type=client_credentials'
    # https://sandbox.bca.co.id
    res = util.send_request(url='https://devapi.klikbca.com/api/oauth/token', data=data, headers=headers, method='POST')

    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def upload_file(request):
    try:
        imgData = []

        for i in request.FILES:
            for img in request.FILES.getlist(i):
                imgData.append({
                    'filename': img.name,
                    'file_reference': img.name,
                    'file': base64.b64encode(img.file.read()).decode('ascii'),
                    'type': i
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "upload_file",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    list_img = []
    for img in imgData:
        data = img
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
        list_img.append([res['result']['response']['seq_id'], 4])
    try:
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': list_img
            }
        }
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def update_image_passenger(request):
    try:
        imgData = []

        for i in request.FILES:
            for img in request.FILES.getlist(i):
                imgData.append({
                    'filename': img.name,
                    'file_reference': img.name,
                    'file': base64.b64encode(img.file.read()).decode('ascii'),
                    'type': i
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "upload_file",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    list_img = []
    for img in imgData:
        data = img
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
        list_img.append([res['result']['response']['seq_id'], 4, img['type']])
    try:
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': list_img
            }
        }
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_country():
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)
    try:
        airline_country = response['result']['response']['airline']['country']
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': airline_country
            }
        }
    except:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': 'No Cache',
                'response': ''
            }
        }
    return res

def add_banner(request):
    try:
        imgData = []

        for i in request.FILES:
            for img in request.FILES.getlist(i):
                imgData.append({
                    'filename': img.name,
                    'file_reference': img.name,
                    'file': base64.b64encode(img.file.read()).decode('ascii'),
                    'type': i
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "add_banner",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    for img in imgData:
        data = img
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
    try:
        if len(imgData) == 0:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                }
            }
        pass
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_banner(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_banner",
            "signature": request.POST['signature'],
        }
        data = {
            'type': request.POST['type']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
    try:
        pass
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def set_inactive_delete_banner(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_inactive_delete_banner",
            "signature": request.POST['signature'],
        }

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    imgs = json.loads(request.POST['img'])
    for img in imgs:
        data = img
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
    try:
        if len(imgs) == 0:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                }
            }
        pass
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_public_holiday(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_public_holiday",
            "signature": request.POST['signature'],
        }
        data = {
            'country_id': request.POST['country_id'],
            'start_date': request.POST['start_date'],
            'end_date': request.POST.get('end_date') and request.POST['end_date'] or False,
        }

        res = util.send_request(url=url + "content", data=data, headers=headers, method='POST')
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res
