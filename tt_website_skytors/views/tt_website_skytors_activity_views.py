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
from tt_webservice.views.tt_webservice_agent_views import *
from .tt_website_skytors_views import *


MODEL_NAME = 'tt_website_skytors'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']



def search(request):
    if 'username' in request.session._session:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # activity
        activity_sub_categories = response['result']['response']['activity']['sub_categories']
        activity_categories = response['result']['response']['activity']['categories']
        activity_types = response['result']['response']['activity']['types']
        activity_countries = response['result']['response']['activity']['countries']
        # activity

        get_balance(request)
        request.session['activity_request'] = {
            'query': request.POST['themespark_query'],
            'country': request.POST['themespark_countries'],
            'city': request.POST['themespark_cities'],
            'sort': 'price_asc',
            'type_id': request.POST['themespark_type'],
            'category': request.POST['themespark_category'],
            'sub_category': request.POST['themespark_sub_category'],
            'limit': 25,
            'offset': 0,

        }
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'activity_sub_categories': activity_sub_categories,
            'activity_categories': activity_categories,
            'activity_types': activity_types,
            'activity_countries': activity_countries,
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_search_templates.html', values)
    else:
        return index(request)

def detail(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        get_balance(request)
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        request.session['activity_pick'] = request.session['activity_search'][int(request.POST['sequence'])]
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'response': request.session['activity_search'][int(request.POST['sequence'])],
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_detail_templates.html', values)
    else:
        return index(request)

def passenger(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # agent
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

        # agent

        airline_country = response['result']['response']['airline']['country']

        get_balance(request)

        request.session['activity_request'] = {
            'activity_type_pick': request.POST['activity_type_pick'],
            'activity_date_pick': request.POST['activity_date_pick'],
            'activity_timeslot': request.POST['activity_timeslot'],
            'additional_price': request.POST['additional_price'],
            'event_pick': request.POST['event_pick'],
            'adult_passenger': request.POST['adult_passenger'],
            'infant_passenger': request.POST['infant_passenger'],
            'senior_passenger': request.POST['senior_passenger'],
            'children_passenger': request.POST['children_passenger'],
        }
        perbooking_list = []
        upload = []
        #perbooking
        for idx, perbooking in enumerate(request.session['activity_detail']['result'][int(request.POST['activity_type_pick'])]['options']['perBooking']):
            if perbooking['name'] != 'Guest age' and perbooking['name'] != 'Nationality' and perbooking['name'] != 'Full name' and perbooking['name'] != 'Gender' and perbooking['name'] != 'Date of birth':
                if perbooking['inputType'] == 1:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })
                    print('a')
                elif perbooking['inputType'] == 2:
                    for i, item in enumerate(perbooking['items']):
                        try:
                            if request.POST['perbooking' + str(idx) + str(i)] != '':
                                perbooking_list.append({
                                    "uuid": perbooking['uuid'],
                                    "value": item['value'],
                                    "name": perbooking['name']
                                })
                        except:
                            print('no perbooking2')
                elif perbooking['inputType'] == 3:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking'+str(idx)],
                        "name": perbooking['name']
                    })
                elif perbooking['inputType'] == 4:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })
                elif perbooking['inputType'] == 5:
                    if request.POST['perbooking' + str(idx)] == 'on':
                        perbooking_list.append({
                            "uuid": perbooking['uuid'],
                            "value": 'True',
                            "name": perbooking['name']
                        })
                    else:
                        perbooking_list.append({
                            "uuid": perbooking['uuid'],
                            "value": 'False',
                            "name": perbooking['name']
                        })
                elif perbooking['inputType'] == 6:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })
                elif perbooking['inputType'] == 7:
                    upload.append({
                        "uuid": perbooking['uuid'],
                        "value": base64.b64encode(request.FILES['perbooking' + + str(idx)].read()),
                        "name": perbooking['name'],
                        "type": request.FILES['perbooking' + str(idx)].content_type.split('/')[0]
                    })
                    print('a')
                elif perbooking['inputType'] == 8:
                    upload.append({
                        "uuid": perbooking['uuid'],
                        "value": base64.b64encode(request.FILES['perbooking' + + str(idx)].read()),
                        "name": perbooking['name'],
                        "type": request.FILES['perbooking' + str(idx)].content_type.split('/')[0]
                    })
                    print('a')
                elif perbooking['inputType'] == 9:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })
                elif perbooking['inputType'] == 10:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })
                elif perbooking['inputType'] == 11:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)+'0']+' '+request.POST['perbooking' + str(idx)+'1'],
                        "name": perbooking['name']
                    })
                elif perbooking['inputType'] == 12:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })
                elif perbooking['inputType'] == 13:
                    print('deprecated')
                elif perbooking['inputType'] == 14:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })

        request.session['activity_perbooking'] = perbooking_list
        request.session['activity_upload'] = upload

        # pax
        adult = []
        infant = []
        senior = []
        child = []

        try:
            for i in range(int(request.POST['adult_passenger'])):
                adult.append('')
        except:
            print('no adult')

        try:
            for i in range(int(request.POST['infant_passenger'])):
                infant.append('')
        except:
            print('no adult')

        try:
            for i in range(int(request.POST['senior_passenger'])):
                senior.append('')
        except:
            print('no adult')

        try:
            for i in range(int(request.POST['child_passenger'])):
                child.append('')
        except:
            print('no adult')


        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'adult_title': adult_title,
            'infant_title': infant_title,
            'additional_price': request.POST['additional_price'],
            'countries': airline_country,
            'response': request.session['activity_pick'],
            'adult_count': len(adult),
            'infant_count': len(infant),
            'child_count': len(child),
            'senior_count': len(senior),
            'adults': adult,
            'infants': infant,
            'seniors': senior,
            'childs': child,
            'price': request.session['activity_price']['result']['response'][int(request.POST['event_pick'])][int(request.POST['activity_date_pick'])],
            'detail': request.session['activity_detail']['result'][int(request.POST['activity_type_pick'])],
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_passenger_templates.html', values)
    else:
        return index(request)

def review(request):
    if 'username' in request.session._session:
        #adult
        adult = []
        child = []
        infant = []
        senior = []
        upload = []

        for file in request.session['activity_upload']:
            upload.append(file)

        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'nationality_code': request.POST['booker_nationality'],
            'country_code': request.POST['booker_nationality'],
            'email': request.POST['booker_email'],
            'work_phone': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'home_phone': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'other_phone': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'postal_code': 0,
            "city": request.session._session['company_details']['city'],
            "province_state": request.session._session['company_details']['state'],
            'address': request.session['company_details']['address'],
            'mobile': request.POST['booker_phone_code']+request.POST['booker_phone'],
            'agent_id': int(request.session['agent']['id']),
            'booker_id': request.POST['booker_id']
        }
        # "city": this.state.city_agent,
        # "province_state": this.state.state_agent,
        # "contact_id": "",

        perpax_list = []
        perpax_list_temp = []
        for i in range(int(request.session['activity_request']['adult_passenger'])):
            print(request.POST['adult_title'+str(i+1)])

            adult.append({
                "first_name": request.POST['adult_first_name'+str(i+1)],
                "last_name": request.POST['adult_last_name'+str(i+1)],
                "nationality_code": request.POST['adult_nationality'+str(i+1)],
                "title": request.POST['adult_title'+str(i+1)],
                "pax_type": "ADT",
                "birth_date": request.POST['adult_birth_date'+str(i+1)],
                "passenger_id": request.POST['adult_id'+str(i+1)]
            })


            # perpax
            for idx, perpax in enumerate(request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
                if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth':
                    if perpax['inputType'] == 1:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 2:
                        for j, item in enumerate(perpax['items']):
                            try:
                                if request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1) + ' ' + str(j)] == 'true':
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": item['value'],
                                        "name": perpax['name']
                                    })
                            except:
                                print('no perbooking2')
                    elif perpax['inputType'] == 3:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 4:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 5:
                        if request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)] == 'on':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": 'True',
                                "name": perpax['name']
                            })
                        else:
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": 'False',
                                "name": perpax['name']
                            })
                    elif perpax['inputType'] == 6:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 7:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type": request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[0]
                        })
                        print('a')
                    elif perpax['inputType'] == 8:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type": request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[0]
                        })
                        print('a')
                    elif perpax['inputType'] == 9:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 10:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 11:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1) + '0']+ ' ' +request.POST['adult_perpax' + str(i) + '_' + str(idx) + '1'],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 12:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax_list['name']
                        })
                    elif perpax['inputType'] == 13:
                        print('deprecated')
                    elif perpax['inputType'] == 14:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                elif perpax['name'] == 'Guest age':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": int(request.POST['adult_years_old'+str(i+1)]),
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Nationality':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['adult_nationality'+str(i+1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Full name':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['adult_title' + str(i + 1)]+' '+request.POST['adult_first_name' + str(i + 1)]+' '+request.POST['adult_last_name' + str(i + 1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Gender':
                    if request.POST['adult_title' + str(i + 1)] == 'MR':
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": 'Male',
                            "name": perpax['name']
                        })
                    else:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": 'Female',
                            "name": perpax['name']
                        })
                elif perpax['name'] == 'Date of birth':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['adult_birth_date'+str(i+1)],
                        "name": perpax['name']
                    })
            perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

        #senior
        for i in range(int(request.session['activity_request']['senior_passenger'])):
            print(request.POST['senior_title'+str(i+1)])

            senior.append({
                "first_name": request.POST['senior_first_name'+str(i+1)],
                "last_name": request.POST['senior_last_name'+str(i+1)],
                "nationality_code": request.POST['senior_nationality'+str(i+1)],
                "title": request.POST['senior_title'+str(i+1)],
                "pax_type": "ADT",
                "birth_date": request.POST['senior_birth_date'+str(i+1)],
                "passenger_id": request.POST['senior_id'+str(i+1)]
            })

            # perpax
            for idx, perpax in enumerate(request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
                if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth':
                    if perpax['inputType'] == 1:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 2:
                        for j, item in enumerate(perpax['items']):
                            try:
                                if request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1) + ' ' + str(j+1)] == 'true':
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": item['value'],
                                        "name": perpax['name']
                                    })
                            except:
                                print('no perbooking2')
                    elif perpax['inputType'] == 3:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 4:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 5:
                        if request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)] == 'on':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": 'True',
                                "name": perpax['name']
                            })
                        else:
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": 'False',
                                "name": perpax['name']
                            })
                    elif perpax['inputType'] == 6:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 7:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type":request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[0]
                        })
                        print('a')
                    elif perpax['inputType'] == 8:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type":request.FILES['senior_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[0]
                        })
                        print('a')
                    elif perpax['inputType'] == 9:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 10:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 11:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1) + '0'] + ' ' + request.POST['senior_perpax' + str(i) + '_' + str(idx) + '1'],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 12:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax_list['name']
                        })
                    elif perpax['inputType'] == 13:
                        print('deprecated')
                    elif perpax['inputType'] == 14:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                elif perpax['name'] == 'Guest age':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": int(request.POST['senior_years_old'+str(i+1)]),
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Nationality':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['senior_nationality'+str(i+1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Full name':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['senior_title' + str(i + 1)]+' '+request.POST['senior_first_name' + str(i + 1)]+' '+request.POST['senior_last_name' + str(i + 1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Gender':
                    if request.POST['senior_title' + str(i + 1)] == 'MR':
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": 'Male',
                            "name": perpax['name']
                        })
                    else:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": 'Female',
                            "name": perpax['name']
                        })
                elif perpax['name'] == 'Date of birth':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['senior_birth_date'+str(i+1)],
                        "name": perpax['name']
                    })
            perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

        #child
        for i in range(int(request.session['activity_request']['children_passenger'])):
            child.append({
                "first_name": request.POST['child_first_name'+str(i+1)],
                "last_name": request.POST['child_last_name'+str(i+1)],
                "nationality_code": request.POST['child_nationality'+str(i+1)],
                "title": request.POST['child_title'+str(i+1)],
                "pax_type": "CHD",
                "birth_date": request.POST['child_birth_date'+str(i+1)],
                "passenger_id": request.POST['child_id'+str(i+1)]
            })

            # perpax
            for idx, perpax in enumerate(request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
                if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth':
                    if perpax['inputType'] == 1:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 2:
                        for j, item in enumerate(perpax['items']):
                            try:
                                if request.POST['child_perpax' + str(i+1) + '_' + str(idx+1) + ' ' + str(j)] == 'true':
                                    perpax_list_temp.append({
                                        "uuid": perpax['uuid'],
                                        "value": item['value'],
                                        "name": perpax['name']
                                    })
                            except:
                                print('no perbooking2')
                    elif perpax['inputType'] == 3:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 4:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 5:
                        if request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)] == 'on':
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": 'True',
                                "name": perpax['name']
                            })
                        else:
                            perpax_list_temp.append({
                                "uuid": perpax['uuid'],
                                "value": 'False',
                                "name": perpax['name']
                            })
                    elif perpax['inputType'] == 6:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 7:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type": request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[0]
                        })
                        print('a')
                    elif perpax['inputType'] == 8:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type": request.FILES['child_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[0]
                        })
                        print('a')
                    elif perpax['inputType'] == 9:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 10:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 11:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1) + '0'] + ' ' + request.POST['child_perpax' + str(i) + '_' + str(idx) + '1'],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 12:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax_list['name']
                        })
                    elif perpax['inputType'] == 13:
                        print('deprecated')
                    elif perpax['inputType'] == 14:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                elif perpax['name'] == 'Guest age':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": int(request.POST['child_years_old' + str(i + 1)]),
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Nationality':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['child_nationality' + str(i + 1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Full name':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['child_title' + str(i + 1)] + ' ' + request.POST['child_first_name' + str(i + 1)] + ' ' + request.POST['child_last_name' + str(i + 1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Gender':
                    if request.POST['child_title' + str(i + 1)] == 'MR':
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": 'Male',
                            "name": perpax['name']
                        })
                    else:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": 'Female',
                            "name": perpax['name']
                        })
                elif perpax['name'] == 'Date of birth':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['child_birth_date' + str(i + 1)],
                        "name": perpax['name']
                    })
            perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

        #infant
        for i in range(int(request.session['activity_request']['infant_passenger'])):
            infant.append({
                "first_name": request.POST['infant_first_name'+str(i+1)],
                "last_name": request.POST['infant_last_name'+str(i+1)],
                "nationality_code": request.POST['infant_nationality'+str(i+1)],
                "title": request.POST['infant_title'+str(i+1)],
                "pax_type": "INF",
                "birth_date": request.POST['infant_birth_date'+str(i+1)],
                "passenger_id": request.POST['infant_id'+str(i+1)]
            })

            # perpax
            # for idx, perpax in enumerate(request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
            #     if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth':
            #         if perpax['inputType'] == 1:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax['name']
            #             })
            #         elif perpax['inputType'] == 2:
            #             for j, item in enumerate(perpax['items']):
            #                 try:
            #                     if request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1) + ' ' + str(j)] == 'true':
            #                         perpax_list_temp.append({
            #                             "uuid": perpax['uuid'],
            #                             "value": item['value'],
            #                             "name": perpax['name']
            #                         })
            #                 except:
            #                     print('no perbooking2')
            #         elif perpax['inputType'] == 3:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax['name']
            #             })
            #         elif perpax['inputType'] == 4:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax['name']
            #             })
            #         elif perpax['inputType'] == 5:
            #             if request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)] == 'on':
            #                 perpax_list_temp.append({
            #                     "uuid": perpax['uuid'],
            #                     "value": 'True',
            #                     "name": perpax['name']
            #                 })
            #             else:
            #                 perpax_list_temp.append({
            #                     "uuid": perpax['uuid'],
            #                     "value": 'False',
            #                     "name": perpax['name']
            #                 })
            #         elif perpax['inputType'] == 6:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax['name']
            #             })
            #         elif perpax['inputType'] == 7:
            #             # upload
            #             upload.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": base64.b64encode(
            #                     request.FILES['infant_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
            #                 "name": perpax['name'],
            #                 "type":
            #                     request.FILES['infant_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[
            #                         0]
            #             })
            #             print('a')
            #         elif perpax['inputType'] == 8:
            #             # upload
            #             upload.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": base64.b64encode(
            #                     request.FILES['infant_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
            #                 "name": perpax['name'],
            #                 "type":
            #                     request.FILES['infant_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[
            #                         0]
            #             })
            #             print('a')
            #         elif perpax['inputType'] == 9:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax['name']
            #             })
            #         elif perpax['inputType'] == 10:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax['name']
            #             })
            #         elif perpax['inputType'] == 11:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1) + '0'] + ' ' + request.POST['infant_perpax' + str(i) + '_' + str(idx) + '1'],
            #                 "name": perpax['name']
            #             })
            #         elif perpax['inputType'] == 12:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax_list['name']
            #             })
            #         elif perpax['inputType'] == 13:
            #             print('deprecated')
            #         elif perpax['inputType'] == 14:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": request.POST['infant_perpax' + str(i+1) + '_' + str(idx+1)],
            #                 "name": perpax['name']
            #             })
            #     elif perpax['name'] == 'Guest age':
            #         perpax_list_temp.append({
            #             "uuid": perpax['uuid'],
            #             "value": int(request.POST['infant_years_old' + str(i + 1)]),
            #             "name": perpax['name']
            #         })
            #     elif perpax['name'] == 'Nationality':
            #         perpax_list_temp.append({
            #             "uuid": perpax['uuid'],
            #             "value": request.POST['infant_nationality' + str(i + 1)],
            #             "name": perpax['name']
            #         })
            #     elif perpax['name'] == 'Full name':
            #         perpax_list_temp.append({
            #             "uuid": perpax['uuid'],
            #             "value": request.POST['infant_title' + str(i + 1)] + ' ' + request.POST['infant_first_name' + str(i + 1)] + ' ' + request.POST['infant_last_name' + str(i + 1)],
            #             "name": perpax['name']
            #         })
            #     elif perpax['name'] == 'Gender':
            #         if request.POST['infant_title' + str(i + 1)] == 'MR':
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": 'Male',
            #                 "name": perpax['name']
            #             })
            #         else:
            #             perpax_list_temp.append({
            #                 "uuid": perpax['uuid'],
            #                 "value": 'Female',
            #                 "name": perpax['name']
            #             })
            #     elif perpax['name'] == 'Date of birth':
            #         perpax_list_temp.append({
            #             "uuid": perpax['uuid'],
            #             "value": request.POST['infant_birth_date' + str(i + 1)],
            #             "name": perpax['name']
            #         })
            perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

        request.session['activity_perpax'] = perpax_list

        if request.session['activity_pick']['provider'] == 'bemyguest':
            event_id = False
        else:
            event_id = request.session['activity_price']['result']['response'][int(request.session['activity_request']['event_pick'])]['id']

        if request.session['activity_request']['activity_timeslot'] != '':
            timeslot = request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])]['timeslots'][int(request.session['activity_request']['activity_timeslot'])]['uuid']
        else:
            timeslot = ''
        search_request = {
            "infant": len(infant),
            "instantConfirmation": True,
            "product_type_uuid": request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])]['uuid'],
            "adult": len(adult),
            "child": len(child),
            "name": request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])]['name'],
            "visit_date": request.session['activity_price']['result']['response'][int(request.session['activity_request']['event_pick'])][int(request.session['activity_request']['activity_date_pick'])]['date'],
            "senior": len(senior),
            "timeslot": '',
            "event_id": event_id,
            "provider": request.session['activity_pick']['provider']
        }
        request.session['activity_review_booking'] = {
            'booker': booker,
            'adult': adult,
            'senior': senior,
            'child': child,
            'infant': infant,
            'upload_value': upload,
            'search_request': search_request
        }

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'additional_price': request.POST['additional_price'],
            'response': request.session['activity_pick'],
            'adult_count': len(adult),
            'infant_count': len(infant),
            'child_count': len(child),
            'senior_count': len(senior),
            'booker': booker,
            'adults': adult,
            'infants': infant,
            'seniors': senior,
            'childs': child,
            'price': request.session['activity_price']['result']['response'][int(request.session['activity_request']['event_pick'])][int(request.session['activity_request']['activity_date_pick'])],
            'detail': request.session['activity_detail']['result'][int(request.session['activity_request']['activity_type_pick'])],

            # 'booker': booker,
            # 'adults': adult,
            # 'infants': infant,
            # 'children': child,
            # 'seniors': senior
            # 'adult_count': len(adult),
            # 'infant_count': len(infant),
            # 'senior_count': len(senior),
            # 'child_count': len(child),
            # # 'response': request.session['train_pick'],
            # 'username': request.session['username'],
            # 'co_uid': request.session['co_uid'],
            # # 'cookies': json.dumps(res['result']['cookies']),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_review_templates.html', values)
    else:
        return index(request)

def booking(request):
    if 'username' in request.session._session:
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'order_number': request.POST['order_number'],
            'username': request.session['username'],
            'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit']
        }
        return render(request, MODEL_NAME + '/activity/tt_website_skytors_activity_booking_templates.html', values)
    else:
        return index(request)