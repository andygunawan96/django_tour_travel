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

def issued_offline(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)

            values = get_data_template(request)

            file = open(var_log_path()+"airline_destination.txt", "r")
            for line in file:
                airline_destinations = json.loads(line)
            file.close()

            # train_destination = response['result']['response']['train']

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            # get_balance(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'issued_offline_data': response['result']['response']['issued_offline'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'adult_title': ['MR', 'MRS', 'MS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'static_path_url_server': get_url_static_path(),
                # 'agent': request.session['agent'],
                'airline_destinations': airline_destinations,
                # 'train_destination': train_destination,
                'username': request.session['user_account'],
                'signature': request.session['signature'],
                'javascript_version': javascript_version,
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/issued_offline/issued_offline_templates.html', values)
    else:
        return no_session_logout(request)

def issued_offline_history(request):
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

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/issued_offline/issued_offline_history_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            values = get_data_template(request)
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            try:
                order_number = request.POST['order_number']
                request.session['issued_offline_order_number'] = request.POST['order_number']
            except:
                order_number = request.session['issued_offline_order_number']
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'username': request.session['user_account'],
                'order_number': order_number,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/issued_offline/issued_offline_booking_templates.html', values)
    else:
        return no_session_logout(request)
