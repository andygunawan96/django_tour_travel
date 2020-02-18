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
from django.core.files.storage import FileSystemStorage
import os
from tools.parser import *
from datetime import *
import copy

MODEL_NAME = 'tt_website_rodextrip'
# _dest_env = TtDestinations()


# Create your views here.
def index(request):
    try:
        values = get_data_template(request)
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        if request.POST.get('logout'):
            request.session.delete()
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
            })
        else:
            try:
                if 'login' not in request.session['user_account']['co_agent_frontend_security']:
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                        'countries': airline_country,
                        'phone_code': phone_code,
                        'static_path_url_server': get_url_static_path(),
                        'javascript_version': javascript_version,
                    })
                elif bool(request.session._session):
                    #get_data_awal
                    try:
                        provider_type = request.session['provider']
                        request.session.create()

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
                        try:
                            if 'hotel_error' in request.session._session:
                                del request.session['hotel_error']
                        except:
                            pass

                        #get_data_awal
                        cache = {}
                        try:
                            cache['airline'] = {
                                    'origin': request.session['airline_request']['origin'][0],
                                    'destination': request.session['airline_request']['destination'][0],
                                    'departure': request.session['airline_request']['departure'][0],
                                }
                            if cache['airline']['departure'] == 'Invalid date':
                                cache['airline']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
                        except:
                            pass

                        try:
                            cache['train'] = {
                                    'origin': request.session['train_request']['origin'][0],
                                    'destination': request.session['train_request']['destination'][0],
                                    'departure': request.session['train_request']['departure'][0],
                                }
                            if cache['train']['departure'] == 'Invalid date':
                                cache['train']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
                        except:
                            pass

                        try:
                            cache['hotel'] = {
                                    'checkin': request.session['hotel_request']['checkin_date'],
                                    'checkout': request.session['hotel_request']['checkout_date']
                                }
                            if cache['hotel']['checkin'] == 'Invalid date' or cache['hotel']['checkout'] == 'Invalid date':
                                cache['hotel']['checkin'] = convert_string_to_date_to_string_front_end(str(datetime.now() + relativedelta(days=1))[:10])
                                cache['hotel']['checkout'] = convert_string_to_date_to_string_front_end(str(datetime.now() + relativedelta(days=2))[:10])
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
                            if cache['visa']['departure_date'] == 'Invalid date':
                                cache['visa']['departure_date'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
                        except:
                            pass
                        try:
                            values.update({
                                'static_path': path_util.get_static_path(MODEL_NAME),
                                'cache': json.dumps(cache),
                                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                                'provider': provider_type,
                                'countries': airline_country,
                                'phone_code': phone_code,
                                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                                'username': request.session['user_account'],
                                # 'co_uid': request.session['co_uid'],
                                'airline_cabin_class_list': airline_cabin_class_list,
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

                            })
                        except Exception as e:
                            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                            raise Exception('Make response code 500!')
                        return render(request, MODEL_NAME + '/home_templates.html', values)
                        # return render(request, MODEL_NAME + '/testing.html', {})
                    except:
                        if request.session._session:
                            for key in reversed(list(request.session._session.keys())):
                                del request.session[key]
                            request.session.modified = True
                        values.update({
                            'static_path': path_util.get_static_path(MODEL_NAME),
                            'javascript_version': javascript_version,
                            'static_path_url_server': get_url_static_path(),
                        })
                else:
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                        'countries': airline_country,
                        'phone_code': phone_code,
                        'javascript_version': javascript_version,
                        'static_path_url_server': get_url_static_path(),
                    })
            except:
                if request.session.get('user_account'):
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'javascript_version': javascript_version,
                        'static_path_url_server': get_url_static_path(),
                        'username': request.session.get('user_account') or '',
                    })
                else:
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'javascript_version': javascript_version,
                        'static_path_url_server': get_url_static_path(),
                    })
    except:
        pass
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

    return no_session_logout(request)

def no_session_logout(request):
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
    values = get_data_template(request, 'login')
    if request.POST.get('logout') == 'true':
        try:
            if request.session._session:
                for key in reversed(list(request.session._session.keys())):
                    del request.session[key]
                request.session.modified = True
        except:
            pass
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        # return goto_dashboard()
        return render(request, MODEL_NAME+'/login_templates.html', values)
    else:
        # if 'session' in request:
        if request.session.get('user_account') and 'login' in request.session.get('user_account')['co_agent_frontend_security']:
            return goto_dashboard()
        else:
            if request.session._session:
                for key in reversed(list(request.session._session.keys())):
                    del request.session[key]
                request.session.modified = True
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser
            try:
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'javascript_version': javascript_version,
                    'static_path_url_server': get_url_static_path(),
                    'username': {'co_user_login': ''}
                })
            except Exception as e:
                logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')
            # return goto_dashboard()
            return render(request, MODEL_NAME + '/login_templates.html', values)


def admin(request):
    if 'user_account' in request.session._session:
        if 'admin' in request.session['user_account']['co_agent_frontend_security']:
            #save
            try:
                if request.POST != {}:
                    text = ''
                    fs = FileSystemStorage()
                    try:
                        if request.FILES['fileToUpload'].content_type == 'image/jpeg' or request.FILES['fileToUpload'].content_type == 'image/png' or request.FILES['fileToUpload'].content_type == 'image/png':
                            file = request.FILES['fileToUpload']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
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
                            file = request.FILES['fileBackgroundHome']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'

                    except:
                        check = 0
                        try:
                            file = open(var_log_path() + "data_cache_template.txt", "r")
                            for idx, line in enumerate(file):
                                if idx == 5:
                                    text += line
                                    check = 1
                                    break
                            file.close()
                        except:
                            pass
                        if check == 0:
                            text += '\n'
                    try:
                        if request.FILES['fileBackgroundLogin'].content_type == 'image/jpeg' or request.FILES['fileBackgroundLogin'].content_type == 'image/png' or request.FILES['fileBackgroundLogin'].content_type == 'image/png':
                            file = request.FILES['fileBackgroundLogin']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                    except:
                        check = 0
                        try:
                            file = open(var_log_path() + "data_cache_template.txt", "r")
                            for idx, line in enumerate(file):
                                if idx == 6:
                                    text += line
                                    check = 1
                                    break
                            file.close()
                        except:
                            pass
                        if check == 0:
                            text += '\n'

                    try:
                        if request.FILES['fileBackgroundSearch'].content_type == 'image/jpeg' or request.FILES['fileBackgroundSearch'].content_type == 'image/png' or request.FILES['fileBackgroundSearch'].content_type == 'image/png':
                            file = request.FILES['fileBackgroundSearch']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                    except:
                        check = 0
                        try:
                            file = open(var_log_path() + "data_cache_template.txt", "r")
                            for idx, line in enumerate(file):
                                if idx == 7:
                                    text += line
                                    check = 1
                                    break
                            file.close()
                        except:
                            pass
                        if check == 0:
                            text += '\n'
                    text += request.POST['tawk_chat'] + '\n'
                    text += request.POST['tawk_code'] + '\n'
                    text += request.POST['facebook'] + '\n'
                    text += request.POST['instagram'] + '\n'
                    text += "#" + request.POST['text_pick'] + '\n'
                    if request.POST['bg_tab_pick'] == '':
                        text += 'none'
                    else:
                        text += "#" + request.POST['bg_tab_pick'] + 'B3'
                    text += '\n'
                    try:
                        if request.FILES['filelogoicon'].content_type == 'image/jpeg' or request.FILES['filelogoicon'].content_type == 'image/png' or request.FILES['filelogoicon'].content_type == 'image/png':
                            file = request.FILES['filelogoicon']
                            filename = fs.save(file.name, file)
                            text += fs.base_url + filename + '\n'
                    except:
                        check = 0
                        try:
                            file = open(var_log_path() + "data_cache_template.txt", "r")
                            for idx, line in enumerate(file):
                                if idx == 14:
                                    text += line
                                    check = 1
                                    break
                            file.close()
                        except:
                            pass
                    file = open(var_log_path()+'data_cache_template.txt', "w+")
                    file.write(text)
                    file.close()
                    temp = text.split('\n')
                    for idx, rec in enumerate(temp):
                        try:
                            temp[idx] = rec.split('/')[len(rec.split('/'))-1]
                        except:
                            pass
                    #delete file ga pake
                    for file in os.listdir(fs.location):
                        if not file in temp:
                            os.remove(fs.location+'/'+file)
            except Exception as e:
                logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')
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
            try:
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'bg_tab_color': copy.deepcopy(values['tab_color'])[:7],
                    # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                    'username': request.session['user_account'],
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'static_path_url_server': get_url_static_path(),
                    'javascript_version': javascript_version,
                    'signature': request.session['signature'],
                })
            except Exception as e:
                logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
                raise Exception('Make response code 500!')
            return render(request, MODEL_NAME+'/backend/admin_templates.html', values)
        else:
            return no_session_logout(request)
    else:
        return no_session_logout(request)

def reservation(request):
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

            file = open(var_log_path()+"get_airline_active_carriers.txt", "r")
            for line in file:
                airline_carriers = json.loads(line)
            file.close()

            values = get_data_template(request)

            new_airline_carriers = {}
            for key, value in airline_carriers.items():
                new_airline_carriers[key] = value

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'airline_carriers': new_airline_carriers,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/reservation_templates.html', values)
    else:
        return no_session_logout(request)

def top_up(request):
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
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/backend/top_up_templates.html', values)
    else:
        return no_session_logout(request)

def payment(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            signature = request.POST['signature']
            passengers = json.loads(request.POST['passengers'])
            provider = request.POST['provider']
            discount_voucher = json.loads(request.POST['discount'])
            voucher_code = request.POST['voucher_code']
            type = request.POST['type'] #tipe airline_review
            values = get_data_template(request)
            try:
                payment = request.POST['payment']
            except:
                payment = {}
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'signature': signature,
                'passengers': passengers,
                'provider': provider,
                'type': type,
                'payment': payment,
                'time_limit': request.POST['session_time_input'],
                'discount_voucher': discount_voucher,
                'voucher_code': voucher_code,
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/payment_force_issued.html', values)
    else:
        return no_session_logout(request)

def top_up_history(request):
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
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
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

def get_data_template(request, type='home'):
    if type != 'login':
        request.session.set_expiry(1200)
        request.session.modified = True
    template = 1
    logo = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
    logo_icon = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
    background = '/static/tt_website_rodextrip/images/bg_7.jpg'
    color = '#f15a22'
    website_name = 'Rodextrip'
    tawk_chat = 0
    tawk_code = ''
    facebook = ''
    instagram = ''
    tab_color = '#333333'
    text_color = '#FFFFFF'
    website_description = '''RODEXTRIP is a travel online reservation system owned by PT. Roda Express Sukses Mandiri, based in Indonesia, for its registered agent. RODEXTRIP provide some products such as airline, train, themes park tickets, and many more.

We build this application for our existing partner and public users who register themselves on our application. After registration, users need to wait for verification / approval by our Head Office. We build our application for approved users, so that's why public user can't use our application.'''
    try:
        file = open(var_log_path()+"data_cache_template.txt", "r")
        for idx, line in enumerate(file):
            if idx == 0:
                if line == '\n':
                    logo = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
                else:
                    logo = line.split('\n')[0]
            elif idx == 1:
                if line != '\n':
                    template = int(line)
            elif idx == 2:
                if line != '\n':
                    color = line.split('\n')[0]
            elif idx == 3:
                if line != '\n':
                    website_name = line.split('\n')[0]
            elif idx == 4:
                if line.split('<br>')[len(line.split('<br>'))-1] == '\n':
                    website_description = '\n'.join(line.split('<br>')[:-1])
                else:
                    website_description = '\n'.join(line.split('<br>'))
            elif idx == 5 and type == 'home':
                if line != '\n':
                    background = line.split('\n')[0]
            elif idx == 6 and type == 'login':
                if line != '\n':
                    background = line.split('\n')[0]
            elif idx == 7 and type == 'search':
                if line != '\n':
                    background = line.split('\n')[0]
            elif idx == 8:
                if line != '\n':
                    tawk_chat = int(line)
            elif idx == 9:
                if line != '\n':
                    tawk_code = line.split('\n')[0]
            elif idx == 10:
                if line != '\n':
                    facebook = line.split('\n')[0]
            elif idx == 11:
                if line != '\n':
                    instagram = line.split('\n')[0]
            elif idx == 12:
                if line != '\n':
                    text_color = line.split('\n')[0]
            elif idx == 13:
                if line != '\n':
                    if line.split('\n')[0] == 'none':
                        tab_color = 'transparent'
                    else:
                        tab_color = line.split('\n')[0]
            elif idx == 14:
                if line == '\n':
                    logo_icon = '/static/tt_website_rodextrip/images/icon/LOGO_RODEXTRIP.png'
                else:
                    logo_icon = line.split('\n')[0]
        if color == '':
            color = '#f15a22'
        file.close()
        if len(background.split('\n')) > 1:
            background = background.split('\n')[0]
    except:
        pass
    return {
        'logo': logo,
        'logo_icon': logo_icon,
        'template': template,
        'color': color,
        'desc': website_description.split('\n'),
        'name': website_name,
        'background': background,
        'tawk_chat': tawk_chat,
        'tawk_code': tawk_code,
        'facebook_url': facebook,
        'instagram_url': instagram,
        'text_color': text_color,
        'tab_color': tab_color,
        'update_data': ''
    }

# @api_view(['GET'])
# def testing(request):
#     return Response(_dest_env.test())
#
#
# @api_view(['GET'])
# @permission_classes((IsAuthenticated, ))
# def testing2(request):
#     return Response(_dest_env.test_2())
