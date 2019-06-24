from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from tools.parser import *
from django.utils import translation
import json
import base64
from io import BytesIO
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from .tt_website_skytors_views import *


MODEL_NAME = 'tt_website_skytors'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

MODEL_NAME = 'tt_website_skytors'

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

        dest_month_data = [
            {'value': '00', 'string': 'All Months'},
            {'value': '01', 'string': 'January'},
            {'value': '02', 'string': 'February'},
            {'value': '03', 'string': 'March'},
            {'value': '04', 'string': 'April'},
            {'value': '05', 'string': 'May'},
            {'value': '06', 'string': 'June'},
            {'value': '07', 'string': 'July'},
            {'value': '08', 'string': 'August'},
            {'value': '09', 'string': 'September'},
            {'value': '10', 'string': 'October'},
            {'value': '11', 'string': 'November'},
            {'value': '12', 'string': 'December'},
        ]

        budget_data = [
            {'value': '0-999999999', 'string': 'All'},
            {'value': '0-1000000', 'string': '0-1 juta'},
            {'value': '1000000-2000000', 'string': '1-2 juta'},
            {'value': '2000000-5000000', 'string': '2-5 juta'},
            {'value': '5000000-10000000', 'string': '5-10 juta'},
            {'value': '10000000-20000000', 'string': '10-20 juta'},
            {'value': '20000000-99000000', 'string': '> 20 juta'},
        ]

        budget_limit = request.POST['tour_budget'].split('-')
        request.session['tour_request'] = {
            'country_id': request.POST['tour_destination'],
            'month': request.POST['tour_dest_month'],
            'year': request.POST['tour_dest_year'],
            'budget_min': budget_limit[0],
            'budget_max': budget_limit[1],
            'limit': 25,
            'offset': 0,

        }

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'dest_destination': request.POST['tour_destination'],
            'dest_year': request.POST['tour_dest_year'],
            'dest_month': request.POST['tour_dest_month'],
            'dest_month_data': dest_month_data,
            'budget_sel': request.POST['tour_budget'],
            'budget_data': budget_data,
        }
        return render(request, MODEL_NAME + '/tour/tt_website_skytors_tour_search_templates.html', values)
    else:
        return index(request)

def detail(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        request.session['tour_pick'] = json.loads(request.POST['tour_pick'])
        request.session['tour_pick'].update({
            'departure_date_f': str(request.session['tour_search'][int(request.POST['sequence'])]['departure_date_f'])
        })
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'response': request.session['tour_search'][int(request.POST['sequence'])],
            'response': request.session['tour_pick'],
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        }

        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_detail_templates.html', values)
    else:
        return index(request)

def passenger(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        # agent
        adult_title = ['MR', 'MRS', 'MS']
        infant_title = ['MSTR', 'MISS']
        child_title = infant_title

        airline_country = response['result']['response']['airline']['country']

        # pax
        adult = []
        infant = []
        child = []

        try:
            for i in range(int(request.POST['adult_total_pax'].replace(',', ''))):
                adult.append('')
        except:
            print('no adult')

        try:
            for i in range(int(request.POST['child_total_pax'].replace(',', ''))):
                child.append('')
        except:
            print('no children')

        try:
            for i in range(int(request.POST['infant_amount'].replace(',', ''))):
                infant.append('')
        except:
            print('no infant')

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'adult_title': adult_title,
            'infant_title': infant_title,
            'child_title': child_title,
            'countries': airline_country,
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'adults': adult,
            'infants': infant,
            'childs': child,
            'price_itinerary': {
                'adult_amount': int(request.POST['adult_amount'].replace(',', '')),
                'adult_total_pax': int(request.POST['adult_total_pax'].replace(',', '')),
                'adult_price': int(request.POST['adult_price'].replace(',', '')),
                'adult_surcharge_amount': int(request.POST['adult_surcharge_amount'].replace(',', '')),
                'adult_surcharge_price': int(request.POST['adult_surcharge_price'].replace(',', '')),
                'child_amount': int(request.POST['child_amount'].replace(',', '')),
                'child_total_pax': int(request.POST['child_total_pax'].replace(',', '')),
                'child_price': int(request.POST['child_price'].replace(',', '')),
                'child_surcharge_amount': int(request.POST['child_surcharge_amount'].replace(',', '')),
                'child_surcharge_price': int(request.POST['child_surcharge_price'].replace(',', '')),
                'infant_amount': int(request.POST['infant_amount'].replace(',', '')),
                'infant_price': int(request.POST['infant_price'].replace(',', '')),
                'single_supplement_amount': int(request.POST['single_supplement_amount'].replace(',', '')),
                'single_supplement_price': int(request.POST['single_supplement_price'].replace(',', '')),
                'airport_tax_amount': int(request.POST['airport_tax_amount'].replace(',', '')),
                'airport_tax_total': int(request.POST['airport_tax_total'].replace(',', '')),
                'tipping_guide_amount': int(request.POST['tipping_guide_amount'].replace(',', '')),
                'tipping_guide_total': int(request.POST['tipping_guide_total'].replace(',', '')),
                'tipping_tour_leader_amount': int(request.POST['tipping_tour_leader_amount'].replace(',', '')),
                'tipping_tour_leader_total': int(request.POST['tipping_tour_leader_total'].replace(',', '')),
                'additional_charge_amount': int(request.POST['additional_charge_amount'].replace(',', '')),
                'additional_charge_total': int(request.POST['additional_charge_total'].replace(',', '')),
                'total_itinerary_price': int(request.POST['grand_total_hidden']),
                'discount_total_itinerary_price': int(request.POST['discount_total_hidden']),
                'sub_total_itinerary_price': int(request.POST['sub_total_hidden']),
                'commission_total': int(request.POST['commission_total'])
            },
            'total_itinerary_price': int(request.POST['grand_total_hidden']),
        }
        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_passenger_templates.html', values)
    else:
        return index(request)

def review(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_review_templates.html', values)
    else:
        return index(request)

def booking(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_booking_templates.html', values)
    else:
        return index(request)

