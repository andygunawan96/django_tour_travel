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
from tt_webservice.views.tt_webservice import *
from .tt_website_views import *
from tools.parser import *
import base64
_logger = logging.getLogger("website_logger")

MODEL_NAME = 'tt_website'

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

def group_booking(request):
    if 'user_account' in request.session._session and 'b2c_limitation' not in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)

            values = get_data_template(request)
            try:
                file = read_cache("airline_destination", 'cache_web', request, 90911)
                if file:
                    airline_destinations = file
            except Exception as e:
                _logger.error('ERROR get_destination airline file\n' + str(e) + '\n' + traceback.format_exc())
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
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'adult_title': ['MR', 'MRS', 'MS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'static_path_url_server': get_url_static_path(),
                # 'agent': request.session['agent'],
                'airline_destinations': airline_destinations,
                'airline_cabin_class_list': airline_cabin_class_list,
                # 'train_destination': train_destination,
                'username': request.session['user_account'],
                'signature': request.session['signature'],
                'javascript_version': javascript_version,
                'big_banner_value': check_banner('groupbooking', 'big_banner', request),
                'small_banner_value': check_banner('groupbooking', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/group_booking/group_booking_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Group Booking get booking without login in btb web')
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            set_session(request, 'group_booking_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                set_session(request, 'group_booking_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
            except:
                set_session(request, 'group_booking_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': request.session['group_booking_order_number'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'adult_title': ['', 'MR', 'MRS', 'MS'],
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/group_booking/group_booking_get_booking_templates.html', values)
