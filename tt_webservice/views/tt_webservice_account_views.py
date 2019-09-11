from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
import datetime
from ..static.tt_webservice.url import *
import json

import logging
import traceback
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
        if req_data['action'] == 'get_balance':
            res = get_balance(request)
        elif req_data['action'] == 'get_account':
            res = get_account(request)
        elif req_data['action'] == 'get_transactions':
            res = get_transactions(request)
        elif req_data['action'] == 'get_version':
            res = get_version(request)
        elif req_data['action'] == 'get_top_up_amount':
            res = get_top_up_amount(request)
        elif req_data['action'] == 'get_top_up':
            res = get_top_up(request)
        elif req_data['action'] == 'submit_top_up':
            res = submit_top_up(request)
        elif req_data['action'] == 'confirm_top_up':
            res = confirm_top_up(request)
        elif req_data['action'] == 'request_top_up_api':
            res = request_top_up(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def get_version(request):
    file = open("javascript_version.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()
    res = {
        'result': {
            'error_code': 0,
            'error_msg': '',
            'response': {
                'version': file_cache_name
            }
        }
    }
    return res

def get_account(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_account",
            "signature": request.POST['signature']
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        request.session['user_account'] = res['result']['response']
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_account SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_balance(request):
    if request.POST['using_cache'] == 'false':
        try:
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_balance",
                "signature": request.POST['signature'],
            }
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
        res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
        request.session['get_balance_session'] = res
        request.session.modified = True
    else:
        try:
            res = request.session['get_balance_session']
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_balance SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_transactions(request):
    if request.POST['using_cache'] == 'false':
        try:
            data = {
                'minimum': int(request.POST['offset']) * int(request.POST['limit']),
                'maximum': (int(request.POST['offset']) + 1) * int(request.POST['limit']),
                'provider_type': json.loads(request.POST['provider_type']),
                # 'order_or_pnr': request.POST['name']
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_transactions",
                "signature": request.POST['signature'],
            }
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

        res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
        if int(request.POST['offset']) == 0:
            request.session['get_transactions_session'] = res
            request.session.modified = True
    else:
        res = request.session['get_transactions_session']
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_transactions SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_payment_acquirer(request):
    try:
        data = {
            # 'agent_id': request.POST['agent_id'],
            'booker_id': request.POST['booker_id'],
            'order_number': request.POST['order_number'],
            'transaction_type': 'billing'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_transactions",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_payment_acquirer SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_top_up_amount(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_top_up_amount",
            "signature": request.POST['signature']
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        request.session['top_up_amount'] = res['result']['response']
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_account SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_top_up(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_top_up",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            for top_up in res['result']['response']:
                top_up.update({
                    'due_date': convert_string_to_date_to_string_front_end_with_time(top_up['due_date'])
                })
            logging.getLogger("info_logger").info("get_balance SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def submit_top_up(request):
    try:
        data = {
          'name': 'New',
          'currency_code': request.POST['currency_code'],
          'amount_seq_id': request.POST['amount_seq_id'],
          'amount_count': int(request.POST['amount_count']),
          'unique_amount': int(request.POST['unique_amount']),
          'fees': 0,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "submit_top_up",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_transactions SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def confirm_top_up(request):
    try:
        data = {
            'name': request.POST['name'],
            'payment_seq_id': request.POST['payment_seq_id']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "confirm_top_up",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_payment_acquirer SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def request_top_up(request):
    try:
        data = {
            'name': request.POST['name'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "request_top_up",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_payment_acquirer SUCCESS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res