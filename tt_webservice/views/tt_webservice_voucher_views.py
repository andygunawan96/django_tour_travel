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

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'get_voucher':
            res = get_voucher(request)
        elif req_data['action'] == 'set_voucher':
            res = set_voucher(request)
        elif req_data['action'] == 'check_voucher':
            res = check_voucher(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def get_voucher(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_voucher",
            "signature": request.POST['signature']
        }

        data = {
            'reference_code': '-1',
            'start_date': '-1',
            'end_date': '-1',
            'provider_type_id': -1,
            'provider_id': -1
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        request.session['visa_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def set_voucher(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_voucher",
            "signature": request.POST['signature']
        }

        data = {
            'voucher_reference': '',
            'date': datetime.now().strftime('%Y-%m-%d'),
            'provider_type': 'airline',
            'provider': 'amadeus',
            'purchase_amount': 0
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        request.session['visa_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def check_voucher(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "check_voucher",
            "signature": request.POST['signature']
        }

        data = {
            'voucher_reference': request.POST['voucher_reference'],
            'date': datetime.now().strftime('%Y-%m-%d'),
            'provider_type': request.POST['provider_type_id'],
            'provider': json.loads(request.POST['provider_id']),
            # 'purchase_amount': 0
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS check_voucher VOUCHER " + request.POST['provider_type'] + " SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR check_voucher_voucher VOUCHER " + request.POST['provider_type'] + " SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def data_voucher(voucher_code, provider_type_id, provider_id):
    data = {
        'voucher_reference': voucher_code,
        'date': datetime.now().strftime('%Y-%m-%d'),
        'provider_type': provider_type_id,
        'provider': provider_id,
        # 'purchase_amount': 0
    }
    return data