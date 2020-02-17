from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import datetime
from ..static.tt_webservice.url import *
from dateutil.relativedelta import *
import json
from .tt_webservice_views import *
import logging
import traceback
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

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = signin(request)
        elif req_data['action'] == 'static_path_url_server':
            res = get_url_static_path()
        elif req_data['action'] == 'get_agent_booker':
            res = get_agent_passenger(request)
        elif req_data['action'] == 'get_customer_list':
            res = get_customer_list(request)
        elif req_data['action'] == 'update_cache':
            res = update_cache(request)
        elif req_data['action'] == 'create_customer':
            res = create_customer(request)
        elif req_data['action'] == 'update_customer':
            res = update_customer(request)
        elif req_data['action'] == 'update_customer_list':
            res = update_customer_list(request)
        elif req_data['action'] == 'add_passenger_cache':
            res = add_passenger_cache(request)
        elif req_data['action'] == 'del_passenger_cache':
            res = del_passenger_cache(request)
        elif req_data['action'] == 'get_passenger_cache':
            res = get_passenger_cache(request)
        elif req_data['action'] == 'get_agent_booking':
            res = get_agent_booking(request)
        elif req_data['action'] == 'get_top_up_history':
            res = get_top_up(request)
        elif req_data['action'] == 'get_top_up_amount':
            res = get_top_up_amount(request)
        elif req_data['action'] == 'create_top_up':
            res = create_top_up(request)
        elif req_data['action'] == 'top_up_payment':
            res = top_up_payment(request)
        elif req_data['action'] == 'get_merchant_info':
            res = get_merchant_info(request)
        elif req_data['action'] == 'request_va':
            res = request_va(request)
        elif req_data['action'] == 'request_inv_va':
            res = request_inv_va(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def signin(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signin",
        "signature": ''
    }

    data = {
        "user": user_global,
        "password": password_global,
        "api_key":  api_key,

        "co_user": request.POST['username'],
        "co_password": request.POST['password'],
        # "co_user": user_default,  # request.POST['username'],
        # "co_password": password_default, #request.POST['password'],
        # "co_uid": ""
    }

    res = util.send_request(url=url+'session', data=data, headers=headers, method='POST', timeout=10)
    try:
        if res['result']['error_code'] == 0:
            request.session['signature'] = res['result']['response']['signature']
            request.session['username'] = request.POST['username']
            request.session['password'] = request.POST['password']
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_account",
                "signature": res['result']['response']['signature']
            }

            res_user = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
            # pakai kalo template PER USER
            # user_template = UserTemplate().get_data_by_id(request.POST['username'], True) #true buat rodextrip false buat tors
            # res_user['result']['response'].update({
            #     'logo_url': user_template.logo_url,
            #     'name': user_template.name,
            #     'template': user_template.template_id,
            #     'desc': user_template.desc
            # })
            request.session['user_account'] = res_user['result']['response']
            try:
                if res['result']['error_code'] == 0:
                    data = {}
                    headers = {
                        "Accept": "application/json,text/html,application/xml",
                        "Content-Type": "application/json",
                        "action": "get_provider_type_list",
                        "signature": res['result']['response']['signature']
                    }
                    provider_type = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
                    try:
                        if provider_type['result']['error_code'] == 0:
                            provider_type_list = []
                            for provider in provider_type['result']['response']['provider_type_list']:
                                provider_type_list.append(provider['code'])
                            request.session['provider'] = provider_type_list
                        else:
                            # request.session['provider'] = ['airline', 'train', 'visa', 'activity', 'tour', 'hotel']
                            request.session['provider'] = []
                    except:
                        request.session['provider'] = []
                    logging.getLogger("info_logger").info("SIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
                    javascript_version = get_cache_version()
                    response = get_cache_data(javascript_version)

                    res['result']['response'].update({
                        # 'visa': response['result']['response']['visa'],
                        # 'issued_offline': response['result']['response']['issued_offline'],
                        # 'train': response['result']['response']['train'],
                        'activity': response['result']['response']['activity'],
                        'tour': response['result']['response']['tour'],
                        'airline': response['result']['response']['airline'],
                        # 'hotel_config': response['result']['response']['hotel_config'],
                    })
                    logging.getLogger("info_logger").error("SUCCESS SIGNIN USE CACHE IN TXT!")
            except:
                get_new_cache(res['result']['response']['signature'])
        else:
            logging.getLogger("error_logger").error('ERROR SIGNIN_agent SOMETHING WHEN WRONG ' + json.dumps(res))

    except Exception as e:
        logging.getLogger("error_logger").error('ERROR SIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    try:
        return 'login' in res_user['result']['response']['co_agent_frontend_security']
    except:
        return False

def get_new_cache(signature):
    try:
        logging.getLogger("info_logger").error("ERROR GENERATE NEW CACHE!")
        # airline
        data = {'provider_type': 'airline'}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_destinations",
            "signature": signature
        }

        res_destination_airline = util.send_request(url=url + 'content', data=data, headers=headers, method='POST', timeout=60)
        try:
            if res_destination_airline['result']['error_code'] == 0:
                pass
            else:
                logging.getLogger("info_logger").info("ERROR GET CACHE FROM DESTINATION TRAIN AUTOCOMPLETE" + res_destination_airline['result']['error_msg'] + '\n' + traceback.format_exc())
        except Exception as e:
            logging.getLogger("info_logger").info("ERROR GET CACHE FROM HOTEL SEARCH AUTOCOMPLETE" + json.dumps(res_destination_airline) + '\n' + str(e) + '\n' + traceback.format_exc())
            pass
        data = {'provider_type': 'train'}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_destinations",
            "signature": signature
        }

        res_destination_train = util.send_request(url=url + 'content', data=data, headers=headers, method='POST', timeout=60)
        try:
            destination_train = []
            if res_destination_train['result']['error_code'] == 0:
                for country in res_destination_train['result']['response']:
                    for destination in country['destinations']:
                        destination_train.append({
                            'name': destination['name'],
                            'code': destination['code'],
                            'country': country['name'],
                            'city': destination['city']
                        })
                file = open(var_log_path() + "train_cache_data.txt", "w+")
                file.write(json.dumps(destination_train))
                file.close()
            else:
                logging.getLogger("info_logger").info("ERROR GET CACHE FROM TRAIN SEARCH AUTOCOMPLETE" + res_destination_train['result']['error_msg'] + '\n' + traceback.format_exc())
        except Exception as e:
            logging.getLogger("info_logger").info("ERROR GET CACHE FROM TRAIN SEARCH AUTOCOMPLETE" + json.dumps(res_destination_train) + '\n' + str(e) + '\n' + traceback.format_exc())
            pass

        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_countries",
            "signature": signature
        }

        res_country_airline = util.send_request(url=url + 'content', data=data, headers=headers, method='POST', timeout=60)
        try:
            if res_country_airline['result']['error_code'] == 0:
                pass
            else:
                logging.getLogger("info_logger").info("ERROR GET CACHE FROM COUNTRY AIRLINE AUTOCOMPLETE" + res_country_airline['result']['error_msg'] + '\n' + traceback.format_exc())
        except Exception as e:
            logging.getLogger("info_logger").info("ERROR GET CACHE FROM COUNTRY AIRLINE AUTOCOMPLETE" + json.dumps(res_country_airline) + '\n' + str(e) + '\n' + traceback.format_exc())
            pass
        # hotel
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search_autocomplete",
            "signature": signature
        }

        data = {
            "name": '',
            "limit": 999999999999
        }

        res_cache_hotel = util.send_request(url=url + 'booking/hotel', data=data, headers=headers, method='POST', timeout=120)
        try:
            if res_cache_hotel['result']['error_code'] == 0:
                file = open(var_log_path() + "hotel_cache_data.txt", "w+")
                file.write(res_cache_hotel['result']['response'])
                file.close()
        except Exception as e:
            logging.getLogger("info_logger").info("ERROR GET CACHE FROM HOTEL SEARCH AUTOCOMPLETE" + json.dumps(res_cache_hotel) + '\n' + str(
                    e) + '\n' + traceback.format_exc())
            pass

        # visa odoo12
        data = {
            'provider': 'rodextrip_visa'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            "signature": signature
        }

        res_config_visa = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST', timeout=60)
        try:
            if res_config_visa['result']['error_code'] == 0:
                pass
            else:
                logging.getLogger("info_logger").info("ERROR GET CACHE FROM VISA AUTOCOMPLETE" + res_config_visa['result']['error_msg'] + '\n' + traceback.format_exc())
        except Exception as e:
            logging.getLogger("info_logger").info("ERROR GET CACHE FROM VISA AUTOCOMPLETE" + json.dumps(res_config_visa) + '\n' + str(e) + '\n' + traceback.format_exc())
            pass
        #

        # issuedoffline
        data = {
            'provider': 'rodextrip_issued_offline'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            "signature": signature
        }

        res_config_issued_offline = util.send_request(url=url + 'booking/issued_offline', data=data, headers=headers,
                                                      method='POST', timeout=60)
        try:
            if res_config_issued_offline['result']['error_code'] == 0:
                pass
            else:
                logging.getLogger("info_logger").info("ERROR GET CACHE FROM ISSUED OFFLINE AUTOCOMPLETE" + res_config_issued_offline['result']['error_msg'] + '\n' + traceback.format_exc())
        except Exception as e:
            logging.getLogger("info_logger").info("ERROR GET CACHE FROM ISSUED OFFLINE AUTOCOMPLETE" + json.dumps(res_config_issued_offline) + '\n' + str(e) + '\n' + traceback.format_exc())
            pass
        # return res

        # train
        # data = {}
        # headers = {
        #     "Accept": "application/json,text/html,application/xml",
        #     "Content-Type": "application/json",
        #     "action": "get_origins",
        #     "signature": request.session['signature'],
        # }
        #
        # res_origin_train = util.send_request(url=url + 'train/session', data=data, headers=headers, method='POST')

        # activity
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            "signature": signature
        }
        res_config_activity = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST', timeout=120)

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search_autocomplete",
            "signature": signature
        }

        data = {
            "name": '',
            "limit": 9999
        }

        res_cache_activity = util.send_request(url=url + 'booking/activity', data=data, headers=headers, method='POST', timeout=120)
        try:
            if res_cache_activity['result']['error_code'] == 0:
                file = open(var_log_path() + "activity_cache_data.txt", "w+")
                file.write(json.dumps(res_cache_activity['result']['response']))
                file.close()
        except Exception as e:
            logging.getLogger("info_logger").info(
                "ERROR GET CACHE FROM ACTIVITY SEARCH AUTOCOMPLETE" + json.dumps(res_cache_activity) + '\n' + str(
                    e) + '\n' + traceback.format_exc())
            pass

        # tour
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            "signature": signature,
        }
        res_config_tour = util.send_request(url=url + 'booking/tour', data=data, headers=headers,
                                                method='POST', timeout=120)

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search_autocomplete",
            "signature": signature
        }

        data = {
            "name": '',
            "limit": 9999
        }

        res_cache_tour = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=120)
        try:
            if res_cache_tour['result']['error_code'] == 0:
                file = open(var_log_path() + "tour_cache_data.txt", "w+")
                file.write(json.dumps(res_cache_tour['result']['response']))
                file.close()
        except Exception as e:
            logging.getLogger("info_logger").info(
                "ERROR GET CACHE FROM TOUR SEARCH AUTOCOMPLETE" + json.dumps(res_cache_tour) + '\n' + str(
                    e) + '\n' + traceback.format_exc())
            pass

        # check sebelum masukkan ke cache
        try:
            if res_country_airline['result']['error_code'] == 0:
                logging.getLogger("info_logger").info(
                    "ERROR GET CACHE FROM AIRLINE COUNTRY GATEWAY" + json.dumps(res_country_airline))

            if res_destination_airline['result']['error_code'] == 0:
                logging.getLogger("info_logger").info(
                    "ERROR GET CACHE FROM AIRLINE DESTINATION GATEWAY" + json.dumps(res_country_airline))
            if res_config_visa['result']['error_code'] == 0:
                logging.getLogger("info_logger").info(
                    "ERROR GET CACHE FROM VISA CONFIG GATEWAY" + json.dumps(res_config_visa))
            if res_config_issued_offline['result']['error_code'] == 0:
                logging.getLogger("info_logger").info(
                    "ERROR GET CACHE FROM ISSUED OFFLINE CONFIG GATEWAY" + json.dumps(res_config_issued_offline))
            if res_config_activity['result']['error_code'] == 0:
                logging.getLogger("info_logger").info(
                    "ERROR GET CACHE FROM ACTIVITY CONFIG GATEWAY" + json.dumps(res_config_activity))
            if res_config_tour['result']['error_code'] == 0:
                logging.getLogger("info_logger").info(
                    "ERROR GET CACHE FROM TOUR CONFIG GATEWAY" + json.dumps(res_config_tour))
        except Exception as e:
            logging.getLogger("info_logger").info(
                "ERROR LOG CACHE \n" + str(e) + '\n' + traceback.format_exc())
        res = {
            'result': {
                'response': {
                    'visa': res_config_visa.get('result') and res_config_visa['result']['response'] or False,
                # belum di install
                    'issued_offline': res_config_issued_offline.get('result') and res_config_issued_offline['result']['response'] or False,  # belum di install
                    # 'train': res_origin_train['result']['response'],
                    'activity': res_config_activity.get('result') and res_config_activity['result']['response'] or False,
                    'tour': res_config_tour.get('result') and res_config_tour['result']['response'] or False,
                    'airline': {
                        'country': res_country_airline.get('result') and res_country_airline['result']['response'] or False,
                        'destination': res_destination_airline.get('result') and res_destination_airline['result']['response'] or False
                    },
                }
            }

        }

        # cache airline popular
        file = open(var_log_path() + "popular_destination_airline_cache.txt", "r")
        popular_airline = json.loads(file.read())
        file.close()
        popular = []
        average = []
        for country in res_destination_airline['result']['response']:
            for destination in country['destinations']:
                try:
                    if popular_airline.get(destination['code']) == True:
                        popular.append({
                            'name': destination['name'],
                            'code': destination['code'],
                            'city': destination['city'],
                            'country': country['name']
                        })
                    else:
                        average.append({
                            'name': destination['name'],
                            'code': destination['code'],
                            'city': destination['city'],
                            'country': country['name']
                        })
                except:
                    average.append({
                        'name': destination['name'],
                        'code': destination['code'],
                        'city': destination['city'],
                        'country': country['name']
                    })
        popular = popular + average

        file = open(var_log_path() + "airline_destination.txt", "w+")
        file.write(json.dumps(popular))
        file.close()

        file = open(var_log_path() + "cache_version.txt", "r")
        cache_version = int(file.read()) + 1
        file.close()
        file = open(var_log_path() + "version" + str(cache_version) + ".txt", "w+")
        file.write(json.dumps(res))
        file.close()
        file = open(var_log_path() + "cache_version.txt", "w+")
        file.write(str(cache_version))
        file.close()


        return True
    except:
        return False

    # cache airline popular

def update_cache(request):
    try:
        get_new_cache(request.POST['signature'])

        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success update cache!',
                'response': ''
            }
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        res = {
            'result': {
                'error_code': -1,
                'error_msg': 'Error update cache!',
                'response': ''
            }
        }
    return res

def get_url_static_path():
    return static_path_url

def get_customer_list(request):
    try:
        upper = 200
        lower = 0
        #define per product DEFAULT 0 - 200 / AMBIL SEMUA PASSENGER
        #check jos
        if request.POST['passenger_type'] == 'booker':
            passenger = 'book'
        else:
            passenger = 'psg'
        if request.POST['product'] == 'airline' or request.POST['product'] == 'visa' or request.POST['product'] == 'tour':
            if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'booker':
                upper = 200
                lower = 12
            elif request.POST['passenger_type'] == 'child':
                upper = 11
                lower = 2
            elif request.POST['passenger_type'] == 'infant':
                upper = 2
                lower = 0
        elif request.POST['product'] == 'hotel':
            if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'booker':
                upper = 200
                lower = 12
            elif request.POST['passenger_type'] == 'child':
                upper = 11
                lower = 0
        elif request.POST['product'] == 'activity':
            upper = int(request.POST['maxAge'])
            lower = int(request.POST['minAge'])
        elif request.POST['product'] == 'train':
            if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'booker':
                upper = 200
                lower = 3
            elif request.POST['passenger_type'] == 'infant':
                upper = 2
                lower = 0

        data = {
            'name': request.POST['name'],
            'upper': upper,
            'lower': lower,
            'type': passenger,
            'email': '',
            'cust_code': ''
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_list",
            "signature": request.POST['signature']
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            counter = 0
            for pax in res['result']['response']:
                try:
                    if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MRS'
                        else:
                            title = 'MISS'
                    elif pax['gender'] == 'female':
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MS'
                        else:
                            title = 'MISS'
                    else:
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MR'
                        else:
                            title = 'MSTR'
                    pax.update({
                        'sequence': counter,
                        'title': title
                    })
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2], month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2], month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2], month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2], month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    counter += 1
                except:
                    pass
            logging.getLogger("info_logger").info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def update_customer_list(request):
    try:
        upper = 200
        lower = 0
        #define per product DEFAULT 0 - 200 / AMBIL SEMUA PASSENGER
        #check jos
        passenger = 'psg'
        data = {
            'name': '',
            'upper': upper,
            'lower': lower,
            'type': passenger,
            'email': '',
            'cust_code': request.POST['cust_code']
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_list",
            "signature": request.POST['signature']
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            counter = 0
            for pax in res['result']['response']:
                try:
                    if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MRS'
                        else:
                            title = 'MISS'
                    elif pax['gender'] == 'female':
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MS'
                        else:
                            title = 'MISS'
                    else:
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MR'
                        else:
                            title = 'MSTR'
                    pax.update({
                        'sequence': counter,
                        'title': title
                    })
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2], month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2], month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2], month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2], month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    counter += 1
                except:
                    pass
            #ganti cache
            for pax in request.session.get('cache_passengers'):
                if pax['seq_id'] == request.POST['cust_code']:
                    pax = res['result']['response'][0]
                    break
            res['result']['response'] = request.session.get('cache_passengers')
            logging.getLogger("info_logger").info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("get_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def create_customer(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        pax = json.loads(request.POST['passenger'])
        image = {
            'files_attachment': 'avatar',
            'files_attachment_edit1': 'passport',
            'files_attachment_edit2': 'ktp',
            'files_attachment_edit3': 'sim',
            'files_attachment_edit4': 'other'
        }
        image_list = json.loads(request.POST['image_list'])
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0]),
        })
        for img in image_list:
            if img[2] == 'files_attachment':
                pax.update({
                    'face_image': [img[0], img[1]]
                })
        for identity in pax['identity']:
            image_selected = []
            for img in image_list:
                if image[img[2]] == identity:
                    image_selected.append([img[0], img[1]])
            pax['identity'][identity].update({
                'identity_image': image_selected
            })
            try:
                pax['identity'][identity].update({
                    'identity_expdate': '%s-%s-%s' % (
                        pax['identity'][identity]['identity_expdate'].split(' ')[2], month[pax['identity'][identity]['identity_expdate'].split(' ')[1]],
                        pax['identity'][identity]['identity_expdate'].split(' ')[0])
                })
            except:
                pass
            try:
                for country in response['result']['response']['airline']['country']:
                    if pax['identity'][identity]['identity_country_of_issued_name'] == country['name']:
                        pax['identity'][identity]['identity_country_of_issued_code'] = country['code']
                        break
            except:
                pax['identity'][identity]['identity_country_of_issued_code'] = ''
        data = {
            'passengers': pax
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_customer",
            "signature": request.POST['signature']
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:

            logging.getLogger("info_logger").info("CREATE CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("create_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def update_customer(request):
    try:
        image = {
            'files_attachment_edit': 'avatar',
            'files_attachment_edit1': 'passport',
            'files_attachment_edit2': 'ktp',
            'files_attachment_edit3': 'sim',
            'files_attachment_edit4': 'other'
        }
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        passenger = json.loads(request.POST['data'])
        if passenger['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if passenger['nationality_name'] == country['name']:
                    passenger['nationality_code'] = country['code']
                    break

        for img in passenger['image']:
            if img[2] == 'files_attachment_edit':
                if 'face_image' in passenger and img[1] == 4:
                    passenger.update({
                        'face_image': [img[0], img[1]]
                    })
                else:
                    passenger.update({
                        'face_image': [img[0], img[1]]
                    })

        for identity in passenger['identity']:
            image_list = []
            for img in passenger['image']:
                if image[img[2]] == identity:
                    image_list.append([img[0], img[1]])
                elif image[img[2]] == 'files_attachment_edit':
                    passenger.update({
                        'face_image': [[img[0], img[1]]]
                    })
            passenger['identity'][identity].update({
                'identity_image': image_list
            })
            passenger['identity'][identity].update({
                'identity_expdate': '%s-%s-%s' % (
                    passenger['identity'][identity]['identity_expdate'].split(' ')[2], month[passenger['identity'][identity]['identity_expdate'].split(' ')[1]],
                    passenger['identity'][identity]['identity_expdate'].split(' ')[0])
            })
            for country in response['result']['response']['airline']['country']:
                if passenger['identity'][identity]['identity_country_of_issued_name'] == country['name']:
                    passenger['identity'][identity]['identity_country_of_issued_code'] = country['code']
                    break
        passenger.pop('image')
        data = {
            'passengers': passenger
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_customer",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())


    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            passenger_cache = request.session['cache_passengers']
            for pax in passenger_cache:
                if pax['seq_id'] == res['result']['response']['seq_id']:
                    pax.update(res['result']['response'])
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2],
                                month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    elif pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    elif pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    elif pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    break
            request.session['cache_passengers'] = passenger_cache
            logging.getLogger("info_logger").info("SUCCESS update_customer_agent SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("update_customer_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def add_passenger_cache(request):
    check = 0
    if 'cache_passengers' in request.session._session:
        passengers = request.session['cache_passengers']
        add_pax = json.loads(request.POST['passenger'])
        for pax in passengers:
            if pax['seq_id'] == add_pax['seq_id']:
                check = 1
        if check == 0:
            passengers.append(add_pax)
    else:
        passengers = [json.loads(request.POST['passenger'])]
    request.session['cache_passengers'] = passengers
    if check == 0:
        res = {
            'result': {
                'error_msg': 'Success',
                'error_code': 0,
                'response': ''
            }
        }
    else:
        res = {
            'result': {
                'error_msg': 'Error, Already add this passenger',
                'error_code': 1,
                'response': ''
            }
        }
    return res

def del_passenger_cache(request):
    passenger = request.session['cache_passengers']
    passenger.pop(int(request.POST['index']))
    request.session['cache_passengers'] = passenger
    res = {
        'result': {
            'error_msg': '',
            'error_code': 0,
            'response': passenger
        }
    }
    return res

def get_passenger_cache(request):
    if 'cache_passengers' in request.session._session:
        res = {
            'result': {
                'error_msg': '',
                'error_code': 0,
                'response': request.session['cache_passengers']
            }
        }
        return res
    else:
        res = {
            'result': {
                'error_msg': '',
                'error_code': 0,
                'response': []
            }
        }
        return res
#BACKEND GA PAKE

def get_agent_booking(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_agent_booking",
        "signature": request.session['signature'],
    }
    data = {
        "co_uid": int(request.session['co_uid']),
        "offset": int(request.POST['offset']),
        "limit": 80,
        "transport_type": '',
        "state": ''
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_top_up(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_top_up",
        "signature": request.session['signature'],
    }
    data = {
        "co_uid": int(request.session['co_uid']),
        "offset": int(request.POST['offset']),
        "limit": 80
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_top_up_amount(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_top_up_amount",
        "signature": request.session['signature'],
    }
    data = {}
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def create_top_up(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_top_up",
        "signature": request.session['signature'],
    }

    data = {
        "amount_id": request.POST['amount_id'],
        "qty": int(request.POST['qty']),
        "agent_id": int(request.session['agent']['id']),
        "unique_amount": int(request.POST['unique_amount'])
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def top_up_payment(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "top_up_payment",
        "signature": request.session['signature'],
    }

    data = {
        "token": request.POST['token'],
        "acq_id": int(request.POST['acq_id'])
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_merchant_info(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_merchant_info",
        "signature": request.session['signature'],
    }

    data = {}
    res = util.send_request(url=url + 'payment/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def request_va(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "request_va",
        "signature": request.session['signature'],
    }

    data = {}
    res = util.send_request(url=url + 'payment/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def request_inv_va(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "request_inv_va",
        "signature": request.session['signature'],
    }

    data = {
        'amount': '1000.00',
        'currency_id': 'IDR',
        'bank_code': '013',
        'order_id': 'ANSK128329',
        'agent_id': int(request.session['agent']['id'])
    }
    res = util.send_request(url=url + 'payment/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_agent_passenger(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_agent_passenger",
        "signature": request.session['signature'],
    }

    data = {
        "agent_id": request.session['agent']['id'],
        "co_uid": request.session['co_uid'],
        "search_param": 'by_string',
        "search_value": request.POST['search_value']
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    try:
        if res['error_code'] == 0:
            res.update({
                'response': json.loads(res['response'])
            })
            counter = 0
            for response in res['response']['result']:
                if request.POST['pax_type'] == '':
                    response.update({
                        'sequence': counter
                    })
                elif response['pax_type'] == request.POST['pax_type']:
                    response.update({
                        'sequence': counter
                    })
                    if response['birth_date']:
                        response.update({
                            'birth_date': '%s %s %s' % (
                            response['birth_date'].split('-')[2], month[response['birth_date'].split('-')[1]],
                            response['birth_date'].split('-')[0]),
                        })
                    counter += 1
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res