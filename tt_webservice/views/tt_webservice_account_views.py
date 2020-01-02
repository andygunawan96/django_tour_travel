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
from .tt_webservice_views import *

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
        if req_data['action'] == 'signin':
            res = signin(request)
        elif req_data['action'] == 'get_balance':
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
        elif req_data['action'] == 'commit_top_up':
            res = commit_top_up(request)
        elif req_data['action'] == 'cancel_top_up':
            res = cancel_top_up(request)
        elif req_data['action'] == 'confirm_top_up':
            res = confirm_top_up(request)
        elif req_data['action'] == 'request_top_up_api':
            res = request_top_up(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def signin(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signin",
        "signature": ''
    }

    data = {
        "user": user_global,
        "password": password_global,
        "api_key":  api_key,

        "co_user": request.POST['username'],
        "co_password": request.POST['password'],
        # "co_user": user_default,  # request.POST['username'],
        # "co_password": password_default, #request.POST['password'],
        "co_uid": ""
    }

    res = util.send_request(url=url+'session', data=data, headers=headers, method='POST', timeout=10)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("RESIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            logging.getLogger("info_logger").info(json.dumps(res))

    except Exception as e:
        logging.getLogger("error_logger").error('ERROR RESIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_version(request):
    javascript_version = get_cache_version()
    res = {
        'result': {
            'error_code': 0,
            'error_msg': '',
            'response': {
                'version': javascript_version
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
            logging.getLogger("info_logger").info("get_account_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_account_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
            logging.getLogger("info_logger").info("get_balance_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_balance_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_transactions(request):
    if request.POST['using_cache'] == 'false':
        try:
            name = ''
            start_date = ''
            end_date = ''
            try:
                name = request.POST['key']
            except:
                pass
            if request.POST['start_date'] != 'Invalid date':
                start_date = request.POST['start_date']
            if request.POST['end_date'] != 'Invalid date':
                end_date = request.POST['end_date']
            data = {
                'minimum': int(request.POST['offset']) * int(request.POST['limit']),
                'maximum': (int(request.POST['offset']) + 1) * int(request.POST['limit']),
                'provider_type': json.loads(request.POST['provider_type']),
                'booker_name': request.POST['booker_name'],
                "type": request.POST['type'],
                # "name": request.POST['name'],
                "passenger_name": request.POST['passenger_name'],
                'pnr': request.POST['pnr'],
                "date_from": start_date,
                "date_to": end_date,
                "state": request.POST['state']
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
            logging.getLogger("info_logger").info("get_transactions_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_transactions_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
            logging.getLogger("info_logger").info("get_top_up_amount_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_top_up_amount_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_top_up(request):
    try:
        start_date = ''
        end_date = ''
        if request.POST['start_date'] != 'Invalid date':
            start_date = request.POST['start_date']
        if request.POST['end_date'] != 'Invalid date':
            end_date = request.POST['end_date']
        data = {
            "type": request.POST['type'],
            "name": request.POST['name'],
            "date_from": start_date,
            "date_to": end_date,
            "state": request.POST['state']
        }
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
                if top_up['due_date'] != '':
                    top_up.update({
                        'due_date': convert_string_to_date_to_string_front_end_with_time(top_up['due_date'])
                    })
            logging.getLogger("info_logger").info("get_top_up_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_top_up_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def submit_top_up(request):
    try:
        data = {
            # 'name': 'New',
            # 'currency_code': request.POST['currency_code'],
            'amount': request.POST['amount'],
            # 'amount_count': int(request.POST['amount_count']),
            # 'unique_amount': int(request.POST['unique_amount']),
            # 'payment_seq_id': request.POST['seq_id'],
            # 'fees': 0,
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
            logging.getLogger("info_logger").info("get_submit_top_up_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_submit_top_up_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_top_up(request):
    try:
        data = {
            'seq_id': request.POST['seq_id'],
        }
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data.update({
            'member': member,
        })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_top_up",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_commit_top_up_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_commit_top_up_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel_top_up(request):
    try:
        data = {
            'name': request.POST['name'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel_top_up",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_payment_acquirer_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_payment_acquirer_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def confirm_top_up(request):
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
            logging.getLogger("info_logger").info("get_payment_acquirer_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_payment_acquirer_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

#DEPRECATED
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
            logging.getLogger("info_logger").info("get_payment_acquirer_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_payment_acquirer_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res