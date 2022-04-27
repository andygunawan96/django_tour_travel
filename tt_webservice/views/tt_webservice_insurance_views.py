from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
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
import time
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

cabin_class_list = {
    'All': 'ALL',
    'Y': 'Economy',
    'W': 'Premium Economy',
    'C': 'Business',
    'F': 'First',
    'ALL': 'All',
    'Economy': 'Y',
    'Premium': 'W',
    'Business': 'C',
    'First': 'F',
}

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = login(request)
        elif req_data['action'] == 'get_availability':
            res = get_availability(request)
        elif req_data['action'] == 'get_data_passenger_page':
            res = get_data_passenger_page(request)
        elif req_data['action'] == 'get_data_review_page':
            res = get_data_review_page(request)
        elif req_data['action'] == 'get_data_search_page':
            res = get_data_search_page(request)
        elif req_data['action'] == 'get_token':
            res = get_token(request)
        elif req_data['action'] == 'get_kurs':
            res = get_kurs(request)
        elif req_data['action'] == 'get_premi':
            res = get_premi(request)
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'check_benefit_data':
            res = check_benefit_data(request)
        elif req_data['action'] == 'sell_insurance':
            res = sell_insurance(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'cancel':
            res = cancel(request)
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
            create_session_product(request, 'insurance', 20)
            set_session(request, 'insurance_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['insurance_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_availability(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_availability",
            "signature": request.POST['signature']
        }
        international = False
        if request.session['insurance_request']['destination'].split(' - ')[1] != 'Domestic':
            international = True
        destination_area = request.session['insurance_request']['destination'].split(' - ')[1]
        data = {
            "date_start": datetime.strptime(request.session['insurance_request']['date_start'],'%d %b %Y').strftime('%Y-%m-%d'),
            "date_end": datetime.strptime(request.session['insurance_request']['date_end'],'%d %b %Y').strftime('%Y-%m-%d'),
            'pax': int(request.session['insurance_request']['adult']),
            "origin": request.session['insurance_request']['origin'].split(' - ')[0],
            "destination": request.session['insurance_request']['destination'].split(' - ')[0],
            "is_senior": request.session['insurance_request']['is_senior'],
            "international": international,
            "destination_area": destination_area,
            "type": request.session['insurance_request']['type'],
            "plan_trip": request.session['insurance_request']['plan_trip'],
            "provider": request.session['insurance_request']['provider']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST', timeout=180)

    set_session(request, "insurance_get_availability_%s" % request.POST['signature'], res)

    return res

def get_token(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_token",
            "signature": request.POST['signature'],
        }

        data = {
            "provider": 'bcainsurance'
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info(json.dumps(request.session['visa_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_kurs(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_kurs",
            "signature": request.POST['signature'],
        }

        data = {
            "provider": 'bcainsurance'
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info(json.dumps(request.session['visa_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_premi(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_premi",
            "signature": request.POST['signature'],
        }

        data = {
            "provider": 'bcainsurance'
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info(json.dumps(request.session['visa_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def updata(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "updata",
            "signature": request.POST['signature'],
        }

        data = {
            "provider": 'bcainsurance'
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info(json.dumps(request.session['visa_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_config(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_config",
            "signature": request.POST['signature'],
        }

        data = {}
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    file = read_cache_with_folder_path("insurance_cache_data", 86400)
    # TODO VIN: Some Update Mekanisme ontime misal ada perubahan data dkk
    if not file:
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                write_cache_with_folder(res, "insurance_cache_data")
        except Exception as e:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())
            file = read_cache_with_folder_path("insurance_cache_data", 90911)
            if file:
                res = file
    else:
        res = file
    return res

def get_data_search_page(request):
    try:
        res = {}
        res['insurance_request'] = request.session.get('insurance_request')
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_passenger_page(request):
    try:
        res = {}
        res['insurance_request'] = request.session.get('insurance_request_with_passenger')
        res['insurance_pick'] = request.session.get('insurance_pick')

    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_review_page(request):
    try:
        res = {}
        res['insurance_request'] = request.session.get('insurance_request_with_passenger')
        res['insurance_pick'] = request.session.get('insurance_pick')
        res['insurance_passenger'] = request.session.get('insurance_create_passengers')

    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def check_benefit_data(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "check_benefit_data",
            "signature": request.POST['signature'],
        }

        data = {
            "provider": 'bcainsurance'
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info(json.dumps(request.session['visa_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def sell_insurance(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_insurance",
            "signature": request.POST['signature'],
        }
        insurance_pick = json.loads(request.POST['insurance_pick'])
        data_insurance = {
            "carrier_code": insurance_pick['carrier_code'],
            "carrier_name": insurance_pick['carrier_name'],
            "provider": insurance_pick['provider'],
            "sector_type": insurance_pick['sector_type']
        }
        data = {
            "data": data_insurance,
            'provider': insurance_pick['provider'],
            'pax': int(request.POST['total_policy'])
        }

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST',timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info(json.dumps(request.session['insurance_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def commit_booking(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature'],
        }

        booker = request.session['insurance_create_passengers']['booker']
        contacts = request.session['insurance_create_passengers']['contact']
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
        for pax_type in request.session['insurance_create_passengers']:
            if pax_type != 'booker' and pax_type != 'contact':
                for passenger_data in request.session['insurance_create_passengers'][pax_type]:
                    pax = copy.deepcopy(passenger_data)
                    for type in pax['data_insurance']:
                        if pax['data_insurance'][type]:
                            if type == 'relation': #LIST RELASI
                                for rec in pax['data_insurance'][type]:
                                    rec.update({
                                        'birth_date': '%s-%s-%s' % (
                                            rec['birth_date'].split(' ')[2],
                                            month[rec['birth_date'].split(' ')[1]],
                                            rec['birth_date'].split(' ')[0]),
                                    })
                            if type == 'beneficiary': #DICT AHLI WARIS
                                if pax['data_insurance'][type]['birth_date'] != '':
                                    pax['data_insurance'][type].update({
                                        'birth_date': '%s-%s-%s' % (
                                            pax['data_insurance'][type]['birth_date'].split(' ')[2], month[pax['data_insurance'][type]['birth_date'].split(' ')[1]],
                                            pax['data_insurance'][type]['birth_date'].split(' ')[0]),
                                    })
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

                    try:
                        pax.update({
                            'identity_expdate2': '%s-%s-%s' % (
                                pax['identity_expdate2'].split(' ')[2], month[pax['identity_expdate2'].split(' ')[1]],
                                pax['identity_expdate2'].split(' ')[0])
                        })
                    except Exception as e:
                        _logger.error(str(e) + traceback.format_exc())
                    if pax['identity_country_of_issued_name2'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['identity_country_of_issued_name2'] == country['name']:
                                pax['identity_country_of_issued_code2'] = country['code']
                                break
                    else:
                        pax['identity_country_of_issued_code2'] = ''
                    pax['identity'] = {
                        "identity_country_of_issued_name": pax.pop('identity_country_of_issued_name'),
                        "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                        "identity_expdate": pax.pop('identity_expdate'),
                        "identity_number": pax.pop('identity_number'),
                        "identity_type": pax.pop('identity_type'),
                        "identity_image": pax.pop('identity_image'),
                    }
                    if pax['identity_country_of_issued_name2']:
                        pax['identity_passport'] = {
                            "identity_country_of_issued_name": pax.pop('identity_country_of_issued_name2'),
                            "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code2'),
                            "identity_expdate": pax.pop('identity_expdate2'),
                            "identity_number": pax.pop('identity_number2'),
                            "identity_type": pax.pop('identity_type2'),
                        }

                    passenger.append(pax)
        data = {
            "contacts": contacts,
            "passengers": passenger,
            "booker": booker,
            'voucher': {},
            'provider': request.session['insurance_pick']['provider']
        }

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST',timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info(json.dumps(request.session['insurance_signature']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_booking(request):
    try:
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    try:
        if res['result']['error_code'] == 0:
            try:
                res['result']['response']['can_issued'] = False
                if res['result']['response']['hold_date'] > datetime.now().strftime('%Y-%m-%d %H:%M:%S'):
                    res['result']['response']['can_issued'] = True
            except:
                _logger.error('no hold date')
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
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {}
        }
        provider = []

        try:
            airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
            for provider_type in airline_get_booking['result']['response']['provider_bookings']:
                if not provider_type['provider'] in provider:
                    provider.append(provider_type['provider'])
        except Exception as e:
            _logger.error(str(e) + traceback.format_exc())

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'airline', provider),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued INSURANCE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued_insurance INSURANCE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/insurance'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel INSURANCE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_insurance INSURANCE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res
