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
import json
from datetime import *

MODEL_NAME = 'tt_website_skytors'
# _dest_env = TtDestinations()


# Create your views here.

def search(request):

    visa_request = {
        'destination': request.POST['visa_destination_id'],
        'departure': request.POST['visa_departure'],
        'consulate': request.POST['visa_consulate_id'],
    }

    request.session['visa_request'] = visa_request

    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME),
        'visa_request': visa_request,
        # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        'username': request.session['username']
    }
    return render(request, MODEL_NAME+'/visa/tt_website_skytors_visa_search_templates.html', values)