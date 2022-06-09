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
            create_session_product(request, 'train', 20)
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
                "first_name": pax['first_name'],
                "last_name": pax['last_name'],
                "title": title,
                "birth_date": pax['birth_date'],
                "nationality": pax['nationality_code'],
                "nationality_name": pax['nationality_name'],
                "identity_country_of_issued": pax['identity_country_of_issued_code'],
                "identity_country_of_issued_name": pax['identity_country_of_issued_name'],
                "identity_expdate": convert_string_to_date_to_string_front_end(pax['identity_expdate']) if pax['identity_expdate'] != '' and pax['identity_expdate'] != False else '',
                "identity_number": pax['identity_number'],
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
        set_session(request, 'train_create_passengers', train_create_passengers)
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
        set_session(request, 'train_booking', schedules)
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return ERR.get_no_error_api()

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
                    except Exception as e:
                        _logger.error(str(e) + traceback.format_exc())
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
                        "identity_image": pax.pop('identity_image'),
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
                    'acquirer_seq_id': request.POST['acquirer_seq_id'],
                })
        except:
            _logger.error('book, not force issued')
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
            javascript_version = get_cache_version()
            response = get_cache_data(javascript_version)
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
            'order_number': request.POST['order_number'],
            'member': member,
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {}
        }

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
                            "passenger_sequence": pax['sequence']
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