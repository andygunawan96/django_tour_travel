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
import re
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_views import *
from tools.parser import *
import base64

MODEL_NAME = 'tt_website'
_logger = logging.getLogger("website_logger")

def event(request):
    if 'user_account' in request.session._session and 'ticketing_event' in request.session['user_account']['co_agent_frontend_security']:
        try:
            values = get_data_template(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
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
            # get_data_awal
            cache = {}

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'cache': json.dumps(cache),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                # 'co_uid': request.session['co_uid'],
                'airline_cabin_class_list': airline_cabin_class_list,
                'javascript_version': javascript_version,
                'update_data': 'false',
                'static_path_url_server': get_url_static_path(),
                'big_banner_value': check_banner('event', 'big_banner', request),
                'small_banner_value': check_banner('event', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/00_event_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            # check_captcha(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            frontend_signature = generate_signature()

            try:
                write_cache_file(request, frontend_signature, 'event_request', {
                    'event_name': request.POST['event_name_id'],
                    'city_id': False,
                    'category_name': request.POST['category_event'],
                    'is_online': request.POST.get('include_online'), #Checkbox klo disi baru di POST
                })
                # set_session(request, 'event_request', {
                #     'event_name': request.POST['event_name_id'],
                #     'city_id': False,
                #     'category_name': request.POST['category_event'],
                #     'is_online': request.POST.get('include_online'), #Checkbox klo disi baru di POST
                # })
                # request.session.modified = True
            except Exception as e:
                _logger.error('Data POST for event_request not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, frontend_signature, 'event_request')
            if file:
                event_request = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': 1200,
                'signature': request.session['signature'],
                'frontend_signature': frontend_signature,
                'event_search': event_request,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/01_event_search_templates.html', values)
    else:
        return no_session_logout(request)

def search_category(request, category_name):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            set_session(request, 'time_limit', 1200)
            try:
                request.session['event_request'].update({
                    'event_name': '',
                    'category_name': category_name,
                })
                request.session.modified = True
            except Exception as e:
                _logger.error('Data POST for event_request not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],
                'signature': request.session['signature'],

                'event_search': request.session['event_request'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/01_event_search_templates.html', values)
    else:
        return no_session_logout(request)

def detail(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            try:
                time_limit = get_timelimit_product(request, 'event', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            try:
                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
                write_cache_file(request, signature, 'event_code', json.loads(request.POST['event_code']))
                # set_session(request, 'event_code', json.loads(request.POST['event_code']))
            except Exception as e:
                _logger.error('Data POST for event_code not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'event_code')
            if file:
                data = file
            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file
            file = read_cache_file(request, signature, 'event_request')
            if file:
                event_request = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'signature': signature,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'time_limit': time_limit,
                'event_search': event_request,
                'event_code': data,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/02_event_detail_templates.html', values)
    else:
        return no_session_logout(request)

def vendor(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            try:
                time_limit = get_timelimit_product(request, 'event')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
            except:
                pass

            try:
                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser
                set_session(request, 'event_code', json.loads(request.POST['event_code']))
            except Exception as e:
                _logger.error('Data POST for event_code not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'signature': request.session['event_signature'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'time_limit': request.session['time_limit'],

                'vendor': request.session['event_code']['vendor_obj'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/06_event_vendor_templates.html', values)
    else:
        return no_session_logout(request)

def contact_passengers(request, signature=''):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request)

            try:
                time_limit = get_timelimit_product(request, 'event', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            # agent
            adult_title = ['', 'MR', 'MRS', 'MS']
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            opt_code = []
            # i = 1
            # while i:
            #     if request.POST.get('option_qty_'+str(i-1)):
            #         if int(request.POST['option_qty_' + str(i-1)]) != 0:
            #             opt_code.append({
            #                 'name': request.session['event_detail']['result']['response'][i-1]['grade'],
            #                 'code': request.session['event_detail']['result']['response'][i-1]['option_id'],
            #                 'qty': request.POST['option_qty_' + str(i-1)],
            #                 'currency': request.session['event_detail']['result']['response'][i-1]['currency'],
            #                 'price': request.session['event_detail']['result']['response'][i-1]['price'],
            #                 'comm': request.session['event_detail']['result']['response'][i-1].get('commission',0),
            #             })
            #         i += 1
            #     else:
            #         break

            # Vin 2021/03/16: Update mekanisme read selected option
            # Rule yg lama bisa error jika option awal tidk dibeli
            try:
                file = read_cache_file(request, signature, 'event_detail')
                if file:
                    event_detail = file
                for key in sorted(request.POST.keys()):
                    if 'option_qty_' in key:
                        if int(request.POST[key]) != 0:
                            i = int(key.split('_')[-1])
                            opt_code.append({
                                'name': event_detail['result']['response'][i]['grade'],
                                'code': event_detail['result']['response'][i]['option_id'],
                                'qty': request.POST[key],
                                'currency': event_detail['result']['response'][i]['currency'],
                                'price': event_detail['result']['response'][i]['price'],
                                'comm': event_detail['result']['response'][i].get('commission',0),
                            })
                write_cache_file(request, signature, 'event_option_code', opt_code)
                # set_session(request, 'event_option_code' + request.session['event_signature'], opt_code)
            except Exception as e:
                _logger.error('Data POST for event_option_code not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'event_response_search')
            if file:
                event_response_search = file
            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file
            file = read_cache_file(request, signature, 'event_request')
            if file:
                event_request = file
            file = read_cache_file(request, signature, 'event_code')
            if file:
                event_code = file
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'countries': airline_country,
                'phone_code': phone_code,
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                # 'username': request.session['username'],
                'username': request.session['user_account'],
                'response': event_response_search,
                'adult_title': adult_title,
                'signature': signature,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': time_limit,

                'event_search': event_request,
                'event_code': event_code,
                'event_option_code': opt_code,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/03_event_passenger_templates.html', values)
    else:
        return no_session_logout(request)


def review(request, signature):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            values = get_data_template(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            try:
                time_limit = get_timelimit_product(request, 'event', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            try:
                write_cache_file(request, signature, 'special_req_event', request.POST['special_req_event'])
                # set_session(request, 'special_req_event', request.POST['special_req_event'])
            except Exception as e:
                _logger.error('Data POST for special_req_event not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            try:
                adult = []
                contact = []
                printout_paxs = []

                first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                last_name = re.sub(r'\s', ' ', request.POST.get('booker_last_name', '')).replace(':', '').strip()
                email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                booker = {
                    'title': request.POST['booker_title'],
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'calling_code': request.POST['booker_phone_code_id'],
                    'mobile': mobile,
                    'nationality_code': request.POST['booker_nationality_id'],
                    "work_phone": request.POST['booker_phone_code_id'] + mobile,
                    'booker_seq_id': request.POST['booker_id']
                }
                # for i in range(int(request.session['event_request'].get('adult') or 1)):
                for i in range(1):
                    behaviors = {}
                    if request.POST.get('adult_behaviors_' + str(i + 1)):
                        behaviors = {'event': request.POST['adult_behaviors_' + str(i + 1)]}

                    first_name = re.sub(r'\s', ' ', request.POST['adult_first_name' + str(i + 1)]).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('adult_last_name' + str(i + 1), '')).replace(':', '').strip()
                    email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1), '')).replace(':', '').strip()
                    mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1), '')).replace(':', '').strip()
                    booker_mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                    adult.append({
                        "pax_type": "ADT",
                        "first_name": request.POST['adult_first_name' + str(i + 1)],
                        "last_name": request.POST['adult_last_name' + str(i + 1)],
                        "title": request.POST['adult_title' + str(i + 1)],
                        "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                        "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                        "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                        "behaviors": behaviors,
                    })
                    if i == 0:
                        if request.POST['myRadios'] == 'yes':
                            adult[len(adult) - 1].update({
                                'is_also_booker': True,
                                'is_also_contact': True
                            })
                        else:
                            adult[len(adult) - 1].update({
                                'is_also_booker': False
                            })
                    else:
                        adult[len(adult) - 1].update({
                            'is_also_booker': False
                        })
                    try:
                        if request.POST['adult_cp' + str(i + 1)] == 'on':
                            adult[len(adult) - 1].update({
                                'is_also_contact': True
                            })
                        else:
                            adult[len(adult) - 1].update({
                                'is_also_contact': False
                            })
                    except:
                        if i == 0 and request.POST['myRadios'] == 'yes':
                            continue
                        else:
                            adult[len(adult) - 1].update({
                                'is_also_contact': False
                            })
                    try:
                        if request.POST['adult_cp' + str(i + 1)] == 'on':
                            contact.append({
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['adult_title' + str(i + 1)],
                                "email": email,
                                "calling_code": request.POST['adult_phone_code' + str(i + 1) + '_id'],
                                "mobile": mobile,
                                "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                                "work_phone": request.POST['booker_phone_code'] + booker_mobile,
                                "contact_seq_id": request.POST['adult_id' + str(i + 1)]
                            })
                        if i == 0:
                            if request.POST['myRadios'] == 'yes':
                                contact[len(contact)].update({
                                    'is_also_booker': True
                                })
                            else:
                                contact[len(contact)].update({
                                    'is_also_booker': False
                                })
                    except:
                        pass

                if len(contact) == 0:

                    first_name = re.sub(r'\s', ' ', request.POST['booker_first_name']).replace(':', '').strip()
                    last_name = re.sub(r'\s', ' ', request.POST.get('booker_last_name', '')).replace(':', '').strip()
                    email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                    mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                    contact.append({
                        'title': request.POST['booker_title'],
                        'first_name': first_name,
                        'last_name': last_name,
                        'email': email,
                        'calling_code': request.POST['booker_phone_code_id'],
                        'mobile': mobile,
                        'nationality_code': request.POST['booker_nationality_id'],
                        'contact_seq_id': request.POST['booker_id'],
                        "work_phone": request.POST['booker_phone_code_id'] + mobile,
                        'is_also_booker': True
                    })

                write_cache_file(request, signature, 'event_review_pax', {
                    'booker': booker,
                    'contact': contact,
                    'adult': adult,
                })
                # set_session(request, 'event_review_pax', {
                #     'booker': booker,
                #     'contact': contact,
                #     'adult': adult,
                # })

                question_answer = []
                file = read_cache_file(request, signature, 'event_option_code')
                if file:
                    event_option_code = file
                for a in request.POST.keys():
                    if 'que_' in a:
                        b = a.split('_')
                        c_obj = False
                        for c in question_answer:
                            if c['option_grade'] == event_option_code[int(b[1])]['name'] and c['idx'] == b[2]:
                                c_obj = c
                                break
                        if not c_obj:
                            c_obj = {
                                'option_grade': event_option_code[int(b[1])]['name'],
                                'option_code': event_option_code[int(b[1])]['code'],
                                'idx': b[2],
                                'answer': []
                            }
                            question_answer.append(c_obj)

                        c_obj['answer'].append({
                            'que': request.POST[a],
                            'ans': request.POST.get('question_event_' + a.replace('que_','')) or '', #Check Box Hasil nysa bisa tidak ada
                        })

                        if c_obj['answer'][-1]['ans'] == '':
                            # Jika tidak ada answer coba cari untuk method checkbox
                            new_ans = ''
                            for a1 in request.POST.keys():
                                if 'question_event_' + a.replace('que_','') in a1:
                                    new_ans += request.POST[a1] + ', '
                            c_obj['answer'][-1]['ans'] = new_ans[:-2]

                write_cache_file(request, signature, 'event_extra_question', question_answer)
                # set_session(request, 'event_extra_question' + request.session['event_signature'], question_answer)

                print_json = json.dumps({
                    "type": "event",
                    "agent_name": request.session._session['user_account']['co_agent_name'],
                    "passenger": printout_paxs,
                    "price_detail": [],
                    "price_lines": question_answer,
                })
                write_cache_file(request, signature, 'event_json_printout', print_json)
                # set_session(request, 'event_json_printout' + request.session['event_signature'], print_json)
            except Exception as e:
                _logger.error('Data POST for event_json_printout, event_extra_question, event_review_pax not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'event_review_pax')
            if file:
                event_review_pax = file
            adult = event_review_pax['adult']
            contact = event_review_pax['contact']
            booker = event_review_pax['booker']
            file = read_cache_file(request, signature, 'event_extra_question')
            if file:
                question_answer = file
            # question_answer = request.session['event_extra_question' + request.session['event_signature']]
            file = read_cache_file(request, signature, 'event_json_printout')
            if file:
                print_json = file
            # print_json = request.session['event_json_printout' + request.session['event_signature']]

            file = read_cache_file(request, signature, 'event_request')
            if file:
                event_request = file
            # print_json = request.session['event_json_printout' + request.session['event_signature']]

            file = read_cache_file(request, signature, 'event_code')
            if file:
                event_code = file
            # print_json = request.session['event_json_printout' + request.session['event_signature']]

            file = read_cache_file(request, signature, 'event_option_code')
            if file:
                event_option_code = file
            # print_json = request.session['event_json_printout' + request.session['event_signature']]

            file = read_cache_file(request, signature, 'special_req_event')
            if file:
                special_req_event = file
            else:
                special_req_event = ''
            # print_json = request.session['event_json_printout' + request.session['event_signature']]

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'booker': booker,
                'contact': contact,
                'adults': adult,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'username': request.session['user_account'],
                'signature': signature,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': time_limit,
                'printout_rec': print_json,

                'event_search': event_request,
                'event_code': event_code,
                'event_option_code': event_option_code,
                'event_extra_question': question_answer,
                'special_req_event': special_req_event,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/event/04_event_review_templates.html', values)
    else:
        return index(request)


def booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Event get booking without login in btb web')
        try:
            event_order_number = base64.b64decode(order_number).decode('ascii')
            # set_session(request, 'event_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            try:
                event_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
                # set_session(request, 'event_order_number', base64.b64decode(order_number[:-1]).decode('ascii'))
            except:
                event_order_number = order_number
                # set_session(request, 'event_order_number', order_number)
        if 'user_account' not in request.session:
            signin_btc(request)

        write_cache_file(request, request.session['signature'], 'event_order_number', event_order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': event_order_number,
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')
    return render(request, MODEL_NAME + '/event/05_event_booking_templates.html', values)
