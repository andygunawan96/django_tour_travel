from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import datetime, date
from tools.parser import *
from ..static.tt_webservice.url import *
from .tt_webservice_views import *
from ..views import tt_webservice_agent_views as webservice_agent
# from ..views import tt_webservice_content_views as webservice_content
from .tt_webservice_voucher_views import *
from .tt_webservice import *
import base64
import json
import logging
import traceback
import copy
import time
import math
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
        elif req_data['action'] == 're_order_set_airline_request':
            res = re_order_set_airline_request(request)
        elif req_data['action'] == 'save_allowed_config_search':
            res = save_allowed_config_search(request)
        elif req_data['action'] == 'get_allowed_config_search':
            res = get_allowed_config_search(request)
        elif req_data['action'] == 'get_all_carrier_airline':
            res = get_all_carrier_airline(request)
        elif req_data['action'] == 'set_airline_pick':
            res = set_airline_pick(request)
        elif req_data['action'] == 're_order_set_passengers':
            res = re_order_set_passengers(request)
        elif req_data['action'] == 're_order_set_pax_signature':
            res = re_order_set_pax_signature(request)
        elif req_data['action'] == 'get_data_search_page':
            res = get_data_search_page(request)
        elif req_data['action'] == 'get_data_passenger_page':
            res = get_data_passenger_page(request)
        elif req_data['action'] == 'get_data_review_page':
            res = get_data_review_page(request)
        elif req_data['action'] == 'get_data_review_after_sales_page':
            res = get_data_review_after_sales_page(request)
        elif req_data['action'] == 'get_data_book_page':
            res = get_data_book_page(request)
        elif req_data['action'] == 'get_data_ssr_page':
            res = get_data_ssr_page(request)
        elif req_data['action'] == 'get_data_seat_page':
            res = get_data_seat_page(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'get_provider_list_backend':
            res = get_provider_list_backend(request)
        elif req_data['action'] == 'get_frequent_flyer_all_data':
            res = get_frequent_flyer_all_data(request)
        elif req_data['action'] == 'get_carrier_providers':
            res = get_carrier_providers(request)
        elif req_data['action'] == 'get_carriers_search':
            res = get_carriers_search(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'get_provider_description':
            res = get_provider_description(request)
        elif req_data['action'] == 'get_carrier_code_list':
            res = get_carrier_code_list(request)
        elif req_data['action'] == 'search':
            res = search2(request)
        elif req_data['action'] == 'get_price_itinerary':
            res = get_price_itinerary(request, False, 1)
        elif req_data['action'] == 'get_fare_rules':
            res = get_fare_rules(request)
        elif req_data['action'] == 'sell_journeys':
            res = sell_journeys(request)
        elif req_data['action'] == 'get_ssr_availability':
            res = get_ssr_availability(request)
        elif req_data['action'] == 'get_seat_availability':
            res = get_seat_availability(request)
        elif req_data['action'] == 'get_post_ssr_availability':
            res = get_post_ssr_availability(request)
        elif req_data['action'] == 'get_post_seat_availability':
            res = get_post_seat_availability(request)
        elif req_data['action'] == 'get_ff_availability':
            res = get_ff_availability(request)
        elif req_data['action'] == 'get_seat_map_response':
            res = get_seat_map_response(request)
        elif req_data['action'] == 'get_pax':
            res = get_pax(request)
        elif req_data['action'] == 'update_contacts':
            res = update_contacts(request)
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'sell_ssrs':
            res = sell_ssrs(request)
        elif req_data['action'] == 'assign_seats':
            res = assign_seats(request)
        elif req_data['action'] == 'sell_post_ssrs':
            res = sell_post_ssrs(request)
        elif req_data['action'] == 'assign_post_seats':
            res = assign_post_seats(request)
        elif req_data['action'] == 'update_booking':
            res = update_booking(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'commit_booking_vendor':
            res = commit_booking_vendor(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'booker_insentif_booking':
            res = booker_insentif_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'get_airline_reprice':
            res = get_airline_reprice(request)
        elif req_data['action'] == 'issued':
            res = issued(request)
        elif req_data['action'] == 'cancel':
            res = cancel(request)
        elif req_data['action'] == 'update_refund_booking':
            res = update_refund_booking(request)
        elif req_data['action'] == 'reissue':
            res = reissue(request)
        elif req_data['action'] == 'get_price_reissue_construct':
            res = get_price_reissue_construct(request, False, 1)
        elif req_data['action'] == 'sell_journey_reissue_construct':
            res = sell_journey_reissue_construct(request, False, 1)
        elif req_data['action'] == 'command_cryptic':
            res = command_cryptic(request)
        elif req_data['action'] == 'get_refund_booking':
            res = get_refund_booking(request)
        elif req_data['action'] == 'pre_refund_login':
            res = pre_refund_login(request)
        elif req_data['action'] == 'get_provider_booking_from_vendor':
            res = get_provider_booking_from_vendor(request)
        elif req_data['action'] == 'get_retrieve_booking_from_vendor':
            res = get_retrieve_booking_from_vendor(request)
        elif req_data['action'] == 'save_retrieve_booking_from_vendor':
            res = save_retrieve_booking_from_vendor(request)
        elif req_data['action'] == 'get_new_ori_ticket':
            res = get_new_ori_ticket(request)

        ## change identity
        elif req_data['action'] == 'update_post_pax_identity':
            res = update_post_pax_identity(request)
        elif req_data['action'] == 'update_post_pax_name':
            res = update_post_pax_name(request)


        # V2
        elif req_data['action'] == 'get_reschedule_availability_v2':
            res = get_reschedule_availability_v2(request)
        elif req_data['action'] == 'get_reschedule_itinerary_v2':
            res = get_reschedule_itinerary_v2(request)
        elif req_data['action'] == 'sell_reschedule_v2':
            res = sell_reschedule_v2(request)

        elif req_data['action'] == 'split_booking_v2':
            res = split_booking_v2(request)

        elif req_data['action'] == 'get_post_ssr_availability_v2':
            res = get_post_ssr_availability_v2(request)
        elif req_data['action'] == 'sell_post_ssrs_v2':
            res = sell_post_ssrs_v2(request)

        elif req_data['action'] == 'get_post_seat_availability_v2':
            res = get_post_seat_availability_v2(request)
        elif req_data['action'] == 'assign_post_seats_v2':
            res = assign_post_seats_v2(request)

        elif req_data['action'] == 'update_booking_v2':
            res = update_booking_v2(request)

        elif req_data['action'] == 'pre_refund_login_v2':
            res = pre_refund_login_v2(request)
        elif req_data['action'] == 'get_cancel_booking':
            res = get_cancel_booking(request)
        elif req_data['action'] == 'update_refund_booking_v2':
            res = update_refund_booking_v2(request)

        elif req_data['action'] == 'cancel_v2':
            res = cancel_v2(request)
        elif req_data['action'] == 'apply_pax_name_booking':
            res = apply_pax_name_booking(request)

        elif req_data['action'] == 'search_for_mobile':
            res = search_mobile(request)
        elif req_data['action'] == 'reschedule_search_mobile':
            res = reschedule_search_mobile(request)
        elif req_data['action'] == 'get_airline_advance_pax_type':
            res = get_airline_advance_pax_type(request)

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
            "action": "refresh_session",
            "signature": request.session['master_signature']
        }
        # user_global, password_global, api_key = get_credential(request)
        # user_default, password_default = get_credential_user_default(request)
        # data = {
        #     "user": user_global,
        #     "password": password_global,
        #     "api_key": api_key,
        #     # "co_user": request.session['username'],
        #     # "co_password": request.session['password'],
        #     "co_user": request.session.get('username') or user_default,
        #     "co_password": request.session.get('password') or password_default,
        #     "co_uid": ""
        # }
        data = {}

        # otp_params = {}
        # if request.POST.get('unique_id'):
        #     otp_params['machine_code'] = request.POST['unique_id']
        # if request.POST.get('platform'):
        #     otp_params['platform'] = request.POST['platform']
        # if request.POST.get('browser'):
        #     otp_params['browser'] = request.POST['browser']
        # if request.POST.get('timezone'):
        #     otp_params['timezone'] = request.POST['timezone']
        # if otp_params:
        #     data['otp_params'] = otp_params
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('session')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'airline', 20, res['result']['response']['signature'])
            # set_session(request, 'airline_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.POST.get('frontend_signature'):
                write_cache_file(request, res['result']['response']['signature'], 'airline_frontend_signature',request.POST['frontend_signature'])
                write_cache_file(request, request.POST['frontend_signature'], 'airline_signature',res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info("SIGNIN AIRLINE SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def re_order_set_airline_request(request):
    try:
        ## UNTUK REORDER SAMPAI PASSENGER
        write_cache_file(request, request.POST['signature'], 'airline_request', json.loads(request.POST['airline_request']))
        # set_session(request, 'airline_request_%s' % request.POST['signature'], json.loads(request.POST['airline_request']))
        ## UNTUK REORDER KEMBALI KE SEARCH KARENA TIDAK JADWAL YG SAMA HABIS / TIDAK KETEMU, BELUM ADA SIGNATURE
        write_cache_file(request, '', 'airline_request',json.loads(request.POST['airline_request']))
        # set_session(request, 'airline_request', json.loads(request.POST['airline_request']))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return ERR.get_no_error_api()

def set_airline_pick(request):
    try:
        write_cache_file(request, request.POST['signature'], 'airline_pick', json.loads(request.POST['airline_pick']))
        # set_session(request, 'airline_pick_%s' % request.POST['signature'], json.loads(request.POST['airline_pick']))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return ERR.get_no_error_api()

def get_age(birthdate):
    today = date.today()
    age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
    return age

def re_order_set_passengers(request):
    try:
        adult = []
        child = []
        infant = []
        seaman = []
        labour = []
        student = []
        contact = []
        data_booker = json.loads(request.POST['booker'])
        data_pax = json.loads(request.POST['pax'])
        title = 'MR'
        if data_booker['gender'] == 'male':
            title = 'MR'
        elif data_booker['gender'] == 'female' and data_booker['marital_status'] in ['','single']:
            title = 'MS'
        elif data_booker['gender'] == 'female' and data_booker['marital_status'] != '':
            title = 'MRS'
        booker = {
            "title": title,
            "first_name": data_booker['first_name'],
            "last_name": data_booker['last_name'],
            "email": data_booker['email'],
            "calling_code": data_booker['phones'][0]['calling_code'],
            "mobile": data_booker['phones'][0]['calling_number'],
            "nationality_code": data_booker['nationality_code'],
            "nationality_name": data_booker['nationality_name'],
            "booker_seq_id": data_booker['seq_id']
        }
        for pax in data_pax:
            if pax['gender'] == 'male':
                if pax['pax_type'] in ['ADT', 'YCD', 'LBR', 'STU', 'SEA']:
                    title = 'MR'
                else:
                    title = 'MSTR'
            elif pax['gender'] == 'female' and pax['pax_type'] not in ['ADT', 'YCD', 'LBR', 'STU', 'SEA']:
                title = 'MISS'
            elif pax['gender'] == 'female' and data_booker['marital_status'] in ['','single']:
                title = 'MS'
            else:
                title = 'MRS'
            data_pax_dict = {
                "pax_type": pax['pax_type'],
                "first_name": pax['first_name'],
                "last_name": pax['last_name'],
                "title": title,
                "birth_date": pax['birth_date'],
                "nationality_name": pax['nationality_name'],
                "nationality_code": pax['nationality_code'],
                "identity_country_of_issued_name": pax['identity_country_of_issued_name'] if pax['identity_country_of_issued_code'] != '' else '',
                "identity_country_of_issued_code": pax['identity_country_of_issued_code'] if pax['identity_country_of_issued_code'] != '' else '',
                "identity_expdate": convert_string_to_date_to_string_front_end(pax['identity_expdate']) if pax['identity_expdate'] != '' and pax['identity_expdate'] != False else '',
                "identity_number": pax['identity_number'],
                "identity_first_name": pax['identity_first_name'],
                "identity_last_name": pax['identity_last_name'],
                "passenger_seq_id": pax['seq_id'],
                "identity_type": pax['identity_type'],
                "ff_numbers": [],
                "behaviors": pax['behaviors'],
                "identity_image": [],
                "passenger_number": pax['passenger_number']
            }
            if pax['pax_type'] in ['YCD', 'ADT']:
                adult.append(data_pax_dict)
            elif pax['pax_type'] == 'CHD':
                child.append(data_pax_dict)
            elif pax['pax_type'] == 'INF':
                infant.append(data_pax_dict)
            elif pax['pax_type'] == 'LBR':
                labour.append(data_pax_dict)
            elif pax['pax_type'] == 'STU':
                student.append(data_pax_dict)
            elif pax['pax_type'] == 'SEA':
                seaman.append(data_pax_dict)
        airline_create_passengers = {
            'booker': booker,
            'adult': adult,
            'child': child,
            'infant': infant,
            'contact': contact,
            'seaman': seaman,
            'labour': labour,
            'student': student,
        }
        ## UNTUK REORDER SAMPAI PASSENGER
        write_cache_file(request, request.POST['signature'], 'airline_create_passengers', airline_create_passengers)
        # set_session(request, 'airline_create_passengers_%s' % request.POST['signature'], airline_create_passengers)
        ## UNTUK REORDER KEMBALI KE SEARCH KARENA TIDAK JADWAL YG SAMA HABIS / TIDAK KETEMU, BELUM ADA SIGNATURE
        write_cache_file(request, request.POST['signature'], 'airline_create_passengers', airline_create_passengers)
        # set_session(request, 'airline_create_passengers',airline_create_passengers)
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return ERR.get_no_error_api()

def re_order_set_pax_signature(request):
    try:
        # airline_create_passengers = request.session['airline_create_passengers']
        airline_create_passengers = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        # request.session['airline_create_passengers']
        write_cache_file(request, request.POST['signature'], 'airline_create_passengers', airline_create_passengers)
        # set_session(request, 'airline_create_passengers_%s' % request.POST['signature'], airline_create_passengers)
        res = ERR.get_no_error_api()
    except:
        res = ERR.get_error_api(500)
    return res

def get_data_search_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['frontend_signature'], 'airline_request')
        if file:
            res['airline_request'] = file
        else:
            file = read_cache_file(request, '', 'airline_request')
            if file:
                res['airline_request'] = file

        file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        if file:
            res['airline_all_carriers'] = file

        file = read_cache_file(request, request.POST['frontend_signature'], 'airline_carriers_request')
        if file:
            res['airline_carriers'] = file
        # res['airline_carriers'] = request.session.get('airline_carriers_request')
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_passenger_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_request')
        if file:
            res['airline_request'] = file
        # res['airline_request'] = request.session['airline_request_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            res['pax_cache'] = file
        # if request.session.get('airline_create_passengers_%s' % request.POST['signature']):
        #     res['pax_cache'] = request.session['airline_create_passengers_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'airline_get_ssr')
        if file:
            res['ssr'] = file
        # res['ssr'] = request.session.get('airline_get_ssr_%s' % request.POST['signature'])

        file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
        if file:
            res['airline_pick'] = file['sell_journey_provider']
        # res['airline_pick'] = request.session['airline_sell_journey_%s' % request.POST['signature']]['sell_journey_provider']

        file = read_cache_file(request, request.POST['signature'], 'airline_get_price_request')
        if file:
            res['airline_get_price_request'] = file
        # res['airline_get_price_request'] = request.session['airline_get_price_request_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
        if file:
            res['price_itinerary'] = file
        # res['price_itinerary'] = request.session['airline_sell_journey_%s' % request.POST['signature']]

        file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        if file:
            res['airline_carriers'] = file

        file = read_cache_file(request, request.POST['signature'], 'airline_get_ssr')
        if file:
            if file['result']['error_code'] == 0:
                for idx, rec in enumerate(file['result']['response']['ssr_availability_provider']):
                    if rec['status'] == 'available':
                        res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = True
                    else:
                        res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = False
        # if request.session.get('airline_get_ssr_%s' % request.POST['signature']):
        #     if request.session['airline_get_ssr_%s' % request.POST['signature']]['result']['error_code'] == 0:
        #         for idx, rec in enumerate(request.session['airline_get_ssr_%s' % request.POST['signature']]['result']['response']['ssr_availability_provider']):
        #             if rec['status'] == 'available':
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = True
        #             else:
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = False

        file = read_cache_file(request, request.POST['signature'], 'airline_get_seat_availability')
        if file:
            if file['result']['error_code'] == 0:
                for idx, rec in enumerate(file['result']['response']['seat_availability_provider']):
                    if rec['status'] == 'available':
                        res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = True
                    else:
                        res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = False

        # if request.session.get('airline_get_seat_availability_%s' % request.POST['signature']):
        #     if request.session['airline_get_seat_availability_%s' % request.POST['signature']]['result']['error_code'] == 0:
        #         for idx, rec in enumerate(request.session['airline_get_seat_availability_%s' % request.POST['signature']]['result']['response']['seat_availability_provider']):
        #             if rec['status'] == 'available':
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = True
        #             else:
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = False

        file = read_cache_file(request, request.POST['signature'], 'airline_get_ff_availability')
        res['ff_request'] = file['result']['response']['ff_availability_provider'] if file['result']['response'] else []
        res = ERR.get_no_error_api(res)
        # res['ff_request'] = request.session['airline_get_ff_availability_%s' % request.POST['signature']]['result']['response']['ff_availability_provider'] if request.session['airline_get_ff_availability_%s' % request.POST['signature']]['result']['response'] else []
    except Exception as e:
        ## BUAT AFTER SALES SUPAYA TAU PENERBANGAN KAPAN
        _logger.error(str(e) + '\n' + traceback.format_exc())
        try:
            file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
            if file:
                res['airline_pick'] = file['result']['response']['provider_bookings']
            # res['airline_pick'] = request.session['airline_get_booking_response']['result']['response']['provider_bookings']
        except Exception as e:
            res = ERR.get_error_api(500)
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_review_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
        if file:
            res['airline_pick'] = file['sell_journey_provider']
        # res['airline_pick'] = request.session['airline_sell_journey_%s' % request.POST['signature']]['sell_journey_provider']

        file = read_cache_file(request, request.POST['signature'], 'airline_request')
        if file:
            res['airline_request'] = file
        # res['airline_request'] = request.session['airline_request_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
        if file:
            res['price_itinerary'] = file
        # res['price_itinerary'] = request.session['airline_sell_journey_%s' % request.POST['signature']]

        file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        if file:
            res['airline_carriers'] = file

        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            res['passengers'] = file
        # res['passengers'] = request.session['airline_create_passengers_%s' % request.POST['signature']]

        passenger = []

        if file:
            for pax_type in file:
                if pax_type not in ['infant', 'booker', 'contact']:
                    for pax in file[pax_type]:
                        passenger.append(pax)
        res['passengers_ssr'] = passenger

        file = read_cache_file(request, request.POST['signature'], 'airline_request')
        if file:
            res['airline_request'] = file
        # res['airline_request'] = request.session['airline_request_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_request')
        if file:
            res['airline_ssr_request'] = file
        else:
            res['airline_ssr_request'] = {}
        # res['airline_ssr_request'] = request.session['airline_ssr_request_%s' % request.POST['signature']] if request.session.get('airline_ssr_request_%s' % request.POST['signature']) else {}

        file = read_cache_file(request, request.POST['signature'], 'airline_seat_request')
        if file:
            res['airline_seat_request'] = file
        else:
            res['airline_seat_request'] = {}
        # res['airline_seat_request'] = request.session['airline_seat_request_%s' % request.POST['signature']] if request.session.get('airline_seat_request_%s' % request.POST['signature']) else {}

        file = read_cache_file(request, request.POST['signature'], 'airline_upsell')
        if file:
            res['upsell_price_dict'] = file
        else:
            res['upsell_price_dict'] = {}
        # res['upsell_price_dict'] = request.session.get('airline_upsell_%s' % request.POST['signature']) and request.session.get('airline_upsell_%s' % request.POST['signature']) or {}

        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_upsell')
        if file:
            res['upsell_price_dict_ssr'] = file
        else:
            res['upsell_price_dict_ssr'] = {}
        # res['upsell_price_dict_ssr'] = request.session.get('airline_ssr_upsell_%s' % request.POST['signature']) and request.session.get('airline_ssr_upsell_%s' % request.POST['signature']) or {}

        file = read_cache_file(request, request.POST['signature'], 'airline_get_ssr')
        if file:
            if file['result']['error_code'] == 0:
                for idx, rec in enumerate(file['result']['response']['ssr_availability_provider']):
                    if rec['status'] == 'available':
                        res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = True
                    else:
                        res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = False
        # if request.session.get('airline_get_ssr_%s' % request.POST['signature']):
        #     if request.session['airline_get_ssr_%s' % request.POST['signature']]['result']['error_code'] == 0:
        #         for idx, rec in enumerate(request.session['airline_get_ssr_%s' % request.POST['signature']]['result']['response']['ssr_availability_provider']):
        #             if rec['status'] == 'available':
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = True
        #             else:
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_ssr'] = False

        file = read_cache_file(request, request.POST['signature'], 'airline_get_seat_availability')
        if file:
            if file['result']['error_code'] == 0:
                for idx, rec in enumerate(file['result']['response']['seat_availability_provider']):
                    if rec['status'] == 'available':
                        res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = True
                    else:
                        res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = False
        # if request.session.get('airline_get_seat_availability_%s' % request.POST['signature']):
        #     if request.session['airline_get_seat_availability_%s' % request.POST['signature']]['result']['error_code'] == 0:
        #         for idx, rec in enumerate(request.session['airline_get_seat_availability_%s' % request.POST['signature']]['result']['response']['seat_availability_provider']):
        #             if rec['status'] == 'available':
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = True
        #             else:
        #                 res['price_itinerary']['sell_journey_provider'][idx]['is_seat'] = False
        # res['airline_get_price_request'] = request.session['airline_get_price_request_%s' % request.POST['signature']]
        res = ERR.get_no_error_api(res)
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        res = ERR.get_error_api(500)
    return res

def get_data_review_after_sales_page(request):
    res = {}
    try:
        file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        if file:
            res['airline_carriers'] = file

        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            res['passengers'] = file
        # res['passengers'] = request.session['airline_create_passengers_%s' % request.POST['signature']]
        if file:
            res['passengers_ssr'] = file['adult'] + file['child']

        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            res['airline_get_detail'] = file['result']['response']
        # res['airline_get_detail'] = request.session['airline_get_booking_response']['result']['response']
        res = ERR.get_no_error_api(res)
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        res = ERR.get_error_api(500)
    return res

def get_data_book_page(request):
    try:
        res = {}
        file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        if file:
            res['airline_carriers'] = file
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_ssr_page(request):
    try:
        res = {}
        file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        if file:
            res['airline_carriers'] = file

        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            res['passengers'] = file['adult'] + file['child']
        # res['passengers'] = request.session['airline_create_passengers_%s' % request.POST['signature']]['adult'] + request.session['airline_create_passengers_%s' % request.POST['signature']]['child']


        if request.POST['after_sales'] == 'false':
            # pre
            file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
            if file:
                res['airline_pick'] = file['sell_journey_provider']
                res['price_itinerary'] = file
            # res['airline_pick'] = request.session['airline_sell_journey_%s' % request.POST['signature']]['sell_journey_provider']
            # res['price_itinerary'] = request.session['airline_sell_journey_%s' % request.POST['signature']]

            file = read_cache_file(request, request.POST['signature'], 'airline_request')
            if file:
                res['airline_request'] = file
            # res['airline_request'] = request.session['airline_request_%s' % request.POST['signature']]

            file = read_cache_file(request, request.POST['signature'], 'airline_upsell')
            if file:
                res['upsell'] = file
            else:
                res['upsell'] = 0
            # res['upsell'] = request.session.get('airline_upsell_' + request.POST['signature']) and request.session.get('airline_upsell_%s' % request.POST['signature']) or 0
        else:
            #post
            passenger = []
            file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
            if file:
                for pax in file['adult']:
                    passenger.append(pax)
                for pax in file['child']:
                    passenger.append(pax)
                if file.get('student'):
                    for pax in file['student']:
                        passenger.append(pax)
                if file.get('seaman'):
                    for pax in file['seaman']:
                        passenger.append(pax)
                if file.get('labour'):
                    for pax in file['labour']:
                        passenger.append(pax)

            # pax_list = request.session['airline_create_passengers_%s' % request.POST['signature']]
            # for pax in pax_list['adult']:
            #     passenger.append(pax)
            # for pax in pax_list['child']:
            #     passenger.append(pax)
            res['passengers'] = passenger

            file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
            if file:
                res['airline_getbooking'] = file['result']['response']
            # res['airline_getbooking'] = request.session['airline_get_booking_response']['result']['response']

            file = read_cache_file(request, request.POST['signature'], 'airline_ssrs_aftersales')
            if file:
                res['ssrs'] = file
            # res['ssrs'] = request.session['airline_ssrs_aftersales_%s' % request.POST['signature']]
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_seat_page(request):
    try:
        res = {}
        file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        if file:
            res['airline_carriers'] = file
        passenger_list = []
        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            for pax in file['adult']:
                passenger_list.append(pax)
            for pax in file['child']:
                passenger_list.append(pax)
            if file.get('student'):
                for pax in file['student']:
                    passenger_list.append(pax)
            if file.get('seaman'):
                for pax in file['seaman']:
                    passenger_list.append(pax)
            if file.get('labour'):
                for pax in file['labour']:
                    passenger_list.append(pax)
            for pax in passenger_list: ## DATA DI POP KARENA TESTING AIRASIA ERROR DI NAMA MEAL ADA "'" GA BISA DI JSON.LOADS & DATA TIDAK DI BUTUHKAN DI PAGE SEAT
                if pax.get('ssr_list'):
                    pax.pop('ssr_list')
            res['passengers'] = passenger_list
        # res['passengers'] = request.session['airline_create_passengers_%s' % request.POST['signature']]['adult'] + request.session['airline_create_passengers_%s' % request.POST['signature']]['child']

        if request.POST['after_sales'] == 'false':
            # pre
            file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
            if file:
                res['airline_pick'] = file['sell_journey_provider']
                res['price_itinerary'] = file
            # res['airline_pick'] = request.session['airline_sell_journey_%s' % request.POST['signature']]['sell_journey_provider']
            # res['price_itinerary'] = request.session['airline_sell_journey_%s' % request.POST['signature']]

            file = read_cache_file(request, request.POST['signature'], 'airline_request')
            if file:
                res['airline_request'] = file
            # res['airline_request'] = request.session['airline_request_%s' % request.POST['signature']]

            file = read_cache_file(request, request.POST['signature'], 'airline_upsell')
            if file:
                res['upsell'] = file
            else:
                res['upsell'] = 0
            # res['upsell'] = request.session.get('airline_upsell_' + request.POST['signature']) and request.session.get('airline_upsell_%s' % request.POST['signature']) or 0
        else:
            # post

            file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
            if file:
                res['airline_getbooking'] = file['result']['response']
            # res['airline_getbooking'] = request.session['airline_get_booking_response']['result']['response']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_carrier_code_list(request):
    try:
        data = {
            'provider_type': 'airline'
        }
        signature = ''
        try:
            signature = request.POST['signature']
        except:
            signature = request.data['signature']
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers",
            "signature": signature
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache("get_airline_active_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                fav = {}
                carrier_code_list = {}
                for key in res:
                    if res[key]['is_favorite'] == True:
                        fav.update({
                            key: res[key]
                        })
                    else:
                        carrier_code_list.update({
                            res[key]['name']: key
                        })

                for key in sorted(carrier_code_list):
                    fav.update({
                        carrier_code_list[key]: res[carrier_code_list[key]]
                    })

                res = fav
                try:
                    write_cache(res, "get_airline_active_carriers", request, 'cache_web')
                    _logger.info("get_carrier_code_list AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_airline_active_carriers file \n' + str(e) + '\n' + traceback.format_exc())
            else:
                try:
                    file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
                    if file:
                        res = file
                    _logger.info("read file get_airline_active_carriers " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR read file get_airline_active_carriers\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR read file get_airline_active_carriers\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_carrier_providers(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carrier_providers",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_list_provider", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_list_provider", request, 'cache_web')
                _logger.info("get_carrier_providers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("get_list_provider", 'cache_web', request)
                    if file:
                        res = file
                    _logger.info("read get_list_provider SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR read file get_list_provider\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_list_provider", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR read file get_list_provider\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_carriers(request, signature=''):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers"
        }
        if signature:
            headers.update({"signature": signature})
        else:
            headers.update({"signature": request.POST['signature']})
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_airline_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_airline_carriers", request, 'cache_web')
                _logger.info("get_airline_carriers AIRLINE SIGNATURE " + headers['signature'])
            else:
                try:
                    file = read_cache("get_airline_carriers", 'cache_web', request)
                    if file:
                        res = file
                    _logger.info("get_airline_carriers AIRLINE SIGNATURE " + headers['signature'])
                except Exception as e:
                    _logger.error('ERROR read file get_airline_carriers\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR read file get_airline_carriers\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_carriers_search(request, signature=''):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_carriers_search",
        }
        if signature:
            headers.update({"signature": signature})
        else:
            headers.update({"signature": request.POST['signature']})
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_airline_active_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                temp = {}
                for ho_seq_id in res['result']['response']:
                    temp[ho_seq_id] = res['result']['response'][ho_seq_id]
                write_cache(temp, "get_airline_active_carriers", request, 'cache_web')
                _logger.info("get_carriers_search AIRLINE RENEW SUCCESS SIGNATURE " + headers['signature'])
                if request.session['user_account']['co_ho_seq_id'] in temp:
                    res = temp[request.session['user_account']['co_ho_seq_id']]
            else:
                try:
                    file = read_cache("get_airline_active_carriers", 'cache_web', request)
                    if file:
                        res = file
                        if request.session['user_account']['co_ho_seq_id'] in res:
                            res = res[request.session['user_account']['co_ho_seq_id']]
                    _logger.info("read file get_airline_active_carriers SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR read file get_airline_active_carriers\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            res = {}
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            res = file
            if request.session['user_account']['co_ho_seq_id'] in res:
                res = res[request.session['user_account']['co_ho_seq_id']]
        except Exception as e:
            res = {}
            _logger.error('ERROR read file get_airline_active_carriers\n' + str(e) + '\n' + traceback.format_exc())


    ## BATASAN DARI CARRIER SEARCH CONFIG BACKEND FRONTEND HANYA UNTUK REPORT

    ## BACKEND BELUM BISA PINDAH HO JADI DI PAKAI KLO SUDAH BISA DI HAPUS
    allowed_carrier_search = get_allowed_config_search(request)
    if len(allowed_carrier_search):
        new_res = {}
        for carrier in allowed_carrier_search:
            new_res[carrier] = res[carrier]
        res = new_res
    return res

def get_airline_advance_pax_type(request):
    file = read_cache('airline_advance_pax_type', 'cache_web', request, 90911)
    if file:
        return file
    else:
        return {
            'airline_advance_pax_type': 'false',
            'airline_pax_type_student': 'false',
            'airline_pax_type_labour': 'false',
            'airline_pax_type_seaman': 'false'
        }

def save_allowed_config_search(request):
    data = json.loads(request.POST['airline_carriers'])
    write_cache(data, 'allowed_airline_carriers', request)
    data = {
        'airline_advance_pax_type': request.POST['advance_pax_type'],
        'airline_pax_type_student': request.POST['airline_pax_type_student'],
        'airline_pax_type_labour': request.POST['airline_pax_type_labour'],
        'airline_pax_type_seaman': request.POST['airline_pax_type_seaman']
    }

    write_cache(data, 'airline_advance_pax_type', request)

    return {
        "result": {
            "response": "",
            "error_code": 0,
            "error_msg": ""
        }
    }

def get_allowed_config_search(request):
    data = []
    file = read_cache("allowed_airline_carriers", 'cache_web', request, 90911)
    if file:
        data = file
    return data

def get_all_carrier_airline(request):
    file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
    if file:
        if request.session.get('user_account') and request.session['user_account']['co_ho_seq_id'] in file:
            file = file[request.session['user_account']['co_ho_seq_id']]
        else:
            ##### CARI USER ACCOUNT DARI SIGNATURE
            res = webservice_agent.update_context_machine_otp_pin_api(request,request.POST['signature'])
            if res['result']['response']['co_ho_seq_id'] in file:
                file = file[res['result']['response']['co_ho_seq_id']]
    return file

def get_provider_list_backend(request, signature=''):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_list_backend",
        }
        if signature:
            headers.update({"signature": signature})
        else:
            headers.update({"signature": request.POST['signature']})
        data = {
            'provider_type': 'airline'
        }
    except Exception as e:
        ## from mobile
        try:
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_providers_airline",
                "signature": request.data['signature']
            }
            data = {
                'provider_type': 'airline'
            }
        except:
            _logger.error("Error not from mobile")
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_list_provider_airline", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, "get_list_provider_airline", request, 'cache_web')
                _logger.info("write get_list_provider_airline")
            else:
                try:
                    file = read_cache("get_list_provider_airline", 'cache_web', request)
                    if file:
                        res = file
                    _logger.info("read file get_list_provider_airline SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR read file get_list_provider_airline\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            res = file
        except Exception as e:
            _logger.error('ERROR read file get_list_provider_airline\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_provider_description(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_list",
            "signature": request.POST['signature']
        }
        data = {
            "provider_type": 'airline'
        }
    except Exception as e:
        ## from mobile
        try:
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_provider_list",
                "signature": request.data['signature']
            }
            data = {
                "provider_type": 'airline'
            }
        except:
            _logger.error("Error not from mobile")
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_list_provider_data", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                temp = {}
                for ho_seq_id in res['result']['response']:
                    temp[ho_seq_id] = {}
                    for provider in res['result']['response'][ho_seq_id]:
                        if provider.get('provider_id'):
                            temp[ho_seq_id][provider['provider_id']] = provider
                        else:
                            temp[ho_seq_id][provider['provider']] = provider
                write_cache(temp, "get_list_provider_data", request, 'cache_web')
                _logger.info("get_provider_description AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
                if request.session['user_account']['co_ho_seq_id'] in temp:
                    res = temp[request.session['user_account']['co_ho_seq_id']]
            else:
                try:
                    file = read_cache("get_list_provider_data", 'cache_web', request)
                    if file and request.session['user_account']['co_ho_seq_id'] in file:
                        res = file[request.session['user_account']['co_ho_seq_id']]
                    _logger.info("read file get_list_provider_data SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR read file get_list_provider_data\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            if file and request.session['user_account']['co_ho_seq_id'] in file:
                res = file[request.session['user_account']['co_ho_seq_id']]
        except Exception as e:
            _logger.error('ERROR read file get_list_provider_data\n' + str(e) + '\n' + traceback.format_exc())
    return res

def search2(request):
    # get_data_awal
    try:
        # airline
        airline_destinations = []
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country'],
            })
        data_search = json.loads(request.POST['search_request'])
        direction = 'MC'
        journey_list = []
        if data_search['is_combo_price'] == 'false':
            is_combo_price = False
        else:
            is_combo_price = True
        if data_search['direction'] == 'MC':
            for idx, i in enumerate(data_search['origin']):
                departure_date = '%s-%s-%s' % (
                    data_search['departure'][idx].split(' ')[2],
                    month[data_search['departure'][idx].split(' ')[1]],
                    data_search['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': data_search['origin'][idx].split(' - ')[0],
                    'destination': data_search['destination'][idx].split(' - ')[0],
                    'departure_date': departure_date,
                    'cabin_class': data_search['cabin_class_list'][idx]
                })
            cabin_class = data_search['cabin_class']
        elif data_search['direction'] == 'RT':
            for idx, i in enumerate(data_search['origin']):
                departure_date = '%s-%s-%s' % (
                    data_search['departure'][idx].split(' ')[2],
                    month[data_search['departure'][idx].split(' ')[1]],
                    data_search['departure'][idx].split(' ')[0])
                journey_list.append({
                    'origin': data_search['origin'][idx].split(' - ')[0],
                    'destination': data_search['destination'][idx].split(' - ')[0],
                    'departure_date': departure_date
                })
            cabin_class = data_search['cabin_class']
        else:
            #default
            departure_date = '%s-%s-%s' % (
                data_search['departure'][int(request.POST['counter_search'])].split(' ')[2],
                month[data_search['departure'][int(request.POST['counter_search'])].split(' ')[1]],
                data_search['departure'][int(request.POST['counter_search'])].split(' ')[0])
            journey_list.append({
                'origin': data_search['origin'][int(request.POST['counter_search'])].split(' - ')[0],
                'destination': data_search['destination'][int(request.POST['counter_search'])].split(' - ')[0],
                'departure_date': departure_date
            })
            cabin_class = data_search['cabin_class']
            is_combo_price = False
        carrier_code_list = json.loads(request.POST['carrier_codes'])
        data = {
            "journey_list": journey_list,
            "direction": direction,
            "is_combo_price": is_combo_price,
            "adult": int(data_search['adult']),
            "child": int(data_search['child']),
            "infant": int(data_search['infant']),
            "cabin_class": cabin_class,
            "provider": request.POST['provider'],
            # "provider": 'amadeus',
            "carrier_codes": carrier_code_list,
            "promo_codes": json.loads(request.POST['promo_codes']),
        }
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        advance_search = get_airline_advance_pax_type(request)
        if advance_search['airline_advance_pax_type'] == 'true':
            if advance_search['airline_pax_type_student'] == 'true' and int(data_search['student']):
                data.update({
                    "student": int(data_search['student'])
                })
            if advance_search['airline_pax_type_seaman'] == 'true' and int(data_search['seaman']):
                data.update({
                    "seaman": int(data_search['seaman'])
                })
            if advance_search['airline_pax_type_labour'] == 'true' and int(data_search['labour']):
                data.update({
                    "labour": int(data_search['labour'])
                })

        if request.POST['last_send'] == 'true': ##SIMPEN CACHE REQUEST DENGAN SIGNATURE HANYA SEKALI SETIAP SEARCH
            write_cache_file(request, request.POST['signature'], 'airline_request', data_search)
            write_cache_file(request, request.POST['signature'], 'airline_search', data)
            # set_session(request, 'airline_request_%s' % request.POST['signature'], data_search)
            # set_session(request, 'airline_search_%s' % request.POST['signature'], data)

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['new_signature'] if request.POST.get('new_signature') else request.POST['signature']
        }
    except Exception as e:
        if request.POST.get('use_cache'):
            ## change user
            file = read_cache_file(request, request.POST['signature'], 'airline_search')
            if file:
                data = file['result']['response']
            else:
                data = {}
            # data = request.session['airline_search_%s' % request.POST['signature']]
            data.update({
                "provider": request.POST['provider'],
                "carrier_codes": json.loads(request.POST['carrier_code'])
            })
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['new_signature'] if request.POST.get('new_signature') else request.POST['signature']
            }
            if request.POST.get('new_signature'):
                file = read_cache_file(request, '', 'airline_request')
                if file:
                    write_cache_file(request, request.POST['new_signature'], 'airline_request', file)
                write_cache_file(request, request.POST['new_signature'], 'airline_search', data)

                # set_session(request, 'airline_request_%s' % request.POST['new_signature'],request.session['airline_request'])
                # set_session(request, 'airline_search_%s' % request.POST['new_signature'], data)
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    provider_data_ho = read_cache("get_list_provider_data", 'cache_web', request, 90911)
    if provider_data_ho.get(request.session['user_account']['co_ho_seq_id']) and provider_data_ho[request.session['user_account']['co_ho_seq_id']].get(request.POST['provider']):
        provider_data = provider_data_ho[request.session['user_account']['co_ho_seq_id']][request.POST['provider']]
        error_response = {
            "result": {
                "error_code": 500,
                "error_msg": "No Schedule",
                "response": ""
            }
        }
        if data.get('student') and not provider_data['is_student']:
            return error_response
        elif data.get('seaman') and not provider_data['is_seaman']:
            return error_response
        elif data.get('labour') and not provider_data['is_labour']:
            return error_response
    res = send_request_api(request, url_request, headers, data, 'POST', 120)
    try:
        if res['result']['error_code'] == 0:
            for index_schedule, journey_list in enumerate(res['result']['response']['schedules']):
                for journey in journey_list['journeys']:
                    journey['is_combo_price'] = False
                    journey.update({
                        'departure_date': parse_date_time_front_end_with_day(string_to_datetime(journey['departure_date'])),
                        'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(journey['arrival_date']))
                    })
                    if journey.get('arrival_date_return'):
                        journey.update({
                            'departure_date_return': parse_date_time_front_end_with_day(string_to_datetime(journey['departure_date_return'])),
                            'arrival_date_return': parse_date_time_front_end_with_day(string_to_datetime(journey['arrival_date_return']))
                        })
                    if journey.get('return_date'):
                        journey.update({
                            'return_date': parse_date_time_front_end_with_day(string_to_datetime(journey['return_date'])),
                        })
                    for destination in airline_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                                'origin_country': destination['country'],
                            })
                            break
                    for destination in airline_destinations:
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                                'destination_country': destination['country'],
                            })
                            break
                    for index_segment, segment in enumerate(journey['segments']):
                        segment.update({
                            'departure_date': parse_date_time_front_end_with_day(string_to_datetime(segment['departure_date'])),
                            'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(segment['arrival_date']))
                        })
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break

                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': parse_date_time_front_end_with_day(string_to_datetime(leg['departure_date'])),
                                'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(leg['arrival_date']))
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

                        if index_segment == 0 and index_schedule == 0 and res['result']['response'].get('recommendations') and len(res['result']['response']['recommendations']) != 0:
                            is_need_sort = False
                            for fare in segment['fares']:
                                if fare['fare_ref_id']:
                                    is_need_sort = True
                                    fare['total_recommendation_price'] = 0
                                    for recommendation in res['result']['response']['recommendations']:
                                        if recommendation['journey_flight_refs'][0]['journey_ref_id'] == journey['journey_ref_id'] and recommendation['journey_flight_refs'][0]['fare_flight_refs'][0]['fare_ref_id'] == fare['fare_ref_id']:
                                            for svc_summary in recommendation['service_charge_summary']:
                                                if fare['total_recommendation_price'] == 0 or fare['total_recommendation_price'] > svc_summary['total_price'] and svc_summary['pax_type'] not in ['CHD', 'INF']:
                                                    fare['total_recommendation_price'] = svc_summary['total_price']
                                                    break
                            if is_need_sort:
                                for x in range(0, len(segment['fares'])-1):
                                    for y in range(x+1, len(segment['fares'])):
                                        if segment['fares'][x]['total_recommendation_price'] > segment['fares'][y]['total_recommendation_price'] or segment['fares'][x]['total_recommendation_price'] == 0 and segment['fares'][y]['total_recommendation_price'] != 0:
                                            temp_fare = segment['fares'][x]
                                            segment['fares'][x] = segment['fares'][y]
                                            segment['fares'][y] = temp_fare


            _logger.error("SUCCESS SEARCH AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR SEARCH AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error('Error response airline search\n' + str(e) + '\n' + traceback.format_exc())
    try:
        response_search = res['result']

    except:
        response_search = {
            'result': res
        }
    return response_search

def get_data(request):
    try:
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file

        # res = search2(request)
        _logger.info("SUCCESS get_data AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error('ERROR get_data airline_destination file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def get_price_itinerary(request, boolean, counter):
    try:
        #baru
        airline_destinations = []
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country'],
            })
        #baru
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])
        for idx, journey in enumerate(journey_booking):
            if boolean == True:
                #NO COMBO
                journeys.append({'segments': journey['segments']})
                schedules.append({'journeys': journeys, 'provider': journey['provider']})
                journeys = []
            else:
                #COMBO
                check = 0
                journeys.append({'segments': journey['segments']})
                for schedule in schedules:
                    if schedule['provider'] == journey['provider']:
                        schedule['journeys'].append({
                            'segments': journey['segments']
                        })
                        check = 1
                        break
                    # for segment in journey['segments']:
                    #     if segment['carrier_code'] in schedule['carrier_code']:
                    #         schedule['journeys'].append({
                    #             'segments': journey['segments']
                    #         })
                    #         check = 1
                    #         break
                    if check == 1:
                        break
                if check == 0:
                    carrier_code = []
                    for segment in journey['segments']:
                        carrier_code.append(segment['carrier_code'])
                    schedules.append({
                        'journeys': journeys,
                        'provider': journey['provider'],
                        'carrier_code': carrier_code
                    })
                journeys = []

        file = read_cache_file(request, request.POST['signature'], 'airline_request')
        if file:
            airline_request = copy.deepcopy(file)
        else:
            airline_request = json.loads(request.POST['search_request'])
        # if request.session.get('airline_request_%s' % request.POST['signature']):
        #     airline_request = copy.deepcopy(request.session['airline_request_%s' % request.POST['signature']])
        # else:
        #     airline_request = json.loads(request.POST['search_request'])
        data = {
            "promo_codes": json.loads(request.POST['promo_codes']),
            "adult": int(airline_request['adult']),
            "child": int(airline_request['child']),
            "infant": int(airline_request['infant']),
            "schedules": schedules,
        }
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        advance_search = get_airline_advance_pax_type(request)
        if advance_search['airline_advance_pax_type'] == 'true':
            if advance_search['airline_pax_type_student'] == 'true' and airline_request.get('student'):
                data.update({
                    "student": int(airline_request['student'])
                })
            if advance_search['airline_pax_type_seaman'] == 'true' and airline_request.get('seaman'):
                data.update({
                    "seaman": int(airline_request['seaman'])
                })
            if advance_search['airline_pax_type_labour'] == 'true' and airline_request.get('labour'):
                data.update({
                    "labour": int(airline_request['labour'])
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_price_itinerary",
            "signature": request.POST['signature'],
        }
        write_cache_file(request, request.POST['signature'], 'airline_get_price_request', data)
        # set_session(request, 'airline_get_price_request_%s' % request.POST['signature'], data)
        # _logger.info(json.dumps(request.session['airline_get_price_request_%s' % request.POST['signature']]))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        data = json.loads(request.POST['data'])
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_price_itinerary",
            "signature": request.POST['signature']
        }

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 120)

    try:
        if res['result']['error_code'] == 0:
            res['result']['request'] = data
            try:
                for price_itinerary_provider in res['result']['response']['price_itinerary_provider']:
                    for journey in price_itinerary_provider['journeys']:
                        journey.update({
                            'rules': [],
                            'departure_date': parse_date_time_front_end_with_day(string_to_datetime(journey['departure_date'])) if journey['departure_date'] else journey['departure_date'],
                            'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(journey['arrival_date'])) if journey['arrival_date'] else journey['arrival_date']
                        })
                        if journey.get('arrival_date_return'):
                            journey.update({
                                'departure_date_return': parse_date_time_front_end_with_day(string_to_datetime(journey['departure_date_return'])) if journey['departure_date_return'] else journey['departure_date_return'],
                                'arrival_date_return': parse_date_time_front_end_with_day(string_to_datetime(journey['arrival_date_return'])) if journey['arrival_date_return'] else journey['arrival_date_return']
                            })
                        if journey.get('return_date'):
                            journey.update({
                                'return_date': parse_date_time_front_end_with_day(string_to_datetime(journey['return_date'])),
                            })
                        for destination in airline_destinations:
                            if destination['code'] == journey['origin']:
                                journey.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == journey['destination']:
                                journey.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break
                        for segment in journey['segments']:
                            segment.update({
                                'departure_date': parse_date_time_front_end_with_day(string_to_datetime(segment['departure_date'])) if segment['departure_date'] else segment['departure_date'],
                                'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(segment['arrival_date'])) if segment['arrival_date'] else segment['arrival_date']
                            })
                            for destination in airline_destinations:
                                if destination['code'] == segment['origin']:
                                    segment.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                        'origin_country': destination['country'],
                                    })
                                    break

                            for destination in airline_destinations:
                                if destination['code'] == segment['destination']:
                                    segment.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                        'destination_country': destination['country'],
                                    })
                                    break

                            for leg in segment['legs']:
                                leg.update({
                                    'departure_date': parse_date_time_front_end_with_day(string_to_datetime(leg['departure_date'])) if leg['departure_date'] else leg['departure_date'],
                                    'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(leg['arrival_date'])) if leg['arrival_date'] else leg['arrival_date']
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
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
            _logger.info("SUCCESS get_price_itinerary AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
            try:
                write_cache_file(request, request.POST['signature'], 'airline_price_itinerary', res['result']['response'])
                # set_session(request, 'airline_price_itinerary_%s' % request.POST['signature'], res['result']['response'])
                # _logger.info(json.dumps(request.session['airline_price_itinerary_%s' % request.POST['signature']]))
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
        elif boolean == True:
            pass
        else:
            # if(request.session['airline_request']['direction'] == 'RT'):
            #MC atau RT SEPARATE
            counter += 1
            if counter < 4:
                res = get_price_itinerary(request, True, counter)
                boolean = True
    except Exception as e:
        counter += 1
        if counter < 4:
            get_price_itinerary(request, True, counter)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    try:
        if boolean == False:
            check_special_price = True
            for schedule in data['schedules']:
                if len(schedule['journeys']) > 1:
                    check_special_price = False
                    break
            res['result']['response'].update({
                'is_combo_price': not check_special_price
            })
        else:
            res['result']['response'].update({
                'is_combo_price': not boolean
            })

    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    return res

def get_fare_rules(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_price_request')
        if file:
            data = file
        # data = request.session['airline_get_price_request_%s' % request.POST['signature']]
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_fare_rules",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        data = json.loads(request.POST['data'])
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_fare_rules",
            "signature": request.POST['signature'],
        }
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST')

    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_fare_rules AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_fare_rules_airline ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_journeys(request):
    #nanti ganti ke select journey
    try:
        airline_destinations = []
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country'],
            })
        data = json.loads(request.POST['data'])
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_journeys",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        if request.POST.get('data'):
            data = json.loads(request.POST['data'])
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "sell_journeys",
                "signature": request.POST['signature'],
            }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
    if file != data:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    else:
        res = file
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_sell_journey', res)
            for price_itinerary_provider in res['result']['response']['sell_journey_provider']:
                for journey in price_itinerary_provider['journeys']:
                    journey.update({
                        'rules': [],
                        'departure_date': parse_date_time_front_end_with_day(string_to_datetime(journey['departure_date'])) if journey['departure_date'] else journey['departure_date'],
                        'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(journey['arrival_date'])) if journey['arrival_date'] else journey['arrival_date']
                    })
                    if journey.get('arrival_date_return'):
                        journey.update({
                            'departure_date_return': parse_date_time_front_end_with_day(string_to_datetime(journey['departure_date_return'])) if journey['departure_date_return'] else journey['departure_date_return'],
                            'arrival_date_return': parse_date_time_front_end_with_day(string_to_datetime(journey['arrival_date_return'])) if journey['arrival_date_return'] else journey['arrival_date_return']
                        })
                    if journey.get('return_date'):
                        journey.update({
                            'return_date': parse_date_time_front_end_with_day(string_to_datetime(journey['return_date'])) if journey['return_date'] else journey['return_date'],
                        })
                    for destination in airline_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                                'origin_country': destination['country'],
                            })
                            break
                    for destination in airline_destinations:
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                                'destination_country': destination['country'],
                            })
                            break
                    for segment in journey['segments']:
                        segment.update({
                            'departure_date': parse_date_time_front_end_with_day(string_to_datetime(segment['departure_date'])) if segment['departure_date'] else segment['departure_date'],
                            'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(segment['arrival_date'])) if segment['arrival_date'] else segment['arrival_date']
                        })
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country'],
                                })
                                break

                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': parse_date_time_front_end_with_day(string_to_datetime(leg['departure_date'])) if leg['departure_date'] else leg['departure_date'],
                                'arrival_date': parse_date_time_front_end_with_day(string_to_datetime(leg['arrival_date'])) if leg['arrival_date'] else leg['arrival_date']
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
        else:
            _logger.error("ERROR sell_journeys_airline AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_ssr_availability(request):
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_ssr_availability",
        "signature": request.POST['signature'],
    }
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST',timeout=300)
    try:
        if res['result']['error_code'] == 0:
            try:
                _logger.info("get_ssr_availability AIRLINE SIGNATURE " + request.POST['signature'])
                for ssr_availability_provider in res['result']['response']['ssr_availability_provider']:
                    if(ssr_availability_provider.get('ssr_availability')):
                        for ssr_availability in ssr_availability_provider['ssr_availability']:
                            for ssrs in ssr_availability_provider['ssr_availability'][ssr_availability]:
                                ssrs.update({
                                    'origin': ssrs['segments'][0]['origin'],
                                    'destination': ssrs['segments'][len(ssrs['segments']) - 1]['destination']
                                })
                                for ssr in ssrs['ssrs']:
                                    total = 0
                                    currency = ''
                                    for service_charge in ssr['service_charges']:
                                        currency = service_charge['currency']
                                        total += service_charge['amount']
                                    ssr['total_price'] = total
                                    ssr['currency'] = currency

            except:
                _logger.error("get_ssr_availability_airline AIRLINE SIGNATURE " + request.POST['signature'] + json.dumps(res))

            write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
            # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)
            # _logger.info(json.dumps(request.session['airline_get_ssr_%s' % request.POST['signature']]))
        else:
            write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
            # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)
            _logger.error("get_ssr_availability_airline ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
        # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_seat_availability(request):
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_seat_availability",
        "signature": request.POST['signature'],
    }
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST',timeout=300)
    write_cache_file(request, request.POST['signature'], 'airline_get_seat_availability', res)
    # set_session(request, 'airline_get_seat_availability_%s' % request.POST['signature'], res)
    # _logger.info(json.dumps(request.session['airline_get_seat_availability_%s' % request.POST['signature']]))
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_seat_availability AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_seat_availability ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_ff_availability(request):
    data = {}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_ff_availability",
        "signature": request.POST['signature'],
    }
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST',timeout=300)
    write_cache_file(request, request.POST['signature'], 'airline_get_ff_availability', res)
    # set_session(request, 'airline_get_ff_availability_%s' % request.POST['signature'], res)
    # _logger.info(json.dumps(request.session['airline_get_ff_availability_%s' % request.POST['signature']]))
    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_ff_availability AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_ff_availability ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_seat_map_response(request):
    file = read_cache_file(request, request.POST['signature'], 'airline_get_seat_availability')
    return file['result']['response']
    # return request.session['airline_get_seat_availability_%s' % request.POST['signature']]['result']['response']

def get_pax(request):
    file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
    return file
    # return request.session['airline_create_passengers_%s' % request.POST['signature']]

def update_contacts(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            booker = file['booker']
            contacts = file['contact']
        # booker = copy.deepcopy(request.session['airline_create_passengers_%s' % request.POST['signature']]['booker'])
        # contacts = copy.deepcopy(request.session['airline_create_passengers_%s' % request.POST['signature']]['contact'])
        data = {
            'booker': booker,
            'contacts': contacts
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_contacts",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_file(request, request.POST['signature'], 'airline_update_contact_data')

    if file != data:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    else:
        file = read_cache_file(request, request.POST['signature'], 'airline_update_contact')
        if file:
            res = file
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_update_contact', res)
            write_cache_file(request, request.POST['signature'], 'airline_update_contact_data', data)
            # set_session(request, 'airline_update_contact'+request.POST['signature'], res)
            # set_session(request, 'airline_update_contact_data'+request.POST['signature'], data)
            _logger.info("SUCCESS update_contacts AIRLINE SIGNATURE " + request.POST['signature'])
        elif res['result']['error_code'] == 4014:
            file = read_cache_file(request, request.POST['signature'], 'airline_update_contact_data')
            if file == data:
                res['result']['error_code'] = 0  # SUDAH BERHASIL DOUBLE JADI DI PASS
        else:
            _logger.error("ERROR update_contacts_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_passengers(request):
    try:
        passenger = []
        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            passenger_cache = file
        # passenger_cache = copy.deepcopy(request.session['airline_create_passengers_%s' % request.POST['signature']])

        file = read_cache_file(request, request.POST['signature'], 'airline_sell_journey')
        if file:
            sell_journey_dict = file
        else:
            sell_journey_dict = {}
        # sell_journey_dict = request.session.get('airline_sell_journey_%s' % request.POST['signature'], {})
        last_departure_date = ''
        for sell_journey in sell_journey_dict['sell_journey_provider']:
            for journey in sell_journey['journeys']:
                last_departure_date = datetime.strptime(journey['departure_date'], '%a, %d %b %Y - %H:%M')
        year_exp_date = ''
        if datetime.strptime('%s-09-09' % datetime.now().strftime('%Y'), '%Y-%m-%d') > last_departure_date:
            year_exp_date = str(int(datetime.now().strftime('%Y')) - 1)
        else:
            year_exp_date = str(datetime.now().strftime('%Y'))
        for pax_type in passenger_cache:
            if pax_type != 'booker' and pax_type != 'contact':
                for pax in passenger_cache[pax_type]:
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s-%s-%s' % (
                                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                                pax['birth_date'].split(' ')[0]),
                        })
                    if not pax['is_valid_identity']:
                        identity_number = "P%s" % str(random.random() * 1000000).split('.')[0]
                        identity_expired_date = ''
                        if pax.get('identity_expdate'):
                            identity_expired_date = '%s-%s-%s' % (pax['identity_expdate'].split(' ')[2], month[pax['identity_expdate'].split(' ')[1]],pax['identity_expdate'].split(' ')[0])
                        else:
                            identity_expired_date = ("%s-09-09" % (year_exp_date))
                        pax['identity'] = {
                            "identity_country_of_issued_code": pax.get('identity_country_of_issued_code') or 'ID',
                            "identity_expdate": identity_expired_date,
                            "identity_number": pax.get('identity_number') or identity_number,
                            "identity_first_name": pax.get('identity_first_name') or pax['first_name'],
                            "identity_last_name": pax.get('identity_last_name') or pax['last_name'],
                            "identity_type": pax.get('identity_type') or 'passport',
                            "identity_image": pax.get('identity_image', []),
                            # "is_valid_identity": pax.pop('is_valid_identity')
                        }
                        try:
                            pax.pop('identity_expdate')
                            pax.pop('identity_number')
                            pax.pop('identity_first_name')
                            pax.pop('identity_last_name')
                            pax.pop('identity_type')
                            pax.pop('identity_image')
                            pax.pop('is_valid_identity')
                        except:
                            pass
                    elif pax['identity_type'] != '':
                        if pax['identity_expdate'] != '':
                            pax.update({
                                'identity_expdate': '%s-%s-%s' % (
                                    pax['identity_expdate'].split(' ')[2], month[pax['identity_expdate'].split(' ')[1]],
                                    pax['identity_expdate'].split(' ')[0])
                            })
                        pax['identity'] = {
                            "identity_country_of_issued_code": pax.get('identity_country_of_issued_code') or '',
                            "identity_expdate": pax.pop('identity_expdate'),
                            "identity_number": pax.pop('identity_number'),
                            "identity_first_name": pax.pop('identity_first_name'),
                            "identity_last_name": pax.pop('identity_last_name'),
                            "identity_type": pax.pop('identity_type'),
                            "identity_image": pax.pop('identity_image'),
                            "is_valid_identity": pax.pop('is_valid_identity')
                        }

                    else:
                        pax.pop('identity_expdate')
                        pax.pop('identity_number')
                        pax.pop('identity_first_name')
                        pax.pop('identity_last_name')
                        pax.pop('identity_type')
                        pax.pop('identity_image')
                        pax.pop('is_valid_identity')
                    passenger.append(pax)

        data = {
            'passengers': passenger
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_passengers",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    data_copy = copy.deepcopy(data)
    for data_pax in data_copy['passengers']:
        if data_pax.get('identity'):
            if not data_pax['identity'].get('is_valid_identity'): ## tidak valid buang data identity
                data_pax.pop('identity')

    file = read_cache_file(request, request.POST['signature'], 'airline_update_passengers_data')
    if file != data_copy:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    else:
        file = read_cache_file(request, request.POST['signature'], 'airline_update_passengers')
        if file:
            res = file
        # res = request.session['airline_update_passengers' + request.POST['signature']]
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_update_passengers', res)
            write_cache_file(request, request.POST['signature'], 'airline_update_passengers_data', data_copy)
            # set_session(request, 'airline_update_passengers' + request.POST['signature'], res)
            # set_session(request, 'airline_update_passengers_data' + request.POST['signature'], data_copy)
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        elif res['result']['error_code'] == 4014:
            file = read_cache_file(request, request.POST['signature'], 'airline_update_passengers_data')
            if file == data:
                res['result']['error_code'] = 0  # SUDAH BERHASIL DOUBLE JADI DI PASS
            # if request.session.get('airline_update_passengers_data' + request.POST['signature']) == data:
            #     res['result']['error_code'] = 0 #SUDAH BERHASIL DOUBLE JADI DI PASS
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_ssrs(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_ssr')
        if file:
            ssr_data = file
        # ssr_data = request.session.get('airline_get_ssr_%s' % request.POST['signature'])

        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_request')
        if file:
            ssr_requests = file
        else:
            ssr_requests = {}
        # ssr_requests = request.session['airline_ssr_request_%s' % request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'airline_create_passengers')
        if file:
            passenger_cache = file
        # passenger_cache = copy.deepcopy(request.session['airline_create_passengers_%s' % request.POST['signature']])
        counter_passenger = 0
        for pax_type in passenger_cache:
            if pax_type not in ['booker', 'contact']:
                for pax in passenger_cache[pax_type]:
                    if pax.get('is_request_wheelchair', False):
                        ## wheelchair
                        for idx, ssr_provider in enumerate(ssr_data['result']['response']['ssr_availability_provider']):
                            if ssr_provider.get('ssr_availability'):
                                if ssr_provider['ssr_availability'].get('wheelchair'):
                                    if type(ssr_requests) == dict:
                                        ssr_requests = []
                                    if not len(ssr_requests) < idx:
                                        ssr_requests.append({
                                            "provider": ssr_provider['provider'],
                                            "sell_ssrs": []
                                        })
                                    for idy, ssr_wheelchair in enumerate(ssr_provider['ssr_availability']['wheelchair']):
                                        is_wheelchair_found = False
                                        for idz, sell_ssr in enumerate(ssr_requests[idx]['sell_ssrs']):
                                            if sell_ssr['availability_type'] == 'wheelchair' and sell_ssr['journey_code'] == ssr_wheelchair['journey_code']:
                                                journey_sequence = idz
                                                is_wheelchair_found = True
                                                break
                                        if not is_wheelchair_found:
                                            journey_sequence = len(ssr_requests[idx]['sell_ssrs'])
                                            ssr_requests[idx]['sell_ssrs'].append({
                                                "journey_code": ssr_wheelchair['journey_code'],
                                                "passengers": [],
                                                "availability_type": ssr_wheelchair['availability_type']
                                            })
                                        is_passenger_found = False
                                        for pax in ssr_requests[idx]['sell_ssrs'][journey_sequence]['passengers']:
                                            if pax['passenger_number'] == counter_passenger:
                                                is_passenger_found = True
                                        if not is_passenger_found:
                                            ssr_requests[idx]['sell_ssrs'][journey_sequence]['passengers'].append({
                                                "passenger_number": counter_passenger,
                                                "ssr_code": ssr_wheelchair['ssrs'][0]['ssr_code']
                                            })
                    counter_passenger += 1

        ## pop journey without ssr
        pop_index_list = []
        for idx, ssr_request in enumerate(ssr_requests):
            if len(ssr_request['sell_ssrs']) == 0:
                pop_index_list.append(idx)
        pop_index_list.reverse()
        for index in pop_index_list:
            ssr_requests.pop(index)
        data = {
            'sell_ssrs_request': ssr_requests
        }
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_ssrs",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_file(request, request.POST['signature'], 'airline_sell_ssrs')
    if file:
        res = file
    elif ssr_requests != {}:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    # if 'airline_sell_ssrs' + request.POST['signature'] in request.session:
    #     res = request.session['airline_sell_ssrs' + request.POST['signature']]
    # elif ssr_requests != {}:
    #     url_request = get_url_gateway('booking/airline')
    #     res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_sell_ssrs', res)
            # set_session(request, 'airline_sell_ssrs' + request.POST['signature'], res)
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_request')
        if not file or file == {}:
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'sell_ssr_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        # if request.session['airline_ssr_request_%s' % request.POST['signature']] == {}:
        #     _logger.error("NO SSR")
        #     res = {
        #         'result': {
        #             'error_code': 0,
        #             'response': {
        #                 'sell_ssr_provider': [
        #                     {
        #                         'status': 'SUCCESS'
        #                     }
        #                 ]
        #             }
        #         }
        #     }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def assign_seats(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_seat_request')
        if file:
            data = {
                'segment_seat_request': file
            }
        else:
            data = {
                'segment_seat_request': []
            }
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "assign_seats",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_file(request, request.POST['signature'], 'airline_assign_seat')
    if file:
        res = file
    elif len(data['segment_seat_request']) != 0:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)

    # if 'airline_seat_request' + request.POST['signature'] in request.session:
    #     res = request.POST['airline_seat_request' + request.POST['signature']]
    # elif len(request.session['airline_seat_request_%s' % request.POST['signature']]) != 0:
    #     url_request = get_url_gateway('booking/airline')
    #     res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_assign_seat', res)
            # request.POST['airline_seat_request' + request.POST['signature']] = res #BELUM DI TESTING
            _logger.info("SUCCESS update_passengers AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_passengers_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        file = read_cache_file(request, request.POST['signature'], 'airline_seat_request')
        if not file or len(file) == 0:
            _logger.error("NO seat")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'seat_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        # if len(request.session['airline_seat_request_%s' % request.POST['signature']]) == 0:
        #     _logger.error("NO seat")
        #     res = {
        #         'result': {
        #             'error_code': 0,
        #             'response': {
        #                 'seat_provider': [
        #                     {
        #                         'status': 'SUCCESS'
        #                     }
        #                 ]
        #             }
        #         }
        #     }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def commit_booking(request):
    #nanti ganti ke get_ssr_availability
    try:
        data = {
            # 'force_issued': bool(int(request.POST['value'])),
            'force_issued': False,
            'halt_process': bool(int(request.POST['halt_process']))
        }
        try:
            if bool(int(request.POST['value'])) == True:
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
            provider = []
            file = read_cache_file(request, request.POST['signature'], 'airline_price_itinerary')
            if file:
                for provider_type in file['price_itinerary_provider']:
                    if not provider_type['provider'] in provider:
                        provider.append(provider_type['provider'])
            if request.POST['voucher_code'] != '':
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'airline', provider),
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
            # data.update({
            #     'bypass_psg_validator': request.POST['bypass_psg_validator']
            # })
        except Exception as e:
            _logger.error('book, not force issued')
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit_booking AIRLINE SIGNATURE " + request.POST['signature'])
            ## hapus session
            # for key in reversed(list(request.session._session.keys())):
            #     if request.POST['signature'] in key:
            #         del request.session[key]

            ## hapus cache file
            # delete_cache_file(request, request.POST['signature'])

        else:
            _logger.error("ERROR commit_booking_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def commit_booking_vendor(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': request.POST['order_number'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "commit_booking_vendor",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS commit booking vendor AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR commit booking vendor AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        country = {}
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        airline_destinations = []
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city'],
                'country': country['country']
            })
        if res['result']['error_code'] == 0:
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            try:
                res['result']['response']['can_issued'] = False
                if res['result']['response']['hold_date'] > now:
                    res['result']['response']['can_issued'] = True
            except:
                _logger.error('no hold date')

            if 'process_rebooking' in request.session['user_account']['co_agent_frontend_security']:
                rebooking = True
                for provider_booking_dict in res['result']['response']['provider_bookings']:
                    for journey_dict in provider_booking_dict['journeys']:
                        if now > journey_dict['departure_date']:
                            rebooking = False
                res['result']['response']['rebooking'] = rebooking

            for pax in res['result']['response']['passengers']:
                try:
                    if len(pax['birth_date'].split(' ')[0].split('-')) == 3:
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split(' ')[0].split('-')[2], month[pax['birth_date'].split(' ')[0].split('-')[1]],
                                pax['birth_date'].split(' ')[0].split('-')[0])
                        })
                except Exception as e:
                    _logger.error(str(e) + traceback.format_exc())
                if pax.get('nationality_code'):
                    if country.get(pax['nationality_code']):
                        pax['nationality_name'] = country[pax['nationality_code']]
                    else:
                        for country in airline_country:
                            if country['code'] == pax['nationality_code']:
                                country[pax['nationality_code']] = country['name']
                                pax['nationality_name'] = country['name']
                                break
                if pax.get('identity_country_of_issued_code'):
                    if country.get(pax['identity_country_of_issued_code']):
                        pax['identity_country_of_issued_name'] = country[pax['identity_country_of_issued_code']]
                    else:
                        for country in airline_country:
                            if country['code'] == pax['identity_country_of_issued_code']:
                                country[pax['identity_country_of_issued_code']] = country['name']
                                pax['identity_country_of_issued_name'] = country['name']
                                break
            for provider in res['result']['response']['provider_bookings']:
                for journey in provider['journeys']:
                    journey.update({
                        'departure_date': convert_string_to_date_to_string_front_end_with_time(journey['departure_date']) if journey['departure_date'] else journey['departure_date'],
                        'arrival_date': convert_string_to_date_to_string_front_end_with_time(journey['arrival_date']) if journey['arrival_date'] else journey['arrival_date']
                    })
                    for destination in airline_destinations:
                        if destination['code'] == journey['origin']:
                            journey.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                                'origin_country': destination['country']
                            })
                            break
                    for destination in airline_destinations:
                        if destination['code'] == journey['destination']:
                            journey.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                                'destination_country': destination['country']
                            })
                            break
                    for segment in journey['segments']:
                        segment.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']) if segment['departure_date'] else segment['departure_date'],
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']) if segment['arrival_date'] else segment['arrival_date'],
                        })
                        for fare_detail in segment['fare_details']:
                            try:
                                fare_detail['description'] = json.loads(json.loads(fare_detail['description']))
                            except Exception as e:
                                _logger.error(str(e) + '\n' + traceback.format_exc())
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country']
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country']
                                })
                                break
                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']) if leg['departure_date'] else leg['departure_date'],
                                'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']) if leg['arrival_date'] else leg['arrival_date'],
                            })
                            for destination in airline_destinations:
                                if destination['code'] == leg['origin']:
                                    leg.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                        'origin_country': destination['country']
                                    })
                                    break
                            for destination in airline_destinations:
                                if destination['code'] == leg['destination']:
                                    leg.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                        'destination_country': destination['country']
                                    })
                                    break
            if res['result']['response'].get('reschedule_list'):
                for reschedule in res['result']['response']['reschedule_list']:
                    for provider in reschedule['provider_bookings']:
                        for journey in provider['journeys']:
                            journey.update({
                                'departure_date': convert_string_to_date_to_string_front_end_with_time(journey['departure_date']) if journey['departure_date'] else journey['departure_date'],
                                'arrival_date': convert_string_to_date_to_string_front_end_with_time(journey['arrival_date']) if journey['arrival_date'] else journey['arrival_date']
                            })
                            for destination in airline_destinations:
                                if destination['code'] == journey['origin']:
                                    journey.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                        'origin_country': destination['country']
                                    })
                                    break
                            for destination in airline_destinations:
                                if destination['code'] == journey['destination']:
                                    journey.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                        'destination_country': destination['country']
                                    })
                                    break
                            for segment in journey['segments']:
                                segment.update({
                                    'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']) if segment['departure_date'] else segment['departure_date'],
                                    'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']) if segment['arrival_date'] else segment['arrival_date'],
                                })
                                for destination in airline_destinations:
                                    if destination['code'] == segment['origin']:
                                        segment.update({
                                            'origin_city': destination['city'],
                                            'origin_name': destination['name'],
                                            'origin_country': destination['country']
                                        })
                                        break
                                for destination in airline_destinations:
                                    if destination['code'] == segment['destination']:
                                        segment.update({
                                            'destination_city': destination['city'],
                                            'destination_name': destination['name'],
                                            'destination_country': destination['country']
                                        })
                                        break
                                for leg in segment['legs']:
                                    leg.update({
                                        'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']) if leg['departure_date'] else leg['departure_date'],
                                        'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']) if leg['arrival_date'] else leg['arrival_date'],
                                    })
                                    for destination in airline_destinations:
                                        if destination['code'] == leg['origin']:
                                            leg.update({
                                                'origin_city': destination['city'],
                                                'origin_name': destination['name'],
                                                'origin_country': destination['country']
                                            })
                                            break
                                    for destination in airline_destinations:
                                        if destination['code'] == leg['destination']:
                                            leg.update({
                                                'destination_city': destination['city'],
                                                'destination_name': destination['name'],
                                                'destination_country': destination['country']
                                            })
                                            break
                    for segment in reschedule['new_segments']:
                        segment.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']) if segment['departure_date'] else segment['departure_date'],
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']) if segment['arrival_date'] else segment['arrival_date']
                        })
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country']
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country']
                                })
                                break
                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']) if leg['departure_date'] else leg['departure_date'],
                                'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']) if leg['arrival_date'] else leg['arrival_date'],
                            })
                            for destination in airline_destinations:
                                if destination['code'] == leg['origin']:
                                    leg.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                        'origin_country': destination['country']
                                    })
                                    break
                            for destination in airline_destinations:
                                if destination['code'] == leg['destination']:
                                    leg.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                        'destination_country': destination['country']
                                    })
                                    break
                    for segment in reschedule['old_segments']:
                        segment.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']) if segment['departure_date'] else segment['departure_date'],
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']) if segment['arrival_date'] else segment['arrival_date']
                        })
                        for destination in airline_destinations:
                            if destination['code'] == segment['origin']:
                                segment.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                    'origin_country': destination['country']
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == segment['destination']:
                                segment.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                    'destination_country': destination['country']
                                })
                                break
                        for leg in segment['legs']:
                            leg.update({
                                'departure_date': convert_string_to_date_to_string_front_end_with_time(leg['departure_date']) if leg['departure_date'] else leg['departure_date'],
                                'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']) if leg['arrival_date'] else leg['arrival_date'],
                            })
                            for destination in airline_destinations:
                                if destination['code'] == leg['origin']:
                                    leg.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                        'origin_country': destination['country']
                                    })
                                    break
                            for destination in airline_destinations:
                                if destination['code'] == leg['destination']:
                                    leg.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                        'destination_country': destination['country']
                                    })
                                    break
            response = copy.deepcopy(res)
            for rec in response['result']['response']['provider_bookings']:
                rec['error_msg'] = ''
            time.sleep(1)
            write_cache_file(request, request.POST['signature'], 'airline_get_booking_response', response)
            # set_session(request, 'airline_get_booking_response_%s' % (request.POST['signature']), response)
            _logger.info("SUCCESS get_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_booking_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        write_cache_file(request, request.POST['signature'], 'airline_get_booking_response', res)
        # set_session(request, 'airline_get_booking_response_%s' % (request.POST['signature']), res)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_airline_reprice(request):
    url_request = get_url_gateway('booking/airline')

    booking_data = json.loads(request.POST['booking_data'])
    try:
        data = {
            "order_number": booking_data['result']['response']['order_number']
        }
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "repricing_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    return res

def update_service_charge(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': json.loads(request.POST['order_number']),
            'passengers': json.loads(request.POST['passengers']),
            'type': request.POST.get('type') and request.POST['type'] or ''
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pricing_booking",
            "signature": request.POST['signature'],
        }
        if data['type'] == 'request_new_review':
            data.update({
                'type': 'request_new'
            })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
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
            if data['type'] == 'request_new':
                write_cache_file(request, request.POST['signature'], 'airline_ssr_upsell', total_upsell_dict)
                # set_session(request, 'airline_ssr_upsell_' + request.POST['signature'], total_upsell_dict)
                # _logger.info(json.dumps(request.session['airline_ssr_upsell_' + request.POST['signature']]))
            else:
                write_cache_file(request, request.POST['signature'], 'airline_upsell', total_upsell_dict)
                # set_session(request, 'airline_upsell_' + request.POST['signature'], total_upsell_dict)
                # _logger.info(json.dumps(request.session['airline_upsell_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'airline_upsell_booker', total_upsell)
            # set_session(request, 'airline_upsell_booker_'+request.POST['signature'], total_upsell)
            # _logger.info(json.dumps(request.session['airline_upsell_booker_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge_booker AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_airline_booker AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_refund_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        provider_bookings = request.POST.get('passengers') and compute_pax_js_new(request.POST['passengers']) or []
        remarks = json.loads(request.POST['remarks'])
        fees = json.loads(request.POST['list_price_refund'])
        provider = json.loads(request.POST['provider'])
        for idx, provider_booking in enumerate(provider_bookings):
            provider_booking['provider'] = provider[idx]
            if provider_booking['provider'] == 'amadeus' and len(provider_booking['journeys']) > 1:
                provider_booking['journeys'].pop()
            for journey in provider_booking['journeys']:
                journey['passengers'] = []
                for fee in fees:
                    if provider_booking['pnr'] == fee['pnr']:
                        add_fee = True
                        for pax_obj in journey['passengers']:
                            if pax_obj['sequence'] == fee['sequence']:
                                add_fee = False
                                pax_obj['fees'].append(fee)

                        if add_fee == True:
                            journey['passengers'].append({
                                'first_name': fee['first_name'],
                                'last_name': fee['last_name'],
                                'sequence': fee['sequence'],
                                'fees': [fee],
                                'remark': ''
                            })
        for remark in remarks:
            if remark['value'] != '':
                remark['id'] = remark['id'].split(' - ')[0].split('~')
                for provider_booking in provider_bookings:
                    if remark['id'][1] == provider_booking['pnr']:
                        for journey in provider_booking['journeys']:
                            if remark['id'][3] == journey['origin'] and remark['id'][4] == journey['destination'] and convert_frontend_datetime_to_server_format(remark['id'][5]) == journey['departure_date']:
                                for pax in journey['passengers']:
                                    if pax['sequence'] == int(remark['id'][2]):
                                        pax['remark'] = remark['value']
        data = {
            'order_number': request.POST['order_number'],
            'provider_bookings': provider_bookings
        }
        if request.POST.get('refund_type'):
            data.update({
                "refund_type": request.POST['refund_type']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_refund_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel(request):
    # nanti ganti ke get_ssr_availability
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])

        data = {
            'order_number': request.POST['order_number'],
            'passengers': request.POST.get('passengers') and compute_pax_js(request.POST['passengers']) or [],
            'provider_bookings': request.POST.get('passengers') and compute_pax_js_new(request.POST['passengers']) or data_booking['result']['response']['provider_bookings']
        }
        if request.POST.get('refund_type'):
            data.update({
                "refund_type": request.POST['refund_type']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
            'agent_payment_method': request.POST.get('agent_payment') or False, ## kalau tidak kirim default balance normal
            'voucher': {}
        }
        if request.POST.get('pin'):
            data['pin'] = encrypt_pin(request.POST['pin'])
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        provider = []
        try:
            if request.POST['use_point'] == 'false':
                data['use_point'] = False
            else:
                data['use_point'] = True
        except:
            _logger.error('use_point not found')
        try:
            file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
            if file:
                airline_get_booking = file
            else:
                airline_get_booking = json.loads(request.POST['booking'])
            # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
            for provider_type in airline_get_booking['result']['response']['provider_bookings']:
                if not provider_type['provider'] in provider:
                    provider.append(provider_type['provider'])
        except Exception as e:
            _logger.error(str(e) + traceback.format_exc())

        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'airline', provider),
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
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued_airline AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def reissue(request):
    # nanti ganti ke get_ssr_availability
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])

        order_number = airline_get_booking['result']['response']['order_number']
        data_request = json.loads(request.POST['data'])
        cabin_class = ''
        for provider in data_request:
            for journey in provider['journeys']:
                journey['departure_date'] = parse_date_time_to_server(journey['departure_date'])
            cabin_class = provider.pop('cabin_class')
        data = {
            'reschedule_list': data_request,
            'cabin_class': cabin_class,
            'order_number': order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_reschedule_availability",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            airline_destinations = []
            file = read_cache("airline_destination", 'cache_web', request, 90911)
            if file:
                response = file
            for country in response:
                airline_destinations.append({
                    'code': country['code'],
                    'name': country['name'],
                    'city': country['city']
                })
            for provider in res['result']['response']['reschedule_availability_provider']:
                for journey_list in provider['schedules']:
                    for journey in journey_list['journeys']:
                        journey['is_combo_price'] = False
                        journey.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']))
                        })
                        if journey.get('arrival_date_return'):
                            journey.update({
                                'departure_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['departure_date_return'])),
                                'arrival_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['arrival_date_return']))
                            })
                        if journey.get('return_date'):
                            journey.update({
                                'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                            })
                        for destination in airline_destinations:
                            if destination['code'] == journey['origin']:
                                journey.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == journey['destination']:
                                journey.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
                        for segment in journey['segments']:
                            segment.update({
                                'departure_date': parse_date_time_front_end(
                                    string_to_datetime(segment['departure_date'])),
                                'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                            })
                            for destination in airline_destinations:
                                if destination['code'] == segment['origin']:
                                    segment.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                    })
                                    break

                            for destination in airline_destinations:
                                if destination['code'] == segment['destination']:
                                    segment.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                    })
                                    break

                            for leg in segment['legs']:
                                leg.update({
                                    'departure_date': parse_date_time_front_end(
                                        string_to_datetime(leg['departure_date'])),
                                    'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                                })

                                for destination in airline_destinations:
                                    if destination['code'] == leg['origin']:
                                        leg.update({
                                            'origin_city': destination['city'],
                                            'origin_name': destination['name'],
                                        })
                                        break

                                for destination in airline_destinations:
                                    if destination['code'] == leg['destination']:
                                        leg.update({
                                            'destination_city': destination['city'],
                                            'destination_name': destination['name'],
                                        })
                                        break

            _logger.info("SUCCESS reissued AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR reissued_airline AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_price_reissue_construct(request,boolean, counter):
    try:
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])
        passengers = json.loads(request.POST['passengers'])

        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = data_booking['result']['response']['order_number']
        pnr_list = json.loads(request.POST['pnr'])

        for idx, journey in enumerate(journey_booking):
            if boolean == True:
                # NO COMBO
                journeys.append({'segments': journey['segments']})
                try:
                    schedules.append({'journeys': journeys, 'pnr': pnr_list[idx]})
                except:
                    schedules.append({'journeys': journeys})
                journeys = []
            else:
                # COMBO
                check = 0
                journeys.append({'segments': journey['segments']})
                for schedule in schedules:
                    if schedule['provider'] == journey['provider']:
                        schedule['journeys'].append({
                            'segments': journey['segments']
                        })
                        check = 1
                        break
                    # for segment in journey['segments']:
                    #     if segment['carrier_code'] in schedule['carrier_code']:
                    #         schedule['journeys'].append({
                    #             'segments': journey['segments']
                    #         })
                    #         check = 1
                    #         break
                    if check == 1:
                        break
                if check == 0:
                    carrier_code = []
                    for segment in journey['segments']:
                        carrier_code.append(segment['carrier_code'])
                    try:
                        schedules.append({
                            'journeys': journeys,
                            'provider': journey['provider'],
                            'pnr': pnr_list[idx]
                        })
                    except:
                        schedules.append({
                            'journeys': journeys,
                            'provider': journey['provider'],
                        })
                journeys = []
        data = {
            "schedules": schedules,
            "order_number": order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_reschedule_itinerary",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    if res['result']['error_code'] == 0:
        airline_destinations = []
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city']
            })
        for price_itinerary_provider in res['result']['response']['sell_reschedule_provider']:
            for journey in price_itinerary_provider['journeys']:
                journey.update({
                    'rules': []
                })
                if journey.get('arrival_date_return'):
                    journey.update({
                        'departure_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['departure_date_return'])),
                        'arrival_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['arrival_date_return']))
                    })
                if journey.get('return_date'):
                    journey.update({
                        'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                    })
                for destination in airline_destinations:
                    if destination['code'] == journey['origin']:
                        journey.update({
                            'origin_city': destination['city'],
                            'origin_name': destination['name'],
                        })
                        break
                for destination in airline_destinations:
                    if destination['code'] == journey['destination']:
                        journey.update({
                            'destination_city': destination['city'],
                            'destination_name': destination['name'],
                        })
                        break
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(segment['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                    })
                    for destination in airline_destinations:
                        if destination['code'] == segment['origin']:
                            segment.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break

                    for destination in airline_destinations:
                        if destination['code'] == segment['destination']:
                            segment.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break

                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(leg['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                        })

                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
    elif boolean == True:
        pass
    else:
        counter += 1
        if counter < 3:
            res = sell_journey_reissue_construct(request, True, counter)
        boolean = True
    return res

def sell_journey_reissue_construct(request,boolean, counter):
    try:
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])
        passengers = json.loads(request.POST['passengers'])
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = data_booking['result']['response']['order_number']
        pnr_list = json.loads(request.POST['pnr'])

        for idx, journey in enumerate(journey_booking):
            if boolean == True:
                # NO COMBO
                journeys.append({'segments': journey['segments']})
                try:
                    schedules.append({'journeys': journeys, 'pnr': pnr_list[idx]})
                except:
                    try:
                        schedules.append({'journeys': journeys, 'pnr': pnr_list[0] if len(pnr_list) == 1 else pnr_list[idx]})
                    except:
                        schedules.append({'journeys': journeys})
                journeys = []
            else:
                # COMBO
                check = 0
                journeys.append({'segments': journey['segments']})
                for schedule in schedules:
                    if schedule['provider'] == journey['provider']:
                        schedule['journeys'].append({
                            'segments': journey['segments']
                        })
                        check = 1
                        break
                    # for segment in journey['segments']:
                    #     if segment['carrier_code'] in schedule['carrier_code']:
                    #         schedule['journeys'].append({
                    #             'segments': journey['segments']
                    #         })
                    #         check = 1
                    #         break
                    if check == 1:
                        break
                if check == 0:
                    carrier_code = []
                    for segment in journey['segments']:
                        carrier_code.append(segment['carrier_code'])
                    try:
                        schedules.append({
                            'journeys': journeys,
                            'provider': journey['provider'],
                            'pnr': pnr_list[idx]
                        })
                    except:
                        schedules.append({
                            'journeys': journeys,
                            'provider': journey['provider'],
                        })
                journeys = []
        data = {
            "schedules": schedules,
            "order_number": order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_reschedule",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    if res['result']['error_code'] == 0:
        airline_destinations = []
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city']
            })
        for price_itinerary_provider in res['result']['response']['sell_reschedule_provider']:
            for journey in price_itinerary_provider['journeys']:
                journey.update({
                    'rules': []
                })
                if journey.get('arrival_date_return'):
                    journey.update({
                        'departure_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['departure_date_return'])),
                        'arrival_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['arrival_date_return']))
                    })
                if journey.get('return_date'):
                    journey.update({
                        'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                    })
                for destination in airline_destinations:
                    if destination['code'] == journey['origin']:
                        journey.update({
                            'origin_city': destination['city'],
                            'origin_name': destination['name'],
                        })
                        break
                for destination in airline_destinations:
                    if destination['code'] == journey['destination']:
                        journey.update({
                            'destination_city': destination['city'],
                            'destination_name': destination['name'],
                        })
                        break
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(segment['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                    })
                    for destination in airline_destinations:
                        if destination['code'] == segment['origin']:
                            segment.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break

                    for destination in airline_destinations:
                        if destination['code'] == segment['destination']:
                            segment.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break

                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(leg['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                        })

                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
    elif boolean == True:
        pass
    else:
        counter += 1
        if counter < 3:
            res = sell_journey_reissue_construct(request, True, counter)
        boolean = True
    return res

def command_cryptic(request):
    try:
        data = {
            'text_string': request.POST['text_string'],
            'provider': request.POST['provider']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "command_cryptic",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res


def compute_pnr_pax_js(paxs):
    # Input: ['pnr~AABBCC~0','pnr~AABBCC~1','pnr~BBCCDD~0']
    # Output: [{'pnr':AABBCC, 'pax':[0,1]},{'pnr':BBCCDD, 'pax':[0]},]
    pnrs = []
    for rec in json.loads(paxs):
        rec = rec.split('~')
        exist = False
        for pnr in pnrs:
            if rec[1] == pnr['pnr']:
                exist = True
                break

        if not exist:
            pnr = {'pnr': rec[1], 'pax':[]}
            pnrs.append(pnr)
        pnr['pax'].append(rec[2])
    return pnrs

def compute_pax_js(paxs):
    pax_list = []
    for rec in json.loads(paxs):
        rec_pax = rec.split('~')
        if rec_pax[2] not in pax_list:
            pax_list.append(rec_pax[2])
    return [{'passenger_number': int(rec)} for rec in pax_list]

def compute_pax_js_new(paxs):
    # {PNR: lalala
    #  journeys:[{
    #      'desti'
    #      'origin'
    #      'departure_date':
    #      'pax':[{}]
    #  }]
    # }
    journeys = []
    for journey in json.loads(paxs):
        for rec in journey.split(' - '):
            rec_pax = rec.split('~')
            check = True
            for pnr in journeys:
                if pnr['pnr'] == rec_pax[1]:
                    for journey in pnr['journeys']:
                        if rec_pax[3] == journey['origin'] and rec_pax[4] == journey['destination'] and convert_frontend_datetime_to_server_format(rec_pax[5]) == journey['departure_date'] and rec_pax[2] not in journey['pax']:
                            journey['pax'].append(int(rec_pax[2]))
                            check = False
                    if check == True:
                        pnr['journeys'].append({
                            'destination': rec_pax[4],
                            'origin': rec_pax[3],
                            'departure_date': convert_frontend_datetime_to_server_format(rec_pax[5]),
                            'pax': []
                        })
                        journeys[len(journeys) - 1]['journeys'][len(journeys[len(journeys) - 1]['journeys']) - 1]['pax'].append(int(rec_pax[2]))
                    check = False

            if check == True:
                journeys.append({
                    'pnr': rec_pax[1],
                    'journeys': []
                })
                journeys[len(journeys)-1]['journeys'].append({
                    'destination': rec_pax[4],
                    'origin': rec_pax[3],
                    'departure_date': convert_frontend_datetime_to_server_format(rec_pax[5]),
                    'pax': []
                })
                journeys[len(journeys) - 1]['journeys'][len(journeys[len(journeys) - 1]['journeys']) -1]['pax'].append(int(rec_pax[2]))

    return journeys

def compute_pax_js_new_v2(paxs):
    # {PNR: lalala
    #  journeys:[{
    #      'desti'
    #      'origin'
    #      'departure_date':
    #      'pax':[{}]
    #  }]
    # }
    journeys = []
    for journey in json.loads(paxs):
        for rec in journey.split(' - '):
            rec_pax = rec.split('~')
            check = True
            for idx,pnr in enumerate(journeys):
                if pnr['pnr'] == rec_pax[1]:
                    for journey in pnr['journeys']:
                        if rec_pax[3] == journey['origin'] and rec_pax[4] == journey['destination'] and convert_frontend_datetime_to_server_format(rec_pax[5]) == journey['departure_date'] and rec_pax[2] not in journeys[idx]['passengers']:
                            if int(rec_pax[2]) not in journeys[idx]['pax']:
                                journeys[idx]['pax'].append(int(rec_pax[2]))
                            check = False
                    if check == True:
                        pnr['journeys'].append({
                            'destination': rec_pax[4],
                            'origin': rec_pax[3],
                            'departure_date': convert_frontend_datetime_to_server_format(rec_pax[5]),
                            'pax': []
                        })
                        if int(rec_pax[2]) not in journeys[idx]['pax']:
                            journeys[idx]['pax'].append(int(rec_pax[2]))
                    check = False

            if check == True:
                journeys.append({
                    'pnr': rec_pax[1],
                    'journeys': [],
                    'pax': [],
                    'passengers': [],
                    'init_code': ''
                })
                journeys[len(journeys)-1]['journeys'].append({
                    'destination': rec_pax[4],
                    'origin': rec_pax[3],
                    'departure_date': convert_frontend_datetime_to_server_format(rec_pax[5]),
                    # 'pax': []
                })
                if int(rec_pax[2]) not in journeys[len(journeys) - 1]['pax']:
                    journeys[len(journeys) - 1]['pax'].append(int(rec_pax[2]))

    for rec in journeys:
        for pax in rec['pax']:
            rec['passengers'].append({"passenger_number": pax})
        rec.pop('journeys')
        rec.pop('pax')
    return journeys

def pre_refund_login(request):
    try:
        provider = []
        pnr = []
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        for provider_bookings in airline_get_booking['result']['response']['provider_bookings']:
            provider.append(provider_bookings['provider'])
            pnr.append(provider_bookings['pnr'])
        data = {
            "provider": provider,
            "pnr": pnr,
            "order_number": airline_get_booking['result']['response']['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "pre_refund_login",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS pre_refund_login AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR pre_refund_login AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_provider_booking_from_vendor(request, signature='', forceUpdate=False):
    try:
        data = {}
        if not signature:
            signature = request.POST['signature']
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_provider_booking_from_vendor",
            "signature": signature
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_provider_booking_from_vendor_airline", 'cache_web', request, 86400)
    if not file or forceUpdate:

        ## numpang hapus file cache
        delete_all_cache_file(request)

        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, "get_provider_booking_from_vendor_airline", request, 'cache_web')
                _logger.info("SUCCESS get_provider_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'])
                if request.session['user_account']['co_ho_seq_id'] in res['result']['response']['list_provider']:
                    res = res['result']['response']['list_provider'][request.session['user_account']['co_ho_seq_id']]
                    res = {
                        "result": {
                            "error_code": 0,
                            "error_msg": '',
                            "response": {
                                "list_provider": res
                            }
                        }
                    }
            else:
                _logger.error("ERROR get_provider_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            if request.session['user_account']['co_ho_seq_id'] in file['result']['response']['list_provider']:
                res = file['result']['response']['list_provider'][request.session['user_account']['co_ho_seq_id']]
                res = {
                    "result": {
                        "error_code": 0,
                        "error_msg": '',
                        "response": {
                            "list_provider": res
                        }
                    }
                }
        except Exception as e:
            _logger.error('ERROR get_provider_booking_from_vendor_airline file\n' + str(e) + '\n' + traceback.format_exc())
    return res

def get_retrieve_booking_from_vendor(request):
    try:
        data = {
            'proxy_co_uid': False,
            'pnr': request.POST.get('pnr'),
            'provider': request.POST.get('provider'),
            'is_retrieved': False,
            'pricing_date': False
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking_frontend_check_pnr",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            response = get_cache_data(request)
            file = read_cache("airline_destination", 'cache_web', request, 90911)
            if file:
                response = file
            airline_destinations = []
            for country in response:
                airline_destinations.append({
                    'code': country['code'],
                    'name': country['name'],
                    'city': country['city']
                })
            for journey in res['result']['response']['journeys']:
                journey.update({
                    'departure_date': convert_string_to_date_to_string_front_end_with_time(journey['departure_date']),
                    'arrival_date': convert_string_to_date_to_string_front_end_with_time(journey['arrival_date'])
                })
                for destination in airline_destinations:
                    if destination['code'] == journey['origin']:
                        journey.update({
                            'origin_city': destination['city'],
                            'origin_name': destination['name'],
                        })
                        break
                for destination in airline_destinations:
                    if destination['code'] == journey['destination']:
                        journey.update({
                            'destination_city': destination['city'],
                            'destination_name': destination['name'],
                        })
                        break
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': convert_string_to_date_to_string_front_end_with_time(segment['departure_date']),
                        'arrival_date': convert_string_to_date_to_string_front_end_with_time(segment['arrival_date']),
                    })
                    for destination in airline_destinations:
                        if destination['code'] == segment['origin']:
                            segment.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break
                    for destination in airline_destinations:
                        if destination['code'] == segment['destination']:
                            segment.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break
                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': convert_string_to_date_to_string_front_end_with_time(
                                leg['departure_date']),
                            'arrival_date': convert_string_to_date_to_string_front_end_with_time(leg['arrival_date']),
                        })
                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
            _logger.info("SUCCESS get_retrieve_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_retrieve_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def save_retrieve_booking_from_vendor(request):
    try:
        response = json.loads(request.POST['response'])
        response['result']['signature'] = request.POST['signature']
        for journey in response['result']['response']['journeys']:
            journey.update({
                'departure_date': convert_frontend_datetime_to_server_format(journey['departure_date']),
                'arrival_date': convert_frontend_datetime_to_server_format(journey['arrival_date'])
            })
            for segment in journey['segments']:
                segment.update({
                    'departure_date': convert_frontend_datetime_to_server_format(segment['departure_date']),
                    'arrival_date': convert_frontend_datetime_to_server_format(segment['arrival_date']),
                })
                for leg in segment['legs']:
                    leg.update({
                        'departure_date': convert_frontend_datetime_to_server_format(
                            leg['departure_date']),
                        'arrival_date': convert_frontend_datetime_to_server_format(leg['arrival_date']),
                    })
        # if request.POST.get('duplicate_pnr') == 'true':
        #     bool_pnr = True
        # else:
        #     bool_pnr = False
        bool_pnr = False
        data = {
            'booker_id': request.POST.get('booker_id'),
            'response': response['result'],
            'duplicate_pnr': bool_pnr,
            'customer_parent_id': request.POST.get('customer_parent_id')
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "save_retrieve_booking_frontend",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS save_retrieve_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR save_retrieve_booking_from_vendor AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_new_ori_ticket(request):
    try:
        data = {
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_new_vendor_ticket_itinerary",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_new_ori_ticket AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_new_ori_ticket AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_refund_booking(request):
    try:
        data = {
            'order_number': request.POST['order_number'],
            'passengers': request.POST.get('passengers') and compute_pax_js(request.POST['passengers']) or [],
            'provider_bookings': request.POST.get('passengers') and compute_pax_js_new(request.POST['passengers']) or [],
            "captcha": json.loads(request.POST['captcha']),
        }
        if request.POST.get('refund_type'):
            data.update({
                "refund_type": request.POST['refund_type']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_refund_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_refund_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_refund_booking AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

# POST
def get_post_ssr_availability(request):
    file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
    if file:
        data_booking = file
    else:
        data_booking = json.loads(request.POST['booking'])
    # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
    schedules = []
    order_number = data_booking['result']['response']['order_number']
    for rec in data_booking['result']['response']['provider_bookings']:
        schedules.append({"pnr": rec['pnr']})
    data = {
        "schedules": schedules,
        "order_number": order_number
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_post_ssr_availability",
        "signature": request.POST['signature'],
    }
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            try:
                _logger.info("get_post_ssr_availability AIRLINE SIGNATURE " + request.POST['signature'])
                for ssr_availability_provider in res['result']['response']['ssr_availability_provider']:
                    for ssr_availability in ssr_availability_provider['ssr_availability']:
                        for ssrs in ssr_availability_provider['ssr_availability'][ssr_availability]:
                            ssrs.update({
                                'origin': ssrs['segments'][0]['origin'],
                                'destination': ssrs['segments'][len(ssrs['segments']) - 1]['destination']
                            })
                            for ssr in ssrs['ssrs']:
                                total = 0
                                currency = ''
                                for service_charge in ssr['service_charges']:
                                    currency = service_charge['currency']
                                    total += service_charge['amount']
                                ssr['total_price'] = total
                                ssr['currency'] = currency

            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
                _logger.error("get_post_ssr_availability AIRLINE SIGNATURE " + request.POST['signature'] + json.dumps(res))
            write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
            # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)
        else:
            write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
            # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)

            _logger.error("get_post_ssr_availability ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
        # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_post_seat_availability(request):
    file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
    if file:
        data_booking = file
    else:
        data_booking = json.loads(request.POST['booking'])
    # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
    schedules = []
    order_number = data_booking['result']['response']['order_number']
    for rec in data_booking['result']['response']['provider_bookings']:
        schedules.append({"pnr": rec['pnr']})
    data = {
        "schedules": schedules,
        "order_number": order_number
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_post_seat_availability",
        "signature": request.POST['signature'],
    }
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    write_cache_file(request, request.POST['signature'], 'airline_get_seat_availability', res)
    # set_session(request, 'airline_get_seat_availability_%s' % request.POST['signature'], res)
    # _logger.info(json.dumps(request.session['airline_get_seat_availability_%s' % request.POST['signature']]))

    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_post_seat_availability AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_post_seat_availability ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_post_ssrs(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = airline_get_booking['result']['response']['order_number']

        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_request')
        if file:
            data = {
                'sell_ssrs_request': file,
                'order_number': order_number
            }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_post_ssrs",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_file(request, request.POST['signature'], 'airline_sell_ssrs')
    if file:
        res = request.session['airline_sell_ssrs' + request.POST['signature']]
    elif read_cache_file(request, request.POST['signature'], 'airline_ssr_request') != {}:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)

    # if 'airline_sell_ssrs' + request.POST['signature'] in request.session:
    #     res = request.session['airline_sell_ssrs' + request.POST['signature']]
    # elif request.session['airline_ssr_request_%s' % request.POST['signature']] != {}:
    #     url_request = get_url_gateway('booking/airline')
    #     res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_sell_ssrs', res)
            # set_session(request, 'airline_sell_ssrs' + request.POST['signature'], res)
            _logger.info("SUCCESS sell_post_ssrs AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR sell_post_ssrs AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_request')
        if file == {}:
            _logger.error("NO SSR")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'sell_ssr_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        # if request.session['airline_ssr_request_%s' % request.POST['signature']] == {}:
        #     _logger.error("NO SSR")
        #     res = {
        #         'result': {
        #             'error_code': 0,
        #             'response': {
        #                 'sell_ssr_provider': [
        #                     {
        #                         'status': 'SUCCESS'
        #                     }
        #                 ]
        #             }
        #         }
        #     }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def assign_post_seats(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = airline_get_booking['result']['response']['order_number']
        file = read_cache_file(request, request.POST['signature'], 'airline_seat_request')
        if file:
            data = {
                'segment_seat_request': file,
                'order_number': order_number
            }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "assign_post_seats",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_file(request, request.POST['signature'], 'airline_assign_seat')
    if file:
        res = file
    elif read_cache_file(request, request.POST['signature'], 'airline_seat_request') != 0:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    # if 'airline_seat_request' + request.POST['signature'] in request.session:
    #     res = request.POST['airline_seat_request' + request.POST['signature']]
    # elif len(request.session['airline_seat_request_%s' % request.POST['signature']]) != 0:
    #     url_request = get_url_gateway('booking/airline')
    #     res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_assign_seat', res)
            # request.session['airline_seat_request' + request.POST['signature']] = res
            _logger.info("SUCCESS assign_post_seats AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR assign_post_seats AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        file = read_cache_file(request, request.POST['signature'], 'airline_seat_request')
        if file and len(file) == 0:
            _logger.error("NO seat")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'seat_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        # if len(request.session['airline_seat_request_%s' % request.POST['signature']]) == 0:
        #     _logger.error("NO seat")
        #     res = {
        #         'result': {
        #             'error_code': 0,
        #             'response': {
        #                 'seat_provider': [
        #                     {
        #                         'status': 'SUCCESS'
        #                     }
        #                 ]
        #             }
        #         }
        #     }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_booking(request):
    #nanti ganti ke get_ssr_availability
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        schedules = []
        order_number = data_booking['result']['response']['order_number']
        for rec in data_booking['result']['response']['provider_bookings']:
            schedules.append({"pnr": rec['pnr'], "segments": []})
        if request.POST.get('pax_seat'):
            seat = json.loads(request.POST['pax_seat'])
            for idx,pax in enumerate(seat):
                for idy,seg in enumerate(pax['seat_list']):

                    for index,schedule in enumerate(schedules):
                        if schedule['pnr'] == seg['pnr']:
                            check_schedule = False
                            for count, schedule_seg in enumerate(schedule['segments']):
                                if schedule_seg['origin'] == seg['segment_code'].split('-')[0] and schedule_seg['destination'] == seg['segment_code'].split('-')[1] and schedule_seg['departure_date'] == seg['departure_date']:
                                    check_schedule = True
                                    segment_index = count
                                    break
                            if not check_schedule:
                                schedule['segments'].append({
                                    "origin": seg['segment_code'].split('-')[0],
                                    "destination": seg['segment_code'].split('-')[1],
                                    "pax": [],
                                    "departure_date": seg['departure_date']
                                })
                                segment_index = len(schedule['segments'])-1
                            schedule['segments'][segment_index]['pax'].append({
                                'sequence': pax['passenger_number'],
                                'seat_code': seg['seat_code'],
                                'price': seg['price']
                            })
                            break
        data = {
            "schedules": schedules,
            "order_number": order_number,
        }
        try:
            if request.POST['member'] == 'non_member':
                member = False
            else:
                member = True
            data.update({
                'member': member,
                'acquirer_seq_id': request.POST['acquirer_seq_id'],
                'agent_payment_method': request.POST.get('agent_payment') or False,## kalau tidak kirim default balance normal
            })
            if request.POST.get('pin'):
                data['pin'] = encrypt_pin(request.POST['pin'])
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_booking AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res


#V2

def get_reschedule_availability_v2(request):
    # nanti ganti ke get_ssr_availability
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        data_temp = airline_get_booking['result']['response']
        order_number = data_temp['order_number']
        passenger = []
        for pax in data_temp['passengers']:
            passenger.append({'passenger_number':pax['sequence']})
        data_request = json.loads(request.POST['data'])
        for provider in data_request:
            for journey in provider['journeys']:
                journey['departure_date'] = parse_date_time_to_server(journey['departure_date'])
                ## update cabin_class per journey
                # journey['cabin_class'] = provider['cabin_class']
            provider['passengers'] = passenger
            # provider.pop('cabin_class')
        data = {
            'reschedule_list': data_request,
            'order_number': order_number,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_reschedule_availability_v2",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            airline_destinations = []
            file = read_cache("airline_destination", 'cache_web', request, 90911)
            if file:
                response = file
            for country in response:
                airline_destinations.append({
                    'code': country['code'],
                    'name': country['name'],
                    'city': country['city']
                })
            for provider in res['result']['response']['reschedule_availability_provider']:
                for journey_list in provider['schedules']:
                    for journey in journey_list['journeys']:
                        journey['is_combo_price'] = False
                        journey.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(journey['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(journey['arrival_date']))
                        })
                        if journey.get('arrival_date_return'):
                            journey.update({
                                'departure_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['departure_date_return'])),
                                'arrival_date_return': parse_date_time_front_end(
                                    string_to_datetime(journey['arrival_date_return']))
                            })
                        if journey.get('return_date'):
                            journey.update({
                                'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                            })
                        for destination in airline_destinations:
                            if destination['code'] == journey['origin']:
                                journey.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break
                        for destination in airline_destinations:
                            if destination['code'] == journey['destination']:
                                journey.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break
                        for segment in journey['segments']:
                            segment.update({
                                'departure_date': parse_date_time_front_end(
                                    string_to_datetime(segment['departure_date'])),
                                'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                            })
                            for destination in airline_destinations:
                                if destination['code'] == segment['origin']:
                                    segment.update({
                                        'origin_city': destination['city'],
                                        'origin_name': destination['name'],
                                    })
                                    break

                            for destination in airline_destinations:
                                if destination['code'] == segment['destination']:
                                    segment.update({
                                        'destination_city': destination['city'],
                                        'destination_name': destination['name'],
                                    })
                                    break

                            for leg in segment['legs']:
                                leg.update({
                                    'departure_date': parse_date_time_front_end(
                                        string_to_datetime(leg['departure_date'])),
                                    'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                                })

                                for destination in airline_destinations:
                                    if destination['code'] == leg['origin']:
                                        leg.update({
                                            'origin_city': destination['city'],
                                            'origin_name': destination['name'],
                                        })
                                        break

                                for destination in airline_destinations:
                                    if destination['code'] == leg['destination']:
                                        leg.update({
                                            'destination_city': destination['city'],
                                            'destination_name': destination['name'],
                                        })
                                        break

            _logger.info("SUCCESS get_reschedule_availability_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_reschedule_availability_v2 AIRLINE SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_reschedule_itinerary_v2(request):
    try:
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])

        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = data_booking['result']['response']['order_number']
        passenger = []
        for pax in data_booking['result']['response']['passengers']:
            passenger.append({'passenger_number': pax['sequence']})
        pnr_list = json.loads(request.POST['pnr'])
        last_pnr = ''
        for idx, journey in enumerate(journey_booking):
            journeys.append({'segments': journey['segments'], 'journey_key': journey['journey_key']})
            # NO COMBO
            if len(pnr_list) == len(journey_booking):
                try:
                    schedules.append({'journeys': journeys, 'pnr': pnr_list[idx], 'passengers': passenger})
                    last_pnr = pnr_list[idx]
                except:
                    schedules.append({'journeys': journeys, 'pnr': last_pnr, 'passengers': passenger})
                journeys = []
            else:
                # COMBO
                check = 0
                for schedule in schedules:
                    if schedule['provider'] == journey['provider']:
                        schedule['journeys'].append({
                            'segments': journey['segments'],
                            'journey_key': journey['journey_key']
                        })
                        check = 1
                        break
                    # for segment in journey['segments']:
                    #     if segment['carrier_code'] in schedule['carrier_code']:
                    #         schedule['journeys'].append({
                    #             'segments': journey['segments']
                    #         })
                    #         check = 1
                    #         break
                    if check == 1:
                        break
                if check == 0:
                    carrier_code = []
                    for segment in journey['segments']:
                        carrier_code.append(segment['carrier_code'])
                    schedules.append({
                        'journeys': journeys,
                        'passengers': passenger,
                        'pnr': pnr_list[idx],
                        'provider': journey['provider']
                    })
                journeys = []
        data = {
            "schedules": schedules,
            "order_number": order_number
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_reschedule_itinerary_v2",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    if res['result']['error_code'] == 0:
        airline_destinations = []
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city']
            })
        for price_itinerary_provider in res['result']['response']['reschedule_itinerary_provider']:
            for journey in price_itinerary_provider['journeys']:
                journey.update({
                    'rules': []
                })
                if journey.get('arrival_date_return'):
                    journey.update({
                        'departure_date_return': parse_date_time_front_end(string_to_datetime(journey['departure_date_return'])),
                        'arrival_date_return': parse_date_time_front_end(string_to_datetime(journey['arrival_date_return']))
                    })
                if journey.get('return_date'):
                    journey.update({
                        'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                    })
                for destination in airline_destinations:
                    if destination['code'] == journey['origin']:
                        journey.update({
                            'origin_city': destination['city'],
                            'origin_name': destination['name'],
                        })
                        break
                for destination in airline_destinations:
                    if destination['code'] == journey['destination']:
                        journey.update({
                            'destination_city': destination['city'],
                            'destination_name': destination['name'],
                        })
                        break
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(segment['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                    })
                    for destination in airline_destinations:
                        if destination['code'] == segment['origin']:
                            segment.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break

                    for destination in airline_destinations:
                        if destination['code'] == segment['destination']:
                            segment.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break

                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(leg['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                        })

                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break

    return res

def sell_reschedule_v2(request):
    try:
        schedules = []
        journeys = []
        journey_booking = json.loads(request.POST['journeys_booking'])

        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = data_booking['result']['response']['order_number']
        passenger = []
        for pax in data_booking['result']['response']['passengers']:
            passenger.append({'passenger_number': pax['sequence']})
        pnr_list = json.loads(request.POST['pnr'])
        last_pnr = ''
        for idx, journey in enumerate(journey_booking):
            journeys.append({'segments': journey['segments'], 'journey_key': journey['journey_key']})
            # NO COMBO
            if len(pnr_list) == len(journey_booking):
                try:
                    schedules.append({'journeys': journeys, 'pnr': pnr_list[idx], 'passengers': passenger})
                    last_pnr = pnr_list[idx]
                except:
                    schedules.append({'journeys': journeys, 'pnr': last_pnr, 'passengers': passenger})
                journeys = []
            else:
                # COMBO
                check = 0
                for schedule in schedules:
                    if schedule['provider'] == journey['provider']:
                        schedule['journeys'].append({
                            'segments': journey['segments'],
                            'journey_key': journey['journey_key']
                        })
                        check = 1
                        break
                    # for segment in journey['segments']:
                    #     if segment['carrier_code'] in schedule['carrier_code']:
                    #         schedule['journeys'].append({
                    #             'segments': journey['segments']
                    #         })
                    #         check = 1
                    #         break
                    if check == 1:
                        break
                if check == 0:
                    carrier_code = []
                    for segment in journey['segments']:
                        carrier_code.append(segment['carrier_code'])
                    schedules.append({
                        'journeys': journeys,
                        'passengers': passenger,
                        'pnr': pnr_list[idx],
                        'provider': journey['provider']
                    })
                journeys = []
        data = {
            "schedules": schedules,
            "order_number": order_number
        }
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_reschedule_v2",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)

    if res['result']['error_code'] == 0:
        airline_destinations = []
        file = read_cache("airline_destination", 'cache_web', request, 90911)
        if file:
            response = file
        for country in response:
            airline_destinations.append({
                'code': country['code'],
                'name': country['name'],
                'city': country['city']
            })
        for price_itinerary_provider in res['result']['response']['sell_reschedule_provider']:
            for journey in price_itinerary_provider['journeys']:
                journey.update({
                    'rules': []
                })
                if journey.get('arrival_date_return'):
                    journey.update({
                        'departure_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['departure_date_return'])),
                        'arrival_date_return': parse_date_time_front_end(
                            string_to_datetime(journey['arrival_date_return']))
                    })
                if journey.get('return_date'):
                    journey.update({
                        'return_date': parse_date_time_front_end(string_to_datetime(journey['return_date'])),
                    })
                for destination in airline_destinations:
                    if destination['code'] == journey['origin']:
                        journey.update({
                            'origin_city': destination['city'],
                            'origin_name': destination['name'],
                        })
                        break
                for destination in airline_destinations:
                    if destination['code'] == journey['destination']:
                        journey.update({
                            'destination_city': destination['city'],
                            'destination_name': destination['name'],
                        })
                        break
                for segment in journey['segments']:
                    segment.update({
                        'departure_date': parse_date_time_front_end(string_to_datetime(segment['departure_date'])),
                        'arrival_date': parse_date_time_front_end(string_to_datetime(segment['arrival_date']))
                    })
                    for destination in airline_destinations:
                        if destination['code'] == segment['origin']:
                            segment.update({
                                'origin_city': destination['city'],
                                'origin_name': destination['name'],
                            })
                            break

                    for destination in airline_destinations:
                        if destination['code'] == segment['destination']:
                            segment.update({
                                'destination_city': destination['city'],
                                'destination_name': destination['name'],
                            })
                            break

                    for leg in segment['legs']:
                        leg.update({
                            'departure_date': parse_date_time_front_end(string_to_datetime(leg['departure_date'])),
                            'arrival_date': parse_date_time_front_end(string_to_datetime(leg['arrival_date']))
                        })

                        for destination in airline_destinations:
                            if destination['code'] == leg['origin']:
                                leg.update({
                                    'origin_city': destination['city'],
                                    'origin_name': destination['name'],
                                })
                                break

                        for destination in airline_destinations:
                            if destination['code'] == leg['destination']:
                                leg.update({
                                    'destination_city': destination['city'],
                                    'destination_name': destination['name'],
                                })
                                break

    return res

def split_booking_v2(request):
    try:
        provider_bookings = []
        passengers = []
        data_passengers = json.loads(request.POST['passengers'])
        for pax in data_passengers:
            passengers.append({"passenger_number": int(pax.split('_')[1])})

        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])

        for provider_booking in data_booking['result']['response']['provider_bookings']:
            provider_bookings.append({
                'pnr': provider_booking['pnr'],
                'passengers': passengers
            })

        data = {
            "order_number": data_booking['result']['response']['order_number'],
            "provider_bookings": provider_bookings
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "split_booking_v2",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS split_booking_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR split_booking_v2 AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def get_post_ssr_availability_v2(request):
    file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
    if file:
        data_booking = file
    else:
        data_booking = json.loads(request.POST['booking'])
    # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
    schedules = []
    order_number = data_booking['result']['response']['order_number']
    for rec in data_booking['result']['response']['provider_bookings']:
        schedules.append({"pnr": rec['pnr']})
    data = {
        "schedules": schedules,
        "order_number": order_number
    }
    if request.session.get('currency'):
        data.update({
            "currency_code": request.session['currency']
        })
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_post_ssr_availability_v2",
        "signature": request.POST['signature'],
    }
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            try:
                _logger.info("get_post_ssr_availability_v2 AIRLINE SIGNATURE " + request.POST['signature'])
                for ssr_availability_provider in res['result']['response']['ssr_availability_provider']:
                    if(ssr_availability_provider.get('ssr_availability')):
                        for ssr_availability in ssr_availability_provider['ssr_availability']:
                            for ssrs in ssr_availability_provider['ssr_availability'][ssr_availability]:
                                ssrs.update({
                                    'origin': ssrs['segments'][0]['origin'],
                                    'destination': ssrs['segments'][len(ssrs['segments']) - 1]['destination']
                                })
                                for ssr in ssrs['ssrs']:
                                    total = 0
                                    currency = ''
                                    for service_charge in ssr['service_charges']:
                                        currency = service_charge['currency']
                                        total += service_charge['amount']
                                    ssr['total_price'] = total
                                    ssr['currency'] = currency

            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
                _logger.error("get_post_ssr_availability_v2 AIRLINE SIGNATURE " + request.POST['signature'] + json.dumps(res))
            write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
            # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)
        else:
            write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
            # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)

            _logger.error("get_post_ssr_availability_v2 ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        write_cache_file(request, request.POST['signature'], 'airline_get_ssr', res)
        # set_session(request, 'airline_get_ssr_%s' % request.POST['signature'], res)
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def sell_post_ssrs_v2(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = airline_get_booking['result']['response']['order_number']

        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_request')
        if file:
            data = {
                'sell_ssrs_request': file,
                'order_number': order_number
            }
        if request.session.get('currency'):
            data.update({
                "currency_code": request.session['currency']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_post_ssrs_v2",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_file(request, request.POST['signature'], 'airline_sell_ssrs')
    if file:
        res = file
    elif read_cache_file(request, request.POST['signature'], 'airline_ssr_request') != {}:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    # if 'airline_sell_ssrs' + request.POST['signature'] in request.session:
    #     res = request.session['airline_sell_ssrs' + request.POST['signature']]
    # elif request.session['airline_ssr_request_%s' % request.POST['signature']] != {}:
    #     url_request = get_url_gateway('booking/airline')
    #     res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_sell_ssrs', res)
            # set_session(request, 'airline_sell_ssrs' + request.POST['signature'], res)
            _logger.info("SUCCESS sell_post_ssrs_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR sell_post_ssrs_v2 AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        file = read_cache_file(request, request.POST['signature'], 'airline_ssr_request')
        if file and file == {}:
            _logger.error("NO SSR")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'sell_ssr_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        # if request.session['airline_ssr_request_%s' % request.POST['signature']] == {}:
        #     _logger.error("NO SSR")
        #     res = {
        #         'result': {
        #             'error_code': 0,
        #             'response': {
        #                 'sell_ssr_provider': [
        #                     {
        #                         'status': 'SUCCESS'
        #                     }
        #                 ]
        #             }
        #         }
        #     }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_post_seat_availability_v2(request):
    file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
    if file:
        data_booking = file
    else:
        data_booking = json.loads(request.POST['booking'])
    # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
    schedules = []
    order_number = data_booking['result']['response']['order_number']
    for rec in data_booking['result']['response']['provider_bookings']:
        schedules.append({"pnr": rec['pnr']})
    data = {
        "schedules": schedules,
        "order_number": order_number
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_post_seat_availability_v2",
        "signature": request.POST['signature'],
    }
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    write_cache_file(request, request.POST['signature'], 'airline_get_seat_availability', res)
    # set_session(request, 'airline_get_seat_availability_%s' % request.POST['signature'], res)
    # _logger.info(json.dumps(request.session['airline_get_seat_availability_%s' % request.POST['signature']]))

    try:
        if res['result']['error_code'] == 0:
            _logger.info("get_post_seat_availability_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_post_seat_availability_v2 ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def assign_post_seats_v2(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        order_number = airline_get_booking['result']['response']['order_number']
        file = read_cache_file(request, request.POST['signature'], 'airline_seat_request')
        if file:
            data = {
                'segment_seat_request': file,
                'order_number': order_number
            }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "assign_post_seats_v2",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache_file(request, request.POST['signature'], 'airline_assign_seat')
    if file:
        res = file
    elif len(read_cache_file(request, request.POST['signature'], 'airline_seat_request')) != 0:
        url_request = get_url_gateway('booking/airline')
        res = send_request_api(request, url_request, headers, data, 'POST', 300)

    # if 'airline_seat_request' + request.POST['signature'] in request.session:
    #     res = request.POST['airline_seat_request' + request.POST['signature']]
    # elif len(request.session['airline_seat_request_%s' % request.POST['signature']]) != 0:
    #     url_request = get_url_gateway('booking/airline')
    #     res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            write_cache_file(request, request.POST['signature'], 'airline_assign_seat', res)
            # request.session['airline_assign_seat_request' + request.POST['signature']] = res
            _logger.info("SUCCESS assign_post_seats_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR assign_post_seats_v2 AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        file = read_cache_file(request, request.POST['signature'], 'airline_seat_request')
        if file and len(file) == 0:
            _logger.error("NO seat")
            res = {
                'result': {
                    'error_code': 0,
                    'response': {
                        'seat_provider': [
                            {
                                'status': 'SUCCESS'
                            }
                        ]
                    }
                }
            }
        # if len(request.session['airline_seat_request_%s' % request.POST['signature']]) == 0:
        #     _logger.error("NO seat")
        #     res = {
        #         'result': {
        #             'error_code': 0,
        #             'response': {
        #                 'seat_provider': [
        #                     {
        #                         'status': 'SUCCESS'
        #                     }
        #                 ]
        #             }
        #         }
        #     }
        else:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_booking_v2(request):
    #nanti ganti ke get_ssr_availability
    try:
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_booking = file
        else:
            data_booking = json.loads(request.POST['booking'])
        # data_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        schedules = []
        order_number = data_booking['result']['response']['order_number']
        for rec in data_booking['result']['response']['provider_bookings']:
            schedules.append({"pnr": rec['pnr'], "segments": []})
        if request.POST.get('pax_seat'):
            seat = json.loads(request.POST['pax_seat'])
            for idx,pax in enumerate(seat):
                for idy,seg in enumerate(pax['seat_list']):

                    for index,schedule in enumerate(schedules):
                        if schedule['pnr'] == seg['pnr']:
                            check_schedule = False
                            for count, schedule_seg in enumerate(schedule['segments']):
                                if schedule_seg['origin'] == seg['segment_code'].split('-')[0] and schedule_seg['destination'] == seg['segment_code'].split('-')[1] and schedule_seg['departure_date'] == seg['departure_date']:
                                    check_schedule = True
                                    segment_index = count
                                    break
                            if not check_schedule:
                                schedule['segments'].append({
                                    "origin": seg['segment_code'].split('-')[0],
                                    "destination": seg['segment_code'].split('-')[1],
                                    "pax": [],
                                    "departure_date": seg['departure_date']
                                })
                                segment_index = len(schedule['segments'])-1
                            schedule['segments'][segment_index]['pax'].append({
                                'sequence': pax['passenger_number'],
                                'seat_code': seg['seat_code'],
                                'price': seg['price']
                            })
                            break
        data = {
            "schedules": schedules,
            "order_number": order_number,
        }
        try:
            if request.POST['member'] == 'non_member':
                member = False
            else:
                member = True
            data.update({
                'member': member,
                'acquirer_seq_id': request.POST['acquirer_seq_id'],
                'agent_payment_method': request.POST.get('agent_payment') or False,## kalau tidak kirim default balance normal
            })
            if request.POST.get('pin'):
                data['pin'] = encrypt_pin(request.POST['pin'])
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_booking_v2",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_booking_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_booking_v2 AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res


def pre_refund_login_v2(request):
    try:
        schedules = compute_pax_js_new_v2(request.POST['passengers'])

        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])

        data = {
            "schedules": schedules,
            "order_number": airline_get_booking['result']['response']['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "init_cancel_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS pre_refund_login_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR pre_refund_login_v2 AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_cancel_booking(request):
    try:
        schedules = compute_pax_js_new_v2(request.POST['passengers'])

        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            airline_get_booking = file
        else:
            airline_get_booking = json.loads(request.POST['booking'])
        # airline_get_booking = request.session['airline_get_booking_response'] if request.session.get('airline_get_booking_response') else json.loads(request.POST['booking'])
        captcha = json.loads(request.POST['captcha'])
        if captcha:
            for idx, rec in enumerate(schedules):
                rec['init_code'] = captcha[idx]
        data = {
            "schedules": schedules,
            "order_number": airline_get_booking['result']['response']['order_number']
        }
        if request.POST.get('refund_type'):
            data.update({
                "refund_type": request.POST['refund_type']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_cancel_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_cancel_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_cancel_booking AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_refund_booking_v2(request):
    # nanti ganti ke get_ssr_availability
    try:
        schedules = compute_pax_js_new_v2(request.POST['passengers'])
        provider_bookings = request.POST.get('passengers') and compute_pax_js_new(request.POST['passengers']) or []
        remarks = json.loads(request.POST['remarks'])
        # fees = json.loads(request.POST['list_price_refund']) #DI PAKAI KLO SUDAH TEXTBOX
        provider = json.loads(request.POST['provider'])
        airline_refund_data = json.loads(request.POST['refund_response'])
        idx = 0
        for seq_schedule,schedule in enumerate(schedules):
            for passenger in schedule['passengers']:
                passenger['reason_code'] = remarks[idx]['value']
                passenger['fees'] = []
                for data_fee_refund in airline_refund_data['cancel_booking_provider'][seq_schedule]['passengers'][idx]['fees']:
                    passenger['fees'].append(data_fee_refund)


        # for idx, provider_booking in enumerate(provider_bookings):
        #     provider_booking['provider'] = provider[idx]
        #     if provider_booking['provider'] == 'amadeus' and len(provider_booking['journeys']) > 1:
        #         provider_booking['journeys'].pop()
        #     for journey in provider_booking['journeys']:
        #         journey['passengers'] = []
        #         for fee in fees:
        #             if provider_booking['pnr'] == fee['pnr']:
        #                 add_fee = True
        #                 for pax_obj in journey['passengers']:
        #                     if pax_obj['sequence'] == fee['sequence']:
        #                         add_fee = False
        #                         pax_obj['fees'].append(fee)
        #
        #                 if add_fee == True:
        #                     journey['passengers'].append({
        #                         'first_name': fee['first_name'],
        #                         'last_name': fee['last_name'],
        #                         'sequence': fee['sequence'],
        #                         'fees': [fee],
        #                         'remark': ''
        #                     })
        # for remark in remarks:
        #     if remark['value'] != '':
        #         remark['id'] = remark['id'].split(' - ')[0].split('~')
        #         for provider_booking in provider_bookings:
        #             if remark['id'][1] == provider_booking['pnr']:
        #                 for journey in provider_booking['journeys']:
        #                     if remark['id'][3] == journey['origin'] and remark['id'][4] == journey['destination'] and convert_frontend_datetime_to_server_format(remark['id'][5]) == journey['departure_date']:
        #                         for pax in journey['passengers']:
        #                             if pax['sequence'] == int(remark['id'][2]):
        #                                 pax['remark'] = remark['value']
        data = {
            'order_number': request.POST['order_number'],
            'schedules': schedules
        }
        if request.POST.get('refund_type'):
            data.update({
                "refund_type": request.POST['refund_type']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_cancel_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_refund_booking_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_refund_booking_v2 AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel_v2(request):
    # nanti ganti ke get_ssr_availability
    try:
        schedules = compute_pax_js_new_v2(request.POST['passengers'])
        data = {
            'order_number': request.POST['order_number'],
            'schedules': schedules
        }
        if request.POST.get('refund_type'):
            data.update({
                "refund_type": request.POST['refund_type']
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "process_cancel_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel_v2 AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_v2 AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def apply_pax_name_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': request.POST['order_number'],
            'passengers': json.loads(request.POST['passengers'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "apply_pax_name_booking",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS apply_pax_name_booking AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR apply_pax_name_booking AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_post_pax_name(request):
    try:
        response = get_cache_data(request)
        passenger = []
        passenger_cache = json.loads(request.POST['passengers'])
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_awal_passenger = file['result']['response']['passengers']
        # data_awal_passenger = request.session['airline_get_booking_response']['result']['response']['passengers']
        for idx, pax in enumerate(passenger_cache):
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
            if pax['identity_type'] != '':
                pax['identity'] = {
                    "identity_country_of_issued_code": pax.get('identity_country_of_issued_code') or '',
                    "identity_expdate": pax.pop('identity_expdate'),
                    "identity_number": pax.pop('identity_number'),
                    "identity_first_name": pax.pop('identity_first_name'),
                    "identity_last_name": pax.pop('identity_last_name'),
                    "identity_type": pax.pop('identity_type'),
                }

            else:
                pax.pop('identity_expdate')
                pax.pop('identity_number')
                pax.pop('identity_first_name')
                pax.pop('identity_last_name')
                pax.pop('identity_type')
                # pax.pop('identity_image')
            if data_awal_passenger[idx]['title'] != pax['title'] or data_awal_passenger[idx]['first_name'] != pax['first_name'] or data_awal_passenger[idx]['last_name'] != pax['last_name']:
                passenger.append(pax)

        data = {
            'passengers': passenger,
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_post_pax_name",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    if len(passenger) > 0:
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    else:
        res = {
            "result": {
                "error_code": 0,
                "error_msg": "No Change detected"
            }
        }
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_post_pax_name AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_post_pax_name AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_post_pax_identity(request):
    try:
        response = get_cache_data(request)
        passenger = []
        passenger_cache = json.loads(request.POST['passengers'])
        file = read_cache_file(request, request.POST['signature'], 'airline_get_booking_response')
        if file:
            data_awal_passenger = file['result']['response']['passengers']
        # data_awal_passenger = request.session['airline_get_booking_response']['result']['response']['passengers']
        for idx,pax in enumerate(passenger_cache):
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
            if pax['identity_type'] != '':
                pax['identity'] = {
                    "identity_country_of_issued_code": pax.get('identity_country_of_issued_code') or '',
                    "identity_expdate": pax.pop('identity_expdate'),
                    "identity_number": pax.pop('identity_number'),
                    "identity_first_name": pax.pop('identity_first_name'),
                    "identity_last_name": pax.pop('identity_last_name'),
                    "identity_type": pax.pop('identity_type'),
                }

            else:
                pax.pop('identity_expdate')
                pax.pop('identity_number')
                pax.pop('identity_first_name')
                pax.pop('identity_last_name')
                pax.pop('identity_type')
                # pax.pop('identity_image')
            try:
                if data_awal_passenger[idx]['identity_type'] != pax['identity']['identity_type'] or \
                    data_awal_passenger[idx]['identity_number'] != pax['identity']['identity_number'] or \
                    data_awal_passenger[idx]['identity_first_name'] != pax['identity']['identity_first_name'] or \
                    data_awal_passenger[idx]['identity_last_name'] != pax['identity']['identity_last_name'] or \
                    data_awal_passenger[idx]['identity_expdate'] != pax['identity']['identity_expdate'] or \
                    data_awal_passenger[idx]['identity_country_of_issued_code'] != pax['identity']['identity_country_of_issued_code']:
                    passenger.append(pax)
            except Exception as e:
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

        data = {
            'passengers': passenger,
            'order_number': request.POST['order_number']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_post_pax_identity",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/airline')
    if len(passenger):
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
    else:
        res = {
            "result": {
                "error_code": 0,
                "error_msg": "No Change detected"
            }
        }
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_post_pax_identity AIRLINE SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_post_pax_identity AIRLINE SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_frequent_flyer_all_data(request, signature):
    data_file = read_cache("frequent_flyer_data", 'cache_web', request, 86400)
    if not data_file:
        res = {}
        try:
            url_request = get_url_gateway('booking/airline')
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_frequent_flyer_all_data",
                "signature": signature,
            }
            data = {}
            res = send_request_api(request, url_request, headers, data, 'POST', 15)
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
        if res['result']['error_code'] == 0:
            write_cache(res['result']['response'], "frequent_flyer_data", request, 'cache_web')
            data_file = res['result']['response']
    res = []
    if data_file:
        for ff_list_program in data_file['frequent_flyer_airline_list']:
            for loyalty_program in ff_list_program['loyalty_programs']:
                add_data = True
                for rec in res:
                    if rec['code'] == loyalty_program['code']:
                        add_data = False
                        break
                if add_data:
                    res.append({
                        "name": loyalty_program['name'],
                        "code": loyalty_program['code'],
                        "description": loyalty_program['description']
                    })
    return res



##### SEARCH MOBILE ######
def getDuration(departure_date, departure_time,arrival_date,arrival_time):
    temparrival = arrival_time.split(':')
    tempdeparture = departure_time.split(':')
    arrival = (int(temparrival[0])*3600)+(int(temparrival[1])*60)+int(temparrival[1])
    departure = (int(tempdeparture[0])*3600)+(int(tempdeparture[1])*60)+int(tempdeparture[1])
    if departure_date != arrival_date:
      arrival += 24*3600
    duration = arrival-departure
    durationsecond = duration%60
    durationminutes = int((duration/60)%60)
    durationhours = int(duration/3600)

    durationhours = durationhours
    durationminutes = durationminutes
    durationsecond = durationsecond

    if durationminutes!= "0":
        if(durationminutes<10):
            duration = str(durationhours) + "h0" + str(durationminutes) + "m"
        else:
            duration = str(durationhours) + "h" + str(durationminutes) + "m"
    else:
        duration = str(durationhours) + "h"
    return duration

def search_mobile(request):
    try:
        # airline
        data = {
            "journey_list": request.data['journey_list'],
            "direction": request.data['direction'],
            "is_combo_price": request.data['is_combo_price'],
            "adult": request.data['adult'],
            "child": request.data['child'],
            "infant": request.data['infant'],
            "cabin_class": request.data['cabin_class'],
            "provider": request.data['provider'],
            # "provider": 'amadeus',
            "carrier_codes": request.data['carrier_codes'],
            "promo_codes": request.data['promo_codes']
        }

        if request.data.get('student'):
            data.update({
                "student": request.data['student']
            })
        if request.data.get('labour'):
            data.update({
                "labour": request.data['labour']
            })
        if request.data.get('seaman'):
            data.update({
                "seaman": request.data['seaman']
            })

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.data['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 120)
    try:
        if res['result']['error_code'] == 0:
            res['result']['response'] = parser_schedule_mobile(request, res['result']['response'])
            _logger.error("SUCCESS SEARCH AIRLINE SIGNATURE " + request.data['signature'])
        else:
            _logger.error("ERROR SEARCH AIRLINE SIGNATURE " + request.data['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error('Error response airline search\n' + str(e) + '\n' + traceback.format_exc())
    try:
        response_search = res['result']

    except:
        response_search = {
            'result': res
        }
    return response_search

def reschedule_search_mobile(request):
    # get_data_awal
    file = read_cache("get_list_provider_data", 'cache_web', request, 90911)
    if file:
        provider_list_data = file
    else:
        get_provider_description(request)
        file = read_cache("get_list_provider_data", 'cache_web', request, 90911)
        if file:
            provider_list_data = file
    airline_destinations = []
    file = read_cache("airline_destination", 'cache_web', request, 90911)
    if file:
        response = file
    for country in response:
        airline_destinations.append({
            'code': country['code'],
            'name': country['name'],
            'city': country['city'],
            'country': country['country'],
        })
    try:
        # airline
        data = {
            "reschedule_list": request.data['reschedule_list'],
            "order_number": request.data['order_number']
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_reschedule_availability_v2",
            "signature": request.data['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/airline')
    res = send_request_api(request, url_request, headers, data, 'POST', 120)
    try:
        if res['result']['error_code'] == 0:
            for x, reschedule_availability_provider in enumerate(res['result']['response']['reschedule_availability_provider']):
                res['result']['response']['reschedule_availability_provider'][x] = parser_schedule_mobile(request, reschedule_availability_provider)
            _logger.error("SUCCESS SEARCH AIRLINE SIGNATURE " + request.data['signature'])
        else:
            _logger.error("ERROR SEARCH AIRLINE SIGNATURE " + request.data['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error('Error response reschedule airline search\n' + str(e) + '\n' + traceback.format_exc())
    try:
        response_search = res['result']

    except:
        response_search = {
            'result': res
        }
    return response_search

def parser_schedule_mobile(request, res):
    # get_data_awal
    file = read_cache("get_list_provider_data", 'cache_web', request, 90911)
    if file:
        provider_list_data = file
    else:
        get_provider_description(request)
        file = read_cache("get_list_provider_data", 'cache_web', request, 90911)
        if file:
            provider_list_data = file
    airline_destinations = []
    file = read_cache("airline_destination", 'cache_web', request, 90911)
    if file:
        response = file
    for country in response:
        airline_destinations.append({
            'code': country['code'],
            'name': country['name'],
            'city': country['city'],
            'country': country['country'],
        })
    arrival = []
    departure = []
    arrival_return = []
    departure_return = []
    available_count = []
    country_detail = {}
    airasia_carrier_list_code = ['AK', 'D7', 'FD', 'QZ', 'ZZ', 'DJ', 'XJ', 'Z2']
    breakdown_price_data = get_breakdown_price(request)
    agent_rate_data = get_agent_currency_rate(request)
    total_pax = request.data['adult'] + request.data['child']
    if request.data.get('seaman'):
        total_pax += request.data['seaman']
    if request.data.get('labour'):
        total_pax += request.data['labour']
    if request.data.get('student'):
        total_pax += request.data['student']

    for journey_list in res['schedules']:
        for journey in journey_list['journeys']:

            is_airasia = False
            data_temp = []
            class_of_service_list = []
            check_segment_fare = True
            available_seat = 100
            if provider_list_data.get(journey['provider']):
                if provider_list_data[journey['provider']]['is_post_issued_reschedule'] or \
                        provider_list_data[journey['provider']]['is_post_booked_reschedule']:
                    journey['is_reschedule'] = True
                else:
                    journey['is_reschedule'] = False
            else:
                journey['is_reschedule'] = False
            fare_details = []
            journey['search_banner_show'] = []
            if journey.get('search_banner'):
                for search_banner_dict in journey['search_banner']:
                    if search_banner_dict['active'] == True:
                        max_banner_date = datetime.now() - timedelta(
                            days=int(search_banner_dict['minimum_days']) if search_banner_dict[
                                                                                'minimum_days'] != '' else 0)
                        selected_banner_date = datetime.strptime(journey['departure_date'].split(' ')[0], '%Y-%m-%d')
                        if selected_banner_date >= max_banner_date:
                            journey['search_banner_show'].append(search_banner_dict)

            # if journey.hasOwnProperty('is_vtl_flight') and journey.is_vtl_flight:
            #     journey.search_banner_show.append({
            #         "active": True,
            #         "banner_color": "#205B95",
            #         "description": '',
            #         "name": "VTL Flight",
            #         "text_color": "#ffffff"
            #     })
            if request.data.get('journey_list'):
                for idx, req_journey_list in enumerate(request.data['journey_list']):
                    if journey['origin'] == req_journey_list['origin'] and journey['destination'] == req_journey_list['destination'] and journey['departure_date'].split(' ')[0] == req_journey_list['departure_date']:
                        journey['airline_sequence'] = idx
            elif request.data.get('reschedule_list'):
                journey_index = 0
                for idx, reschedule_list in enumerate(request.data['reschedule_list']):
                    for idy, req_journey in enumerate(reschedule_list['journeys']):
                        if journey['origin'] == req_journey['origin'] and journey['destination'] == req_journey['destination'] and journey['departure_date'].split(' ')[0] == req_journey['departure_date']:
                            journey['airline_sequence'] = journey_index
                            journey_index += 1
            if len(journey['segments']) > 0:
                journey['is_combo_price'] = False
                journey['class_of_service'] = []
                available_count = []
                journey['carrier_code_list'] = []
                journey['carrier_code_list_show'] = []

                journey['operating_airline_code_list'] = []

                temporary = journey['arrival_date'].split(' ')
                date = temporary[0].split('-')
                date = date[2] + '-' + date[1] + '-' + date[0]
                time = temporary[1].split(':')
                time = time[0] + ':' + time[1]
                arrival.append(date)
                arrival.append(time)
                arrival.append(datetime.strptime(date, '%d-%m-%Y').strftime('%a'))

                temporary = journey['departure_date'].split(' ')
                date = temporary[0].split('-')
                date = date[2] + '-' + date[1] + '-' + date[0]
                time = temporary[1].split(':')
                time = time[0] + ':' + time[1]
                departure.append(date)
                departure.append(time)
                departure.append(datetime.strptime(date, '%d-%m-%Y').strftime('%a'))
                try:
                    ##arrival_return
                    temporary = journey['arrival_date_return'].split(' ')
                    date = temporary[0].split('-')
                    date = date[2] + '-' + date[1] + '-' + date[0]
                    time = temporary[1].split(':')
                    time = time[0] + ':' + time[1]
                    arrival_return.append(date)
                    arrival_return.append(time)
                    arrival_return.append(datetime.strptime(date, '%d-%m-%Y').strftime('%a'))

                    ##departure_return
                    temporary = journey['departure_date_return'].split(' ')
                    date = temporary[0].split('-')
                    date = date[2] + '-' + date[1] + '-' + date[0]
                    time = temporary[1].split(':')
                    time = time[0] + ':' + time[1]
                    departure_return.append(date)
                    departure_return.append(time)
                    departure_return.append(datetime.strptime(date, '%d-%m-%Y').strftime('%a'))
                    journey['departure_return'] = departure_return
                    journey['arrival_return'] = arrival_return
                except:
                    pass

                journey['duration'] = getDuration(departure[0], departure[1], arrival[0], arrival[1])
                journey['departure'] = departure
                journey['arrival'] = arrival
                departure = []
                arrival = []
                departure_return = []
                arrival_return = []
                totalprice = 0
                total_price_with_discount = 0
                elapsed_time = journey['elapsed_time'].split(':')
                journey['elapsed_time_in_sec'] = (int(elapsed_time[0]) * 86400) + (int(elapsed_time[1]) * 3600) + (
                            int(elapsed_time[2]) * 60) + int(elapsed_time[3])
                elapsed_time_transit_duration_in_sec = 0
                for idy, segment in enumerate(journey['segments']):
                    if segment['transit_duration'] != '':
                        elapsed_time_transit_duration = segment['transit_duration'].split(':')
                        elapsed_time_transit_duration_in_sec += (int(elapsed_time_transit_duration[0]) * 86400) + (
                                    int(elapsed_time_transit_duration[1]) * 3600) + (int(
                            elapsed_time_transit_duration[2]) * 60) + int(elapsed_time_transit_duration[3])
                    segment['transit_duration_list'] = segment['transit_duration'].split(':')
                    check = 0
                    origin_found = False
                    destination_found = False
                    if country_detail.get(segment['origin']):
                        segment['origin_name'] = country_detail[segment['origin']]['name']
                        segment['origin_city'] = country_detail[segment['origin']]['city']
                        segment['origin_country'] = country_detail[segment['origin']]['country']
                        origin_found = True
                        check += 1
                    if country_detail.get(segment['destination']):
                        segment['destination_name'] = country_detail[segment['destination']]['name']
                        segment['destination_city'] = country_detail[segment['destination']]['city']
                        segment['destination_country'] = country_detail[segment['destination']]['country']
                        destination_found = True
                        check += 1

                    if check != 2:
                        for destination in airline_destinations:
                            if origin_found == False and segment['origin'] == destination['code']:
                                segment['origin_name'] = destination['name']
                                segment['origin_city'] = destination['city']
                                segment['origin_country'] = destination['country']
                                country_detail[destination['code']] = {
                                    "name": destination['name'],
                                    "city": destination['city'],
                                    "country": destination['country']
                                }
                                origin_found = True
                                check += 1
                            elif destination_found == False and segment['destination'] == destination['code']:
                                segment['destination_name'] = destination['name']
                                segment['destination_city'] = destination['city']
                                segment['destination_country'] = destination['country']
                                country_detail[destination['code']] = {
                                    "name": destination['name'],
                                    "city": destination['city'],
                                    "country": destination['country']
                                }
                                check += 1
                                destination_found = True
                            if check == 2:
                                break
                    check = 0
                    for carrier_code in journey['carrier_code_list']:
                        if carrier_code[0] == segment['carrier_code'] and carrier_code[1] == segment['operating_airline_code']:
                            check = 1
                            break
                    if check == 0:
                        journey['carrier_code_list'].append([segment['carrier_code'], segment['operating_airline_code']])
                        journey['carrier_code_list_show'].append(segment['carrier_code'])
                    if len(segment['fares']) == 0:
                        journey['totalprice'] = 0
                        available_count.append(0)
                    temporary = segment['arrival_date'].split(' ')
                    date = temporary[0].split('-')
                    date = date[2] + '-' + date[1] + '-' + date[0]
                    time = temporary[1].split(':')
                    time = time[0] + ':' + time[1]
                    arrival.append(date)
                    arrival.append(time)
                    arrival.append(datetime.strptime(date, '%d-%m-%Y').strftime('%a'))

                    temporary = segment['departure_date'].split(' ')
                    date = temporary[0].split('-')
                    date = date[2] + '-' + date[1] + '-' + date[0]
                    time = temporary[1].split(':')
                    time = time[0] + ':' + time[1]
                    departure.append(date)
                    departure.append(time)
                    departure.append(datetime.strptime(date, '%d-%m-%Y').strftime('%a'))

                    segment['duration'] = getDuration(departure[0], departure[1], arrival[0], arrival[1])
                    segment['departure'] = departure
                    segment['arrival'] = arrival
                    departure = []
                    arrival = []

                    ## check operated by
                    try:
                        if segment['carrier_code'] == segment['operating_airline_code']:
                            journey['operated_by_carrier_code'] = segment['operating_airline_code']
                            journey['operated_by'] = True
                        else:
                            journey['operated_by'] = False
                            journey['operated_by_carrier_code'] = segment['operating_airline_code']
                    except:
                        journey['operated_by'] = True
                        journey['operated_by_carrier_code'] = segment['carrier_code']

                    choose_fare = True
                    for idz, fare in enumerate(segment['fares']):
                        if fare['cabin_class'] == 'Y':
                            fare['cabin_class_name'] = 'Economy'
                        elif fare['cabin_class'] == 'W' and segment['carrier_code'] == 'QG':
                            fare['cabin_class_name'] = 'Royal Green'
                        elif fare['cabin_class'] == 'W':
                            fare['cabin_class_name'] = 'Premium Economy'
                        elif fare['cabin_class'] == 'C':
                            fare['cabin_class_name'] = 'Business'
                        elif fare['cabin_class'] == 'F':
                            fare['cabin_class_name'] = 'First Class'
                        if int(fare['available_count']) >= total_pax and choose_fare and check_segment_fare:
                            choose_fare = False
                            fare['pick'] = True
                            segment['fare_pick'] = idz
                            class_of_service_list.append(fare['class_of_service'])
                            add_new_data = True
                            for fare_detail in fare['fare_details']:
                                add_new_data = True
                                for idxx, fare_detail_pick in enumerate(fare_details):
                                    add_new_data = False
                                    if fare_detail_pick['detail_code'] == fare_detail['detail_code'] and \
                                            fare_detail_pick['amount'] > fare_detail['amount']:
                                        fare_details.pop(idxx)
                                        add_new_data = True
                                    elif fare_detail_pick['detail_code'] == fare_detail['detail_code'] and \
                                            fare_detail_pick['amount'] < fare_detail['amount']:
                                        break

                                if (add_new_data):
                                    fare_details.append(fare_detail)
                            for svc_summary in fare['service_charge_summary']:
                                if not svc_summary['pax_type'] in ['CHD', 'INF']:
                                    for svc in svc_summary['service_charges']:
                                        if svc['charge_type'] != 'RAC':
                                            if svc['charge_type'] != 'DISC':
                                                totalprice += svc['total'] / svc['pax_count']
                                            total_price_with_discount += svc['total'] / svc['pax_count']
                                            if journey.get('currency') == None:
                                                journey['currency'] = svc['currency']
                                    break

                            if idy == 0:
                                available_count.append(int(fare['available_count']))
                                journey['class_of_service'].append(fare['class_of_service'])
                                segment['bool'] = True
                            elif journey['is_combo_price']:
                                for journey_list_req in request.data['journey_list']:
                                    if journey_list_req['origin'] == segment['origin'] and segment.get('bool'):
                                        available_count.append(int(fare['available_count']))
                                        journey['class_of_service'].append(fare['class_of_service'])
                                        segment['bool'] = True

                        else:
                            fare['pick'] = False

                        for svc_summary in fare['service_charge_summary']:
                            if not svc_summary['pax_type'] in ['CHD', 'INF']:
                                total_price_fare = 0
                                for svc in svc_summary['service_charges']:
                                    if svc['charge_type'] != 'RAC' and svc['charge_type'] != 'DISC':
                                        total_price_fare += svc['total'] / svc['pax_count']
                                fare['total_price'] = total_price_fare
                        fare['show'] = True
                        fare['segments_sequence'] = segment['sequence']
                        fare['journey_code'] = journey['journey_code']
                    if choose_fare:
                        check_segment_fare = False

                journey['elapsed_time_transit_duration_in_sec'] = elapsed_time_transit_duration_in_sec
                if choose_fare == False and check_segment_fare:
                    if totalprice % 1 != 0:
                        totalprice = math.ceil(totalprice)
                    if total_price_with_discount % 1 != 0:
                        total_price_with_discount = math.ceil(total_price_with_discount)
                    journey['totalprice'] = totalprice
                    journey['totalprice_show'] = getrupiah(totalprice)
                    journey['totalprice_with_discount'] = total_price_with_discount
                    journey['totalprice_with_discount_show'] = getrupiah(total_price_with_discount)
                    if (totalprice == total_price_with_discount):
                        journey['show_discount'] = False
                    else:
                        journey['show_discount'] = True
                    journey['sold_out'] = False
                    journey['share_journey'] = False

                    for available in available_count:
                        if (
                                available_seat > available or available > available_seat and available_seat == 100):  ##kalau lebih dari default awal tetap simpan
                            available_seat = available

                        if (available_seat == 100):  ## kalau available masih default berarti kosong
                            available_seat = 0
                            journey['sold_out'] = True
                        journey['available_count'] = available_seat
                else:
                    journey['is_combo_price'] = False
                    journey['currency'] = ''
                    journey['totalprice'] = 0
                    journey['totalprice_show'] = '0'
                    journey['totalprice_with_discount'] = 0
                    journey['totalprice_with_discount_show'] = '0'
                    journey['show_discount'] = False
                    journey['available_count'] = 0
                    journey['sold_out'] = True
                    journey['share_journey'] = False

                totalprice = 0
            else:
                journey['is_combo_price'] = False
                journey['currency'] = ''
                journey['totalprice'] = 0
                journey['totalprice_show'] = '0'
                journey['available_count'] = 0
                journey['sold_out'] = True
                journey['share_journey'] = False

            for carrier_code in journey['carrier_code_list_show']:
                if is_airasia and carrier_code in airasia_carrier_list_code:
                    continue
                elif not is_airasia and carrier_code not in airasia_carrier_list_code:
                    data_temp.append(carrier_code)
                elif not is_airasia and carrier_code in airasia_carrier_list_code:
                    is_airasia = True
                    data_temp.append(carrier_code)
            journey['carrier_code_list_show'] = data_temp

            journey['fare_details_pick'] = fare_details
            journey['sequence'] = journey['journey_code']
            journey['show_detail'] = False
            journey['class_of_service_list'] = class_of_service_list

            breakdown_price_list = []
            breakdown_price_dict = {}
            estimated_price = []

            if journey['totalprice_with_discount'] != 0 and agent_rate_data['result']['is_show']:
                for currency in agent_rate_data['result']['response']['agent'][request.data['co_ho_seq_id']]:
                    estimated_price.append({
                        "currency": currency,
                        "price_show": getrupiah(journey['totalprice_with_discount'] /
                                                agent_rate_data['result']['response']['agent'][
                                                    request.data['co_ho_seq_id']][currency]['rate'])
                    })
                if len(estimated_price) > 0:
                    journey['estimated_price'] = estimated_price
            if breakdown_price_data['result']['response']:
                for segment in journey['segments']:
                    for fare in segment['fares']:
                        for svc_summary in fare['service_charge_summary']:
                            if not svc_summary['pax_type'] in ['CHD', 'INF']:
                                for svc in svc_summary['service_charges']:
                                    if svc['charge_type'] not in breakdown_price_dict:
                                        breakdown_price_dict[svc['charge_type']] = 0
                                    breakdown_price_dict[svc['charge_type']] += svc['amount']
                                break
                        if breakdown_price_dict:
                            break
                if breakdown_price_dict:
                    for data_breakdown in breakdown_price_dict:
                        breakdown_price_list.append({
                            "charge_type": data_breakdown,
                            "amount": getrupiah(breakdown_price_dict[data_breakdown])
                        })
                    journey['breakdown_price'] = breakdown_price_list
    if res['result']['response'].get('recommendation_maps'):
        res['result']['response'].pop('recommendation_maps')
    return res

## BUAT MOBILE MUNGKIN SUDAH TIDAK BUTUH
def get_breakdown_price(request):
    file = read_cache("show_breakdown_price", 'cache_web', request, 90911)
    if file:
        res = {
            "result": {
                "response": file,
                "error_code": 0,
                "error_msg": ''
            }
        }
    else:
        res = {
            "result": {
                "response": file,
                "error_code": 500,
                "error_msg": 'Error'
            }
        }
    return res

def get_agent_currency_rate(request):
    try:
        data = {}
        if request.POST.get('signature'):
            signature = request.POST['signature']
        elif request.data.get('signature'):
            signature = request.data['signature']
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_agent_currency_rate",
            "signature": signature
        }
        url_request = get_url_gateway('content')
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))

    file = read_cache("currency_rate", 'cache_web', request, 86400)
    if file:
        res = file
    else:
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, 'currency_rate', request)
                _logger.info("SUCCESS cancel_reservation_issued_request SIGNATURE " + signature)
            else:
                _logger.error("ERROR cancel_reservation_issued_request SIGNATURE " + signature + ' ' + json.dumps(res))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache("currency_rate_show", 'cache_web', request, 90911)
    if file:
        res['result'].update(file)
    else:
        res['result']['is_show'] = False
        # res['result']['is_show_provider'] = []
    return res

def getrupiah(price):
    try:
        temp = int(price)
        positif = False
        if temp > -1:
            positif = True

        temp = str(temp)
        temp = temp.split('-')[len(temp.split('-'))-1]
        pj = len(str(temp.split('.')[0]))
        pj_all = len(str(temp.replace('.','')))
        priceshow = ""
        index = 0
        for i in range(int(pj)):
            if (pj - index) % 3 == 0 and index != 0:
                priceshow += ','
            if not index >= pj:
                priceshow += temp[index:index+1]
            index += 1

        if len(temp.split('.')) == 2:
            index = pj
            for i in range(int(pj)):
                if index >= pj_all:
                    priceshow += temp[index:index+1]
                index += 1

        if positif == False:
            priceshow = '-' + priceshow
        return priceshow
    except:
        return price
