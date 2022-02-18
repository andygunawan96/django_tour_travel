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
from ..views import tt_webservice_agent_views as webservice_agent
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
        elif req_data['action'] == 'get_config':
            res = get_config(request)
        elif req_data['action'] == 'create_booking':
            res = create_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'get_all_booking_state_booked':
            res = get_all_booking_state_booked(request)
        elif req_data['action'] == 'update_passenger':
            res = update_passenger(request)
        elif req_data['action'] == 'update_booker':
            res = update_booker(request)
        elif req_data['action'] == 'update_contact':
            res = update_contact(request)
        elif req_data['action'] == 'pick_ticket':
            res = pick_ticket(request)
        elif req_data['action'] == 'check_data_can_sent':
            res = check_data_can_sent(request)
        elif req_data['action'] == 'issued_booking':
            res = issued_booking(request)
        elif req_data['action'] == 'change_state_to_booked':
            res = change_state_to_booked(request)
        elif req_data['action'] == 'change_state_back_to_confirm':
            res = change_state_back_to_confirm(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'booker_insentif_booking':
            res = booker_insentif_booking(request)
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
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'issued_offline_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['issued_offline_signature']))

    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

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
    url_request = url + 'booking/group_booking'
    file = read_cache_with_folder_path("group_booking_cache_data", 86400)
    # TODO VIN: Some Update Mekanisme ontime misal ada perubahan data dkk
    if not file:
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                write_cache_with_folder(res, "group_booking_cache_data")
        except Exception as e:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())
            file = read_cache_with_folder_path("group_booking_cache_data", 90911)
            if file:
                res = file
    else:
        res = file
    return res

def create_booking(request):
    try:
        data = {
            'provider_type': request.POST['provider_type'],
            'provider_data': {
                'pax': {
                    'ADT': request.POST['ADT'],
                    'CHD': request.POST['CHD'],
                    'INF': request.POST['INF']
                },
                'carrier_code': request.POST['carrier_code'],
                'origin': request.POST['origin'],
                'destination': request.POST['destination'],
                'journey_type': request.POST['journey_type'],
                'cabin_class': request.POST['cabin_class'],
                'departure_date': request.POST['departure_date'],
                'return_date': request.POST['return_date'],
                'description': request.POST['description']
            }
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_service_charge ISSUED OFFLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_airline ISSUED OFFLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def get_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        airline_destinations = []
        file = read_cache_with_folder_path("airline_destination", 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country'],
            })
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

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            nationality_code = ''
            javascript_version = get_cache_version()
            response = get_cache_data(javascript_version)

            for rec in res['result']['response']['ticket_list']:
                rec.update({
                    'departure_date': convert_string_to_date_to_string_front_end_with_time(rec['departure_date']),
                    'arrival_date': convert_string_to_date_to_string_front_end_with_time(rec['arrival_date']),
                })
                for segment in rec['segments']:
                    segment.update({
                        'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']),
                        'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']),
                    })
                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                        })
                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break

            for rec in res['result']['response']['passengers']:
                count = 0
                for country in response['result']['response']['airline']['country']:
                    if rec['nationality_code'] == country['code']:
                        rec['nationality_name'] = country['name']
                        count += 1
                    if rec['identity_country_of_issued_code'] == country['code']:
                        rec['identity_country_of_issued_name'] = country['name']
                        count += 1
                    if count == 2:
                        break

            if res['result']['response'].get('price_pick_departure'):
                res['result']['response']['price_pick_departure']['departure_date'] = convert_string_to_date_to_string_front_end_with_time('%s' % res['result']['response']['price_pick_departure']['departure_date'])
                res['result']['response']['price_pick_departure']['arrival_date'] = convert_string_to_date_to_string_front_end_with_time('%s' % res['result']['response']['price_pick_departure']['arrival_date'])
                for segment in res['result']['response']['price_pick_departure']['segments']:
                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                        })
                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break
            if res['result']['response'].get('price_pick_return'):
                res['result']['response']['price_pick_return']['departure_date'] = convert_string_to_date_to_string_front_end_with_time('%s' % res['result']['response']['price_pick_return']['departure_date'])
                res['result']['response']['price_pick_return']['arrival_date'] = convert_string_to_date_to_string_front_end_with_time('%s' % res['result']['response']['price_pick_return']['arrival_date'])
                for segment in res['result']['response']['price_pick_return']['segments']:
                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                        })
                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break
            if res['result']['response']['request'].get('departure_date'):
                res['result']['response']['request']['departure_date'] = convert_string_to_date_to_string_front_end(res['result']['response']['request']['departure_date'])
            if res['result']['response']['request'].get('return_date'):
                res['result']['response']['request']['return_date'] = convert_string_to_date_to_string_front_end(res['result']['response']['request']['return_date'])

            for provider in res['result']['response']['provider_bookings']:
                for segment in provider['ticket']['segments']:
                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                        })
                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break

            set_session(request, 'groupbooking_get_booking_response', res)
            _logger.info(json.dumps(request.session['offline_get_booking_response']))
            _logger.info("SUCCESS get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error(
                "ERROR get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_all_booking_state_booked(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_all_booking_state_booked",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:

            set_session(request, 'offline_get_booking_response', res)
            _logger.info(json.dumps(request.session['offline_get_booking_response']))
            _logger.info("SUCCESS get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error(
                "ERROR get_booking ISSUED OFFLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_passenger(request):
    # nanti ganti ke get_ssr_availability
    try:
        nationality_code = ''
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)


        pax = json.loads(request.POST['passengers'])
        for rec in pax:
            for country in response['result']['response']['airline']['country']:
                if rec['nationality_code'] == country['name']:
                    nationality_code = country['code']
                    break
            rec['nationality_code'] = nationality_code
            if rec.get('identity'):
                for country in response['result']['response']['airline']['country']:
                    if rec['identity']['identity_country_of_issued_name'] == country['name']:
                        nationality_code = country['code']
                        break
                rec['identity']['identity_country_of_issued_code'] = nationality_code
        data = {
            'order_number': request.POST['order_number'],
            "passengers": pax
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_passenger",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            pass
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_booker(request):
    # nanti ganti ke get_ssr_availability
    try:
        nationality_code = ''
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        for country in response['result']['response']['airline']['country']:
            if request.POST['nationality'] == country['name']:
                nationality_code = country['code']
                break
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number'],
            "booker": {
                "title": request.POST['title'],
                "first_name": request.POST['first_name'],
                "last_name": request.POST['last_name'],
                "email": request.POST['email'],
                "calling_code": request.POST['calling_code'],
                "mobile": request.POST['mobile'],
                "booker_seq_id": request.POST.get('booker_seq_id', ''),
                "nationality_code": nationality_code
            }
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_booker",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            pass
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_contact(request):
    # nanti ganti ke get_ssr_availability
    try:
        nationality_code = ''
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        for country in response['result']['response']['airline']['country']:
            if request.POST['nationality'] == country['name']:
                nationality_code = country['code']
                break
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number'],
            "contacts": [
                {
                    "title": request.POST['title'],
                    "first_name": request.POST['first_name'],
                    "last_name": request.POST['last_name'],
                    "email": request.POST['email'],
                    "calling_code": request.POST['calling_code'],
                    "mobile": request.POST['mobile'],
                    "contact_seq_id": request.POST['contact_seq_id'],
                    "is_also_booker": request.POST['is_also_booker'],
                    "nationality_code": nationality_code
                }
            ]
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_contact",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            pass
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def pick_ticket(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number'],
            'fare_seq_id_list': json.loads(request.POST['fare_seq_id_list']),
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pick_ticket",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            pass
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def check_data_can_sent(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "check_data_can_sent_api",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            pass
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def change_state_back_to_confirm(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "change_state_back_to_confirm",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            pass
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def change_state_to_booked(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            # 'order_number': 'TB.190329533467'
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "change_state_to_booked",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            pass
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

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_service_charge ISSUED OFFLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_airline ISSUED OFFLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['upsell_booker_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge_booker Issued Offline SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_offline_booker Issued Offline SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def issued_booking(request):
    try:
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data = {
            'order_number': request.POST['order_number'],
            'payment_method': request.POST['payment_method'],
            'member': member,
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'voucher': {}
        }
        provider = []

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'group_booking', provider),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/group_booking'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued TOUR SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued TOUR SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res