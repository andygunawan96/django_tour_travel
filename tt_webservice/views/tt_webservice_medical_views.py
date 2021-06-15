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
import time
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
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'get_kecamatan':
            res = get_kecamatan(request)
        elif req_data['action'] == 'get_desa':
            res = get_desa(request)
        elif req_data['action'] == 'get_availability':
            res = get_availability(request)
        elif req_data['action'] == 'get_price':
            res = get_price(request)
        elif req_data['action'] == 'get_price_cache':
            res = get_price_cache(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)

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

    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'medical_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['event_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_config(request):
    try:
        additional_url = ''
        if request.POST['provider'] == 'phc':
            provider = 'phc'
            additional_url = 'booking/'
            additional_url += 'phc'
            data = {
                'provider': provider
            }
            action = 'get_config_vendor'
        elif request.POST['provider'] == 'periksain':
            provider = request.POST['provider']
            additional_url += 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": action,
            "signature": request.POST['signature']
        }
        file = read_cache_with_folder_path("medical_cache_data_%s" % provider, 86400)
        # TODO VIN: Some Update Mekanisme ontime misal ada perubahan data dkk
        if not file:
            res = util.send_request(url=url + additional_url, data=data, headers=headers, method='POST', timeout=480)
            try:
                if res['result']['error_code'] == 0:
                    if request.POST['provider'] == 'phc':
                        file = open("tt_webservice/static/tt_webservice/phc_city.json", "r")
                        res['result']['response']['kota'] = json.loads(file.read())
                    write_cache_with_folder(res['result']['response'], "medical_cache_data_%s" % provider)
            except Exception as e:
                _logger.info("ERROR GET CACHE medical " + provider + ' ' + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())
                file = read_cache_with_folder_path("medical_cache_data_%s" % provider, 86400)
                if file:
                    response = file
                    res = {
                        'result': {
                            'error_code': 0,
                            'error_msg': 'using old cache',
                            'response': response
                        }
                    }
        else:
            response = file
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': 'using old cache',
                    'response': response
                }
            }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_kecamatan(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_kecamatan",
            "signature": request.POST['signature']
        }

        data = {
            'kabupaten': request.POST['kabupaten'],
            'provider': 'phc'
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/phc', data=data, headers=headers, method='POST')

    return res


def get_desa(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_desa",
            "signature": request.POST['signature']
        }

        data = {
            'kecamatan': request.POST['kecamatan'],
            'provider': 'phc'
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/phc', data=data, headers=headers, method='POST')

    return res

def get_availability(request):
    try:
        provider = ''
        additional_url = 'booking/'
        if request.POST['provider'] == 'phc':
            provider = 'phc'
            additional_url += 'phc'
        else:
            provider = request.POST['provider']
            additional_url += 'periksain'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_availability",
            "signature": request.POST['signature']
        }

        data = {
            'provider': provider
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + additional_url, data=data, headers=headers, method='POST')

    set_session(request, "medical_get_availability_%s" % request.POST['signature'], res)

    return res

def get_price(request):
    try:
        provider = ''
        additional_url = 'booking/'
        if request.POST['provider'] == 'phc':
            provider = 'phc'
            additional_url += 'phc'
        else:
            provider = request.POST['provider']
            additional_url += 'periksain'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_price",
            "signature": request.POST['signature']
        }

        data = {
            'timeslot_list': json.loads(request.POST['timeslot_list']),
            'pax_count': int(request.POST['pax_count']),
            'provider': provider,
            'carrier_code': request.POST['carrier_code']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + additional_url, data=data, headers=headers, method='POST')
    set_session(request, "medical_get_price_%s" % request.POST['signature'], res)

    return res

def get_price_cache(request):
    if request.session.get("medical_get_price_%s" % request.POST['signature']):
        return request.session["medical_get_price_%s" % request.POST['signature']]
    return {
        "result": {
            "error_code": 500,
            "error_msg": "price not found",
            "response": ''
        }
    }

def commit_booking(request):
    try:
        provider = ''
        additional_url = 'booking/'
        if request.POST.get('provider') == 'phc':
            provider = 'phc'
            additional_url += 'phc'
        elif request.POST.get('provider') == 'periksain':
            provider = request.POST['provider']
            additional_url += 'periksain'
        elif request.session.get('vendor_%s' % request.POST['signature']) == 'periksain':
            provider = request.POST['provider']
            additional_url += 'periksain'
        elif request.session.get('vendor_%s' % request.POST['signature']) == 'phc':
            provider = request.POST['provider']
            additional_url += 'phc'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature']
        }

        data = request.session['medical_data_%s' % request.POST['signature']]
        if request.POST.get('test_type'):
            data['data']['carrier_code'] = request.POST['test_type']
        elif request.session.get('test_type_%s' % request.POST['signature']):
            data['data']['carrier_code'] = request.session['test_type_%s' % request.POST['signature']]
        if request.POST.get('provider'):
            data['provider'] = request.POST['provider']
        elif request.session.get('vendor_%s' % request.POST['signature']):
            data['provider'] = request.session['vendor_%s' % request.POST['signature']]

        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        for country in response['result']['response']['airline']['country']:
            if data['booker']['nationality_name'] == country['name']:
                data['booker']['nationality_code'] = country['code']
                break

        for pax in data['contacts']:
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break
        for rec in data['passengers']:
            rec['birth_date'] = '%s-%s-%s' % (rec['birth_date'].split(' ')[2], month[rec['birth_date'].split(' ')[1]], rec['birth_date'].split(' ')[0])
            for country in response['result']['response']['airline']['country']:
                if rec['nationality_name'] == country['name']:
                    rec['nationality_code'] = country['code']
                    break
            for country in response['result']['response']['airline']['country']:
                if rec['identity']['identity_country_of_issued_name'] == country['name']:
                    rec['identity']['identity_country_of_issued_code'] = country['code']
                    break
        try:
            if bool(int(request.POST['force_issued'])) == True:
                data['force_issued'] = bool(int(request.POST['force_issued']))
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
                'voucher': data_voucher(request.POST['voucher_code'], provider, []),
            })
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + additional_url, data=data, headers=headers, method='POST')
    set_session(request, "medical_commmit_booking_%s" % request.POST['signature'], res)

    return res

def get_booking(request):
    try:
        provider = ''
        additional_url = 'booking/'
        if 'PK' in request.POST['order_number']:
            additional_url += 'periksain'
        else:
            additional_url += 'phc'
        sync = False
        try:
            if request.POST['sync'] == 'true':
                sync = True
        except Exception as e:
            _logger.error('get refund booking')
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + additional_url, data=data, headers=headers, method='POST', timeout=300)
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        if res['result']['error_code'] == 0:
            for pax in res['result']['response']['passengers']:
                try:
                    if len(pax['birth_date'].split(' ')[0].split('-')) == 3:
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split(' ')[0].split('-')[2], month[pax['birth_date'].split(' ')[0].split('-')[1]],
                                pax['birth_date'].split(' ')[0].split('-')[0])
                        })
                except:
                    pass

            time.sleep(2)
            set_session(request, 'medical_get_booking_response', response)

            _logger.info(json.dumps(request.session['medical_get_booking_response']))

            _logger.info("SUCCESS get_booking MEDICAL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking_MEDICAL SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        print(str(e))
        set_session(request, 'medical_get_booking_response', res)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def issued(request):
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
        provider_char = ''
        try:
            medical_get_booking = request.session['medical_get_booking_response'] if request.session.get('medical_get_booking_response') else json.loads(request.POST['booking'])

            for provider_type in medical_get_booking['result']['response']['provider_bookings']:
                if not provider_type['provider'] in provider:
                    provider.append(provider_type['provider'])
                    provider_char = provider_type['provider']
        except:
            pass

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], provider_char, provider),
            })

        additional_url = 'booking/'
        if 'PK' in request.POST['order_number']:
            additional_url += 'periksain'
        else:
            additional_url += 'phc'

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + additional_url, data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued MEDICAL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR medical_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res
