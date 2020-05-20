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
from .tt_webservice_voucher_views import *
import time
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

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'resync_status':
            res = resync_status(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
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
            # "co_user": request.session['username'],
            # "co_password": request.session['password'],
            "co_user": request.session['username'] or user_default,
            "co_password": request.session['password'] or password_default,
            "co_uid": ""
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        time.sleep(1)
        request.session['bills_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
        logging.getLogger("info_logger").info(json.dumps(request.session['bills_signature']))
        request.session.modified = True
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_carriers(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'ppob'
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_providers BILLS RENEW SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("info_logger").info("get_providers BILLS ERROR SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_config(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        res = response['result']['response']['ppob']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def search(request):
    try:
        data = {
            "product_code": int(request.POST['product_code']),
            "customer_number": request.POST['customer_number'],
        }
        if request.POST['amount_of_month'] != '0':
            data.update({
                "amount_of_month": int(request.POST['amount_of_month'])
            })
        elif request.POST['total'] != '0':
            data.update({
                "total": int(request.POST['total'])
            })
        request.session['ppob_search_request'] = data
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/ppob', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            request.session['ppob_search_response'] = res
            request.session.modified = True
            pass
        else:
            logging.getLogger("error_logger").error("ERROR search BILLS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    try:
        if request.POST['force_issued'] == 'false':
            force_issued = False
        elif request.POST['force_issued'] == 'true':
            force_issued = True
        data = {
            'force_issued': force_issued
        }
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data.update({
            'member': member,
            'seq_id': request.POST['seq_id'],
            'voucher': {}
        })
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'visa', ['visa_rodextrip']),
            })

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS commit_booking VISA SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR commit_booking_visa VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_booking(request):
    try:
        # nanti ganti ke get_ssr_availability

        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/ppob', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            time.sleep(1)
            for rec in res['result']['response']['provider_booking']:
                if len(rec['bill_data']):
                    for rec1 in rec['bill_data']:
                        rec1['period_date'] = parse_date_ppob(rec1['period'])
            request.session['bills_get_booking_response'] = res
            request.session.modified = True
            logging.getLogger("info_logger").info("SUCCESS get_booking VISA SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR get_booking_visa VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def issued(request):
    # nanti ganti ke get_ssr_availability
    try:
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number'],
            'member': member,
            'seq_id': request.POST['seq_id'],
            'voucher': {}
        }
        provider = []
        try:
            for provider_type in request.session['bills_get_booking_response']['result']['response']['provider_booking']:
                if not provider_type['provider'] in provider:
                    provider.append(provider_type['provider'])
            if request.POST['voucher_code'] != '':
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'ppob', provider),
                })
        except:
            pass
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/ppob', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS issued PPOB SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR issued_ppob PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def resync_status(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': request.POST['order_number'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "resync_status",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/ppob', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS issued PPOB SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR issued_ppob PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def update_service_charge(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': request.POST['order_number'],
            'passengers': json.loads(request.POST['passengers'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pricing_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            request.session['visa_upsell_'+request.POST['signature']] = total_upsell
            logging.getLogger("info_logger").info(json.dumps(request.session['visa_upsell_' + request.POST['signature']]))
            request.session.modified = True
            logging.getLogger("info_logger").info("SUCCESS update_service_charge VISA SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_service_charge VISA SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res