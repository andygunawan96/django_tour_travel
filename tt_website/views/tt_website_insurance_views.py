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
from tt_webservice.views.tt_webservice_insurance_views import *
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

id_type = [['',''], ['ktp', 'KTP'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def insurance(request):
    if 'user_account' in request.session and 'ticketing_insurance' in request.session['user_account']['co_agent_frontend_security']:
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
                file = read_cache_file(request, '', 'insurance_request')
                if file:
                    cache['insurance'] = {
                        'departure': file['departure'][0],
                    }
                # cache['insurance'] = {
                #     'departure': request.session['insurance_request']['departure'][0],
                # }
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
                'big_banner_value': check_banner('insurance', 'big_banner', request),
                'small_banner_value': check_banner('insurance', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/insurance/insurance_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session:
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

            frontend_signature = generate_signature()

            values = get_data_template(request, 'search')
            try:
                insurance_request = {
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
                }

                write_cache_file(request, frontend_signature, 'insurance_request', insurance_request)
                write_cache_file(request, '', 'insurance_request', insurance_request)

                # set_session(request, 'insurance_request', {
                #     'adult': 1,
                #     'date_start': request.POST['insurance_date'].split(' - ')[0],
                #     'date_end': request.POST['insurance_date'].split(' - ')[1],
                #     'origin': request.POST['insurance_origin'],
                #     'destination': request.POST['insurance_destination'],
                #     'destination_area': request.POST['insurance_destination'].split(' - ')[1] if request.POST['insurance_provider'] == 'bcainsurance' else request.POST['insurance_destination_area'],
                #     'type': request.POST['radio_insurance_type'],
                #     'plan_trip': request.POST['insurance_trip'],
                #     'provider': request.POST['insurance_provider'],
                #     'is_senior': True if request.POST.get('insurance_is_senior') else False,
                # })
            except Exception as e:
                _logger.error('Data POST for insurance_request not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            provider_insurance_data = get_config(request, request.session['signature'])
            provider_insurance = [rec for rec in provider_insurance_data['result']['response']]

            file = read_cache_file(request, frontend_signature, 'insurance_request')
            if file:
                insurance_request = file
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'signature': request.session['signature'],
                'frontend_signature': frontend_signature,
                'time_limit': 1200,
                'insurance_request': insurance_request,
                'static_path_url_server': get_url_static_path(),
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'provider_list': provider_insurance
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/insurance/insurance_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request, signature=''):
    if 'user_account' in request.session:
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
                time_limit = get_timelimit_product(request, 'insurance', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            try:
                write_cache_file(request, signature, 'insurance_pick', json.loads(request.POST['data_insurance']))
                # set_session(request, 'insurance_pick', json.loads(request.POST['data_insurance']))
                # set_session(request, 'insurance_signature', request.POST['signature_data'])
                file = read_cache_file(request, signature, 'insurance_request')
                if file:
                    insurance_request_with_passenger = file
                # insurance_request_with_passenger = copy.deepcopy(request.session['insurance_request'])
                insurance_request_with_passenger.update({
                    "adult": int(request.POST['pax']),
                    "family": {
                        "adult": int(request.POST['adult']) - 1,
                        "child": int(request.POST['child'])
                    }
                })
                write_cache_file(request, signature, 'insurance_request_with_passenger', insurance_request_with_passenger)
                # set_session(request, 'insurance_request_with_passenger', insurance_request_with_passenger)
            except Exception as e:
                _logger.error('Data POST for insurance_pick, insurance_signature, insurance_request not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache("get_insurance_config", 'cache_web', request, 90911)
            if file:
                carrier = file

            #pax
            adult = []
            family = []
            sequence = 2
            file = read_cache_file(request, signature, 'insurance_request_with_passenger')
            if file:
                insurance_request_with_passenger = file
            for i in range(int(insurance_request_with_passenger['adult'])):
                adult.append('')
            for i in range(int(insurance_request_with_passenger['family']['adult'])):
                family.append({
                    "sequence": sequence,
                    "pax_type": 'Adult'
                })
                sequence += 1
            sequence = 1
            for i in range(int(insurance_request_with_passenger['family']['child'])):
                family.append({
                    "sequence": sequence,
                    "pax_type": 'Child'
                })
                sequence += 1
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            file = read_cache_file(request, signature, 'insurance_pick')
            if file:
                insurance_pick = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'adults': adult,
                'family': family,
                'adults_count': len(adult),
                'adult_title': adult_title,
                'insurance_request': insurance_request_with_passenger,
                'id_types': id_type,
                'time_limit': time_limit,
                'response': insurance_pick,
                'username': request.session['user_account'],
                'signature': signature,
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

def review(request, signature=''):
    if 'user_account' in request.session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)

            values = get_data_template(request)
            try:
                img_list_data = json.loads(request.POST['image_list_data'])
            except:
                img_list_data = []
            adult = []
            contact = []

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

            file = read_cache_file(request, signature, 'insurance_request_with_passenger')
            if file:
                insurance_request_with_passenger = file
            for i in range(int(insurance_request_with_passenger['adult'])):
                # BIKIN buat pasangan ANAK 1 2 3, ahli waris
                relation = []
                ahli_waris = {}
                addons = ''
                counter = 1
                for j in range(int(insurance_request_with_passenger['family']['adult'])):
                    first_name = re.sub(r'\s', ' ', request.POST['Adult_relation%s_first_name%s' % (str(i + 1),counter)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('Adult_relation%s_last_name%s' % (str(i + 1),counter), '')).replace(':', '').strip()
                    # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                    # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()
                    passport_number = re.sub(r'\s', ' ', request.POST['Adult_relation%s_passport_number%s' % (str(i + 1),counter)]).replace(':', '').strip()

                    relation.append({
                        "title": request.POST['Adult_relation%s_title%s' % (str(i + 1),counter)],
                        "first_name": first_name,
                        "last_name": last_name,
                        "nationality": request.POST['Adult_relation%s_nationality%s' % (str(i + 1),counter) + '_id'],
                        "birth_date": request.POST['Adult_relation%s_birth_date%s' % (str(i + 1),counter)],
                        "identity_type": request.POST['Adult_relation%s_identity_type%s' % (str(i + 1),counter)],
                        "identity_number": passport_number,
                        "identity_expdate": request.POST['Adult_relation%s_passport_expired_date%s' % (str(i + 1),counter)],
                        "identity_country_of_issued_code": request.POST['Adult_relation%s_country_of_issued%s' % (str(i + 1),counter) + '_id'],
                        "relation": request.POST.get('Adult_relation%s_relation%s' % (str(i + 1),counter), ''),
                        "place_of_birth": request.POST.get('Adult_relation%s_place_of_birth%s' % (str(i + 1), counter),''),
                    })
                    counter += 1
                for j in range(int(insurance_request_with_passenger['family']['child'])):

                    first_name = re.sub(r'\s', ' ', request.POST['Child_relation%s_first_name%s' % (str(i + 1), counter)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('Child_relation%s_last_name%s' % (str(i + 1), counter), '')).replace(':', '').strip()
                    # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                    # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()
                    passport_number = re.sub(r'\s', ' ', request.POST['Child_relation%s_passport_number%s' % (str(i + 1), counter)]).replace(':', '').strip()

                    relation.append({
                        "title": request.POST['Child_relation%s_title%s' % (str(i + 1), counter)],
                        "first_name": first_name,
                        "last_name": last_name,
                        "nationality": request.POST['Child_relation%s_nationality%s' % (str(i + 1), counter) + '_id'],
                        "birth_date": request.POST['Child_relation%s_birth_date%s' % (str(i + 1), counter)],
                        "identity_type": request.POST['Child_relation%s_identity_type%s' % (str(i + 1), counter)],
                        "identity_number": passport_number,
                        "identity_expdate": request.POST['Child_relation%s_passport_expired_date%s' % (str(i + 1), counter)],
                        "identity_country_of_issued_code": request.POST['Child_relation%s_country_of_issued%s' % (str(i + 1), counter) + '_id'],
                        "relation": request.POST.get('Child_relation%s_relation%s' % (str(i + 1), counter), ''),
                        "place_of_birth": request.POST.get('Child_relation%s_place_of_birth%s' % (str(i + 1), counter), ''),

                    })
                    counter += 1

                file = read_cache_file(request, signature, 'insurance_pick')
                if file:
                    insurance_pick = file
                if insurance_pick['provider'] == 'bcainsurance':
                    if request.POST['Adult_relation_beneficiary_first_name' + str(i + 1)]:
                        first_name = re.sub(r'\s', ' ', request.POST['Adult_relation_beneficiary_first_name' + str(i + 1)]).replace(':', '').strip()
                        last_name = re.sub(r'\s', ' ', request.POST.get('Adult_relation_beneficiary_last_name' + str(i + 1), '')).replace(':', '').strip()
                        # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                        # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()
                        passport_number = re.sub(r'\s', ' ', request.POST['Adult_relation_beneficiary_passport_number' + str(i + 1)]).replace(':', '').strip()

                        ahli_waris.update({
                            "title": request.POST['Adult_relation_beneficiary_title' + str(i + 1)],
                            "first_name": first_name,
                            "last_name": last_name,
                            "nationality": request.POST['Adult_relation_beneficiary_nationality' + str(i + 1) + '_id'],
                            "birth_date": request.POST['Adult_relation_beneficiary_birth_date' + str(i + 1)],
                            "identity_type": request.POST['Adult_relation_beneficiary_identity_type' + str(i + 1)],
                            "identity_number": passport_number,
                            "identity_expdate": request.POST['Adult_relation_beneficiary_passport_expired_date' + str(i + 1)],
                            "identity_country_of_issued_code": request.POST['Adult_relation_passport_country_of_issued' + str(i + 1) + '_id'],
                            "relation": request.POST['Adult_relation_beneficiary_relation' + str(i + 1)],
                        })

                identity_number = ''
                identity_type = ''
                identity_expdate = ''
                identity_country_of_issued = ''

                if insurance_pick['provider'] == 'bcainsurance':
                    identity_number = request.POST['adult_passport_passport_number' + str(i + 1)]
                    identity_number = re.sub(r'\s', ' ', identity_number).replace(':', '').strip()
                    identity_type = request.POST['adult_passport_id_type' + str(i + 1)]
                    identity_expdate = request.POST['adult_passport_passport_expired_date' + str(i + 1)]
                    identity_country_of_issued = request.POST['adult_passport_passport_country_of_issued' + str(i + 1) + '_id']
                elif insurance_pick['provider'] == 'zurich':
                    if request.POST.get('adult_additional_benefit' + str(i + 1)):
                        addons = json.loads(request.POST['adult_additional_benefit' + str(i + 1)])

                behaviors = {}
                if request.POST.get('adult_behaviors_' + str(i + 1)):
                    behaviors = {'activity': request.POST['adult_behaviors_' + str(i + 1)]}
                img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]

                first_name = re.sub(r'\s', ' ',request.POST['adult_first_name' + str(i + 1)]).replace(':','')
                last_name = re.sub(r'\s', ' ',request.POST.get('adult_last_name' + str(i + 1), '')).replace(':','')
                email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1), '')).replace(':', '').strip()
                mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1), '')).replace(':', '').strip()
                passport_number = re.sub(r'\s', ' ', request.POST['adult_passport_number' + str(i + 1)]).replace(':', '').strip()

                adult.append({
                    "pax_type": "ADT",
                    "first_name": first_name,
                    "last_name": last_name,
                    "title": request.POST['adult_title' + str(i + 1)],
                    "birth_date": request.POST.get('adult_birth_date' + str(i + 1)),
                    "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],

                    "identity_country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1) + '_id'],
                    "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                    "identity_number": passport_number,
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
                    },
                    "behaviors": behaviors,
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
                    'nationality_code': request.POST['booker_nationality' + '_id'],
                    'contact_seq_id': request.POST['booker_id'],
                    'is_also_booker': True
                })

            write_cache_file(request, signature, 'insurance_create_passengers', {
                'booker': booker,
                'adult': adult,
                'contact': contact
            })

            # set_session(request, 'insurance_create_passengers', {
            #     'booker': booker,
            #     'adult': adult,
            #     'contact': contact
            # })
        except Exception as e:
            _logger.error("%s, %s" % (str(e), traceback.format_exc()))
        schedules = []
        journeys = []

        try:
            time_limit = get_timelimit_product(request, 'insurance', signature)
            if time_limit == 0:
                time_limit = int(request.POST['time_limit_input'])
            write_cache_file(request, signature, 'time_limit', time_limit)
            # set_session(request, 'time_limit_%s' % signature, time_limit)
        except:
            time_limit = int(request.POST['time_limit_input'])
            write_cache_file(request, signature, 'time_limit', time_limit)

        # try:
        #     set_session(request, 'insurance_signature', request.POST['signature'])
        # except:
        #     pass
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            file = read_cache_file(request, signature, 'insurance_request_with_passenger')
            if file:
                insurance_request_with_passenger = file
            file = read_cache_file(request, signature, 'insurance_pick')
            if file:
                insurance_pick = file
            file = read_cache_file(request, signature, 'insurance_upsell')
            if file:
                insurance_upsell = file
            else:
                insurance_upsell = 0
            file = read_cache_file(request, signature, 'insurance_create_passengers')
            if file:
                insurance_create_passengers = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'time_limit': time_limit,
                'id_types': id_type,
                'insurance_request': insurance_request_with_passenger,
                'response': insurance_pick,
                'upsell': insurance_upsell,
                'username': request.session['user_account'],
                'passenger': insurance_create_passengers,
                'javascript_version': javascript_version,
                'signature': signature,
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
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Insurance get booking without login in btb web')
        try:
            insurance_order_number = base64.b64decode(order_number).decode('ascii')
            # set_session(request, 'insurance_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                insurance_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
                # set_session(request, 'insurance_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
            except:
                insurance_order_number = order_number
                # set_session(request, 'insurance_order_number', order_number)

        write_cache_file(request, request.session['signature'], 'insurance_order_number', insurance_order_number)

        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': insurance_order_number,
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
    return render(request, MODEL_NAME+'/insurance/insurance_booking_templates.html', values)

# def seat_map(request):
#     if 'user_account' in request.session._session:
#         try:
#             javascript_version = get_javascript_version(request)
#             values = get_data_template(request)
#             try:
#                 set_session(request, 'insurance_seat_map_request', json.loads(request.POST['seat_map_request_input']))
#                 set_session(request, 'insurance_passenger_request', json.loads(request.POST['passenger_input']))
#             except:
#                 pass
#             paxs = []
#             for pax_type in request.session['insurance_passenger_request']:
#                 for rec in request.session['insurance_passenger_request'][pax_type]:
#                     paxs.append(rec)
#             values.update({
#                 'static_path': path_util.get_static_path(MODEL_NAME),
#                 'paxs': paxs,
#                 'username': request.session['user_account'],
#                 'signature': request.session['insurance_signature'],
#                 # 'co_uid': request.session['co_uid'],
#                 # 'cookies': json.dumps(res['result']['cookies']),
#                 'javascript_version': javascript_version,
#                 'static_path_url_server': get_url_static_path(),
#             })
#         except Exception as e:
#             _logger.error(str(e) + '\n' + traceback.format_exc())
#             raise Exception('Make response code 500!')
#         return render(request, MODEL_NAME+'/insurance/insurance_seat_map_templates.html', values)
#     else:
#         return no_session_logout(request)