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
import re
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
                file = read_cache_file(request, '', 'hotel_request')
                if file:
                    cache['hotel'] = {
                        'checkin': file['checkin_date'],
                        'checkout': file['checkout_date']
                    }

                # cache['hotel'] = {
                #     'checkin': request.session['hotel_request']['checkin_date'],
                #     'checkout': request.session['hotel_request']['checkout_date']
                # }
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

            frontend_signature = generate_signature()

            try:
                child_age = []
                for i in range(int(request.POST['hotel_child'])):
                    child_age.append(int(request.POST['hotel_child_age' + str(i + 1)]))
                data = {
                    'destination': request.POST['hotel_id_destination'],
                    'guest_nationality': request.POST['hotel_id_nationality_id'],
                    'nationality': request.POST['hotel_id_nationality_id'].split(' - ')[0],
                    'business_trip': request.POST.get('business_trip') and 'T' or 'F',  # Checkbox klo disi baru di POST
                    'checkin_date': request.POST['hotel_checkin_checkout'].split(' - ')[0],
                    'checkout_date': request.POST['hotel_checkin_checkout'].split(' - ')[1],
                    # 'checkin_date': request.POST['hotel_checkin'],
                    # 'checkout_date': request.POST['hotel_checkout'],
                    'room': int(request.POST['hotel_room']),
                    'adult': int(request.POST['hotel_adult']),
                    'child': int(request.POST['hotel_child']),
                    'child_ages': child_age
                }
                write_cache_file(request, frontend_signature, 'hotel_request', data)
                write_cache_file(request, '', 'hotel_request', data)
                # set_session(request, 'hotel_request', {
                #     'destination': request.POST['hotel_id_destination'],
                #     'guest_nationality': request.POST['hotel_id_nationality_id'],
                #     'nationality': request.POST['hotel_id_nationality_id'].split(' - ')[0],
                #     'business_trip': request.POST.get('business_trip') and 'T' or 'F', #Checkbox klo disi baru di POST
                #     'checkin_date': request.POST['hotel_checkin_checkout'].split(' - ')[0],
                #     'checkout_date': request.POST['hotel_checkin_checkout'].split(' - ')[1],
                #     # 'checkin_date': request.POST['hotel_checkin'],
                #     # 'checkout_date': request.POST['hotel_checkout'],
                #     'room': int(request.POST['hotel_room']),
                #     'adult': int(request.POST['hotel_adult']),
                #     'child': int(request.POST['hotel_child']),
                #     'child_ages': child_age
                # })
            except Exception as e:
                _logger.error('Data POST for hotel_request not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

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

            file = read_cache_file(request, frontend_signature, 'hotel_request')
            if file:
                hotel_request = file
            if not file:
                file = read_cache_file(request, '', 'hotel_request')
                if file:
                    hotel_request = file



            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'countries': response['result']['response']['airline']['country'],
                # 'hotel_config': response['result']['response']['hotel_config'],
                'hotel_search': hotel_request,
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

def detail_with_path(request, id, signature):
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
                time_limit = get_timelimit_product(request, 'hotel', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
            try:
                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

                write_cache_file(request, signature, 'hotel_detail', json.loads(request.POST['hotel_detail']))
                # set_session(request, 'hotel_detail', json.loads(request.POST['hotel_detail']))
            except Exception as e:
                _logger.error('Data POST for hotel_detail not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'hotel_request')
            if file:
                data = file
                need_signin = False
            else:
                need_signin = True
                try:
                    child_age = []
                    for i in range(int(request.POST['hotel_child_wizard'])):
                        child_age.append(int(request.POST['hotel_child_age_wizard' + str(i + 1)]))
                    data = {
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
                    }
                    write_cache_file(request, signature, 'hotel_request', data)
                    # set_session(request, 'hotel_request', {
                    #     'destination': '',
                    #     'guest_nationality': request.POST['hotel_id_nationality_wizard'],
                    #     'nationality': request.POST['hotel_id_nationality_wizard'].split(' - ')[0],
                    #     'business_trip': request.POST.get('business_trip_wizard') and 'T' or 'F',
                    # # Checkbox klo disi baru di POST
                    #     'checkin_date': request.POST['hotel_checkin_checkout_wizard'].split(' - ')[0],
                    #     'checkout_date': request.POST['hotel_checkin_checkout_wizard'].split(' - ')[1],
                    #     # 'checkin_date': request.POST['hotel_checkin'],
                    #     # 'checkout_date': request.POST['hotel_checkout'],
                    #     'room': int(request.POST['hotel_room_wizard']),
                    #     'adult': int(request.POST['hotel_adult_wizard']),
                    #     'child': int(request.POST['hotel_child_wizard']),
                    #     'child_ages': child_age
                    # })
                except Exception as e:
                    _logger.error('Data POST for hotel_request not found use cache')
                    _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                # data = request.session.get('hotel_request')

            file = read_cache_file(request, signature, 'hotel_request')
            if file:
                hotel_request = file
                if hotel_request.get('checkin_date'):
                    hotel_request['checkin_date'] = convert_string_to_date_to_string_front_end(hotel_request['checkin_date'])
                if hotel_request.get('checkout_date'):
                    hotel_request['checkout_date'] = convert_string_to_date_to_string_front_end(hotel_request['checkout_date'])

            file = read_cache_file(request, signature, 'hotel_detail')
            if file:
                hotel_detail = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file


            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'hotel_search': hotel_request,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'check_in': hotel_request['checkin_date'],
                'check_out': hotel_request['checkout_date'],
                'response': hotel_detail,
                'username': request.session['user_account'],
                'signature': signature,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'time_limit': time_limit,
                'rating': range(int(hotel_detail['rating'])),
                'need_signin': need_signin
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/hotel/hotel_detail_templates.html', values)
    else:
        return no_session_logout(request)

def detail(request, signature):
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
                time_limit = get_timelimit_product(request, 'hotel', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            try:
                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
                set_session(request, 'hotel_detail', json.loads(request.POST['hotel_detail']))
            except Exception as e:
                _logger.error('Data POST for hotel_detail not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'hotel_request')
            if file:
                data = file
                if data.get('checkin_date'):
                    data['checkin_date'] = convert_string_to_date_to_string_front_end(data['checkin_date'])
                if data.get('checkout_date'):
                    data['checkout_date'] = convert_string_to_date_to_string_front_end(data['checkout_date'])

            file = read_cache_file(request, signature, 'hotel_detail')
            if file:
                hotel_detail = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file



            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'hotel_search': data,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'check_in': data['checkin_date'],
                'check_out': data['checkout_date'],
                'response': hotel_detail,
                'username': request.session['user_account'],
                'signature': signature,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'time_limit': time_limit,
                'rating': range(int(hotel_detail['rating'])),
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

def passengers(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request)

            try:
                time_limit = get_timelimit_product(request, 'hotel', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

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

            file = read_cache_file(request, signature, 'hotel_request')
            if file:
                # pax
                adult = ['' for i in range(int(file['adult']))]
                child = ['' for i in range(int(file['child']))]
                try:
                    file.update({
                        'check_in': request.POST.get('checkin_date') and str(datetime.strptime(request.POST['checkin_date'], '%d %b %Y'))[:10] or request.session['hotel_request']['checkin_date'],
                        'check_out': request.POST.get('checkout_date') and str(datetime.strptime(request.POST['checkout_date'], '%d %b %Y'))[:10] or request.session['hotel_request']['checkout_date'],
                    })
                    write_cache_file(request, request.POST['signature'], 'hotel_request', file)
                except Exception as e:
                    _logger.error('Data POST for hotel_request checkin and checkout, hotel_room_pick not found use cache')
                    _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            hotel_room_pick = json.loads(request.POST['hotel_detail_send'])
            write_cache_file(request, signature, 'hotel_room_pick', hotel_room_pick)
            # set_session(request, 'hotel_room_pick', json.loads(request.POST['hotel_detail_send']))

            file = read_cache_file(request, signature, 'hotel_request')
            if file:
                hotel_request = file

            file = read_cache_file(request, signature, 'hotel_detail')
            if file:
                hotel_detail = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'countries': airline_country,
                'phone_code': phone_code,
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'hotel_search': hotel_request,
                'hotel_room_detail_pick': hotel_room_pick,
                # 'username': request.session['username'],
                'username': request.session['user_account'],
                'response': hotel_detail,
                'childs': child,
                'adults': adult,
                'rooms': [rec + 1 for rec in range(hotel_request['room'])],
                # 'room_qty': int(request.session['hotel_request']['room']) + 1, #Unremark jika ingin minim 1 kamar 1 nama pax
                'room_qty': len(hotel_room_pick['rooms']), #Unremark jika ingin 1 nama pax saja yg required
                'adult_count': int(hotel_request['adult']),
                'child_count': int(hotel_request['child']),
                'adult_title': adult_title,
                'infant_title': infant_title,
                'signature': signature,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': time_limit,
                'guest_nationality': hotel_request['guest_nationality'].split(' - ')[0]
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/hotel/hotel_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request, signature):
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

                file = read_cache_file(request, signature, 'hotel_request')
                if file:
                    hotel_request = file
                    hotel_request.update({'special_request': spc_req})
                    write_cache_file(request, signature, 'hotel_request', hotel_request)
                try:
                    time_limit = get_timelimit_product(request, 'hotel', signature)
                    if time_limit == 0:
                        time_limit = int(request.POST['time_limit_input'])
                    write_cache_file(request, signature, 'time_limit', time_limit)
                    # set_session(request, 'time_limit_%s' % signature, time_limit)
                except:
                    time_limit = int(request.POST['time_limit_input'])
                    write_cache_file(request, signature, 'time_limit', time_limit)

                adult = []
                child = []
                contact = []
                printout_paxs = []

                first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                last_name = re.sub(r'\s', ' ', request.POST['booker_last_name']).replace(':', '').strip()
                email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                booker = {
                    'title': request.POST['booker_title'],
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'calling_code': request.POST['booker_phone_code_id'],
                    'mobile': mobile,
                    'nationality_code': request.POST['booker_nationality_id'],
                    "work_phone": request.POST['booker_phone_code_id'] + mobile,
                    'booker_seq_id': request.POST['booker_id']
                }
                for i in range(int(hotel_request['adult'])):
                    if request.POST['adult_first_name' + str(i + 1)] == '':
                        continue
                    behaviors = {}
                    if request.POST.get('adult_behaviors_' + str(i + 1)):
                        behaviors = {'hotel': request.POST['adult_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['adult_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST['adult_last_name' + str(i + 1)]).replace(':', '').strip()
                    email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                    mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1))).replace(':', '').strip()
                    booker_mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                    adult.append({
                        "pax_type": "ADT",
                        "first_name": first_name,
                        "last_name": last_name,
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
                        'additional_info': ["Room: 1", "SpecialReq:" + hotel_request['special_request']],
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
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['adult_title' + str(i + 1)],
                                "email": email,
                                "calling_code": request.POST['adult_phone_code' + str(i + 1) + '_id'],
                                "mobile": mobile,
                                "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                                "work_phone": request.POST['booker_phone_code_id'] + booker_mobile,
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

                for i in range(int(hotel_request['child'])):
                    behaviors = {}
                    if request.POST.get('child_behaviors_' + str(i + 1)):
                        behaviors = {'hotel': request.POST['child_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['child_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST['child_last_name' + str(i + 1)]).replace(':', '').strip()
                    # email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                    # mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1))).replace(':', '').strip()

                    child.append({
                        "pax_type": "CHD",
                        "first_name": first_name,
                        "last_name": last_name,
                        "title": request.POST['child_title' + str(i + 1)],
                        "birth_date": request.POST['child_birth_date' + str(i + 1)],
                        "nationality_code": request.POST['child_nationality' + str(i + 1) + '_id'],
                        "passenger_seq_id": request.POST['child_id' + str(i + 1)],
                        "room_number": '1',
                        "behaviors": behaviors,
                    })
                    printout_paxs.append({
                        "name": request.POST['child_title' + str(i + 1)] + ' ' + request.POST['child_first_name' + str(i + 1)] + ' ' + request.POST['child_last_name' + str(i + 1)],
                        'ticket_number': '',
                        'birth_date': request.POST['child_birth_date' + str(i + 1)],
                        'pax_type': 'Child',
                        'additional_info': ["Room: 1", "SpecialReq:" + hotel_request['special_request']],
                    })

                if len(contact) == 0:
                    first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST['booker_last_name']).replace(':', '').strip()
                    email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                    mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                    contact.append({
                        'title': request.POST['booker_title'],
                        'first_name': first_name,
                        'last_name': last_name,
                        'email': email,
                        'calling_code': request.POST['booker_phone_code_id'],
                        'mobile': mobile,
                        'nationality_code': request.POST['booker_nationality_id'],
                        'contact_seq_id': request.POST['booker_id'],
                        "work_phone": request.POST['booker_phone_code_id'] + mobile,
                        'is_also_booker': True
                    })
                write_cache_file(request, signature, 'hotel_review_pax', {
                    'booker': booker,
                    'contact': contact,
                    'adult': adult,
                    'child': child,
                })
                # set_session(request, 'hotel_review_pax', {
                #     'booker': booker,
                #     'contact': contact,
                #     'adult': adult,
                #     'child': child,
                # })

                file = read_cache_file(request, signature, 'hotel_room_pick')
                if file:
                    hotel_room_pick = file

                file = read_cache_file(request, signature, 'hotel_detail')
                if file:
                    hotel_detail = file

                print_json = json.dumps({
                    "type": "hotel",
                    "agent_name": request.session['user_account']['co_agent_name'],
                    "passenger": printout_paxs,
                    "price_detail": [{
                        "fare": rec['price_total'],
                        "name": rec['category'] + ' ' + rec['description'],
                        "qty": 1,
                        "total": rec['price_total'],
                        "pax_type": "Adult: " + str(rec['pax']['adult']) + " Child: " + str(len(rec['pax'].get('child_ages',0))),
                        "tax": 0
                    } for rec in hotel_room_pick['rooms']],
                    "line": [
                       {
                           "resv": "-",
                           "checkin": hotel_request['checkin_date'],
                           "checkout": hotel_request['checkout_date'],
                           "meal_type": hotel_room_pick['meal_type'],
                           "room_name": rec['category'] + ' ' + rec['description'],
                           "hotel_name": hotel_detail['name'],
                       }
                   for rec in hotel_room_pick['rooms']],
                })

                write_cache_file(request, signature, 'hotel_json_printout', print_json)
                # set_session(request, 'hotel_json_printout' + request.session['hotel_signature'], print_json)
            except Exception as e:
                file = read_cache_file(request, signature, 'hotel_review_pax')
                if file:
                    hotel_review_pax = file
                file = read_cache_file(request, signature, 'hotel_json_printout')
                if file:
                    hotel_json_printout = file
                booker = hotel_review_pax['booker']
                contact = hotel_review_pax['contact']
                adult = hotel_review_pax['adult']
                child = hotel_review_pax['child']
                print_json = hotel_json_printout

            file = read_cache_file(request, signature, 'hotel_detail')
            if file:
                hotel_pick = file
                if hotel_pick.get('description'):
                    hotel_pick.pop('description')

            file = read_cache_file(request, signature, 'hotel_upsell')
            if file:
                hotel_upsell = file
            else:
                hotel_upsell = 0

            file = read_cache_file(request, signature, 'hotel_request')
            if file:
                hotel_request = file
                if hotel_request.get('checkin_date'):
                    hotel_request['checkin_date'] = convert_string_to_date_to_string_front_end(hotel_request['checkin_date'])
                if hotel_request.get('checkout_date'):
                    hotel_request['checkout_date'] = convert_string_to_date_to_string_front_end(hotel_request['checkout_date'])

            file = read_cache_file(request, signature, 'hotel_room_pick')
            if file:
                hotel_room_pick = file

            file = read_cache_file(request, signature, 'hotel_detail')
            if file:
                hotel_detail = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            file = read_cache_file(request, signature, 'hotel_cancellation_policy')
            if file:
                hotel_cancellation_policy = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'booker': booker,
                'contact': contact,
                'adults': adult,
                'childs': child,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'upsell': hotel_upsell,
                'hotel_search': hotel_request,
                'hotel_pick': hotel_pick,
                'hotel_room_detail_pick': hotel_room_pick,
                'adult_count': int(hotel_request['adult']),
                'infant_count': int(hotel_request['child']),
                'special_request': hotel_request['special_request'],
                'response': hotel_detail,
                'username': request.session['user_account'],
                'signature': signature,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': time_limit,
                'printout_rec': print_json,
                'hotel_cancellation_policy': hotel_cancellation_policy['result']['response']['policies'],
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
            raise Exception('Hotel get booking without login in btb web')
        try:
            hotel_order_number = base64.b64decode(order_number).decode('ascii')
        except:
            try:
                hotel_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
            except:
                hotel_order_number = order_number

        write_cache_file(request, request.session['signature'], 'hotel_order_number', hotel_order_number)
        if 'user_account' not in request.session:
            signin_btc(request)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': hotel_order_number,
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
