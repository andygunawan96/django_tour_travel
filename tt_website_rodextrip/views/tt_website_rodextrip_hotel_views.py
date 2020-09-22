from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from django.utils import translation
import random
import json
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_rodextrip_views import *
from tools.parser import *
import base64
_logger = logging.getLogger("rodextrip_logger")

MODEL_NAME = 'tt_website_rodextrip'

def hotel(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
        try:
            values = get_data_template(request)
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            airline_cabin_class_list = [
                {
                    'name': 'Economy',
                    'value': 'Y',
                }, {
                    'name': 'Premium Economy',
                    'value': 'W',
                }, {
                    'name': 'Business',
                    'value': 'C',
                }, {
                    'name': 'First Class',
                    'value': 'F',
                }
            ]
            # get_data_awal
            cache = {}
            try:
                cache['hotel'] = {
                    'checkin': request.session['hotel_request']['checkin_date'],
                    'checkout': request.session['hotel_request']['checkout_date']
                }
                if cache['hotel']['checkin'] == 'Invalid date' or cache['hotel']['checkout'] == 'Invalid date':
                    cache['hotel']['checkin'] = convert_string_to_date_to_string_front_end(
                        str(datetime.now() + relativedelta(days=1))[:10])
                    cache['hotel']['checkout'] = convert_string_to_date_to_string_front_end(
                        str(datetime.now() + relativedelta(days=2))[:10])
            except:
                pass

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'cache': json.dumps(cache),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                # 'co_uid': request.session['co_uid'],
                'airline_cabin_class_list': airline_cabin_class_list,
                'javascript_version': javascript_version,
                'update_data': 'false',
                'static_path_url_server': get_url_static_path(),
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/hotel/hotel_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            try:
                child_age = []
                for i in range(int(request.POST['hotel_child'])):
                    child_age.append(int(request.POST['hotel_child_age' + str(i + 1)]))
                set_session(request, 'hotel_request', {
                    'destination': request.POST['hotel_id_destination'],
                    'guest_nationality': request.POST['hotel_id_nationality'],
                    'nationality': request.POST['hotel_id_nationality'].split(' - ')[0],
                    'business_trip': request.POST.get('business_trip'), #Checkbox klo disi baru di POST
                    'checkin_date': request.POST['hotel_checkin_checkout'].split(' - ')[0],
                    'checkout_date': request.POST['hotel_checkin_checkout'].split(' - ')[1],
                    # 'checkin_date': request.POST['hotel_checkin'],
                    # 'checkout_date': request.POST['hotel_checkout'],
                    'room': int(request.POST['hotel_room']),
                    'adult': int(request.POST['hotel_adult']),
                    'child': int(request.POST['hotel_child']),
                    'child_age': child_age
                })
            except:
                print('error')
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'countries': response['result']['response']['airline']['country'],
                # 'hotel_config': response['result']['response']['hotel_config'],
                'hotel_search': request.session['hotel_request'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': 1200,
                'signature': request.session['signature'],
                # 'cookies': json.dumps(res['result']['cookies']),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/hotel/hotel_search_templates.html', values)
    else:
        return no_session_logout(request)


def detail(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            set_session(request, 'time_limit', int(request.POST['time_limit_input']))
            try:
                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
                set_session(request, 'hotel_detail', json.loads(request.POST['hotel_detail']))
            except:
                pass
            data = request.session['hotel_request']
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'hotel_search': data,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'check_in': data['checkin_date'],
                'check_out': data['checkout_date'],
                'response': request.session['hotel_detail'],
                'username': request.session['user_account'],
                'signature': request.session['hotel_signature'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'time_limit': request.session['time_limit'],
                'rating': range(int(request.session['hotel_detail']['rating'])),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/hotel/hotel_detail_templates.html', values)
    else:
        return no_session_logout(request)


def detail_static(request):
    try:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'phone_code': phone_code,
            'countries': airline_country,
            'username': request.session['user_account'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'logo': '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png',
            'template': 1,
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/hotel/hotel_detail_static.html', values)


def passengers(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request)
            set_session(request, 'time_limit', int(request.POST['time_limit_input']))

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            # agent
            adult_title = ['MR', 'MRS', 'MS']

            infant_title = ['MSTR', 'MISS']

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            # pax
            adult = []
            child = []
            for i in range(int(request.session['hotel_request']['adult'])):
                adult.append('')
            for i in range(int(request.session['hotel_request']['child'])):
                child.append('')
            request.session['hotel_request'].update({
                'check_in': request.POST.get('checkin_date') and str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10] or request.session['hotel_request']['checkin_date'],
                'check_out': request.POST.get('checkout_date') and str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10] or request.session['hotel_request']['checkout_date'],
            })
            set_session(request, 'hotel_room_pick', json.loads(request.POST['hotel_detail_send']))
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'countries': airline_country,
                'phone_code': phone_code,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'hotel_search': request.session['hotel_request'],
                'hotel_room_detail_pick': request.session['hotel_room_pick'],
                # 'username': request.session['username'],
                'username': request.session['user_account'],
                'response': request.session['hotel_detail'],
                'childs': child,
                'adults': adult,
                'rooms': [rec + 1 for rec in range(request.session['hotel_request']['room'])],
                'adult_count': int(request.session['hotel_request']['adult']),
                'child_count': int(request.session['hotel_request']['child']),
                'adult_title': adult_title,
                'infant_title': infant_title,
                'signature': request.session['hotel_signature'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/hotel/hotel_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            spc_req = ''
            for rec in request.POST.keys():
                if 'special_request' in rec:
                    if request.POST[rec]:
                        spc_req += 'Room ' + rec[16:] + ': ' + request.POST[rec] + '; '
                    else:
                        spc_req += 'Room ' + rec[16:] + ': - ; '
            spc_req += request.POST.get('late_ci') and 'Early/Late CheckIn: ' + request.POST['late_ci'] + '; 'or ''
            spc_req += request.POST.get('late_co') and 'Late CheckOut: ' + request.POST['late_co'] + '; ' or ''

            request.session['hotel_request'].update({'special_request': spc_req})
            set_session(request, 'time_limit', int(request.POST['time_limit_input']))

            adult = []
            child = []
            contact = []
            printout_paxs = []
            booker = {
                'title': request.POST['booker_title'],
                'first_name': request.POST['booker_first_name'],
                'last_name': request.POST['booker_last_name'],
                'email': request.POST['booker_email'],
                'calling_code': request.POST['booker_phone_code'],
                'mobile': request.POST['booker_phone'],
                'nationality_name': request.POST['booker_nationality'],
                "work_phone": request.POST['booker_phone_code'] + request.POST['booker_phone'],
                'booker_seq_id': request.POST['booker_id']
            }
            for i in range(int(request.session['hotel_request']['adult'])):
                adult.append({
                    "pax_type": "ADT",
                    "first_name": request.POST['adult_first_name' + str(i + 1)],
                    "last_name": request.POST['adult_last_name' + str(i + 1)],
                    "title": request.POST['adult_title' + str(i + 1)],
                    "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                    "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                    "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                    "room_number": '1'
                })
                printout_paxs.append({
                    "name": request.POST['adult_title' + str(i + 1)] + ' ' + request.POST[
                        'adult_first_name' + str(i + 1)] + ' ' + request.POST['adult_last_name' + str(i + 1)],
                    'ticket_number': '',
                    'birth_date': request.POST['adult_birth_date' + str(i + 1)],
                    'pax_type': 'Adult',
                    'additional_info': ["Room: 1", "SpecialReq:" + request.session['hotel_request']['special_request']],
                })

                if i == 0:
                    if request.POST['myRadios'] == 'yes':
                        adult[len(adult) - 1].update({
                            'is_also_booker': True,
                            'is_also_contact': True
                        })
                    else:
                        adult[len(adult) - 1].update({
                            'is_also_booker': False
                        })
                else:
                    adult[len(adult) - 1].update({
                        'is_also_booker': False
                    })
                try:
                    if request.POST['adult_cp' + str(i + 1)] == 'on':
                        adult[len(adult) - 1].update({
                            'is_also_contact': True
                        })
                    else:
                        adult[len(adult) - 1].update({
                            'is_also_contact': False
                        })
                except:
                    if i == 0 and request.POST['myRadios'] == 'yes':
                        continue
                    else:
                        adult[len(adult) - 1].update({
                            'is_also_contact': False
                        })
                try:
                    if request.POST['adult_cp' + str(i + 1)] == 'on':
                        contact.append({
                            "first_name": request.POST['adult_first_name' + str(i + 1)],
                            "last_name": request.POST['adult_last_name' + str(i + 1)],
                            "title": request.POST['adult_title' + str(i + 1)],
                            "email": request.POST['adult_email' + str(i + 1)],
                            "calling_code": request.POST['adult_phone_code' + str(i + 1)],
                            "mobile": request.POST['adult_phone' + str(i + 1)],
                            "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                            "work_phone": request.POST['booker_phone_code'] + request.POST['booker_phone'],
                            "address": request.session.get('company_details') and request.session['company_details']['address'] or '',
                            "contact_seq_id": request.POST['adult_id' + str(i + 1)]
                        })
                    if i == 0:
                        if request.POST['myRadios'] == 'yes':
                            contact[len(contact)].update({
                                'is_also_booker': True
                            })
                        else:
                            contact[len(contact)].update({
                                'is_also_booker': False
                            })
                except:
                    pass

            if len(contact) == 0:
                contact.append({
                    'title': request.POST['booker_title'],
                    'first_name': request.POST['booker_first_name'],
                    'last_name': request.POST['booker_last_name'],
                    'email': request.POST['booker_email'],
                    'calling_code': request.POST['booker_phone_code'],
                    'mobile': request.POST['booker_phone'],
                    'nationality_name': request.POST['booker_nationality'],
                    'contact_seq_id': request.POST['booker_id'],
                    "work_phone": request.POST['booker_phone_code'] + request.POST['booker_phone'],
                    "address": request.session.get('company_details') and request.session['company_details']['address'] or '',
                    'is_also_booker': True
                })

            for i in range(int(request.session['hotel_request']['child'])):
                child.append({
                    "pax_type": "CHD",
                    "first_name": request.POST['child_first_name' + str(i + 1)],
                    "last_name": request.POST['child_last_name' + str(i + 1)],
                    "title": request.POST['child_title' + str(i + 1)],
                    "birth_date": request.POST['child_birth_date' + str(i + 1)],
                    "nationality_name": request.POST['child_nationality' + str(i + 1)],
                    "passenger_seq_id": request.POST['child_id' + str(i + 1)],
                    "room_number": '1'
                })
                printout_paxs.append({
                    "name": request.POST['child_title' + str(i + 1)] + ' ' + request.POST[
                        'child_first_name' + str(i + 1)] + ' ' + request.POST['child_last_name' + str(i + 1)],
                    'ticket_number': '',
                    'birth_date': request.POST['child_birth_date' + str(i + 1)],
                    'pax_type': 'Child',
                    'additional_info': ["Room: 1", "SpecialReq:" + request.session['hotel_request']['special_request']],
                })

            set_session(request, 'hotel_review_pax', {
                'booker': booker,
                'contact': contact,
                'adult': adult,
                'child': child,
            })

            print_json = json.dumps({
                "type": "hotel",
                "agent_name": request.session._session['user_account']['co_agent_name'],
                "passenger": printout_paxs,
                "price_detail":[{
                    "fare": rec['price_total'],
                    "name": rec['category'] + ' ' + rec['description'],
                    "qty": 1,
                    "total": rec['price_total'],
                    "pax_type": "Adult: " + str(rec['pax']['adult']) + " Child: " + str(len(rec['pax'].get('child_ages',0))),
                    "tax": 0
                } for rec in request.session['hotel_room_pick']['rooms'] ],
                "line": [
                   {
                       "resv": "-",
                       "checkin": request.session['hotel_request']['checkin_date'],
                       "checkout": request.session['hotel_request']['checkout_date'],
                       "meal_type": request.session['hotel_room_pick']['meal_type'],
                       "room_name": rec['category'] + ' ' + rec['description'],
                       "hotel_name": request.session['hotel_detail']['name'],
                   }
               for rec in request.session['hotel_room_pick']['rooms']],
            })
            set_session(request, 'hotel_json_printout' + request.session['hotel_signature'], print_json)
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'booker': booker,
                'adults': adult,
                'childs': child,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'upsell': request.session.get('hotel_upsell_'+request.session['hotel_signature']) and request.session.get('hotel_upsell_'+request.session['hotel_signature']) or 0,
                'hotel_search': request.session['hotel_request'],
                'hotel_pick': request.session['hotel_detail'],
                'hotel_room_detail_pick': request.session['hotel_room_pick'],
                'adult_count': int(request.session['hotel_request']['adult']),
                'infant_count': int(request.session['hotel_request']['child']),
                'special_request': request.session['hotel_request']['special_request'],
                'username': request.session['user_account'],
                'signature': request.session['hotel_signature'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],
                'printout_rec': print_json,
                'hotel_cancellation_policy': request.session['hotel_cancellation_policy']['result']['response']['policies'],
                # 'cookies': json.dumps(res['result']['cookies']),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/hotel/hotel_review_templates.html', values)
    else:
        return index(request)


def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            set_session(request, 'hotel_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'hotel_order_number', order_number)
        if 'user_account' not in request.session:
            signin_btc(request)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': request.session['hotel_order_number'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME + '/hotel/hotel_booking_templates.html', values)
