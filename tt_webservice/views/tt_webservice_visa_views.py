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
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'search':
            res = search(request)
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
        request.session['visa_signature'] = res['result']['response']['signature']
        request.session['signature'] = res['result']['response']['signature']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_config(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

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
            "provider": 'rodextrip_visa'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
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

            request.session['visa_search'] = res
            request.session['list_of_visa_type'] = {
                'entry_type': entry_type,
                'visa_type': visa_type,
                'process_type': process_type
            }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def sell_visa(request):
    try:
        data = {
            'pax': request.session['visa_sell'],
            'passenger': request.session['visa_passenger'],
            "provider": 'rodextrip_visa'
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_visa",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
    return res

def update_contact(request):
    try:
        booker = request.session['visa_create_passengers']['booker']
        contacts = request.session['visa_create_passengers']['contact']
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
    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
    return res

def update_passengers(request):
    try:
        passengers = []
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        master_visa_id = json.loads(request.POST['id'])
        for pax_type in request.session['visa_create_passengers']:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in request.session['visa_create_passengers'][pax_type]:
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

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
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
            # 'voucher': {}
        })
        # if request.POST['voucher_code'] != '':
        #     data.update({
        #         'voucher': data_voucher(request.POST['voucher_code'], 'visa', 'visa_rodextrip'),
        #     })

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST', timeout=300)

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
    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            res['result']['response']['journey']['departure_date'] = convert_string_to_date_to_string_front_end(res['result']['response']['journey']['departure_date'])
            for pax in res['result']['response']['passengers']:
                pax['birth_date'] = convert_string_to_date_to_string_front_end(pax['birth_date'])
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res