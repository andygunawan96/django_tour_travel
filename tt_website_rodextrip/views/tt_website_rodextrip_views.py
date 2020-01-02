from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice_views import *
import logging
import traceback
from tools import path_util
from django.utils import translation
import json
import base64

from datetime import *

MODEL_NAME = 'tt_website_rodextrip'
# _dest_env = TtDestinations()


# Create your views here.
def index(request):
    try:
        template, logo, color, name, desc, background = get_logo_template()
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']

        if request.POST['logout']:
            request.session.delete()
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'logo': logo,
                'template': template
            }
    except:
        try:
            if 'login' not in request.session['user_account']['co_agent_frontend_security']:
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'static_path_url_server': get_url_static_path(),
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'template': template
                }
            elif bool(request.session._session):
                #get_data_awal
                try:
                    javascript_version = get_javascript_version()
                    cache_version = get_cache_version()
                    response = get_cache_data(cache_version)
                    provider_type = request.session['provider']
                    request.session.create()

                    try:
                        airline_country = response['result']['response']['airline']['country']
                    except Exception as e:
                        airline_country = []
                        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())

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
                    try:
                        activity_sub_categories = response['result']['response']['activity']['sub_categories']
                    except Exception as e:
                        activity_sub_categories = []
                        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                    try:
                        activity_categories = response['result']['response']['activity']['categories']
                    except Exception as e:
                        activity_categories = []
                        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                    try:
                        activity_types = response['result']['response']['activity']['types']
                    except Exception as e:
                        activity_types = []
                        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                    try:
                        activity_countries = response['result']['response']['activity']['countries']
                    except Exception as e:
                        activity_countries = []
                        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                    # activity

                    # tour
                    try:
                        tour_countries = response['result']['response']['tour']['countries']
                    except Exception as e:
                        tour_countries = []
                        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                    # tour

                    #get_data_awal
                    cache = {}
                    try:
                        cache['airline'] = {
                                'origin': request.session['airline_request']['origin'][0],
                                'destination': request.session['airline_request']['destination'][0],
                                'departure': request.session['airline_request']['departure'][0],
                            }
                    except:
                        pass

                    try:
                        cache['train'] = {
                                'origin': request.session['train_request']['origin'][0],
                                'destination': request.session['train_request']['destination'][0],
                                'departure': request.session['train_request']['departure'][0],
                            }
                    except:
                        pass

                    try:
                        cache['hotel'] = {
                                'checkin': request.session['hotel_request']['checkin_date'],
                                'checkout': request.session['hotel_request']['checkout_date']
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
                        cache['tour'] = {
                                'name': request.session['tour_request']['tour_query']
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
                        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                        'provider': provider_type,
                        'countries': airline_country,
                        # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                        'username': request.session['user_account'],
                        # 'co_uid': request.session['co_uid'],
                        'airline_cabin_class_list': airline_cabin_class_list,
                        'logo': logo,
                        'template': template,
                        'desc': desc.split('\n'),
                        'name': name,
                        'background': background,
                        #activity
                        'activity_sub_categories': activity_sub_categories,
                        'activity_categories': activity_categories,
                        'activity_types': activity_types,
                        'activity_countries': activity_countries,
                        #tour
                        'tour_countries': tour_countries,
                        'javascript_version': javascript_version,
                        'update_data': 'false',
                        'static_path_url_server': get_url_static_path(),
                        'signature': request.session['signature'],
                        'color': color
                    }
                    return render(request, MODEL_NAME + '/home_templates.html', values)
                except:
                    values = {
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'javascript_version': javascript_version,
                        'logo': logo,
                        'static_path_url_server': get_url_static_path(),
                        'template': template
                    }
            else:
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'static_path_url_server': get_url_static_path(),
                    'template': template
                }
        except:
            if request.session.get('user_account'):
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'static_path_url_server': get_url_static_path(),
                    'template': template,
                    'username': request.session.get('user_account') or '',
                }
            else:
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'logo': logo,
                    'static_path_url_server': get_url_static_path(),
                    'template': template,
                }
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

    return no_session_logout(request)

def no_session_logout(request):
    try:
        request.session.delete()
    except:
        pass
    return redirect('/')

def goto_dashboard():
    return redirect('/dashboard')

def testing(request):
    values = {
        'static_path_url_server': get_url_static_path(),
        'static_path': path_util.get_static_path(MODEL_NAME),
    }
    return render(request, MODEL_NAME+'/testing.html', values)

def login(request):
    javascript_version = get_javascript_version()
    template, logo, color, name, desc, background = get_logo_template('login')

    try:
        if request.POST['logout'] == 'true':
            try:
                request.session.delete()
            except:
                pass
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'logo': logo,
                'template': template,
                'color': color,
                'desc': desc.split('\n'),
                'name': name,
                'background': background
            }
            # return goto_dashboard()
            return render(request, MODEL_NAME+'/login_templates.html', values)
    except:
        # if 'session' in request:
        try:
            if 'login' in request.session['user_account']['co_agent_frontend_security']:
                javascript_version = get_javascript_version()
                cache_version = get_cache_version()
                response = get_cache_data(cache_version)
                return goto_dashboard()
        except:
            request.session.delete()
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'logo': logo,
                'template': template,
                'color': color,
                'desc': desc.split('\n'),
                'name': name,
                'background': background
            }
            # return goto_dashboard()
            return render(request, MODEL_NAME+'/login_templates.html', values)

def admin(request):
    if 'user_account' in request.session._session:
        if 'admin' in request.session['user_account']['co_agent_frontend_security']:
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
                        file = open(var_log_path()+"data_cache_template.txt", "r")
                        for idx, line in enumerate(file):
                            if idx == 0:
                                text = line + '\n'
                        file.close()
                except:
                    try:
                        file = open(var_log_path()+"data_cache_template.txt", "r")
                        for idx, line in enumerate(file):
                            if idx == 0:
                                text = line
                                break
                        file.close()
                    except:
                        text += '\n'
                        pass
                # logo template color name desc backgroundhome backgroundlogin
                text += request.POST['template'] + '\n'
                text += "#" + request.POST['color_pick'] + '\n'
                text += request.POST['website_name'] + '\n'
                text += '<br>'.join(''.join(request.POST['website_description'].split('\r')).split('\n')) + '\n'
                try:
                    if request.FILES['fileBackgroundHome'].content_type == 'image/jpeg' or request.FILES['fileBackgroundHome'].content_type == 'image/png' or request.FILES['fileBackgroundHome'].content_type == 'image/png':
                        text += 'data:'
                        text += request.FILES['fileBackgroundHome'].content_type
                        text += ';base64, '
                        text += base64.b64encode(request.FILES['fileBackgroundHome'].read()).decode("utf-8")
                        text += '\n'
                except:
                    check = 0
                    file = open(var_log_path() + "data_cache_template.txt", "r")
                    for idx, line in enumerate(file):
                        if idx == 5:
                            text += line
                            check = 1
                            break
                    file.close()
                    if check == 0:
                        text += '\n'
                try:
                    if request.FILES['fileBackgroundLogin'].content_type == 'image/jpeg' or request.FILES['fileBackgroundLogin'].content_type == 'image/png' or request.FILES['fileBackgroundLogin'].content_type == 'image/png':
                        text += 'data:'
                        text += request.FILES['fileBackgroundLogin'].content_type
                        text += ';base64, '
                        text += base64.b64encode(request.FILES['fileBackgroundLogin'].read()).decode("utf-8")
                        text += '\n'
                except:
                    check = 0
                    file = open(var_log_path() + "data_cache_template.txt", "r")
                    for idx, line in enumerate(file):
                        if idx == 6:
                            text += line
                            check = 1
                            break
                    file.close()
                    if check == 0:
                        text += '\n'

                try:
                    if request.FILES['fileBackgroundSearch'].content_type == 'image/jpeg' or request.FILES['fileBackgroundSearch'].content_type == 'image/png' or request.FILES['fileBackgroundSearch'].content_type == 'image/png':
                        text += 'data:'
                        text += request.FILES['fileBackgroundSearch'].content_type
                        text += ';base64, '
                        text += base64.b64encode(request.FILES['fileBackgroundSearch'].read()).decode("utf-8")
                except:
                    check = 0
                    file = open(var_log_path() + "data_cache_template.txt", "r")
                    for idx, line in enumerate(file):
                        if idx == 7:
                            text += line
                            check = 1
                            break
                    file.close()
                    if check == 0:
                        text += '\n'
                file = open(var_log_path()+'data_cache_template.txt', "w+")
                file.write(text)
                file.close()
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']

            template, logo, color, name, desc, background = get_logo_template()
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'logo': logo,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'template': template,
                'signature': request.session['signature'],
                'color': color,
                'desc': desc.split('\n'),
                'name': name,
                'background': background
            }
            return render(request, MODEL_NAME+'/backend/admin_templates.html', values)
        else:
            return no_session_logout(request)
    else:
        return no_session_logout(request)

def reservation(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']

        file = open(var_log_path()+"get_airline_active_carriers.txt", "r")
        for line in file:
            airline_carriers = json.loads(line)
        file.close()

        template, logo, color, name, desc, background = get_logo_template()

        new_airline_carriers = {}
        for key, value in airline_carriers.items():
            new_airline_carriers[key] = value

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_carriers': new_airline_carriers,
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template,
            'color': color,
            'desc': desc.split('\n'),
            'name': name,
            'background': background
        }
        return render(request, MODEL_NAME+'/backend/reservation_templates.html', values)
    else:
        return no_session_logout(request)

def top_up(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']
        template, logo, color, name, desc, background = get_logo_template()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template,
            'color': color,
            'desc': desc.split('\n'),
            'name': name,
            'background': background
        }
        return render(request, MODEL_NAME+'/backend/top_up_templates.html', values)
    else:
        return no_session_logout(request)

def top_up_history(request):
    if 'user_account' in request.session._session:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']

        template, logo, color, name, desc, background = get_logo_template()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account'],
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template,
            'color': color,
            'desc': desc.split('\n'),
            'name': name,
            'background': background
        }
        return render(request, MODEL_NAME+'/backend/top_up_history_templates.html', values)
    else:
        return no_session_logout(request)

def get_javascript_version():
    file = open(var_log_path()+"javascript_version.txt", "r")
    javascript_version = int(file.read())
    file.close()
    return javascript_version

def get_cache_version():
    file = open(var_log_path()+"cache_version.txt", "r")
    cache_version = int(file.read())
    file.close()
    return cache_version

def get_cache_data(javascript_version):
    file = open(var_log_path()+"version" + str(javascript_version) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()
    return response

def get_logo_template(type='home'):
    template = 1
    logo = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
    background = '/static/tt_website_rodextrip/images/bg_7.jpg'
    color = '#f15a22'
    website_name = 'Rodextrip'
    website_description = '''RODEXTRIP is a travel online reservation system owned by PT. Roda Express Sukses Mandiri, based in Indonesia, for its registered agent. RODEXTRIP provide some products such as airline, train, themes park tickets, and many more.

We build this application for our existing partner and public users who register themselves on our application. After registration, users need to wait for verification / approval by our Head Office. We build our application for approved users, so that's why public user can't use our application.'''
    try:
        file = open(var_log_path()+"data_cache_template.txt", "r")
        for idx, line in enumerate(file):
            if idx == 0:
                if line == '\n':
                    logo = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
                else:
                    logo = line
            elif idx == 1:
                template = int(line)
            elif idx == 2:
                color = line
            elif idx == 3:
                website_name = line
            elif idx == 4:
                website_description = '\n'.join(line.split('<br>'))
            elif idx == 5 and type == 'home':
                background = line
            elif idx == 6 and type == 'login':
                background = line
            elif idx == 7 and type == 'search':
                background = line
        if color == '':
            color = '#f15a22'
        file.close()
        background = background.split('\n')[0]
    except:
        pass
    return template, logo, color, website_name, website_description, background

# @api_view(['GET'])
# def testing(request):
#     return Response(_dest_env.test())
#
#
# @api_view(['GET'])
# @permission_classes((IsAuthenticated, ))
# def testing2(request):
#     return Response(_dest_env.test_2())
