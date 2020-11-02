from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import logging
import traceback
from .tt_webservice_views import *
_logger = logging.getLogger("rodextrip_logger")

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
        if req_data['action'] == 'get_payment_acquirer':
            res = get_payment_acquirer(request)
        elif req_data['action'] == 'payment':
            res = testing_payment_webhook(request)
        elif req_data['action'] == 'get_order_number':
            res = get_order_number(request)
        elif req_data['action'] == 'get_merchant_info':
            res = get_merchant_info(request)
        elif req_data['action'] == 'set_payment_method':
            res = set_payment_method(request)
        elif req_data['action'] == 'check_payment_payment_method':
            res = check_payment_payment_method(request)
        elif req_data['action'] == 'get_order_number_frontend':
            res = get_order_number_frontend_webservice(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def get_payment_acquirer(request):
    try:
        data = {
            'booker_seq_id': request.POST['booker_seq_id'],
            'order_number': request.POST['order_number'],
            'transaction_type': request.POST['transaction_type'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_payment_acquirer",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    if request.POST['type'] == 'airline' or request.POST['type'] == 'airline_review' or request.POST['type'] == 'airline_reissue' or request.POST['type'] == 'airline_after_sales':
        url_post = 'booking/airline'
    elif request.POST['type'] == 'train':
        url_post = 'booking/train'
    elif request.POST['type'] == 'activity' or request.POST['type'] == 'activity_review':
        url_post = 'booking/activity'
    elif request.POST['type'] == 'registration':
        url_post = 'session/agent_registration'
    elif request.POST['type'] == 'visa':
        url_post = 'booking/visa'
    elif request.POST['type'] == 'passport':
        url_post = 'booking/passport'
    elif request.POST['type'] == 'top_up':
        url_post = 'account'
    elif request.POST['type'] == 'issued_offline':
        url_post = 'booking/issued_offline'
    elif request.POST['type'] == 'ppob':
        url_post = 'booking/ppob'
    elif request.POST['type'] == 'hotel_review' or request.POST['type'] == 'hotel':
        url_post = 'booking/hotel'
        # data.update({
        #     # 'agent_seq_id': request.POST['agent_seq_id'],
        #     'top_up_name': request.POST['top_up_name']
        # })
    elif request.POST['type'] == 'tour':
        url_post = 'booking/tour'
    elif request.POST['type'] == 'event':
        url_post = 'booking/event'
    res = util.send_request(url=url + url_post, data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_payment_acquirer_payment " + request.POST['type'] + " SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_payment_acquirer_payment " + request.POST['type'] + " SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    if res['result']['error_code'] == 0:
        pass
    return res

def testing_payment_webhook(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "",
        }
        res = util.send_request(url=url + 'webhook/payment/espay', data=data, headers=headers, method='POST')
    except:
        res = 0
    return res

def get_order_number(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
            'seq_id': request.POST['seq_id']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_payment_acquirer_payment_gateway",
            "signature": request.POST['signature']
        }
        res = util.send_request(url=url + 'payment', data=data, headers=headers, method='POST')
    except:
        res = 0
    return res

def get_merchant_info(request):
    try:
        data = {
            'provider': 'espay'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "merchant_info",
            "signature": request.POST['signature']
        }
        res = util.send_request(url=url + 'payment', data=data, headers=headers, method='POST')
    except Exception as e:
        res = 0
    return res

def set_payment_method(request):
    try:
        data = {
            "provider": "espay",
            "signature": request.POST['signature'],
            "order_number": request.POST['order_number'],
            "bank_code": request.POST['bank_code'],
            "bank_name": request.POST['bank_name'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_invoice",
            "signature": request.POST['signature']
        }
        res = util.send_request(url=url + 'payment', data=data, headers=headers, method='POST')
        if res['result']['error_code'] == 0:
            res['result']['response']['expired'] = convert_string_to_date_to_string_front_end_with_time(res['result']['response']['expired'])
            res['result']['response']['rs_datetime'] = convert_string_to_date_to_string_front_end_with_time(res['result']['response']['rs_datetime'])
    except Exception as e:
        res = 0
    return res

def check_payment_payment_method(request):
    try:
        data = {
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_payment_acquirer_payment_gateway_frontend",
            "signature": request.POST['signature']
        }
        res = util.send_request(url=url + 'payment', data=data, headers=headers, method='POST')
    except:
        res = 0
    return res

def get_order_number_frontend(req):
    try:
        data = {
            'order_number': req['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_payment_acquirer_payment_gateway_frontend",
            "signature": req['signature']
        }
        res = util.send_request(url=url + 'payment', data=data, headers=headers, method='POST')
    except:
        res = 0
    return res

def get_order_number_frontend_webservice(request):
    try:
        data = {
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_payment_acquirer_payment_gateway_frontend",
            "signature": request.POST['signature']
        }
        res = util.send_request(url=url + 'payment', data=data, headers=headers, method='POST')
    except:
        res = 0
    return res