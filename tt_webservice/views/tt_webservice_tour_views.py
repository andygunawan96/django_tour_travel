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
            res = login(request)
        elif req_data['action'] == 'get_auto_complete_sync':
            res = get_auto_complete_gateway(request)
        elif req_data['action'] == 'get_carriers':
            res = get_carriers(request)
        elif req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'search':
            res = search(request)
        elif req_data['action'] == 'get_details':
            res = get_details(request)
        elif req_data['action'] == 'get_pricing':
            res = get_pricing(request)
        elif req_data['action'] == 'get_pricing_cache':
            res = get_pricing_cache(request)
        elif req_data['action'] == 'sell_tour':
            res = sell_tour(request)
        elif req_data['action'] == 'update_contact':
            res = update_contact(request)
        elif req_data['action'] == 'update_passengers':
            res = update_passengers(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'commit_booking':
            res = commit_booking(request)
        elif req_data['action'] == 'issued_booking':
            res = issued_booking(request)
        elif req_data['action'] == 'update_service_charge':
            res = update_service_charge(request)
        elif req_data['action'] == 'get_payment_rules':
            res = get_payment_rules(request)
        elif req_data['action'] == 'get_auto_complete':
            res = get_auto_complete(request)
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
    res = util.send_request(url=url + 'session', data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            set_session(request, 'tour_signature', res['result']['response']['signature'])
            set_session(request, 'signature', res['result']['response']['signature'])
            _logger.info(json.dumps(request.session['tour_signature']))
            _logger.info(
                "SIGNIN TOUR SUCCESS SIGNATURE " + res['result']['response']['signature'])
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
            "provider_type": 'tour'
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    file = read_cache_with_folder_path("get_tour_carriers")
    if not file:
        res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')
        try:
            if res['result']['error_code'] == 0:
                res = res['result']['response']
                write_cache_with_folder(res, "get_tour_carriers")
                _logger.info("get_carriers HOTEL RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            else:
                try:
                    file = read_cache_with_folder_path("get_tour_carriers", 90911)
                    if file:
                        res = file
                    _logger.info("get_carriers TOUR ERROR USE CACHE SIGNATURE " + request.POST['signature'])
                except Exception as e:
                    _logger.error('ERROR get_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    else:
        try:
            file = read_cache_with_folder_path("get_tour_carriers", 90911)
            res = file
        except Exception as e:
            _logger.error('ERROR get_tour_carriers file\n' + str(e) + '\n' + traceback.format_exc())

    return res

def get_auto_complete_gateway(request):
    try:
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
        file = read_cache_with_folder_path("tour_cache_data", 1800)
        if not file:
            res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=120)
            try:
                if res['result']['error_code'] == 0:
                    #datetime
                    write_cache_with_folder(res['result']['response'], "tour_cache_data")
                    res = {
                        'result': {
                            'error_code': 0,
                            'error_msg': 'update cache tour'
                        }
                    }
            except Exception as e:
                _logger.info(
                    "ERROR GET CACHE FROM TOUR SEARCH AUTOCOMPLETE" + json.dumps(res) + '\n' + str(
                        e) + '\n' + traceback.format_exc())
                res = {
                    'result': {
                        'error_code': 0,
                        'error_msg': 'using old cache'
                    }
                }
        else:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': 'using old cache tour'
                }
            }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def get_data(request):
    try:
        cache_version = get_cache_version()
        temp_data = get_cache_data(cache_version)

        response = {
            'tour_countries': temp_data['result']['response']['tour']['countries']
        }

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_data TOUR SIGNATURE " + request.POST['signature'])
    except Exception as e:
        response = {
            'tour_countries': [],
        }

        _logger.error(str(e) + '\n' + traceback.format_exc())

    return response


def search(request):
    try:
        request.session['tour_request'] = json.loads(request.POST['search_request'])
        set_session(request, 'tour_request', json.loads(request.POST['search_request']))
        data = {
            'country_id': request.session['tour_request']['country_id'],
            'city_id': request.session['tour_request']['city_id'],
            'month': request.session['tour_request']['month'],
            'year': request.session['tour_request']['year'],
            'tour_query': request.session['tour_request']['tour_query'].replace('&amp;', '&'),
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "search",
            "signature": request.session['signature']
        }
        set_session(request, 'tour_search_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['tour_search_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    try:
        data_tour = []
        counter = 0
        try:
            if int(request.POST['offset']) != 0:
                for data in request.session['tour_search']:
                    data_tour.append(data)
                    counter += 1
        except:
            print('tour no data')

        for i in res['result']['response']['result']:
            i.update({
                'sequence': counter
            })
            for j in i['tour_lines']:
                j.update({
                    'departure_date_f': j.get('departure_date') and datetime.strptime(str(j['departure_date']),'%Y-%m-%d').strftime("%A, %d-%m-%Y") or '',
                    'arrival_date_f': j.get('arrival_date') and datetime.strptime(str(j['arrival_date']), '%Y-%m-%d').strftime("%A, %d-%m-%Y") or '',
                    'departure_date_str': j.get('departure_date') and datetime.strptime(str(j['departure_date']),'%Y-%m-%d').strftime('%d %b %Y') or '',
                    'arrival_date_str': j.get('arrival_date') and datetime.strptime(str(j['arrival_date']), '%Y-%m-%d').strftime('%d %b %Y') or '',
                })
            data_tour.append(i)
            counter += 1

        set_session(request, 'tour_search', data_tour)
        _logger.info(json.dumps(request.session['tour_search']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

    return res


def get_details(request):
    try:
        data = {
            'tour_code': request.POST['tour_code'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_details",
            "signature": request.session['tour_signature']
        }
        set_session(request, 'tour_details_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['tour_details_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_details",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    try:
        for rec in res['result']['response']['selected_tour']['tour_lines']:
            rec.update({
                'departure_date_str': '%s %s %s' % (rec['departure_date'].split('-')[2],month[rec['departure_date'].split('-')[1]], rec['departure_date'].split('-')[0]),
                'arrival_date_str': '%s %s %s' % (rec['arrival_date'].split('-')[2],month[rec['arrival_date'].split('-')[1]], rec['arrival_date'].split('-')[0]),
                'departure_date_f': convert_string_to_date_to_string_front_end_with_date(rec['departure_date']),
                'arrival_date_f': convert_string_to_date_to_string_front_end_with_date(rec['arrival_date'])
            })
        set_session(request, 'tour_pick', res['result']['response']['selected_tour'])
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_pricing(request):
    try:
        data = {
            'provider': request.POST.get('provider', ''),
            'tour_code': request.POST['tour_code'],
            'room_list': json.loads(request.POST['room_list'])
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_pricing",
            "signature": request.session['tour_signature']
        }
        set_session(request, 'tour_get_pricing_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['tour_get_pricing_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_pricing",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST')
    try:
        res['result']['response'].update({
            'tour_info': {
                'name': request.session['tour_pick']['name'],
                'tour_lines': request.session['tour_pick']['tour_lines']
            }
        })
        set_session(request, 'tour_price', res)
        _logger.info(json.dumps(request.session['tour_price']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_pricing_cache(request):
    try:
        res = request.session['tour_price']
    except Exception as e:
        res = {}
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def sell_tour(request):
    try:
        room_list = request.session['tour_booking_data']['room_list']
        final_room_list = []
        for room in room_list:
            final_room_list.append({
                'room_code': room['room_code'],
                'notes': room['notes'],
                'room_seq': room['room_seq'],
            })

        data = {
            "promotion_codes_booking": [],
            "tour_code": request.session['tour_pick']['tour_code'],
            "tour_line_code": request.session['tour_line_code'],
            'room_list': final_room_list,
            "adult": request.session['tour_booking_data']['adult'],
            "child": request.session['tour_booking_data']['child'],
            "infant": request.session['tour_booking_data']['infant'],
            'provider': request.session['tour_pick']['provider'],
        }
        if request.session['tour_pick']['tour_type'] == 'open':
            data.update({
                'departure_date': request.session['tour_dept_return_data'].get('departure') and request.session['tour_dept_return_data']['departure'] or '',
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "sell_tour",
            "signature": request.POST['signature']
        }
        set_session(request, 'tour_sell_tour_request', data)
    except Exception as e:
        if request.POST.get('use_cache'):
            data = request.session['tour_sell_tour_request']
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "sell_tour",
                "signature": request.POST['signature']
            }
            logging.info(msg='use cache login change b2c to login')
        else:
            logging.error(msg=str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    return res


def update_contact(request):
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)

    booker = request.session['tour_booking_data']['booker']
    contacts = request.session['tour_booking_data']['contact']
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

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    return res


def update_passengers(request):
    passenger = []
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)
    room_choices = json.loads(request.POST['room_choice'])

    for pax in request.session['tour_booking_data']['adult_pax']:
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

    for pax in request.session['tour_booking_data']['child_pax']:
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

    for pax in request.session['tour_booking_data']['infant_pax']:
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

    for rec in passenger:
        for key, val in room_choices.items():
            if int(key) == int(rec['temp_pax_id']):
                rec.update({
                    'tour_room_code': val['room_code'],
                    'tour_room_seq': val['room_seq'],
                })

    for rec in passenger:
        rec.pop('temp_pax_id')

    data = {
        "passengers": passenger,
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "update_passengers",
        "signature": request.POST['signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
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
                'payment_method': request.POST['payment_method'],
                'voucher_code': request.POST['voucher_code']
            })
            if request.POST['voucher_code'] != '':
                data.update({
                    'voucher': data_voucher(request.POST['voucher_code'], 'tour', ['rodextrip_tour']),
                })
    except:
        pass

    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "commit_booking",
        "signature": request.POST['signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    if res['result']['error_code'] == 0:
        set_session(request, 'tour_order_number', res['result']['response']['order_number'])
        _logger.info(json.dumps(request.session['tour_order_number']))

    return res


def get_booking(request):
    try:
        data = {
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

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            for pax in res['result']['response']['passengers']:
                pax.update({
                    'birth_date': '%s %s %s' % (
                        pax['birth_date'].split(' ')[0].split('-')[2],
                        month[pax['birth_date'].split(' ')[0].split('-')[1]],
                        pax['birth_date'].split(' ')[0].split('-')[0])
                })
            res['result']['response']['tour_details']['departure_date_str'] = '%s %s %s' % (
                res['result']['response']['tour_details']['departure_date'].split('-')[2],
                month[res['result']['response']['tour_details']['departure_date'].split('-')[1]],
                res['result']['response']['tour_details']['departure_date'].split('-')[0])
            res['result']['response']['tour_details']['arrival_date_str'] = '%s %s %s' % (
                res['result']['response']['tour_details']['arrival_date'].split('-')[2],
                month[res['result']['response']['tour_details']['arrival_date'].split('-')[1]],
                res['result']['response']['tour_details']['arrival_date'].split('-')[0])
            res['result']['response']['tour_details']['departure_date_f'] = convert_string_to_date_to_string_front_end_with_date(res['result']['response']['tour_details']['departure_date'])
            res['result']['response']['tour_details']['arrival_date_f'] = convert_string_to_date_to_string_front_end_with_date(res['result']['response']['tour_details']['arrival_date'])

            res['result']['response']['departure_date_str'] = '%s %s %s' % (
                res['result']['response']['departure_date'].split('-')[2],
                month[res['result']['response']['departure_date'].split('-')[1]],
                res['result']['response']['departure_date'].split('-')[0])
            res['result']['response']['arrival_date_str'] = '%s %s %s' % (
                res['result']['response']['arrival_date'].split('-')[2],
                month[res['result']['response']['arrival_date'].split('-')[1]],
                res['result']['response']['arrival_date'].split('-')[0])
            res['result']['response']['departure_date_f'] = convert_string_to_date_to_string_front_end_with_date(res['result']['response']['departure_date'])
            res['result']['response']['arrival_date_f'] = convert_string_to_date_to_string_front_end_with_date(res['result']['response']['arrival_date'])
            set_session(request, 'tour_get_booking_response', res)
            _logger.info(json.dumps(request.session['tour_get_booking_response']))
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())

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
            'acquirer_seq_id': request.POST['seq_id'],
            'voucher': {}
        }
        if request.POST['voucher_code'] != '':
            data.update({
                'voucher': data_voucher(request.POST['voucher_code'], 'tour', [request.session['tour_get_booking_response']['result']['response']['provider']]),
            })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "issued",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS issued TOUR SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR issued TOUR SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def get_payment_rules(request):
    data = {
        'provider': request.session['tour_pick']['provider'],
        'tour_code': request.POST['tour_code']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_payment_rules_provider",
        "signature": request.POST['signature']
    }

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            for payment in res['result']['response']['payment_rules']:
                payment['due_date'] = convert_string_to_date_to_string_front_end(payment['due_date'])
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

    res = util.send_request(url=url + 'booking/tour', data=data, headers=headers, method='POST', timeout=300)
    try:
        if res['result']['error_code'] == 0:
            total_upsell = 0
            for upsell in data['passengers']:
                for pricing in upsell['pricing']:
                    total_upsell += pricing['amount']
            set_session(request, 'tour_upsell_'+request.POST['signature'], total_upsell)
            _logger.info(json.dumps(request.session['tour_upsell_' + request.POST['signature']]))
            _logger.info("SUCCESS update_service_charge TOUR SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR update_service_charge TOUR SIGNATURE " + request.POST['signature'])
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_auto_complete(request):
    def find_tour_ilike(search_str, record_cache, limit=10):
        tour_list = []
        for rec in record_cache:
            if len(tour_list) == limit:
                return tour_list
            is_true = True
            name = rec['name'].lower()
            for list_str in search_str.split(' '):
                if list_str not in name:
                    is_true = False
                    break
            if is_true:
                tour_list.append(rec)
        return tour_list

    limit = 25
    req = request.POST
    record_json = []
    try:
        file = read_cache_with_folder_path("tour_cache_data", 1800)
        if file:
            record_cache = file


        # for rec in filter(lambda x: req['name'].lower() in x['name'].lower(), record_cache):
        for rec in find_tour_ilike(req['name'].lower(), record_cache, limit):
            if len(record_json) < limit:
                record_json.append(rec['name'])
            else:
                break

        # res = search2(request)
        logging.getLogger("error_info").error("SUCCESS get_autocomplete TOUR")
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return record_json


