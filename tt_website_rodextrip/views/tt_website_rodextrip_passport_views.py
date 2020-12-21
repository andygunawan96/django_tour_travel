from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from .tt_website_rodextrip_views import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from django.utils import translation
import json
import base64
from datetime import *
_logger = logging.getLogger("rodextrip_logger")

MODEL_NAME = 'tt_website_rodextrip'
# _dest_env = TtDestinations()


# Create your views here.

def passport(request):
    if 'user_account' in request.session._session and 'ticketing_passport' in request.session['user_account']['co_agent_frontend_security']:
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
        return render(request, MODEL_NAME + '/passport/passport_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            values = get_data_template(request, 'search')
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            try:
                passport_request = {
                    'passport_type': request.POST['passport_type'],
                    'passport_apply_type': request.POST['passport_apply_type'],
                    'consulate': request.POST['consulate'],
                }
                set_session(request, 'passport_request', passport_request)
            except:
                passport_request = request.session['passport_request']

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'passport_request': passport_request,
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
        return render(request, MODEL_NAME+'/passport/passport_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request)

            set_session(request, 'time_limit', int(request.POST['time_limit_input']))
            request.session['time_limit'] = int(request.POST['time_limit_input'])
            request.session['passport_search']['result']['response']['list_of_passport'] = json.loads(request.POST['passport_list'])
            list_passport = request.session['passport_search']
            count = 1
            pax_count = 0
            pax = {
                'adult': 0
            }
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

            # airline_carriers = response['result']['response']['airline']['carriers']

            adult = []
            sell_journey = []
            for passport in list_passport['result']['response']['list_of_passport']:

                pax_count = 0
                try:
                    pax_count = int(request.POST['qty_pax_'+str(count)])
                    check = 0
                    for rec in sell_journey:
                        if rec['provider'] == passport['provider']:
                            check = 1
                    if check == 0:
                        sell_journey.append({
                            'pax': [],
                            'provider': passport['provider']
                        })
                    for rec in sell_journey:
                        if rec['provider'] == passport['provider']:
                            rec['pax'].append({
                                'pax': int(request.POST['qty_pax_'+str(count)]),
                                'id': passport['id'],
                            })
                except:
                    try:
                        pax_count = passport['total_pax']
                    except:
                        pass
                passport['total_pax'] = pax_count
                passport['pax_count'] = pax_count
                pax.update({
                    'adult': pax['adult']+pax_count
                })
                for i in range(pax_count):
                    adult.append('')
                count = count + 1
            sell = []
            for rec in sell_journey:
                check = 0
                for rec_pax in rec['pax']:
                    if rec_pax['pax'] > 0:
                        check = 1
                if check == 1:
                    sell.append(rec)

            set_session(request, 'passport_sell', sell)
            set_session(request, 'passport_passenger', pax)
            set_session(request, 'passport_search', list_passport)
            list_of_passport = json.loads(json.dumps(request.session['passport_search']['result']['response']))
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'passport': list_of_passport,
                'passengers': pax,
                'signature': request.session['passport_signature'],
                'time_limit': request.session['time_limit'],
                'adults': adult,
                'static_path_url_server': get_url_static_path(),
                'adult_title': adult_title,
                'infant_title': infant_title,
                'id_types': id_type,
                'passport_request': request.session['passport_request'],
                # 'visa_request': visa_request,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/passport/passport_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request):
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
            values = get_data_template(request)

            set_session(request, 'time_limit', int(request.POST['time_limit_input']))

            # get_balance(request)
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
            try:
                for i in range(int(request.session['passport_passenger']['adult'])):
                    adult.append({
                        "pax_type": "ADT",
                        "first_name": request.POST['adult_first_name' + str(i + 1)],
                        "last_name": request.POST['adult_last_name' + str(i + 1)],
                        "title": request.POST['adult_title' + str(i + 1)],
                        "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                        "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                        "identity_country_of_issued_name": request.POST['adult_country_of_issued' + str(i + 1)],
                        "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                        "identity_number": request.POST['adult_passport_number' + str(i + 1)],
                        "identity_type": "passport",
                        "passenger_seq_id": request.POST['adult_id' + str(i + 1)]
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
                                "first_name": request.POST['adult_first_name' + str(i + 1)],
                                "last_name": request.POST['adult_last_name' + str(i + 1)],
                                "title": request.POST['adult_title' + str(i + 1)],
                                "email": request.POST['adult_email' + str(i + 1)],
                                "calling_code": request.POST['adult_calling_code' + str(i + 1)],
                                "mobile": request.POST['adult_mobile' + str(i + 1)],
                                "nationality_name": request.POST['adult_nationality' + str(i + 1)],
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
                    'is_booker': True
                })
            set_session(request, 'passport_create_passengers', {
                'booker': booker,
                'adult': adult,
                'contact': contact
            })
            pax = request.session['passport_create_passengers']

            count = 1
            for i in pax:
                if i != 'booker' and i != 'contact':
                    for passenger in pax[i]:
                        passenger.update({
                            'number': count
                        })
                        count = count + 1

            list_of_passport = json.loads(json.dumps(request.session['passport_search']['result']['response']))

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'passport': list_of_passport,
                'upsell': request.session.get('passport_upsell_'+request.session['passport_signature']) and request.session.get('passport_upsell_'+request.session['passport_signature']) or 0,
                'passport_request': request.session['passport_request'],
                'passengers': pax,
                'static_path_url_server': get_url_static_path(),
                'signature': request.session['passport_signature'],
                'time_limit': request.session['time_limit'],
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                # 'co_uid': request.session['co_uid'],
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/passport/passport_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        values = get_data_template(request)
        javascript_version = get_javascript_version()
        if 'user_account' not in request.session:
            signin_btc(request)
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            set_session(request, 'passport_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'passport_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': request.session['passport_order_number'],
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            # 'order_number': 'VS.19072500003',
            # 'cookies': json.dumps(res['result']['cookies']),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/passport/passport_booking_templates.html', values)