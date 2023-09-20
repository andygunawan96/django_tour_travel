from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
from .tt_webservice_voucher_views import *
import json
import logging
import traceback
import base64
from .tt_webservice_views import *
from .tt_webservice import *
from ..views import tt_webservice_agent_views as webservice_agent
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


@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'login':
            res = login(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'get_data_search_page':
            res = get_data_search_page(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_details':
            res = get_details(request)
        elif req_data['action'] == 'get_pricing':
            res = get_pricing(request)
        elif req_data['action'] == 'get_activity_carrier_data':
            res = get_activity_carrier_data(request)
        elif req_data['action'] == 'sell_activity':
            res = sell_activity(request)
        elif req_data['action'] == 'update_contact':
            res = update_contact(request)
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'update_options':
            res = update_options(request)
        elif req_data['action'] == 'activity_review_booking':
            res = get_review_booking_data(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'issued_booking':
            res = issued_booking(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'cancel_booking':
            res = cancel_booking(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'booker_insentif_booking':
            res = booker_insentif_booking(request)
        elif req_data['action'] == 'get_voucher':
            res = get_voucher(request)
        elif req_data['action'] == 'get_auto_complete':
            res = get_auto_complete(request)
        elif req_data['action'] == 'passenger_page':
            res = passenger_page(request)
        elif req_data['action'] == 'review_page':
            res = review_page(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def login(request):
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
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": 'signin'
    }
    url_request = get_url_gateway('session')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'activity', 20, res['result']['response']['signature'])
            # set_session(request, 'activity_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.POST.get('frontend_signature'):
                write_cache_file(request, res['result']['response']['signature'], 'activity_frontend_signature',request.POST['frontend_signature'])
                write_cache_file(request, request.POST['frontend_signature'], 'activity_signature',res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info("SIGNIN ACTIVITY SUCCESS SIGNATURE " + res['result']['response']['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_data_search_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['frontend_signature'], 'activity_search_request')
        if file:
            res['activity_request'] = file
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
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
            "provider_type": 'activity'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache("get_activity_carriers", 'cache_web', request)
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache(res, "get_activity_carriers", request, 'cache_web')
                _logger.info("get_carriers ACTIVITY RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache("get_activity_carriers", 'cache_web', request)
                    if file:
                        res = file
                    _logger.info("get_carriers ACTIVITY ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            if file:
                res = file
        except Exception as e:
            _logger.error('ERROR get_activity_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        temp_data = get_cache_data(request)

        response = {
            'activity_locations': temp_data['result']['response']['activity']['countries'],
            'activity_types': temp_data['result']['response']['activity']['types'],
            'activity_categories': temp_data['result']['response']['activity']['categories'],
        }

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data ACTIVITY SIGNATURE " + request.POST['signature'])
    except Exception as e:
        response = {
            'activity_locations': [],
            'activity_types': [],
            'activity_categories': [],
        }

        _logger.error(str(e) + '\n' + traceback.format_exc())

    return response


def search(request):
    try:
        activity_request = json.loads(request.POST['search_request'])
        # write_cache_file(request, request.POST['signature'], 'activity_search_request', json.loads(request.POST['search_request']))
        # set_session(request, 'activity_search_request', json.loads(request.POST['search_request']))
        # file = read_cache_file(request, request.POST['signature'], 'activity_search_request')
        # if file:
        data = {
            'query': activity_request['query'].replace('&amp;', '&'),
            'country': activity_request['country'],
            'city': activity_request['city'],
            'type': activity_request['type'],
            'category': activity_request['category'],
            'sub_category': activity_request['sub_category'],
        }
        write_cache_file(request, request.POST['signature'], 'activity_search_request', data)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
        # set_session(request, 'activity_search_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'activity_search_request')
            if file:
                data = file
                write_cache_file(request, request.POST['new_signature'], 'activity_search_request', data)
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['new_signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 120)
    try:
        counter = 0
        for i in res['result']['response']:
            i.update({
                'sequence': counter
            })
            counter += 1
        if request.POST.get('use_cache'):
            write_cache_file(request, request.POST['new_signature'], 'activity_search', res['result']['response'])
        else:
            write_cache_file(request, request.POST['signature'], 'activity_search', res['result']['response'])
        # set_session(request, 'activity_search', res['result']['response'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def get_details(request):
    try:
        data = {
            'activity_uuid': request.POST['activity_uuid'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_details",
            "signature": request.POST['signature']
        }
        write_cache_file(request, request.POST['signature'], 'activity_detail_request', data)
        # set_session(request, 'activity_detail_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'activity_detail_request')
            if file:
                data = file
                write_cache_file(request, request.POST['new_signature'], 'activity_detail_request', data)
            # data = request.session['activity_detail_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_details",
                "signature": request.POST['new_signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            for line in res['result']['response']['activity_lines']:
                for option in line['options']['perBooking']:
                    option.update({
                        'price_pick': 0
                    })
                for option in line['options']['perPax']:
                    option.update({
                        'price_pick': 0
                    })

            if request.POST.get('use_cache'):
                write_cache_file(request, request.POST['new_signature'], 'activity_pick', res['result']['response'])
            else:
                write_cache_file(request, request.POST['signature'], 'activity_pick', res['result']['response'])
            # set_session(request, 'activity_pick', res['result']['response'])
            # request.session.modified = True
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))
    return res


def get_pricing(request):
    try:
        pricing_days = int(request.POST['pricing_days'])
        startingDate = request.POST['startingDate']
        file = read_cache_file(request, request.POST['signature'], 'activity_pick')
        if file:
            data = {
                'product_type_uuid': request.POST['product_type_uuid'],
                'date_start': to_date_now(datetime.strptime(startingDate, '%d %b %Y').strftime('%Y-%m-%d %H:%M:%S'))[:10],
                'date_end': to_date_now((datetime.strptime(startingDate, '%d %b %Y')+timedelta(days=pricing_days)).strftime('%Y-%m-%d %H:%M:%S'))[:10],
                'sku_data': json.loads(request.POST['sku_data']),
                "provider": file['provider_code']
            }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_pricing",
            "signature": request.POST['signature']
        }
        write_cache_file(request, request.POST['signature'], 'activity_get_pricing_request', data)
        # set_session(request, 'activity_get_pricing_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'activity_get_pricing_request')
            if file:
                data = file
                write_cache_file(request, request.POST['new_signature'], 'activity_get_pricing_request', data)
            # data = request.session['activity_get_pricing_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_pricing",
                "signature": request.POST['new_signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST')
    if request.POST.get('use_cache'):
        write_cache_file(request, request.POST['new_signature'], 'activity_price', res)
    else:
        write_cache_file(request, request.POST['signature'], 'activity_price', res)
    # set_session(request, 'activity_price', res)
    # _logger.info(json.dumps(request.session['activity_price']))
    return res


def get_activity_carrier_data(request):
    try:
        file = read_cache_file(request, request.POST['signature'], 'activity_pick')
        if file:
            carrier_data = file['carrier_data']
    except Exception as e:
        carrier_data = {
            'adult_length_name': 60,
            'child_length_name': 60,
            'infant_length_name': 60
        }
        logging.error(msg=str(e) + '\n' + traceback.format_exc())

    res = carrier_data
    return res


def sell_activity(request):
    try:
        data = {
            "promotion_codes_booking": request.POST.get('promotion_codes_booking') or [],
            "product_type_uuid": request.POST['product_type_uuid'],
            "product_uuid": request.POST['product_uuid'],
            "visit_date": request.POST['visit_date'],
            "timeslot": request.POST['timeslot'],
            "event_seq": request.POST['event_seq']
        }
        write_cache_file(request, request.POST['signature'], 'activity_sell_request', data)
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_activity",
            "signature": request.POST['signature']
        }
    except Exception as e:
        if request.POST.get('use_cache'):
            file = read_cache_file(request, request.POST['signature'], 'activity_sell_request')
            if file:
                data = file
                write_cache_file(request, request.POST['new_signature'], 'activity_sell_request', data)
            # data = request.session['activity_get_pricing_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_pricing",
                "signature": request.POST['new_signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res


def update_contact(request):
    file = read_cache_file(request, request.POST['signature'], 'activity_review_booking')
    if file:
        booker = file['booker']
        contacts = file['contacts']
    try:
        data = {
            "booker": booker,
            "contacts": contacts,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_contact",
            "signature": request.POST['new_signature'] if request.POST.get('use_cache') else request.POST['signature']
        }
    except Exception as e:
        logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res


def update_passengers(request):
    passenger = []
    file = read_cache_file(request, request.POST['signature'], 'activity_review_booking')
    if file:
        for pax in file['adult']:
            pax.update({
                'birth_date': '%s-%s-%s' % (pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0]),
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
            passenger.append(pax)

        for pax in file['senior']:
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
            passenger.append(pax)

        for pax in file['child']:
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
            passenger.append(pax)

        for pax in file['infant']:
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
            passenger.append(pax)
    try:
        data = {
            "passengers": passenger,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_passengers",
            "signature": request.POST['new_signature'] if request.POST.get('use_cache') else request.POST['signature']
        }
    except Exception as e:
        logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res


def get_review_booking_data(request):
    file = read_cache_file(request, request.POST['signature'], 'activity_review_booking')
    return file

def update_options(request):
    response = get_cache_data(request)

    countries = response['result']['response']['airline']['country']
    file = read_cache_file(request, request.POST['signature'], 'activity_perbooking')
    if file:
        # perbooking = request.session['activity_perbooking']
        perbooking = file
        for booking in perbooking:
            if booking['name'] == 'Nationality':
                for country in countries:
                    if country['code'] == booking.value:
                        booking.update({
                            'value': country['name']
                        })
                        break
            if booking.get('name'):
                booking.pop('name')
    else:
        perbooking = []

    file = read_cache_file(request, request.POST['signature'], 'activity_perpax')
    if file:
        perpax = file
        # perpax = request.session['activity_perpax']
        for pax in perpax:
            for item in pax:
                if item['name'] == 'Nationality':
                    for country in countries:
                        if country['code'] == item['value']:
                            item.update({
                                'value': country['name']
                            })
                            break
                if item.get('name'):
                    item.pop('name')
    else:
        perpax = []
    file = read_cache_file(request, request.POST['signature'], 'upload_value')
    if file:
        upload_val = file['upload_value']
        # upload_val = request.session['activity_review_booking']['upload_value']
        for upl in upload_val:
            if upl.get('name'):
                upl.pop('name')
    else:
        upload_val = []
    try:
        data = {
            "option": {
                "perBooking": perbooking,
                "perPax": perpax
            },
            "upload_value": upload_val,
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_options",
            "signature": request.POST['new_signature'] if request.POST.get('use_cache') else request.POST['signature']
        }
    except Exception as e:
        logging.error(msg=str(e) + '\n' + traceback.format_exc())


    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res

def commit_booking(request):
    force_issued = request.POST.get('value') and request.POST['value'] or 0
    data = {
        "kwargs": {
            "force_issued": int(force_issued) == 1 and True or False
        },
    }
    try:
        if int(force_issued) == 1:
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

            try:
                if request.POST['use_point'] == 'false':
                    data['use_point'] = False
                else:
                    data['use_point'] = True
            except:
                _logger.error('use_point not found')

            if request.POST['voucher_code'] != '':
                file = read_cache_file(request, request.POST['signature'], 'activity_pick')
                if file:
                    data.update({
                        'voucher': data_voucher(request.POST['voucher_code'], 'activity', [file['provider_code']]),
                    })
            if request.POST.get('payment_reference'):
                data.update({
                    'payment_reference': request.POST['payment_reference']
                })
            if request.FILES.get('pay_ref_file'):
                temp_file = []
                for rec_file in request.FILES.getlist('pay_ref_file'):
                    temp_file.append({
                        'name': rec_file.name,
                        'file': base64.b64encode(rec_file.file.read()).decode('ascii'),
                    })
                data.update({
                    'payment_ref_attachment': temp_file
                })
    except Exception as e:
        _logger.error('book, not force issued')

    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_booking",
        "signature": request.POST['signature']
    }

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    if res['result']['error_code'] == 0:
        set_session(request, 'activity_order_number', res['result']['response']['order_number'])
    return res


def get_booking(request):
    data = {
        'order_number': request.POST['order_number']}
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_booking",
        "signature": request.POST['signature']
    }

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        try:
            res['result']['response']['can_issued'] = False
            if res['result']['response']['hold_date'] > datetime.now().strftime('%Y-%m-%d %H:%M:%S'):
                res['result']['response']['can_issued'] = True
        except:
            _logger.error('no hold date')
        for rec in res['result']['response']['provider_booking']:
            for rec2 in rec['activity_details']:
                if rec2.get('visit_date'):
                    rec2.update({
                        'visit_date': datetime.strptime(rec2['visit_date'], '%Y-%m-%d').strftime('%d %b %Y')
                    })
        write_cache_file(request, request.POST['signature'], 'activity_get_booking_response', res)
        # set_session(request, 'activity_get_booking_response', res)
        # _logger.info(json.dumps(request.session['activity_get_booking_response']))
        # request.session.modified = True
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def issued_booking(request):
    # nanti ganti ke get_ssr_availability
    try:
        if request.POST['member'] == 'non_member':
            member = False
        else:
            member = True
        data = {
            'order_number': request.POST['order_number'],
            'member': member,
            'acquirer_seq_id': request.POST['acquirer_seq_id'],
            'agent_payment_method': request.POST.get('agent_payment') or False, ## kalau tidak kirim default balance normal
            'voucher': {}
        }
        try:
            if request.POST['use_point'] == 'false':
                data['use_point'] = False
            else:
                data['use_point'] = True
        except:
            _logger.error('use_point not found')

        if request.POST['voucher_code'] != '':
            try:
                file = read_cache_file(request, request.POST['signature'], 'activity_get_booking_response')
                if file:
                    activity_get_booking = file
                else:
                    activity_get_booking = json.loads(request.POST['booking'])
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'activity',[activity_get_booking['result']['response']['provider']]),
                    # 'voucher': data_voucher(request.POST['voucher_code'], 'activity',['bemyguest']),
                })
            except:
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'activity',['']),
                })
        if request.POST.get('payment_reference'):
            data.update({
                'payment_reference': request.POST['payment_reference']
            })
        if request.FILES.get('pay_ref_file'):
            temp_file = []
            for rec_file in request.FILES.getlist('pay_ref_file'):
                temp_file.append({
                    'name': rec_file.name,
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

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued ACTIVITY SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued ACTIVITY SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def cancel_booking(request):
    data = {
        'order_number': request.POST['order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "cancel_order",
        "signature": request.POST['signature']
    }
    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel ACTIVITY SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel ACTIVITY SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def update_service_charge(request):
    # nanti ganti ke get_ssr_availability
    try:
        data = {
            'order_number': json.loads(request.POST['order_number']),
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

    url_request = get_url_gateway('booking/activity')
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

            write_cache_file(request, request.POST['signature'], 'activity_upsell', total_upsell_dict)
            # set_session(request, 'activity_upsell_' + request.POST['signature'], total_upsell_dict)

            # _logger.info(json.dumps(request.session['activity_upsell_' + request.POST['signature']]))
            # _logger.info("SUCCESS update_service_charge ACTIVITY SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge ACTIVITY SIGNATURE " + request.POST['signature'])
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

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            write_cache_file(request, request.POST['signature'], 'activity_upsell_booker', total_upsell)
            # set_session(request, 'activity_upsell_booker_'+request.POST['signature'], total_upsell)
            # _logger.info(json.dumps(request.session['activity_upsell_booker_' + request.POST['signature']]))
            # _logger.info("SUCCESS update_service_charge_booker Activity SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge_activity_booker Activity SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_voucher(request):
    data = {
        'order_number': request.POST['order_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_vouchers",
        "signature": request.POST['signature']
    }

    url_request = get_url_gateway('booking/activity')
    res = send_request_api(request, url_request, headers, data, 'POST')
    return res


def get_auto_complete(request):
    def find_activity_ilike(search_str, record_cache, limit=10):
        activity_list = []
        for rec in record_cache:
            if len(activity_list) == limit:
                return activity_list
            is_true = True
            name = rec['name'].lower()
            for list_str in search_str.split(' '):
                if list_str not in name:
                    is_true = False
                    break
            if is_true:
                activity_list.append(rec)
        return activity_list

    limit = 25
    req = request.POST
    record_json = []
    try:
        file = read_cache("activity_cache_data", 'cache_web', request, 86400)
        if file:
            record_cache = file
        else:
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search_autocomplete",
                "signature": request.POST['signature']
            }

            data = {
                "name": '',
                "limit": 9999
            }
            url_request = get_url_gateway('booking/activity')
            res_cache_activity = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res_cache_activity['result']['error_code'] == 0:
                    write_cache(res_cache_activity['result']['response'], "activity_cache_data", request, 'cache_web')
                    record_cache = res_cache_activity['result']['response']
            except Exception as e:
                _logger.error("ERROR GET CACHE FROM ACTIVITY SEARCH AUTOCOMPLETE " + json.dumps(res_cache_activity) + '\n' + str(e) + '\n' + traceback.format_exc())
                _logger.info('use old cache')
                file = read_cache("activity_cache_data", 'cache_web', request, 90911)
                if file:
                    record_cache = file


        # for rec in filter(lambda x: req['name'].lower() in x['name'].lower(), record_cache):
        for rec in find_activity_ilike(req['name'].lower(), record_cache, limit):
            if len(record_json) < limit:
                record_json.append(rec['name'])
            else:
                break

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_autocomplete ACTIVITY")
    except Exception as e:
        _logger.error('ERROR get activity_cache_data file\n' + str(e) + '\n' + traceback.format_exc())
    return record_json

def passenger_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['signature'], 'activity_pick')
        if file:
            res['response'] = file
            res['highlights'] = file['highlights']

        file = read_cache_file(request, request.POST['signature'], 'activity_pax_data')
        if file:
            res['activity_pax_data'] = file
            res['pax_count'] = file['pax_count']
        file = read_cache_file(request, request.POST['signature'], 'activity_request')
        if file:
            res['price'] = file['activity_date_data']
            activity_type_pick_file = read_cache_file(request, request.POST['signature'], 'activity_type_pick')
            if activity_type_pick_file:
                res['detail'] = file['activity_types_data'][int(activity_type_pick_file)]['options']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def review_page(request):
    res = {}
    try:
        file = read_cache_file(request, request.POST['signature'], 'activity_pax_data')
        if file:
            res['pax_count'] = file['pax_count']
        # res['pax_count'] = request.session['activity_pax_data']['pax_count']

        file = read_cache_file(request, request.POST['signature'], 'printout_paxs')
        if file:
            res['printout_paxs'] = file
        # res['printout_paxs'] = request.session['printout_paxs' + request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'printout_prices')
        if file:
            res['printout_prices'] = file
        # res['printout_prices'] = request.session['printout_prices' + request.POST['signature']]

        file = read_cache_file(request, request.POST['signature'], 'activity_price')
        if file:
            res['price'] = file['result']['response']
        # res['price'] = request.session['activity_price']['result']['response']

        file = read_cache_file(request, request.POST['signature'], 'activity_request')
        if file:
            res['options'] = file['activity_types_data'][int(file['activity_type_pick'])]['options']
        # res['options'] = request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['options']

        file = read_cache_file(request, request.POST['signature'], 'activity_review_booking')
        if file:
            res['booker'] = file['booker']
            res['contact_person'] = file['contacts']
            res['all_pax'] = file['all_pax']
        # res['booker'] = request.session['activity_review_booking']['booker']
        # res['contact_person'] = request.session['activity_review_booking']['contacts']
        # res['all_pax'] = request.session['activity_review_booking']['all_pax']

        file = read_cache_file(request, request.POST['signature'], 'activity_upsell')
        if file:
            res['upsell_price_dict'] = file
        else:
            res['upsell_price_dict'] = {}
        # res['upsell_price_dict'] = request.session.get('activity_upsell_%s' % request.POST['signature']) and request.session.get('activity_upsell_%s' % request.POST['signature']) or {}

        file = read_cache_file(request, request.POST['signature'], 'activity_pick')
        if file:
            res['response'] = file
            res['highlights'] = file['highlights']
        # res['response'] = request.session['activity_pick']
        # res['highlights'] = request.session['activity_pick']['highlights']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res
