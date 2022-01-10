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
from ..views import tt_webservice_agent_views as webservice_agent
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
        elif req_data['action'] == 'get_hotel_data_detail_page':
            res = get_hotel_data_detail_page(request)
        elif req_data['action'] == 'get_auto_complete':
            res = get_auto_complete(request)
        elif req_data['action'] == 'get_top_facility':
            res = get_top_facility(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'detail':
            res = detail(request)
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

    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'hotel', 20)
            set_session(request, 'hotel_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['hotel_signature']))
            _logger.info(json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_hotel_data_detail_page(request):
    try:
        res = {}
        res['response'] = request.session['train_pick']
        res['passengers'] = request.session['train_create_passengers']
        file = read_cache_with_folder_path("get_train_carriers", 90911)
        if file:
            res['train_carriers'] = file
        res['train_request'] = request.session['train_request']
        logging.getLogger("error_info").error("SUCCESS data search page TRAIN")
    except Exception as e:
        _logger.error('ERROR get train_cache_data file\n' + str(e) + '\n' + traceback.format_exc())

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
            "provider_type": 'hotel'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_hotel_carriers")
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_hotel_carriers")
                _logger.info("get_carriers HOTEL RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_hotel_carriers", 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers HOTEL ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_hotel_carriers", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_hotel_carriers file\n' + str(e) + '\n' + traceback.format_exc())

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
        file = read_cache_with_folder_path("hotel_cache_data", 90911)
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
        # logging.getLogger("error_info").error("SUCCESS get_autocomplete HOTEL SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error('ERROR get hotel cache data file\n' + str(e) + '\n' + traceback.format_exc())

    return record_json

def search(request):
    try:
        child_age = []
        if request.POST['child_age'] != '':
            child_age = request.POST['child_age'].split(',')
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        id = ''
        country_id = ''
        destination_id = ''
        hotel_id = ''
        landmark_id = ''
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
                del request.session['hotel_request_data']['pax_country']
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
            if data == request.session['hotel_request_data'] and request.session['hotel_error']['error_code'] == 0 and sum([len(rec) for rec in request.session['hotel_response_search']['result']['response'].values()]) != 0:
                # or sum([len(rec) for rec in request.session['hotel_response_search']['result']['response'].values()]) == 0
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
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    if data:
        url_request = url + 'booking/hotel'
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
        set_session(request, 'hotel_response_search', res)
    else:
        res = request.session['hotel_response_search']
    try:
        counter = 0
        sequence = 0
        if res['result']['error_code'] == 0:
            signature = copy.deepcopy(request.session['hotel_signature'])
            set_session(request, 'hotel_error', {
                'error_code': res['result']['error_code'],
                'signature': signature
            })
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

def detail(request):
    try:
        data = json.loads(request.POST['data'])
        data.update({
            'hotel_id': request.session['hotel_detail']['id'],
            'checkin_date': request.POST['checkin_date'] and str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10] or data['checkin_date'],
            'checkout_date': request.POST['checkout_date'] and str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10] or data['checkout_date'],
            'pax_country': False
        })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_details",
            "signature": request.session['hotel_signature'],
        }
        set_session(request, 'hotel_detail_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['hotel_detail_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_details",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/hotel'
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

def get_cancellation_policy(request):
    try:
        data = {
            # "hotel_code": request.session['hotel_detail']['external_code'][request.POST['provider']],
            "hotel_code": request.session['hotel_detail']['id'],
            "price_code": request.POST['price_code'],
            "provider": request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_cancellation_policy",
            "signature": request.session['hotel_signature'],
        }
        set_session(request, 'hotel_get_cancellation_policy_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['hotel_get_cancellation_policy_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_cancellation_policy",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            for rec in res['result']['response']['policies']:
                rec['date'] = convert_string_to_date_to_string_front_end(rec['date'])
            set_session(request, 'hotel_cancellation_policy', res)
            request.session['hotel_cancellation_policy'] = res

            signature = copy.deepcopy(request.session['hotel_signature'])
            set_session(request, 'hotel_error', {
                'error_code': res['result']['error_code'],
                'signature': signature
            })
            _logger.info(json.dumps(request.session['hotel_cancellation_policy']))
            _logger.info("get_details_hotel SUCCESS SIGNATURE " + signature)
        else:
            _logger.error("get_details_hotel ERROR SIGNATURE " + request.session['hotel_signature'] + ' ' + json.dumps(res))
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
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        set_session(request, 'hotel_cancellation_policy', res)
        _logger.info(json.dumps(request.session['hotel_cancellation_policy']))
        if res['result']['error_code'] == 0:
            _logger.info("get_top_facility_hotel SUCCESS SIGNATURE " + request.session['hotel_signature'])
        else:
            _logger.error("get_top_facility_hotel ERROR SIGNATURE " + request.session['hotel_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_facility_img(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_facility_img",
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        signature = copy.deepcopy(request.session['hotel_signature'])
        set_session(request, 'hotel_error', {
            'error_code': res['result']['error_code'],
            'signature': signature
        })
        _logger.info(json.dumps(request.session['hotel_error']))
        if res['result']['error_code'] == 0:
            _logger.info("get_facility_img_hotel SUCCESS SIGNATURE " + request.session['hotel_signature'])
        else:
            _logger.error("get_facility_img_hotel ERROR SIGNATURE " + request.session['hotel_signature'] + ' ' + json.dumps(res))
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
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        set_session(request, 'hotel_provision', res)
        signature = copy.deepcopy(request.session['hotel_signature'])
        set_session(request, 'hotel_error', {
            'error_code': res['result']['error_code'],
            'signature': signature
        })
        _logger.info(json.dumps(request.session['hotel_provision']))
        if res['result']['error_code'] == 0:
            _logger.info("provision_hotel HOTEL SUCCESS SIGNATURE " + request.session['hotel_signature'])
        else:
            _logger.error("provision_hotel HOTEL ERROR SIGNATURE " + request.session['hotel_signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())


    return res

def create_booking(request):
    try:
        passenger = []
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        for pax_type in request.session['hotel_review_pax']:
            if pax_type != 'contact' and pax_type != 'booker':
                for pax in request.session['hotel_review_pax'][pax_type]:
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
                    except Exception as e:
                        _logger.error(str(e) + traceback.format_exc())
                    passenger.append(pax)
        booker = request.session['hotel_review_pax']['booker']
        contacts = request.session['hotel_review_pax']['contact']
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
        data = {
            "passengers": passenger,
            'user_id': request.session.get('co_uid') or '',
            'search_data': request.session['hotel_detail_request'],
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
            'price_codes': [request.session['hotel_room_pick']['price_code'],],
            "contact": contacts,
            "booker": booker,
            'kwargs': {
                'force_issued': bool(int(request.POST['force_issued']))
            },
            'special_request': request.session['hotel_request']['special_request'],
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
                    'seq_id': request.POST['seq_id'],
                    'voucher': {}
                })
                if request.POST['voucher_code'] != '':
                    data.update({
                        'voucher': data_voucher(request.POST['voucher_code'], 'hotel', []),
                    })
            except:
                _logger.error('book, not force issued')
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "booked",
            "signature": request.session['hotel_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    try:
        set_session(request, 'hotel_booking', res['result']['response'])
        signature = copy.deepcopy(request.session['hotel_signature'])
        set_session(request, 'hotel_error', {
            'error_code': res['result']['error_code'],
            'signature': signature
        })
        _logger.info(json.dumps(request.session['hotel_booking']))
        if res['result']['error_code'] == 0:
            _logger.info("provision_hotel HOTEL SUCCESS SIGNATURE " + request.session['hotel_signature'])
        else:
            _logger.error("provision_hotel HOTEL ERROR SIGNATURE " + request.session['hotel_signature'] + ' ' + json.dumps(res))
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
    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        set_session(request, 'hotel_provision', res)
        _logger.info(json.dumps(request.session['hotel_provision']))
        if res['result']['error_code'] == 0:
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
            'seq_id': request.POST['seq_id'],
            'voucher': {}
        }
        provider = []
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'hotel', provider),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/hotel'
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

    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += int(pricing['amount'])
            set_session(request, 'hotel_upsell_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['hotel_upsell_' + request.POST['signature']]))
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

    url_request = url + 'booking/hotel'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'hotel_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['hotel_upsell_booker_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge_booker HOTEL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_hotel_booker HOTEL SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def review_page(request):
    try:
        res = {}
        res['facilities'] = request.session['hotel_detail']['facilities']
        res['adult'] = request.session['hotel_review_pax']['adult']
        res['booker'] = request.session['hotel_review_pax']['booker']
        res['contact'] = request.session['hotel_review_pax']['contact']
        res['child'] = request.session['hotel_review_pax']['child']
        res['hotel'] = request.session['hotel_detail']
        res['hotel_price'] = request.session['hotel_room_pick']
        res['cancellation_policy'] = request.session['hotel_cancellation_policy']['result']['response']['policies']

    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def detail_page(request):
    try:
        res = {}
        data = request.session.get('hotel_request')
        res['facilities'] = request.session['hotel_detail']['facilities']
        res['hotel_search'] = data
        res['check_in'] = data['checkin_date']
        res['check_out'] = data['checkout_date']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res
