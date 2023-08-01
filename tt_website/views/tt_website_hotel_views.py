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
from .tt_website_views import *
from tools.parser import *
import base64
_logger = logging.getLogger("website_logger")

MODEL_NAME = 'tt_website'

def hotel(request):
    if 'user_account' in request.session._session and 'ticketing_hotel' in request.session['user_account']['co_agent_frontend_security']:
        try:
            values = get_data_template(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
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
            
            try:
                if 'hotel_error' in request.session._session:
                    del request.session['hotel_error']
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
                'big_banner_value': check_banner('hotel', 'big_banner', request),
                'small_banner_value': check_banner('hotel', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
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
            # check_captcha(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
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
                    'guest_nationality': request.POST['hotel_id_nationality_id'],
                    'nationality': request.POST['hotel_id_nationality_id'].split(' - ')[0],
                    'business_trip': request.POST.get('business_trip') and 'T' or 'F', #Checkbox klo disi baru di POST
                    'checkin_date': request.POST['hotel_checkin_checkout'].split(' - ')[0],
                    'checkout_date': request.POST['hotel_checkin_checkout'].split(' - ')[1],
                    # 'checkin_date': request.POST['hotel_checkin'],
                    # 'checkout_date': request.POST['hotel_checkout'],
                    'room': int(request.POST['hotel_room']),
                    'adult': int(request.POST['hotel_adult']),
                    'child': int(request.POST['hotel_child']),
                    'child_ages': child_age
                })
            except:
                print('error')

            if request.POST.get('checkbox_corpor_mode_hotel') and request.POST.get('hotel_corpor_select_post') and request.POST.get('hotel_corbooker_select_post'):
                updated_request = request.POST.copy()
                updated_request.update({
                    'customer_parent_seq_id': request.POST['hotel_corpor_select_post']
                })
                cur_session = request.session['user_account']
                cur_session.update({
                    "co_customer_parent_seq_id": request.POST['hotel_corpor_select_post'],
                    "co_customer_seq_id": request.POST['hotel_corbooker_select_post']
                })
                set_session(request, 'user_account', cur_session)
                activate_corporate_mode(request, request.session['signature'])

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

def detail_with_path(request, id):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            try:
                time_limit = get_timelimit_product(request, 'hotel')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
            except:
                set_session(request, 'time_limit', int(1200))
            try:
                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
                set_session(request, 'hotel_detail', json.loads(request.POST['hotel_detail']))
            except:
                pass
            data = request.session.get('hotel_request') or {}
            if data != {}:
                need_signin = False
            else:
                need_signin = True
                try:
                    child_age = []
                    for i in range(int(request.POST['hotel_child_wizard'])):
                        child_age.append(int(request.POST['hotel_child_age_wizard' + str(i + 1)]))
                    set_session(request, 'hotel_request', {
                        'destination': '',
                        'guest_nationality': request.POST['hotel_id_nationality_wizard'],
                        'nationality': request.POST['hotel_id_nationality_wizard'].split(' - ')[0],
                        'business_trip': request.POST.get('business_trip_wizard') and 'T' or 'F',
                    # Checkbox klo disi baru di POST
                        'checkin_date': request.POST['hotel_checkin_checkout_wizard'].split(' - ')[0],
                        'checkout_date': request.POST['hotel_checkin_checkout_wizard'].split(' - ')[1],
                        # 'checkin_date': request.POST['hotel_checkin'],
                        # 'checkout_date': request.POST['hotel_checkout'],
                        'room': int(request.POST['hotel_room_wizard']),
                        'adult': int(request.POST['hotel_adult_wizard']),
                        'child': int(request.POST['hotel_child_wizard']),
                        'child_ages': child_age
                    })
                except:
                    pass
                data = request.session.get('hotel_request')
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
                'need_signin': need_signin
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/hotel/hotel_detail_templates.html', values)
    else:
        return no_session_logout(request)

def detail(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            time_limit = get_timelimit_product(request, 'hotel')
            if time_limit == 0:
                time_limit = int(request.POST['time_limit_input'])
            set_session(request, 'time_limit', time_limit)
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
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
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
            'logo': '/static/tt_website/images/logo/default/orbis_logo.png',
            'template': 1,
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/hotel/hotel_detail_static.html', values)

def passengers(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request)
            time_limit = get_timelimit_product(request, 'hotel')
            if time_limit == 0:
                time_limit = int(request.POST['time_limit_input'])
            set_session(request, 'time_limit', time_limit)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            # agent
            adult_title = ['', 'MR', 'MRS', 'MS']

            infant_title = ['', 'MSTR', 'MISS']

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            # pax
            adult = ['' for i in range(int(request.session['hotel_request']['adult']))]
            child = ['' for i in range(int(request.session['hotel_request']['child']))]
            request.session['hotel_request'].update({
                'check_in': request.POST.get('checkin_date') and str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10] or request.session['hotel_request']['checkin_date'],
                'check_out': request.POST.get('checkout_date') and str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10] or request.session['hotel_request']['checkout_date'],
            })
            set_session(request, 'hotel_room_pick', json.loads(request.POST['hotel_detail_send']))
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'countries': airline_country,
                'phone_code': phone_code,
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'hotel_search': request.session['hotel_request'],
                'hotel_room_detail_pick': request.session['hotel_room_pick'],
                # 'username': request.session['username'],
                'username': request.session['user_account'],
                'response': request.session['hotel_detail'],
                'childs': child,
                'adults': adult,
                'rooms': [rec + 1 for rec in range(request.session['hotel_request']['room'])],
                # 'room_qty': int(request.session['hotel_request']['room']) + 1, #Unremark jika ingin minim 1 kamar 1 nama pax
                'room_qty': len(request.session['hotel_room_pick']['rooms']), #Unremark jika ingin 1 nama pax saja yg required
                'adult_count': int(request.session['hotel_request']['adult']),
                'child_count': int(request.session['hotel_request']['child']),
                'adult_title': adult_title,
                'infant_title': infant_title,
                'signature': request.session['hotel_signature'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],
                'guest_nationality': request.session['hotel_request']['guest_nationality'].split(' - ')[0]
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
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            try:
                spc_req = ''
                for rec in request.POST.keys():
                    if 'special_request' in rec:
                        if request.POST[rec]:
                            spc_req += 'Room ' + rec[16:] + ': ' + request.POST[rec].replace('\n',',').replace('\r','') + ';\n'
                        else:
                            spc_req += 'Room ' + rec[16:] + ': - ;\n'
                spc_req += request.POST.get('late_ci') and 'Early/Late CheckIn: ' + request.POST['late_ci'] + '; 'or ''
                spc_req += request.POST.get('late_co') and 'Late CheckOut: ' + request.POST['late_co'] + '; ' or ''

                request.session['hotel_request'].update({'special_request': spc_req})
                time_limit = get_timelimit_product(request, 'hotel')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)

                adult = []
                child = []
                contact = []
                printout_paxs = []
                booker = {
                    'title': request.POST['booker_title'],
                    'first_name': request.POST['booker_first_name'],
                    'last_name': request.POST['booker_last_name'],
                    'email': request.POST['booker_email'],
                    'calling_code': request.POST['booker_phone_code_id'],
                    'mobile': request.POST['booker_phone'],
                    'nationality_code': request.POST['booker_nationality_id'],
                    "work_phone": request.POST['booker_phone_code_id'] + request.POST['booker_phone'],
                    'booker_seq_id': request.POST['booker_id']
                }
                for i in range(int(request.session['hotel_request']['adult'])):
                    if request.POST['adult_first_name' + str(i + 1)] == '':
                        continue
                    behaviors = {}
                    if request.POST.get('adult_behaviors_' + str(i + 1)):
                        behaviors = {'hotel': request.POST['adult_behaviors_' + str(i + 1)]}
                    adult.append({
                        "pax_type": "ADT",
                        "first_name": request.POST['adult_first_name' + str(i + 1)],
                        "last_name": request.POST['adult_last_name' + str(i + 1)],
                        "title": request.POST['adult_title' + str(i + 1)],
                        "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                        "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                        "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                        "room_number": '1',
                        "behaviors": behaviors,
                    })
                    printout_paxs.append({
                        "name": request.POST['adult_title' + str(i + 1)] + ' ' + request.POST['adult_first_name' + str(i + 1)] + ' ' + request.POST['adult_last_name' + str(i + 1)],
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
                                "calling_code": request.POST['adult_phone_code' + str(i + 1) + '_id'],
                                "mobile": request.POST['adult_phone' + str(i + 1)],
                                "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                                "work_phone": request.POST['booker_phone_code_id'] + request.POST['booker_phone'],
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
                        'calling_code': request.POST['booker_phone_code_id'],
                        'mobile': request.POST['booker_phone'],
                        'nationality_code': request.POST['booker_nationality_id'],
                        'contact_seq_id': request.POST['booker_id'],
                        "work_phone": request.POST['booker_phone_code_id'] + request.POST['booker_phone'],
                        "address": request.session.get('company_details') and request.session['company_details']['address'] or '',
                        'is_also_booker': True
                    })

                for i in range(int(request.session['hotel_request']['child'])):
                    behaviors = {}
                    if request.POST.get('child_behaviors_' + str(i + 1)):
                        behaviors = {'hotel': request.POST['child_behaviors_' + str(i + 1)]}
                    child.append({
                        "pax_type": "CHD",
                        "first_name": request.POST['child_first_name' + str(i + 1)],
                        "last_name": request.POST['child_last_name' + str(i + 1)],
                        "title": request.POST['child_title' + str(i + 1)],
                        "birth_date": request.POST['child_birth_date' + str(i + 1)],
                        "nationality_code": request.POST['child_nationality' + str(i + 1) + '_id'],
                        "passenger_seq_id": request.POST['child_id' + str(i + 1)],
                        "room_number": '1',
                        "behaviors": behaviors,
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
            except Exception as e:
                booker = request.session['hotel_review_pax']['booker']
                contact = request.session['hotel_review_pax']['contact']
                adult = request.session['hotel_review_pax']['adult']
                child = request.session['hotel_review_pax']['child']
                print_json = request.session['hotel_json_printout' + request.session['hotel_signature']]
            hotel_pick = request.session['hotel_detail']
            if hotel_pick.get('description'):
                hotel_pick.pop('description')
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'booker': booker,
                'contact': contact,
                'adults': adult,
                'childs': child,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'upsell': request.session.get('hotel_upsell_'+request.session['hotel_signature']) and request.session.get('hotel_upsell_'+request.session['hotel_signature']) or 0,
                'hotel_search': request.session['hotel_request'],
                'hotel_pick': hotel_pick,
                'hotel_room_detail_pick': request.session['hotel_room_pick'],
                'adult_count': int(request.session['hotel_request']['adult']),
                'infant_count': int(request.session['hotel_request']['child']),
                'special_request': request.session['hotel_request']['special_request'],
                'response': request.session['hotel_detail'],
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
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Airline get booking without login in btb web')
        try:
            set_session(request, 'hotel_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                set_session(request, 'hotel_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
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
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')
    return render(request, MODEL_NAME + '/hotel/hotel_booking_templates.html', values)
