from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import base64
import json
import copy
import logging
import traceback
from .tt_webservice_views import *
from .tt_webservice import *
from .tt_webservice_voucher_views import *
from ..views import tt_webservice_agent_views as webservice_agent
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
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'set_signature':
            res = set_signature(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'get_hotel_data_detail_page':
            res = get_hotel_data_detail_page(request)
        elif req_data['action'] == 'hotel_get_carrier_alias_name':
            res = get_masking(request)
        elif req_data['action'] == 'hotel_update_carrier_alias_name':
            res = update_masking(request)
        elif req_data['action'] == 'get_auto_complete':
            res = get_auto_complete(request)
        elif req_data['action'] == 'get_top_facility':
            res = get_top_facility(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_current_search':
            res = get_current_search(request)
        elif req_data['action'] == 'detail':
            res = detail(request)
        elif req_data['action'] == 'get_current_search_detail':
            res = get_current_search_detail(request)
        elif req_data['action'] == 'get_cancellation_policy':
            res = get_cancellation_policy(request)
        elif req_data['action'] == 'provision':
            res = provision(request)
        elif req_data['action'] == 'issued':
            res = create_booking(request)
        elif req_data['action'] == 'issued_b2c':
            res = issued_b2c(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'get_top_facility':
            res = get_top_facility(request)
        elif req_data['action'] == 'get_facility_img':
            res = get_facility_img(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'booker_insentif_booking':
            res = booker_insentif_booking(request)
        elif req_data['action'] == 'review_page':
            res = review_page(request)
        elif req_data['action'] == 'detail_page':
            res = detail_page(request)
        elif req_data['action'] == 'passenger_page':
            res = passenger_page(request)
        elif req_data['action'] == 'hotel_check_refund_amount':
            res = hotel_check_refund_amount(request)
        elif req_data['action'] == 'hotel_refund':
            res = hotel_refund(request)
        elif req_data['action'] == 'search_mobile':
            res = search_mobile(request)
        elif req_data['action'] == 'detail_mobile':
            res = detail_mobile(request)
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
        user_global, password_global, api_key = get_credential(request)
        user_default, password_default = get_credential_user_default(request)
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
        otp_params = {}
        if request.POST.get('unique_id'):
            otp_params['machine_code'] = request.POST['unique_id']
        if request.POST.get('platform'):
            otp_params['platform'] = request.POST['platform']
        if request.POST.get('browser'):
            otp_params['browser'] = request.POST['browser']
        if request.POST.get('timezone'):
            otp_params['timezone'] = request.POST['timezone']
        if otp_params:
            data['otp_params'] = otp_params
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('session')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'hotel', 20, res['result']['response']['signature'])
            # set_session(request, 'hotel_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.POST.get('frontend_signature'):
                write_cache_file(request, res['result']['response']['signature'], 'hotel_frontend_signature',request.POST['frontend_signature'])
                write_cache_file(request, request.POST['frontend_signature'], 'hotel_signature',res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info("SIGNIN HOTEL SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_hotel_data_detail_page(request):
    try:
        res = {}
        res['response'] = request.session['train_pick']
        res['passengers'] = request.session['train_create_passengers']
        file = read_cache("get_train_carriers", 'cache_web', request, 90911)
        if file:
            res['train_carriers'] = file
        res['train_request'] = request.session['train_request']
        _logger.info("SUCCESS data search page HOTEL")
    except Exception as e:
        _logger.error('ERROR get get_hotel_data_detail_page file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def set_signature(request):
    try:
        if request.POST.get('frontend_signature'):
            write_cache_file(request, request.POST['signature'], 'hotel_frontend_signature',request.POST['frontend_signature'])
            write_cache_file(request, request.POST['frontend_signature'], 'hotel_signature',request.POST['signature'])

        # set_session(request, 'hotel_signature', request.POST['signature'])
        # set_session(request, 'hotel_set_signature', False)
    except Exception as e:
        _logger.error('ERROR set signature file\n' + str(e) + '\n' + traceback.format_exc())

    return {
        "result": {
            "response": "",
            "error_code": 0,
            "error_msg": ""
        }
    }

def get_carriers(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'hotel'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_hotel_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_hotel_carriers", request, 'cache_web')
                _logger.info("get_carriers HOTEL RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("get_hotel_carriers", 'cache_web', request, 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers HOTEL ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            res = file
        except Exception as e:
            _logger.error('ERROR get_carriers hotel file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_masking(request, is_need_update_masking=False):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_code_alias_api",
            "signature": request.POST['signature']
        }
        data = {}
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache('hotel_masking', 'cache_web', request)
    if not file or is_need_update_masking:
        url_request = get_url_gateway('booking/hotel')
        res = send_request_api(request, url_request, headers, data, 'POST')
        if res['result']['error_code'] == 0:
            write_cache(res, 'hotel_masking', request)
    else:
        res = file
    return res

def update_masking(request):
    try:
        data_masking = json.loads(request.POST['data_masking'])
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_provider_code_alias_api",
            "signature": request.POST['signature']
        }
        data = {
            "data_masking": data_masking
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST')
    get_masking(request, True)
    return res

def get_auto_complete(request):
    def find_hotel_ilike(search_str, record_cache, limit=10, search_type=[]):
        hotel_list = []
        for rec in record_cache:
            if search_type:
                if rec['type'] not in search_type:
                    continue
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
        file = read_cache("hotel_cache_data", 'cache_web', request, 90911)
        if file:
            record_cache = file


        # for rec in filter(lambda x: req['name'].lower() in x['name'].lower(), record_cache):
        for rec in find_hotel_ilike(req['name'].lower(), record_cache, limit, []):
            if len(record_json) < limit:
                # if rec['type'] != 'hotel':
                #     record_json.append(rec['name'] + ' - ' + rec['type'])
                record_json.append(rec['name'] + ' - ' + rec['type'])
            else:
                break

        # res = search2(request)
    except Exception as e:
        _logger.error('ERROR get hotel cache data file\n' + str(e) + '\n' + traceback.format_exc())

    return record_json

def search(request):
    try:
        child_age = []
        if request.POST['child_age'] != '':
            child_age = request.POST['child_age'].split(',')
        response = get_cache_data(request)
        id = ''
        country_id = ''
        destination_id = ''
        hotel_id = ''
        landmark_id = ''
        set_session(request, 'hotel_set_signature', True)
        try:
            for hotel in response['result']['response']['hotel_config']:
                if request.POST['destination'] == hotel['name']:
                    if hotel['type'] == 'Country':
                        country_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'City':
                        destination_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Hotel':
                        hotel_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Landmark':
                        landmark_id = int(hotel['id'])
                        id = int(hotel['id'])
                    break
        except:
            pass

        data = {
            'child': int(request.POST['child']),
            'hotel_id': request.POST.get('id') or '',
            'search_name': request.POST.get('destination') and ' - '.join(request.POST.get('destination').split(' - ')[:-1]) or '',
            'destination': request.POST.get('destination') or '',
            'room': int(request.POST['room']),
            'checkout_date': str(datetime.strptime(request.POST['checkout'], '%d %b %Y'))[:10],
            'checkin_date': str(datetime.strptime(request.POST['checkin'], '%d %b %Y'))[:10],
            'adult': int(request.POST['adult']),
            'destination_id': destination_id,
            'child_ages': child_age,
            'nationality': request.POST['nationality'].split(' - ')[0],
            'is_bussiness_trip': request.POST['business_trip'],
            'guest_nationality': request.POST['nationality']
        }

        signature = ''

        ## MEKANISME BACA CACHE 10 MENIT ##
        list_file = get_list_file_name(request, 'hotel_request')

        date_time = datetime.now()
        for file_name in list_file:
            session_key = copy.deepcopy(file_name)
            session_key = session_key.split('_')
            session_key.pop(0)
            file = read_cache_file(request, file_name.split('_')[0], "_".join(session_key).split('.')[0], True)
            delta_time = date_time - parse_load_cache(file['datetime'])
            if delta_time.total_seconds() <= 1200 and data == file['data']: ## 10 MENIT
                signature = file_name.split('_')[0]
                break
        if not signature:
            signature = request.POST['signature']
            write_cache_file(request, signature, 'hotel_request', data)
        # if data == request.session.get('hotel_search_request', ''):
        #     try: ## USE CACHE
        #         signature = request.session['hotel_error']['signature']
        #     except: ## FIRST TIME
        #         signature = request.POST['signature']
        # else:
        #     if request.session.get('hotel_error'):
        #         del request.session['hotel_error']
        #     signature = request.POST['signature']

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": signature
        }
        # set_session(request, 'hotel_search_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'hotel_search_request')
            if file:
                data = file
            # data = request.session['hotel_search_request']
            signature = request.POST['signature']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST.get('new_signature')
            }
            _logger.info(msg='use cache login change b2c to login')
        else:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/hotel')
    file = read_cache_file(request, signature, 'hotel_search_response')
    if file:
        res = file
    else:
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        counter = 0
        sequence = 0

        res['result']['signature'] = signature
        if res['result']['error_code'] == 0:
            # set_session(request, 'hotel_signature', signature)
            # set_session(request, 'hotel_error', {
            #     'error_code': res['result']['error_code'],
            #     'signature': signature
            # })

            for hotel in res['result']['response']['city_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['country_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['hotel_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['landmark_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            if len(res['result']['response']['hotel_ids']) > 0:
                write_cache_file(request, signature, 'hotel_search_response', res)
            _logger.info("Success search_hotel SIGNATURE " + signature + ' ' + json.dumps(res))
        else:
            _logger.error("ERROR search_hotel SIGNATURE " + signature + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def search_2(request):
    try:
        child_age = []
        if request.POST['child_age'] != '':
            child_age = request.POST['child_age'].split(',')
        response = get_cache_data(request)
        id = ''
        country_id = ''
        destination_id = ''
        hotel_id = ''
        landmark_id = ''
        set_session(request, 'hotel_set_signature', True)
        try:
            for hotel in response['result']['response']['hotel_config']:
                if request.POST['destination'] == hotel['name']:
                    if hotel['type'] == 'Country':
                        country_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'City':
                        destination_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Hotel':
                        hotel_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Landmark':
                        landmark_id = int(hotel['id'])
                        id = int(hotel['id'])
                    break
        except:
            pass

        data = {
            'child': int(request.POST['child']),
            'hotel_id': request.POST.get('id') or '',
            'search_name': request.POST.get('destination') and ' - '.join(request.POST.get('destination').split(' - ')[:-1]) or '',
            'room': int(request.POST['room']),
            'checkout_date': str(datetime.strptime(request.POST['checkout'], '%d %b %Y'))[:10],
            'checkin_date': str(datetime.strptime(request.POST['checkin'], '%d %b %Y'))[:10],
            'adult': int(request.POST['adult']),
            'destination_id': destination_id,
            'child_ages': child_age,
            'nationality': request.POST['nationality'].split(' - ')[0],
            'is_bussiness_trip': request.POST['business_trip'],
        }
        try:
            hotel_request_data = request.session['hotel_request_data']
            hotel_request_data['hotel_id'] = request.POST.get('id') or ''
            set_session(request, 'hotel_request_data', hotel_request_data)
            try:
                signature = request.session['hotel_error']['signature']
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
            try:
                del request.session['hotel_request_data']['pax_country']
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
            res = request.session['hotel_response_search_%s' % signature]
            if data == request.session['hotel_request_data'] and request.session['hotel_error']['error_code'] == 0 and sum([len(rec) for rec in res['result']['response'].values()]) != 0:
                data = {}
                set_session(request, 'hotel_signature', request.session['hotel_error']['signature'])
            else:
                set_session(request, 'hotel_signature', request.session['hotel_error']['signature'])
                set_session(request, 'hotel_request_data', data)
        except Exception as e:
            try:
                set_session(request, 'hotel_signature', request.session['hotel_error']['signature'])
                set_session(request, 'hotel_request_data', data)
            except:
                set_session(request, 'hotel_signature', request.session['hotel_signature'])
                set_session(request, 'hotel_request_data', data)

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.session['hotel_signature']
        }
        set_session(request, 'hotel_search_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['hotel_search_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['signature']
            }
            _logger.info(msg='use cache login change b2c to login')
        else:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    if data:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
        signature = request.POST['signature']
        url_request = get_url_gateway('booking/hotel')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
        set_session(request, 'hotel_response_search_%s' % signature, res)
    else:
        signature = request.session['hotel_signature']
    try:
        counter = 0
        sequence = 0
        res['result']['signature'] = signature
        if res['result']['error_code'] == 0:
            set_session(request, 'hotel_error', {
                'error_code': res['result']['error_code'],
                'signature': signature
            })
            set_session(request, 'hotel_signature', signature)
            _logger.info(json.dumps(request.session['hotel_error']))

            hotel_data = []
            for hotel in res['result']['response']['city_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['country_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['hotel_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['landmark_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1
        else:
            _logger.error("ERROR search_hotel SIGNATURE " + request.session['hotel_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_current_search(request):
    try:
        child_age = []
        if request.POST['child_age'] != '':
            child_age = request.POST['child_age'].split(',')
        response = get_cache_data(request)
        id = ''
        country_id = ''
        destination_id = ''
        hotel_id = ''
        landmark_id = ''
        # set_session(request, 'hotel_set_signature', True)
        try:
            for hotel in response['result']['response']['hotel_config']:
                if request.POST['destination'] == hotel['name']:
                    if hotel['type'] == 'Country':
                        country_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'City':
                        destination_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Hotel':
                        hotel_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Landmark':
                        landmark_id = int(hotel['id'])
                        id = int(hotel['id'])
                    break
        except:
            pass

        signature = ''

        data = {
            'child': int(request.POST['child']),
            'hotel_id': request.POST.get('id') or '',
            'search_name': request.POST.get('destination') and ' - '.join(request.POST.get('destination').split(' - ')[:-1]) or '',
            'room': int(request.POST['room']),
            'checkout_date': str(datetime.strptime(request.POST['checkout'], '%d %b %Y'))[:10],
            'checkin_date': str(datetime.strptime(request.POST['checkin'], '%d %b %Y'))[:10],
            'adult': int(request.POST['adult']),
            'destination_id': destination_id,
            'child_ages': child_age,
            'nationality': request.POST['nationality'].split(' - ')[0],
            'is_bussiness_trip': request.POST['business_trip'],
        }
        list_file = get_list_file_name(request, 'hotel_request')

        date_time = datetime.now()
        for file_name in list_file:
            session_key = copy.deepcopy(file_name)
            session_key = session_key.split('_')
            session_key.pop(0)
            file = read_cache_file(request, file_name.split('_')[0], "_".join(session_key).split('.')[0], True)
            delta_time = date_time - parse_load_cache(file['datetime'])
            if delta_time.total_seconds() <= 1200 and data == file['data']:  ## 10 MENIT
                signature = file_name.split('_')[0]
                break
        if not signature:
            signature = request.POST['signature']
            write_cache_file(request, signature, 'hotel_request', data)

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_current_search",
            "signature": signature
        }
        # set_session(request, 'hotel_current_search_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['hotel_search_request']
            signature = request.POST['signature']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_current_search",
                "signature": signature
            }
            _logger.info('current search use cache')
        else:
            _logger.error('ERROR current search use cache')

    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 30)
    # if request.session.get('hotel_set_signature', False):
    #     set_session(request, 'hotel_signature', request.POST['signature'])

    sequence = 0
    counter = 0
    for hotel in res['result']['response']['hotel_ids']:
        hotel.update({
            'sequence': sequence,
            'counter': counter
        })
        counter += 1
        sequence += 1

    return res

def get_current_search_2(request):
    try:
        child_age = []
        if request.POST['child_age'] != '':
            child_age = request.POST['child_age'].split(',')
        response = get_cache_data(request)
        id = ''
        country_id = ''
        destination_id = ''
        hotel_id = ''
        landmark_id = ''
        set_session(request, 'hotel_set_signature', True)
        try:
            for hotel in response['result']['response']['hotel_config']:
                if request.POST['destination'] == hotel['name']:
                    if hotel['type'] == 'Country':
                        country_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'City':
                        destination_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Hotel':
                        hotel_id = int(hotel['id'])
                        id = int(hotel['id'])
                    elif hotel['type'] == 'Landmark':
                        landmark_id = int(hotel['id'])
                        id = int(hotel['id'])
                    break
        except:
            pass

        data = {
            'child': int(request.POST['child']),
            'hotel_id': request.POST.get('id') or '',
            'search_name': request.POST.get('destination') and ' - '.join(
                request.POST.get('destination').split(' - ')[:-1]) or '',
            'room': int(request.POST['room']),
            'checkout_date': str(datetime.strptime(request.POST['checkout'], '%d %b %Y'))[:10],
            'checkin_date': str(datetime.strptime(request.POST['checkin'], '%d %b %Y'))[:10],
            'adult': int(request.POST['adult']),
            'destination_id': destination_id,
            'child_ages': child_age,
            'nationality': request.POST['nationality'].split(' - ')[0],
            'is_bussiness_trip': request.POST['business_trip'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_current_search",
            "signature": request.POST['signature']
        }
        set_session(request, 'hotel_search_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['hotel_search_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_current_search",
                "signature": request.POST['signature']
            }
            _logger.info('current search use cache')
        else:
            _logger.error('ERROR current search use cache')

    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 10)
    if request.session.get('hotel_set_signature', False):
        set_session(request, 'hotel_signature', request.POST['signature'])
    return res

def detail(request):
    try:
        data = json.loads(request.POST['data'])

        file = read_cache_file(request, request.POST['signature'], 'hotel_detail')
        if file:
            hotel_detail = file

        data.update({
            'hotel_id': hotel_detail['id'],
            'checkin_date': request.POST['checkin_date'] and str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10] or data['checkin_date'],
            'checkout_date': request.POST['checkout_date'] and str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10] or data['checkout_date'],
            'pax_country': False
        })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_details",
            "signature": request.POST['signature'],
        }

        write_cache_file(request, request.POST['signature'], 'hotel_detail_request', data)
        # set_session(request, 'hotel_detail_request', data)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'hotel_detail_request')
            if file:
                hotel_detail = file
            data = hotel_detail
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_details",
                "signature": request.POST['new_signature']
            }
            _logger.info('hotel get detail use cache')
        else:
            _logger.error('error hotel get detail')
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', timeout=180)
    try:
        # signature = copy.deepcopy(request.session['hotel_signature'])
        # set_session(request, 'hotel_error', {
        #     'error_code': res['result']['error_code'],
        #     'signature': signature
        # })
        # _logger.info(json.dumps(request.session['hotel_error']))
        if res['result']['error_code'] == 0:
            res['result']['response']['request'] = data
            _logger.info("get_details_hotel SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_details_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_current_search_detail(request):
    try:
        data = json.loads(request.POST['data'])

        file = read_cache_file(request, request.POST['signature'], 'hotel_detail')
        if file:
            hotel_detail = file

        data.update({
            'hotel_id': hotel_detail['id'],
            'checkin_date': request.POST['checkin_date'] and str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10] or data['checkin_date'],
            'checkout_date': request.POST['checkout_date'] and str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10] or data['checkout_date'],
            'pax_country': False
        })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_current_search_detail",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'hotel_detail_request')
            if file:
                hotel_detail = file
            data = hotel_detail
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_current_search_detail",
                "signature": request.POST['new_signature']
            }
            _logger.info('hotel get detail use cache')
        else:
            _logger.error('error hotel get detail')
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', timeout=30)
    if res['result']['error_code'] == 0:
        res['result']['response']['request'] = data
    return res

def get_cancellation_policy(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'hotel_detail')
        if file:
            hotel_detail = file
        data = {
            # "hotel_code": request.session['hotel_detail']['external_code'][request.POST['provider']],
            "hotel_code": hotel_detail['id'],
            "price_code": request.POST['price_code'],
            "provider": request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_cancellation_policy",
            "signature": request.POST['signature'],
        }
        write_cache_file(request, request.POST['signature'], 'hotel_get_cancellation_policy_request', data)
        # set_session(request, 'hotel_get_cancellation_policy_request', data)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'hotel_get_cancellation_policy_request')
            if file:
                data = file
            # data = request.session['hotel_get_cancellation_policy_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_cancellation_policy",
                "signature": request.POST['signature']
            }
            _logger.info('get_cancellation_policy use cache')
        else:
            _logger.error('ERROR get_cancellation_policy use cache')
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            for rec in res['result']['response']['policies']:
                if rec.get('date'):
                    rec['date'] = convert_string_to_date_to_string_front_end(rec['date'])
            write_cache_file(request, request.POST['signature'], 'hotel_cancellation_policy', res)
            # set_session(request, 'hotel_cancellation_policy', res)
            # request.session['hotel_cancellation_policy'] = res

            # signature = copy.deepcopy(request.session['hotel_signature'])
            # set_session(request, 'hotel_error', {
            #     'error_code': res['result']['error_code'],
            #     'signature': signature
            # })
            _logger.info("get_details_hotel SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_details_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_top_facility(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_top_facility",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/hotel')
    file = read_cache("get_hotel_top_facility_data", 'cache_web', request, 86400)
    if not file:
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, "get_hotel_top_facility_data", res, 'cache_web')
                _logger.info("get_top_facility_hotel SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                _logger.error("get_top_facility_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            res = file
        except Exception as e:
            res = {
                "result": {
                    "error_code": 500,
                    "error_msg": '',
                    "response": ''
                }
            }
            _logger.error('ERROR get_hotel_top_facility_data file\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_facility_img(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_facility_img",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        # signature = copy.deepcopy(request.session['hotel_signature'])
        # set_session(request, 'hotel_error', {
        #     'error_code': res['result']['error_code'],
        #     'signature': signature
        # })
        if res['result']['error_code'] == 0:
            _logger.info("get_facility_img_hotel SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_facility_img_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def provision(request):
    try:
        data = {
            'price_code': request.POST['price_code'],
            'provider': request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "provision",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        write_cache_file(request, request.POST['signature'], 'hotel_provision', data)
        # set_session(request, 'hotel_provision', res)
        # signature = copy.deepcopy(request.session['hotel_signature'])
        # set_session(request, 'hotel_error', {
        #     'error_code': res['result']['error_code'],
        #     'signature': signature
        # })
        # _logger.info(json.dumps(request.session['hotel_provision']))
        if res['result']['error_code'] == 0:
            _logger.info("provision_hotel HOTEL SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("provision_hotel HOTEL ERROR SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())


    return res

def create_booking(request):
    try:
        passenger = []
        response = get_cache_data(request)
        file = read_cache_file(request, request.POST['signature'], 'hotel_review_pax')
        if file:
            hotel_review_pax = file
            for pax_type in hotel_review_pax:
                if pax_type != 'contact' and pax_type != 'booker':
                    for pax in hotel_review_pax[pax_type]:
                        try:
                            pax.update({
                                'birth_date': '%s-%s-%s' % (
                                    pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                                    pax['birth_date'].split(' ')[0]),
                            })
                        except Exception as e:
                            _logger.error(str(e) + traceback.format_exc())
                        passenger.append(pax)
            booker = hotel_review_pax['booker']
            contacts = hotel_review_pax['contact']

        file = read_cache_file(request, request.POST['signature'], 'hotel_detail_request')
        if file:
            hotel_detail_request = file

        file = read_cache_file(request, request.POST['signature'], 'hotel_room_pick')
        if file:
            hotel_room_pick = file

        file = read_cache_file(request, request.POST['signature'], 'hotel_request')
        if file:
            if file.get('special_request'):
                special_request = file['special_request']
            else:
                special_request = ''
        else:
            special_request = ''

        data = {
            "passengers": passenger,
            'user_id': request.session.get('co_uid') or '',
            'search_data': hotel_detail_request,
            # 'cancellation_policy': request.session['hotel_cancellation_policy']['result']['response'],
            'cancellation_policy': [],
            'promotion_codes_booking': [],
            # 'voucher_code': request.POST['voucher_code'],
            # Remove Versi Baru
            # 'hotel_code': [{
            #     "hotel_code": request.session['hotel_detail']['result']['hotel_code'][request.session['hotel_room_pick']['provider']],
            #     "provider": request.session['hotel_room_pick']['provider']
            # }],
            # Must set as list prepare buat issued multi vendor
            'price_codes': [hotel_room_pick['price_code'],],
            "contact": contacts,
            "booker": booker,
            'kwargs': {
                'force_issued': bool(int(request.POST['force_issued']))
            },
            'special_request': special_request,
            'resv_name': '',
            'os_res_no': '',
            'journeys_booking': ''
        }

        # payment
        if bool(int(request.POST['force_issued'])) == True:
            try:
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
                        'voucher': data_voucher(request.POST['voucher_code'], 'hotel', []),
                    })
                if request.POST.get('payment_reference'):
                    data.update({
                        'payment_reference': request.POST['payment_reference']
                    })
                if request.FILES.get('pay_ref_file'):
                    temp_file = []
                    for rec_file in request.FILES.getlist('pay_ref_file'):
                        temp_file.append({
                            'name': replace_metacharacter_file_name(rec_file.name),
                            'file': base64.b64encode(rec_file.file.read()).decode('ascii'),
                        })
                    data.update({
                        'payment_ref_attachment': temp_file
                    })
            except:
                _logger.error('book, not force issued')
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "booked",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    try:
        write_cache_file(request, request.POST['signature'], 'hotel_booking', res)
        file = read_cache_file(request, request.POST['signature'], 'hotel_request')
        if file:
            file['cache_can_be_use'] = False
            write_cache_file(request, request.POST['signature'], 'hotel_request', file)
        # set_session(request, 'hotel_booking', res['result']['response'])
        # signature = copy.deepcopy(request.session['hotel_signature'])
        # set_session(request, 'hotel_error', {
        #     'error_code': res['result']['error_code'],
        #     'signature': signature
        # })
        # _logger.info(json.dumps(request.session['hotel_booking']))
        if res['result']['error_code'] == 0:
            _logger.info("provision_hotel HOTEL SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("provision_hotel HOTEL ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        write_cache_file(request, request.POST['signature'], 'hotel_get_booking', res)
        # set_session(request, 'hotel_get_booking_%s' % request.POST['signature'], res)
        if res['result']['error_code'] == 0:
            try:
                res['result']['response']['can_issued'] = False
                if res['result']['response']['hold_date'] > datetime.now().strftime('%Y-%m-%d %H:%M:%S'):
                    res['result']['response']['can_issued'] = True
            except:
                _logger.error('no hold date')
            res['result']['response'].update({
                'checkin_date': convert_string_to_date_to_string_front_end_with_date(res['result']['response']['checkin_date']),
                'checkout_date': convert_string_to_date_to_string_front_end_with_date(res['result']['response']['checkout_date'])
            })
            for room in res['result']['response']['hotel_rooms']:
                for date in room['dates']:
                    date.update({
                        'date': convert_string_to_date_to_string_front_end_with_date(date['date'].split(' ')[0])
                    })
            for pax in res['result']['response']['passengers']:
                pax.update({
                    'birth_date': convert_string_to_date_to_string_front_end(pax['birth_date'])
                })
            _logger.info("get_booking_hotel HOTEL SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_booking_hotel HOTEL ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def issued_b2c(request):
    try:
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data = {
            'order_number': request.POST['order_number'],
            'member': member,
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {},
            'agent_payment_method': request.POST.get('agent_payment') or False, ## kalau tidak kirim default balance normal
        }
        provider = []
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'hotel', provider),
            })
        if request.POST.get('payment_reference'):
            data.update({
                'payment_reference': request.POST['payment_reference']
            })
        if request.FILES.get('pay_ref_file'):
            temp_file = []
            for rec_file in request.FILES.getlist('pay_ref_file'):
                temp_file.append({
                    'name': replace_metacharacter_file_name(rec_file.name),
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

    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued HOTEL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued_hotel AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += int(pricing['amount'])
            write_cache_file(request, request.POST['signature'], 'hotel_upsell', total_upsell)
            # set_session(request, 'hotel_upsell_'+request.POST['signature'], total_upsell)
            _logger.info("SUCCESS update_service_charge HOTEL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_airline HOTEL SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'hotel_upsell_booker', total_upsell)
            # set_session(request, 'hotel_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info("SUCCESS update_service_charge_booker HOTEL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_hotel_booker HOTEL SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def review_page(request):
    try:
        res = {}
        file = read_cache_file(request, request.POST['signature'], 'hotel_detail')
        if file:
            res['hotel'] = file
            res['facilities'] = file['facilities']

        file = read_cache_file(request, request.POST['signature'], 'hotel_review_pax')
        if file:
            res['adult'] = file['adult']
            res['booker'] = file['booker']
            res['contact'] = file['contact']
            res['child'] = file['child']

        file = read_cache_file(request, request.POST['signature'], 'hotel_room_pick')
        if file:
            res['hotel_price'] = file

        file = read_cache_file(request, request.POST['signature'], 'hotel_cancellation_policy')
        if file:
            res['cancellation_policy'] = file['result']['response']['policies']

        file = read_cache_file(request, request.POST['signature'], 'hotel_request')
        if file:
            res['special_request'] = file['special_request']
        # res['hotel'] = request.session['hotel_detail']
        # res['facilities'] = request.session['hotel_detail']['facilities']
        # res['adult'] = request.session['hotel_review_pax']['adult']
        # res['booker'] = request.session['hotel_review_pax']['booker']
        # res['contact'] = request.session['hotel_review_pax']['contact']
        # res['child'] = request.session['hotel_review_pax']['child']
        # res['hotel_price'] = request.session['hotel_room_pick']
        # res['cancellation_policy'] = request.session['hotel_cancellation_policy']['result']['response']['policies']
        # res['special_request'] = request.session['hotel_request']['special_request']

    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def detail_page(request):
    try:
        res = {}
        file = read_cache_file(request, request.POST['signature'], 'hotel_request')
        if file:
            res['hotel_search'] = file
            res['check_in'] = convert_string_to_date_to_string_front_end(file['checkin_date'])
            res['check_out'] = convert_string_to_date_to_string_front_end(file['checkout_date'])

        file = read_cache_file(request, request.POST['signature'], 'hotel_detail')
        if file:
            res['facilities'] = file['facilities']

        # data = request.session.get('hotel_request')
        # res['facilities'] = request.session['hotel_detail']['facilities']
        # res['hotel_search'] = data
        # res['check_in'] = data['checkin_date']
        # res['check_out'] = data['checkout_date']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def passenger_page(request):
    try:
        res = {}
        file = read_cache_file(request, request.POST['signature'], 'hotel_room_pick')
        if file:
            res['hotel_price'] = file
        file = read_cache_file(request, request.POST['signature'], 'hotel_request')
        if file:
            res['hotel_request'] = file
        # res['hotel_price'] = request.session['hotel_room_pick']
        # res['hotel_request'] = request.session['hotel_request']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def hotel_check_refund_amount(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'hotel_get_booking')
        if file:
            get_booking_dict = file
        else:
            get_booking_dict = json.loads(request.POST['hotel_get_booking'])
        order_number = get_booking_dict['result']['response']['order_number']
        provider_bookings = []
        for provider_booking in get_booking_dict['result']['response']['provider_bookings']:
            provider_bookings.append({
                "pnr": provider_booking['pnr'],
                "provider": provider_booking['provider']
            })
        data = {
            'order_number': order_number,
            'provider_bookings': provider_bookings
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "check_refund_amount",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS check_refund_amount HOTEL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR check_refund_amount HOTEL SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def hotel_refund(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'hotel_get_booking')
        if file:
            get_booking_dict = file
        else:
            get_booking_dict = json.loads(request.POST['hotel_get_booking'])
        # get_booking_dict = request.session.get('hotel_get_booking_%s' % request.POST['signature']) or json.loads(request.POST['hotel_get_booking'])
        order_number = get_booking_dict['result']['response']['order_number']
        provider_bookings = []
        for provider_booking in get_booking_dict['result']['response']['provider_bookings']:
            provider_bookings.append({
                "pnr": provider_booking['pnr'],
                "provider": provider_booking['provider']
            })
        data = {
            'order_number': order_number,
            'provider_bookings': provider_bookings
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel_booking HOTEL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_booking HOTEL SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def search_mobile(request):
    data = {
        'child': int(request.data['child']),
        'hotel_id': request.data.get('hotel_id') or '',
        'search_name': request.data.get('search_name'),
        'room': int(request.data['room']),
        'checkout_date': request.data['checkout_date'],
        'checkin_date': request.data['checkin_date'],
        'adult': int(request.data['adult']),
        'destination_id': request.data['destination_id'],
        'child_ages': request.data['child_ages'],
        'nationality': request.data['nationality'],
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "search",
        "signature": request.data['signature']
    }
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        counter = 0
        sequence = 0
        if res['result']['error_code'] == 0:

            hotel_data = []
            for hotel in res['result']['response']['city_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['country_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['hotel_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1

            counter = 0

            for hotel in res['result']['response']['landmark_ids']:
                hotel.update({
                    'sequence': sequence,
                    'counter': counter
                })
                counter += 1
                sequence += 1
        else:
            _logger.error("ERROR search_hotel SIGNATURE " + request.session['hotel_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def detail_mobile(request):
    data = {
        'child': int(request.data['child']),
        'search_name': request.data.get('search_name'),
        'room': int(request.data['room']),
        'checkout_date': request.data['checkout_date'],
        'checkin_date': request.data['checkin_date'],
        'adult': int(request.data['adult']),
        'child_ages': request.data['child_ages'],
        'hotel_id': request.data.get('hotel_id') or '',
        'destination': request.data['destination'],
        'nationality': request.data['nationality'],
        'pax_country': False
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_details",
        "signature": request.data['signature']
    }
    url_request = get_url_gateway('booking/hotel')
    res = send_request_api(request, url_request, headers, data, 'POST', timeout=180)
    try:
        signature = copy.deepcopy(request.session['hotel_signature'])
        set_session(request, 'hotel_error', {
            'error_code': res['result']['error_code'],
            'signature': signature
        })
        _logger.info(json.dumps(request.session['hotel_error']))
        if res['result']['error_code'] == 0:
            _logger.info("get_details_hotel SUCCESS SIGNATURE " + signature)
        else:
            _logger.error("get_details_hotel ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res