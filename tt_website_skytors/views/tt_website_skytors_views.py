from django.shortcuts import render, redirect
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

MODEL_NAME = 'tt_website_skytors'
# _dest_env = TtDestinations()


# Create your views here.
def index(request):
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
        if request.POST['logout']:
            request.session.delete()
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                'javascript_version': javascript_version,
                'logo': logo,
                'template': template
            }
    except:
        try:
            if 'login' not in request.session['user_account']['co_agent_frontend_security']:
                request.session.delete()
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'template': template
                }
            elif bool(request.session._session):
                request.session.create()

                #get_data_awal
                try:
                    file = open("javascript_version.txt", "r")
                    for line in file:
                        file_cache_name = line
                    file.close()

                    file = open('version' + str(file_cache_name) + ".txt", "r")
                    for line in file:
                        response = json.loads(line)
                    file.close()

                    # agent
                    adult_title = ['MR', 'MRS', 'MS']

                    infant_title = ['MSTR', 'MISS']

                    id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

                    # agent


                    airline_country = response['result']['response']['airline']['country']

                    # airline_carriers = response['result']['response']['airline']['carriers']

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
                    # airline

                    # activity
                    # activity_sub_categories = response['result']['response']['activity']['sub_categories']
                    # activity_categories = response['result']['response']['activity']['categories']
                    # activity_types = response['result']['response']['activity']['types']
                    # activity_countries = response['result']['response']['activity']['countries']
                    # activity

                    # issuedoffline
                    # issued_offline_transaction_type = response['result']['response']['issued_offline']['transaction_type']
                    # issued_offline_sector_type = response['result']['response']['issued_offline']['sector_type']
                    # issued_offline_carrier_id = response['result']['response']['issued_offline']['carrier_id']
                    # issued_offline_social_media_id = response['result']['response']['issued_offline']['social_media_id']

                    # issuedoffline

                    #get_data_awal
                    cache = {}
                    try:
                        cache['airline'] = {
                                'origin': request.session['airline_request']['origin'],
                                'destination': request.session['airline_request']['destination'],
                                'departure': request.session['airline_request']['departure'][0],
                            }
                    except:
                        pass

                    try:
                        cache['train'] = {
                                'origin': request.session['train_request']['origin'],
                                'destination': request.session['train_request']['destination'],
                                'departure': request.session['train_request']['departure'],
                            }
                    except:
                        pass

                    try:
                        cache['hotel'] = {
                                'checkin': request.session['hotel_request']['check_in'],
                                'checkout': request.session['hotel_request']['check_out']
                            }
                    except:
                        pass

                    try:
                        cache['activity'] = {
                                'name': request.session['activity_request']['query']
                            }
                    except:
                        pass

                    try:
                        cache['visa'] = {
                                'destination': request.session['visa_request']['destination'],
                                'departure_date': request.session['visa_request']['departure_date'],
                                'consulate': request.session['visa_request']['consulate']
                            }
                    except:
                        pass
                    values = {
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'cache': json.dumps(cache),
                        # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                        'username': request.session['user_account'],
                        # 'co_uid': request.session['co_uid'],
                        'airline_cabin_class_list': airline_cabin_class_list,
                        'airline_country': airline_country,
                        'logo': logo,
                        'template': template,
                        # 'activity_sub_categories': activity_sub_categories,
                        # 'activity_categories': activity_categories,
                        # 'activity_types': activity_types,
                        # 'activity_countries': activity_countries,
                        #hotel
                        # 'issued_offline_transaction_type': issued_offline_transaction_type,
                        # 'issued_offline_sector_type': issued_offline_sector_type,
                        # 'issued_offline_carrier_id': issued_offline_carrier_id,
                        # 'issued_offline_social_media_id': issued_offline_social_media_id,
                        'javascript_version': javascript_version,
                        'update_data': 'false',
                        'signature': request.session['signature']
                    }
                except:
                    values = {
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'javascript_version': javascript_version,
                        'logo': logo,
                        'template': template
                    }
                    return render(request, MODEL_NAME + '/tt_website_skytors_home_templates.html', values)
            else:
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'template': template
                }
        except:
            if request.session.get('user_account'):
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'template': template,
                    'username': request.session.get('user_account') or '',
                }
            else:
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'template': template,
                }
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

    return render(request, MODEL_NAME+'/tt_website_skytors_home_templates.html', values)

def no_session_logout():
    return redirect('/')

def login(request):
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

    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'logo': logo,
        'template': template,
    }
    return render(request, MODEL_NAME+'/tt_website_skytors_login_templates.html', values)

def admin(request):
    if 'user_account' in request.session._session:
        if request.session['user_account']['co_agent_type_name'] == 'HO':
            #save
            if request.POST != {}:
                text = ''
                try:
                    if request.FILES['fileToUpload'].content_type == 'image/jpeg' or request.FILES['fileToUpload'].content_type == 'image/png' or request.FILES['fileToUpload'].content_type == 'image/png':
                        text += 'data:'
                        text += request.FILES['fileToUpload'].content_type
                        text += ';base64, '
                        text += base64.b64encode(request.FILES['fileToUpload'].read()).decode("utf-8")
                        text += '\n'
                    else:
                        file = open("data_cache_template.txt", "r")
                        for idx, line in enumerate(file):
                            if idx == 0:
                                text = line
                        file.close()
                except:
                    file = open("data_cache_template.txt", "r")
                    for idx, line in enumerate(file):
                        if idx == 0:
                            text = line
                    file.close()

                text += request.POST['template']
                file = open('data_cache_template.txt', "w+")
                file.write(text)
                file.close()
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
                file = open('data_cache_template.txt', "w+")
                file.write(logo+'\n'+str(template))
                file.close()
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'logo': logo,
                'javascript_version': javascript_version,
                'template': template,
                'signature': request.session['signature']
            }
            return render(request, MODEL_NAME+'/backend/tt_website_skytors_admin_templates.html', values)
        else:
            return no_session_logout()
    else:
        return no_session_logout()

def reservation(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()

        file = open("get_airline_active_carriers.txt", "r")
        for line in file:
            airline_carriers = json.loads(line)
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

        new_airline_carriers = {}
        for key, value in airline_carriers.items():
            new_airline_carriers[key] = value

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_carriers': new_airline_carriers,
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/backend/tt_website_skytors_reservation_templates.html', values)
    else:
        return no_session_logout()

def top_up(request):
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

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/backend/tt_website_skytors_top_up_templates.html', values)
    else:
        return no_session_logout()

def top_up_payment(request):
    if 'user_account' in request.session._session:
        try:
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

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                'top_up_request': {
                    'amount': request.POST['amount'],
                    'unique_amount': request.POST['unique_amount'],
                    'total_amount': request.POST['total_amount'],
                    'payment_method': request.POST['payment_method'],
                },
                'javascript_version': javascript_version,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'signature': request.session['signature'],
                'logo': logo,
                'template': template
            }
            return render(request, MODEL_NAME+'/backend/tt_website_skytors_top_up_payment_templates.html', values)
        except:
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                'javascript_version': javascript_version,
                'logo': logo,
                'template': template
            }
            return render(request, MODEL_NAME + '/backend/tt_website_skytors_top_up_templates.html', values)
    else:
        return no_session_logout()

def top_up_history(request):
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

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/backend/tt_website_skytors_top_up_history_templates.html', values)
    else:
        return no_session_logout()



# @api_view(['GET'])
# def testing(request):
#     return Response(_dest_env.test())
#
#
# @api_view(['GET'])
# @permission_classes((IsAuthenticated, ))
# def testing2(request):
#     return Response(_dest_env.test_2())
