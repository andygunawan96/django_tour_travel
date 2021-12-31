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
import json
import base64
import copy
from io import BytesIO
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_rodextrip_views import *
_logger = logging.getLogger("rodextrip_logger")

MODEL_NAME = 'tt_website_rodextrip'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

def activity(request):
    if 'user_account' in request.session._session and 'ticketing_activity' in request.session['user_account']['co_agent_frontend_security']:
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
            # activity
            try:
                activity_sub_categories = response['result']['response']['activity']['sub_categories']
            except Exception as e:
                activity_sub_categories = []
                _logger.error(str(e) + '\n' + traceback.format_exc())
            try:
                activity_categories = response['result']['response']['activity']['categories']
            except Exception as e:
                activity_categories = []
                _logger.error(str(e) + '\n' + traceback.format_exc())
            try:
                activity_types = response['result']['response']['activity']['types']
            except Exception as e:
                activity_types = []
                _logger.error(str(e) + '\n' + traceback.format_exc())
            try:
                activity_countries = response['result']['response']['activity']['countries']
            except Exception as e:
                activity_countries = []
                _logger.error(str(e) + '\n' + traceback.format_exc())
            # activity

            # get_data_awal
            cache = {}
            try:
                cache['activity'] = {
                    'name': request.session['activity_request']['query']
                }
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
                # activity
                'activity_sub_categories': activity_sub_categories,
                'activity_categories': activity_categories,
                'activity_types': activity_types,
                'activity_countries': activity_countries,
                'javascript_version': javascript_version,
                'update_data': 'false',
                'static_path_url_server': get_url_static_path(),
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/activity/activity_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            # check_captcha(request)
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            values = get_data_template(request, 'search')

            try:
                request.session['activity_search_request'] = {
                    'query': request.POST['activity_query'],
                    'country': request.POST.get('activity_countries') and int(request.POST['activity_countries']) or 0,
                    'city': request.POST.get('activity_cities') and int(request.POST['activity_cities']) or 0,
                    'type': request.POST.get('activity_type') and int(request.POST['activity_type']) or 0,
                    'category': request.POST.get('activity_category') and int(request.POST['activity_category'].split(' ')[0]) or 0,
                    'sub_category': request.POST.get('activity_sub_category') and int(request.POST['activity_sub_category']) or 0,
                }
            except:
                set_session(request, 'activity_search_request', request.session['activity_search_request'])

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'activity_request': request.session['activity_search_request'],
                'query': request.session['activity_search_request']['query'],
                'parsed_country': request.session['activity_search_request']['country'],
                'parsed_city': request.session['activity_search_request']['city'],
                'parsed_type': request.session['activity_search_request']['type'],
                'parsed_category': request.session['activity_search_request']['category'],
                'parsed_sub_category': request.session['activity_search_request']['sub_category'],
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/activity/activity_search_templates.html', values)
    else:
        return no_session_logout(request)


def detail(request, activity_uuid):
    if 'user_account' in request.session._session:
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

            values = get_data_template(request, 'search')

            # try:
            #     set_session(request, 'time_limit', int(request.POST['time_limit_input']))
            # except:
            #     if request.session.get('time_limit'):
            #         set_session(request, 'time_limit', request.session['time_limit'])
            #     else:
            #         set_session(request, 'time_limit', 1200)

            time_limit = get_timelimit_product(request, 'activity')
            if time_limit == 0:
                try:
                    time_limit = int(request.POST['time_limit_input'])
                except:
                    if request.session.get('time_limit'):
                        time_limit = request.session['time_limit']
                    else:
                        time_limit = 1200
            set_session(request, 'time_limit', time_limit)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            if not request.session.get('activity_search_request'):
                set_session(request, 'activity_search_request', {
                    'query': '',
                    'country': 0,
                    'city': 0,
                    'type': 0,
                    'category': 0,
                    'sub_category': 0,
                })

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'response': request.session['activity_search'][request.session['activity_pick_seq']],
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'activity_uuid': activity_uuid,
                'query': request.session['activity_search_request']['query'],
                'parsed_country': request.session['activity_search_request']['country'],
                'parsed_city': request.session['activity_search_request']['city'],
                'parsed_type': request.session['activity_search_request']['type'],
                'parsed_category': request.session['activity_search_request']['category'],
                'parsed_sub_category': request.session['activity_search_request']['sub_category'],
                'javascript_version': javascript_version,
                'signature': request.session.get('activity_signature') and request.session['activity_signature'] or '',
                'time_limit': request.session.get('time_limit') and request.session['time_limit'] or 1200,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/activity/activity_detail_templates.html', values)
    else:
        return no_session_logout(request)


def passenger(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)

            values = get_data_template(request)

            # agent
            adult_title = ['MR', 'MRS', 'MS']

            infant_title = ['MSTR', 'MISS']

            id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

            # agent

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            # get_balance(request)

            try:
                time_limit = get_timelimit_product(request, 'activity')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
                set_session(request, 'activity_request', {
                    'activity_uuid': request.POST['activity_uuid'],
                    'activity_type_pick': request.POST['activity_type_pick'],
                    'activity_timeslot': request.POST['activity_timeslot'].split(' ~ ')[0] if len(request.POST['activity_timeslot'].split(' - ')) == 2 else '',
                    'additional_price': request.POST.get('additional_price') and request.POST['additional_price'] or 0,
                    'event_pick': request.POST['event_pick'],
                    'activity_types_data': json.loads(request.POST['details_data']),
                    'activity_date_data': json.loads(request.POST['activity_date_data']),
                })
            except:
                set_session(request, 'time_limit', request.session['time_limit'])
                set_session(request, 'activity_request', request.session['activity_request'])

            try:
                pax_count = {}
                # pax count per type
                adult = []
                infant = []
                senior = []
                child = []

                booker_min_age = 0
                booker_max_age = 200
                for temp_sku in json.loads(request.POST['details_data'])[int(request.POST['activity_type_pick'])]['skus']:
                    low_sku_id = temp_sku['sku_id'].lower()
                    request.session['activity_request'].update({
                        low_sku_id+'_passenger': request.POST.get(low_sku_id+'_passenger') and int(request.POST[low_sku_id+'_passenger']) or 0,
                    })
                    pax_count.update({
                        low_sku_id: request.POST.get(low_sku_id+'_passenger') and int(request.POST[low_sku_id+'_passenger']) or 0
                    })
                    if temp_sku.get('pax_type'):
                        if temp_sku['pax_type'] == 'adult':
                            for i in range(int(pax_count[low_sku_id])):
                                if i == 0:
                                    booker_min_age = request.POST.get(low_sku_id + '_min_age') and int(request.POST[low_sku_id + '_min_age']) or 0
                                    booker_max_age = request.POST.get(low_sku_id + '_max_age') and int(request.POST[low_sku_id + '_max_age']) or 200
                                adult.append({
                                    'sku_real_id': temp_sku['id'],
                                    'title': temp_sku['title'],
                                    'sku_id': temp_sku['sku_id'],
                                    'min_age': request.POST.get(low_sku_id + '_min_age') and int(request.POST[low_sku_id + '_min_age']) or 0,
                                    'max_age': request.POST.get(low_sku_id + '_max_age') and int(request.POST[low_sku_id + '_max_age']) or 200
                                })
                        elif temp_sku['pax_type'] == 'senior':
                            for i in range(int(pax_count[low_sku_id])):
                                senior.append({
                                    'sku_real_id': temp_sku['id'],
                                    'title': temp_sku['title'],
                                    'sku_id': temp_sku['sku_id'],
                                    'min_age': request.POST.get(low_sku_id + '_min_age') and int(request.POST[low_sku_id + '_min_age']) or 0,
                                    'max_age': request.POST.get(low_sku_id + '_max_age') and int(request.POST[low_sku_id + '_max_age']) or 200
                                })
                        elif temp_sku['pax_type'] == 'child':
                            for i in range(int(pax_count[low_sku_id])):
                                child.append({
                                    'sku_real_id': temp_sku['id'],
                                    'title': temp_sku['title'],
                                    'sku_id': temp_sku['sku_id'],
                                    'min_age': request.POST.get(low_sku_id + '_min_age') and int(request.POST[low_sku_id + '_min_age']) or 0,
                                    'max_age': request.POST.get(low_sku_id + '_max_age') and int(request.POST[low_sku_id + '_max_age']) or 200
                                })
                        elif temp_sku['pax_type'] == 'infant':
                            for i in range(int(pax_count[low_sku_id])):
                                infant.append({
                                    'sku_real_id': temp_sku['id'],
                                    'title': temp_sku['title'],
                                    'sku_id': temp_sku['sku_id'],
                                    'min_age': request.POST.get(low_sku_id + '_min_age') and int(request.POST[low_sku_id + '_min_age']) or 0,
                                    'max_age': request.POST.get(low_sku_id + '_max_age') and int(request.POST[low_sku_id + '_max_age']) or 200
                                })

                perbooking_list = []
                upload = []
                #perbooking
                for idx, perbooking in enumerate(request.session['activity_request']['activity_types_data'][int(request.POST['activity_type_pick'])]['options']['perBooking']):
                    if perbooking['name'] != 'Guest age' and perbooking['name'] != 'Nationality' and perbooking['name'] != 'Full name' and perbooking['name'] != 'Gender' and perbooking['name'] != 'Date of birth':
                        if perbooking['inputType'] == 1:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 2:
                            for i, item in enumerate(perbooking['items']):
                                try:
                                    if request.POST['perbooking' + str(idx) + str(i)] != '':
                                        perbooking_list.append({
                                            "uuid": perbooking['uuid'],
                                            "value": item['value'],
                                            "name": perbooking['name']
                                        })
                                except:
                                    print('no perbooking2')
                        elif perbooking['inputType'] == 3:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking'+str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 4:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 5:
                            if request.POST['perbooking' + str(idx)] == 'on':
                                perbooking_list.append({
                                    "uuid": perbooking['uuid'],
                                    "value": 'True',
                                    "name": perbooking['name']
                                })
                            else:
                                perbooking_list.append({
                                    "uuid": perbooking['uuid'],
                                    "value": 'False',
                                    "name": perbooking['name']
                                })
                        elif perbooking['inputType'] == 6:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 7:
                            upload.append({
                                "uuid": perbooking['uuid'],
                                "value": base64.b64encode(request.FILES['perbooking' + str(idx)].read()).decode(),
                                "name": perbooking['name'],
                                "type": request.FILES['perbooking' + str(idx)].content_type.split('/')[-1]
                            })
                        elif perbooking['inputType'] == 8:
                            upload.append({
                                "uuid": perbooking['uuid'],
                                "value": base64.b64encode(request.FILES['perbooking' + str(idx)].read()).decode(),
                                "name": perbooking['name'],
                                "type": request.FILES['perbooking' + str(idx)].content_type.split('/')[-1]
                            })
                        elif perbooking['inputType'] == 9:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 10:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 11:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 12:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 13:
                            print('deprecated')
                        elif perbooking['inputType'] == 14:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })
                        elif perbooking['inputType'] == 50:
                            perbooking_list.append({
                                "uuid": perbooking['uuid'],
                                "value": request.POST['perbooking' + str(idx)],
                                "name": perbooking['name']
                            })

                set_session(request, 'activity_pax_data', {
                    'pax_count': pax_count,
                    'adult': adult,
                    'child': child,
                    'infant': infant,
                    'senior': senior,
                    'booker_min_age': booker_min_age,
                    'booker_max_age': booker_max_age,
                })
                set_session(request, 'activity_perbooking', perbooking_list)
                set_session(request, 'activity_upload', upload)
                set_session(request, 'activity_details_data', json.loads(request.POST['details_data']))
                set_session(request, 'activity_type_pick', int(request.POST['activity_type_pick']))
                set_session(request, 'activity_timeslot', request.POST['activity_timeslot'])
                set_session(request, 'additional_price_input', request.POST.get('additional_price_input') and request.POST['additional_price_input'] or 0)
                set_session(request, 'activity_event_pick', int(request.POST['event_pick']))
            except:
                set_session(request, 'activity_perbooking', request.session['activity_perbooking'])
                set_session(request, 'activity_upload', request.session['activity_upload'])
                set_session(request, 'activity_details_data', request.session['activity_details_data'])
                set_session(request, 'activity_type_pick', request.session['activity_type_pick'])
                set_session(request, 'activity_timeslot', request.session['activity_timeslot'])
                set_session(request, 'additional_price_input', request.session['additional_price_input'])
                set_session(request, 'activity_event_pick', request.session['activity_event_pick'])

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            request.session['activity_request'].update({
                'adult_passenger_count': len(request.session['activity_pax_data']['adult']),
                'infant_passenger_count': len(request.session['activity_pax_data']['infant']),
                'child_passenger_count': len(request.session['activity_pax_data']['child']),
                'senior_passenger_count': len(request.session['activity_pax_data']['senior']),
            })

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'adult_title': adult_title,
                'infant_title': infant_title,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'additional_price': request.session['additional_price_input'],
                'response': request.session['activity_pick'],
                'pax_count': request.session['activity_pax_data']['pax_count'],
                'adult_count': request.session['activity_request']['adult_passenger_count'],
                'infant_count': request.session['activity_request']['infant_passenger_count'],
                'child_count': request.session['activity_request']['child_passenger_count'],
                'senior_count': request.session['activity_request']['senior_passenger_count'],
                'booker_min_age': request.session['activity_pax_data']['booker_min_age'],
                'booker_max_age': request.session['activity_pax_data']['booker_max_age'],
                'activity_pax_data': request.session['activity_pax_data'],
                'adults': request.session['activity_pax_data']['adult'],
                'infants': request.session['activity_pax_data']['infant'],
                'seniors': request.session['activity_pax_data']['senior'],
                'childs': request.session['activity_pax_data']['child'],
                'timeslot_pick': request.session['activity_timeslot'].split(' ~ ')[1] if len(request.session['activity_timeslot'].split(' - ')) == 2 else '',
                'price': request.session['activity_request']['activity_date_data'],
                'detail': request.session['activity_request']['activity_types_data'][request.session['activity_type_pick']],
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'signature': request.session['activity_signature'],
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],
            })

            for temp_sku in request.session['activity_details_data'][request.session['activity_type_pick']]['skus']:
                low_sku_id = temp_sku['sku_id'].lower()
                values.update({
                    low_sku_id+'_count': request.session['activity_pax_data']['pax_count'].get(low_sku_id) and int(request.session['activity_pax_data']['pax_count'][low_sku_id]) or 0,
                })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/activity/activity_passenger_templates.html', values)
    else:
        return no_session_logout(request)


def review(request):
    if 'user_account' in request.session._session:
        try:
            try: #check change login atau tidak
                #tidak
                #adult
                adult = []
                child = []
                infant = []
                senior = []
                contact = []
                upload = []
                skus = []
                all_pax = []
                printout_paxs = []

                javascript_version = get_javascript_version()
                cache_version = get_cache_version()
                response = get_cache_data(cache_version)
                airline_country = response['result']['response']['airline']['country']
                phone_code = []
                for i in airline_country:
                    if i['phone_code'] not in phone_code:
                        phone_code.append(i['phone_code'])
                phone_code = sorted(phone_code)
                values = get_data_template(request)
                time_limit = get_timelimit_product(request, 'activity')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)

                booker = {
                    'title': request.POST['booker_title'],
                    'first_name': request.POST['booker_first_name'],
                    'last_name': request.POST['booker_last_name'],
                    'nationality_name': request.POST['booker_nationality'],
                    'email': request.POST['booker_email'],
                    'calling_code': request.POST['booker_phone_code'],
                    'mobile': request.POST['booker_phone'],
                    'booker_seq_id': request.POST['booker_id']
                }

                perpax_list = []
                perpax_list_temp = []
                for i in range(int(request.session['activity_request']['adult_passenger_count'])):
                    adult.append({
                        "first_name": request.POST['adult_first_name'+str(i+1)],
                        "last_name": request.POST['adult_last_name'+str(i+1)],
                        "nationality_name": request.POST['adult_nationality'+str(i+1)],
                        "title": request.POST['adult_title'+str(i+1)],
                        "pax_type": "ADT",
                        "pax_type_str": "Adult",
                        "birth_date": request.POST['adult_birth_date'+str(i+1)],
                        "identity_number": request.POST.get('adult_passport_number' + str(i + 1)) and request.POST['adult_passport_number' + str(i + 1)] or '',
                        "identity_expdate": request.POST.get('adult_passport_expired_date' + str(i + 1)) and request.POST['adult_passport_expired_date' + str(i + 1)] or '',
                        "identity_country_of_issued_name": request.POST.get('adult_country_of_issued' + str(i + 1)) and request.POST['adult_country_of_issued' + str(i + 1)] or '',
                        "passenger_seq_id": request.POST['adult_id'+str(i+1)],
                        "identity_type": "passport",
                        "sku_id": request.POST['adult_sku_id'+str(i+1)],
                        "sku_title": request.POST['adult_sku_title' + str(i + 1)],
                        "sku_real_id": request.POST['adult_sku_real_id' + str(i + 1)],
                        "calling_code": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone_code' + str(i + 1)],
                        "mobile": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone' + str(i + 1)] or ' - ',
                        "email": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_email' + str(i + 1)] or ' - ',
                        "is_cp": request.POST.get('adult_cp' + str(i + 1)),
                    })
                    printout_paxs.append({
                        "name": request.POST['adult_title' + str(i + 1)] + ' ' + request.POST['adult_first_name' + str(i + 1)] + ' ' + request.POST['adult_last_name' + str(i + 1)],
                        'ticket_number': request.POST['adult_sku_id' + str(i + 1)],
                        'birth_date': request.POST['adult_birth_date' + str(i + 1)],
                        'pax_type': 'Adult',
                        'additional_info': ["Ticket:" + request.POST['adult_sku_title' + str(i + 1)]],
                    })

                    # perpax
                    for idx, perpax in enumerate(request.session['activity_request']['activity_types_data'][
                                                     int(request.session['activity_request']['activity_type_pick'])]['options'][
                                                     'perPax']):
                        if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax[
                            'name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth' and \
                                perpax['name'] != 'Passport number' and perpax['name'] != 'Passport expiry date':
                            if perpax['inputType'] == 1:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 2:
                                for j, item in enumerate(perpax['items']):
                                    try:
                                        if request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1) + ' ' + str(j)] == 'true':
                                            perpax_list_temp.append({
                                                "uuid": perpax['uuid'],
                                                "value": item['value'],
                                                "name": perpax['name']
                                            })
                                    except:
                                        print('no perbooking2')
                            elif perpax['inputType'] == 3:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 4:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 5:
                                if request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)] == 'on':
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": 'True',
                                        "name": perpax['name']
                                    })
                                else:
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": 'False',
                                        "name": perpax['name']
                                    })
                            elif perpax['inputType'] == 6:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 7:
                                # upload
                                upload.append({
                                    "uuid": perpax['uuid'],
                                    "value": base64.b64encode(request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].read()).decode(),
                                    "name": perpax['name'],
                                    "type": request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[-1]
                                })
                            elif perpax['inputType'] == 8:
                                # upload
                                upload.append({
                                    "uuid": perpax['uuid'],
                                    "value": base64.b64encode(request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].read()).decode(),
                                    "name": perpax['name'],
                                    "type": request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[-1]
                                })
                            elif perpax['inputType'] == 9:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 10:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 11:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 12:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 13:
                                print('deprecated')
                            elif perpax['inputType'] == 14:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 50:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                                    "name": perpax['name']
                                })
                        elif perpax['name'] == 'Guest age':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": int(request.POST['adult_years_old' + str(i + 1)]),
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Nationality':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['adult_nationality' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Full name':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['adult_title' + str(i + 1)] + ' ' + request.POST[
                                    'adult_first_name' + str(i + 1)] + ' ' + request.POST['adult_last_name' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Gender':
                            if request.POST['adult_title' + str(i + 1)] == 'MR':
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": 'Male',
                                    "name": perpax['name']
                                })
                            else:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": 'Female',
                                    "name": perpax['name']
                                })
                        elif perpax['name'] == 'Date of birth':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['adult_birth_date' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Passport number':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['adult_passport_number' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Passport expiry date':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['adult_passport_expired_date' + str(i + 1)],
                                "name": perpax['name']
                            })
                    if perpax_list_temp:
                        perpax_list.append(perpax_list_temp)
                    perpax_list_temp = []

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
                        'is_also_booker': True
                    })

                #senior
                for i in range(int(request.session['activity_request']['senior_passenger_count'])):

                    senior.append({
                        "first_name": request.POST['senior_first_name'+str(i+1)],
                        "last_name": request.POST['senior_last_name'+str(i+1)],
                        "nationality_name": request.POST['senior_nationality'+str(i+1)],
                        "title": request.POST['senior_title'+str(i+1)],
                        "pax_type": "YCD",
                        "pax_type_str": "Senior",
                        "birth_date": request.POST['senior_birth_date'+str(i+1)],
                        "identity_number": request.POST.get('senior_passport_number' + str(i + 1)) and request.POST['senior_passport_number' + str(i + 1)] or '',
                        "identity_expdate": request.POST.get('senior_passport_expired_date' + str(i + 1)) and request.POST['senior_passport_expired_date' + str(i + 1)] or '',
                        "identity_country_of_issued_name": request.POST.get('senior_country_of_issued' + str(i + 1)) and request.POST['senior_country_of_issued' + str(i + 1)] or '',
                        "passenger_seq_id": request.POST['senior_id'+str(i+1)],
                        "identity_type": "passport",
                        "sku_id": request.POST['senior_sku_id' + str(i + 1)],
                        "sku_title": request.POST['senior_sku_title' + str(i + 1)],
                        "sku_real_id": request.POST['senior_sku_real_id' + str(i + 1)],
                    })
                    printout_paxs.append({
                        "name": request.POST['senior_title' + str(i + 1)] + ' ' + request.POST['senior_first_name' + str(i + 1)] + ' ' + request.POST['senior_last_name' + str(i + 1)],
                        'ticket_number': request.POST['senior_sku_id' + str(i + 1)],
                        'birth_date': request.POST['senior_birth_date' + str(i + 1)],
                        'pax_type': 'Senior',
                        'additional_info': ["Ticket:" + request.POST['senior_sku_title' + str(i + 1)]],
                    })

                    # perpax
                    for idx, perpax in enumerate(request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
                        if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth' and perpax['name'] != 'Passport number' and perpax['name'] != 'Passport expiry date':
                            if perpax['inputType'] == 1:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 2:
                                for j, item in enumerate(perpax['items']):
                                    try:
                                        if request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1) + ' ' + str(j+1)] == 'true':
                                            perpax_list_temp.append({
                                                "uuid": perpax['uuid'],
                                                "value": item['value'],
                                                "name": perpax['name']
                                            })
                                    except:
                                        print('no perbooking2')
                            elif perpax['inputType'] == 3:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 4:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 5:
                                if request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)] == 'on':
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": 'True',
                                        "name": perpax['name']
                                    })
                                else:
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": 'False',
                                        "name": perpax['name']
                                    })
                            elif perpax['inputType'] == 6:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 7:
                                # upload
                                upload.append({
                                    "uuid": perpax['uuid'],
                                    "value": base64.b64encode(request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].read()).decode(),
                                    "name": perpax['name'],
                                    "type": request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[-1]
                                })
                            elif perpax['inputType'] == 8:
                                # upload
                                upload.append({
                                    "uuid": perpax['uuid'],
                                    "value": base64.b64encode(request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].read()).decode(),
                                    "name": perpax['name'],
                                    "type":request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[-1]
                                })
                            elif perpax['inputType'] == 9:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 10:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 11:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 12:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 13:
                                print('deprecated')
                            elif perpax['inputType'] == 14:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 50:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                        elif perpax['name'] == 'Guest age':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": int(request.POST['senior_years_old'+str(i+1)]),
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Nationality':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['senior_nationality'+str(i+1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Full name':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['senior_title' + str(i + 1)]+' '+request.POST['senior_first_name' + str(i + 1)]+' '+request.POST['senior_last_name' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Gender':
                            if request.POST['senior_title' + str(i + 1)] == 'MR':
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": 'Male',
                                    "name": perpax['name']
                                })
                            else:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": 'Female',
                                    "name": perpax['name']
                                })
                        elif perpax['name'] == 'Date of birth':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['senior_birth_date'+str(i+1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Passport number':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['senior_passport_number'+str(i+1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Passport expiry date':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['senior_passport_expired_date'+str(i+1)],
                                "name": perpax['name']
                            })
                    if perpax_list_temp:
                        perpax_list.append(perpax_list_temp)
                    perpax_list_temp = []

                #child
                for i in range(int(request.session['activity_request']['child_passenger_count'])):
                    child.append({
                        "first_name": request.POST['child_first_name'+str(i+1)],
                        "last_name": request.POST['child_last_name'+str(i+1)],
                        "nationality_name": request.POST['child_nationality'+str(i+1)],
                        "title": request.POST['child_title'+str(i+1)],
                        "pax_type": "CHD",
                        "pax_type_str": "Child",
                        "birth_date": request.POST['child_birth_date'+str(i+1)],
                        "identity_number": request.POST.get('child_passport_number' + str(i + 1)) and request.POST['child_passport_number' + str(i + 1)] or '',
                        "identity_expdate": request.POST.get('child_passport_expired_date' + str(i + 1)) and request.POST['child_passport_expired_date' + str(i + 1)] or '',
                        "identity_country_of_issued_name": request.POST.get('child_country_of_issued' + str(i + 1)) and request.POST['child_country_of_issued' + str(i + 1)] or '',
                        "passenger_seq_id": request.POST['child_id'+str(i+1)],
                        "identity_type": "passport",
                        "sku_id": request.POST['child_sku_id' + str(i + 1)],
                        "sku_title": request.POST['child_sku_title' + str(i + 1)],
                        "sku_real_id": request.POST['child_sku_real_id' + str(i + 1)],

                    })
                    printout_paxs.append({
                        "name": request.POST['child_title' + str(i + 1)] + ' ' + request.POST['child_first_name' + str(i + 1)] + ' ' + request.POST['child_last_name' + str(i + 1)],
                        'ticket_number': request.POST['child_sku_id' + str(i + 1)],
                        'birth_date': request.POST['child_birth_date' + str(i + 1)],
                        'pax_type': 'Child',
                        'additional_info': ["Ticket:" + request.POST['child_sku_title' + str(i + 1)]],
                    })

                    # perpax
                    for idx, perpax in enumerate(request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
                        if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth' and perpax['name'] != 'Passport number' and perpax['name'] != 'Passport expiry date':
                            if perpax['inputType'] == 1:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 2:
                                for j, item in enumerate(perpax['items']):
                                    try:
                                        if request.POST['child_perpax' + str(i+1) + '_' + str(idx+1) + ' ' + str(j)] == 'true':
                                            perpax_list_temp.append({
                                                "uuid": perpax['uuid'],
                                                "value": item['value'],
                                                "name": perpax['name']
                                            })
                                    except:
                                        print('no perbooking2')
                            elif perpax['inputType'] == 3:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 4:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 5:
                                if request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)] == 'on':
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": 'True',
                                        "name": perpax['name']
                                    })
                                else:
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": 'False',
                                        "name": perpax['name']
                                    })
                            elif perpax['inputType'] == 6:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 7:
                                # upload
                                upload.append({
                                    "uuid": perpax['uuid'],
                                    "value": base64.b64encode(request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].read()).decode(),
                                    "name": perpax['name'],
                                    "type": request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[-1]
                                })
                            elif perpax['inputType'] == 8:
                                # upload
                                upload.append({
                                    "uuid": perpax['uuid'],
                                    "value": base64.b64encode(request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].read()).decode(),
                                    "name": perpax['name'],
                                    "type": request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[-1]
                                })
                            elif perpax['inputType'] == 9:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 10:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 11:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 12:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 13:
                                print('deprecated')
                            elif perpax['inputType'] == 14:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                            elif perpax['inputType'] == 50:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                                    "name": perpax['name']
                                })
                        elif perpax['name'] == 'Guest age':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": int(request.POST['child_years_old' + str(i + 1)]),
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Nationality':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['child_nationality' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Full name':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['child_title' + str(i + 1)] + ' ' + request.POST['child_first_name' + str(i + 1)] + ' ' + request.POST['child_last_name' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Gender':
                            if request.POST['child_title' + str(i + 1)] == 'MSTR':
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": 'Male',
                                    "name": perpax['name']
                                })
                            else:
                                perpax_list_temp.append({
                                    "uuid": perpax['uuid'],
                                    "value": 'Female',
                                    "name": perpax['name']
                                })
                        elif perpax['name'] == 'Date of birth':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['child_birth_date' + str(i + 1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Passport number':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['child_passport_number'+str(i+1)],
                                "name": perpax['name']
                            })
                        elif perpax['name'] == 'Passport expiry date':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": request.POST['child_passport_expired_date'+str(i+1)],
                                "name": perpax['name']
                            })
                    if perpax_list_temp:
                        perpax_list.append(perpax_list_temp)
                    perpax_list_temp = []

                #infant
                for i in range(int(request.session['activity_request']['infant_passenger_count'])):
                    infant.append({
                        "first_name": request.POST['infant_first_name'+str(i+1)],
                        "last_name": request.POST['infant_last_name'+str(i+1)],
                        "nationality_name": request.POST['infant_nationality'+str(i+1)],
                        "title": request.POST['infant_title'+str(i+1)],
                        "pax_type": "INF",
                        "pax_type_str": "Infant",
                        "birth_date": request.POST['infant_birth_date'+str(i+1)],
                        "identity_number": request.POST.get('infant_passport_number' + str(i + 1)) and request.POST['infant_passport_number' + str(i + 1)] or '',
                        "identity_expdate": request.POST.get('infant_passport_expired_date' + str(i + 1)) and request.POST['infant_passport_expired_date' + str(i + 1)] or '',
                        "identity_country_of_issued_name": request.POST.get('infant_country_of_issued' + str(i + 1)) and request.POST['infant_country_of_issued' + str(i + 1)] or '',
                        "passenger_seq_id": request.POST['infant_id'+str(i+1)],
                        "identity_type": "passport",
                        "sku_id": request.POST['infant_sku_id' + str(i + 1)],
                        "sku_title": request.POST['infant_sku_title' + str(i + 1)],
                        "sku_real_id": request.POST['infant_sku_real_id' + str(i + 1)],
                    })
                    printout_paxs.append({
                        "name": request.POST['infant_title'+str(i+1)] + ' ' + request.POST['infant_first_name'+str(i+1)] + ' ' + request.POST['infant_last_name'+str(i+1)],
                        'ticket_number': request.POST['infant_sku_id' + str(i + 1)],
                        'birth_date': request.POST['infant_birth_date'+str(i+1)],
                        'pax_type': 'Infant',
                        'additional_info': ["Ticket:" + request.POST['infant_sku_title' + str(i + 1)]],
                    })

                    if perpax_list_temp:
                        perpax_list.append(perpax_list_temp)
                    perpax_list_temp = []
                set_session(request, 'activity_perpax', perpax_list)

                for rec in adult:
                    all_pax.append(rec)
                for rec in senior:
                    all_pax.append(rec)
                for rec in child:
                    all_pax.append(rec)
                for rec in infant:
                    all_pax.append(rec)

                pax_count = {}
                no_low_pax_count = {}
                for temp_sku in request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['skus']:
                    low_sku_id = temp_sku['sku_id'].lower()
                    skus.append({
                        'id': temp_sku['id'],
                        'sku_id': low_sku_id,
                        'raw_sku_id': temp_sku['sku_id'],
                        'pax_type': temp_sku['pax_type'],
                        'title': temp_sku['title'],
                        'amount': int(request.session['activity_request'][low_sku_id+'_passenger']),
                    })
                    pax_count.update({
                        low_sku_id: int(request.session['activity_request'][low_sku_id+'_passenger'])
                    })
                    no_low_pax_count.update({
                        temp_sku['sku_id']: int(request.session['activity_request'][low_sku_id + '_passenger'])
                    })

                try:
                    event_id = int(request.session['activity_request']['event_pick'])
                except:
                    event_id = 0

                timeslot = False
                if request.session['activity_request'].get('activity_timeslot'):
                    for time in request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['timeslots']:
                        if time['uuid'] == request.session['activity_request']['activity_timeslot']:
                            timeslot = time

                price_list = request.session['activity_price']['result']['response']
                pax_type_conv = {
                    'Adult': 'ADT',
                    'Senior': 'YCD',
                    'Child': 'CHD',
                    'Infant': 'INF',
                }
                printout_prices = []
                for key, val in price_list['prices'].items():
                    printout_prices.append({
                        "fare": val['amount'],
                        "name": key,
                        "qty": val['pax_count'],
                        "total": val['total'],
                        "pax_type": pax_type_conv[key],
                        "tax": 0
                    })

                search_request = {
                    "product_uuid": request.session['activity_request']['activity_uuid'],
                    "product_type_uuid": request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['uuid'],
                    "visit_date": request.session['activity_price']['result']['response']['date'],
                    "timeslot": timeslot and timeslot['uuid'] or False,
                    "event_seq": event_id,
                }

                set_session(request, 'activity_review_booking', {
                    'all_pax': all_pax,
                    'contacts': contact,
                    'booker': booker,
                    'adult': adult,
                    'senior': senior,
                    'child': child,
                    'infant': infant,
                    'skus': skus,
                    'upload_value': upload,
                    'search_request': search_request
                })
            except Exception as e:
                #change b2c to login
                set_session(request, 'activity_review_booking', json.loads(request.POST['activity_review_booking']))
                printout_paxs = json.loads(request.POST['printout_paxs'])
                printout_prices = json.loads(request.POST['printout_prices'])
                pax_count = json.loads(request.POST['pax_count'])
                price_list = json.loads(request.POST['price_list']) #price
                adult = request.session['activity_review_booking']['adult']
                infant = request.session['activity_review_booking']['infant']
                child = request.session['activity_review_booking']['child']
                senior = request.session['activity_review_booking']['senior']
                contact = request.session['activity_review_booking']['contacts']
                all_pax = request.session['activity_review_booking']['all_pax']
                booker = request.session['activity_review_booking']['booker']
                skus = request.session['activity_review_booking']['skus']
                timeslot = False
                if request.session['activity_request'].get('activity_timeslot'):
                    for time in request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['timeslots']:
                        if time['uuid'] == request.session['activity_request']['activity_timeslot']:
                            timeslot = time

            printout_rec = {
                "type": "activity",
                "agent_name": request.session._session['user_account']['co_agent_name'],
                "passenger": printout_paxs,
                "price_detail": printout_prices,
                "line": [
                    {
                        "resv": "-",
                        "checkin": request.session['activity_price']['result']['response']['date'],
                        "time_slot": timeslot and str(timeslot['startTime']) + ' - ' + str(timeslot['endTime']) or '-',
                        "activity_title": request.session['activity_pick']['name'],
                        "product_type": request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['name'],
                    }
                ],
            }
            set_session(request, 'activity_json_printout' + request.session['activity_signature'], printout_rec)
            set_session(request, 'printout_paxs' + request.session['activity_signature'], printout_paxs)
            set_session(request, 'printout_prices' + request.session['activity_signature'], printout_prices)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'additional_price': request.POST['additional_price'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'printout_paxs': printout_paxs,
                'printout_prices': printout_prices,
                'response': request.session['activity_pick'],
                'perBooking': request.session['activity_perbooking'],
                'perPax': request.session['activity_perpax'],
                'pax_count': pax_count,
                'adult_count': len(adult),
                'infant_count': len(infant),
                'child_count': len(child),
                'senior_count': len(senior),
                'contact_person': contact,
                'all_pax': all_pax,
                'booker': booker,
                'adults': adult,
                'infants': infant,
                'seniors': senior,
                'childs': child,
                'skus': skus,
                'upsell': request.session.get('activity_upsell_'+request.session['activity_signature']) and request.session.get('activity_upsell_'+request.session['activity_signature']) or 0,
                "timeslot": timeslot and timeslot or False,
                'timeslot_pick': request.session['activity_timeslot'].split(' ~ ')[1] if len(request.session['activity_timeslot'].split(' - ')) == 2 else '',
                'price': price_list,
                'visit_date': price_list.get('date') and datetime.strptime(price_list['date'], '%Y-%m-%d').strftime('%d %b %Y') or '',
                'detail': request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])],
                'printout_rec': json.dumps(printout_rec),
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'signature': request.session['activity_signature'],
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/activity/activity_review_templates.html', values)
    else:
        return no_session_logout(request)


def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()

        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            set_session(request, 'activity_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'activity_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'order_number': request.session['activity_order_number'],
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME + '/activity/activity_booking_templates.html', values)