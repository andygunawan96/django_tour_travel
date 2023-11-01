from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import base64
import json
import logging
import traceback
from .tt_webservice_views import *
from .tt_webservice import *
from ..views import tt_webservice_agent_views as webservice_agent
from .tt_webservice_voucher_views import *
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
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'get_config_provider':
            res = get_config_provider(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_rules':
            res = get_rules(request)
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
        elif req_data['action'] == 'get_seat_map_cache':
            res = get_seat_map_cache(request)
        elif req_data['action'] == 'assign_seats':
            res = assign_seats(request)
        elif req_data['action'] == 'cancel':
            res = cancel(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'booker_insentif_booking':
            res = booker_insentif_booking(request)
        elif req_data['action'] == 'search_page':
            res = search_page(request)
        elif req_data['action'] == 'passenger_page':
            res = passenger_page(request)
        elif req_data['action'] == 'review_page':
            res = review_page(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
    try:
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
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "signin",
            "signature": '',
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('session')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'bus', 20, res['result']['response']['signature'])
            # set_session(request, 'bus_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.POST.get('frontend_signature'):
                write_cache_file(request, res['result']['response']['signature'], 'bus_frontend_signature',request.POST['frontend_signature'])
                write_cache_file(request, request.POST['frontend_signature'], 'bus_signature',res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info("SIGNIN BUS SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def get_config(request, signature=''):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config"
        }
        if signature:
            headers.update({"signature": signature})
        else:
            headers.update({"signature": request.POST['signature']})
        data = {}
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_bus_config", 'cache_web', request, 90911)
    if not file:
        url_request = get_url_gateway('booking/bus')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_bus_config", request, 'cache_web')
                name_city_dict = {}
                for rec in res['station']:
                    name_city_dict["%s - %s" %(res['station'][rec]['city'], res['station'][rec]['name'])] = rec
                write_cache(name_city_dict, "get_bus_config_dict_key_city", request, 'cache_web')
                _logger.info("get_bus_config BUS RENEW SUCCESS SIGNATURE " + headers['signature'])
            else:
                try:
                    file = read_cache("get_bus_config", 'cache_web', request)
                    if file:
                        res = file
                    _logger.info("get_bus_config BUS RENEW SUCCESS SIGNATURE " + headers['signature'])
                except Exception as e:
                    _logger.error('ERROR get_bus_config file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_bus_config", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_bus_config file\n' + str(e) + '\n' + traceback.format_exc())

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
            "provider_type": 'bus'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("bus_provider", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                #datetime
                temp = {}
                for ho_seq_id in res['result']['response']:
                    temp[ho_seq_id] = {}
                    for provider in res['result']['response'][ho_seq_id]:
                        temp[ho_seq_id][provider['provider']] = provider
                write_cache(temp, "bus_provider", request, 'cache_web')
                _logger.info("get_providers_list BUS RENEW SUCCESS SIGNATURE " + request.POST['signature'])
                if request.session['user_account']['co_ho_seq_id'] in temp:
                    res = {
                        "result": {
                            "error_code": 0,
                            "error_msg": '',
                            "response": temp[request.session['user_account']['co_ho_seq_id']]
                        }
                    }

            else:
                try:
                    file = read_cache("bus_provider", 'cache_web', request, 90911)
                    if file and request.session['user_account']['co_ho_seq_id'] in file:
                        res = {
                            "result": {
                                "error_code": 0,
                                "error_msg": '',
                                "response": file[request.session['user_account']['co_ho_seq_id']]
                            }
                        }
                    _logger.info("get_provider_list ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.info("ERROR read file bus_provider SIGNATURE " + request.POST['signature'])
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            if file and request.session['user_account']['co_ho_seq_id'] in file:
                res = {
                    "result": {
                        "error_code": 0,
                        "error_msg": '',
                        "response": file[request.session['user_account']['co_ho_seq_id']]
                    }
                }
        except Exception as e:
            _logger.error('ERROR get_provider_list bus file\n' + str(e) + '\n' + traceback.format_exc())
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
            "provider_type": 'bus'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_bus_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_bus_carriers", request, 'cache_web')
                _logger.info("get_carriers BUS RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("get_bus_carriers", 'cache_web', request, 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers BUS ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_bus_carriers", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_bus_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        file = read_cache("bus_cache_data", 'cache_web', request, 90911)
        if file:
            response = file

        # res = search2(request)
        _logger.info("SUCCESS get_data BUS SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error('ERROR get bus_cache_data file\n' + str(e) + '\n' + traceback.format_exc())

    return response

def search(request):
    #bus
    try:
        bus_destinations = []
        bus_key_name = []
        file = read_cache("get_bus_config", 'cache_web', request, 90911)
        if file:
            bus_destinations = file
        file = read_cache("get_bus_config_dict_key_city", 'cache_web', request, 90911)
        if file:
            bus_key_name = file

        # set_session(request, 'bus_request', json.loads(request.POST['search_request']))

        bus_request = json.loads(request.POST['search_request'])
        write_cache_file(request, request.POST['signature'], 'bus_request', bus_request)

        journey_list = []
        for idx, request_bus in enumerate(bus_request['departure']):
            departure_date = '%s-%s-%s' % (
                bus_request['departure'][idx].split(' ')[2],
                month[bus_request['departure'][idx].split(' ')[1]],
                bus_request['departure'][idx].split(' ')[0])

            journey_list.append({
                'origin': bus_key_name[bus_request['origin'][idx]],
                'destination': bus_key_name[bus_request['destination'][idx]],
                'departure_date': departure_date
            })

        data = {
            "journey_list": journey_list,
            "direction": bus_request['direction'],
            "adult": int(bus_request['adult']),
            "provider": request.POST['provider'],
            # "provider": "rodextrip_bus"
        }
        write_cache_file(request, request.POST['signature'], 'bus_search', data)
        # if 'bus_search' not in request.session:
        #     set_session(request, 'bus_search', data)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'bus_search')
            if file:
                data = file
            # data = request.session['bus_search']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['new_signature']
            }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/bus')
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
                    journey.update({
                        'origin_name': bus_destinations['station'][journey['origin']]['name'],
                        'destination_name': bus_destinations['station'][journey['destination']]['name'],
                    })
            _logger.info("SUCCESS search_bus SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR search_bus SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_rules(request):
    #bus
    try:
        bus_destinations = []
        file = read_cache("get_bus_config", 'cache_web', request, 90911)
        if file:
            bus_destinations = file

        data = json.loads(request.POST['data'])

        write_cache_file(request, request.POST['signature'], 'bus_get_rules', data)
        # if 'bus_get_rules' not in request.session._session:
        #     set_session(request, 'bus_get_rules', data)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_rules",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            for journey in res['result']['response']:
                journey.update({
                    'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date']+':00')),
                    'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']+':00'))
                })
                check = 0
                journey.update({
                    'origin_name': bus_destinations['station'][journey['origin']]['name'],
                    'destination_name': bus_destinations['station'][journey['destination']]['name'],
                })
            _logger.info("SUCCESS search_bus SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR search_bus SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def sell_journeys(request):
    #nanti ganti ke select journey
    try:
        file = read_cache_file(request, request.POST['signature'], 'bus_request')
        if file:
            bus_request = file

        file = read_cache_file(request, request.POST['signature'], 'bus_booking')
        if file:
            bus_booking = file
        data = {
            "promotion_codes": [],
            "adult": int(bus_request['adult']),
            "infant": int(bus_request['infant']),
            "schedules": bus_booking,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_journeys",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS sell_journeys BUS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR sell_journeys_bus BUS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'bus_create_passengers')
        if file:
            bus_create_passengers = file
        booker = bus_create_passengers['booker']
        contacts = bus_create_passengers['contact']

        passenger = []

        for pax_type in bus_create_passengers:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in bus_create_passengers[pax_type]:
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s-%s-%s' % (
                                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                                pax['birth_date'].split(' ')[0]),
                        })
                    if pax['pax_type'] == 'ADT':
                        try:
                            pax.update({
                                'identity_expdate': '%s-%s-%s' % (
                                    pax['identity_expdate'].split(' ')[2], month[pax['identity_expdate'].split(' ')[1]],
                                    pax['identity_expdate'].split(' ')[0])
                            })
                        except Exception as e:
                            _logger.error(str(e) + traceback.format_exc())

                        if pax['identity_type'] != '':
                            pax['identity'] = {
                                "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                                "identity_expdate": pax.pop('identity_expdate'),
                                "identity_number": pax.pop('identity_number'),
                                "identity_type": pax.pop('identity_type'),
                                "identity_image": pax.pop('identity_image'),
                            }
                        else:
                            pax['identity'] = {}
                    elif pax['pax_type'] == 'ADT':
                        pax.pop('identity_expdate')
                        pax.pop('identity_number')
                        pax.pop('identity_type')
                        pax.pop('identity_image')
                    passenger.append(pax)

        file = read_cache_file(request, request.POST['signature'], 'bus_booking')
        if file:
            schedules = file
        # schedules = request.session['bus_booking']
        data = {
            "contacts": contacts,
            "passengers": passenger,
            "schedules": schedules,
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
                    'acquirer_seq_id': request.POST['acquirer_seq_id'],
                })
        except Exception as e:
            _logger.error('book, not force issued')
        if request.POST.get('voucher_code') != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'bus', []),
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
            "action": "commit_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'bus_order_number', res['result']['response']['order_number'])
            # set_session(request, 'bus_order_number', res['result']['response']['order_number'])
            _logger.info("SUCCESS commit_booking BUS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR commit_booking_bus BUS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_booking(request):
    try:
        bus_destinations = {}
        file = read_cache("get_bus_config", 'cache_web', request, 90911)
        if file:
            bus_destinations = file
        sync = False
        try:
            if request.POST['sync'] == 'true':
                sync = True
        except Exception as e:
            _logger.error('get booking force sync params not found')
        data = {
            'order_number': request.POST['order_number'],
            'force_sync': sync
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            try:
                res['result']['response']['can_issued'] = False
                if res['result']['response']['hold_date'] > datetime.now().strftime('%Y-%m-%d %H:%M:%S'):
                    res['result']['response']['can_issued'] = True
            except:
                _logger.error('no hold date')
            for provider_booking in res['result']['response']['provider_bookings']:
                for journey in provider_booking['journeys']:
                    journey.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']))
                    })
                    journey.update({
                        'origin_name': bus_destinations['station'][journey['origin']]['name'],
                        'destination_name': bus_destinations['station'][journey['destination']]['name'],
                    })
            for pax in res['result']['response']['passengers']:
                pax.update({
                    'birth_date': '%s %s %s' % (
                        pax['birth_date'].split(' ')[0].split('-')[2],
                        month[pax['birth_date'].split(' ')[0].split('-')[1]],
                        pax['birth_date'].split(' ')[0].split('-')[0])
                })
            _logger.info("SUCCESS get_booking BUS SIGNATURE " + request.session['bus_signature'])
        else:
            _logger.error("ERROR get_booking_bus BUS SIGNATURE " + request.session['bus_signature'] + ' ' + json.dumps(res))
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

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            total_upsell_dict = {}
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    if upsell.get('pax_type'):
                        if upsell['pax_type'] not in total_upsell_dict:
                            total_upsell_dict[upsell['pax_type']] = 0
                        total_upsell_dict[upsell['pax_type']] += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'bus_upsell', total_upsell_dict)
            # set_session(request, 'bus_upsell_' + request.POST['signature'], total_upsell_dict)
            _logger.info(json.dumps(request.session['bus_upsell' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge BUS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_bus BUS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'bus_upsell_booker', total_upsell)
            # set_session(request, 'bus_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info("SUCCESS update_service_charge_booker BUS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_bus_booker BUS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def seat_map(request):
    try:
        seat_map_request_input = json.loads(request.POST['journey_code_list'])
        seat_request = []
        for i in seat_map_request_input:
            seat_request.append(i['journey_code'])
        data = {
            "journey_code_list": seat_request,
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

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'bus_seat_map', res)
            # set_session(request, 'bus_seat_map' + request.POST['signature'], res)
            _logger.info("SUCCESS seat_map BUS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR seat_map_bus BUS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_seat_map_cache(request):
    return request.session['bus_seat_map' + request.POST['signature']]

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

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'bus', []),
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

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued BUS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued BUS SIGNATURE " + request.POST['signature'])
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

    url_request = get_url_gateway('booking/bus')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel BUS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_bus BUS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def assign_seats(request):
    try:
        passengers = json.loads(request.POST['pax'])
        provider_bookings = []
        provider = ''
        try:
            file = read_cache_file(request, request.POST['signature'], 'bus_booking')
            if file:
                provider = file[0]['provider']
            # provider = request.session['bus_booking'][0]['provider']
        except Exception as e:
            _logger.error(str(e) + traceback.format_exc())
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
        url_request = get_url_gateway('booking/bus')
        res = send_request_api(request, url_request, headers, data, 'POST', 480)
        try:
            if res['result']['error_code'] == 0:
                _logger.info("SUCCESS assign_seats BUS SIGNATURE " + request.POST['signature'])
            else:
                _logger.error("ERROR assign_seats_bus BUS SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

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

def search_page(request):
    try:
        res = {}
        file = read_cache_file(request, request.POST['frontend_signature'], 'bus_request')
        if file:
            res['bus_request'] = file
        # res['bus_request'] = request.session['bus_request']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def passenger_page(request):
    try:
        res = {}
        file = read_cache_file(request, request.POST['signature'], 'bus_pick')
        if file:
            res['response'] = file
        # res['response'] = request.session['bus_pick']
        # carrier = {}
        # file = read_cache("get_bus_config", 'cache_web', request, 90911)
        # if file:
        #     carrier = file
        # res['bus_carriers'] = carrier

        file = read_cache_file(request, request.POST['signature'], 'bus_request')
        if file:
            res['bus_request'] = file
        # res['bus_request'] = request.session['bus_request']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def review_page(request):
    try:
        res = {}
        file = read_cache_file(request, request.POST['signature'], 'bus_pick')
        if file:
            res['response'] = file
        # res['response'] = request.session['bus_pick']

        file = read_cache_file(request, request.POST['signature'], 'bus_create_passengers')
        if file:
            res['passenger'] = file
        # res['passenger'] = request.session['bus_create_passengers']

        file = read_cache_file(request, request.POST['signature'], 'bus_request')
        if file:
            res['bus_request'] = file
        # res['bus_request'] = request.session['bus_request']

        file = read_cache_file(request, request.POST['signature'], 'bus_booking')
        if file:
            res['bus_booking'] = file
        # res['bus_booking'] = request.session['bus_booking']

        file = read_cache_file(request, request.POST['signature'], 'bus_upsell')
        if file:
            bus_upsell = file
        else:
            bus_upsell = {}
        res['upsell_price_dict'] = bus_upsell
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res
