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
from .tt_webservice_voucher_views import *
import time
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
        elif req_data['action'] == 'get_config_provider':
            res = get_config_provider(request)
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_availability':
            res = get_availability(request)
        elif req_data['action'] == 'sell_passport':
            res = sell_passport(request)
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'update_contacts':
            res = update_contact(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
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
            "signature": '',
        }

        data = {
            "user": user_global,
            "password": password_global,
            "api_key": api_key,
            "co_user": request.session['username'],
            "co_password": request.session['password'],
            "co_uid": ""
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        time.sleep(1)
        request.session['passport_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
        if request.session.get('passport_search'):
            del request.session['passport_search']
        logging.getLogger("info_logger").info(json.dumps(request.session['passport_signature']))
        request.session.modified = True
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

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
            "provider_type": 'passport'
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("get_providers PASSPORT RENEW SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("info_logger").info("get_providers PASSPORT ERROR SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res

def get_config(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        res = {}
        for passport_config in response['result']['response']['passport']:
            cities = []
            for city in response['result']['response']['passport'][passport_config]:
                cities.append(city)
            res[passport_config] = cities
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def search(request):
    try:
        data = {
            "passport_type": request.POST['passport_type'],
            "apply_type": request.POST['apply_type'],
            "immigration_consulate": request.POST['immigration_consulate'],
            "provider": 'passport_internal'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            if request.session.get('passport_search'):
                request.session['passport_search'] = request.session.get('passport_search')
            else:
                request.session['passport_search'] = res
            logging.getLogger("info_logger").info(json.dumps(request.session['passport_search']))
            request.session.modified = True
            logging.getLogger("info_logger").info("SUCCESS search PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR search_passport TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_availability(request):
    try:
        data = {
            'reference_code': json.loads(request.POST['reference_code']),
            'provider': request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_availability",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS sell_passport PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR sell_passport PASSPORT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def sell_passport(request):
    try:
        data = {
            'sell_passport': request.session['passport_sell']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_passport",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS sell_passport PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR sell_passport PASSPORT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def update_contact(request):
    try:
        booker = request.session['passport_create_passengers']['booker']
        contacts = request.session['passport_create_passengers']['contact']
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
        data = {
            'booker': booker,
            'contacts': contacts
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_contacts",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_contact PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_contact_passport PASSPORT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def update_passengers(request):
    try:
        passengers = []
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        master_passport_id = json.loads(request.POST['id'])
        for pax_type in request.session['passport_create_passengers']:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in request.session['passport_create_passengers'][pax_type]:
                    if pax['nationality_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['nationality_name'] == country['name']:
                                pax['nationality_code'] = country['code']
                                break

                    if pax['identity_country_of_issued_name'] != '':
                        for country in response['result']['response']['airline']['country']:
                            if pax['identity_country_of_issued_name'] == country['name']:
                                pax['identity_country_of_issued_code'] = country['code']
                                break
                    pax.update({
                        'birth_date': '%s-%s-%s' % (
                            pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                            pax['birth_date'].split(' ')[0]),
                    })
                    if pax['identity_expdate'] != '':
                        pax.update({
                            'identity_expdate': '%s-%s-%s' % (
                                pax['identity_expdate'].split(' ')[2], month[pax['identity_expdate'].split(' ')[1]],
                                pax['identity_expdate'].split(' ')[0])
                        })
                        pax['identity'] = {
                            "identity_country_of_issued_name": pax.pop('identity_country_of_issued_name'),
                            "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                            "identity_expdate": pax.pop('identity_expdate'),
                            "identity_number": pax.pop('identity_number'),
                            "identity_type": pax.pop('identity_type'),
                        }

                    else:
                        pax.pop('identity_country_of_issued_name')
                        pax.pop('identity_expdate')
                        pax.pop('identity_number')
                        pax.pop('identity_type')
                    pax['master_passport_Id'] = master_passport_id[len(passengers)]['id']
                    pax['required'] = master_passport_id[len(passengers)]['required']
                    pax['notes'] = master_passport_id[len(passengers)]['notes']
                    passengers.append(pax)
        data = {
            'passengers': passengers
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_passengers",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS update_passengers PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_passengers_passport PASSPORT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    try:
        if request.POST['force_issued'] == 'false':
            force_issued = False
        elif request.POST['force_issued'] == 'true':
            force_issued = True
        data = {
            'force_issued': force_issued
        }
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data.update({
            'member': member,
            'seq_id': request.POST['seq_id'],
            'voucher': {}
        })
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'passport', ['passport_rodextrip']),
            })

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS commit_booking PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR commit_booking_passport PASSPORT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_booking(request):
    try:
        # nanti ganti ke get_ssr_availability

        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            res['result']['response']['journey']['departure_date'] = convert_string_to_date_to_string_front_end_with_unkown_separator(res['result']['response']['journey']['departure_date'])
            for pax in res['result']['response']['passengers']:
                pax['birth_date'] = convert_string_to_date_to_string_front_end(pax['birth_date'])
            logging.getLogger("info_logger").info("SUCCESS get_booking PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR get_booking_passport PASSPORT SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def update_service_charge(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': request.POST['order_number'],
            'passengers': json.loads(request.POST['passengers'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pricing_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/passport', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            request.session['passport_upsell_'+request.POST['signature']] = total_upsell
            logging.getLogger("info_logger").info(json.dumps(request.session['passport_upsell_' + request.POST['signature']]))
            request.session.modified = True
            logging.getLogger("info_logger").info("SUCCESS update_service_charge PASSPORT SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR update_service_charge PASSPORT SIGNATURE " + request.POST['signature'])
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    return res