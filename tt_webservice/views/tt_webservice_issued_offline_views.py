from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
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



@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = signin(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'create_issued_offline':
            res = create_issued_offline(request)
        elif req_data['action'] == 'get_history_issued_offline':
            res = get_history_issued_offline(request)
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

    request.session['issued_offline_signature'] = res['result']['response']['signature']

    return res

def get_data(request):
    file = open("version_cache.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()

    file = open(str(file_cache_name) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()

    res = response['result']['response']['issued_offline']
    # res = search2(request)

    return res

def create_issued_offline(request):

    file = open("version_cache.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()

    file = open(str(file_cache_name) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()

    passenger = []
    contact = []
    line = []

    for i in range(int(request.POST['counter_passenger'])):
        birth_date = ''
        passport_expdate = ''
        if request.POST['passenger_birth_date' + str(i )] != '':
            birth_date = '%s-%s-%s' % (request.POST['passenger_birth_date' + str(i)].split(' ')[2],
                                        month[request.POST['passenger_birth_date' + str(i)].split(' ')[1]],
                                        request.POST['passenger_birth_date' + str(i)].split(' ')[0])
        if request.POST['passenger_passport_expired_date' + str(i)] != '':
            passport_expdate = '%s-%s-%s' % (request.POST['passenger_passport_expired_date' + str(i)].split(' ')[2],
                                        month[request.POST['passenger_passport_expired_date' + str(i)].split(' ')[1]],
                                        request.POST['passenger_passport_expired_date' + str(i)].split(' ')[0])
        pax_type = ''
        if int(request.POST['passenger_years_old' + str(i)]) > 12:
            pax_type = 'ADT'
        elif int(request.POST['passenger_years_old' + str(i)]) >= 2:
            pax_type = 'CHD'
        elif int(request.POST['passenger_years_old' + str(i)]) < 2:
            pax_type = 'INF'
        passenger.append({
            "pax_type": pax_type,
            "first_name": request.POST['passenger_first_name' + str(i)],
            "last_name": request.POST['passenger_last_name' + str(i)],
            "title": request.POST['passenger_title' + str(i)],
            "birth_date": birth_date,
            "nationality_code": request.POST['passenger_nationality_code' + str(i)],
            "country_of_issued_code": request.POST['passenger_country_of_issued' + str(i)],
            "passport_expdate": passport_expdate,
            "passport_number": request.POST['passenger_passport_number' + str(i)],
            'passenger_id': request.POST['passenger_id'+str(i)] != '' and int(request.POST['passenger_id'+str(i)]) or ''
        })
        if request.POST['passenger_cp'+str(i)] == 'true':
            contact.append({
                'title': request.POST['passenger_title' + str(i)],
                'first_name': request.POST['passenger_first_name' + str(i)],
                'last_name': request.POST['passenger_last_name' + str(i)],
                'email': request.POST['passenger_email' + str(i)],
                'calling_code': request.POST['booker_calling_code'],
                'mobile': request.POST['booker_mobile'],
                'nationality_code': request.POST['booker_nationality_code'],
                'contact_id': request.POST['passenger_id'+str(i)] != '' and int(request.POST['passenger_id'+str(i)]) or ''
            })
        else:
            pass

    if len(contact) == 0:
        contact.append({
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'email': request.POST['booker_email'],
            'calling_code': request.POST['booker_calling_code'],
            'mobile': request.POST['booker_mobile'],
            'nationality_code': request.POST['booker_nationality_code'],
            'contact_id': request.POST['booker_id'] != '' and int(request.POST['booker_id']) or ''
        })
    for i in range(int(request.POST['counter_line'])):
        if request.POST['type'] == 'airline' or request.POST['type'] == 'train':
            departure = request.POST['line_departure' + str(i)].split('T')
            arrival = request.POST['line_arrival' + str(i)].split('T')
            if request.POST['type'] == 'airline':
                origin = request.POST['line_origin'+str(i)][-4:][:3]
                destination = request.POST['line_destination'+str(i)][-4:][:3]
            elif request.POST['type'] == 'train':
                origin = request.POST['line_origin' + str(i)].split(' - ')[0]
                destination = request.POST['line_destination' + str(i)].split(' - ')[0]
            line.append({
                "origin": origin,
                "destination": destination,
                "provider": request.POST['line_provider'+str(i)],
                "departure": departure[0]+' '+departure[1],
                "arrival": arrival[0]+' '+arrival[1],
                "carrier_code": request.POST['line_carrier_code'+str(i)],
                "carrier_number": request.POST['line_carrier_number'+str(i)],
                "sub_class": request.POST['line_sub_class'+str(i)],
                "class_of_service": request.POST['line_class_of_service'+str(i)]
            })
        elif request.POST['type'] == 'hotel':
            departure = request.POST['line_hotel_check_in' + str(i)].split('T')
            arrival = request.POST['line_hotel_check_out' + str(i)].split('T')
            line.append({
                "name": request.POST['line_hotel_name' + str(i)],
                "room": request.POST['line_hotel_room' + str(i)],
                "qty": request.POST['line_hotel_qty' + str(i)],
                "check_in": departure[0] + ' ' + departure[1],
                "check_out": arrival[0] + ' ' + arrival[1],
                "description": request.POST['line_hotel_description' + str(i)]
            })
        elif request.POST['type'] == 'activity':
            departure = request.POST['line_activity_datetime' + str(i)].split('T')
            line.append({
                "name": request.POST['line_activity_name' + str(i)],
                "package": request.POST['line_activity_package' + str(i)],
                "qty": request.POST['line_activity_qty' + str(i)],
                "visit_date": departure[0] + ' ' + departure[1],
                "description": request.POST['line_activity_description' + str(i)]
            })

    exp_date = request.POST['expired_date'].split('T')

    data_issued_offline = {
        "type": request.POST['type'],
        "total_sale_price": int(request.POST['total_sale_price']),
        "desc": request.POST['desc'],
        "pnr": request.POST['pnr'],
        "social_media_id": request.POST['social_media'],
        "expired_date": exp_date[0] + ' ' + exp_date[1],
        "line_ids": line
    }

    if request.POST['type'] == 'airline':
        data_issued_offline["sector_type"] = request.POST['sector_type']

    data = {
        "booker": {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'email': request.POST['booker_email'],
            'calling_code': request.POST['booker_calling_code'],
            'mobile': request.POST['booker_mobile'],
            'nationality_code': request.POST['booker_nationality_code'],
            'booker_id': request.POST['booker_id'] != '' and int(request.POST['booker_id']) or ''
        },
        "contact": contact,
        "passenger_ids": passenger,
        "data_issued_offline": data_issued_offline
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_issued_offline",
        "signature": request.session['issued_offline_signature'],
    }
    res = util.send_request(url=url + "booking/issued_offline", data=data, headers=headers, method='POST')
    return res

def get_history_issued_offline(request):
    data = {
        "co_uid": int(request.session['co_uid']),
        "offset": int(request.POST['offset']),
        "limit": 80
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_history_issued_offline",
        "signature": request.session['train_signature'],
    }
    res = util.send_request(url=url + "agent/issued_offline", data=data, cookies=request.session['agent_cookie'], headers=headers, method='POST')
    return res
