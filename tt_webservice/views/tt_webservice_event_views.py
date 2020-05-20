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

class provider_event:
    def __init__(self, name):
        self.get_time_auto_complete_event = name
        self.get_time_auto_complete_event_first_time = True
    def set_new_time_out(self, val):
        if val == 'auto_complete':
            self.get_time_auto_complete_event = datetime.now()
    def set_first_time(self,val):
        if val == 'auto_complete':
            self.get_time_auto_complete_event_first_time = False

event = provider_event(datetime.now())

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
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
            "co_user": request.session['username'] or user_default,
            "co_password": request.session['password'] or password_default,
            "co_uid": ""
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        time.sleep(1)
        if 'event_signature' in request.session:
            del request.session['event_signature']
        request.session['event_signature'] = res['result']['response']['signature']
        if 'signature' in request.session:
            del request.session['signature']
        request.session['signature'] = res['result']['response']['signature']
        logging.getLogger("info_logger").info(json.dumps(request.session['event_signature']))
        request.session.modified = True
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

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
        date_time = datetime.now() - event.get_time_auto_complete_event
        if date_time.seconds >= 1800 or event.get_time_auto_complete_event_first_time == True:
            res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST', timeout=300)
            try:
                if res['result']['error_code'] == 0:
                    file = open(var_log_path() + "event_cache_data.txt", "w+")
                    file.write(json.dumps(res['result']['response']))
                    file.close()
                    event.set_new_time_out('auto_complete')
                    event.set_first_time('auto_complete')
            except Exception as e:
                logging.getLogger("info_logger").info(
                    "ERROR GET CACHE FROM TOUR SEARCH AUTOCOMPLETE" + json.dumps(res) + '\n' + str(
                        e) + '\n' + traceback.format_exc())
                file = open(var_log_path() + "event_cache_data.txt", "r")
                for line in file:
                    response = json.loads(line)
                file.close()
                res = {
                    'result': {
                        'error_code': 0,
                        'error_msg': 'using old cache',
                        'response': response
                    }
                }
        else:
            file = open(var_log_path() + "event_cache_data.txt", "r")
            for line in file:
                response = json.loads(line)
            file.close()
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
    try:
        file = open(var_log_path()+"hotel_cache_data.txt", "r")
        for line in file:
            record_cache = json.loads(line)
        file.close()

        record_json = []
        # for rec in filter(lambda x: req['name'].lower() in x['name'].lower(), record_cache):
        for rec in find_hotel_ilike(req['name'].lower(), record_cache, limit):
            if len(record_json) < limit:
                record_json.append(rec['name'] + ' - ' + rec['type'])
            else:
                break

        # res = search2(request)
        # logging.getLogger("error_info").error("SUCCESS get_autocomplete HOTEL SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error('ERROR get hotel cache data file\n' + str(e) + '\n' + traceback.format_exc())

    return record_json


def search(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        data = {
            'event_name': request.POST['event_name'].split(' - ')[0],
            'is_online': request.POST['is_online'],
        }
        request.session['event_request_data'] = data
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.session['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/event", data=data, headers=headers, method='POST', timeout=300)
    request.session['event_response_search'] = res
    try:
        counter = 0
        sequence = 0
        if res['result']['error_code'] == 0:
            signature = copy.deepcopy(request.session['event_signature'])
            request.session['event_error'] = {
                'error_code': res['result']['error_code'],
                'signature': signature
            }
            logging.getLogger("info_logger").info(json.dumps(request.session['event_error']))
            request.session.modified = True
        else:
            logging.getLogger("error_logger").error("ERROR search_event SIGNATURE " + request.session['event_signature'] + ' ' + json.dumps(res))
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
    request.session['event_detail'] = res
    try:
        signature = copy.deepcopy(request.session['signature'])
        request.session['event_error'] = {
            'error_code': res['result']['error_code'],
            'signature': signature
        }
        logging.getLogger("info_logger").info(json.dumps(request.session['hotel_error']))
        request.session.modified = True
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_details_event SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            logging.getLogger("error_logger").error("get_details_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
        signature = copy.deepcopy(request.session['event_signature'])
        request.session['event_error'] = {
            'error_code': res['result']['error_code'],
            'signature': signature
        }
        logging.getLogger("info_logger").info(json.dumps(request.session['hotel_error']))
        request.session.modified = True
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_details_hotel SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            logging.getLogger("error_logger").error("get_details_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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
                'qty': int(i['qty'])
            })
        data = {
            "event_code": request.POST['event_code'],
            "provider": 'event_internal',
            "event_option_codes": event_option_codes,
            "special_request": request.POST['special_request'],
            "force_issued": bool(int(request.POST['force_issued'])),
            "booker": booker,
            "contact": contacts,
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
            logging.getLogger("info_logger").info("create_booking EVENT SUCCESS SIGNATURE " + request.session['hotel_signature'])
        else:
            logging.getLogger("error_logger").error("create_booking EVENT ERROR SIGNATURE " + request.session['hotel_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

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
        logging.getLogger("info_logger").info(json.dumps(request.session['hotel_provision']))
        request.session.modified = True
        if res['result']['error_code'] == 0:
            request.session['event_get_booking_response'] = res
            res['result']['response'].update({
                'from_date': convert_string_to_date_to_string_front_end_with_date(res['result']['response']['from_date']),
                'to_date': convert_string_to_date_to_string_front_end_with_date(res['result']['response']['to_date'])
            })
            for room in res['result']['response']['hotel_rooms']:
                room.update({
                    'date': convert_string_to_date_to_string_front_end_with_date(room['date'].split(' ')[0])
                })
            for pax in res['result']['response']['passengers']:
                pax.update({
                    'birth_date': convert_string_to_date_to_string_front_end(pax['birth_date'])
                })
            logging.getLogger("info_logger").info("get_booking_hotel HOTEL SUCCESS SIGNATURE " + res['result']['response']['signature'])
        else:
            logging.getLogger("error_logger").error("get_booking_hotel HOTEL ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

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
        provider = []
        for provider_type in request.session['event_get_booking_response']['result']['response']['providers']:
            if not provider_type['provider'] in provider:
                provider.append(provider_type['provider'])
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'airline', provider),
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
        request.session['event_booking'] = res['result']['response']
        signature = copy.deepcopy(request.session['hotel_signature'])
        request.session['event_error'] = {
            'error_code': res['result']['error_code'],
            'signature': signature
        }
        logging.getLogger("info_logger").info(json.dumps(request.session['event_booking']))
        request.session.modified = True
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("Event Issued SUCCESS SIGNATURE " + request.session['event_signature'])
        else:
            logging.getLogger("error_logger").error("event_issued EVENT ERROR SIGNATURE " + request.session['event_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

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
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/hotel', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            request.session['event_upsell_'+request.POST['signature']] = total_upsell
            logging.getLogger("info_logger").info(json.dumps(request.session['hotel_upsell_' + request.POST['signature']]))
            request.session.modified = True
            logging.getLogger("info_logger").info("SUCCESS update_service_charge EVENT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_service_charge_event EVENT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res