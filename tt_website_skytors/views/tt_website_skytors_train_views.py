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
from .tt_website_skytors_views import *
from tools.parser import *

MODEL_NAME = 'tt_website_skytors'

cabin_class_type = [
    ['E', 'Executive'],
    ['K', 'Economy'],
    ['B', 'Business'],
]

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def search(request):
    if 'username' in request.session._session:

        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        request.session['train_adult'] = request.POST['train_adult']
        request.session['train_infant'] = request.POST['train_infant']
        get_balance(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'journeys': journeys,
            'train_request': {
                'adult': request.POST['train_adult'],
                'infant': request.POST['train_infant'],
                'departure': request.POST['train_departure'],
                'origin': request.POST['train_origin'],
                'destination': request.POST['train_destination']
            },
            'username': request.session['user_account'],
            'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/train/tt_website_skytors_train_search_templates.html', values)
    else:
        return index(request)

def passenger(request):
    if 'username' in request.session._session:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # agent
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

        # agent

        airline_country = response['result']['response']['airline']['country']


        request.session['train_pick'] = json.loads(request.POST['response'])
        get_balance(request)

        #pax
        adult = []
        infant = []
        for i in range(int(request.session['train_adult'])):
            adult.append('')
        for i in range(int(request.session['train_infant'])):
            infant.append('')
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'countries': airline_country,
            'adults': adult,
            'adult_count': request.session['train_adult'],
            'infant_count': request.session['train_infant'],
            'infants': infant,
            'adult_title': adult_title,
            'infant_title': infant_title,
            'id_types': id_type,
            'response': request.session['train_pick'],
            'username': request.session['user_account'],
            'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/train/tt_website_skytors_train_passenger_templates.html', values)
    else:
        return index(request)

def review(request):
    if 'username' in request.session._session:
        #adult
        adult = []
        infant = []
        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'nationality_code': request.POST['booker_nationality'],
            'country_code': request.POST['booker_nationality'],
            'email': request.POST['booker_email'],
            'work_phone': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'home_phone': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'other_phone': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'postal_code': 0,
            "city": request.session._session['company_details']['city'],
            "province_state": request.session._session['company_details']['state'],
            'address': request.session['company_details']['address'],
            'mobile': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'agent_id': int(request.session['agent']['id']),
            'booker_id': request.POST['booker_id']
        }
        # "city": this.state.city_agent,
        # "province_state": this.state.state_agent,
        # "contact_id": "",

        for i in range(int(request.session['train_adult'])):
            print(request.POST['adult_title'+str(i+1)])
            if int(request.POST['adult_years_old'+str(i+1)]) >= 17:
                id_number = request.POST['adult_id_number'+str(i+1)]
                identity_type = request.POST['adult_id_type'+str(i+1)]
            else:
                id_number = 'A'+str(random.randint(0, 9))+str(random.randint(0, 9))+str(random.randint(0, 9))+str(random.randint(0, 9))+str(random.randint(0, 9))
                identity_type = 'pas'

            adult.append({
                "first_name": request.POST['adult_first_name'+str(i+1)],
                "last_name": request.POST['adult_last_name'+str(i+1)],
                "name": request.POST['adult_first_name'+str(i+1)] + " " + request.POST['adult_last_name'+str(i+1)],
                "nationality_code": request.POST['adult_nationality'+str(i+1)],
                "title": request.POST['adult_title'+str(i+1)],
                "seat_numbers": "",
                "mobile": request.POST['adult_phone_code'+str(i+1)] + request.POST['adult_phone'+str(i+1)],
                "pax_type": "ADT",
                "birth_date": request.POST['adult_birth_date'+str(i+1)],
                'years_old': request.POST['adult_years_old'+str(i+1)],
                "identity_number": id_number,
                "identity_type": identity_type,
                "passenger_id": request.POST['adult_id'+str(i+1)]
            })
        for i in range(int(request.session['train_infant'])):
            infant.append({
                "first_name": request.POST['infant_first_name'+str(i+1)],
                "last_name": request.POST['infant_last_name'+str(i+1)],
                "name": request.POST['infant_first_name'+str(i+1)] + " " + request.POST['infant_last_name'+str(i+1)],
                "nationality_code": request.POST['infant_nationality'+str(i+1)],
                "title": request.POST['infant_title'+str(i+1)],
                "seat_numbers": "",
                "identity_number": "",
                "mobile": "",
                "identity_type_str": "",
                "pax_type": "INF",
                "birth_date": request.POST['infant_birth_date'+str(i+1)],
                "identity_type": "",
                "passenger_id": request.POST['infant_id'+str(i+1)]
            })

        journeys_booking = [{
            'segments': [{
                "segment_code": request.session._session['train_pick']['segment_code'],
                "carrier_number": request.session._session['train_pick']['carrier_number'],
                "cabin_class": request.session._session['train_pick']['cabin_class'][0],
                "provider": "kai_outlet",
                "fare_code": request.session._session['train_pick']['fare_code'],
                "class_of_service": request.session._session['train_pick']['class_of_service']
            }],
            'journey_type': "DP"
        }]

        request.session['train_review_booking'] = {
            'booker': booker,
            'adult': adult,
            'infant': infant,
            'journeys_booking': journeys_booking
        }

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'booker': booker,
            'adults': adult,
            'infants': infant,
            'id_types': id_type,
            'adult_count': request.session['train_adult'],
            'infant_count': request.session['train_infant'],
            'journeys_booking': journeys_booking,
            'response': request.session['train_pick'],
            'username': request.session['user_account'],
            'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/train/tt_website_skytors_train_review_templates.html', values)
    else:
        return index(request)

def booking(request):
    if 'username' in request.session._session:
        get_balance(request)
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'id_types': id_type,
            'cabin_class_types': cabin_class_type,
            'order_number': request.POST['order_number'],
            'username': request.session['user_account'],
            'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/train/tt_website_skytors_train_booking_templates.html', values)
    else:
        return index(request)

def seat_map(request):
    if 'username' in request.session._session:
        get_balance(request)
        passenger = []
        for pax in request.session['train_pax']:
            if pax['passenger']['pax_type'] == 'ADT':
                passenger.append(pax)
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'paxs': passenger,
            'username': request.session['user_account'],
            # 'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/train/tt_website_skytors_train_seat_map_templates.html', values)
    else:
        return index(request)