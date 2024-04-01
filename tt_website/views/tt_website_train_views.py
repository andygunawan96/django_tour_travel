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
import base64
import re
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_views import *
from tools.parser import *
_logger = logging.getLogger("website_logger")

MODEL_NAME = 'tt_website'

cabin_class_type = [
    ['E', 'Executive'],
    ['K', 'Economy'],
    ['B', 'Business'],
]

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

id_type = [['ktp', 'KTP/NIK'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def train(request):
    if 'user_account' in request.session._session and 'ticketing_train' in request.session['user_account']['co_agent_frontend_security']:
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
                file = read_cache_file(request, '', 'train_request')
                if file:
                    cache['train'] = {
                        'origin': file['origin'][0],
                        'destination': file['destination'][0],
                        'departure': file['departure'][0],
                        'direction': file['direction']
                    }
                # cache['train'] = {
                #     'origin': request.session['train_request']['origin'][0],
                #     'destination': request.session['train_request']['destination'][0],
                #     'departure': request.session['train_request']['departure'][0],
                # }
                for rec in cache['train']['departure']:
                    if rec == 'Invalid date' or convert_string_to_date_to_string_front_end(str(datetime.now())[:10]) > rec:
                        cache['train']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
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
                'big_banner_value': check_banner('train', 'big_banner', request),
                'small_banner_value': check_banner('train', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/train/train_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            # check_captcha(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            values = get_data_template(request, 'search')

            frontend_signature = generate_signature()

            file = read_cache("train_cache_data", 'cache_web', request, 90911)
            if file:
                train_destinations = file

            try:
                train_request = {
                    'direction': request.GET['radio_train_type'],
                    'adult': request.GET['adult'],
                    'infant': request.GET['infant'],
                    'departure': request.GET['departure_date'].split(','),
                    'origin': request.GET['origin'].split(','),
                    'destination': request.GET['destination'].split(',')
                }

                temporary_train_destination_choose_dict = {}
                for idx, origin_code in enumerate(train_request['origin']):
                    if temporary_train_destination_choose_dict.get(origin_code):
                        train_request['origin'][idx] = "%s - %s - %s - %s" % (origin_code, temporary_train_destination_choose_dict[origin_code]['name'], temporary_train_destination_choose_dict[origin_code]['city'], temporary_train_destination_choose_dict[origin_code]['country'])
                    else:
                        for train_destination in train_destinations:
                            if origin_code == train_destination['code']:
                                temporary_train_destination_choose_dict[origin_code] = {
                                    "name": train_destination['name'],
                                    "city": train_destination['city'],
                                    "country": train_destination['country']
                                }
                                train_request['origin'][idx] = "%s - %s - %s - %s" % (origin_code, train_destination['name'], train_destination['city'], train_destination['country'])
                                break

                for idx, destination_code in enumerate(train_request['destination']):
                    if temporary_train_destination_choose_dict.get(destination_code):
                        train_request['destination'][idx] = "%s - %s - %s - %s" % (destination_code, temporary_train_destination_choose_dict[destination_code]['name'], temporary_train_destination_choose_dict[destination_code]['city'], temporary_train_destination_choose_dict[destination_code]['country'])
                    else:
                        for train_destination in train_destinations:
                            if destination_code == train_destination['code']:
                                temporary_train_destination_choose_dict[destination_code] = {
                                    "name": train_destination['name'],
                                    "city": train_destination['city'],
                                    "country": train_destination['country']
                                }
                                train_request['destination'][idx] = "%s - %s - %s - %s" % (destination_code, train_destination['name'], train_destination['city'], train_destination['country'])
                                break

                write_cache_file(request, frontend_signature, 'train_request', train_request)
                write_cache_file(request, '', 'train_request', train_request)
                # set_session(request, 'train_request', train_request)
                # set_session(request, 'train_request_%s' % frontend_signature, train_request)
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())
                train_request = request.session['train_request']

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser


            if request.POST.get('checkbox_corpor_mode_train') and request.POST.get('train_corpor_select_post') and request.POST.get('train_corbooker_select_post'):
                updated_request = request.POST.copy()
                updated_request.update({
                    'customer_parent_seq_id': request.POST['train_corpor_select_post']
                })
                cur_session = request.session['user_account']
                cur_session.update({
                    "co_customer_parent_seq_id": request.POST['train_corpor_select_post'],
                    "co_customer_seq_id": request.POST['train_corbooker_select_post']
                })
                set_session(request, 'user_account', cur_session)
                activate_corporate_mode(request, request.session['signature'])

            if request.GET.get('checkbox_corpor_mode_train') and request.GET.get('train_corpor_select') and request.GET.get('train_corbooker_select'):
                updated_request = request.POST.copy()
                updated_request.update({
                    'customer_parent_seq_id': request.GET['train_corpor_select']
                })
                cur_session = request.session['user_account']
                cur_session.update({
                    "co_customer_parent_seq_id": request.GET['train_corpor_select'],
                    "co_customer_seq_id": request.GET['train_corbooker_select']
                })
                set_session(request, 'user_account', cur_session)
                activate_corporate_mode(request, request.session['signature'])

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'train_request': train_request,
                'frontend_signature': frontend_signature,
                'static_path_url_server': get_url_static_path(),
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)

            values = get_data_template(request)

            # agent
            adult_title = ['', 'MR', 'MRS', 'MS']

            infant_title = ['', 'MSTR', 'MISS']

            # agent

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            try:
                time_limit = get_timelimit_product(request, 'train', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            write_cache_file(request, signature, 'train_pick', json.loads(request.POST['response']))
            # set_session(request, 'train_pick_%s' % signature, json.loads(request.POST['response']))
            # set_session(request, 'train_signature', signature)
            file = read_cache("get_train_carriers", 'cache_web', request,90911)
            if file:
                carrier = file

            #pax
            adult = []
            infant = []
            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file
            file = read_cache_file(request, signature, 'train_request')
            if file:
                train_request = file
                for i in range(int(train_request['adult'])):
                    adult.append('')
                for i in range(int(train_request['infant'])):
                    infant.append('')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            is_adult_birth_date_required = False
            file = read_cache_file(request, signature, 'train_pick')
            if file:
                train_pick = file
                for rec in train_pick:
                    if carrier[rec['carrier_code']]['is_adult_birth_date_required']:
                        is_adult_birth_date_required = True
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'adults': adult,
                'infants': infant,
                'train_carriers': carrier,
                'adult_title': adult_title,
                'infant_title': infant_title,
                'train_request': train_request,
                'id_types': id_type,
                'is_adult_birth_date_required': is_adult_birth_date_required,
                'time_limit': time_limit,
                'response': train_pick,
                'username': request.session['user_account'],
                'signature': signature,
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)

            values = get_data_template(request)
            try:
                adult = []
                infant = []
                contact = []
                try:
                    img_list_data = json.loads(request.POST['image_list_data'])
                except:
                    img_list_data = []

                first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                last_name = re.sub(r'\s', ' ', request.POST.get('booker_last_name', '')).replace(':', '').strip()
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
                    'booker_seq_id': request.POST['booker_id']
                }

                file = read_cache_file(request, signature, 'train_request')
                if file:
                    train_request = file
                for i in range(int(train_request['adult'])):
                    img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                    behaviors = {}
                    if request.POST.get('adult_behaviors_' + str(i + 1)):
                        behaviors = {'train': request.POST['adult_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['adult_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('adult_last_name' + str(i + 1))).replace(':', '').strip()
                    email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1), '')).replace(':', '').strip()
                    mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1), '')).replace(':', '').strip()
                    identity_number = re.sub(r'\s', ' ', request.POST['adult_passport_number' + str(i + 1)]).replace(':', '').strip()
                    identity_first_name = re.sub(r'\s', ' ', request.POST['adult_identity_first_name' + str(i + 1)]).replace(':','').strip()
                    identity_last_name = re.sub(r'\s', ' ', request.POST.get('adult_identity_last_name' + str(i + 1), '')).replace(':', '').strip()

                    description = ''
                    if request.POST.get('adult_description_' + str(i + 1)):
                        description = request.POST['adult_description_' + str(i + 1)]

                    adult.append({
                        "pax_type": "ADT",
                        "first_name": first_name,
                        "last_name": last_name,
                        "title": request.POST['adult_title' + str(i + 1)],
                        "birth_date": request.POST.get('adult_birth_date' + str(i + 1)),
                        "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                        "identity_country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1) + '_id'],
                        "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                        "identity_number": identity_number,
                        "identity_first_name": identity_first_name,
                        "identity_last_name": identity_last_name,
                        "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                        "identity_type": request.POST['adult_id_type' + str(i + 1)],
                        "identity_image": img_identity_data,
                        "behaviors": behaviors,
                        "description": description
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

                for i in range(int(train_request['infant'])):
                    img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'infant' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                    behaviors = {}
                    if request.POST.get('infant_behaviors_' + str(i + 1)):
                        behaviors = {'train': request.POST['infant_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['infant_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('infant_last_name' + str(i + 1))).replace(':', '').strip()
                    # email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                    # mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1))).replace(':', '').strip()
                    identity_number = re.sub(r'\s', ' ', request.POST['infant_passport_number' + str(i + 1)]).replace(':','')
                    identity_first_name = re.sub(r'\s', ' ', request.POST['infant_identity_first_name' + str(i + 1)]).replace(':','').strip()
                    identity_last_name = re.sub(r'\s', ' ', request.POST.get('infant_identity_last_name' + str(i + 1), '')).replace(':', '').strip()

                    description = ''
                    if request.POST.get('infant_description_' + str(i + 1)):
                        description = request.POST['infant_description_' + str(i + 1)]

                    infant.append({
                        "pax_type": "INF",
                        "first_name": first_name,
                        "last_name": last_name,
                        "title": request.POST['infant_title' + str(i + 1)],
                        "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                        "nationality_code": request.POST['infant_nationality' + str(i + 1) + '_id'],
                        "passenger_seq_id": request.POST['infant_id' + str(i + 1)],
                        "identity_country_of_issued_code": request.POST['infant_country_of_issued' + str(i + 1) + '_id'],
                        "identity_expdate": request.POST['infant_passport_expired_date' + str(i + 1)],
                        "identity_number": identity_number,
                        "identity_first_name": identity_first_name,
                        "identity_last_name": identity_last_name,
                        "identity_type": request.POST['infant_id_type' + str(i + 1)],
                        "identity_image": img_identity_data,
                        "behaviors": behaviors,
                        "description": description
                    })

                if len(contact) == 0:

                    first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('booker_last_name', '')).replace(':', '').strip()
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
                        'is_also_booker': True
                    })

                write_cache_file(request, signature, 'train_create_passengers', {
                    'booker': booker,
                    'adult': adult,
                    'infant': infant,
                    'contact': contact
                })

                # set_session(request, 'train_create_passengers_%s' % signature, {
                #     'booker': booker,
                #     'adult': adult,
                #     'infant': infant,
                #     'contact': contact
                # })
                schedules = []
                journeys = []

                file = read_cache_file(request, signature, 'train_pick')
                if file:
                    train_pick = file

                    for journey in train_pick:
                        journeys.append({
                            'journey_code': journey['journey_code'],
                            'fare_code': journey['show_fares'][journey['fare_pick']]['fare_code']
                        })
                        schedules.append({
                            'journeys': journeys,
                            'provider': journey['provider'],
                        })
                        journeys = []
                write_cache_file(request, signature, 'train_booking', schedules)
                # set_session(request, 'train_booking_%s' % signature, schedules)
            except Exception as e:
                _logger.error('Data POST for train_create_passengers, train_booking not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            try:
                time_limit = get_timelimit_product(request, 'train', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            # try:
            #     time_limit = get_timelimit_product(request, 'train', signature)
            #     if time_limit == 0:
            #         time_limit = int(request.POST['time_limit_input'])
            #     set_session(request, 'time_limit_%s' % signature, time_limit)
            #     set_session(request, 'train_signature', request.POST['signature'])
            # except:
            #     pass
            # time_limit = request.session['time_limit_%s' % signature]
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        except Exception as e:
            _logger.error("%s, %s" % (str(e), traceback.format_exc()))
        try:
            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file
            file = read_cache_file(request, signature, 'train_request')
            if file:
                train_request = file
            file = read_cache_file(request, signature, 'train_pick')
            if file:
                train_pick = file
            file = read_cache_file(request, signature, 'train_upsell')
            if file:
                train_upsell = file
            else:
                train_upsell = 0
            file = read_cache_file(request, signature, 'train_create_passengers')
            if file:
                train_create_passengers = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'train_request': train_request,
                'response': train_pick,
                'upsell': train_upsell,
                'username': request.session['user_account'],
                'passenger': train_create_passengers,
                'javascript_version': javascript_version,
                'signature': signature,
                'static_path_url_server': get_url_static_path(),
                # 'cookies': json.dumps(res['result']['cookies']),

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Train get booking without login in btb web')
        try:
            train_order_number = base64.b64decode(order_number).decode('ascii')
        except:
            try:
                train_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
            except:
                train_order_number = order_number
        write_cache_file(request, request.session['signature'], 'train_order_number', train_order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': train_order_number,
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/train/train_booking_templates.html', values)

def seat_map(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            values = get_data_template(request)
            is_b2c_field_from_review = {'value': False}
            value = False
            try:
                if 'b2c_limitation' in request.session['user_account']['co_agent_frontend_security']:
                    value = True
            except:
                pass
            try:
                write_cache_file(request, signature, 'train_seat_map_request', json.loads(request.POST['seat_map_request_input']))
                write_cache_file(request, signature, 'train_passenger_request', json.loads(request.POST['passenger_input']))
                # set_session(request, 'train_seat_map_request_%s' % signature, json.loads(request.POST['seat_map_request_input']))
                # set_session(request, 'train_passenger_request_%s' % signature, json.loads(request.POST['passenger_input']))
            except:
                pass

            try:
                is_b2c_field_from_review.update({
                    "discount": json.loads(request.POST['discount']),
                    "voucher_code": request.POST['voucher_code'],
                    "type": request.POST['type'],
                    "passengers": json.loads(request.POST['passengers']),
                    "signature": request.POST['signature'],
                    "order_number": request.POST['order_number'],
                    "provider": request.POST['provider'],
                    "session_time_input": request.POST['session_time_input'],
                    "value": value
                })
            except:
                is_b2c_field_from_review.update({
                    'value': False
                })

            file = read_cache_file(request, signature, 'train_passenger_request')
            if file:
                paxs = file
                for pax in paxs:
                    if not pax.get('behaviors'):
                        pax['behaviors'] = {}
                    if not pax['behaviors'].get('Train'):
                        pax['behaviors']['Train'] = ""
                    if pax['behaviors']['Train']:
                        pax['behaviors']['Train'] = pax['behaviors']['Train'].replace('<br/>','\n')
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'paxs': paxs,
                'order_number': request.POST['order_number'],
                'username': request.session['user_account'],
                'signature': signature,
                "is_b2c_field": is_b2c_field_from_review,
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/train/train_seat_map_templates.html', values)
    else:
        return no_session_logout(request)