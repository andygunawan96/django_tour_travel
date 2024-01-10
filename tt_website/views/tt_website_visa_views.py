from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from .tt_website_views import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from django.utils import translation
import json
import base64
import re
from datetime import *
_logger = logging.getLogger("website_logger")

MODEL_NAME = 'tt_website'
# _dest_env = TtDestinations()


# Create your views here.
def visa(request):
    if 'user_account' in request.session._session and 'ticketing_visa' in request.session['user_account']['co_agent_frontend_security'] and 'b2c_limitation' not in request.session['user_account']['co_agent_frontend_security']:
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
                file = read_cache_file(request, '', 'visa_request')
                if file:
                    cache['visa'] = {
                        'destination': file['destination'],
                        'departure_date': file['departure_date'],
                        'consulate': file['consulate']
                    }

                # cache['visa'] = {
                #     'destination': request.session['visa_request']['destination'],
                #     'departure_date': request.session['visa_request']['departure_date'],
                #     'consulate': request.session['visa_request']['consulate']
                # }
                if cache['visa']['departure_date'] == 'Invalid date':
                    cache['visa']['departure_date'] = convert_string_to_date_to_string_front_end(
                        str(datetime.now())[:10])
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
                'big_banner_value': check_banner('visa', 'big_banner', request),
                'small_banner_value': check_banner('visa', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/visa/visa_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            # check_captcha(request)
            values = get_data_template(request, 'search')
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            frontend_signature = generate_signature()
            try:
                visa_request = {
                    'destination': request.POST['visa_destination_id'],
                    'departure': request.POST['visa_departure'],
                    'consulate': request.POST['visa_consulate_id'],
                }
                write_cache_file(request, frontend_signature, 'visa_request', visa_request)
                write_cache_file(request, '', 'visa_request', visa_request)
                # set_session(request, 'visa_request', visa_request)
            except Exception as e:
                _logger.error('Data POST for visa_request not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            file = read_cache_file(request, frontend_signature, 'visa_request')
            if file:
                visa_request = file
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'visa_request': visa_request,
                'frontend_signature': frontend_signature,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'signature': request.session['signature'],
                'time_limit': 1200,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/visa/visa_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request, signature=''):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request)

            try:
                time_limit = get_timelimit_product(request, 'visa', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            file = read_cache_file(request, signature, 'visa_search')
            if file:
                visa_search = file
                visa_search['result']['response']['list_of_visa'] = json.loads(request.POST['visa_list'])
                write_cache_file(request, signature, 'visa_search', visa_search)
            # try:
            #     request.session['visa_search']['result']['response']['list_of_visa'] = json.loads(request.POST['visa_list'])
            # except Exception as e:
            #     _logger.error('Data POST for visa_search, visa_list not found use cache')
            #     _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            list_visa = visa_search
            count = 1
            pax = {
                'adult': 0,
                'child': 0,
                'infant': 0,
                'elder': 0
            }
            # agent
            adult_title = ['', 'MR', 'MRS', 'MS']

            infant_title = ['', 'MSTR', 'MISS']

            id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

            # agent

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            # airline_carriers = response['result']['response']['airline']['carriers']
            adult = []
            infant = []
            child = []
            elder = []
            try:
                sell_journey = []
                for visa in list_visa['result']['response']['list_of_visa']:
                    pax_count = 0
                    try:
                        pax_count = int(request.POST['qty_pax_'+str(count)])
                        check = 0
                        for rec in sell_journey:
                            if rec['provider'] == visa['provider']:
                                check = 1
                        if check == 0:
                            sell_journey.append({
                                'pax': [],
                                'provider': visa['provider']
                            })
                        for rec in sell_journey:
                            if rec['provider'] == visa['provider']:
                                rec['pax'].append({
                                    'pax': int(request.POST['qty_pax_'+str(count)]),
                                    'id': visa['id'],
                                })
                    except Exception as e:
                        _logger.error('Data POST qty_pax not found use cache')
                        _logger.error("%s, %s" % (str(e),traceback.format_exc()))
                        try:
                            pax_count = visa['total_pax']
                        except:
                            pass
                    visa['total_pax'] = pax_count
                    visa['pax_count'] = pax_count
                    if visa['pax_type'][0] == 'ADT':
                        pax.update({
                            'adult': pax['adult']+pax_count
                        })
                        for i in range(pax_count):
                            adult.append('')
                    elif visa['pax_type'][0] == 'CHD':
                        pax.update({
                            'child': pax['child']+pax_count
                        })
                        for i in range(pax_count):
                            child.append('')
                    elif visa['pax_type'][0] == 'INF':
                        pax.update({
                            'infant': pax['infant']+pax_count
                        })
                        for i in range(pax_count):
                            infant.append('')
                    elif visa['pax_type'][0] == 'YCD':
                        pax.update({
                            'senior': pax['elder']+pax_count
                        })
                        for i in range(pax_count):
                            elder.append('')
                    count = count + 1
                sell = []
                for rec in sell_journey:
                    check = 0
                    for rec_pax in rec['pax']:
                        if rec_pax['pax'] > 0:
                            check = 1
                    if check == 1:
                        sell.append(rec)

                write_cache_file(request, signature, 'visa_sell', sell)
                write_cache_file(request, signature, 'visa_passenger', pax)
                write_cache_file(request, signature, 'visa_search', list_visa)

                # set_session(request, 'visa_sell', sell)
                # set_session(request, 'visa_passenger', pax)
                # set_session(request, 'visa_search', list_visa)
            except Exception as e:
                _logger.error('Data POST for visa_sell, visa_passenger, visa_search not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                file = read_cache_file(request, signature, 'visa_passenger')
                if file:
                    data_pax = file
                # data_pax = request.session['visa_passenger']
                for i in range(data_pax['adult']):
                    adult.append('')
                for i in range(data_pax['child']):
                    child.append('')
                for i in range(data_pax['infant']):
                    infant.append('')
                for i in range(data_pax['elder']):
                    elder.append('')

            file = read_cache_file(request, signature, 'visa_search')
            if file:
                list_of_visa = file['result']['response']
            # list_of_visa = json.loads(json.dumps(request.session['visa_search']['result']['response']))

            file = read_cache_file(request, signature, 'visa_passenger')
            if file:
                visa_passenger = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            file = read_cache_file(request, signature, 'visa_request')
            if file:
                visa_request = file

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'visa': list_of_visa,
                'passengers': visa_passenger,
                'signature': signature,
                'time_limit': time_limit,
                'adults': adult,
                'childs': child,
                'infants': infant,
                'static_path_url_server': get_url_static_path(),
                'adult_title': adult_title,
                'infant_title': infant_title,
                'id_types': id_type,
                'visa_request': visa_request,
                # 'visa_request': visa_request,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/visa/visa_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request, signature=''):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            try:
                time_limit = get_timelimit_product(request, 'visa', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            try:
                # get_balance(request)
                adult = []
                child = []
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

                file = read_cache_file(request, signature, 'visa_passenger')
                if file:
                    visa_passenger = file
                for i in range(int(visa_passenger['adult'])):
                    img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                    behaviors = {}
                    if request.POST.get('adult_behaviors_' + str(i + 1)):
                        behaviors = {'visa': request.POST['adult_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['adult_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('adult_last_name' + str(i + 1))).replace(':', '').strip()
                    email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1), '')).replace(':', '').strip()
                    mobile = re.sub(r'\s', ' ', request.POST.get('adult_mobile' + str(i + 1), '')).replace(':', '').strip()
                    identity_number = re.sub(r'\s', ' ', request.POST.get('adult_passport_number' + str(i + 1))).replace(':', '').strip()

                    description = ''
                    if request.POST.get('adult_description_' + str(i + 1)):
                        description = request.POST['adult_description_' + str(i + 1)]

                    adult.append({
                        "pax_type": "ADT",
                        "first_name": first_name,
                        "last_name": last_name,
                        "title": request.POST['adult_title' + str(i + 1)],
                        "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                        "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                        "identity_country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1) + '_id'],
                        "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                        "identity_number": identity_number,
                        "identity_type": "passport",
                        "identity_image": img_identity_data,
                        "behaviors": behaviors,
                        "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                        "description": description
                    })

                    if i == 0:
                        try:
                            if request.POST['myRadios'] == 'true':
                                adult[len(adult) - 1].update({
                                    'is_booker': True
                                })
                            else:
                                adult[len(adult) - 1].update({
                                    'is_booker': False
                                })
                        except:
                            adult[len(adult) - 1].update({
                                'is_booker': False
                            })
                    else:
                        adult[len(adult) - 1].update({
                            'is_booker': False
                        })
                    try:
                        if request.POST['passenger_cp' + str(i)] == 'true':
                            adult[len(adult) - 1].update({
                                'is_contact': True
                            })
                        else:
                            adult[len(adult) - 1].update({
                                'is_contact': False
                            })
                    except:
                        adult[len(adult) - 1].update({
                            'is_contact': False
                        })
                    try:
                        if request.POST['adult_cp' + str(i + 1)] == 'on':
                            contact.append({
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['adult_title' + str(i + 1)],
                                "email": email,
                                "calling_code": request.POST['adult_calling_code' + str(i + 1) + '_id'],
                                "mobile": mobile,
                                "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                                "contact_seq_id": request.POST['adult_id' + str(i + 1)]
                            })
                        if i == 0:
                            try:
                                if request.POST['myRadios'] == 'yes':
                                    contact[len(contact)].update({
                                        'is_booker': True
                                    })
                                else:
                                    contact[len(contact)].update({
                                        'is_booker': False
                                    })
                            except:
                                contact[len(contact)].update({
                                    'is_booker': False
                                })
                    except:
                        pass

                for i in range(int(visa_passenger['child'])):
                    img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'child' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                    behaviors = {}
                    if request.POST.get('child_behaviors_' + str(i + 1)):
                        behaviors = {'visa': request.POST['child_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['child_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('child_last_name' + str(i + 1))).replace(':', '').strip()
                    # email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                    # mobile = re.sub(r'\s', ' ', request.POST.get('adult_mobile' + str(i + 1))).replace(':', '').strip()
                    identity_number = re.sub(r'\s', ' ', request.POST.get('child_passport_number' + str(i + 1))).replace(':', '').strip()

                    description = ''
                    if request.POST.get('child_description_' + str(i + 1)):
                        description = request.POST['child_description_' + str(i + 1)]

                    child.append({
                        "pax_type": "CHD",
                        "first_name": first_name,
                        "last_name": last_name,
                        "title": request.POST['child_title' + str(i + 1)],
                        "birth_date": request.POST['child_birth_date' + str(i + 1)],
                        "nationality_code": request.POST['child_nationality' + str(i + 1) + '_id'],
                        "identity_number": identity_number,
                        "identity_expdate": request.POST['child_passport_expired_date' + str(i + 1)],
                        "identity_country_of_issued_code": request.POST['child_country_of_issued' + str(i + 1) + '_id'],
                        "identity_type": "passport",
                        "identity_image": img_identity_data,
                        "behaviors": behaviors,
                        "passenger_seq_id": request.POST['child_id' + str(i + 1)],
                        "description": description
                    })

                for i in range(int(visa_passenger['infant'])):
                    img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'infant' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                    behaviors = {}
                    if request.POST.get('infant_behaviors_' + str(i + 1)):
                        behaviors = {'visa': request.POST['infant_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['infant_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('infant_last_name' + str(i + 1))).replace(':', '').strip()
                    # email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                    # mobile = re.sub(r'\s', ' ', request.POST.get('adult_mobile' + str(i + 1))).replace(':', '').strip()
                    identity_number = re.sub(r'\s', ' ', request.POST.get('infant_passport_number' + str(i + 1))).replace(':', '').strip()

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
                        "identity_number": identity_number,
                        "identity_expdate": request.POST['infant_passport_expired_date' + str(i + 1)],
                        "identity_country_of_issued_code": request.POST['infant_country_of_issued' + str(i + 1) + '_id'],
                        "identity_type": "passport",
                        "identity_image": img_identity_data,
                        "behaviors": behaviors,
                        "passenger_seq_id": request.POST['infant_id' + str(i + 1)],
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
                        'is_booker': True
                    })

                write_cache_file(request, signature, 'visa_create_passengers', {
                    'booker': booker,
                    'adult': adult,
                    'child': child,
                    'infant': infant,
                    'contact': contact
                })
                # set_session(request, 'visa_create_passengers', {
                #     'booker': booker,
                #     'adult': adult,
                #     'child': child,
                #     'infant': infant,
                #     'contact': contact
                # })

            except Exception as e:
                _logger.error('Data POST for visa_create_passengers not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'visa_search')
            if file:
                list_of_visa = file['result']['response']
            # list_of_visa = json.loads(json.dumps(request.session['visa_search']['result']['response']))

            file = read_cache_file(request, signature, 'visa_create_passengers')
            if file:
                pax = file
            count = 1
            for i in pax:
                if i != 'booker' and i != 'contact':
                    for passenger in pax[i]:
                        passenger.update({
                            'number': count
                        })
                        count = count + 1
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            file = read_cache_file(request, signature, 'visa_upsell')
            if file:
                visa_upsell = file
            else:
                visa_upsell = 0

            file = read_cache_file(request, signature, 'list_of_visa_type')
            if file:
                list_of_visa_type = file

            file = read_cache_file(request, signature, 'visa_request')
            if file:
                visa_request = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'visa': list_of_visa,
                'upsell': visa_upsell,
                'type': list_of_visa_type,
                'visa_request': visa_request,
                'passengers': pax,
                'static_path_url_server': get_url_static_path(),
                'signature': signature,
                'time_limit': time_limit,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                # 'co_uid': request.session['co_uid'],
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/visa/visa_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        values = get_data_template(request)
        javascript_version = get_javascript_version(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Visa get booking without login in btb web')
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            visa_order_number = base64.b64decode(order_number).decode('ascii')
        except:
            try:
                visa_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
            except:
                visa_order_number = order_number
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': visa_order_number,
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            # 'order_number': 'VS.19072500003',
            # 'cookies': json.dumps(res['result']['cookies']),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/visa/visa_booking_templates.html', values)