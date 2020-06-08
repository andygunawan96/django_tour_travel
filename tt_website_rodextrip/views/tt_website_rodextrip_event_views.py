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
import base64

MODEL_NAME = 'tt_website_rodextrip'


def event(request):
    if 'user_account' in request.session._session and 'ticketing' in request.session['user_account']['co_agent_frontend_security']:
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
            try:
                cache['hotel'] = {
                    'checkin': request.session['hotel_request']['checkin_date'],
                    'checkout': request.session['hotel_request']['checkout_date']
                }
                if cache['hotel']['checkin'] == 'Invalid date' or cache['hotel']['checkout'] == 'Invalid date':
                    cache['hotel']['checkin'] = convert_string_to_date_to_string_front_end(
                        str(datetime.now() + relativedelta(days=1))[:10])
                    cache['hotel']['checkout'] = convert_string_to_date_to_string_front_end(
                        str(datetime.now() + relativedelta(days=2))[:10])
            except:
                pass

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
                'signature': request.session['signature'],

            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/hotel/hotel_templates.html', values)

    else:
        return no_session_logout(request)


def search(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            try:
                request.session['event_request'] = {
                    'event_name': request.POST['event_name_id'],
                    'city_id': False,
                    'category_id': False,
                    'is_online': request.POST.get('include_online'), #Checkbox klo disi baru di POST
                }
                request.session.modified = True
            except:
                print('error')
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

                'event_search': request.session['event_request'],
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/01_event_search_templates.html', values)
    else:
        return no_session_logout(request)


def search_category(request, category_name):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            request.session['time_limit'] = 1200

            try:
                request.session['event_request'].update({
                    'category_name': category_name,
                })
                request.session.modified = True
            except:
                print('error')
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
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/01_event_search_templates.html', values)
    else:
        return no_session_logout(request)


def detail(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request, 'search')
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            if request.POST:
                request.session['time_limit'] = int(request.POST['time_limit_input'])
            else:
                request.session['time_limit'] -= 50

            try:
                if translation.LANGUAGE_SESSION_KEY in request.session:
                    del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

                request.session['event_code'] = json.loads(request.POST['event_code'])
            except:
                pass
            data = request.session['event_code']
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

                'event_search': request.session['event_request'],
                'event_code': data,
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/02_event_detail_templates.html', values)
    else:
        return no_session_logout(request)


def vendor(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            values = get_data_template(request)
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'static_path_url_server': get_url_static_path(),
                'signature': request.session['signature'],
                'javascript_version': javascript_version,
                'time_limit': request.session['time_limit'],

                'vendor': request.session['event_code']['vendor_obj'],
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/06_event_vendor_templates.html', values)
    else:
        return no_session_logout(request)


def contact_passengers(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request)

            request.session['time_limit'] = int(request.POST['time_limit_input'])

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            # agent
            adult_title = ['MR', 'MRS', 'MS']
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            opt_code = []
            i = 1
            while i:
                if request.POST.get('option_qty_'+str(i-1)):
                    if int(request.POST['option_qty_' + str(i-1)]) != 0:
                        opt_code.append({
                            'name': request.session['event_detail']['result']['response'][i-1]['grade'],
                            'code': request.session['event_detail']['result']['response'][i-1]['option_id'],
                            'qty': request.POST['option_qty_' + str(i-1)],
                            'currency': request.session['event_detail']['result']['response'][i-1]['currency'],
                            'price': request.session['event_detail']['result']['response'][i-1]['price'],
                            'comm': request.session['event_detail']['result']['response'][i-1].get('commission',0),
                        })
                    i += 1
                else:
                    break

            request.session['event_option_code' + request.session['event_signature']] = opt_code
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'countries': airline_country,
                'phone_code': phone_code,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                # 'username': request.session['username'],
                'username': request.session['user_account'],
                'response': request.session['event_response_search'],
                'adult_title': adult_title,
                'signature': request.session['event_signature'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],

                'event_search': request.session['event_request'],
                'event_code': request.session['event_code'],
                'event_option_code': opt_code,
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/event/03_event_passenger_templates.html', values)
    else:
        return no_session_logout(request)


def review(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            values = get_data_template(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            request.session['time_limit'] = int(request.POST['time_limit_input'])
            request.session['special_req_event'] = request.POST['special_req_event']

            adult = []
            contact = []
            printout_paxs = []
            booker = {
                'title': request.POST['booker_title'],
                'first_name': request.POST['booker_first_name'],
                'last_name': request.POST['booker_last_name'],
                'email': request.POST['booker_email'],
                'calling_code': request.POST['booker_phone_code'],
                'mobile': request.POST['booker_phone'],
                'nationality_name': request.POST['booker_nationality'],
                "work_phone": request.POST['booker_phone_code'] + request.POST['booker_phone'],
                'booker_seq_id': request.POST['booker_id']
            }
            for i in range(int(request.session['event_request'].get('adult') or 0)):
                adult.append({
                    "pax_type": "ADT",
                    "first_name": request.POST['adult_first_name' + str(i + 1)],
                    "last_name": request.POST['adult_last_name' + str(i + 1)],
                    "title": request.POST['adult_title' + str(i + 1)],
                    "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                    "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                    "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                    "room_number": '1'
                })
                printout_paxs.append({
                    "name": request.POST['adult_title' + str(i + 1)] + ' ' + request.POST[
                        'adult_first_name' + str(i + 1)] + ' ' + request.POST['adult_last_name' + str(i + 1)],
                    'ticket_number': '',
                    'birth_date': request.POST['adult_birth_date' + str(i + 1)],
                    'pax_type': 'Adult',
                    'additional_info': ["Room: 1", "SpecialReq:" + request.session['hotel_request']['special_request']],
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
                            "first_name": request.POST['adult_first_name' + str(i + 1)],
                            "last_name": request.POST['adult_last_name' + str(i + 1)],
                            "title": request.POST['adult_title' + str(i + 1)],
                            "email": request.POST['adult_email' + str(i + 1)],
                            "calling_code": request.POST['adult_phone_code' + str(i + 1)],
                            "mobile": request.POST['adult_phone' + str(i + 1)],
                            "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                            "work_phone": request.POST['booker_phone_code'] + request.POST['booker_phone'],
                            "address": request.session.get('company_details') and request.session['company_details']['address'] or '',
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
                contact.append({
                    'title': request.POST['booker_title'],
                    'first_name': request.POST['booker_first_name'],
                    'last_name': request.POST['booker_last_name'],
                    'email': request.POST['booker_email'],
                    'calling_code': request.POST['booker_phone_code'],
                    'mobile': request.POST['booker_phone'],
                    'nationality_name': request.POST['booker_nationality'],
                    'contact_seq_id': request.POST['booker_id'],
                    "work_phone": request.POST['booker_phone_code'] + request.POST['booker_phone'],
                    "address": request.session.get('company_details') and request.session['company_details']['address'] or '',
                    'is_also_booker': True
                })

            request.session['event_review_pax'] = {
                'booker': booker,
                'contact': contact,
                'adult': adult,
            }

            print_json = json.dumps({
                "type": "event",
                "agent_name": request.session._session['user_account']['co_agent_name'],
                "passenger": printout_paxs,
                "line": [],
            })
            request.session['hotel_json_printout' + request.session['event_signature']] = print_json

            question_answer = []
            for a in request.POST.keys():
                if 'que_' in a:
                    b = a.split('_')
                    c_obj = False
                    for c in question_answer:
                        if c['option_grade'] == request.session['event_option_code' + request.session['event_signature']][int(b[1])]['name'] and c['idx'] == b[2]:
                            c_obj = c
                            break
                    if not c_obj:
                        c_obj = {
                            'option_grade': request.session['event_option_code' + request.session['event_signature']][int(b[1])]['name'],
                            'option_code': request.session['event_option_code' + request.session['event_signature']][int(b[1])]['code'],
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

            request.session['event_extra_question' + request.session['event_signature']] = question_answer

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'booker': booker,
                'adults': adult,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'upsell': request.session.get('event_upsell_'+request.session['event_signature']) and request.session.get('event_upsell_'+request.session['event_signature']) or 0,
                'username': request.session['user_account'],
                'signature': request.session['event_signature'],
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'time_limit': request.session['time_limit'],
                'printout_rec': print_json,

                'event_search': request.session['event_request'],
                'event_code': request.session['event_code'],
                'event_option_code': request.session['event_option_code' + request.session['event_signature']],
                'event_extra_question': question_answer,
                'special_req_event': request.POST['special_req_event'],
            })
        except Exception as e:
            logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/event/04_event_review_templates.html', values)
    else:
        return index(request)


def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()
        values = get_data_template(request)
        try:
            request.session['event_order_number'] = base64.b64decode(order_number).decode('ascii')
        except:
            request.session['event_order_number'] = order_number
        if 'user_account' not in request.session:
            signin_btc(request)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': request.session['event_order_number'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
        })
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME + '/event/05_event_booking_templates.html', values)
