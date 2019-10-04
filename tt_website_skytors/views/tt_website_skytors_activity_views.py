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
import copy
from io import BytesIO
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from .tt_website_skytors_views import *

MODEL_NAME = 'tt_website_skytors'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']


def search(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        template, logo = get_logo_template()

        # activity
        activity_sub_categories = response['result']['response']['activity']['sub_categories']
        activity_categories = response['result']['response']['activity']['categories']
        activity_types = response['result']['response']['activity']['types']
        activity_countries = response['result']['response']['activity']['countries']
        # activity

        request.session['activity_request'] = {
            'query': request.POST['activity_query'],
            'country': request.POST['activity_countries'],
            'city': request.POST['activity_cities'],
            'sort': 'price_asc',
            'type_id': request.POST['activity_type'],
            'category': request.POST['activity_category'],
            'sub_category': request.POST['activity_sub_category'],
            'limit': 25,
            'offset': 0,

        }
        parsed_country_name = ''
        if request.POST['activity_countries']:
            for rec in activity_countries:
                if rec['id'] == int(request.POST['activity_countries']):
                    parsed_country_name = rec['name']

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'activity_sub_categories': activity_sub_categories,
            'activity_categories': activity_categories,
            'activity_types': activity_types,
            'activity_countries': activity_countries,
            'username': request.session['user_account'],
            'query': request.POST['activity_query'],
            'parsed_country': request.POST['activity_countries'] and int(request.POST['activity_countries']) or '',
            'parsed_city': request.POST.get('activity_cities') and int(request.POST['activity_cities']) or 0,
            'parsed_type': request.POST.get('activity_type') and int(request.POST['activity_type']) or 0,
            'parsed_category': request.POST.get('activity_category') and int(request.POST['activity_category'].split(' ')[0]) or 0,
            'parsed_sub_category': request.POST.get('activity_sub_category') and int(request.POST['activity_sub_category']) or 0,
            'parsed_country_name': parsed_country_name,
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_search_templates.html', values)
    else:
        return no_session_logout()


def detail(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        template, logo = get_logo_template()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        request.session['activity_pick'] = json.loads(request.POST['activity_pick'])
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'response': request.session['activity_search'][int(request.POST['sequence'])],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_detail_templates.html', values)
    else:
        return no_session_logout()


def passenger(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        template, logo = get_logo_template()

        # agent
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

        # agent

        airline_country = response['result']['response']['airline']['country']

        # get_balance(request)

        request.session['activity_request'] = {
            'activity_uuid': request.POST['activity_uuid'],
            'activity_type_pick': request.POST['activity_type_pick'],
            'activity_date_pick': request.POST['activity_date_pick'],
            'activity_timeslot': request.POST['activity_timeslot'],
            'additional_price': request.POST.get('additional_price') and request.POST['additional_price'] or 0,
            'event_pick': request.POST['event_pick'],
            'activity_types_data': json.loads(request.POST['details_data']),
            'activity_date_data': json.loads(request.POST['activity_date_data']),
        }

        pax_count = {}
        # pax count per type
        adult = []
        infant = []
        senior = []
        child = []

        for temp_sku in json.loads(request.POST['details_data'])[int(request.POST['activity_type_pick'])]['skus']:
            low_sku_id = temp_sku['sku_id'].lower()
            request.session['activity_request'].update({
                low_sku_id+'_passenger': request.POST.get(low_sku_id+'_passenger') and int(request.POST[low_sku_id+'_passenger']) or 0,
            })
            pax_count.update({
                low_sku_id: request.POST.get(low_sku_id+'_passenger') and int(request.POST[low_sku_id+'_passenger']) or 0
            })
            if temp_sku.get('pax_type'):
                if temp_sku['pax_type'] == 'adult':
                    for i in range(int(pax_count[low_sku_id])):
                        adult.append({
                            'sku_real_id': temp_sku['id'],
                            'title': temp_sku['title'],
                            'sku_id': temp_sku['sku_id']
                        })
                elif temp_sku['pax_type'] == 'senior':
                    for i in range(int(pax_count[low_sku_id])):
                        senior.append({
                            'sku_real_id': temp_sku['id'],
                            'title': temp_sku['title'],
                            'sku_id': temp_sku['sku_id']
                        })
                elif temp_sku['pax_type'] == 'child':
                    for i in range(int(pax_count[low_sku_id])):
                        child.append({
                            'sku_real_id': temp_sku['id'],
                            'title': temp_sku['title'],
                            'sku_id': temp_sku['sku_id']
                        })
                elif temp_sku['pax_type'] == 'infant':
                    for i in range(int(pax_count[low_sku_id])):
                        infant.append({
                            'sku_real_id': temp_sku['id'],
                            'title': temp_sku['title'],
                            'sku_id': temp_sku['sku_id']
                        })

        perbooking_list = []
        upload = []
        #perbooking
        for idx, perbooking in enumerate(request.session['activity_request']['activity_types_data'][int(request.POST['activity_type_pick'])]['options']['perBooking']):
            if perbooking['name'] != 'Guest age' and perbooking['name'] != 'Nationality' and perbooking['name'] != 'Full name' and perbooking['name'] != 'Gender' and perbooking['name'] != 'Date of birth':
                if perbooking['inputType'] == 1:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })
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
                        "value": request.POST['perbooking' + str(idx)],
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
                elif perbooking['inputType'] == 50:
                    perbooking_list.append({
                        "uuid": perbooking['uuid'],
                        "value": request.POST['perbooking' + str(idx)],
                        "name": perbooking['name']
                    })

        request.session['activity_perbooking'] = perbooking_list
        request.session['activity_upload'] = upload

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        request.session['activity_request'].update({
            'adult_passenger_count': len(adult),
            'infant_passenger_count': len(infant),
            'child_passenger_count': len(child),
            'senior_passenger_count': len(senior),
        })

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'adult_title': adult_title,
            'infant_title': infant_title,
            'additional_price': request.POST.get('additional_price') and request.POST['additional_price'] or 0,
            'countries': airline_country,
            'response': request.session['activity_pick'],
            'pax_count': pax_count,
            'adult_count': len(adult),
            'infant_count': len(infant),
            'child_count': len(child),
            'senior_count': len(senior),
            'adults': adult,
            'infants': infant,
            'seniors': senior,
            'childs': child,
            'price': request.session['activity_request']['activity_date_data'][int(request.POST['event_pick'])][int(request.POST['activity_date_pick'])],
            'detail': request.session['activity_request']['activity_types_data'][int(request.POST['activity_type_pick'])],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }

        for temp_sku in json.loads(request.POST['details_data'])[int(request.POST['activity_type_pick'])]['skus']:
            low_sku_id = temp_sku['sku_id'].lower()
            values.update({
                low_sku_id+'_count': pax_count.get(low_sku_id) and int(pax_count[low_sku_id]) or 0,
            })

        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_passenger_templates.html', values)
    else:
        return no_session_logout()


def review(request):
    if 'user_account' in request.session._session:
        #adult
        adult = []
        child = []
        infant = []
        senior = []
        contact = []
        upload = []
        skus = []
        all_pax = []
        used_price = []

        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        template, logo = get_logo_template()

        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'nationality_code': request.POST['booker_nationality'],
            'email': request.POST['booker_email'],
            'calling_code': request.POST['booker_phone_code'],
            'mobile': request.POST['booker_phone'],
            'booker_id': request.POST['booker_id']
        }

        perpax_list = []
        perpax_list_temp = []
        for i in range(int(request.session['activity_request']['adult_passenger_count'])):
            print(request.POST['adult_title'+str(i+1)])

            adult.append({
                "first_name": request.POST['adult_first_name'+str(i+1)],
                "last_name": request.POST['adult_last_name'+str(i+1)],
                "nationality_code": request.POST['adult_nationality'+str(i+1)],
                "title": request.POST['adult_title'+str(i+1)],
                "pax_type": "ADT",
                "pax_type_str": "Adult",
                "birth_date": request.POST['adult_birth_date'+str(i+1)],
                "passport_number": request.POST.get('adult_passport_number' + str(i + 1)) and request.POST['adult_passport_number' + str(i + 1)] or '',
                "passport_expdate": request.POST.get('adult_passport_expired_date' + str(i + 1)) and request.POST['adult_passport_expired_date' + str(i + 1)] or '',
                "country_of_issued_code": request.POST.get('adult_country_of_issued' + str(i + 1)) and request.POST['adult_country_of_issued' + str(i + 1)] or '',
                "passenger_id": request.POST['adult_id'+str(i+1)],
                "sku_id": request.POST['adult_sku_id'+str(i+1)],
                "sku_title": request.POST['adult_sku_title' + str(i + 1)],
                "sku_real_id": request.POST['adult_sku_real_id' + str(i + 1)],
                "calling_code": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone_code' + str(i + 1)],
                "mobile": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone' + str(i + 1)] or ' - ',
                "email": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_email' + str(i + 1)] or ' - ',
                "is_cp": request.POST.get('adult_cp' + str(i + 1)),
            })

            # perpax
            for idx, perpax in enumerate(request.session['activity_request']['activity_types_data'][
                                             int(request.session['activity_request']['activity_type_pick'])]['options'][
                                             'perPax']):
                if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax[
                    'name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth' and \
                        perpax['name'] != 'Passport number' and perpax['name'] != 'Passport expiry date':
                    if perpax['inputType'] == 1:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 2:
                        for j, item in enumerate(perpax['items']):
                            try:
                                if request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1) + ' ' + str(j)] == 'true':
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
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 4:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 5:
                        if request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)] == 'on':
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
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 7:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(
                                request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type":
                                request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[
                                    0]
                        })
                        print('a')
                    elif perpax['inputType'] == 8:
                        # upload
                        upload.append({
                            "uuid": perpax['uuid'],
                            "value": base64.b64encode(
                                request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].read()),
                            "name": perpax['name'],
                            "type":
                                request.FILES['adult_perpax' + str(i + 1) + '_' + str(idx + 1)].content_type.split('/')[
                                    0]
                        })
                        print('a')
                    elif perpax['inputType'] == 9:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 10:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 11:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 12:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 13:
                        print('deprecated')
                    elif perpax['inputType'] == 14:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 50:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['adult_perpax' + str(i + 1) + '_' + str(idx + 1)],
                            "name": perpax['name']
                        })
                elif perpax['name'] == 'Guest age':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": int(request.POST['adult_years_old' + str(i + 1)]),
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Nationality':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['adult_nationality' + str(i + 1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Full name':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['adult_title' + str(i + 1)] + ' ' + request.POST[
                            'adult_first_name' + str(i + 1)] + ' ' + request.POST['adult_last_name' + str(i + 1)],
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
                        "value": request.POST['adult_birth_date' + str(i + 1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Passport number':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['adult_passport_number' + str(i + 1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Passport expiry date':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['adult_passport_expired_date' + str(i + 1)],
                        "name": perpax['name']
                    })
            if perpax_list_temp:
                perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

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
                        "nationality_code": request.POST['adult_nationality' + str(i + 1)],
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
                'nationality_code': request.POST['booker_nationality'],
                'contact_id': request.POST['booker_id'],
                'is_also_booker': True
            })

        #senior
        for i in range(int(request.session['activity_request']['senior_passenger_count'])):
            print(request.POST['senior_title'+str(i+1)])

            senior.append({
                "first_name": request.POST['senior_first_name'+str(i+1)],
                "last_name": request.POST['senior_last_name'+str(i+1)],
                "nationality_code": request.POST['senior_nationality'+str(i+1)],
                "title": request.POST['senior_title'+str(i+1)],
                "pax_type": "YCD",
                "pax_type_str": "Senior",
                "birth_date": request.POST['senior_birth_date'+str(i+1)],
                "passport_number": request.POST.get('senior_passport_number' + str(i + 1)) and request.POST['senior_passport_number' + str(i + 1)] or '',
                "passport_expdate": request.POST.get('senior_passport_expired_date' + str(i + 1)) and request.POST['senior_passport_expired_date' + str(i + 1)] or '',
                "country_of_issued_code": request.POST.get('senior_country_of_issued' + str(i + 1)) and request.POST['senior_country_of_issued' + str(i + 1)] or '',
                "passenger_id": request.POST['senior_id'+str(i+1)],
                "sku_id": request.POST['senior_sku_id' + str(i + 1)],
                "sku_title": request.POST['senior_sku_title' + str(i + 1)],
                "sku_real_id": request.POST['senior_sku_real_id' + str(i + 1)],
            })

            # perpax
            for idx, perpax in enumerate(request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
                if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth' and perpax['name'] != 'Passport number' and perpax['name'] != 'Passport expiry date':
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
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 12:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 13:
                        print('deprecated')
                    elif perpax['inputType'] == 14:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['senior_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 50:
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
                elif perpax['name'] == 'Passport number':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['senior_passport_number'+str(i+1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Passport expiry date':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['senior_passport_expired_date'+str(i+1)],
                        "name": perpax['name']
                    })
            if perpax_list_temp:
                perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

        #child
        for i in range(int(request.session['activity_request']['child_passenger_count'])):
            child.append({
                "first_name": request.POST['child_first_name'+str(i+1)],
                "last_name": request.POST['child_last_name'+str(i+1)],
                "nationality_code": request.POST['child_nationality'+str(i+1)],
                "title": request.POST['child_title'+str(i+1)],
                "pax_type": "CHD",
                "pax_type_str": "Child",
                "birth_date": request.POST['child_birth_date'+str(i+1)],
                "passport_number": request.POST.get('child_passport_number' + str(i + 1)) and request.POST['child_passport_number' + str(i + 1)] or '',
                "passport_expdate": request.POST.get('child_passport_expired_date' + str(i + 1)) and request.POST['child_passport_expired_date' + str(i + 1)] or '',
                "country_of_issued_code": request.POST.get('child_country_of_issued' + str(i + 1)) and request.POST['child_country_of_issued' + str(i + 1)] or '',
                "passenger_id": request.POST['child_id'+str(i+1)],
                "sku_id": request.POST['child_sku_id' + str(i + 1)],
                "sku_title": request.POST['child_sku_title' + str(i + 1)],
                "sku_real_id": request.POST['child_sku_real_id' + str(i + 1)],
            })

            # perpax
            for idx, perpax in enumerate(request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['options']['perPax']):
                if perpax['name'] != 'Guest age' and perpax['name'] != 'Nationality' and perpax['name'] != 'Full name' and perpax['name'] != 'Gender' and perpax['name'] != 'Date of birth' and perpax['name'] != 'Passport number' and perpax['name'] != 'Passport expiry date':
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
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 12:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 13:
                        print('deprecated')
                    elif perpax['inputType'] == 14:
                        perpax_list_temp.append({
                            "uuid": perpax['uuid'],
                            "value": request.POST['child_perpax' + str(i+1) + '_' + str(idx+1)],
                            "name": perpax['name']
                        })
                    elif perpax['inputType'] == 50:
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
                    if request.POST['child_title' + str(i + 1)] == 'MSTR':
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
                elif perpax['name'] == 'Passport number':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['child_passport_number'+str(i+1)],
                        "name": perpax['name']
                    })
                elif perpax['name'] == 'Passport expiry date':
                    perpax_list_temp.append({
                        "uuid": perpax['uuid'],
                        "value": request.POST['child_passport_expired_date'+str(i+1)],
                        "name": perpax['name']
                    })
            if perpax_list_temp:
                perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

        #infant
        for i in range(int(request.session['activity_request']['infant_passenger_count'])):
            infant.append({
                "first_name": request.POST['infant_first_name'+str(i+1)],
                "last_name": request.POST['infant_last_name'+str(i+1)],
                "nationality_code": request.POST['infant_nationality'+str(i+1)],
                "title": request.POST['infant_title'+str(i+1)],
                "pax_type": "INF",
                "pax_type_str": "Infant",
                "birth_date": request.POST['infant_birth_date'+str(i+1)],
                "passport_number": request.POST.get('infant_passport_number' + str(i + 1)) and request.POST['infant_passport_number' + str(i + 1)] or '',
                "passport_expdate": request.POST.get('infant_passport_expired_date' + str(i + 1)) and request.POST['infant_passport_expired_date' + str(i + 1)] or '',
                "country_of_issued_code": request.POST.get('infant_country_of_issued' + str(i + 1)) and request.POST['infant_country_of_issued' + str(i + 1)] or '',
                "passenger_id": request.POST['infant_id'+str(i+1)],
                "sku_id": request.POST['infant_sku_id' + str(i + 1)],
                "sku_title": request.POST['infant_sku_title' + str(i + 1)],
                "sku_real_id": request.POST['infant_sku_real_id' + str(i + 1)],
            })

            if perpax_list_temp:
                perpax_list.append(perpax_list_temp)
            perpax_list_temp = []

        request.session['activity_perpax'] = perpax_list

        for rec in adult:
            all_pax.append(rec)
        for rec in senior:
            all_pax.append(rec)
        for rec in child:
            all_pax.append(rec)
        for rec in infant:
            all_pax.append(rec)

        pax_count = {}
        no_low_pax_count = {}
        for temp_sku in request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['skus']:
            low_sku_id = temp_sku['sku_id'].lower()
            skus.append({
                'id': temp_sku['id'],
                'sku_id': low_sku_id,
                'pax_type': temp_sku['pax_type'],
                'title': temp_sku['title'],
                'amount': int(request.session['activity_request'][low_sku_id+'_passenger']),
            })
            pax_count.update({
                low_sku_id: int(request.session['activity_request'][low_sku_id+'_passenger'])
            })
            no_low_pax_count.update({
                temp_sku['sku_id']: int(request.session['activity_request'][low_sku_id+'_passenger'])
            })

        try:
            event_id = request.session['activity_price']['result']['response'][int(request.session['activity_request']['event_pick'])][0].get('name') or False
        except:
            event_id = False

        timeslot = False
        if request.session['activity_request'].get('activity_timeslot'):
            for time in request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['timeslots']:
                if time['uuid'] == request.session['activity_request']['activity_timeslot']:
                    timeslot = time

        all_price = request.session['activity_price']['result']['response'][int(request.session['activity_request']['event_pick'])][int(request.session['activity_request']['activity_date_pick'])]

        for temp_key, temp_val in no_low_pax_count.items():
            if temp_val != 0 and temp_key not in ['Infant']:
                if all_price['prices'][temp_key].get(str(temp_val)):
                    temp_used_price = copy.deepcopy(all_price['prices'][temp_key][str(temp_val)]['service_charges'])
                else:
                    temp_used_price = copy.deepcopy(all_price['prices'][temp_key]['1']['service_charges'])

                for temp_sc in temp_used_price:
                    temp_sc.update({
                        'sku_id': str(temp_key)
                    })
                used_price.append(temp_used_price)

        search_request = {
            "instantConfirmation": True,
            "activity_uuid": request.session['activity_request']['activity_uuid'],
            "product_type_uuid": request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['uuid'],
            "product_type_title": request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['name'],
            "adult": len(adult),
            "senior": len(senior),
            "child": len(child),
            "infant": len(infant),
            'skus': skus,
            "name": request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])]['name'],
            "visit_date": request.session['activity_price']['result']['response'][int(request.session['activity_request']['event_pick'])][int(request.session['activity_request']['activity_date_pick'])]['date'],
            "timeslot": timeslot and timeslot or False,
            "event_id": event_id,
            "provider": request.session['activity_pick']['provider']
        }

        request.session['activity_review_booking'] = {
            'all_pax': all_pax,
            'contacts': contact,
            'booker': booker,
            'adult': adult,
            'senior': senior,
            'child': child,
            'infant': infant,
            'skus': skus,
            'upload_value': upload,
            'pricing': used_price,
            'search_request': search_request
        }

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'additional_price': request.POST['additional_price'],
            'response': request.session['activity_pick'],
            'perBooking': request.session['activity_perbooking'],
            'perPax': request.session['activity_perpax'],
            'pax_count': pax_count,
            'adult_count': len(adult),
            'infant_count': len(infant),
            'child_count': len(child),
            'senior_count': len(senior),
            'contact_person': contact,
            'all_pax': all_pax,
            'booker': booker,
            'adults': adult,
            'infants': infant,
            'seniors': senior,
            'childs': child,
            'skus': skus,
            "timeslot": timeslot and timeslot or False,
            'price': all_price,
            'detail': request.session['activity_request']['activity_types_data'][int(request.session['activity_request']['activity_type_pick'])],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME+'/activity/tt_website_skytors_activity_review_templates.html', values)
    else:
        return no_session_logout()


def booking(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        template, logo = get_logo_template()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'order_number': request.POST['order_number'],
            'username': request.session['user_account'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME + '/activity/tt_website_skytors_activity_booking_templates.html', values)
    else:
        return no_session_logout()
