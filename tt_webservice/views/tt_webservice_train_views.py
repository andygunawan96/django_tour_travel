from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
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
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'get_train_data_search_page':
            res = get_train_data_search_page(request)
        elif req_data['action'] == 'get_train_data_passenger_page':
            res = get_train_data_passenger_page(request)
        elif req_data['action'] == 'get_train_data_review_page':
            res = get_train_data_review_page(request)
        elif req_data['action'] == 'get_config_provider':
            res = get_config_provider(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'sell_journeys':
            res = sell_journeys(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'get_seat_map':
            res = seat_map(request)
        elif req_data['action'] == 'assign_seats':
            res = assign_seats(request)
        elif req_data['action'] == 'cancel':
            res = cancel(request)
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
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "signin",
            "signature": '',
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'train_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['train_signature']))

            _logger.info("SIGNIN TRAIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def get_config_provider(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_list",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'train'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("train_provider")
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                #datetime
                write_cache_with_folder(res, "train_provider")
                _logger.info("get_providers TRAIN RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("train_provider", 90911)
                    if file:
                        res = file
                    _logger.info("get_provider_list ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.info("get_provider_list TRAIN ERROR SIGNATURE " + request.POST['signature'])
                _logger.info("get_providers TRAIN ERROR SIGNATURE " + request.POST['signature'])
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("train_provider", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_provider_list train file\n' + str(e) + '\n' + traceback.format_exc())
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
            "provider_type": 'train'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_train_carriers")
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_train_carriers")
                _logger.info("get_carriers TRAIN RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_train_carriers", 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers TRAIN ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_train_carriers", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_train_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        file = read_cache_with_folder_path("train_cache_data", 90911)
        if file:
            response = file

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data TRAIN SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error('ERROR get train_cache_data file\n' + str(e) + '\n' + traceback.format_exc())

    return response

def get_train_data_search_page(request):
    try:
        res = {}
        res['train_request'] = request.session['train_request']
        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS data search page TRAIN")
    except Exception as e:
        _logger.error('ERROR get train_cache_data file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_train_data_passenger_page(request):
    try:
        res = {}
        res['response'] = request.session['train_pick']
        file = read_cache_with_folder_path("get_train_carriers", 90911)
        if file:
            res['train_carriers'] = file
        res['train_request'] = request.session['train_request']
        logging.getLogger("error_info").error("SUCCESS data search page TRAIN")
    except Exception as e:
        _logger.error('ERROR get train_cache_data file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_train_data_review_page(request):
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

def search(request):
    #train
    try:
        train_destinations = []
        file = read_cache_with_folder_path("train_cache_data", 90911)
        if file:
            response = file
        set_session(request, 'train_request', json.loads(request.POST['search_request']))
        for country in response:
            train_destinations.append({
                'code': country['code'],
                'name': country['name'],
            })

        journey_list = []
        for idx, request_train in enumerate(request.session['train_request']['departure']):
            departure_date = '%s-%s-%s' % (
                request.session['train_request']['departure'][idx].split(' ')[2],
                month[request.session['train_request']['departure'][idx].split(' ')[1]],
                request.session['train_request']['departure'][idx].split(' ')[0])
            journey_list.append({
                'origin': request.session['train_request']['origin'][idx].split(' - ')[0],
                'destination': request.session['train_request']['destination'][idx].split(' - ')[0],
                'departure_date': departure_date
            })

        data = {
            "journey_list": journey_list,
            "direction": request.session['train_request']['direction'],
            "adult": int(request.session['train_request']['adult']),
            "infant": int(request.session['train_request']['infant']),
            "provider": request.POST['provider'],
            # "provider": "rodextrip_train"
        }
        if 'train_search' not in request.session._session:
            set_session(request, 'train_search', data)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['train_search']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['signature']
            }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            for journey_list in res['result']['response']['schedules']:
                for journey in journey_list['journeys']:
                    journey.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date']+':00')),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']+':00'))
                    })
                    check = 0
                    for destination in train_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_name': destination['name'],
                            })
                            check = check + 1
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_name': destination['name'],
                            })
                            check = check + 1
                        if check == 2:
                            break
            _logger.info("SUCCESS search_train SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR search_train SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def sell_journeys(request):
    #nanti ganti ke select journey
    try:

        data = {
            "promotion_codes": [],
            "adult": int(request.session['train_request']['adult']),
            "infant": int(request.session['train_request']['infant']),
            "schedules": request.session['train_booking'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_journeys",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS sell_journeys TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR sell_journeys_train TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    try:
        booker = request.session['train_create_passengers']['booker']
        contacts = request.session['train_create_passengers']['contact']
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        for country in response['result']['response']['airline']['country']:
            if booker['nationality_name'] == country['name']:
                booker['nationality_code'] = country['code']
                break

        for pax in contacts:
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break
        passenger = []
        for pax_type in request.session['train_create_passengers']:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in request.session['train_create_passengers'][pax_type]:
                    if pax['nationality_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['nationality_name'] == country['name']:
                                pax['nationality_code'] = country['code']
                                break
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s-%s-%s' % (
                                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                                pax['birth_date'].split(' ')[0]),
                        })
                    try:
                        pax.update({
                            'identity_expdate': '%s-%s-%s' % (
                                pax['identity_expdate'].split(' ')[2], month[pax['identity_expdate'].split(' ')[1]],
                                pax['identity_expdate'].split(' ')[0])
                        })
                    except:
                        pass
                    if pax['identity_country_of_issued_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['identity_country_of_issued_name'] == country['name']:
                                pax['identity_country_of_issued_code'] = country['code']
                                break
                    else:
                        pax['identity_country_of_issued_code'] = ''
                    pax['identity'] = {
                        "identity_country_of_issued_name": pax.pop('identity_country_of_issued_name'),
                        "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                        "identity_expdate": pax.pop('identity_expdate'),
                        "identity_number": pax.pop('identity_number'),
                        "identity_type": pax.pop('identity_type'),
                    }
                    passenger.append(pax)
        data = {
            "contacts": contacts,
            "passengers": passenger,
            "schedules": request.session['train_booking'],
            "booker": booker,
            'force_issued': bool(int(request.POST['value'])),
            'voucher': {}
        }
        try:
            if bool(int(request.POST['value'])) == True:
                if request.POST['member'] == 'non_member':
                    member = False
                else:
                    member = True
                data.update({
                    'member': member,
                    'seq_id': request.POST['seq_id'],
                })
        except:
            pass
        if request.POST.get('voucher_code') != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'train', []),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'train_order_number', res['result']['response']['order_number'])
            _logger.info(json.dumps(request.session['train_order_number']))
            _logger.info("SUCCESS commit_booking TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR commit_booking_train TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_booking(request):
    try:
        train_destinations = []
        file = read_cache_with_folder_path("train_cache_data", 90911)
        if file:
            response = file
        for country in response:
            train_destinations.append({
                'code': country['code'],
                'name': country['name'],
            })
        data = {
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            for provider_booking in res['result']['response']['provider_bookings']:
                for journey in provider_booking['journeys']:
                    journey.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'] + ':00')),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date'] + ':00'))
                    })
                    check = 0
                    for destination in train_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_name': destination['name'],
                            })
                            check = check + 1
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_name': destination['name'],
                            })
                            check = check + 1
                        if check == 2:
                            break
            for pax in res['result']['response']['passengers']:
                pax.update({
                    'birth_date': '%s %s %s' % (
                        pax['birth_date'].split(' ')[0].split('-')[2],
                        month[pax['birth_date'].split(' ')[0].split('-')[1]],
                        pax['birth_date'].split(' ')[0].split('-')[0])
                })
            _logger.info("SUCCESS get_booking TRAIN SIGNATURE " + request.session['train_signature'])
        else:
            _logger.error("ERROR get_booking_train TRAIN SIGNATURE " + request.session['train_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
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

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'train_upsell_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['train_upsell' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_train TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'ppob_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['ppob_upsell_booker_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge_booker PPOB SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_ppob_booker PPOB SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'train_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['train_upsell_booker_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge_booker TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_train_booker TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def seat_map(request):
    try:
        seat_map_request_input = request.session['train_seat_map_request']
        seat_request = []
        for i in seat_map_request_input:
            seat_request.append(i['fare_code'])
        data = {
            "fare_codes": seat_request,
            "provider": seat_map_request_input[0]['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_seat_availability",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS seat_map TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR seat_map_train TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

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

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'train', []),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel(request):
    try:
        data = {
            "order_number": request.POST['order_number'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/train'
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_train TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def assign_seats(request):
    try:
        passengers = json.loads(request.POST['pax'])
        provider_bookings = []
        provider = ''
        try:
            provider = request.session['train_booking'][0]['provider']
        except:
            pass
        for idx, pax in enumerate(passengers):
            for idy, seat in enumerate(pax['seat_pick']):
                if pax['seat_pick'][idy]['wagon'] != pax['seat'][idy]['wagon'] or pax['seat_pick'][idy]['seat'] != pax['seat'][idy]['seat'] or pax['seat_pick'][idy]['column'] != pax['seat'][idy]['column']:
                    journeys = []
                    seats = []
                    if seat['wagon'] != '':
                        if len(provider_bookings) > idy:
                            seats = provider_bookings[idy]['journeys'][0]['seats']
                        seats.append({
                            "cabin_code": seat['wagon'],
                            "seat_row": int(seat['seat']),
                            "seat_column": seat['column'],
                            "passenger_sequence": idx + 1
                        })
                        journeys.append({
                            "sequence": 1,
                            "seats": seats
                        })
                        if len(provider_bookings) > idy:
                            provider_bookings[idy].update({
                                "journeys": journeys
                            })
                        else:
                            provider_bookings.append({
                                "provider": provider and provider or provider_kai,
                                "sequence": idy + 1,
                                "journeys": journeys
                            })
        data = {
            "order_number": request.POST['order_number'],
            "provider_bookings": provider_bookings
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "assign_seats",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    if len(provider_bookings) > 0:
        url_request = url + 'booking/train'
        res = send_request_api(request, url_request, headers, data, 'POST', 480)
        try:
            if res['result']['error_code'] == 0:
                _logger.info("SUCCESS assign_seats TRAIN SIGNATURE " + request.POST['signature'])
            else:
                _logger.error("ERROR assign_seats_train TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

        except Exception as e:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    else:
        res = {
            'result': {
                'error_code': 0,
                'error_message': '',
                'response': [{
                    'status': 'SUCCESS',
                    'error_msg': ''
                }]
            }
        }
    return res