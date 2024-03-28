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
from .tt_webservice_voucher_views import *
from ..views import tt_webservice_agent_views as webservice_agent
import copy
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
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 're_order_set_passengers':
            res = re_order_set_passengers(request)
        elif req_data['action'] == 'choose_train_reorder':
            res = choose_train_reorder(request)
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
        elif req_data['action'] == 'checkin':
            res = checkin(request)
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
        # user_global, password_global, api_key = get_credential(request)
        # user_default, password_default = get_credential_user_default(request)
        # data = {
        #     "user": user_global,
        #     "password": password_global,
        #     "api_key": api_key,
        #     # "co_user": request.session['username'],
        #     # "co_password": request.session['password'],
        #     "co_user": request.session.get('username') or user_default,
        #     "co_password": request.session.get('password') or password_default,
        #     "co_uid": ""
        # }
        # otp_params = {}
        # if request.POST.get('unique_id'):
        #     otp_params['machine_code'] = request.POST['unique_id']
        # if request.POST.get('platform'):
        #     otp_params['platform'] = request.POST['platform']
        # if request.POST.get('browser'):
        #     otp_params['browser'] = request.POST['browser']
        # if request.POST.get('timezone'):
        #     otp_params['timezone'] = request.POST['timezone']
        # if otp_params:
        #     data['otp_params'] = otp_params
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "refresh_session",
            "signature": request.session['master_signature'],
        }
        data = {}
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('session')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'train', 20, res['result']['response']['signature'])
            # set_session(request, 'train_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.POST.get('frontend_signature'):
                write_cache_file(request, res['result']['response']['signature'], 'train_frontend_signature',request.POST['frontend_signature'])
                write_cache_file(request, request.POST['frontend_signature'], 'train_signature',res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])

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
    file = read_cache("train_provider", 'cache_web', request)
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
                write_cache(temp, "train_provider", request, 'cache_web')
                _logger.info("get_providers_list TRAIN RENEW SUCCESS SIGNATURE " + request.POST['signature'])
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
                    file = read_cache("train_provider", 'cache_web', request, 90911)
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
                    _logger.info("get_provider_list TRAIN ERROR SIGNATURE " + request.POST['signature'])
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
    file = read_cache("get_train_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_train_carriers", request, 'cache_web')
                _logger.info("get_carriers TRAIN RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("get_train_carriers", 'cache_web', request, 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers TRAIN ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            res = file
        except Exception as e:
            _logger.error('ERROR get_train_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        file = read_cache("train_cache_data", 'cache_web', request, 90911)
        if file:
            response = file

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data TRAIN SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error('ERROR get train_cache_data file\n' + str(e) + '\n' + traceback.format_exc())

    return response

def get_train_data_search_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['frontend_signature'], 'train_request')
        if file:
            res['train_request'] = file
        # if request.session.get('train_request_%s' % request.POST['frontend_signature']):
        #     res['train_request'] = request.session['train_request_%s' % request.POST['frontend_signature']]
        # else:
        #     res['train_request'] = request.session['train_request']
        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS data search page TRAIN")
    except Exception as e:
        _logger.error('ERROR get train_cache_data_search_page\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_train_data_passenger_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['signature'], 'train_pick')
        if file:
            res['response'] = file
        # res['response'] = request.session['train_pick_%s' % request.POST['signature']]

        file = read_cache("get_train_carriers", 'cache_web', request, 90911)
        if file:
            res['train_carriers'] = file

        file = read_cache_file(request, request.POST['signature'], 'train_request')
        if file:
            res['train_request'] = file
        # res['train_request'] = request.session['train_request_%s' % request.POST['signature']]
        logging.getLogger("error_info").error("SUCCESS data search page TRAIN")
    except Exception as e:
        _logger.error('ERROR get get_train_data_passenger_page\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_train_data_review_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['signature'], 'train_pick')
        if file:
            res['response'] = file
        # res['response'] = request.session['train_pick_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'train_create_passengers')
        if file:
            res['passengers'] = file
        # res['passengers'] = request.session['train_create_passengers_%s' % request.POST['signature']]

        file = read_cache("get_train_carriers", 'cache_web', request, 90911)
        if file:
            res['train_carriers'] = file

        file = read_cache_file(request, request.POST['signature'], 'train_request')
        if file:
            res['train_request'] = file
        # res['train_request'] = request.session['train_request_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'train_upsell')
        if file:
            res['upsell_price_dict'] = file
        else:
            res['upsell_price_dict'] = {}
        # res['upsell_price_dict'] = request.session.get('train_upsell_%s' % request.POST['signature']) and request.session.get('train_upsell_%s' % request.POST['signature']) or {}
        logging.getLogger("error_info").error("SUCCESS data search page TRAIN")
    except Exception as e:
        _logger.error('ERROR get get_train_data_review_page\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_age(birthdate):
    today = date.today()
    age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
    return age

def re_order_set_passengers(request):
    try:
        adult = []
        infant = []
        contact = []
        data_booker = json.loads(request.POST['booker'])
        data_pax = json.loads(request.POST['pax'])
        title = ''
        if data_booker['gender'] == 'male':
            title = 'MR'
        elif data_booker['gender'] == 'female' and data_booker['marital_status'] == '':
            title = 'MS'
        else:
            title = 'MRS'
        booker = {
            "title": title,
            "first_name": data_booker['first_name'],
            "last_name": data_booker['last_name'],
            "email": data_booker['email'],
            "calling_code": data_booker['phones'][0]['calling_code'],
            "mobile": data_booker['phones'][0]['calling_number'],
            "nationality_code": data_booker['nationality_code'],
            "nationality_name": data_booker['nationality_name'],
            "booker_seq_id": data_booker['seq_id']
        }
        contact.append(copy.deepcopy(booker))
        contact[0].update({
            "customer_seq_id": contact[0].pop('booker_seq_id')
        })
        for pax in data_pax:
            if pax['birth_date'] == '' or pax['birth_date'] == False:
                pax_type = 'ADT'
            else:
                birth_date = pax['birth_date'].split(' ')
                old = get_age(date(int(birth_date[2]),int(month[birth_date[1]]),int(birth_date[0])))
                if old > 2:
                    pax_type = 'ADT'
                else:
                    pax_type = 'INF'
            title = pax['title']

            data_pax_dict = {
                "pax_type": pax_type,
                "first_name": pax['cust_first_name'],
                "last_name": pax['cust_last_name'],
                "title": title,
                "birth_date": pax['birth_date'],
                "nationality_code": pax['nationality_code'],
                "nationality_name": pax['nationality_name'],
                "identity_country_of_issued_code": pax['identity_country_of_issued_code'],
                "identity_country_of_issued_name": pax['identity_country_of_issued_name'],
                "identity_expdate": convert_string_to_date_to_string_front_end(pax['identity_expdate']) if pax['identity_expdate'] != '' and pax['identity_expdate'] != False else '',
                "identity_number": pax['identity_number'],
                "identity_first_name": pax['first_name'],
                "identity_last_name": pax['last_name'],
                "passenger_seq_id": pax['seq_id'],
                "identity_type": pax['identity_type'],
                "behaviors": pax['behaviors'],
                "identity_image": [],
            }
            if pax_type == 'ADT':
                adult.append(data_pax_dict)
            else:
                infant.append(data_pax_dict)

        train_create_passengers = {
            'booker': booker,
            'adult': adult,
            'infant': infant,
            'contact': contact
        }
        write_cache_file(request, request.POST['signature'], 'train_create_passengers', train_create_passengers)
        # set_session(request, 'train_create_passengers_%s' % request.POST['signature'], train_create_passengers)
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return ERR.get_no_error_api()

def choose_train_reorder(request):
    try:
        journeys = []
        schedules = []
        for journey in json.loads(request.POST['train_pick']):
            journeys.append({
                'journey_code': journey['journey_code'],
                'fare_code': journey['fares'][0]['fare_code']
            })
            schedules.append({
                'journeys': journeys,
                'provider': journey['provider'],
            })
            journeys = []
        write_cache_file(request, request.POST['signature'], 'train_booking', schedules)
        # set_session(request, 'train_booking_%s' % request.POST['signature'], schedules)
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return ERR.get_no_error_api()

def search(request):
    #train
    try:
        train_destinations = []
        file = read_cache("train_cache_data", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            train_destinations.append({
                'code': country['code'],
                'name': country['name'],
            })

        search_request = json.loads(request.POST['search_request'])

        journey_list = []
        for idx, request_train in enumerate(search_request['departure']):
            departure_date = '%s-%s-%s' % (
                search_request['departure'][idx].split(' ')[2],
                month[search_request['departure'][idx].split(' ')[1]],
                search_request['departure'][idx].split(' ')[0])
            journey_list.append({
                'origin': search_request['origin'][idx].split(' - ')[0],
                'destination': search_request['destination'][idx].split(' - ')[0],
                'departure_date': departure_date
            })

        data = {
            "journey_list": journey_list,
            "direction": search_request['direction'],
            "adult": int(search_request['adult']),
            "infant": int(search_request['infant']),
            "provider": request.POST['provider'],
        }
        write_cache_file(request, request.POST['signature'], 'train_search', data)
        write_cache_file(request, request.POST['signature'], 'train_request', search_request)
        # set_session(request, 'train_search_%s' % request.POST['signature'], data)
        # set_session(request, 'train_request_%s' % request.POST['signature'], search_request)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'train_search')
            if file:
                data = file
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['new_signature']
            }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    sort_by_list = ['K','B','E']
    try:
        if res['result']['error_code'] == 0:
            for journey_list in res['result']['response']['schedules']:
                new_journeys = []
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

                    is_journey_found = False
                    for new_journey in new_journeys:
                        if journey['journey_code'] == new_journey['journey_code'] and journey['carrier_number'] == new_journey['carrier_number'] and journey['carrier_name'] == new_journey['carrier_name']:
                            is_journey_found = True
                            is_cabin_class_found = False
                            for new_fare in new_journey['new_fares']:
                                if new_fare['cabin_class'] == journey['cabin_class']:
                                    is_cabin_class_found = True
                                    new_fare['fares'].append(copy.deepcopy(journey['fares'][0]))
                                    if new_fare['fares'][-1]['service_charge_summary']:
                                        new_fare['fares'][-1].update({
                                            "total_price": journey['fares'][-1]['service_charge_summary'][-1]['total_price'],
                                            "available_count": journey['available_count'],
                                            "class_of_service": journey['class_of_service']
                                        })
                            new_journey['fares'].append(journey['fares'][0])
                            if not is_cabin_class_found:
                                new_journey['new_fares'].append({
                                    "cabin_class": journey['cabin_class'],
                                    "fares": copy.deepcopy(journey['fares'])
                                })
                                if new_journey['new_fares'][-1]['fares'][-1]['service_charge_summary']:
                                    new_journey['new_fares'][-1]['fares'][-1].update({
                                        "total_price": journey['fares'][-1]['service_charge_summary'][-1]['total_price'],
                                        "available_count": journey['available_count'],
                                        "class_of_service": journey['class_of_service']
                                    })
                    if not is_journey_found:
                        new_journeys.append(journey)
                        new_journeys[-1]['new_fares'] = []
                        new_journeys[-1]['new_fares'].append({
                            "cabin_class": journey['cabin_class'],
                            "fares": copy.deepcopy(journey['fares'])
                        })
                        if new_journeys[-1]['new_fares'][-1]['fares'][-1]['service_charge_summary']:
                            new_journeys[-1]['new_fares'][-1]['fares'][-1].update({
                                "total_price": new_journeys[-1]['new_fares'][-1]['fares'][-1]['service_charge_summary'][-1]['total_price'],
                                "available_count": journey['available_count'],
                                "class_of_service": journey['class_of_service']
                            })
                ## SORT CABIN CLASS
                for new_journey in new_journeys:
                    new_fares_data_list = []
                    for cabin_class in sort_by_list:
                        for new_fare in new_journey['new_fares']:
                            if new_fare['cabin_class'] == cabin_class:
                                new_fares_data_list.append(new_fare)
                    new_journey['new_fares'] = new_fares_data_list

                journey_list.update({
                    "new_journeys": new_journeys
                })
            _logger.info("SUCCESS search_train SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR search_train SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def sell_journeys(request):
    #nanti ganti ke select journey
    try:
        file = read_cache_file(request, request.POST['signature'], 'train_request')
        if file:
            train_request = file

        file = read_cache_file(request, request.POST['signature'], 'train_booking')
        if file:
            train_booking = file

        data = {
            "promotion_codes": [],
            "adult": int(train_request['adult']),
            "infant": int(train_request['infant']),
            "schedules": train_booking,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_journeys",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS sell_journeys TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR sell_journeys TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'train_create_passengers')
        if file:
            train_create_passengers = file
            booker = train_create_passengers['booker']
            contacts = train_create_passengers['contact']
            passenger = []
            for pax_type in train_create_passengers:
                if pax_type != 'booker' and pax_type != 'contact':
                    for pax in train_create_passengers[pax_type]:
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
                        except Exception as e:
                            _logger.error(str(e) + traceback.format_exc())
                        pax['identity'] = {
                            "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                            "identity_expdate": pax.pop('identity_expdate'),
                            "identity_number": pax.pop('identity_number'),
                            "identity_first_name": pax.get('identity_first_name') and pax.pop('identity_first_name') or pax['first_name'],
                            "identity_last_name": pax.get('identity_last_name') and pax.pop('identity_last_name') or pax['last_name'],
                            "identity_type": pax.pop('identity_type'),
                            "identity_image": pax.pop('identity_image'),
                        }
                        passenger.append(pax)

        file = read_cache_file(request, request.POST['signature'], 'train_booking')
        if file:
            train_booking = file
        data = {
            "contacts": contacts,
            "passengers": passenger,
            "schedules": train_booking,
            "booker": booker,
            'force_issued': bool(int(request.POST['value'])),
            'voucher': {}
        }

        try:
            if request.POST['use_point'] == 'false':
                data['use_point'] = False
            else:
                data['use_point'] = True
        except:
            _logger.error('use_point not found')

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
        except:
            _logger.error('book, not force issued')

        if request.POST.get('pin'):
            data['pin'] = encrypt_pin(request.POST['pin'])

        if request.POST.get('voucher_code') != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'train', []),
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

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit_booking TRAIN SIGNATURE " + request.POST['signature'])
            ## hapus session
            # for key in reversed(list(request.session._session.keys())):
            #     if request.POST['signature'] in key:
            #         if 'b2c_limitation' in request.session['user_account']['co_agent_frontend_security'] and key == 'train_passenger_request_%s' % request.POST['signature']:
            #             pass
            #         else:
            #             del request.session[key]
        else:
            _logger.error("ERROR commit_booking TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_booking(request):
    try:
        train_destinations = []
        file = read_cache("train_cache_data", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            train_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'country': country['country'],
                'city': country['city']
            })
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
    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'train_booking', res)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            country = {}
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            try:
                res['result']['response']['can_issued'] = False
                if res['result']['response']['hold_date'] > now:
                    res['result']['response']['can_issued'] = True
            except:
                _logger.error('no hold date')

            if 'process_rebooking' in request.session['user_account']['co_agent_frontend_security']:
                rebooking = True
                for provider_booking_dict in res['result']['response']['provider_bookings']:
                    for journey_dict in provider_booking_dict['journeys']:
                        if now > journey_dict['departure_date']:
                            rebooking = False
                res['result']['response']['rebooking'] = rebooking

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
                                'origin_city': destination['city'],
                                'origin_country': destination['country']
                            })
                            check = check + 1
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_name': destination['name'],
                                'destination_city': destination['city'],
                                'destination_country': destination['country']
                            })
                            check = check + 1
                        if check == 2:
                            break
            for pax in res['result']['response']['passengers']:
                if pax.get('birth_date'):
                    pax.update({
                        'birth_date': '%s %s %s' % (
                            pax['birth_date'].split(' ')[0].split('-')[2],
                            month[pax['birth_date'].split(' ')[0].split('-')[1]],
                            pax['birth_date'].split(' ')[0].split('-')[0])
                    })
                if pax.get('nationality_code'):
                    if country.get(pax['nationality_code']):
                        pax['nationality_name'] = country[pax['nationality_code']]
                    else:
                        for country in airline_country:
                            if country['code'] == pax['nationality_code']:
                                country[pax['nationality_code']] = country['name']
                                pax['nationality_name'] = country['name']
                                break
                if pax.get('identity_country_of_issued_code'):
                    if country.get(pax['identity_country_of_issued_code']):
                        pax['identity_country_of_issued_name'] = country[pax['identity_country_of_issued_code']]
                    else:
                        for country in airline_country:
                            if country['code'] == pax['identity_country_of_issued_code']:
                                country[pax['identity_country_of_issued_code']] = country['name']
                                pax['identity_country_of_issued_name'] = country['name']
                                break
            _logger.info("SUCCESS get_booking TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = get_url_gateway('booking/train')
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
            write_cache_file(request, request.POST['signature'], 'train_upsell', total_upsell_dict)
            # set_session(request, 'train_upsell_' + request.POST['signature'], total_upsell_dict)
            _logger.info("SUCCESS update_service_charge TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'train_upsell_booker', total_upsell)
            # set_session(request, 'train_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info("SUCCESS update_service_charge_booker TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_booker TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def seat_map(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'train_seat_map_request')
        if file:
            seat_map_request_input = file
        # seat_map_request_input = request.session['train_seat_map_request_%s' % request.POST['signature']]
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

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS seat_map TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR seat_map TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

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
            'order_number': request.POST['order_number'],
            'member': member,
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {},
            'agent_payment_method': request.POST.get('agent_payment') or False, ## kalau tidak kirim default balance normal
        }

        if request.POST.get('pin'):
            data['pin'] = encrypt_pin(request.POST['pin'])

        try:
            if request.POST['use_point'] == 'false':
                data['use_point'] = False
            else:
                data['use_point'] = True
        except:
            _logger.error('use_point not found')

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'train', []),
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

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued TRAIN SIGNATURE " + request.POST['signature'])
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

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def checkin(request):
    try:
        data = {
            "order_number": request.POST['order_number'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "checkin",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/train')
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS web check-in TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR web check-in TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def assign_seats(request):
    try:
        passengers = json.loads(request.POST['pax'])
        provider_bookings = []
        provider = ''
        try:
            file = read_cache_file(request, request.POST['signature'], 'train_booking')
            if file:
                for provider_booking in file['result']['response']['provider_bookings']:
                    provider = provider_booking['provider']
            # provider = request.session['train_booking_%s' % request.POST['signature']][0]['provider']
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
                            "passenger_sequence": pax['sequence'],
                            "behaviors": pax['behaviors']
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
        url_request = get_url_gateway('booking/train')
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