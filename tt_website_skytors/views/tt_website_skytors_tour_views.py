from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
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
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        }
        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_detail_templates.html', values)
    else:
        return index(request)

def passenger(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

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

