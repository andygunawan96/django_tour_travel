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
from .tt_webservice_views import *
from .tt_webservice import *
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
        if req_data['action'] == 'login':
            res = login(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_details':
            res = get_details(request)
        elif req_data['action'] == 'get_pricing':
            res = get_pricing(request)
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
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            create_session_product(request, 'activity', 20)
            set_session(request, 'activity_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            if request.session['user_account'].get('co_customer_parent_seq_id'):
                webservice_agent.activate_corporate_mode(request, res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['activity_signature']))
            _logger.info("SIGNIN ACTIVITY SUCCESS SIGNATURE " + res['result']['response']['signature'])
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
    file = read_cache_with_folder_path("get_activity_carriers")
    if not file:
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_activity_carriers")
                _logger.info("get_carriers AIRLINE RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_activity_carriers")
                    if file:
                        res = file
                    _logger.info("get_carriers AIRLINE ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_activity_carriers", 90911)
            if file:
                res = file
        except Exception as e:
            _logger.error('ERROR get_airline_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        cache_version = get_cache_version()
        temp_data = get_cache_data(cache_version)

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
        set_session(request, 'activity_search_request', json.loads(request.POST['search_request']))
        data = {
            'query': request.session['activity_search_request']['query'].replace('&amp;', '&'),
            'country': request.session['activity_search_request']['country'],
            'city': request.session['activity_search_request']['city'],
            'type': request.session['activity_search_request']['type'],
            'category': request.session['activity_search_request']['category'],
            'sub_category': request.session['activity_search_request']['sub_category'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.POST['signature']
        }
        set_session(request, 'activity_search_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['activity_search_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 120)
    try:
        counter = 0
        for i in res['result']['response']:
            i.update({
                'sequence': counter
            })
            counter += 1
        set_session(request, 'activity_search', res['result']['response'])
        _logger.info(json.dumps(request.session['activity_search']))
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
        set_session(request, 'activity_detail_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['activity_detail_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_details",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'booking/activity'
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
            set_session(request, 'activity_pick', res['result']['response'])
            _logger.info(json.dumps(request.session['activity_pick']))
            request.session.modified = True
    except:
        print('activity error')
    return res


def get_pricing(request):
    try:
        pricing_days = int(request.POST['pricing_days'])
        startingDate = request.POST['startingDate']
        data = {
            'product_type_uuid': request.POST['product_type_uuid'],
            'date_start': to_date_now(datetime.strptime(startingDate, '%d %b %Y').strftime('%Y-%m-%d %H:%M:%S'))[:10],
            'date_end': to_date_now((datetime.strptime(startingDate, '%d %b %Y')+timedelta(days=pricing_days)).strftime('%Y-%m-%d %H:%M:%S'))[:10],
            'sku_data': json.loads(request.POST['sku_data']),
            "provider": request.session['activity_pick']['provider_code']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_pricing",
            "signature": request.POST['signature']
        }
        set_session(request, 'activity_get_pricing_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['activity_get_pricing_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_pricing",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST')
    set_session(request, 'activity_price', res)
    _logger.info(json.dumps(request.session['activity_price']))
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
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_activity",
            "signature": request.POST['signature']
        }
    except Exception as e:
        logging.error(msg=str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res


def update_contact(request):
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)

    booker = request.session['activity_review_booking']['booker']
    contacts = request.session['activity_review_booking']['contacts']
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
        "booker": booker,
        "contacts": contacts,
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_contact",
        "signature": request.POST['signature']
    }

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res


def update_passengers(request):
    passenger = []
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)

    countries = response['result']['response']['airline']['country']
    passenger = []
    for pax in request.session['activity_review_booking']['adult']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]], pax['birth_date'].split(' ')[0]),
        })
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        if pax['identity_country_of_issued_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['identity_country_of_issued_code'] = country['code']
                    break
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
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['senior']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0]),
        })
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        if pax['identity_country_of_issued_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['identity_country_of_issued_code'] = country['code']
                    break
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
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['child']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0]),
        })
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        if pax['identity_country_of_issued_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['identity_country_of_issued_code'] = country['code']
                    break
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
        passenger.append(pax)

    for pax in request.session['activity_review_booking']['infant']:
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0]),
        })
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break

        if pax['identity_country_of_issued_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['identity_country_of_issued_code'] = country['code']
                    break
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
        passenger.append(pax)

    data = {
        "passengers": passenger,
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_passengers",
        "signature": request.POST['signature']
    }

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    return res


def get_review_booking_data(request):
    return request.session['activity_review_booking']

def update_options(request):
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)

    countries = response['result']['response']['airline']['country']

    perbooking = request.session['activity_perbooking']
    for booking in perbooking:
        if booking['name'] == 'Nationality':
            for country in countries:
                if country['code'] == booking.value:
                    booking.update({
                        'value': country['name']
                    })
                    break
        booking.pop('name')

    perpax = request.session['activity_perpax']
    for pax in perpax:
        for item in pax:
            if item['name'] == 'Nationality':
                for country in countries:
                    if country['code'] == item['value']:
                        item.update({
                            'value': country['name']
                        })
                        break
            item.pop('name')

    upload_val = request.session['activity_review_booking']['upload_value']
    for upl in upload_val:
        upl.pop('name')

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
        "signature": request.POST['signature']
    }

    url_request = url + 'booking/activity'
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
                'seq_id': request.POST['seq_id'],
                'voucher': {}
            })

            if request.POST['voucher_code'] != '':
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'activity', [request.session['activity_pick']['provider']]),
                })
    except:
        pass

    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_booking",
        "signature": request.POST['signature']
    }

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    if res['result']['error_code'] == 0:
        set_session(request, 'activity_order_number', res['result']['response']['order_number'])
        _logger.info(json.dumps(request.session['activity_order_number']))
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

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        for rec in res['result']['response']['provider_booking']:
            for rec2 in rec['activity_details']:
                if rec2.get('visit_date'):
                    rec2.update({
                        'visit_date': datetime.strptime(rec2['visit_date'], '%Y-%m-%d').strftime('%d %b %Y')
                    })
        set_session(request, 'activity_get_booking_response', res)
        _logger.info(json.dumps(request.session['activity_get_booking_response']))
        request.session.modified = True
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
            'acquirer_seq_id': request.POST['seq_id'],
            'voucher': {}
        }
        if request.POST['voucher_code'] != '':
            try:
                activity_get_booking = request.session['activity_get_booking_response'] if request.session.get('activity_get_booking_response') else json.loads(request.POST['booking'])
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'activity',[activity_get_booking['result']['response']['provider']]),
                    # 'voucher': data_voucher(request.POST['voucher_code'], 'activity',['bemyguest']),
                })
            except:
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'activity',['']),
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued ACTIVITY SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued ACTIVITY SIGNATURE " + request.POST['signature'])
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

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'activity_upsell_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['activity_upsell_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge ACTIVITY SIGNATURE " + request.POST['signature'])
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

    url_request = url + 'booking/activity'
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'activity_upsell_booker_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['activity_upsell_booker_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge_booker Activity SIGNATURE " + request.POST['signature'])
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

    url_request = url + 'booking/activity'
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
        file = read_cache_with_folder_path("activity_cache_data", 86400)
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
    try:
        res = {}
        res['response'] = request.session['activity_pick']
        res['highlights'] = request.session['activity_pick']['highlights']
        res['activity_pax_data'] = request.session['activity_pax_data']
        res['pax_count'] = request.session['activity_pax_data']['pax_count']
        res['detail'] = request.session['activity_request']['activity_types_data'][request.session['activity_type_pick']]['options']
        res['price'] = request.session['activity_request']['activity_date_data']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def review_page(request):
    try:
        res = {}
        res['pax_count'] = request.session['activity_pax_data']['pax_count']
        res['printout_paxs'] = request.session['printout_paxs' + request.POST['signature']]
        res['printout_prices'] = request.session['printout_prices' + request.POST['signature']]
        res['price'] = request.session['activity_price']['result']['response']
        res['options'] = request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['options']
        res['booker'] = request.session['activity_review_booking']['booker']
        res['contact_person'] = request.session['activity_review_booking']['contacts']
        res['all_pax'] = request.session['activity_review_booking']['all_pax']

        res['response'] = request.session['activity_pick']
        res['highlights'] = request.session['activity_pick']['highlights']
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res
