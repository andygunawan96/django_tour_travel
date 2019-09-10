from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
import datetime
from ..static.tt_webservice.url import *
from dateutil.relativedelta import *
import json

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
        elif req_data['action'] == 'url':
            res = get_url()
        elif req_data['action'] == 'get_agent_booker':
            res = get_agent_passenger(request)
        elif req_data['action'] == 'get_customer_list':
            res = get_customer_list(request)
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
        "co_uid": ""
    }

    res = util.send_request(url=url+'session', data=data, headers=headers, method='POST')
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
                "signature": request.session['signature'],
            }

            res_user = util.send_request(url=url + 'account', data=data, headers=headers, method='POST')
            request.session['user_account'] = res_user['result']['response']
            try:
                if res['result']['error_code'] == 0:
                    logging.getLogger("info_logger").info("SIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
                    file = open("javascript_version.txt", "r")
                    for line in file:
                        file_cache_name = line
                    file.close()

                    file = open('version' + str(file_cache_name) + ".txt", "r")
                    for line in file:
                        res_data = json.loads(line)
                    file.close()

                    res['result']['response'].update({
                        # 'visa': res_data['result']['response']['visa'],
                        # 'issued_offline': res_data['result']['response']['issued_offline'],
                        # 'train': res_data['result']['response']['train'],
                        # 'activity': res_data['result']['response']['activity'],
                        'airline': res_data['result']['response']['airline'],
                        # 'hotel_config': res_data['result']['response']['hotel_config'],
                    })
                    logging.getLogger("info_logger").error("USE CACHE IN TXT!")
            except:
                logging.getLogger("info_logger").error("GET NEW CACHE!")
                # airline
                data = {'provider_type': 'airline'}
                headers = {
                    "Accept": "application/json,text/html,application/xml",
                    "Content-Type": "application/json",
                    "action": "get_destinations",
                    "signature": request.session['signature'],
                }

                res_destination_airline = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
                data = {}
                headers = {
                    "Accept": "application/json,text/html,application/xml",
                    "Content-Type": "application/json",
                    "action": "get_countries",
                    "signature": request.session['signature'],
                }

                res_country_airline = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')

                #visa odoo12
                # data = {
                #     'provider': 'skytors_visa'
                # }
                # headers = {
                #     "Accept": "application/json,text/html,application/xml",
                #     "Content-Type": "application/json",
                #     "action": "get_config",
                #     "signature": request.session['signature'],
                # }
                #
                # res_config_visa = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
                #

                #issuedoffline
                # data = {
                #     'provider': 'skytors_issued_offline'
                # }
                # headers = {
                #     "Accept": "application/json,text/html,application/xml",
                #     "Content-Type": "application/json",
                #     "action": "get_config",
                #     "provider": 'skytors_issued_offline',
                #     "signature": request.session['signature'],
                # }
                #
                # res_config_issued_offline = util.send_request(url=url + 'booking/issued_offline', data=data, headers=headers, method='POST')

                # return res

                #train
                # data = {}
                # headers = {
                #     "Accept": "application/json,text/html,application/xml",
                #     "Content-Type": "application/json",
                #     "action": "get_origins",
                #     "signature": request.session['signature'],
                # }
                #
                # res_origin_train = util.send_request(url=url + 'train/session', data=data, headers=headers, method='POST')

                #activity
                # data = {}
                # headers = {
                #     "Accept": "application/json,text/html,application/xml",
                #     "Content-Type": "application/json",
                #     "action": "get_config2",
                #     "signature": request.session['signature'],
                # }
                #
                # res_config_activity = util.send_request(url=url + 'themespark/booking', data=data, headers=headers,
                #                                      cookies=res_activity['result']['cookies'], method='POST')



                res['result']['response'].update({
                    # 'visa': res_config_visa['result']['response'], #belum di install
                    # 'issued_offline': res_config_issued_offline['result']['response'], #belum di install
                    # 'train': res_origin_train['result']['response'],
                    # 'activity': res_config_activity['result'],
                    'airline': {
                        'country': res_country_airline['result']['response'],
                        'destination': res_destination_airline['result']['response']
                    },
                })

                file = open("javascript_version.txt", "r")
                for line in file:
                    file_cache_name = line
                file.close()

                file = open('version' + str(file_cache_name) + ".txt", "w+")
                file.write(json.dumps(res))
                file.close()

                #cache airline popular
                file = open("popular_destination_airline_cache.txt", "r")
                for line in file:
                    popular_airline = json.loads(line)
                file.close()
                popular = []
                avarage = []
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
                                avarage.append({
                                    'name': destination['name'],
                                    'code': destination['code'],
                                    'city': destination['city'],
                                    'country': country['name']
                                })
                        except:
                            avarage.append({
                                'name': destination['name'],
                                'code': destination['code'],
                                'city': destination['city'],
                                'country': country['name']
                            })
                popular = popular + avarage

                file = open('airline_destination.txt', "w+")
                file.write(json.dumps(popular))
                file.close()
                #cache airline popular
        else:
            logging.getLogger("info_logger").info("WRONG USERNAME OR PASSWORD MAYBE HACKER!! ")

    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return 'login' in res_user['result']['response']['co_agent_frontend_security']

def get_url():
    return url_web

def get_customer_list(request):
    try:
        data = {
            'name': request.POST['name']
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
                if pax['birth_date'] != '':
                    age = relativedelta(datetime.now(), datetime.strptime(pax['birth_date'], "%Y-%m-%d"))
                    age = age.years
                else:
                    age = ''
                if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                    title = 'MRS'
                elif pax['gender'] == 'female':
                    title = 'MS'
                else:
                    title = 'MR'
                pax.update({
                    'sequence': counter,
                    'age': age,
                    'title': title
                })
                if pax['birth_date'] != '':

                    pax.update({
                        'birth_date': '%s %s %s' % (
                            pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                            pax['birth_date'].split('-')[0]),
                    })
                counter += 1
            logging.getLogger("info_logger").info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error(str(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
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