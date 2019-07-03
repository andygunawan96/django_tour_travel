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

def issued_offline(request):
    if 'user_account' in request.session._session:

        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        airline_destinations = []
        for country in response['result']['response']['airline']['destination']:
            for des in response['result']['response']['airline']['destination'][country]:
                des.update({
                    'country': country
                })
                airline_destinations.append(des)

        train_destination = response['result']['response']['train']

        # get_balance(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'issued_offline_data': response['result']['response']['issued_offline'],
            # 'agent': request.session['agent'],
            'airline_destinations': airline_destinations,
            'train_destination': train_destination,
            'username': request.session['user_account'],
            # 'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/issued_offline/tt_website_skytors_issued_offline_templates.html', values)
    else:
        return index(request)

def issued_offline_history(request):
    if 'user_account' in request.session._session:
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
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['user_account'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        }
        return render(request, MODEL_NAME+'/issued_offline/tt_website_skytors_issued_offline_history_templates.html', values)
    else:
        return index(request)
