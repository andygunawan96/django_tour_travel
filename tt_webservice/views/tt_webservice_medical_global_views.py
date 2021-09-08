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
        elif req_data['action'] == 'get_zip_code':
            res = get_zip_code(request)
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
        elif req_data['action'] == 'get_result':
            res = get_result(request)
        elif req_data['action'] == 'get_transaction_by_analyst':
            res = get_transaction_by_analyst(request)
        elif req_data['action'] == 'get_data_cache_passenger_medical':
            res = get_data_cache_passenger_medical(request)
        elif req_data['action'] == 'get_data_booking_cache_medical':
            res = get_data_booking_cache_medical(request)
        elif req_data['action'] == 'save_backend':
            res = save_backend(request)
        elif req_data['action'] == 'verify_data':
            res = verify_data(request)
        elif req_data['action'] == 'cancel':
            res = cancel(request)
        elif req_data['action'] == 'confirm_order':
            res = confirm_order(request)
        elif req_data['action'] == 'get_medical_information':
            res = get_medical_information(request)
        elif req_data['action'] == 'update_medical_information':
            res = update_medical_information(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)

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
            set_session(request, 'medical_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['medical_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_config(request):
    try:
        additional_url = ''
        try:
            # DARI WEB
            provider = 'medical'
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
        except:
            # DARI MOBILE
            provider = request.data['provider']
            additional_url += 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": request.data['signature']
            }

        file = read_cache_with_folder_path("medical_global_cache_data", 86400)
        # TODO VIN: Some Update Mekanisme ontime misal ada perubahan data dkk
        if not file:
            url_request = url + additional_url
            res = send_request_api(request, url_request, headers, data, 'POST')
            try:
                if res['result']['error_code'] == 0:
                    headers['action'] = 'get_provider_list'
                    # res_provider = send_request_api(request, url_request, headers, data, 'POST')
                    write_cache_with_folder(res, "medical_global_cache_data")
            except Exception as e:
                _logger.info("ERROR GET CACHE medical global " + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())
                file = read_cache_with_folder_path("medical_global_cache_data", 86400)
                if file:
                    res = file

        else:
            res = file
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    try:
        pass
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_zip_code(request):
    try:
        file = open("tt_webservice/static/tt_webservice/zip_code.json", "r")
        res = {
            "result": {
                "error_msg": '',
                "error_code": 0,
                "response": json.loads(file.read())
            }
        }
    except Exception as e:
        res = {
            "result": {
                "error_msg": 'zip code not found',
                "error_code": 500,
                "response": ''
            }
        }
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

    url_request = url + 'booking/phc'
    res = send_request_api(request, url_request, headers, data, 'POST')

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

    url_request = url + 'booking/phc'
    res = send_request_api(request, url_request, headers, data, 'POST')

    return res

def get_availability(request):
    try:
        additional_url = 'booking/medical'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_availability",
            "signature": request.POST['signature']
        }

        data = {
            'provider': 'nathos', #hardcode dulu
            'carrier_code': request.POST['carrier_code']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST')

    set_session(request, "medical_get_availability_%s" % request.POST['signature'], res)

    return res

def get_price(request):
    try:
        additional_url = 'booking/medical'

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_price",
            "signature": request.POST['signature']
        }

        data = {
            'timeslot_list': json.loads(request.POST['timeslot_list']),
            'pax_count': int(request.POST['pax_count']),
            'provider': 'nathos',
            'carrier_code': request.POST['carrier_code']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST')
    set_session(request, "medical_global_get_price_%s" % request.POST['signature'], res)

    return res

def get_price_cache(request):
    if request.session.get("medical_global_get_price_%s" % request.POST['signature']):
        return request.session["medical_global_get_price_%s" % request.POST['signature']]
    return {
        "result": {
            "error_code": 500,
            "error_msg": "price not found",
            "response": ''
        }
    }

def commit_booking(request):
    try:
        additional_url = 'booking/medical'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature']
        }

        data = copy.deepcopy(request.session['medical_data_%s' % request.POST['signature']])
        _logger.info(json.dumps(data))
        if request.POST.get('test_type'):
            data['data']['carrier_code'] = request.POST['test_type']
        elif request.session.get('test_type_%s' % request.POST['signature']):
            data['data']['carrier_code'] = request.session['test_type_%s' % request.POST['signature']]
        if request.POST.get('provider'):
            data['provider'] = 'nathos'
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
            if rec['identity'].get('identity_expdate'):
                if rec['identity']['identity_expdate']:
                    rec['identity']['identity_expdate'] = '%s-%s-%s' % (
                        rec['identity']['identity_expdate'].split(' ')[2], month[rec['identity']['identity_expdate'].split(' ')[1]],
                        rec['identity']['identity_expdate'].split(' ')[0])
            else:
                rec['identity']['identity_expdate'] = ''

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
                'voucher': data_voucher(request.POST['voucher_code'], request.POST['provider'], []),
            })
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST')
    set_session(request, "medical_commmit_booking_%s" % request.POST['signature'], res)

    return res

def get_booking(request):
    try:
        additional_url = 'booking/medical'

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

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
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

        additional_url = 'booking/medical'

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued MEDICAL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR medical_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_result(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
        }
        additional_url = 'booking/'
        if 'PK' in request.POST['order_number']:
            additional_url += 'periksain'
        else:
            additional_url += 'phc'

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_result",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get result SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR medical_getresult SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
        }
        additional_url = 'booking/medical'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS medical_cancel SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR medical_cancel SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def confirm_order(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
        }
        additional_url = 'booking/medical'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "confirm_order",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS medical_confirm_order SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR medical_confirm_order SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_transaction_by_analyst(request):
    try:
        data = {
            'date_from': request.POST['date_from'],
            'date_to': request.POST['date_to'],
        }
        additional_url = 'booking/%s' % request.POST['vendor']

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_transaction_by_analyst",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued MEDICAL SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR medical_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_cache_passenger_medical(request):
    try:
        res = request.session['medical_passenger_cache']
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        for rec in res:
            for country in response['result']['response']['airline']['country']:
                if rec['nationality_code'] == country['code']:
                    rec['nationality_name'] = country['name']
                    break

            for country in response['result']['response']['airline']['country']:
                if rec['identity_country_of_issued_code'] == country['code']:
                    rec['identity_country_of_issued_name'] = country['name']
                    break

    except Exception as e:
        try:
            res = request.session.get('medical_passenger_cache')
        except Exception as e:
            res = []
    return res

def get_data_booking_cache_medical(request):
    try:
        res = request.session['medical_data_cache']
    except Exception as e:
        try:
            res = request.session.get('medical_data_cache')
        except Exception as e:
            res = {}
    return res

def save_backend(request):
    try:
        provider = ''
        additional_url = 'booking/phc'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_passenger_backend",
            "signature": request.POST['signature']
        }

        data = json.loads(request.POST['request'])
        _logger.info(json.dumps(data))

        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        res = request.session['medical_passenger_cache']
        for idx, rec in enumerate(data['passengers']):
            rec['birth_date'] = '%s-%s-%s' % (rec['birth_date'].split(' ')[2], month[rec['birth_date'].split(' ')[1]], rec['birth_date'].split(' ')[0])
            rec['nationality_code'] = res[idx]['nationality_code']
            rec['pcr_data'] = res[idx]['pcr_data']
            rec['email'] = res[idx]['email']
            rec['kelurahan_ktp'] = res[idx]['kelurahan_ktp']
            rec['kecamatan_ktp'] = res[idx]['kecamatan_ktp']
            rec['kabupaten_ktp'] = res[idx]['kabupaten_ktp']
            rec['rw_ktp'] = res[idx]['rw_ktp']
            rec['rt_ktp'] = res[idx]['rt_ktp']
            rec['address_ktp'] = res[idx]['address_ktp']
            rec['kelurahan'] = res[idx]['kelurahan']
            rec['kecamatan'] = res[idx]['kecamatan']
            rec['kabupaten'] = res[idx]['kabupaten']
            rec['rw'] = res[idx]['rw']
            rec['rt'] = res[idx]['rt']
            rec['address'] = res[idx]['address']
            rec['work_place'] = res[idx]['work_place']
            rec['profession'] = res[idx]['profession']
            rec['verify'] = res[idx]['verify']
            rec['label_url'] = res[idx]['label_url']
            rec['result_url'] = res[idx]['result_url']
            rec['identity']['identity_country_of_issued_code'] = res[idx]['identity_country_of_issued_code']
            if rec['identity'].get('identity_expdate'):
                if rec['identity']['identity_expdate']:
                    rec['identity']['identity_expdate'] = '%s-%s-%s' % (
                        rec['identity']['identity_expdate'].split(' ')[2], month[rec['identity']['identity_expdate'].split(' ')[1]],
                        rec['identity']['identity_expdate'].split(' ')[0])
            else:
                rec['identity']['identity_expdate'] = ''
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST')
    return res

def verify_data(request):
    try:
        provider = ''
        additional_url = 'booking/phc'
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "verify_data",
            "signature": request.POST['signature']
        }

        data = json.loads(request.POST['request'])
        _logger.info(json.dumps(data))

        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        res = request.session['medical_passenger_cache']
        for idx, rec in enumerate(data['passengers']):
            rec['birth_date'] = '%s-%s-%s' % (rec['birth_date'].split(' ')[2], month[rec['birth_date'].split(' ')[1]], rec['birth_date'].split(' ')[0])
            rec['nationality_name'] = res[idx]['nationality_name']
            rec['pcr_data'] = res[idx]['pcr_data']
            rec['email'] = res[idx]['email']
            rec['kelurahan_ktp'] = res[idx]['kelurahan_ktp']
            rec['kecamatan_ktp'] = res[idx]['kecamatan_ktp']
            rec['kabupaten_ktp'] = res[idx]['kabupaten_ktp']
            rec['rw_ktp'] = res[idx]['rw_ktp']
            rec['rt_ktp'] = res[idx]['rt_ktp']
            rec['address_ktp'] = res[idx]['address_ktp']
            rec['kelurahan'] = res[idx]['kelurahan']
            rec['kecamatan'] = res[idx]['kecamatan']
            rec['kabupaten'] = res[idx]['kabupaten']
            rec['rw'] = res[idx]['rw']
            rec['rt'] = res[idx]['rt']
            rec['address'] = res[idx]['address']
            rec['work_place'] = res[idx]['work_place']
            rec['profession'] = res[idx]['profession']
            rec['nomor_karcis'] = res[idx]['nomor_karcis']
            rec['nomor_perserta'] = res[idx]['nomor_perserta']
            rec['verify'] = res[idx]['verify']
            rec['label_url'] = res[idx]['label_url']
            rec['result_url'] = res[idx]['result_url']
            rec['identity_country_of_issued_code'] = res[idx]['identity_country_of_issued_code']
            rec['identity']['identity_country_of_issued_code'] = res[idx]['identity_country_of_issued_code']
            rec['birth_date'] = '%s-%s-%s' % (rec['birth_date'].split(' ')[2], month[rec['birth_date'].split(' ')[1]], rec['birth_date'].split(' ')[0])
            for country in response['result']['response']['airline']['country']:
                if rec['nationality_name'] == country['name']:
                    rec['nationality_code'] = country['code']
                    break
            if rec['identity'].get('identity_expdate'):
                if rec['identity']['identity_expdate']:
                    rec['identity']['identity_expdate'] = '%s-%s-%s' % (
                        rec['identity']['identity_expdate'].split(' ')[2], month[rec['identity']['identity_expdate'].split(' ')[1]],
                        rec['identity']['identity_expdate'].split(' ')[0])
            else:
                rec['identity']['identity_expdate'] = ''

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res

def get_medical_information(request):
    res = []
    if not os.path.exists("/var/log/django/medical"):
        os.mkdir('/var/log/django/medical')
    file = read_cache_without_folder_path("medical/periksain", 90911)
    res.append({
        'code': 'periksain',
        "html": file
    })
    file = read_cache_without_folder_path("medical/phc_antigen", 90911)
    res.append({
        "code": 'phc_antigen',
        "html": file
    })
    file = read_cache_without_folder_path("medical/phc_pcr", 90911)
    res.append({
        "code": 'phc_pcr',
        "html": file
    })
    return {
        "error_code": 0,
        "error_msg": '',
        "response": res
    }


def update_medical_information(request):
    if not os.path.exists("/var/log/django/medical"):
        os.mkdir('/var/log/django/medical')
    try:
        data = request.POST['html']
        write_cache(data, "medical/%s" % request.POST['name'])
        return ERR.get_no_error_api()
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        return ERR.get_error_api(500,additional_message="Error Update")

def update_service_charge(request):
    # nanti ganti ke get_ssr_availability
    try:

        additional_url = 'booking/'
        if 'PK' in request.POST['order_number']:
            additional_url += 'periksain'
        else:
            additional_url += 'phc'

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

    url_request = url + additional_url
    res = send_request_api(request, url_request, headers, data, 'POST', 480)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'medical_upsell_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['medical_upsell' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge TRAIN SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_train TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res
