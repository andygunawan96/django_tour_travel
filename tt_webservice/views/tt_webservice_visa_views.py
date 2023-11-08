from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
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
import time
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
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_availability':
            res = get_availability(request)
        elif req_data['action'] == 'sell_visa':
            res = sell_visa(request)
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
        elif req_data['action'] == 'booker_insentif_booking':
            res = booker_insentif_booking(request)
        elif req_data['action'] == 'page_passenger':
            res = page_passenger(request)
        elif req_data['action'] == 'page_review':
            res = page_review(request)
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
        user_global, password_global, api_key = get_credential(request)
        user_default, password_default = get_credential_user_default(request)
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
        otp_params = {}
        if request.POST.get('unique_id'):
            otp_params['machine_code'] = request.POST['unique_id']
        if request.POST.get('platform'):
            otp_params['platform'] = request.POST['platform']
        if request.POST.get('browser'):
            otp_params['browser'] = request.POST['browser']
        if request.POST.get('timezone'):
            otp_params['timezone'] = request.POST['timezone']
        if otp_params:
            data['otp_params'] = otp_params
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('session')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'visa', 20, res['result']['response']['signature'])
            # set_session(request, 'visa_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.POST.get('frontend_signature'):
                write_cache_file(request, res['result']['response']['signature'], 'visa_frontend_signature',request.POST['frontend_signature'])
                write_cache_file(request, request.POST['frontend_signature'], 'visa_signature',res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info("SIGNIN VISA")
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

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
            "provider_type": 'visa'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_visa_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_visa_carriers", request, 'cache_web')
                _logger.info("get_carriers VISA RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("get_visa_carriers", 'cache_web', request, 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers VISA ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            res = file
        except Exception as e:
            _logger.error('ERROR get_hotel_carriers file\n' + str(e) + '\n' + traceback.format_exc())

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
            "provider_type": 'visa'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("visa_provider", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                #datetime
                write_cache(res, "visa_provider", request, 'cache_web')
                _logger.info("get_providers VISA RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("visa_provider", 'cache_web', request, 90911)
                    if file:
                        res = file
                    _logger.info("get_provider_list ERROR USE CACHE SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.info("get_provider_list VISA ERROR SIGNATURE " + request.POST['signature'])
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            res = file
        except Exception as e:
            _logger.error('ERROR get_provider_list visa file\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_config(request):
    try:
        response = get_cache_data(request)

        res = {}
        for visa_config in response['result']['response']['visa']:
            cities = []
            for city in response['result']['response']['visa'][visa_config]:
                cities.append(city)
            res[visa_config] = cities
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def search(request):
    try:
        destination = request.POST['destination'] #masih gatau id apa str
        consulate = request.POST['consulate'] #masih gatau id apa str
        departure_date = '%s-%s-%s' % (request.POST['departure_date'].split(' ')[2],
                                       month[request.POST['departure_date'].split(' ')[1]],
                                       request.POST['departure_date'].split(' ')[0])

        data = {
            "destination": destination,
            "consulate": consulate,
            "departure_date": departure_date,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
        file = read_cache_file(request, request.POST['frontend_signature'], 'visa_request')
        if file:
            write_cache_file(request, request.POST['signature'], 'visa_request', file)

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST', timeout=180)
    try:
        if res['result']['error_code'] == 0:

            entry_type = {
                'adult': [],
                'child': [],
                'infant': [],
                'elder': []
            }

            visa_type = {
                'adult': [],
                'child': [],
                'infant': [],
                'elder': []
            }

            process_type = {
                'adult': [],
                'child': [],
                'infant': [],
                'elder': []
            }

            for list_of_visa in res['result']['response']['list_of_visa']:
                #paxtype
                if list_of_visa['pax_type'] == 'ADT':
                    list_of_visa['pax_type'] = ['ADT', 'Adult']
                elif list_of_visa['pax_type'] == 'CHD':
                    list_of_visa['pax_type'] = ['CHD', 'Child']
                elif list_of_visa['pax_type'] == 'INF':
                    list_of_visa['pax_type'] = ['INF', 'Infant']
                elif list_of_visa['pax_type'] == 'YCD':
                    list_of_visa['pax_type'] = ['YCD', 'Elder']
                #entry type
                if list_of_visa['entry_type'] == 'single':
                    list_of_visa['entry_type'] = ['single', 'Single']
                elif list_of_visa['entry_type'] == 'double':
                    list_of_visa['entry_type'] = ['double', 'Double']
                elif list_of_visa['entry_type'] == 'multiple':
                    list_of_visa['entry_type'] = ['multiple', 'Multiple']
                #visa type
                if list_of_visa['visa_type'] == 'tourist':
                    list_of_visa['visa_type'] = ['tourist', 'Tourist']
                elif list_of_visa['visa_type'] == 'business':
                    list_of_visa['visa_type'] = ['business', 'Business']
                elif list_of_visa['visa_type'] == 'student':
                    list_of_visa['visa_type'] = ['student', 'Student']

                # visa type
                if list_of_visa['type']['process_type'] == 'regular':
                    list_of_visa['type']['process_type'] = ['regular', 'Regular']
                elif list_of_visa['type']['process_type'] == 'kilat':
                    list_of_visa['type']['process_type'] = ['kilat', 'Express']
                elif list_of_visa['type']['process_type'] == 'super':
                    list_of_visa['type']['process_type'] = ['super', 'Super Express']

                if list_of_visa['entry_type'] not in entry_type[list_of_visa['pax_type'][1].lower()]:
                    entry_type[list_of_visa['pax_type'][1].lower()].append(list_of_visa['entry_type'])
                if list_of_visa['visa_type'] not in visa_type[list_of_visa['pax_type'][1].lower()]:
                    visa_type[list_of_visa['pax_type'][1].lower()].append(list_of_visa['visa_type'])
                if list_of_visa['type']['process_type'] not in process_type[list_of_visa['pax_type'][1].lower()]:
                    process_type[list_of_visa['pax_type'][1].lower()].append(list_of_visa['type']['process_type'])

            write_cache_file(request, request.POST['signature'], 'visa_search', res)
            # set_session(request, 'visa_search', res)

            write_cache_file(request, request.POST['signature'], 'list_of_visa_type', {
                'entry_type': entry_type,
                'visa_type': visa_type,
                'process_type': process_type
            })
            # set_session(request, 'list_of_visa_type', {
            #     'entry_type': entry_type,
            #     'visa_type': visa_type,
            #     'process_type': process_type
            # })
            _logger.info("SUCCESS search VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR search TRAIN SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_availability VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_availability VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def sell_visa(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'visa_sell')
        if file:
            data = {
                'sell_visa': file
            }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_visa",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'sell_visa', res)
            # set_session(request, 'sell_visa', res)
            _logger.info("SUCCESS sell_visa VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR sell_visa VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def update_contact(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'visa_create_passengers')
        if file:
            visa_create_passengers = file
        booker = visa_create_passengers['booker']
        contacts = visa_create_passengers['contact']

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
    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_contact VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_contact VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def update_passengers(request):
    try:
        passengers = []
        master_visa_id = json.loads(request.POST['id'])
        file = read_cache_file(request, request.POST['signature'], 'visa_create_passengers')
        if file:
            visa_create_passengers = file
        for pax_type in visa_create_passengers:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in visa_create_passengers[pax_type]:
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
                            "identity_country_of_issued_code": pax.pop('identity_country_of_issued_code'),
                            "identity_expdate": pax.pop('identity_expdate'),
                            "identity_number": pax.pop('identity_number'),
                            "identity_type": pax.pop('identity_type'),
                            "identity_image": pax.pop('identity_image'),
                        }

                    else:
                        pax.pop('identity_expdate')
                        pax.pop('identity_number')
                        pax.pop('identity_type')
                        pax.pop('identity_image')
                    pax['master_visa_Id'] = master_visa_id[len(passengers)]['id']
                    pax['required'] = master_visa_id[len(passengers)]['required']
                    pax['notes'] = master_visa_id[len(passengers)]['notes']
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

    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_passengers VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {},
            'agent_payment_method': request.POST.get('agent_payment') or False, ## kalau tidak kirim default balance normal
        })

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
                'voucher': data_voucher(request.POST['voucher_code'], 'visa', ['visa_rodextrip']),
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
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit_booking VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR commit_booking VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            res['result']['response']['journey']['departure_date'] = convert_string_to_date_to_string_front_end_with_unkown_separator(res['result']['response']['journey']['departure_date'])
            for pax in res['result']['response']['passengers']:
                pax['birth_date'] = convert_string_to_date_to_string_front_end(pax['birth_date'])
            _logger.info("SUCCESS get_booking VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell_dict = {}
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    if upsell.get('pax_type'):
                        if upsell['pax_type'] not in total_upsell_dict:
                            total_upsell_dict[upsell['pax_type']] = 0
                        total_upsell_dict[upsell['pax_type']] += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'visa_upsell', total_upsell_dict)
            # set_session(request, 'visa_upsell_' + request.POST['signature'], total_upsell_dict)
            _logger.info("SUCCESS update_service_charge VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge VISA SIGNATURE " + request.POST['signature'])
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

    url_request = get_url_gateway('booking/visa')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'visa_upsell_booker', total_upsell)
            # set_session(request, 'visa_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info("SUCCESS update_service_charge_booker VISA SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_booker VISA SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def page_passenger(request):
    try:
        res = {}
        pax = {
            'adult': 0,
            'child': 0,
            'infant': 0,
            'elder': 0
        }
        file = read_cache_file(request, request.POST['signature'], 'visa_search')
        if file:
            visa_search = file
            for visa in visa_search['result']['response']['list_of_visa']:
                pax_count = visa['total_pax']
                if visa['pax_type'][0] == 'ADT':
                    pax.update({
                        'adult': pax['adult'] + pax_count
                    })
                elif visa['pax_type'][0] == 'CHD':
                    pax.update({
                        'child': pax['child'] + pax_count
                    })
                elif visa['pax_type'][0] == 'INF':
                    pax.update({
                        'infant': pax['infant'] + pax_count
                    })
                elif visa['pax_type'][0] == 'YCD':
                    pax.update({
                        'senior': pax['elder'] + pax_count
                    })
            res['visa'] = visa_search['result']['response']
        res['passengers'] = pax

        file = read_cache_file(request, request.POST['signature'], 'visa_request')
        if file:
            res['visa_request'] = file
        res['visa_request'] = request.session['visa_request']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def page_review(request):
    try:
        res = {}
        file = read_cache_file(request, request.POST['signature'], 'visa_create_passengers')
        if file:
            pax = file
        # pax = request.session['visa_create_passengers']
        count = 1
        for i in pax:
            if i != 'booker' and i != 'contact':
                for passenger in pax[i]:
                    passenger.update({
                        'number': count
                    })
                    count = count + 1

        file = read_cache_file(request, request.POST['signature'], 'visa_search')
        if file:
            res['visa'] = file['result']['response']
        # res['visa'] = request.session['visa_search']['result']['response']
        file = read_cache_file(request, request.POST['signature'], 'sell_visa')
        if file:
            res['sell_visa'] = file['result']['response']
        # res['sell_visa'] = request.session['sell_visa']['result']['response']

        res['passengers'] = pax

        file = read_cache_file(request, request.POST['signature'], 'visa_request')
        if file:
            res['visa_request'] = file
        # res['visa_request'] = request.session['visa_request']

        file = read_cache_file(request, request.POST['signature'], 'visa_upsell')
        if file:
            res['upsell_price_dict'] = file
        else:
            res['upsell_price_dict'] = {}
        # res['upsell_price_dict'] = request.session.get('visa_upsell_%s' % request.POST['signature']) and request.session.get('visa_upsell_%s' % request.POST['signature']) or {}
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res