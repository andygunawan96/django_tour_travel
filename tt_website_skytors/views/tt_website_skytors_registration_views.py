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

        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        values = {
            'countries': response['result']['response']['activity_config']['countries'],
            'static_path': path_util.get_static_path(MODEL_NAME),
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'username': request.session['user_account'],
            'social_medias': response['result']['response']['issued_offline']['social_media_id'],
            # 'username': request.session['username'],
            # 'co_uid': request.session['co_uid'],
        }
    except:
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'javascript_version': javascript_version
        }
    return render(request, MODEL_NAME + '/agent_registration/tt_website_skytors_registration_form_template.html', values)


def register_agent(request):
    regis_doc = []
    pic = []
    check = True
    counter = 1
    file = open("javascript_version.txt", "r")
    for line in file:
        javascript_version = json.loads(line)
    file.close()
    #pic
    while(check):
        try:
            pic.append({
                'birth_date': request.POST['birth_date'+str(counter)] and request.POST['birth_date'+str(counter)] or '',
                'first_name': request.POST['first_name'+str(counter)] and request.POST['first_name'+str(counter)] or '',
                'last_name': request.POST['last_name'+str(counter)] and request.POST['last_name'+str(counter)] or '',
                'email': request.POST['email'+str(counter)] and request.POST['email'+str(counter)] or '',
                'phone': request.POST['phone'+str(counter)] and request.POST['phone'+str(counter)] or '',
                'mobile': request.POST['mobile'+str(counter)] and request.POST['mobile'+str(counter)] or '',
            })
        except:
            check = False
        counter = counter + 1
    #regis
    check = True
    counter = 1
    while (check):
        try:
            regis_doc.append({
                'data': base64.b64encode(request.FILES['Resume'+str(counter)].read()).decode("utf-8"),
                'content_type': request.FILES['Resume'+str(counter)].content_type,
                'type': request.POST['type_regis_doc'+str(counter)] and request.POST['type_regis_doc'+str(counter)] or '',
            })
        except:
            check = False
        counter = counter + 1

    request.session['registration_request'] = {
        'company': {
            'company_type': request.POST['radio_company_type'],
            'business_license': request.POST.get('business_license') and request.POST['business_license'] or '',
            'npwp': request.POST.get('npwp') and request.POST['npwp'] or '',
            'name': request.POST['comp_name'] and request.POST['comp_name'] or '',
        },
        'address': {
            # 'city': request.POST['city'] and request.POST['city_id'] or '',
            'city': 1,
            'zip': request.POST['zip'] and request.POST['zip'] or '',
            'address': request.POST['street'] and request.POST['street'] or '',
            'address2': request.POST['street2'] and request.POST['street2'] or '',
        },

        'pic': pic,
        'regis_doc': regis_doc,
        'other': {
            'social_media': request.POST['social_media'] and request.POST['social_media'] or '',
            'agent_type': request.POST['agent_type'] and request.POST['agent_type'] or '',
        },
        'provider': 'skytors_agent_registration'
    }

    values = {
        'username': request.session['user_account'],
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version
    }
    return render(request, MODEL_NAME + '/agent_registration/tt_website_skytors_registration_finish_template.html', values)


