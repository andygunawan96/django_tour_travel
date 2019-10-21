from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from .tt_website_skytors_views import *
from tt_webservice.views.tt_webservice_agent_views import *
from django.utils import translation
import json
from datetime import *

MODEL_NAME = 'tt_website_skytors'
# _dest_env = TtDestinations()


# Create your views here.

def search(request):
    javascript_version = get_cache_version()
    template, logo = get_logo_template()

    try:
        visa_request = {
            'destination': request.POST['visa_destination_id'],
            'departure': request.POST['visa_departure'],
            'consulate': request.POST['visa_consulate_id'],
        }
        request.session['visa_request'] = visa_request
    except:
        visa_request = request.session['visa_request']

    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME),
        'visa_request': visa_request,
        'signature': request.session['signature'],
        # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        'username': request.session['user_account'],
        'static_path_url_server': get_url_static_path(),
        'javascript_version': javascript_version,
        'logo': logo,
        'template': template
    }
    return render(request, MODEL_NAME+'/visa/tt_website_skytors_visa_search_templates.html', values)

def passenger(request):
    javascript_version = get_cache_version()
    template, logo = get_logo_template()

    list_visa = request.session['visa_search']
    count = 0
    pax_count = 0
    pax = {
        'adult': 0,
        'child': 0,
        'infant': 0,
        'elder': 0
    }
    response = get_cache_data(javascript_version)

    # agent
    adult_title = ['MR', 'MRS', 'MS']

    infant_title = ['MSTR', 'MISS']

    id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

    # agent

    airline_country = response['result']['response']['airline']['country']

    # airline_carriers = response['result']['response']['airline']['carriers']

    adult = []
    infant = []
    child = []
    elder = []
    sell_journey = []
    for visa in list_visa['result']['response']['list_of_visa']:

        pax_count = 0
        try:
            pax_count = int(request.POST['qty_pax_'+str(count)])
            sell_journey.append({
                'pax': int(request.POST['qty_pax_'+str(count)]),
                'id': visa['id']
            })
        except:
            try:
                pax_count = visa['total_pax']
            except:
                pass
        visa['total_pax'] = pax_count
        if visa['pax_type'][0] == 'ADT':
            pax.update({
                'adult': pax['adult']+pax_count
            })
            for i in range(pax_count):
                adult.append('')
        elif visa['pax_type'][0] == 'CHD':
            pax.update({
                'child': pax['child']+pax_count
            })
            for i in range(pax_count):
                child.append('')
        elif visa['pax_type'][0] == 'INF':
            pax.update({
                'infant': pax['infant']+pax_count
            })
            for i in range(pax_count):
                infant.append('')
        elif visa['pax_type'][0] == 'YCD':
            pax.update({
                'senior': pax['elder']+pax_count
            })
            for i in range(pax_count):
                elder.append('')
        count = count + 1
    request.session['visa_sell'] = sell_journey
    request.session['visa_passenger'] = pax
    request.session['visa_search'] = list_visa
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME),
        'visa': request.session['visa_search']['result']['response'],
        'passengers': pax,
        'signature': request.session['visa_signature'],
        'countries': airline_country,
        'adults': adult,
        'childs': child,
        'infants': infant,
        'static_path_url_server': get_url_static_path(),
        'adult_title': adult_title,
        'infant_title': infant_title,
        'id_types': id_type,
        'visa_request': request.session['visa_request'],
        # 'visa_request': visa_request,
        # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        'username': request.session['user_account'],
        'javascript_version': javascript_version,
        'logo': logo,
        'template': template
    }
    return render(request, MODEL_NAME+'/visa/tt_website_skytors_visa_passenger_templates.html', values)

def review(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        template, logo = get_logo_template()

        # get_balance(request)
        adult = []
        child = []
        infant = []
        contact = []
        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'email': request.POST['booker_email'],
            'calling_code': request.POST['booker_phone_code'],
            'mobile': request.POST['booker_phone'],
            'nationality_name': request.POST['booker_nationality'],
            'booker_seq_id': request.POST['booker_id']
        }
        try:
            for i in range(int(request.session['visa_passenger']['adult'])):
                adult.append({
                    "pax_type": "ADT",
                    "first_name": request.POST['adult_first_name' + str(i + 1)],
                    "last_name": request.POST['adult_last_name' + str(i + 1)],
                    "title": request.POST['adult_title' + str(i + 1)],
                    "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                    "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                    "identity_country_of_issued_name": request.POST['adult_country_of_issued' + str(i + 1)],
                    "identity_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                    "identity_number": request.POST['adult_passport_number' + str(i + 1)],
                    "identity_type": "passport",
                    "passenger_seq_id": request.POST['adult_id' + str(i + 1)]
                })

                if i == 0:
                    if request.POST['myRadios'] == 'true':
                        adult[len(adult) - 1].update({
                            'is_booker': True
                        })
                    else:
                        adult[len(adult) - 1].update({
                            'is_booker': False
                        })
                else:
                    adult[len(adult) - 1].update({
                        'is_booker': False
                    })
                try:
                    if request.POST['passenger_cp' + str(i)] == 'true':
                        adult[len(adult) - 1].update({
                            'is_contact': True
                        })
                    else:
                        adult[len(adult) - 1].update({
                            'is_contact': False
                        })
                except:
                    adult[len(adult) - 1].update({
                        'is_contact': False
                    })
                try:
                    if request.POST['adult_cp' + str(i + 1)] == 'on':
                        contact.append({
                            "first_name": request.POST['adult_first_name' + str(i + 1)],
                            "last_name": request.POST['adult_last_name' + str(i + 1)],
                            "title": request.POST['adult_title' + str(i + 1)],
                            "email": request.POST['adult_email' + str(i + 1)],
                            "calling_code": request.POST['adult_calling_code' + str(i + 1)],
                            "mobile": request.POST['adult_mobile' + str(i + 1)],
                            "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                            "contact_seq_id": request.POST['adult_id' + str(i + 1)]
                        })
                    if i == 0:
                        if request.POST['myRadios'] == 'yes':
                            contact[len(contact)].update({
                                'is_booker': True
                            })
                        else:
                            contact[len(contact)].update({
                                'is_booker': False
                            })
                except:
                    pass
        except:
            pass

        if len(contact) == 0:
            contact.append({
                'title': request.POST['booker_title'],
                'first_name': request.POST['booker_first_name'],
                'last_name': request.POST['booker_last_name'],
                'email': request.POST['booker_email'],
                'calling_name': request.POST['booker_phone_code'],
                'mobile': request.POST['booker_phone'],
                'nationality_name': request.POST['booker_nationality'],
                'contact_seq_id': request.POST['booker_id'],
                'is_booker': True
            })

        try:
            for i in range(int(request.session['visa_passenger']['child'])):
                child.append({
                    "pax_type": "CHD",
                    "first_name": request.POST['child_first_name' + str(i + 1)],
                    "last_name": request.POST['child_last_name' + str(i + 1)],
                    "title": request.POST['child_title' + str(i + 1)],
                    "birth_date": request.POST['child_birth_date' + str(i + 1)],
                    "nationality_name": request.POST['child_nationality' + str(i + 1)],
                    "identity_number": request.POST['child_passport_number' + str(i + 1)],
                    "identity_expdate": request.POST['child_passport_expired_date' + str(i + 1)],
                    "identity_country_of_issued_name": request.POST['child_country_of_issued' + str(i + 1)],
                    "identity_type": "passport",
                    "passenger_seq_id": request.POST['child_id' + str(i + 1)]


                })
        except:
            pass

        try:
            for i in range(int(request.session['visa_passenger']['infant'])):
                infant.append({
                    "pax_type": "INF",
                    "first_name": request.POST['infant_first_name' + str(i + 1)],
                    "last_name": request.POST['infant_last_name' + str(i + 1)],
                    "title": request.POST['infant_title' + str(i + 1)],
                    "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                    "nationality_name": request.POST['infant_nationality' + str(i + 1)],
                    "identity_number": request.POST['infant_passport_number' + str(i + 1)],
                    "identity_expdate": request.POST['infant_passport_expired_date' + str(i + 1)],
                    "identity_country_of_issued_name": request.POST['infant_country_of_issued' + str(i + 1)],
                    "identity_type": "passport",
                    "passenger_seq_id": request.POST['infant_id' + str(i + 1)]
                })
        except:
            pass



        request.session['visa_create_passengers'] = {
            'booker': booker,
            'adult': adult,
            'child': child,
            'infant': infant,
            'contact': contact
        }
        pax = request.session['visa_create_passengers']

        count = 1
        for i in pax:
            if i != 'booker' and i != 'contact':
                for passenger in pax[i]:
                    passenger.update({
                        'number': count
                    })
                    count = count + 1

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'visa': request.session['visa_search']['result']['response'],
            'type': request.session['list_of_visa_type'],
            'visa_request': request.session['visa_request'],
            'passengers': pax,
            'static_path_url_server': get_url_static_path(),
            'signature': request.session['visa_signature'],
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'logo': logo,
            'template': template
            # 'co_uid': request.session['co_uid'],
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/visa/tt_website_skytors_visa_review_templates.html', values)
    else:
        return no_session_logout()

def booking(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        template, logo = get_logo_template()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['user_account'],
            'order_number': request.POST['order_number'],
            'javascript_version': javascript_version,
            'static_path_url_server': get_url_static_path(),
            'logo': logo,
            'template': template
            # 'order_number': 'VS.19072500003',
            # 'cookies': json.dumps(res['result']['cookies']),
        }
        return render(request, MODEL_NAME+'/visa/tt_website_skytors_visa_booking_templates.html', values)
    else:
        return no_session_logout()