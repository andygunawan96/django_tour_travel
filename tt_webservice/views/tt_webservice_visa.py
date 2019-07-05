from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
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
        elif req_data['action'] == 'update_contact':
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
        "co_user": user_default,  # request.POST['username'],
        "co_password": password_default,  # request.POST['password'],
        "co_uid": ""
    }
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')

    request.session['visa_signature'] = res['result']['response']['signature']

    return res

def get_config(request):
    file = open("version_cache.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()

    file = open(str(file_cache_name) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()

    res = {}
    for visa_config in response['result']['response']['visa']:
        cities = []
        for city in response['result']['response']['visa'][visa_config]:
            cities.append(city)
        res[visa_config] = cities

    return res

def search(request):

    destination = request.POST['destination'] #masih gatau id apa str
    consulate = request.POST['consulate'] #masih gatau id apa str
    departure_date = '%s-%s-%s' % (request.POST['departure_date'].split(' ')[2],
                                   month[request.POST['departure_date'].split(' ')[1]],
                                   request.POST['departure_date'].split(' ')[0])

    data = {
        "destination": destination,
        "consulate": consulate,
        "departure_date": departure_date,
        "provider": 'skytors_visa'
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "search",
        "signature": request.session['visa_signature'],
    }

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')

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
    return res

def sell_visa(request):
    data = {
        'pax': request.session['visa_passenger'],
        "provider": 'skytors_visa'
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "sell_visa",
        "signature": request.session['visa_signature'],
    }
    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
    return res

def update_contact(request):

    data = {
        'booker': request.session['visa_create_passengers']['booker'],
        'contacts': request.session['visa_create_passengers']['contact']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_contact",
        "signature": request.session['visa_signature'],
    }

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
    return res

def update_passengers(request):
    passengers = []
    master_visa_id = json.loads(request.POST['id'])
    for pax in request.session['visa_create_passengers']['adult']:
        pax.update({
            'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
        })
        if pax['passport_expdate'] != '':
            try:
                pax.update({
                    'passport_expdate': '%s-%s-%s' % (pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                                                pax['passport_expdate'].split(' ')[0])
                })
            except:
                print('no passport exp date')
        pax['master_visa_Id'] = master_visa_id[len(passengers)]['id']
        pax['required'] = master_visa_id[len(passengers)]['required']
        passengers.append(pax)

    for pax in request.session['visa_create_passengers']['child']:
        pax.update({
            'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
        })
        if pax['passport_expdate'] != '':
            try:
                pax.update({
                    'passport_expdate': '%s-%s-%s' % (pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                                                pax['passport_expdate'].split(' ')[0])
                })
            except:
                print('no passport exp date')
        passengers.append(pax)

    for pax in request.session['visa_create_passengers']['infant']:
        pax.update({
            'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0])
        })
        if pax['passport_expdate'] != '':
            try:
                pax.update({
                    'passport_expdate': '%s-%s-%s' % (pax['passport_expdate'].split(' ')[2], month[pax['passport_expdate'].split(' ')[1]],
                                                pax['passport_expdate'].split(' ')[0])
                })
            except:
                print('no passport exp date')
        passengers.append(pax)

    data = {
        'passengers': passengers
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_passenger",
        "signature": request.session['visa_signature'],
    }

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
    return res

def commit_booking(request):
    #nanti ganti ke get_ssr_availability
    if request.POST['force_issued'] == 'false':
        force_issued = False
    elif request.POST['force_issued'] == 'true':
        force_issued = True
    data = {
        'force_issued': force_issued
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "commit_booking",
        "signature": request.session['visa_signature'],
    }

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST', timeout=300)

    return res

def get_booking(request):
    # nanti ganti ke get_ssr_availability

    data = {
        # 'order_number': 'TB.190329533467'
        'order_number': request.POST['order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_booking",
        "signature": request.session['visa_signature'],
    }

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')
    if res['result']['error_code'] == 0:
        res['result']['response']['journey']['departure_date'] = convert_string_to_date_to_string_front_end(res['result']['response']['journey']['departure_date'])
        for pax in res['result']['response']['passenger']:
            pax['birth_date'] = convert_string_to_date_to_string_front_end(pax['birth_date'])


    return res