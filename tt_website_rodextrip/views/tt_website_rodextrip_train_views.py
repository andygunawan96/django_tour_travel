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
from .tt_website_rodextrip_views import *
from tools.parser import *

MODEL_NAME = 'tt_website_rodextrip'

cabin_class_type = [
    ['E', 'Executive'],
    ['K', 'Economy'],
    ['B', 'Business'],
]

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['passport', 'Passport'], ['other', 'Other']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def search(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']

        template, logo = get_logo_template()
        try:
            origin = []
            destination = []
            departure = []
            if request.POST['radio_train_type'] == 'roundtrip':
                direction = 'RT'
                departure.append(request.POST['train_departure_return'].split(' - ')[0])
                departure.append(request.POST['train_departure_return'].split(' - ')[1])
                origin.append(request.POST['train_origin'])
                origin.append(request.POST['train_destination'])
                destination.append(request.POST['train_destination'])
                destination.append(request.POST['train_origin'])
            elif request.POST['radio_train_type'] == 'oneway':
                direction = 'OW'
                departure.append(request.POST['train_departure'])
                origin.append(request.POST['train_origin'])
                destination.append(request.POST['train_destination'])
            request.session['train_request'] = {
                'direction': direction,
                'adult': request.POST['train_adult'],
                'infant': request.POST['train_infant'],
                'departure': departure,
                'origin': origin,
                'destination': destination
            }
        except:
            pass

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'signature': request.session['signature'],
            'time_limit': 600,
            'train_request': request.session['train_request'],
            'static_path_url_server': get_url_static_path(),
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'logo': logo,
            'template': template

        }
        return render(request, MODEL_NAME+'/train/train_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)

        template, logo = get_logo_template()

        # agent
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        # agent

        airline_country = response['result']['response']['airline']['country']



        try:
            request.session['time_limit'] = int(request.POST['time_limit_input'])
            request.session['train_pick'] = json.loads(request.POST['response'])
        except:
            pass
        #pax
        adult = []
        infant = []
        for i in range(int(request.session['train_request']['adult'])):
            adult.append('')
        for i in range(int(request.session['train_request']['infant'])):
            infant.append('')
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'adults': adult,
            'infants': infant,
            'adult_title': adult_title,
            'infant_title': infant_title,
            'train_request': request.session['train_request'],
            'id_types': id_type,
            'time_limit': request.session['time_limit'],
            'response': request.session['train_pick'],
            'username': request.session['user_account'],
            'signature': request.session['train_signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            'logo': logo,
            'template': template

        }
        return render(request, MODEL_NAME+'/train/train_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)

        template, logo = get_logo_template()

        adult = []
        infant = []
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
        for i in range(int(request.session['train_request']['adult'])):
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
                "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                "identity_type": request.POST['adult_id_type' + str(i + 1)]
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

        for i in range(int(request.session['train_request']['infant'])):
            infant.append({
                "pax_type": "INF",
                "first_name": request.POST['infant_first_name' + str(i + 1)],
                "last_name": request.POST['infant_last_name' + str(i + 1)],
                "title": request.POST['infant_title' + str(i + 1)],
                "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                "nationality_name": request.POST['infant_nationality' + str(i + 1)],
                "passenger_seq_id": request.POST['infant_id' + str(i + 1)],
            })

        request.session['train_create_passengers'] = {
            'booker': booker,
            'adult': adult,
            'infant': infant,
            'contact': contact
        }
        schedules = []
        journeys = []
        for journey in request.session['train_pick']:
            journeys.append({
                'journey_code': journey['journey_code'],
                'fare_code': journey['fares'][0]['fare_code']
            })
            schedules.append({
                'journeys': journeys,
                'provider': journey['provider'],
            })
            journeys = []

        request.session['train_booking'] = schedules
        try:
            request.session['time_limit'] = request.POST['time_limit_input']
        except:
            pass
        time_limit = request.session['time_limit']
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'time_limit': time_limit,
            'id_types': id_type,
            'train_request': request.session['train_request'],
            'response': request.session['train_pick'],
            'username': request.session['user_account'],
            'passenger': request.session['train_create_passengers'],
            'javascript_version': javascript_version,
            'signature': request.session['train_signature'],
            'static_path_url_server': get_url_static_path(),
            'logo': logo,
            'template': template
            # 'cookies': json.dumps(res['result']['cookies']),

        }
        return render(request, MODEL_NAME+'/train/train_review_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()

        template, logo = get_logo_template()
        try:
            request.session['train_order_number'] = request.POST['order_number']
        except:
            pass
        order_number = request.session['train_order_number']
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': order_number,
            'username': request.session['user_account'],
            'signature': request.session['signature'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/train/train_booking_templates.html', values)
    else:
        return no_session_logout(request)

def seat_map(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        template, logo = get_logo_template()
        try:
            request.session['train_seat_map_request'] = json.loads(request.POST['seat_map_request_input'])
            request.session['train_passenger_request'] = json.loads(request.POST['passenger_input'])
        except:
            pass

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'paxs': request.session['train_passenger_request'],
            'order_number': request.session['train_order_number'],
            'username': request.session['user_account'],
            'signature': request.session['train_signature'],
            # 'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/train/train_seat_map_templates.html', values)
    else:
        return no_session_logout(request)