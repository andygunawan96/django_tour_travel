from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import logging
import traceback
from .tt_webservice_views import *
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



@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = signin(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'set_data_issued_offline':
            res = set_data_issued_offline(request)
        elif req_data['action'] == 'update_contact':
            res = update_contact(request)
        elif req_data['action'] == 'update_passenger':
            res = update_passenger(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'get_history_issued_offline':
            res = commit_booking(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def signin(request):
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
        request.session['issued_offline_signature'] = res['result']['response']['signature']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        res = response['result']['response']['issued_offline']
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    # res = search2(request)

    return res

def set_data_issued_offline(request):
    try:
        line = []

        for i in range(int(request.POST['counter_line'])):
            if request.POST['type'] == 'airline' or request.POST['type'] == 'train':
                temp_date = request.POST['line_departure' + str(i)].split(' ')
                departure = [temp_date[2]+'-'+month[temp_date[1]]+'-'+temp_date[0], temp_date[3].split(':')[0] + ':' + temp_date[3].split(':')[1]]
                temp_date = request.POST['line_arrival' + str(i)].split(' ')
                arrival = [temp_date[2]+'-'+month[temp_date[1]]+'-'+temp_date[0], temp_date[3].split(':')[0] + ':' + temp_date[3].split(':')[1]]
                if request.POST['type'] == 'airline':
                    origin = request.POST['line_origin'+str(i)][-4:].split(' - ')[0]
                    destination = request.POST['line_destination'+str(i)].split(' - ')[0]
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
        temp_date = request.POST['expired_date'].split(' ')
        exp_date = [temp_date[2] + '-' + month[temp_date[1]] + '-' + temp_date[0],
                     temp_date[3].split(':')[0] + ':' + temp_date[3].split(':')[1]]
        data_issued_offline = {
            "type": request.POST['type'],
            "total_sale_price": int(request.POST['total_sale_price']),
            "desc": request.POST['desc'],
            "pnr": request.POST['pnr'],
            "social_media_id": request.POST['social_media'],
            "expired_date": exp_date[0] + ' ' + exp_date[1],
            "line_ids": line,
            "provider": "skytors_issued_offline"
        }

        if request.POST['type'] == 'airline':
            data_issued_offline["sector_type"] = request.POST['sector_type']

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_data",
            "signature": request.session['issued_offline_signature'],
        }
        data = {
            'data_issued_offline': data_issued_offline
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + "booking/issued_offline", data=data, headers=headers, method='POST')

    return res

def update_contact(request):
    passenger = []
    contact = []
    try:
        for i in range(int(request.POST['counter_passenger'])):
            if request.POST['passenger_cp' + str(i)] == 'true':
                contact.append({
                    'title': request.POST['passenger_title' + str(i)],
                    'first_name': request.POST['passenger_first_name' + str(i)],
                    'last_name': request.POST['passenger_last_name' + str(i)],
                    'email': request.POST['passenger_email' + str(i)],
                    'calling_code': request.POST['booker_calling_code'],
                    'mobile': request.POST['booker_mobile'],
                    'nationality_code': request.POST['booker_nationality_code'],
                    'contact_id': request.POST['passenger_id' + str(i)] != '' and int(request.POST['passenger_id' + str(i)]) or ''
                })
                if i == 0:
                    if request.POST['myRadios'] == 'true':
                        contact[len(contact)-1].update({
                            'is_booker': True
                        })
                    else:
                        contact[len(contact)-1].update({
                            'is_booker': False
                        })
                else:
                    contact[len(contact)-1].update({
                        'is_booker': False
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
                'contact_id': request.POST['booker_id'] != '' and int(request.POST['booker_id']) or '',
                'is_booker': True
            })

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_contact",
            "signature": request.session['issued_offline_signature'],
        }
        data = {
            'booker': {
                'title': request.POST['booker_title'],
                'first_name': request.POST['booker_first_name'],
                'last_name': request.POST['booker_last_name'],
                'email': request.POST['booker_email'],
                'calling_code': request.POST['booker_calling_code'],
                'mobile': request.POST['booker_mobile'],
                'nationality_code': request.POST['booker_nationality_code'],
                'booker_id': request.POST['booker_id'] != '' and int(request.POST['booker_id']) or ''
            },
            'contacts': contact
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/issued_offline", data=data, headers=headers, method='POST')

    return res

def update_passenger(request):
    try:
        passenger = []

        for i in range(int(request.POST['counter_passenger'])):
            birth_date = ''
            passport_expdate = ''
            if request.POST['passenger_birth_date' + str(i)] != '':
                birth_date = '%s-%s-%s' % (request.POST['passenger_birth_date' + str(i)].split(' ')[2],
                                           month[request.POST['passenger_birth_date' + str(i)].split(' ')[1]],
                                           request.POST['passenger_birth_date' + str(i)].split(' ')[0])
            if request.POST['passenger_passport_expired_date' + str(i)] != '':
                passport_expdate = '%s-%s-%s' % (request.POST['passenger_passport_expired_date' + str(i)].split(' ')[2],
                                                 month[request.POST['passenger_passport_expired_date' + str(i)].split(' ')[
                                                     1]],
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
                'passenger_id': request.POST['passenger_id' + str(i)] != '' and int(request.POST['passenger_id' + str(i)]) or ''
            })
            if i == 0:
                if request.POST['myRadios'] == 'true':
                    passenger[len(passenger)-1].update({
                        'is_booker': True
                    })
                else:
                    passenger[len(passenger)-1].update({
                        'is_booker': False
                    })
            else:
                passenger[len(passenger) - 1].update({
                    'is_booker': False
                })
            if request.POST['passenger_cp' + str(i)] == 'true':
                passenger[len(passenger)-1].update({
                    'is_contact': True
                })
            else:
                passenger[len(passenger)-1].update({
                    'is_contact': False
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_passenger",
            "signature": request.session['issued_offline_signature'],
        }
        data = {
            'passengers': passenger
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/issued_offline", data=data, headers=headers, method='POST')

    return res

def commit_booking(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.session['issued_offline_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
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
