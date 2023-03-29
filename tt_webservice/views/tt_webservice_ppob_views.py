from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import base64
import json
import logging
import traceback
from .tt_webservice_views import *
from .tt_webservice import *
from .tt_webservice_voucher_views import *
from ..views import tt_webservice_agent_views as webservice_agent
import time
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
        elif req_data['action'] == 'get_carrier_providers':
            res = get_carrier_providers(request)
        elif req_data['action'] == 'get_provider_list':
            res = get_provider_list(request)
        elif req_data['action'] == 'get_provider_list_backend':
            res = get_provider_list_backend(request)
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
        elif req_data['action'] == 'cancel':
            res = cancel(request)
        elif req_data['action'] == 'resync_status':
            res = resync_status(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'booker_insentif_booking':
            res = booker_insentif_booking(request)
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
        user_global, password_global, api_key = get_credential(request)
        data = {
            "user": user_global,
            "password": password_global,
            "api_key": api_key,
            # "co_user": request.session['username'],
            # "co_password": request.session['password'],
            "co_user": request.session.get('username') or user_default,
            "co_password": request.session.get('password') or password_default,
            "co_uid": ""
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'bills', 20)
            set_session(request, 'bills_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info("SIGNIN PPOB")
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
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_ppob_carriers", 'cache_web', request)
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, "get_ppob_carriers", request, 'cache_web')
                _logger.info("get_carriers PPOB RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                file = read_cache("get_ppob_carriers", 'cache_web', request, 90911)
                res = file
                _logger.info("get_carriers PPOB ERROR SIGNATURE " + request.POST['signature'])
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_ppob_carriers", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_ppob_carriers file\n' + str(e) + '\n' + traceback.format_exc())
    return res


def get_carrier_providers(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carrier_providers",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'ppob'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_ppob_carriers_provider", 'cache_web', request)
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, "get_ppob_carriers_provider", request, 'cache_web')
                _logger.info("get_carrier_providers PPOB RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                file = read_cache("get_ppob_carriers_provider", 'cache_web', request, 90911)
                res = file
                _logger.info("get_carrier_providers PPOB ERROR SIGNATURE " + request.POST['signature'])
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_ppob_carriers_provider", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_ppob_carriers file\n' + str(e) + '\n' + traceback.format_exc())
    return res


def get_provider_list(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_list",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'ppob'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache("get_list_provider_data_ppob", 'cache_web', request)
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                temp = {}
                for i in res['result']['response']['providers']:
                    temp[i['provider']] = i
                #datetime
                res = temp
                write_cache(temp, "get_list_provider_data_ppob", request, 'cache_web')
                _logger.info("get_provider_list PPOB RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("get_list_provider_data_ppob", 'cache_web', request, 90911)
                    if file:
                        res = file
                    _logger.info("get_provider_list ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_list_provider_data file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_list_provider_data_ppob", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_list_provider_data file\n' + str(e) + '\n' + traceback.format_exc())
    return res


def get_provider_list_backend(request, signature=''):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_list_backend",
        }
        if signature:
            headers.update({"signature": signature})
        else:
            headers.update({"signature": request.POST['signature']})
        data = {
            'provider_type': 'ppob'
        }
    except Exception as e:
        ## from mobile
        try:
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_providers_ppob",
                "signature": request.data['signature']
            }
            data = {
                'provider_type': 'ppob'
            }
        except:
            _logger.error("Error not from mobile")
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_list_provider_ppob", 'cache_web', request)
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, "get_list_provider_ppob", request, 'cache_web')
                _logger.info("write get_list_provider_ppob")
            else:
                try:
                    file = read_cache("get_list_provider_ppob", 'cache_web', request)
                    if file:
                        res = file
                    _logger.info("read file get_list_provider_ppob SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR read file get_list_provider_ppob\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_list_provider_ppob", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR read file get_list_provider_ppob\n' + str(e) + '\n' + traceback.format_exc())
    return res


def get_config(request):
    try:
        response = get_cache_data(request)

        res = response['result']['response']['ppob']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def search(request):
    try:
        data = {
            "product_code": request.POST['product_code'],
            "customer_number": request.POST['customer_number'],
            "provider": request.POST['provider'],
        }
        if request.POST['amount_of_month'] != '0':
            data.update({
                "amount_of_month": int(request.POST['amount_of_month'])
            })
        if request.POST['total'] != '0':
            data.update({
                "total": int(request.POST['total'])
            })
        if request.POST.get('customer_email'):
            data.update({
                "customer_email": request.POST['customer_email']
            })
        if request.POST.get('e_voucher_code'):
            data.update({
                'e_voucher_code': request.POST['e_voucher_code']
            })
        if request.POST.get('game_zone_id'):
            data.update({
                'game_zone_id': request.POST['game_zone_id']
            })
        set_session(request, 'ppob_search_request', data)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'ppob_search_response', res)
            request.session.modified = True
        else:
            _logger.error("ERROR search PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {},
            'agent_payment_method': request.POST.get('agent_payment') or False, ## kalau tidak kirim default balance normal
        })

        try:
            if request.POST['use_point'] == 'false':
                data['use_point'] = False
            else:
                data['use_point'] = True
        except:
            _logger.error('use_point not found')

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'visa', ['visa_rodextrip']),
            })
        if request.POST.get('payment_reference'):
            data.update({
                'payment_reference': request.POST['payment_reference']
            })
        if request.FILES.get('pay_ref_file'):
            temp_file = []
            for rec_file in request.FILES.getlist('pay_ref_file'):
                temp_file.append({
                    'name': rec_file.name,
                    'file': base64.b64encode(rec_file.file.read()).decode('ascii'),
                })
            data.update({
                'payment_ref_attachment': temp_file
            })

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit_booking PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR commit_booking PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            try:
                res['result']['response']['can_issued'] = False
                if res['result']['response']['hold_date'] > datetime.now().strftime('%Y-%m-%d %H:%M:%S'):
                    res['result']['response']['can_issued'] = True
            except:
                _logger.error('no hold date')
            for rec in res['result']['response']['provider_booking']:
                if len(rec['bill_data']):
                    for rec1 in rec['bill_data']:
                        rec1['period_date'] = parse_date_ppob(rec1['period'])
            set_session(request, 'bills_get_booking_response', res)
            request.session.modified = True
            _logger.info("SUCCESS get_booking PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def cancel(request):
    try:
        data = {
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {},
            'agent_payment_method': request.POST.get('agent_payment') or False, ## kalau tidak kirim default balance normal
        }
        try:
            if request.POST['use_point'] == 'false':
                data['use_point'] = False
            else:
                data['use_point'] = True
        except:
            _logger.error('use_point not found')
        provider = []
        try:
            bill_get_booking = request.session['bills_get_booking_response'] if request.session.get('bills_get_booking_response') else json.loads(request.POST['booking'])
            for provider_type in bill_get_booking['result']['response']['provider_booking']:
                if not provider_type['provider'] in provider:
                    provider.append(provider_type['provider'])
        except Exception as e:
            _logger.error(str(e) + traceback.format_exc())
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'ppob', provider),
            })
        if request.POST.get('payment_reference'):
            data.update({
                'payment_reference': request.POST['payment_reference']
            })
        if request.FILES.get('pay_ref_file'):
            temp_file = []
            for rec_file in request.FILES.getlist('pay_ref_file'):
                temp_file.append({
                    'name': rec_file.name,
                    'file': base64.b64encode(rec_file.file.read()).decode('ascii'),
                })
            data.update({
                'payment_ref_attachment': temp_file
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_service_charge(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': json.loads(request.POST['order_number']),
            'passengers': json.loads(request.POST['passengers'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pricing_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'bills_upsell' + request.POST['signature'], total_upsell)
            request.session.modified = True
            _logger.info("SUCCESS update_service_charge PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge PPOB SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def booker_insentif_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': json.loads(request.POST['order_number']),
            'booker': json.loads(request.POST['booker'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "booker_insentif_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/ppob'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'ppob_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info("SUCCESS update_service_charge_booker PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_booker PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res