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
from .tt_webservice import *
_logger = logging.getLogger("website_logger")

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
    if request.POST['type'] == 'airline' or request.POST['type'] == 'airline_book_then_issued' or request.POST['type'] == 'airline_review' or request.POST['type'] == 'airline_reissue' or request.POST['type'] == 'airline_after_sales':
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
    elif request.POST['type'] == 'bus':
        url_post = 'booking/bus'
    elif request.POST['type'] == 'hotel_review' or request.POST['type'] == 'hotel':
        url_post = 'booking/hotel'
    elif request.POST['type'] == 'tour' or request.POST['type'] == 'tour_review':
        url_post = 'booking/tour'
    elif request.POST['type'] == 'event':
        url_post = 'booking/event'
    elif request.POST['type'] == 'medical' or request.POST['type'] == 'medical_review':
        if 'PK' in data['order_number']:
            url_post = 'booking/periksain'
        elif 'PH' in data['order_number']:
            url_post = 'booking/phc'
        elif request.session.get('vendor_%s' % request.POST['signature']) == 'periksain': #force issued
            url_post = 'booking/periksain'
        elif request.session.get('vendor_%s' % request.POST['signature']) == 'phc': #force issued
            url_post = 'booking/phc'
    elif request.POST['type'] == 'medical_global' or request.POST['type'] == 'medical_global_review':
        url_post = 'booking/medical'
    elif request.POST['type'] == 'swabexpress' or request.POST['type'] == 'swab_express_review':
        url_post = 'booking/swabexpress'
    elif request.POST['type'] == 'labpintar' or request.POST['type'] == 'lab_pintar_review':
        url_post = 'booking/labpintar'
    elif request.POST['type'] == 'mitrakeluarga' or request.POST['type'] == 'mitra_keluarga_review':
        url_post = 'booking/mitrakeluarga'
    elif request.POST['type'] == 'sentramedika' or request.POST['type'] == 'sentra_medika_review':
        url_post = 'booking/sentramedika'
    elif request.POST['type'] == 'insurance' or request.POST['type'] == 'insurance_review':
        url_post = 'booking/insurance'
    elif request.POST['type'] == 'groupbooking':
        url_post = 'booking/group_booking'
    url_request = get_url_gateway(url_post)
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_payment_acquirer_payment " + request.POST['type'] + " SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_payment_acquirer_payment " + request.POST['type'] + " SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def testing_payment_webhook(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "",
        }
        url_request = get_url_gateway('webhook/payment/espay')
        res = send_request_api(request, url_request, headers, data, 'POST')
    except:
        res = 0
    return res

def get_order_number(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher_reference': request.POST['voucher_reference']
        }
        try:
            if request.POST['use_point'] == 'false':
                data['use_point'] = False
            else:
                data['use_point'] = True
        except:
            _logger.error('use_point not found')
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_payment_acquirer_payment_gateway",
            "signature": request.POST['signature']
        }
        url_request = get_url_gateway('payment')
        res = send_request_api(request, url_request, headers, data, 'POST')
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
        url_request = get_url_gateway('payment')
        res = send_request_api(request, url_request, headers, data, 'POST')
    except Exception as e:
        res = 0
    return res

def set_payment_method(request):
    try:
        data = {
            "provider": request.POST['provider'],
            "signature": request.POST['signature'],
            "order_number": request.POST['order_number'],
            "bank_code": request.POST['bank_code'],
            "bank_name": request.POST['bank_name'],
            "online_wallet": True if request.POST['online_wallet'] == 'true' else False,
            "phone_number": request.POST['phone_number'],
            'save_url': True if request.POST['save_url'] == 'true' else False,
            'url_back': request.POST['url_back']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_invoice",
            "signature": request.POST['signature']
        }
        url_request = get_url_gateway('payment')
        res = send_request_api(request, url_request, headers, data, 'POST', 120)
        if res['result']['error_code'] == 0 and request.POST['phone_number'] == '':
            res['result']['response']['expired'] = convert_string_to_date_to_string_front_end_with_time(res['result']['response']['expired'])
            res['result']['response']['rs_datetime'] = convert_string_to_date_to_string_front_end_with_time(res['result']['response']['rs_datetime'])
    except Exception as e:
        res['result']['error_code'] = 100
        res['result']['error_message'] = 'Error Payment'
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
        url_request = get_url_gateway('payment')
        res = send_request_api(request, url_request, headers, data, 'POST')
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
        url_request = get_url_gateway('payment')
        res = send_request_api(req, url_request, headers, data, 'POST')
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
        url_request = get_url_gateway('payment')
        res = send_request_api(request, url_request, headers, data, 'POST')
    except:
        res = 0
    return res