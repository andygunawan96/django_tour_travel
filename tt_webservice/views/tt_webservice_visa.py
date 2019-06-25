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
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'update_contact':
            res = update_contact(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
    headers.update({
        "action": "signin",
        "signature": ''
    })

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

    destinations = []
    consulate = []
    for country in response['result']['response']['airline']['destination']:
        if country == 'Indonesia':
            for des in response['result']['response']['airline']['destination'][country]:
                consulate.append(des['city'])
    for country in response['result']['response']['airline']['destination']:
        destinations.append({
            'country': country,
            'consulate': consulate
        })
    # res = search2(request)
    res = {
        'destinations': destinations,
    }
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
        "departure_date": departure_date
    }
    headers.update({
        "action": "search",
        "signature": request.session['visa_signature'],
    })

    res = util.send_request(url=url + 'booking/visa', data=data, headers=headers, method='POST')

    res = {
        'result': {
            'error_code': 0,
            'error_message': 'Success',
            'response': {
                'country': 'Australia',
                'list_of_visa': [
                    {
                        'pax_type': 'ADT',
                        'entry_type': 'single',
                        'visa_type': 'tourist',
                        'type': {
                            'process_type': 'regular',
                            'duration': '1'
                        },
                        'consulate': {
                            'city': 'Jakarta',
                            'address': 'Kebun Jeruk'
                        },
                        'sale_price': {
                            'total_price': 10000,
                            'commission': 1000,
                            'currency': 'IDR'
                        },
                        'requirements': [
                            {
                                'name': 'passport',
                                'description': 'harus bawa passport'
                            },
                            {
                                'name': 'Copy KTP',
                                'description': ''
                            }
                        ]
                    }, {
                        'pax_type': 'CHD',
                        'entry_type': 'single',
                        'visa_type': 'tourist',
                        'type': {
                            'process_type': 'regular',
                            'duration': '1'
                        },
                        'consulate': {
                            'city': 'Jakarta',
                            'address': 'Kebun Jeruk'
                        },
                        'sale_price': {
                            'total_price': 5000,
                            'commission': 500,
                            'currency': 'IDR'
                        },
                        'requirements': [
                            {
                                'name': 'passport',
                                'description': 'harus bawa passport'
                            },
                            {
                                'name': 'Copy KTP',
                                'description': ''
                            }
                        ]
                    }
                ]
            }
        }
    }


    if res['result']['error_code'] == 0:
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

        request.session['visa_search'] = res

    return res

def update_contact(request):

    data = {
        'booker': request.session['airline_create_passengers']['booker'],
        'contacts': request.session['airline_create_passengers']['contacts']
    }
    headers.update({
        "action": "update_contacts",
        "signature": request.session['airline_signature']
    })

    res = util.send_request(url=url + 'booking/airlines', data=data, headers=headers, method='POST')
    return res

def update_passengers(request):
    passengers = []
    for pax in request.session['airline_create_passengers']['adult']:
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

    for pax in request.session['airline_create_passengers']['child']:
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

    for pax in request.session['airline_create_passengers']['infant']:
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
    headers.update({
        "action": "update_passengers",
        "signature": request.session['airline_signature']
    })

    res = util.send_request(url=url + 'booking/airlines', data=data, headers=headers, method='POST')
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
    headers.update({
        "action": "commit_booking", #get_ssr_availability
        "signature": request.session['airline_signature']
    })

    res = util.send_request(url=url + 'booking/airlines', data=data, headers=headers, method='POST', timeout=300)

    return res

