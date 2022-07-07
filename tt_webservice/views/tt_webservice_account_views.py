from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import datetime
from ..static.tt_webservice.url import *
import json
import logging
import traceback
import base64
import os
from django.core.files.storage import FileSystemStorage

_logger = logging.getLogger("rodextrip_logger")
from .tt_webservice_views import *
from .tt_webservice import *
import time
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

class time_class:
    def __init__(self, name):
        self.get_time_balance = name
        self.get_time_balance_first_time = True
        self.get_time_transaction = name
        self.get_time_transaction_first_time = True
        self.get_time_transaction_ledger = name
        self.get_time_transaction_ledger_first_time = True
    def set_new_time_out(self, val):
        if val == 'balance':
            self.get_time_balance = datetime.now()
        elif val == 'transaction':
            self.get_time_transaction = datetime.now()
        elif val == 'transaction_ledger':
            self.get_time_transaction_ledger = datetime.now()
    def set_first_time(self,val):
        if val == 'balance':
            self.get_time_balance_first_time = False
        elif val == 'transaction':
            self.get_time_transaction_first_time = False
        elif val == 'transaction_ledger':
            self.get_time_transaction_ledger_first_time = False

time_check = time_class(datetime.now())

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = signin(request)
        elif req_data['action'] == 'check_session':
            res = check_session(request)
        elif req_data['action'] == 'update_session':
            res = update_session(request)
        elif req_data['action'] == 'signup_user':
            res = signup_user(request)
        elif req_data['action'] == 'get_balance':
            res = get_balance(request)
        elif req_data['action'] == 'get_account':
            res = get_account(request)
        elif req_data['action'] == 'get_transactions':
            res = get_transactions(request)
        elif req_data['action'] == 'get_history_transaction_ledger':
            res = get_history_transaction_ledger(request)
        elif req_data['action'] == 'get_version':
            res = get_version(request)
        elif req_data['action'] == 'get_top_up_amount':
            res = get_top_up_amount(request)
        elif req_data['action'] == 'get_top_up_quota':
            res = get_top_up_quota(request)
        elif req_data['action'] == 'buy_quota_btbo2':
            res = buy_quota_btbo2(request)
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
        elif req_data['action'] == 'reset_password':
            res = reset_password(request)
        elif req_data['action'] == 'set_highlight_url':
            res = set_highlight_url(request)
        elif req_data['action'] == 'get_highlight_url':
            res = get_highlight_url(request)
        elif req_data['action'] == 'set_contact_url':
            res = set_contact_url(request)
        elif req_data['action'] == 'get_contact_url':
            res = get_contact_url(request)
        elif req_data['action'] == 'set_social_url':
            res = set_social_url(request)
        elif req_data['action'] == 'get_social_url':
            res = get_social_url(request)
        elif req_data['action'] == 'set_payment_partner':
            res = set_payment_partner(request)
        elif req_data['action'] == 'get_payment_partner':
            res = get_payment_partner(request)
        elif req_data['action'] == 'delete_payment_partner':
            res = delete_payment_partner(request)
        elif req_data['action'] == 'set_about_us':
            res = set_about_us(request)
        elif req_data['action'] == 'get_about_us':
            res = get_about_us(request)
        elif req_data['action'] == 'delete_about_us':
            res = delete_about_us(request)
        elif req_data['action'] == 'set_faq':
            res = set_faq(request)
        elif req_data['action'] == 'get_faq':
            res = get_faq(request)
        elif req_data['action'] == 'delete_faq':
            res = delete_faq(request)
        elif req_data['action'] == 'get_va_number':
            res = get_va_number(request)
        elif req_data['action'] == 'get_va_number_for_mobile':
            res = get_va_number_for_mobile(request)
        elif req_data['action'] == 'get_va_bank':
            res = get_va_bank(request)
        elif req_data['action'] == 'set_payment_information':
            res = set_payment_information(request)
        elif req_data['action'] == 'send_url_booking':
            res = send_url_booking(request)
        elif req_data['action'] == 'get_vendor_balance':
            res = get_vendor_balance(request)
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

        "co_user": request.session.get('username') or user_default,
        "co_password": request.session.get('password') or password_default,
        "co_uid": ""
    }
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 10)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("RESIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            _logger.info(json.dumps(res))

    except Exception as e:
        _logger.error('ERROR RESIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def check_session(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "check_session",
        "signature": request.POST['signature']
    }
    try:
        data = {}
    except Exception as e:
        _logger.error('ERROR check session\n' + str(e) + '\n' + traceback.format_exc())
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 30)
    return res

def update_session(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_session",
        "signature": request.POST['signature']
    }
    try:
        data = {}
    except Exception as e:
        _logger.error('ERROR update session\n' + str(e) + '\n' + traceback.format_exc())
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 30)
    return res

def signup_user(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signup_user",
        "signature": request.POST['signature']
    }

    data = {
        "phone": request.POST['phone'],
        "email": request.POST['email'],
        "first_name": request.POST['first_name'],
        "last_name": request.POST['last_name'],
        "nationality_code": request.POST['nationality_code'],
        "title": request.POST['title'],
        "password": '',
    }
    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST', 30)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("CREATE USER SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.info(json.dumps(res))

    except Exception as e:
        _logger.error('ERROR CREATE USER\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def auto_signin(request):
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

        "co_user": user_global,
        "co_password": password_global,
        # "co_user": user_default,  # request.POST['username'],
        # "co_password": password_default, #request.POST['password'],
        "co_uid": ""
    }
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 10)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("RESIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            _logger.info(json.dumps(res))

    except Exception as e:
        _logger.error('ERROR RESIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def reset_password(request):
    try:
        res_signin = auto_signin(request)
        data = {
            'email': request.POST['email']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "reset_password",
            "signature": res_signin['result']['response']['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("reset_password SUCCESS SIGNATURE " + res_signin['result']['response']['signature'])
        else:
            _logger.error("reset_password ERROR SIGNATURE " + res_signin['result']['response']['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        set_session(request, 'user_account', res['result']['response'])
        if res['result']['error_code'] == 0:
            _logger.info("get_account_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_account_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_balance(request):
    if request.POST['using_cache'] == 'false':
        res = get_balance_request(request)
    else:
        try:
            date_time = datetime.now() - time_check.get_time_balance
            if date_time.seconds >= 300 or time_check.get_time_balance_first_time == True:
                res = get_balance_request(request)
            else:
                if request.session.get('get_balance_session'):
                    if request.session['get_balance_session']['result'].get('error_code') == 0:
                        res = request.session['get_balance_session']
                    else:
                        res = get_balance_request(request)
                else:
                    res = get_balance_request(request)
        except Exception as e:
            res = get_balance_request(request)
            _logger.error(str(e) + '\n' + traceback.format_exc())
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_balance_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_balance_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_balance_request(request):
    res = {}
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_balance",
            "signature": request.POST.get('signature') or request.session.get('signature'),
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    try:
        url_request = url + 'account'
        res = send_request_api(request, url_request, headers, data, 'POST', 60)
        set_session(request, 'get_balance_session', res)
        _logger.info(json.dumps(request.session['get_balance_session']))
        if res['result']['error_code'] == 0:
            time_check.set_new_time_out('balance')
            time_check.set_first_time('balance')
    except ERR.RequestException as e:
        _logger.error('get_balance', 'Request Error' + '\n' + e.message + '\n' + traceback.format_exc())

    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        # get balance ulang
        request.session['get_balance_session'] = res
        request.session.modified = True
        if res['result']['error_code'] == 0:
            time_check.set_new_time_out('balance')
            time_check.set_first_time('balance')
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

            tmp_pnr = request.POST['pnr']
            if '.' in tmp_pnr:
                pnr = ''
                order_number = tmp_pnr
            else:
                pnr = tmp_pnr
                order_number = ''
            data = {
                'minimum': int(request.POST['offset']) * int(request.POST['limit']),
                'maximum': (int(request.POST['offset']) + 1) * int(request.POST['limit']),
                'provider_type': json.loads(request.POST['provider_type']),
                'booker_name': request.POST['booker_name'],
                "type": request.POST['type'],
                # "name": request.POST['name'],
                "passenger_name": request.POST['passenger_name'],
                'pnr': pnr,
                'order_number': order_number,
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
            _logger.error(str(e) + '\n' + traceback.format_exc())

        url_request = url + 'account'
        res = send_request_api(request, url_request, headers, data, 'POST')
        if int(request.POST['offset']) == 0:
            set_session(request, 'get_transactions_session', res)
            request.session.modified = True
        time_check.set_new_time_out('transaction')
        time_check.set_first_time('transaction')
    else:
        date_time = datetime.now() - time_check.get_time_transaction
        if date_time.seconds >= 300 or time_check.get_time_transaction_first_time == True:
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
                url_request = url + 'account'
                res = send_request_api(request, url_request, headers, data, 'POST')
                if int(request.POST['offset']) == 300:
                    set_session(request, 'get_transactions_session', res)
                time_check.set_new_time_out('transaction')
                time_check.set_first_time('transaction')
            except Exception as e:
                res = request.session['get_transactions_session']
                _logger.error(str(e) + '\n' + traceback.format_exc())
        else:
            res = request.session['get_transactions_session']
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_transactions_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_transactions_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_history_transaction_ledger(request):
    if request.POST['using_cache'] == 'false':
        try:
            data = {
                'page': int(request.POST['page']),
                'limit': int(request.POST['limit']),
                'start_date': request.POST['start_date'],
                'end_date': request.POST['end_date']
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "history_transaction_ledger_api",
                "signature": request.POST['signature'],
            }
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())

        url_request = url + 'account'
        res = send_request_api(request, url_request, headers, data, 'POST')
        if int(request.POST['page']) == 1:
            set_session(request, 'get_transactions_history_ledger_session', res)
            request.session.modified = True
        time_check.set_new_time_out('transaction')
        time_check.set_first_time('transaction')
    else:
        date_time = datetime.now() - time_check.get_time_transaction_ledger
        if date_time.seconds >= 300 or time_check.get_time_transaction_ledger_first_time == True:
            try:
                data = {
                    'page': int(request.POST['page']),
                    'limit': int(request.POST['limit']),
                    'start_date': request.POST['start_date'],
                    'end_date': request.POST['end_date']
                }
                headers = {
                    "Accept": "application/json,text/html,application/xml",
                    "Content-Type": "application/json",
                    "action": "history_transaction_ledger_api",
                    "signature": request.POST['signature'],
                }
                url_request = url + 'account'
                res = send_request_api(request, url_request, headers, data, 'POST')
                if int(request.POST['page']) == 1:
                    set_session(request, 'get_transactions_history_ledger_session', res)
                time_check.set_new_time_out('transaction')
                time_check.set_first_time('transaction')
            except Exception as e:
                res = request.session['get_transactions_history_ledger_session']
                _logger.error(str(e) + '\n' + traceback.format_exc())
        else:
            res = request.session['get_transactions_history_ledger_session']
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_transactions_history_ledger SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_transactions_history_ledger ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def buy_quota_btbo2(request):
    try:
        data = {
            'acquirer_seq_id': request.POST['acquirer_seq_id']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "buy_quota_btbo2",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_top_up_amount_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_top_up_amount_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_top_up_quota(request):
    try:
        data = {
            'state': 'all'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_top_up_quota",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        set_session(request, 'top_up_amount', res['result']['response'])
        _logger.info(json.dumps(request.session['top_up_amount']))
        if res['result']['error_code'] == 0:
            _logger.info("get_top_up_amount_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_top_up_amount_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        set_session(request, 'top_up_amount', res['result']['response'])
        _logger.info(json.dumps(request.session['top_up_amount']))
        if res['result']['error_code'] == 0:
            _logger.info("get_top_up_amount_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_top_up_amount_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_top_up_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_top_up_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def submit_top_up(request):
    try:
        data = {
            'amount': int(request.POST['amount']),
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "submit_top_up",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_submit_top_up_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_submit_top_up_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_top_up(request):
    try:
        data = {
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_commit_top_up_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_commit_top_up_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_payment_acquirer_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_payment_acquirer_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_payment_acquirer_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_payment_acquirer_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def set_highlight_url(request):
    data = []
    data_list = json.loads(request.POST['data'])
    if len(data_list) != 0:
        for rec in data_list:
            data.append({
                "title": rec[0],
                "url": rec[1]
            })
    write_cache_with_folder(data, "highlight_data")

    return 0


def get_highlight_url(request):
    data = []
    try:
        file = read_cache_with_folder_path("highlight_data", 90911)
        if file:
            for line in file:
                data.append({
                    "title": line['title'],
                    "url": line['url'],
                })
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    return data


def set_contact_url(request):
    data = ''
    data_list = json.loads(request.POST['data'])
    if len(data_list) != 0:
        for rec in data_list:
            if rec[0] != '' and rec[1] != '':
                if data != '':
                    data += '\n'
                data += '%s:contact:%s:contact:%s' % (rec[0], rec[1], rec[2])

        write_cache_with_folder(data, "contact_data")
    return 0


def get_contact_url(request):
    data = []
    try:
        file = read_cache_with_folder_path("contact_data", 90911)
        for line in file.split('\n'):
            data.append(line.split(':contact:'))
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    return data


def set_social_url(request):
    data = ''
    data_list = json.loads(request.POST['data'])
    if len(data_list) != 0:
        for rec in data_list:
            if rec[0] != '' and rec[2] != '':
                if data != '':
                    data += '\n'
                data += '%s:social:%s:social:%s' % (rec[0], rec[1], rec[2])

        write_cache_with_folder(data, "social_data")
    return 0


def get_social_url(request):
    data = []
    try:
        file = read_cache_with_folder_path("social_data", 90911)
        for line in file.split('\n'):
            data.append(line.split(':social:'))
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    return data


def get_payment_partner(request):
    try:
        response = []
        if not os.path.exists("/var/log/django/payment_partner"):
            os.mkdir('/var/log/django/payment_partner')
        for data in os.listdir('/var/log/django/payment_partner'):
            file = read_cache_without_folder_path("payment_partner/"+data[:-4], 90911)
            state = ''
            sequence = ''
            title = ''
            image_partner = ''
            for idx, line in enumerate(file.split('\n')):
                if idx == 0:
                    if line.split('\n')[0] == 'false':
                        state = False
                    else:
                        state = True
                elif idx == 1:
                    sequence = line.split('\n')[0]
                elif idx == 2:
                    title = line.split('\n')[0]
                elif idx == 3:
                    image_partner = line.split('\n')[0]
            response.append({
                "state": bool(state),
                "sequence": sequence,
                "title": title,
                "image_partner": image_partner
            })
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def delete_payment_partner(request):
    try:
        data = os.listdir('/var/log/django/payment_partner')
        os.remove('/var/log/django/payment_partner/' + data[int(request.POST['partner_number'])])
        # check image
        fs = FileSystemStorage()
        fs.location += '/image_payment_partner'
        data = os.listdir('/var/log/django/payment_partner')
        image_list = []
        for rec in data:
            file = read_cache_without_folder_path("payment_partner/" + rec[:-4], 90911)
            for idx, line in enumerate(file.split('\n')):
                if idx == 3:
                    line = line.split('\n')[0]
                    line = line.split('/')
                    line.pop(0)
                    line.pop(0)
                    line.pop(0)
                    line = '/'.join(line)
                    image_list.append(line)
        for data in os.listdir(fs.location):
            if not data in image_list:
                os.remove(fs.base_location + '/image_payment_partner/' + data)
        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        print(e)
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'Error Delete',
                'response': ''
            }
        }
    return res


def set_payment_partner(request):
    try:
        fs = FileSystemStorage()
        fs.location += '/image_payment_partner'
        if not os.path.exists(fs.location):
            os.mkdir(fs.location)
        if not os.path.exists("/var/log/django/payment_partner"):
            os.mkdir('/var/log/django/payment_partner')

        filename = ''
        try:
            if request.FILES['image_partner'].content_type == 'image/jpeg' or request.FILES['image_partner'].content_type == 'image/png' or request.FILES['image_partner'].content_type == 'image/png':
                file = request.FILES['image_partner']
                filename = fs.save(file.name, file)
        except:
            _logger.error('no input image partner')

        data = os.listdir('/var/log/django/payment_partner')
        #create new
        sequence = request.POST['sequence']
        title = request.POST['title']
        counter = 1
        if int(request.POST['partner_number']) == -1:

            while True:
                if counter == 0 and title + '.txt' in data:
                    counter += 1
                elif title + str(counter) + '.txt' in data:
                    counter += 1
                else:
                    if counter != 1:
                        title += str(counter)
                    break
            text = request.POST['state'] + '\n' + sequence + '\n' + title + '\n' + fs.base_url + "image_payment_partner/" + filename
            write_cache(text, "payment_partner/"+"".join(title.split(' ')))
        #replace
        else:
            if filename == '':
                file = read_cache_without_folder_path("payment_partner/" + data[int(request.POST['partner_number'])][:-4], 90911)
                for idx, line in enumerate(file.split('\n')):
                    if idx == 3:
                        text = line.split('\n')[0].split('/')
                        text.pop(0)
                        text.pop(0)
                        text.pop(0)
                        filename = "/".join(text)
            os.remove('/var/log/django/payment_partner/' + data[int(request.POST['partner_number'])])
            data = os.listdir('/var/log/django/payment_partner')
            while True:
                if counter == 0 and title + '.txt' in data:
                    counter += 1
                elif title + str(counter) + '.txt' in data:
                    counter += 1
                else:
                    if counter != 1:
                        title += str(counter)
                    break
            text = request.POST['state'] + '\n' + sequence + '\n' + title + '\n' + fs.base_url + "image_payment_partner/" + filename
            write_cache(text, "payment_partner/"+"".join(title.split(' ')))
        #check image
        data = os.listdir('/var/log/django/payment_partner')
        image_list = []
        for rec in data:
            file = read_cache_without_folder_path("payment_partner/" + rec[:-4], 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 3:
                        text = line.split('\n')[0].split('/')
                        text.pop(0)
                        text.pop(0)
                        text.pop(0)
                        image_list.append("/".join(text))
        for data in os.listdir(fs.location):
            if not data in image_list:
                os.remove(fs.location + '/' + data)

        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        if int(request.POST['partner_number']) == -1:
            error = "Can't create"
        else:
            error = "Can't update"
        res = {
            'result': {
                'error_code': 500,
                'error_msg': error,
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_about_us(request):
    try:
        response = []
        if not os.path.exists("/var/log/django/about_us"):
            os.mkdir('/var/log/django/about_us')
        for data in os.listdir('/var/log/django/about_us'):
            file = read_cache_without_folder_path("about_us/" + data[:-4], 90911)
            if file:
                state = ''
                sequence = ''
                title = ''
                body = ''
                image_paragraph = ''
                for idx, line in enumerate(file.split('\n')):
                    if idx == 0:
                        if line.split('\n')[0] == 'false':
                            state = False
                        else:
                            state = True
                    elif idx == 1:
                        sequence = line.split('\n')[0]
                    elif idx == 2:
                        title = line.split('\n')[0]
                    elif idx == 3:
                        body = json.loads(line.split('\n')[0])
                    elif idx == 4:
                        image_paragraph = line.split('\n')[0]
                response.append({
                    "state": bool(state),
                    "sequence": sequence,
                    "title": title,
                    "body": body,
                    "image_paragraph": image_paragraph
                })
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def delete_about_us(request):
    try:
        data = os.listdir('/var/log/django/about_us')
        os.remove('/var/log/django/about_us/' + data[int(request.POST['paragraph_number'])])
        # check image
        fs = FileSystemStorage()
        fs.location += '/image_about_us'
        data = os.listdir('/var/log/django/about_us')
        image_list = []
        for rec in data:
            file = read_cache_without_folder_path("about_us/" + rec[:-4], 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 4:
                        line = line.split('\n')[0]
                        line = line.split('/')
                        line.pop(0)
                        line.pop(0)
                        line.pop(0)
                        line = '/'.join(line)
                        image_list.append(line)
        for data in os.listdir(fs.location):
            if not data in image_list:
                os.remove(fs.base_location + '/image_about_us/' + data)
        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        print(e)
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'Error Delete',
                'response': ''
            }
        }
    return res


def set_about_us(request):
    try:
        fs = FileSystemStorage()
        fs.location += '/image_about_us'
        if not os.path.exists(fs.location):
            os.mkdir(fs.location)
        if not os.path.exists("/var/log/django/about_us"):
            os.mkdir('/var/log/django/about_us')

        filename = ''
        if request.POST['delete_img'] == 'false':
            try:
                if request.FILES['image_paragraph'].content_type == 'image/jpeg' or request.FILES['image_paragraph'].content_type == 'image/png' or request.FILES['image_paragraph'].content_type == 'image/png':
                    file = request.FILES['image_paragraph']
                    filename = fs.save(file.name, file)
            except:
                _logger.error('no image paragraph')

        data = os.listdir('/var/log/django/about_us')
        #create new
        sequence = request.POST['sequence']
        title = request.POST['title']
        body = request.POST['body']
        counter = 1
        if int(request.POST['paragraph_number']) == -1:
            while True:
                if counter == 0 and sequence + '.txt' in data:
                    counter += 1
                elif sequence + str(counter) + '.txt' in data:
                    counter += 1
                else:
                    if counter != 1:
                        sequence += str(counter)
                    break
            text = request.POST['state'] + '\n' + sequence + '\n' + title + '\n' + body + '\n' + fs.base_url + "image_about_us/" + filename
            write_cache(text, "about_us/"+"".join(sequence.split(' ')))
        #replace
        else:
            if request.POST['delete_img'] == 'false':
                if filename == '':
                    file = read_cache_without_folder_path("about_us/" + data[int(request.POST['paragraph_number'])][:-4], 90911)
                    if file:
                        for idx, line in enumerate(file.split('\n')):
                            if idx == 4:
                                text = line.split('\n')[0].split('/')
                                text.pop(0)
                                text.pop(0)
                                text.pop(0)
                                filename = "/".join(text)
            else:
                filename = ''
            os.remove('/var/log/django/about_us/' + data[int(request.POST['paragraph_number'])])
            data = os.listdir('/var/log/django/about_us')
            while True:
                if counter == 0 and sequence + '.txt' in data:
                    counter += 1
                elif sequence + str(counter) + '.txt' in data:
                    counter += 1
                else:
                    if counter != 1:
                        sequence += str(counter)
                    break
            text = request.POST['state'] + '\n' + sequence + '\n' + title + '\n' + body + '\n' + fs.base_url + "image_about_us/" + filename
            write_cache(text, "about_us/" + "".join(sequence.split(' ')))
        #check image
        data = os.listdir('/var/log/django/about_us')
        image_list = []
        for rec in data:
            file = read_cache_without_folder_path("about_us/" + rec[:-4], 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 4:
                        text = line.split('\n')[0].split('/')
                        text.pop(0)
                        text.pop(0)
                        text.pop(0)
                        image_list.append("/".join(text))
        for data in os.listdir(fs.location):
            if not data in image_list:
                os.remove(fs.location + '/' + data)

        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        if int(request.POST['paragraph_number']) == -1:
            error = "Can't create"
        else:
            error = "Can't update"
        res = {
            'result': {
                'error_code': 500,
                'error_msg': error,
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_faq(request):
    try:
        response = []
        if not os.path.exists("/var/log/django/faq"):
            os.mkdir('/var/log/django/faq')
        for data in os.listdir('/var/log/django/faq'):
            file = read_cache_without_folder_path("faq/" + data[:-4], 90911)
            if file:
                state = ''
                sequence = ''
                title = ''
                body = ''
                for idx, line in enumerate(file.split('\n')):
                    if idx == 0:
                        if line.split('\n')[0] == 'false':
                            state = False
                        else:
                            state = True
                    elif idx == 1:
                        sequence = line.split('\n')[0]
                    elif idx == 2:
                        title = line.split('\n')[0]
                    elif idx == 3:
                        body = json.loads(line.split('\n')[0])
                response.append({
                    "state": bool(state),
                    "sequence": sequence,
                    "title": title,
                    "body": body,
                })
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def delete_faq(request):
    try:
        data = os.listdir('/var/log/django/faq')
        os.remove('/var/log/django/faq/' + data[int(request.POST['faq_number'])])
        data = os.listdir('/var/log/django/faq')
        for rec in data:
            file = read_cache_without_folder_path("faq/" + rec[:-4], 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 4:
                        line = line.split('\n')[0]
                        line = line.split('/')
                        line.pop(0)
                        line.pop(0)
                        line.pop(0)
                        line = '/'.join(line)
        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        print(e)
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'Error Delete',
                'response': ''
            }
        }
    return res


def set_faq(request):
    try:
        if not os.path.exists("/var/log/django/faq"):
            os.mkdir('/var/log/django/faq')

        filename = ''
        data = os.listdir('/var/log/django/faq')

        #create new
        sequence = request.POST['sequence']
        title = request.POST['title']
        body = request.POST['body']
        counter = 1
        if int(request.POST['faq_number']) == -1:

            while True:
                if counter == 0 and sequence + '.txt' in data:
                    counter += 1
                elif sequence + str(counter) + '.txt' in data:
                    counter += 1
                else:
                    if counter != 1:
                        sequence += str(counter)
                    break
            text = request.POST['state'] + '\n' + sequence + '\n' + title + '\n' + body + '\n' + filename
            write_cache(text, "faq/" + "".join(sequence.split(' ')))
        #replace
        else:
            if filename == '':
                file = read_cache_without_folder_path("faq/" + data[int(request.POST['faq_number'])], 90911)
                if file:
                    for idx, line in enumerate(file.split('\n')):
                        if idx == 4:
                            text = line.split('\n')[0].split('/')
                            text.pop(0)
                            text.pop(0)
                            text.pop(0)
                            filename = "/".join(text)
            os.remove('/var/log/django/faq/' + data[int(request.POST['faq_number'])])
            data = os.listdir('/var/log/django/faq')
            while True:
                if counter == 0 and sequence + '.txt' in data:
                    counter += 1
                elif sequence + str(counter) + '.txt' in data:
                    counter += 1
                else:
                    if counter != 1:
                        sequence += str(counter)
                    break
            text = request.POST['state'] + '\n' + sequence + '\n' + title + '\n' + body + '\n' + filename
            write_cache(text, "faq/" + "".join(sequence.split(' ')))

        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        if int(request.POST['faq_number']) == -1:
            error = "Can't create"
        else:
            error = "Can't update"
        res = {
            'result': {
                'error_code': 500,
                'error_msg': error,
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_va_number(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_va_number",
            "signature": request.POST['signature'],
        }
        data = {}

        url_request = url + 'account'
        res = send_request_api(request, url_request, headers, data, 'POST')
        if res['result']['error_code'] == 0:
            res['result']['response'].update({
                "other": [{
                    "acquirer_seq_id": 'other_bank',
                    "name": 'Other Bank',
                    "type": ''
                }]
            })
            for rec in res['result']['response']:
                for data in res['result']['response'][rec]:
                    if type(data['acquirer_seq_id']) == str:
                        file = read_cache_without_folder_path("payment_information/" + data['acquirer_seq_id'], 90911)
                        if file:
                            for idx, data_cache in enumerate(file.split('\n')):
                                if idx == 0:
                                    data['heading'] = data_cache
                                elif idx == 1:
                                    data['html'] = data_cache.replace('<br>', '\n')
                        else:
                            data['html'] = ''
                            data['heading'] = ''
                    else:
                        data['html'] = ''
                        data['heading'] = ''
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

def get_va_number_for_mobile(request):
    try:
        res = request.data['res']
        if res['result']['error_code'] == 0:
            res['result']['response'].update({
                "other": [{
                    "acquirer_seq_id": 'other_bank',
                    "name": 'Other Bank',
                    "type": ''
                }]
            })
            for rec in res['result']['response']:
                for data in res['result']['response'][rec]:
                    file = read_cache_without_folder_path("payment_information/" + data['acquirer_seq_id'], 90911)
                    if file:
                        for idx, data_cache in enumerate(file.split('\n')):
                            if idx == 0:
                                data['heading'] = data_cache
                            elif idx == 1:
                                data['html'] = data_cache.replace('<br>', '\n')
                    else:
                        data['html'] = ''
                        data['heading'] = ''
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return request.data['res']

def get_va_bank(request):
    try:
        if not os.path.exists("/var/log/django/payment_information"):
            os.mkdir('/var/log/django/payment_information')
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_va_bank",
            "signature": request.POST['signature'],
        }
        data = {}
        url_request = url + 'account'
        res = send_request_api(request, url_request, headers, data, 'POST')
        if res['result']['error_code'] == 0:
            res['result']['response'].append({
                "acquirer_seq_id": 'other_bank',
                "name": 'Other Bank',
                "type": ''
            })
            for rec in res['result']['response']:
                file = read_cache_without_folder_path("payment_information/" + rec['acquirer_seq_id'], 90911)
                if file:
                    for idx, data_cache in enumerate(file.split('\n')):
                        if idx == 0:
                            rec['heading'] = data_cache
                        elif idx == 1:
                            rec['html'] = data_cache.replace('<br>','\n')
                else:
                    rec['html'] = ''
                    rec['heading'] = ''
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

def set_payment_information(request):
    try:
        if not os.path.exists("/var/log/django/payment_information"):
            os.mkdir('/var/log/django/payment_information')
        text = request.POST['heading'] + '\n' + request.POST['body'].replace('\n','<br>')
        write_cache(text, "payment_information/" + request.POST['title'])
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': ''
            }
        }
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


def send_url_booking(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "send_url_booking",
            "signature": request.POST['signature'],
        }
        data = {
            "provider_type": request.POST['provider_type'],
            "url_booking": request.POST['url_booking'],
            "order_number": request.POST['order_number'],
            "type": request.POST['type']
        }
        url_request = url + 'account'
        res = send_request_api(request, url_request, headers, data, 'POST')
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

def get_vendor_balance(request):
    if 'user_account' in request.session._session and 'agent_ho' in request.session['user_account']['co_agent_frontend_security']:
        if request.POST['using_cache'] == 'false':
            res = get_vendor_balance_request(request)
        else:
            file = read_cache_with_folder_path("get_vendor_balance")
            if not file:
                res = get_vendor_balance_request(request)
            else:
                res = file
        try:
            if res['result']['error_code'] == 0 or res['result']['error_code'] == 500:
                _logger.info("get_balance_account SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                _logger.error("get_balance_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': '',
                'response': ''
            }
        }
    return res

def get_vendor_balance_request(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_vendor_balance",
            "signature": request.POST['signature'],
        }
        data = {}

        url_request = url + 'account'
        res = send_request_api(request, url_request, headers, data, 'POST')
        if res['result']['error_code'] == 0:
            data_vendor = res['result']['response']
            res['result']['response'] = {
                'data': data_vendor,
                'cache_time': datetime.now().strftime("%Y-%m-%d %H:%M")
            }
            write_cache_with_folder(res, "get_vendor_balance")
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'account'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_payment_acquirer_account SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_payment_acquirer_account ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res