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
from .tt_webservice import *
from .tt_webservice_voucher_views import *
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
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'validate':
            res = validate(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
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
            set_session(request, 'issued_offline_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['issued_offline_signature']))

    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

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
                if temp_date[4] == 'PM' and temp_date[3].split(':')[0] != '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') + timedelta(hours=12))
                    temp_date[3] = temp_date[3].split(' ')[1]
                if temp_date[4] == 'AM' and temp_date[3].split(':')[0] == '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') - timedelta(hours=12))
                departure = [temp_date[2]+'-'+month[temp_date[1]]+'-'+temp_date[0], temp_date[3].split(':')[0] + ':' + temp_date[3].split(':')[1]]
                temp_date = request.POST['line_arrival' + str(i)].split(' ')
                if temp_date[4] == 'PM' and temp_date[3].split(':')[0] != '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') + timedelta(hours=12))
                    temp_date[3] = temp_date[3].split(' ')[1]
                if temp_date[4] == 'AM' and temp_date[3].split(':')[0] == '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') - timedelta(hours=12))
                arrival = [temp_date[2]+'-'+month[temp_date[1]]+'-'+temp_date[0], temp_date[3].split(':')[0] + ':' + temp_date[3].split(':')[1]]
                if request.POST['type'] == 'airline':
                    origin = request.POST['line_origin'+str(i)].split(' - ')[0]
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
                    "class_of_service": request.POST['line_class_of_service'+str(i)],
                    "pnr": request.POST['line_pnr'+str(i)],
                })
            elif request.POST['type'] == 'hotel':
                temp_date = request.POST['line_hotel_check_in' + str(i)].split(' ')
                if temp_date[4] == 'PM' and temp_date[3].split(':')[0] != '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') + timedelta(hours=12))
                    temp_date[3] = temp_date[3].split(' ')[1]
                departure = [temp_date[2] + '-' + month[temp_date[1]] + '-' + temp_date[0]]
                temp_date = request.POST['line_hotel_check_out' + str(i)].split(' ')
                if temp_date[4] == 'PM' and temp_date[3].split(':')[0] != '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') + timedelta(hours=12))
                    temp_date[3] = temp_date[3].split(' ')[1]
                arrival = [temp_date[2] + '-' + month[temp_date[1]] + '-' + temp_date[0]]
                line.append({
                    "name": request.POST['line_hotel_name' + str(i)],
                    "room": request.POST['line_hotel_room' + str(i)],
                    "qty": request.POST['line_hotel_qty' + str(i)],
                    "check_in": departure[0],
                    "check_out": arrival[0],
                    "description": request.POST['line_hotel_description' + str(i)],
                    "pnr": request.POST['line_pnr' + str(i)],
                })
            elif request.POST['type'] == 'activity':
                temp_date = request.POST['line_activity_datetime' + str(i)].split(' ')
                if temp_date[4] == 'PM' and temp_date[3].split(':')[0] != '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') + timedelta(hours=12))
                    temp_date[3] = temp_date[3].split(' ')[1]
                if temp_date[4] == 'AM' and temp_date[3].split(':')[0] == '12':
                    temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') - timedelta(hours=12))
                departure = [temp_date[2] + '-' + month[temp_date[1]] + '-' + temp_date[0], temp_date[3].split(':')[0] + ':' + temp_date[3].split(':')[1]]
                line.append({
                    "name": request.POST['line_activity_name' + str(i)],
                    "package": request.POST['line_activity_package' + str(i)],
                    "qty": request.POST['line_activity_qty' + str(i)],
                    "visit_date": departure[0],
                    "description": request.POST['line_activity_description' + str(i)],
                    "pnr": request.POST['line_pnr' + str(i)],
                })
            else:
                line.append({
                    "pnr": request.POST['line_pnr' + str(i)],
                    "description": request.POST['line_other_description' + str(i)],
                })
        temp_date = request.POST['expired_date'].split(' ')
        if temp_date[4] == 'PM':
            temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') + timedelta(hours=12))
            temp_date[3] = temp_date[3].split(' ')[1]
        if temp_date[4] == 'AM' and temp_date[3].split(':')[0] == '12':
            temp_date[3] = str(datetime.strptime(temp_date[3], '%H:%M:%S') - timedelta(hours=12))
        exp_date = [temp_date[2] + '-' + month[temp_date[1]] + '-' + temp_date[0],temp_date[3].split(':')[0] + ':' + temp_date[3].split(':')[1]]

        quick_validate = True
        if request.POST['quick_validate'] == 'false':
            quick_validate = False

        data_issued_offline = {
            "type": request.POST['type'],
            "total_sale_price": int(request.POST['total_sale_price']),
            "desc": request.POST['desc'],
            "social_media_id": request.POST['social_media'],
            "expired_date": exp_date[0]+' '+exp_date[1],
            "line_ids": line,
            "quick_validate": quick_validate,
            "provider": "rodextrip_issued_offline"
        }

        if request.POST['type'] == 'airline':
            data_issued_offline["sector_type"] = request.POST['sector_type']
        set_session(request, 'sell_journey_io', data_issued_offline)
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

    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS set_data_issued_offline SIGNATURE " + request.session['issued_offline_signature'])
        else:
            _logger.error("ERROR set_data_issued_offline SIGNATURE " + request.session['issued_offline_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_contact(request):
    contact = []
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)
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
                    'nationality_name': request.POST['booker_nationality_code'],
                    'contact_seq_id': request.POST['passenger_id' + str(i)] != '' and request.POST['passenger_id' + str(i)] or ''
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
                'nationality_name': request.POST['booker_nationality_code'],
                'contact_seq_id': request.POST['booker_id'] != '' and request.POST['booker_id'] or '',
                'is_booker': True
            })

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_contact",
            "signature": request.session['issued_offline_signature'],
        }
        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'email': request.POST['booker_email'],
            'calling_code': request.POST['booker_calling_code'],
            'mobile': request.POST['booker_mobile'],
            'nationality_name': request.POST['booker_nationality_code'],
            'booker_seq_id': request.POST['booker_id'] != '' and request.POST['booker_id'] or ''
        }

        for country in response['result']['response']['airline']['country']:
            if booker['nationality_name'] == country['name']:
                booker['nationality_code'] = country['code']
                break

        for pax in contact:
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        data = {
            'booker': booker,
            'contacts': contact
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/issued_offline", data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_contact_issued_offline SIGNATURE " + request.session['issued_offline_signature'])
        else:
            _logger.error("ERROR update_contact_issued_offline SIGNATURE " + request.session['issued_offline_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def calculateAge(birthDate):
    today = date.today()
    age = today.year - birthDate.year -((today.month, today.day) < (birthDate.month, birthDate.day))
    return age

def update_passenger(request):
    try:
        passenger = []
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        for i in range(int(request.POST['counter_passenger'])):
            try:
                birth_date = ''
                passport_expdate = ''
                if request.POST['passenger_birth_date' + str(i)] != '':
                    birth_date = '%s-%s-%s' % (request.POST['passenger_birth_date' + str(i)].split(' ')[2],
                                               month[request.POST['passenger_birth_date' + str(i)].split(' ')[1]],
                                               request.POST['passenger_birth_date' + str(i)].split(' ')[0])
                try:
                    if request.POST['passenger_identity_expired_date' + str(i)] != '':
                        passport_expdate = '%s-%s-%s' % (request.POST['passenger_identity_expired_date' + str(i)].split(' ')[2],
                                                         month[request.POST['passenger_identity_expired_date' + str(i)].split(' ')[1]],
                                                         request.POST['passenger_identity_expired_date' + str(i)].split(' ')[0])
                except:
                    _logger.error(msg=str('no identity issued_offline update_passengers') + '\n')
                pax_type = calculateAge(datetime(int(birth_date.split('-')[0]), int(birth_date.split('-')[1]), int(birth_date.split('-')[2])))
                if pax_type > 12:
                    pax_type = 'ADT'
                elif pax_type >= 2:
                    pax_type = 'CHD'
                elif pax_type < 2:
                    pax_type = 'INF'
                if request.POST['passenger_nationality_code' + str(i)] != '':
                    for country in response['result']['response']['airline']['country']:
                        if request.POST['passenger_nationality_code' + str(i)] == country['name']:
                            nationality_code = country['code']
                            break
                passenger.append({
                    "pax_type": pax_type,
                    "first_name": request.POST['passenger_first_name' + str(i)],
                    "last_name": request.POST['passenger_last_name' + str(i)],
                    "title": request.POST['passenger_title' + str(i)],
                    "birth_date": birth_date,
                    "nationality_code": nationality_code,
                    'passenger_seq_id': request.POST['passenger_id' + str(i)] != '' and request.POST['passenger_id' + str(i)] or ''
                })
                try:
                    if request.POST['passenger_identity_type' + str(i)] != '':
                        identity = {}
                        if request.POST['passenger_identity_number' + str(i)]:
                            identity['identity_number'] = request.POST['passenger_identity_number' + str(i)]
                        if request.POST['passenger_identity_type' + str(i)]:
                            identity['identity_type'] = request.POST['passenger_identity_type' + str(i)]
                        identity["identity_expdate"] = passport_expdate

                        if request.POST['passenger_country_of_issued' + str(i)] != '':
                            for country in response['result']['response']['airline']['country']:
                                if request.POST['passenger_country_of_issued' + str(i)] == country['code']:
                                    country_of_issued_code = country['code']
                                    break
                            identity["identity_country_of_issued_code"] = country_of_issued_code

                        passenger[len(passenger)-1].update({
                            'identity': identity
                        })
                except Exception as e:
                    pass
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
            except:
                pass
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
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_passenger_issued_offline SIGNATURE " + request.session['issued_offline_signature'])
        else:
            _logger.error("ERROR update_passenger_issued_offline SIGNATURE " + request.session['issued_offline_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    try:
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data = {
            'member': member,
            'seq_id': request.POST['seq_id'],
            'voucher': {}
        }
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], request.session['sell_journey_io']['type'], []),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.session['issued_offline_signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    res = util.send_request(url=url + "booking/issued_offline", data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit_booking_issued_offline SIGNATURE " + request.session['issued_offline_signature'])
        else:
            _logger.error("ERROR commit_booking_issued_offline SIGNATURE " + request.session['issued_offline_signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/issued_offline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            for line in res['result']['response']['lines']:
                if res['result']['response']['offline_provider_type'] == 'airline' or res['result']['response']['offline_provider_type'] == 'train':
                    if line['departure_date']:
                        line.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(line['departure_date'] + ':00'),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(line['arrival_date'] + ':00'),
                        })
                elif res['result']['response']['offline_provider_type'] == 'activity':
                    if line['visit_date']:
                        line.update({
                            'visit_date': convert_string_to_date_to_string_front_end(line['visit_date'].split(' ')[0]),
                        })
                elif res['result']['response']['offline_provider_type'] == 'hotel':
                    if line['check_in']:
                        line.update({
                            'check_in': convert_string_to_date_to_string_front_end(line['check_in']),
                        })
                    if line['check_out']:
                        line.update({
                            'check_out': convert_string_to_date_to_string_front_end(line['check_out']),
                        })
            set_session(request, 'offline_get_booking_response', res)
            _logger.info(json.dumps(request.session['offline_get_booking_response']))
            _logger.info("SUCCESS get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def validate(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "validate",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/issued_offline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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

    res = util.send_request(url=url + 'booking/issued_offline', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_service_charge ISSUED OFFLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_airline ISSUED OFFLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res