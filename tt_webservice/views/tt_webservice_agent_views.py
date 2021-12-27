from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR, parser
from datetime import datetime
from ..static.tt_webservice.url import *
from dateutil.relativedelta import *
import json
from .tt_webservice_views import *
from .tt_webservice import *
from ..views import tt_webservice_airline_views as airline
import logging
import traceback
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
            res = signin(request)
        elif req_data['action'] == 'signin_btc':
            res = signin_btc(request)
        elif req_data['action'] == 'delete_session':
            res = delete_session(request)
        elif req_data['action'] == 'static_path_url_server':
            res = get_url_static_path()
        elif req_data['action'] == 'get_customer_list':
            res = get_customer_list(request)
        elif req_data['action'] == 'update_cache_data':
            res = update_cache_data(request)
        elif req_data['action'] == 'update_cache_image':
            res = update_cache_image(request)
        elif req_data['action'] == 'create_customer':
            res = create_customer(request)
        elif req_data['action'] == 'update_customer':
            res = update_customer(request)
        elif req_data['action'] == 'update_customer_list':
            res = update_customer_list(request)
        elif req_data['action'] == 'get_automatic_booker':
            res = get_automatic_booker(request)
        elif req_data['action'] == 'add_passenger_cache':
            res = add_passenger_cache(request)
        elif req_data['action'] == 'del_passenger_cache':
            res = del_passenger_cache(request)
        elif req_data['action'] == 'get_passenger_cache':
            res = get_passenger_cache(request)
        elif req_data['action'] == 'get_customer_parent':
            res = get_customer_parent(request)
        elif req_data['action'] == 'activate_corporate_mode':
            res = activate_corporate_mode(request)
        elif req_data['action'] == 'deactivate_corporate_mode':
            res = deactivate_corporate_mode(request)
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

        "co_user": request.POST.get('username') or user_default,
        "co_password": request.POST.get('password') or password_default,
        # "co_user": user_default,  # request.POST['username'],
        # "co_password": password_default, #request.POST['password'],
        # "co_uid": ""
    }
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 10)
    try:
        if res['result']['error_code'] == 0:
            for key in reversed(list(request.session._session.keys())):
                if key != '_language':
                    del request.session[key]
            request.session.create()
            request.session.set_expiry(3 * 60 * 60)  # jam detik menit
            set_session(request, 'signature', res['result']['response']['signature'])
            set_session(request, 'username', request.POST.get('username') or user_default)
            set_session(request, 'password', request.POST.get('password') or password_default)

            if request.POST.get('keep_me_signin') == 'true':
                set_session(request, 'keep_me_signin', True)
            else:
                set_session(request, 'keep_me_signin', False)
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_account",
                "signature": res['result']['response']['signature']
            }
            url_request = url + 'account'
            res_user = send_request_api(request, url_request, headers, data, 'POST')
            # pakai kalo template PER USER
            # user_template = UserTemplate().get_data_by_id(request.POST['username'], True) #true buat rodextrip false buat tors
            # res_user['result']['response'].update({
            #     'logo_url': user_template.logo_url,
            #     'name': user_template.name,
            #     'template': user_template.template_id,
            #     'desc': user_template.desc
            # })
            if 'login' in res_user['result']['response']['co_agent_frontend_security']:
                set_session(request, 'user_account', res_user['result']['response'])
                try:
                    if res['result']['error_code'] == 0:
                        data = {}
                        headers = {
                            "Accept": "application/json,text/html,application/xml",
                            "Content-Type": "application/json",
                            "action": "get_provider_type_list",
                            "signature": res['result']['response']['signature']
                        }
                        url_request = url + 'content'
                        provider_type = send_request_api(request, url_request, headers, data, 'POST')
                        try:
                            if provider_type['result']['error_code'] == 0:
                                provider_type_list = []
                                for provider in provider_type['result']['response']['provider_type_list']:
                                    provider_type_list.append(provider['code'])
                                set_session(request, 'provider', provider_type_list)
                            else:
                                # request.session['provider'] = ['airline', 'train', 'visa', 'activity', 'tour', 'hotel']
                                set_session(request, 'provider', [])
                        except:
                            set_session(request, 'provider', [])
                        _logger.info("SIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
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
                except Exception as e:
                    get_new_cache(res['result']['response']['signature'])
                    request.session.create()
            else:
                res_user['result']['error_code'] = 500
                res_user['result']['error_msg'] = 'Permission Denied'

        else:
            _logger.error('ERROR SIGNIN_agent SOMETHING WHEN WRONG ' + json.dumps(res))

    except Exception as e:
        _logger.error('ERROR SIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    try:
        return res_user
    except:
        if res['result']['error_code'] == 4002:
            res['result']['error_msg'] = 'User and password is not match'
            return res
        else:
            return res

def delete_session(request):
    request.session.set_expiry(0)
    request.session.modified = True
    if request.session._session:
        for key in reversed(list(request.session._session.keys())):
            if key != '_language':
                del request.session[key]
    return 0

def signin_btc(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signin",
        "signature": ''
    }

    try:
        data = {
            "user": user_global,
            "password": password_global,
            "api_key":  api_key,

            "co_user": request.POST.get('username') or user_default,
            "co_password": request.POST.get('password') or password_default,
            # "co_user": user_default,  # request.POST['username'],
            # "co_password": password_default, #request.POST['password'],
            # "co_uid": ""
        }
    except Exception as e:
        _logger.error('ERROR get user or password for btc login\n' + str(e) + '\n' + traceback.format_exc())
    if request.POST.get('g-recaptcha-response'):
        check_captcha(request)
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 10)
    try:
        if res['result']['error_code'] == 0:
            request.session.create()
            request.session.set_expiry(3 * 60 * 60)  # jam detik menit
            set_session(request, 'signature', res['result']['response']['signature'])
            set_session(request, 'username', request.POST.get('username') or user_default)
            set_session(request, 'password', request.POST.get('password') or password_default)
            if request.POST.get('keep_me_signin') == 'true':
                set_session(request, 'keep_me_signin', True)
            elif request.POST.get('keep_me_signin') == 'false':
                set_session(request, 'keep_me_signin', False)
            else:
                set_session(request, 'keep_me_signin', True) #default b2c
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_account",
                "signature": res['result']['response']['signature']
            }
            url_request = url + 'account'
            res_user = send_request_api(request, url_request, headers, data, 'POST')
            # pakai kalo template PER USER
            # user_template = UserTemplate().get_data_by_id(request.POST['username'], True) #true buat rodextrip false buat tors
            # res_user['result']['response'].update({
            #     'logo_url': user_template.logo_url,
            #     'name': user_template.name,
            #     'template': user_template.template_id,
            #     'desc': user_template.desc
            # })
            res_user['result']['response']['signature'] = res['result']['response']['signature']
            if "login" in res_user['result']['response']['co_agent_frontend_security']:
                set_session(request, 'user_account', res_user['result']['response'])
            try:
                if res['result']['error_code'] == 0:
                    data = {}
                    headers = {
                        "Accept": "application/json,text/html,application/xml",
                        "Content-Type": "application/json",
                        "action": "get_provider_type_list",
                        "signature": res['result']['response']['signature']
                    }
                    url_request = url + 'content'
                    provider_type = send_request_api(request, url_request, headers, data, 'POST')
                    try:
                        if provider_type['result']['error_code'] == 0:
                            provider_type_list = []
                            for provider in provider_type['result']['response']['provider_type_list']:
                                provider_type_list.append(provider['code'])
                            set_session(request, 'provider', provider_type_list)
                        else:
                            # request.session['provider'] = ['airline', 'train', 'visa', 'activity', 'tour', 'hotel']
                            set_session(request, 'provider', [])
                    except:
                        set_session(request, 'provider', [])
                    _logger.info("SIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
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
            _logger.error('ERROR SIGNIN_agent SOMETHING WHEN WRONG ' + json.dumps(res))

    except Exception as e:
        _logger.error('ERROR SIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    try:
        res_user['result']['response']['provider'] = provider_type_list
        return res_user
    except:
        return res

def get_new_cache(signature, type='all'):
    try:
        if type == 'all' or type == 'data':
            logging.getLogger("info_logger").error("ERROR GENERATE NEW CACHE!")
            # airline
            data = {'provider_type': 'airline'}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_destinations",
                "signature": signature
            }
            url_request = url + 'content'
            res_destination_airline = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_destination_airline['result']['error_code'] == 0:
                    res_destination_airline = res_destination_airline['result']['response']
                else:
                    res_destination_airline = False
                    _logger.info("ERROR GET CACHE FROM DESTINATION TRAIN AUTOCOMPLETE " + json.dumps(res_destination_airline) + '\n' + traceback.format_exc())
            except Exception as e:
                res_destination_airline = False
                _logger.info("ERROR GET CACHE FROM HOTEL SEARCH AUTOCOMPLETE " + json.dumps(res_destination_airline) + '\n' + str(e) + '\n' + traceback.format_exc())
            data = {'provider_type': 'train'}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_destinations",
                "signature": signature
            }
            url_request = url + 'content'
            res_destination_train = send_request_api({}, url_request, headers, data, 'POST', 60)
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
                    write_cache_with_folder(destination_train, "train_cache_data")
                else:
                    _logger.info("ERROR GET CACHE FROM TRAIN SEARCH AUTOCOMPLETE " + json.dumps(res_destination_train)  + '\n' + traceback.format_exc())
            except Exception as e:
                _logger.info("ERROR GET CACHE FROM TRAIN SEARCH AUTOCOMPLETE " + json.dumps(res_destination_train) + '\n' + str(e) + '\n' + traceback.format_exc())
                pass

            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_countries",
                "signature": signature
            }
            url_request = url + 'content'
            res_country_airline = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_country_airline['result']['error_code'] == 0:
                    res_country_airline = res_country_airline['result']['response']
                else:
                    res_country_airline = False
                    _logger.info("ERROR GET CACHE FROM COUNTRY AIRLINE AUTOCOMPLETE " + json.dumps(res_country_airline) + '\n' + traceback.format_exc())
            except Exception as e:
                res_country_airline = False
                _logger.info("ERROR GET CACHE FROM COUNTRY AIRLINE AUTOCOMPLETE " + json.dumps(res_country_airline) + '\n' + str(e) + '\n' + traceback.format_exc())
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
            url_request = url + 'booking/hotel'
            res_cache_hotel = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res_cache_hotel['result']['error_code'] == 0:
                    write_cache_with_folder(json.loads(res_cache_hotel['result']['response']), "hotel_cache_data")
            except Exception as e:
                _logger.info("ERROR GET CACHE FROM HOTEL SEARCH AUTOCOMPLETE " + json.dumps(res_cache_hotel) + '\n' + str(e) + '\n' + traceback.format_exc())
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
            url_request = url + 'booking/visa'
            res_config_visa = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_config_visa['result']['error_code'] == 0:
                    res_config_visa = res_config_visa['result']['response']
                else:
                    res_config_visa = False
                    _logger.info("ERROR GET CACHE FROM VISA AUTOCOMPLETE " + json.dumps(res_config_visa) + '\n' + traceback.format_exc())
            except Exception as e:
                res_config_visa = False
                _logger.info("ERROR GET CACHE FROM VISA AUTOCOMPLETE " + json.dumps(res_config_visa) + '\n' + str(e) + '\n' + traceback.format_exc())
                pass
            #

            # passport odoo12
            data = {
                'provider': 'rodextrip_passport'
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature
            }
            url_request = url + 'booking/passport'
            res_config_passport = send_request_api({}, url_request, headers, data, 'POST', 60)

            try:
                if res_config_passport['result']['error_code'] == 0:
                    res_config_passport = res_config_passport['result']['response']
                else:
                    res_config_passport = False
                    _logger.info(
                        "ERROR GET CACHE FROM PASSPORT AUTOCOMPLETE " + json.dumps(res_config_passport) + '\n' + traceback.format_exc())
            except Exception as e:
                res_config_passport = False
                _logger.info(
                    "ERROR GET CACHE FROM VISA AUTOCOMPLETE " + json.dumps(res_config_passport) + '\n' + str(e) + '\n' + traceback.format_exc())
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
            url_request = url + 'booking/issued_offline'
            res_config_issued_offline = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_config_issued_offline['result']['error_code'] == 0:
                    res_config_issued_offline = res_config_issued_offline['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM ISSUED OFFLINE AUTOCOMPLETE " + json.dumps(res_config_issued_offline) + '\n' + traceback.format_exc())
                    res_config_issued_offline = False
            except Exception as e:
                res_config_issued_offline = False
                _logger.info("ERROR GET CACHE FROM ISSUED OFFLINE AUTOCOMPLETE " + json.dumps(res_config_issued_offline) + '\n' + str(e) + '\n' + traceback.format_exc())
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
            url_request = url + 'booking/activity'
            res_config_activity = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res_config_activity['result']['error_code'] == 0:
                    res_config_activity = res_config_activity['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM ACTIVITY " + json.dumps(res_config_activity) + '\n' + traceback.format_exc())
                    res_config_activity = False
            except Exception as e:
                res_config_activity = False
                _logger.info("ERROR GET CACHE FROM ACTIVITY " + json.dumps(res_config_activity) + '\n' + str(e) + '\n' + traceback.format_exc())

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
            url_request = url + 'booking/activity'
            res_cache_activity = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res_cache_activity['result']['error_code'] == 0:
                    write_cache_with_folder(res_cache_activity['result']['response'], "activity_cache_data")
            except Exception as e:
                _logger.info(
                    "ERROR GET CACHE FROM ACTIVITY SEARCH AUTOCOMPLETE " + json.dumps(res_cache_activity) + '\n' + str(
                        e) + '\n' + traceback.format_exc())

            # tour
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature,
            }
            url_request = url + 'booking/tour'
            res_config_tour = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res_config_tour['result']['error_code'] == 0:
                    res_config_tour = res_config_tour['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_config_tour) + '\n' + traceback.format_exc())
                    res_config_tour = False
            except Exception as e:
                res_config_tour = False
                _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_config_tour) + '\n' + str(e) + '\n' + traceback.format_exc())

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
            url_request = url + 'booking/tour'
            res_cache_tour = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res_cache_tour['result']['error_code'] == 0:
                    write_cache_with_folder(res_cache_tour['result']['response'], "tour_cache_data")
            except Exception as e:
                _logger.info(
                    "ERROR GET CACHE FROM TOUR SEARCH AUTOCOMPLETE " + json.dumps(res_cache_tour) + '\n' + str(
                        e) + '\n' + traceback.format_exc())
                pass

            #ppob
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature
            }

            data = {}

            url_request = url + 'booking/ppob'
            res_cache_ppob = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res_cache_ppob['result']['error_code'] == 0:
                    res_cache_ppob = res_cache_ppob['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_cache_ppob) + '\n' + traceback.format_exc())
                    res_cache_ppob = False
            except Exception as e:
                res_cache_ppob = False
                _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_cache_ppob) + '\n' + str(e) + '\n' + traceback.format_exc())

            res = {
                'result': {
                    'response': {
                        'visa': res_config_visa,
                        'passport': res_config_passport,
                        'issued_offline': res_config_issued_offline,  # belum di install
                        # 'train': res_origin_train['result']['response'],
                        'activity': res_config_activity,
                        'tour': res_config_tour,
                        'airline': {
                            'country': res_country_airline,
                            'destination': res_destination_airline
                        },
                        'ppob': res_cache_ppob
                    }
                }

            }

            # cache airline popular
            file = read_cache_with_folder_path("popular_destination_airline_cache", 90911)
            if file:
                popular_airline = file
                popular = []
                average = []
                for country in res_destination_airline:
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

            write_cache_with_folder(popular, "airline_destination")
            file = read_cache_with_folder_path("cache_version", 90911)
            if file:
                cache_version = int(file) + 1
            else:
                cache_version = 1
            write_cache_with_folder(res, "version" + str(cache_version))
            write_cache_with_folder(cache_version, "cache_version")

            # cache tanggal libur
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_public_holiday",
                "signature": signature,
            }
            data = {
                'country_id': 100,
                'start_date': datetime.now().strftime('%Y-%m-%d'),
                'end_date': (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d'),
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            write_cache_with_folder(res, "get_holiday_cache")
            # remove cache airline
            try:
                os.remove("/var/log/django/file_cache/get_list_provider.txt")
            except:
                pass
            try:
                os.remove("/var/log/django/file_cache/get_list_provider_data.txt")
            except:
                pass
            try:
                os.remove("/var/log/django/file_cache/get_airline_carriers.txt")
                airline.get_carriers('', signature)
            except:
                airline.get_carriers('', signature)
                pass
            try:
                os.remove("/var/log/django/file_cache/get_airline_active_carriers.txt")
                airline.get_carriers_search('', signature)
            except:
                airline.get_carriers_search('', signature)
                pass

            try:
                file = open("tt_webservice/static/tt_webservice/phc_city.json", "r")
                data_kota = json.loads(file.read())
                file.close()
            except:
                data_kota = {}
            provider = 'phc'
            additional_url = 'booking/'
            additional_url += 'phc'
            data = {
                'provider': provider
            }
            action = 'get_config_vendor'
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    res['result']['response']['kota'] = data_kota
                    write_cache_with_folder(res, "medical_cache_data_%s" % provider)
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE medical " + provider + ' ' + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())

            try:
                file = open("tt_webservice/static/tt_webservice/periksain_city.json", "r")
                data_kota = json.loads(file.read())
                file.close()
            except:
                data_kota = {}
            provider = 'periksain'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    res['result']['response'] = {
                        "carriers_code": res['result']['response'],
                        "kota": data_kota
                    }
                    write_cache_with_folder(res, "medical_cache_data_%s" % provider)
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE medical " + provider + ' ' + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())

            provider = 'medical'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    write_cache_with_folder(res, "medical_global_cache_data")
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE medical " + provider + ' ' + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())

            provider = 'swabexpress'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    write_cache_with_folder(res, "swab_express_cache_data")
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE swab express " + provider + ' ' + json.dumps(res) + '\n' + str(
                    e) + '\n' + traceback.format_exc())

            provider = 'labpintar'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    write_cache_with_folder(res, "lab_pintar_cache_data")
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE lab pintar " + provider + ' ' + json.dumps(res) + '\n' + str(
                    e) + '\n' + traceback.format_exc())

            provider = 'mitrakeluarga'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    response = copy.deepcopy(res)
                    response['result']['response'] = {}
                    # HOMECARE DULUAN
                    for rec in res['result']['response']:
                        if 'HC' in rec:
                            response['result']['response'][rec] = res['result']['response'][rec]
                    for rec in res['result']['response']:
                        if rec not in response['result']['response']:
                            response['result']['response'][rec] = res['result']['response'][rec]
                    write_cache_with_folder(response, "mitra_keluarga_cache_data")
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE mitra keluarga " + provider + ' ' + json.dumps(res) + '\n' + str(
                    e) + '\n' + traceback.format_exc())

            #bus
            data = {}
            action = "get_config"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": 'get_config',
                "signature": signature
            }
            url_request = url + 'booking/bus'
            res = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res['result']['error_code'] == 0:
                    res = res['result']['response']
                    write_cache_with_folder(res, "get_bus_config")
                    _logger.info("get_bus_config BUS RENEW SUCCESS SIGNATURE " + headers['signature'])
                else:
                    _logger.error('ERROR get_bus_config file\n' + str(e) + '\n' + traceback.format_exc())
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())

            #insurance
            data = {}

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": 'get_config',
                "signature": signature
            }
            url_request = url + 'booking/insurance'
            res = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res['result']['error_code'] == 0:
                    res = res
                    write_cache_with_folder(res, "insurance_cache_data")
                    _logger.info("get_bus_config INSURANCE RENEW SUCCESS SIGNATURE " + headers['signature'])
                else:
                    _logger.error('ERROR get_insurance_config file\n' + str(e) + '\n' + traceback.format_exc())
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())


        if type == 'all' or type == 'image':
            #banner
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_banner",
                "signature": signature,
            }
            data = {
                'type': 'big_banner'
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            if res['result']['error_code'] == 0:
                try:
                    empty_sequence = False
                    last_sequence = 0
                    for rec in res['result']['response']:
                        if rec['sequence'] == '':
                            empty_sequence = True
                        elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']): #check isi int atau tidak
                            last_sequence = int(rec['sequence'])
                    if empty_sequence:
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                last_sequence += 1
                                rec['sequence'] = last_sequence
                    res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                    write_cache_with_folder(res, "big_banner_cache")
                    _logger.info("big_banner RENEW SUCCESS SIGNATURE " + signature)
                except Exception as e:
                    _logger.error(
                        'ERROR big banner file \n' + str(e) + '\n' + traceback.format_exc())
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_banner",
                "signature": signature,
            }
            data = {
                'type': 'small_banner'
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            if res['result']['error_code'] == 0:
                try:
                    empty_sequence = False
                    last_sequence = 0
                    for rec in res['result']['response']:
                        if rec['sequence'] == '':
                            empty_sequence = True
                        elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']):  # check isi int atau tidak
                            last_sequence = int(rec['sequence'])
                    if empty_sequence:
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                last_sequence += 1
                                rec['sequence'] = last_sequence
                    res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                    write_cache_with_folder(res, "small_banner_cache")
                    _logger.info("small_banner RENEW SUCCESS SIGNATURE " + signature)
                except Exception as e:
                    _logger.error(
                        'ERROR small banner file \n' + str(e) + '\n' + traceback.format_exc())
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_banner",
                "signature": signature,
            }
            data = {
                'type': 'promotion'
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            if res['result']['error_code'] == 0:
                try:
                    empty_sequence = False
                    last_sequence = 0
                    for rec in res['result']['response']:
                        if rec['sequence'] == '':
                            empty_sequence = True
                        elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']):  # check isi int atau tidak
                            last_sequence = int(rec['sequence'])
                    if empty_sequence:
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                last_sequence += 1
                                rec['sequence'] = last_sequence
                    res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                    write_cache_with_folder(res, "promotion_banner_cache")
                    _logger.info("promotion_banner RENEW SUCCESS SIGNATURE " + signature)
                except Exception as e:
                    _logger.error(
                        'ERROR promotion banner file \n' + str(e) + '\n' + traceback.format_exc())


        logging.getLogger("info_logger").error("DONE GENERATE NEW CACHE!")
        return True
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        _logger.error(msg='check wiki gitlab file cache baru')
        return False

    # cache airline popular

def update_cache_data(request):
    try:
        res = get_new_cache(request.POST['signature'], 'data')
        if res == True:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': 'Success update cache!',
                    'response': ''
                }
            }
        else:
            res = {
                'result': {
                    'error_code': -1,
                    'error_msg': 'Error update cache!',
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

def update_cache_image(request):
    try:
        res = get_new_cache(request.POST['signature'], 'image')
        if res == True:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': 'Success update cache!',
                    'response': ''
                }
            }
        else:
            res = {
                'result': {
                    'error_code': -1,
                    'error_msg': 'Error update cache!',
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

def get_automatic_booker(request):
    try:
        upper = 200
        lower = 0
        passenger = 'book'

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
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        if res['result']['error_code'] == 0:
            counter = 0
            for pax in res['result']['response']:
                try:
                    if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                        title = 'MRS'
                    elif pax['gender'] == 'female':
                        title = 'MS'

                    else:
                        title = 'MR'
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
            _logger.info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_customer_booker_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
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
            _logger.info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
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
            _logger.info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:

            _logger.info("CREATE CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("create_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        passenger['birth_date'] = '%s-%s-%s' % (passenger['birth_date'].split(' ')[2], month[passenger['birth_date'].split(' ')[1]], passenger['birth_date'].split(' ')[0])

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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
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
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    break
            set_session(request, 'cache_passengers', passenger_cache)
            _logger.info("SUCCESS update_customer_agent SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("update_customer_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def get_customer_parent(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_parent",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_customer_agent SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("update_customer_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def activate_corporate_mode(request, signature=False):
    try:
        #DARI AJAX
        data = {
            'c_seq_id': request.POST['customer_seq_id'],
            'cp_seq_id': request.POST['customer_parent_seq_id']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "activate_corporate_mode",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        if signature == False:
            _logger.error(str(e) + '\n' + traceback.format_exc())

    if signature:
        #JIKA PAKAI CORPORATE MODE
        try:
            cur_session = request.session['user_account']
            data = {
                'c_seq_id': cur_session['co_customer_seq_id'],
                'cp_seq_id': cur_session['co_customer_parent_seq_id']
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "activate_corporate_mode",
                "signature": signature,
            }
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            cur_session = request.session['user_account']
            cur_session.update(res['result']['response'])
            cur_session.update({
                "co_customer_parent_seq_id": request.POST['customer_parent_seq_id']
            })
            set_session(request, 'user_account', cur_session)
            if signature == False:
                _logger.info("SUCCESS activate_corporate_mode SIGNATURE " + request.POST['signature'])
            else:
                _logger.info("SUCCESS activate_corporate_mode SIGNATURE " + signature)
        else:
            if signature == False:
                _logger.error("activate_corporate_mode ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
            else:
                _logger.error(
                    "activate_corporate_mode ERROR SIGNATURE " + signature + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def deactivate_corporate_mode(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "deactivate_corporate_mode",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            cur_session = request.session['user_account']
            for key in res['result']['response']:
                if cur_session.get(key):
                    del cur_session[key]
            if cur_session.get('co_customer_parent_seq_id'):
                del cur_session['co_customer_parent_seq_id']
            set_session(request, 'user_account', cur_session)
            _logger.info("SUCCESS deactivate_corporate_mode SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("deactivate_corporate_mode ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
    set_session(request, 'cache_passengers', passengers)
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
    set_session(request, 'cache_passengers', passenger)
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
