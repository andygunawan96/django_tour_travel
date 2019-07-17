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
import base64
from io import BytesIO
from datetime import *
from tt_webservice.views.tt_webservice_registration_views import *
from .tt_website_skytors_views import *


MODEL_NAME = 'tt_website_skytors'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']


def open_page(request):
    try:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        countries = response['result']['response']['activity']['countries']

        values = {
            'countries': countries,
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'co_uid': request.session['co_uid'],
        }
    except:
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
        }
    return render(request, MODEL_NAME + '/agent_registration/tt_website_skytors_registration_form_template.html', values)


def register_agent(request):
    request.session['registration_request'] = {
        'comp_name': request.POST['comp_name'] and request.POST['comp_name'] or '',
        'birth_date': request.POST['birth_date'] and request.POST['birth_date'] or '',
        'name': request.POST['person_name'] and request.POST['person_name'] or '',
        'email': request.POST['email'] and request.POST['email'] or '',
        'socmed_id': request.POST['socmed_id'] and request.POST['socmed_id'] or 0,
        'agent_type': request.POST['agent_type'] and request.POST['agent_type'] or 0,
        'city_id': request.POST['city_id'] and request.POST['city_id'] or 0,
        'phone': request.POST['phone'] and request.POST['phone'] or '',
        'mobile': request.POST['mobile'] and request.POST['mobile'] or '',
        'street': request.POST['street'] and request.POST['street'] or '',
        'street2': request.POST['street2'] and request.POST['street2'] or '',
        'zip': request.POST['zip'] and request.POST['zip'] or '',
    }

    values = {
        'username': request.session['username'],
        'co_uid': request.session['co_uid'],
        'comp_name': request.session['registration_request']['comp_name'],
        'birth_date': request.session['registration_request']['birth_date'],
        'name': request.session['registration_request']['name'],
        'email': request.session['registration_request']['email'],
        'socmed_id': 1,
        'agent_type': request.session['registration_request']['agent_type'],
        'city_id': 269,
        'phone': request.session['registration_request']['phone'],
        'mobile': request.session['registration_request']['mobile'],
        'street': request.session['registration_request']['street'],
        'street2': request.session['registration_request']['street2'],
        'zip': request.session['registration_request']['zip'],
        'static_path': path_util.get_static_path(MODEL_NAME),
    }
    return render(request, MODEL_NAME + '/agent_registration/tt_website_skytors_registration_finish_template.html', values)


