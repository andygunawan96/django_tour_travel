from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
import datetime
from ..static.tt_webservice.config import *
from ..static.tt_webservice.url import *
import json

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
        elif req_data['action'] == 'get_balance':
            res = get_balance(request)
        elif req_data['action'] == 'url':
            res = get_url()
        elif req_data['action'] == 'get_agent_booker':
            res = get_agent_booker(request)
        elif req_data['action'] == 'get_agent_passenger':
            res = get_agent_passenger(request)
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
    headers.update({
        "action": "signin",
        "signature": ''
    })

    data = {
        "user": user_global,
        "password": password_global,
        "api_key":  api_key,
        "co_user": user_default,  #request.POST['username'],
        "co_password": password_default, #request.POST['password'],
        "co_uid": ""
    }
    res = util.send_request(url=url+'session', data=data, headers=headers, method='POST')

    if res['result']['error_code'] == 0:

        request.session['username'] = request.POST['username'] #res['result']['response']['agent_details']['name']
        # request.session['agent'] = res['result']['response']['agent_details']
        # request.session['co_uid'] = res['result']['response']['co_uid']
        # request.session['agent_sid'] = res['result']['sid']
        # request.session['agent_cookie'] = res['result']['cookies']
        # request.session['company_details'] = res['result']['response']['company_details']
        request.session['signature'] = res['result']['response']['signature']

        #tambah add balance here
        # data = {
        #     'agent_id': res['result']['response']['agent_details']['id']
        # }
        # headers.update({
        #     "action": "get_agent_balance",
        #     "sid": res['result']['sid'],
        # })
        # res_balance = util.send_request(url=url + 'agent/session', data=data, headers=headers, cookies=res['result']['cookies'], method='POST')
        #
        # request.session['balance'] = {
        #     'balance': res_balance['result']['response']['balance'],
        #     'credit_limit': res_balance['result']['response']['credit_limit']
        # }

        try:
            if res['result']['error_code'] == 0:

                file = open("version_cache.txt", "r")
                for line in file:
                    file_cache_name = line
                file.close()

                file = open(str(file_cache_name) + ".txt", "r")
                for line in file:
                    res_data = json.loads(line)
                file.close()

                res['result']['response'].update({
                    # 'balance': {
                    #     'balance': res_balance['result']['response']['balance'],
                    #     'credit_limit': res_balance['result']['response']['credit_limit']
                    # },
                    'issued_offline': res_data['result']['response']['issued_offline'],
                    'train': res_data['result']['response']['train'],
                    'activity': res_data['result']['response']['activity'],
                    'airline': res_data['result']['response']['airline'],
                    'hotel_config': res_data['result']['response']['hotel_config'],
                })
        except:
            #visa odoo12
            data = {
                'provider': 'skytors_visa'
            }
            headers.update({
                "action": "get_config",
                "signature": request.session['signature'],
            })

            res_config_visa = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
            #

            #issuedoffline
            data = {}
            headers.update({
                "action": "get_config",
                "sid": res['result']['sid'],
            })
            res_config_issued_offline = util.send_request(url=url + 'agent/issued_offline', data=data, headers=headers,
                                            cookies=res['result']['cookies'], method='POST')

            #train
            data = {
                "user": user,
                "password": password,
                'api_key': api_key_train,
                'co_uid': res['result']['response']['co_uid']
            }
            headers.update({
                "action": 'signin'
            })
            headers.pop('sid')
            res_train = util.send_request(url=url+"train/session", data=data, headers=headers, method='POST')

            data = {}
            headers.update({
                "action": "get_origins",
                "sid": res_train['result']['sid'],
            })

            res_origin_train = util.send_request(url=url + 'train/session', data=data, headers=headers, cookies=res_train['result']['cookies'], method='POST')

            #activity
            data = {
                "user": user,
                "password": password,
                'api_key': api_key_activity,
                'co_uid': res['result']['response']['co_uid']
            }
            headers.update({
                "action": 'signin'
            })
            headers.pop('sid')
            res_activity = util.send_request(url=url + "themespark/session", data=data, headers=headers, method='POST')

            data = {}
            headers.update({
                "action": "get_config2",
                "sid": res_activity['result']['sid'],
            })

            res_config_activity = util.send_request(url=url + 'themespark/booking', data=data, headers=headers,
                                                 cookies=res_activity['result']['cookies'], method='POST')

            #hotel
            data = {
                "user": user,
                "password": password,
                'api_key': api_key_hotel,
                'co_uid': res['result']['response']['co_uid']
            }
            headers.update({
                "action": 'signin'
            })
            headers.pop('sid')
            res_hotel = util.send_request(url=url + "hotel/session", data=data, headers=headers, method='POST')

            data = {}
            headers.update({
                "action": 'get_autocomplete',
                "sid": res_hotel['result']['sid'],
            })
            res_hotel = util.send_request(url=url + "hotel/session", data=data, headers=headers, method='POST')

            res_hotel_auto_complete = [{
                    'id': hotel['id'],
                    'name': hotel['name'],
                    'type': 'Country'
            } for hotel in res_hotel['result']['response']['country_ids']]

            res_hotel_auto_complete += [{
                    'id': hotel['id'],
                    'name': hotel['name'],
                    'type': 'City'
            } for hotel in res_hotel['result']['response']['city_ids']]

            res_hotel_auto_complete += [{
                'id': hotel['id'],
                'name': hotel['name'],
                'type': 'Hotel'
            } for hotel in res_hotel['result']['response']['hotel_ids']]

            res_hotel_auto_complete += [{
                    'id': hotel['id'],
                    'name': hotel['name'],
                    'type': 'Landmark'
            } for hotel in res_hotel['result']['response']['landmark_ids']]


            #airline
            data = {
                "user": user,
                "password": password,
                'api_key': api_key_airline,
                'co_uid': res['result']['response']['co_uid']
            }
            headers.update({
                "action": 'signin'
            })
            headers.pop('sid')
            res_airline = util.send_request(url=url + "airlines/session", data=data, headers=headers, method='POST')

            data = {}
            headers.update({
                "action": "get_countries",
                "sid": res_airline['result']['sid'],
            })

            res_country_airline = util.send_request(url=url + 'airlines/session', data=data, headers=headers,
                                                    cookies=res_airline['result']['cookies'], method='POST')

            data = {}
            headers.update({
                "action": "get_carriers",
                "sid": res_airline['result']['sid'],
            })

            res_carrier_airline = util.send_request(url=url + 'airlines/session', data=data, headers=headers,
                                                    cookies=res_airline['result']['cookies'], method='POST')

            data = {}
            headers.update({
                "action": "get_destinations",
                "sid": res_airline['result']['sid'],
            })

            res_destination_airline = util.send_request(url=url + 'airlines/session', data=data, headers=headers,
                                                    cookies=res_airline['result']['cookies'], method='POST')

            res['result']['response'].update({
                'balance': {
                    'balance': res_balance['result']['response']['balance'],
                    'credit_limit': res_balance['result']['response']['credit_limit']
                },
                'visa': res_config_visa,
                'issued_offline': res_config_issued_offline['result']['response'],
                'train': res_origin_train['result']['response'],
                'activity': res_config_activity['result'],
                'airline': {
                    'country': res_country_airline['result']['response'],
                    'carriers': res_carrier_airline['result']['response'],
                    'destination': res_destination_airline['result']['response'],
                },
                'hotel_config': res_hotel_auto_complete
            })

            file = open("version1.0"+".txt", "w+")
            file.write(json.dumps(res))
            file.close()

            file = open("version_cache" + ".txt", "w+")
            file.write("version1.0")
            file.close()

    return res['result']['error_code']

def get_balance(request):

    data = {
        "agent_id": request.session['agent']['id'],
    }
    headers.update({
        "action": "get_agent_balance",
        "sid": request.session['agent_sid'],
    })

    res = util.send_request(url=url+'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    if res['result']['error_code'] == 0:
        request.session['balance'] = {
            'balance': res['result']['response']['balance'],
            'credit_limit': res['result']['response']['credit_limit']
        }
    return res

def get_url():
    return url_web

def get_agent_booker(request):
    headers.update({
        "action": "get_agent_booker",
        "sid": request.session['agent_sid'],
    })

    data = {
        "agent_id": request.session['agent']['id'],
        "co_uid": request.session['co_uid'],
        "search_param": 'by_string',
        "search_value": request.POST['search_value']
    }
    res = util.send_request(url=url+'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
    if res['error_code'] == 0:
        res.update({
            'response': json.loads(res['response'])
        })
        counter = 0
        for response in res['response']['result']:
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

    return res

def get_agent_passenger(request):
    headers.update({
        "action": "get_agent_passenger",
        "sid": request.session['agent_sid'],
    })

    data = {
        "agent_id": request.session['agent']['id'],
        "co_uid": request.session['co_uid'],
        "search_param": 'by_string',
        "search_value": request.POST['search_value']
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')
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

    return res

#BACKEND

def get_agent_booking(request):
    headers.update({
        "action": "get_agent_booking",
        "sid": request.session['agent_sid'],
    })

    data = {
        "co_uid": int(request.session['co_uid']),
        "offset": int(request.POST['offset']),
        "limit": 80,
        "transport_type": '',
        "state": ''
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res

def get_top_up(request):
    headers.update({
        "action": "get_top_up",
        "sid": request.session['agent_sid'],
    })

    data = {
        "co_uid": int(request.session['co_uid']),
        "offset": int(request.POST['offset']),
        "limit": 80
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res

def get_top_up_amount(request):
    headers.update({
        "action": "get_top_up_amount",
        "sid": request.session['agent_sid'],
    })

    data = {}
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res

def create_top_up(request):
    headers.update({
        "action": "create_top_up",
        "sid": request.session['agent_sid'],
    })

    data = {
        "amount_id": request.POST['amount_id'],
        "qty": int(request.POST['qty']),
        "agent_id": int(request.session['agent']['id']),
        "unique_amount": int(request.POST['unique_amount'])
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res

def top_up_payment(request):
    headers.update({
        "action": "top_up_payment",
        "sid": request.session['agent_sid'],
    })

    data = {
        "token": request.POST['token'],
        "acq_id": int(request.POST['acq_id'])
    }
    res = util.send_request(url=url + 'agent/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res

def get_merchant_info(request):
    headers.update({
        "action": "get_merchant_info",
        "sid": request.session['agent_sid'],
    })

    data = {}
    res = util.send_request(url=url + 'payment/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res

def request_va(request):
    headers.update({
        "action": "request_va",
        "sid": request.session['agent_sid'],
    })

    data = {}
    res = util.send_request(url=url + 'payment/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res

def request_inv_va(request):
    headers.update({
        "action": "request_inv_va",
        "sid": request.session['agent_sid'],
    })

    data = {
        'amount': '1000.00',
        'currency_id': 'IDR',
        'bank_code': '013',
        'order_id': 'ANSK128329',
        'agent_id': int(request.session['agent']['id'])
    }
    res = util.send_request(url=url + 'payment/session', data=data,
                            cookies=request.session['agent_cookie'], headers=headers, method='POST')

    return res