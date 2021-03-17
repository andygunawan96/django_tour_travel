from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import copy
import logging
import traceback
from .tt_webservice_views import *
from .tt_webservice import *
from .tt_webservice_voucher_views import *
import time
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
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'get_auto_complete':
            res = get_auto_complete(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'detail':
            res = detail(request)
        elif req_data['action'] == 'extra_question':
            res = extra_question(request)
        elif req_data['action'] == 'create_booking':
            res = create_booking(request)
        elif req_data['action'] == 'issued':
            res = issued_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
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
            "signature": ''
        }

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

    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'event_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['event_signature']))
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
            "provider_type": 'event'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_event_carriers")
    if not file:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_event_carriers")
                _logger.info("get_carriers EVENT RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_event_carriers", 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers EVENT ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_event_carriers", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_event_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_config(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            "signature": request.POST['signature']
        }
        file = read_cache_with_folder_path("event_cache_data", 86400)
        # TODO VIN: Some Update Mekanisme ontime misal ada perubahan data dkk
        if not file:
            res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST', timeout=300)
            try:
                if res['result']['error_code'] == 0:
                    write_cache_with_folder(res['result']['response'], "event_cache_data")
            except Exception as e:
                _logger.info(
                    "ERROR GET CACHE FROM EVENT SEARCH AUTOCOMPLETE" + json.dumps(res) + '\n' + str(
                        e) + '\n' + traceback.format_exc())
                file = read_cache_with_folder_path("event_cache_data", 86400)
                if file:
                    response = file
                    res = {
                        'result': {
                            'error_code': 0,
                            'error_msg': 'using old cache',
                            'response': response
                        }
                    }
        else:
            response = file
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': 'using old cache',
                    'response': response
                }
            }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_auto_complete(request):
    def find_hotel_ilike(search_str, record_cache, limit=10):
        hotel_list = []
        for rec in record_cache:
            if len(hotel_list) == limit:
                return hotel_list
            is_true = True
            name = rec['name'].lower()
            alias = rec.get('alias') and rec['alias'].lower() or ''
            for list_str in search_str.split(' '):
                if list_str in ['hotel', 'hotels', '']:
                    pass
                if list_str not in name and list_str not in alias:
                    is_true = False
                    break
            if is_true:
                hotel_list.append(rec)
        return hotel_list

    limit = 25
    req = request.POST
    record_json = []
    try:
        file = read_cache_with_folder_path("hotel_cache_data", 90911)
        if file:
            record_cache = file


        # for rec in filter(lambda x: req['name'].lower() in x['name'].lower(), record_cache):
        for rec in find_hotel_ilike(req['name'].lower(), record_cache, limit):
            if len(record_json) < limit:
                record_json.append(rec['name'] + ' - ' + rec['type'])
            else:
                break

        # res = search2(request)
        # logging.getLogger("error_info").error("SUCCESS get_autocomplete HOTEL SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error('ERROR get event cache data file\n' + str(e) + '\n' + traceback.format_exc())

    return record_json


def search(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        data = {
            'event_name': request.POST.get('event_name') and request.POST['event_name'].split(' - ')[0] or '',
            'vendor': request.POST.get('vendor') or '',
            'is_online': request.POST.get('is_online') or False,
            'category': request.POST.get('category') and request.POST['category'] or '',
        }
        set_session(request, 'event_request_data', data)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST', timeout=300)
    set_session(request, 'event_response_search', res)
    try:
        counter = 0
        sequence = 0
        if res['result']['error_code'] == 0:
            signature = copy.deepcopy(request.POST['signature'])
            set_session(request, 'event_error', {
                'error_code': res['result']['error_code'],
                'signature': signature
            })
            _logger.info(json.dumps(request.session['event_error']))
        else:
            _logger.error("ERROR search_event SIGNATURE " + request.session['event_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def detail(request):
    try:
        data = request.session['event_request_data']
        data.update({
            'event_code': request.POST['external_code'],
        })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_details",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST')
    set_session(request, 'event_detail', res)
    try:
        signature = copy.deepcopy(request.POST['signature'])
        set_session(request, 'event_error', {
            'error_code': res['result']['error_code'],
            'signature': signature
        })
        if res['result']['error_code'] == 0:
            _logger.info("get_details_event SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            _logger.error("get_details_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def extra_question(request):
    try:
        data = {
            'event_code': request.session['event_code'].get('id') or 1,
            'option_code': '',
            'provider': 'event_internal',
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "extra_question",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST')
    try:
        signature = copy.deepcopy(request.POST['signature'])
        set_session(request, 'event_error', {
            'error_code': res['result']['error_code'],
            'signature': signature
        })
        _logger.info(json.dumps(request.session['hotel_error']))
        if res['result']['error_code'] == 0:
            _logger.info("get_details_hotel SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            _logger.error("get_details_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def create_booking(request):
    try:
        passenger = []
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        for pax_type in request.session['event_review_pax']:
            if pax_type != 'contact' and pax_type != 'booker':
                for pax in request.session['event_review_pax'][pax_type]:
                    if pax['nationality_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['nationality_name'] == country['name']:
                                pax['nationality_code'] = country['code']
                                break
                    try:
                        pax.update({
                            'birth_date': '%s-%s-%s' % (
                                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                                pax['birth_date'].split(' ')[0]),
                        })
                    except:
                        pass
                    passenger.append(pax)
        booker = request.session['event_review_pax']['booker']
        contacts = request.session['event_review_pax']['contact']
        for country in response['result']['response']['airline']['country']:
            if booker['nationality_name'] == country['name']:
                booker['nationality_code'] = country['code']
                booker['country_code'] = country['code']
                break

        for pax in contacts:
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break
        event_option_codes = []
        for i in request.session['event_option_code' + request.POST['signature']]:
            event_option_codes.append({
                'option_code': i['code'],
                'qty': int(i['qty']),
            })
        data = {
            "event_code": request.session['event_code'].get('id') or 1,
            # "event_code": request.POST['event_code'],
            "provider": 'event_internal',
            "event_option_codes": event_option_codes,
            "event_answer": request.session['event_extra_question' + request.POST['signature']],
            "special_request": request.POST['special_request'],
            "force_issued": bool(int(request.POST['force_issued'])),
            "booker": booker,
            "contact": contacts,
            "passengers": request.session['event_review_pax']['adult'],
            'user_id': request.session.get('co_uid') or '',
            'promotion_codes_booking': [],
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST', timeout=300)

    try:
        if res['result']['error_code'] == 0:
            _logger.info("create_booking EVENT SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("create_booking EVENT ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res


def get_booking(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST')

    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'event_get_booking_response', res)
            # res['result']['response'].update({
            #     'from_date': convert_string_to_date_to_string_front_end_with_date(res['result']['response']['from_date']),
            #     'to_date': convert_string_to_date_to_string_front_end_with_date(res['result']['response']['to_date'])
            # })
            # for pax in res['result']['response']['passengers']:
            #     pax.update({
            #         'birth_date': convert_string_to_date_to_string_front_end(pax['birth_date'])
            #     })
            # _logger.info("get_booking_event EVENT SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            _logger.error("get_booking_event EVENT ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res


def issued_booking(request):
    try:
        javascript_version = get_cache_version()
        # payment
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

        if request.POST['voucher_code'] != '':
            provider = []
            if request.session.get('event_get_booking_response'):
                for provider_type in request.session['event_get_booking_response']['result']['response']['providers']:
                    if not provider_type['provider'] in provider:
                        provider.append(provider_type['provider'])
            else:
                provider.append('event_internal')

            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'event', provider),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST', timeout=300)

    try:
        set_session(request, 'event_booking', res['result']['response'])
        signature = copy.deepcopy(request.POST['signature'])
        set_session(request, 'event_error', {
            'error_code': res['result']['error_code'],
            'signature': signature
        })
        _logger.info(json.dumps(request.session['event_booking']))
        if res['result']['error_code'] == 0:
            _logger.info("Event Issued SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("event_issued EVENT ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    res = util.send_request(url=url + 'booking/event', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'event_upsell_'+request.POST['signature'], total_upsell)
            request.session['event_upsell_'+request.POST['signature']] = total_upsell
            _logger.info(json.dumps(request.session['event_upsell_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge EVENT SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_event EVENT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res