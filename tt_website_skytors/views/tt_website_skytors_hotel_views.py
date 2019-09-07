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

def search(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()

        file = open("javascript_version.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open('version' + str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        try:
            file = open("data_cache_template.txt", "r")
            for idx, line in enumerate(file):
                if idx == 0:
                    if line == '\n':
                        logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'
                    else:
                        logo = line
                elif idx == 1:
                    template = int(line)
            file.close()
        except:
            template = 1
            logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        try:
            child_age = []
            for i in range(int(request.POST['hotel_child'])):
                child_age.append(int(request.POST['hotel_child_age' + str(i + 1)]))
            request.session['hotel_request'] = {
                'destination': request.POST['hotel_id_destination'],
                'guest_nationality': request.POST['hotel_id_nationality'],
                'business_trip': request.POST['business_trip'],
                'checkin_date': request.POST['hotel_checkin'],
                'checkout_date': request.POST['hotel_checkout'],
                'room': int(request.POST['hotel_room']),
                'adult': int(request.POST['hotel_adult']),
                'child': int(request.POST['hotel_child']),
                'child_age': child_age
            }
        except:
            print('error')

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'countries': response['result']['response']['airline']['country'],
            # 'hotel_config': response['result']['response']['hotel_config'],
            'hotel_search': request.session['hotel_request'],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'logo': logo,
            'template': template
            # 'cookies': json.dumps(res['result']['cookies']),

        }
        return render(request, MODEL_NAME+'/hotel/tt_website_skytors_hotel_search_templates.html', values)
    else:
        return no_session_logout()

def detail(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()

        try:
            file = open("data_cache_template.txt", "r")
            for idx, line in enumerate(file):
                if idx == 0:
                    if line == '\n':
                        logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'
                    else:
                        logo = line
                elif idx == 1:
                    template = int(line)
            file.close()
        except:
            template = 1
            logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'

        try:
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            request.session['hotel_detail'] = json.loads(request.POST['hotel_detail'])
        except:
            pass
        data = request.session['hotel_request']
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'hotel_search': data,
            'check_in': data['checkin_date'],
            'check_out': data['checkout_date'],
            'response': request.session['hotel_detail'],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'logo': logo,
            'template': template
        }

        return render(request, MODEL_NAME+'/hotel/tt_website_skytors_hotel_detail_templates.html', values)
    else:
        return no_session_logout()

def passengers(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()

        file = open("javascript_version.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open('version' + str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        try:
            file = open("data_cache_template.txt", "r")
            for idx, line in enumerate(file):
                if idx == 0:
                    if line == '\n':
                        logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'
                    else:
                        logo = line
                elif idx == 1:
                    template = int(line)
            file.close()
        except:
            template = 1
            logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        # agent
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        airline_country = response['result']['response']['airline']['country']

        # pax
        adult = []
        child = []
        for i in range(int(request.session['hotel_request']['person'])):
            adult.append('')
        for i in range(int(request.session['hotel_request']['child'])):
            child.append()
        request.session['hotel_request'].update({
            'check_in': str(datetime.strptime(request.POST['hotel_checkin'], '%d %b %Y'))[:10],
            'check_out': str(datetime.strptime(request.POST['hotel_checkout'], '%d %b %Y'))[:10]

        })
        request.session['hotel_room_pick'] = json.loads(request.POST['hotel_detail_send'])
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'countries': airline_country,
            'hotel_search': request.session['hotel_request'],
            'response': request.session['hotel_detail'],
            'hotel_room_detail_pick': request.session['hotel_room_pick'],
            'username': request.session['username'],
            'childs': child,
            'adults': adult,
            'adult_count': int(request.session['hotel_request']['person']),
            'child_count': int(request.session['hotel_request']['child']),
            'adult_title': adult_title,
            'infant_title': infant_title,
            'javascript_version': javascript_version,
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/hotel/tt_website_skytors_hotel_passenger_templates.html', values)
    else:
        return no_session_logout()

def review(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()

        file = open("javascript_version.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open('version' + str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        try:
            file = open("data_cache_template.txt", "r")
            for idx, line in enumerate(file):
                if idx == 0:
                    if line == '\n':
                        logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'
                    else:
                        logo = line
                elif idx == 1:
                    template = int(line)
            file.close()
        except:
            template = 1
            logo = '/static/tt_website_skytors/images/icon/LOGO_RODEXTRIP.png'

        adult = []
        child = []
        booker = {
            'address': request.session['company_details']['address'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'title': request.POST['booker_title'],
            'email': request.POST['booker_email'],
            'nationality_code': request.POST['booker_nationality'],
            'country_code': request.POST['booker_nationality'],
            'work_phone': request.POST['booker_phone_code'] + request.POST['booker_phone'],
            "mobile": "0" + request.POST['booker_phone'],
            'contact_id': request.POST.get('booker_id') and int(request.POST.get('booker_id')) or ''
        }
        # "city": this.state.city_agent,
        # "province_state": this.state.state_agent,
        # "contact_id": "",

        for i in range(int(request.session['hotel_request']['person'])):
            adult.append({
                "first_name": request.POST['adult_first_name' + str(i + 1)],
                "last_name": request.POST['adult_last_name' + str(i + 1)],
                "nationality_code": request.POST['adult_nationality' + str(i + 1)],
                "title": request.POST['adult_title' + str(i + 1)],
                "room_number": "1",
                "pax_type": "ADT",
                "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                "passenger_id": request.POST.get('adult_id') and int(request.POST['adult_id' + str(i + 1)]) or ''
            })
        for i in range(int(request.session['hotel_request']['child'])):
            child.append({
                "first_name": request.POST['child_first_name' + str(i + 1)],
                "last_name": request.POST['child_last_name' + str(i + 1)],
                "nationality_code": request.POST['child_nationality' + str(i + 1)],
                "title": request.POST['child_title' + str(i + 1)],
                "pax_type": "CHD",
                "birth_date": request.POST['child_birth_date' + str(i + 1)],
                "room_number": "1",
                "passenger_id": request.POST.get('child_id') and int(request.POST['child_id' + str(i + 1)]) or ''
            })

        request.session['hotel_review_pax'] = {
            'booker': booker,
            'adult': adult,
            'child': child,
        }

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'booker': booker,
            'adults': adult,
            'childs': child,
            'hotel_search': request.session['hotel_request'],
            'response': request.session['hotel_detail'],
            'hotel_room_detail_pick': request.session['hotel_room_pick'],
            'adult_count': int(request.session['hotel_request']['person']),
            'infant_count': int(request.session['hotel_request']['child']),
            'username': request.session['username'],
            'javascript_version': javascript_version,
            'logo': logo,
            'template': template
            # 'cookies': json.dumps(res['result']['cookies']),

        }
        return render(request, MODEL_NAME + '/hotel/tt_website_skytors_hotel_review_templates.html', values)
    else:
        return no_session_logout()