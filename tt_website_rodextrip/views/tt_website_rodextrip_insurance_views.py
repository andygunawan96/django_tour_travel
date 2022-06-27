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
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_rodextrip_views import *
from tools.parser import *
_logger = logging.getLogger("rodextrip_logger")

MODEL_NAME = 'tt_website_rodextrip'

cabin_class_type = [
    ['E', 'Executive'],
    ['K', 'Economy'],
    ['B', 'Business'],
]

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

id_type = [['',''], ['ktp', 'KTP'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def insurance(request):
    if 'user_account' in request.session._session and 'ticketing_insurance' in request.session['user_account']['co_agent_frontend_security']:
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
                cache['insurance'] = {
                    'departure': request.session['insurance_request']['departure'][0],
                }
                if cache['insurance']['departure'] == 'Invalid date':
                    cache['insurance']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
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
        return render(request, MODEL_NAME + '/insurance/insurance_templates.html', values)

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
                set_session(request, 'insurance_request', {
                    'adult': 1,
                    'date_start': request.POST['insurance_date'].split(' - ')[0],
                    'date_end': request.POST['insurance_date'].split(' - ')[1],
                    'origin': request.POST['insurance_origin'],
                    'destination': request.POST['insurance_destination'],
                    'destination_area': request.POST['insurance_destination'].split(' - ')[1] if request.POST['insurance_provider'] == 'bcainsurance' else request.POST['insurance_destination_area'],
                    'type': request.POST['radio_insurance_type'],
                    'plan_trip': request.POST['insurance_trip'],
                    'provider': request.POST['insurance_provider'],
                    'is_senior': True if request.POST.get('insurance_is_senior') else False,
                })
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'insurance_request': request.session['insurance_request'],
                'static_path_url_server': get_url_static_path(),
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/insurance/insurance_search_templates.html', values)
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
                time_limit = get_timelimit_product(request, 'insurance')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
                set_session(request, 'insurance_pick', json.loads(request.POST['data_insurance']))
                set_session(request, 'insurance_signature', request.POST['signature_data'])
                insurance_request_with_passenger = copy.deepcopy(request.session['insurance_request'])
                insurance_request_with_passenger.update({
                    "adult": int(request.POST['pax']),
                    "family": {
                        "adult": int(request.POST['adult']) - 1,
                        "child": int(request.POST['child'])
                    }
                })
                set_session(request, 'insurance_request_with_passenger', insurance_request_with_passenger)
            except:
                pass

            file = read_cache_with_folder_path("get_insurance_config",90911)
            if file:
                carrier = file

            #pax
            adult = []
            family = []
            sequence = 2
            for i in range(int(request.session['insurance_request_with_passenger']['adult'])):
                adult.append('')
            for i in range(int(request.session['insurance_request_with_passenger']['family']['adult'])):
                family.append({
                    "sequence": sequence,
                    "pax_type": 'Adult'
                })
                sequence += 1
            sequence = 1
            for i in range(int(request.session['insurance_request_with_passenger']['family']['child'])):
                family.append({
                    "sequence": sequence,
                    "pax_type": 'Child'
                })
                sequence += 1
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'adults': adult,
                'family': family,
                'adults_count': len(adult),
                'adult_title': adult_title,
                'insurance_request': request.session['insurance_request_with_passenger'],
                'id_types': id_type,
                'time_limit': request.session['time_limit'],
                'response': request.session['insurance_pick'],
                'username': request.session['user_account'],
                'signature': request.session['insurance_signature'],
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/insurance/insurance_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)

            values = get_data_template(request)
            try:
                img_list_data = json.loads(request.POST['image_list_data'])
            except:
                img_list_data = []
            adult = []
            contact = []
            booker = {
                'title': request.POST['booker_title'],
                'first_name': request.POST['booker_first_name'],
                'last_name': request.POST['booker_last_name'],
                'email': request.POST['booker_email'],
                'calling_code': request.POST['booker_phone_code'],
                'mobile': request.POST['booker_phone'],
                'nationality_name': request.POST['booker_nationality'],
                'booker_seq_id': request.POST['booker_id']
            }
            for i in range(int(request.session['insurance_request_with_passenger']['adult'])):
                # BIKIN buat pasangan ANAK 1 2 3, ahli waris
                relation = []
                ahli_waris = {}
                addons = ''
                counter = 1
                for j in range(int(request.session['insurance_request_with_passenger']['family']['adult'])):
                    relation.append({
                        "title": request.POST['adult_relation%s_title%s' % (str(i + 1),counter)],
                        "first_name": request.POST['adult_relation%s_first_name%s' % (str(i + 1),counter)],
                        "last_name": request.POST['adult_relation%s_last_name%s' % (str(i + 1),counter)],
                        "nationality": request.POST['adult_relation%s_nationality%s_id' % (str(i + 1),counter)],
                        "birth_date": request.POST['adult_relation%s_birth_date%s' % (str(i + 1),counter)],
                        "identity_type": request.POST['adult_relation%s_identity_type%s' % (str(i + 1),counter)],
                        "identity_number": request.POST['adult_relation%s_passport_number%s' % (str(i + 1),counter)],
                        "identity_expdate": request.POST['adult_relation%s_passport_expired_date%s' % (str(i + 1),counter)],
                        "identity_country_of_issued_name": request.POST['adult_relation%s_passport_country_of_issued%s' % (str(i + 1),counter)],
                        "relation": request.POST.get('adult_relation%s_relation%s' % (str(i + 1),counter), ''),
                        "place_of_birth": request.POST.get('adult_relation%s_place_of_birth%s' % (str(i + 1), counter),''),
                    })
                    counter += 1
                for j in range(int(request.session['insurance_request_with_passenger']['family']['child'])):
                    relation.append({
                        "title": request.POST['adult_relation%s_title%s' % (str(i + 1), counter)],
                        "first_name": request.POST['adult_relation%s_first_name%s' % (str(i + 1), counter)],
                        "last_name": request.POST['adult_relation%s_last_name%s' % (str(i + 1), counter)],
                        "nationality": request.POST['adult_relation%s_nationality%s_id' % (str(i + 1), counter)],
                        "birth_date": request.POST['adult_relation%s_birth_date%s' % (str(i + 1), counter)],
                        "identity_type": request.POST['adult_relation%s_identity_type%s' % (str(i + 1), counter)],
                        "identity_number": request.POST['adult_relation%s_passport_number%s' % (str(i + 1), counter)],
                        "identity_expdate": request.POST['adult_relation%s_passport_expired_date%s' % (str(i + 1), counter)],
                        "identity_country_of_issued_name": request.POST['adult_relation%s_passport_country_of_issued%s' % (str(i + 1), counter)],
                        "relation": request.POST.get('adult_relation%s_relation%s' % (str(i + 1), counter), ''),
                        "place_of_birth": request.POST.get('adult_relation%s_place_of_birth%s' % (str(i + 1), counter), ''),

                    })
                    counter += 1
                if request.session['insurance_pick']['provider'] == 'bcainsurance':
                    if request.POST['adult_relation_beneficiary_first_name' + str(i + 1)]:
                        ahli_waris.update({
                            "title": request.POST['adult_relation_beneficiary_title' + str(i + 1)],
                            "first_name": request.POST['adult_relation_beneficiary_first_name' + str(i + 1)],
                            "last_name": request.POST['adult_relation_beneficiary_last_name' + str(i + 1)],
                            "nationality": request.POST['adult_relation_beneficiary_nationality' + str(i + 1) + '_id'],
                            "birth_date": request.POST['adult_relation_beneficiary_birth_date' + str(i + 1)],
                            "identity_type": request.POST['adult_relation_beneficiary_identity_type' + str(i + 1)],
                            "identity_number": request.POST['adult_relation_beneficiary_passport_number' + str(i + 1)],
                            "identity_expdate": request.POST['adult_relation_beneficiary_passport_expired_date' + str(i + 1)],
                            "identity_country_of_issued_name": request.POST['adult_relation_beneficiary_passport_country_of_issued' + str(i + 1)],
                            "relation": request.POST['adult_relation_beneficiary_relation' + str(i + 1)],
                        })

                identity_number = ''
                identity_type = ''
                identity_expdate = ''
                identity_country_of_issued = ''

                if request.session['insurance_pick']['provider'] == 'bcainsurance':
                    identity_number = request.POST['adult_passport_passport_number' + str(i + 1)]
                    identity_type = request.POST['adult_passport_id_type' + str(i + 1)]
                    identity_expdate = request.POST['adult_passport_passport_expired_date' + str(i + 1)]
                    identity_country_of_issued = request.POST['adult_passport_passport_country_of_issued' + str(i + 1)]
                elif request.session['insurance_pick']['provider'] == 'zurich':
                    if request.POST['adult_additional_benefit' + str(i + 1)]:
                        addons = json.loads(request.POST['adult_additional_benefit' + str(i + 1)])

                img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                adult.append({
                    "pax_type": "ADT",
                    "first_name": request.POST['adult_first_name' + str(i + 1)],
                    "last_name": request.POST['adult_last_name' + str(i + 1)],
                    "title": request.POST['adult_title' + str(i + 1)],
                    "birth_date": request.POST.get('adult_birth_date' + str(i + 1)),
                    "nationality_name": request.POST['adult_nationality' + str(i + 1)],

                    "identity_country_of_issued_name": request.POST['adult_country_of_issued' + str(i + 1)],
                    "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                    "identity_number": request.POST['adult_passport_number' + str(i + 1)],
                    "identity_type": request.POST['adult_id_type' + str(i + 1)],
                    "identity_image": img_identity_data,

                    "identity_type2": identity_type,
                    "identity_expdate2": identity_expdate,
                    "identity_number2": identity_number,
                    "identity_country_of_issued_name2": identity_country_of_issued,

                    "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                    "email": request.POST['adult_email' + str(i + 1)],
                    "phone_number": "%s%s" % (request.POST['adult_phone_code' + str(i + 1)], request.POST['adult_phone' + str(i + 1)]),
                    "data_insurance": {
                        "relation": relation,
                        "beneficiary": ahli_waris,
                        "address": request.POST['adult_address' + str(i + 1)],
                        "postal_code": request.POST['adult_postal_code' + str(i + 1)],
                        "city": request.POST['adult_city' + str(i + 1)],
                        "place_of_birth": request.POST['adult_place_of_birth' + str(i + 1)],
                        "addons": addons
                    }
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

            set_session(request, 'insurance_create_passengers', {
                'booker': booker,
                'adult': adult,
                'contact': contact
            })
            schedules = []
            journeys = []
            try:
                time_limit = get_timelimit_product(request, 'insurance')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
                set_session(request, 'insurance_signature', request.POST['signature'])
            except:
                pass
            time_limit = request.session['time_limit']
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        except Exception as e:
            # coba pakai cache
            try:
                time_limit = get_timelimit_product(request, 'insurance')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
                set_session(request, 'insurance_signature', request.POST['signature'])
            except:
                pass
            time_limit = request.session['time_limit']
        try:
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'insurance_request': request.session['insurance_request_with_passenger'],
                'response': request.session['insurance_pick'],
                'upsell': request.session.get(
                    'insurance_upsell_' + request.session['insurance_signature']) and request.session.get(
                    'insurance_upsell_' + request.session['insurance_signature']) or 0,
                'username': request.session['user_account'],
                'passenger': request.session['insurance_create_passengers'],
                'javascript_version': javascript_version,
                'signature': request.session['insurance_signature'],
                'static_path_url_server': get_url_static_path(),
                # 'cookies': json.dumps(res['result']['cookies']),

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/insurance/insurance_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            set_session(request, 'insurance_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'insurance_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': request.session['insurance_order_number'],
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/insurance/insurance_booking_templates.html', values)

def seat_map(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            values = get_data_template(request)
            try:
                set_session(request, 'insurance_seat_map_request', json.loads(request.POST['seat_map_request_input']))
                set_session(request, 'insurance_passenger_request', json.loads(request.POST['passenger_input']))
            except:
                pass
            paxs = []
            for pax_type in request.session['insurance_passenger_request']:
                for rec in request.session['insurance_passenger_request'][pax_type]:
                    paxs.append(rec)
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'paxs': paxs,
                'username': request.session['user_account'],
                'signature': request.session['insurance_signature'],
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/insurance/insurance_seat_map_templates.html', values)
    else:
        return no_session_logout(request)