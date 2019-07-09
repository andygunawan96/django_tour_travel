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

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def search(request):
    if 'user_account' in request.session._session:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        # airline
        airline_destinations = []
        for country in response['result']['response']['airline']['destination']:
            for des in response['result']['response']['airline']['destination'][country]:
                des.update({
                    'country': country
                })
                airline_destinations.append(des)

        airline_country = response['result']['response']['airline']['country']

        airline_carriers = response['result']['response']['airline']['carriers']

        airline_carriers.pop('SO')
        airline_carriers.pop('E9')
        airline_carriers.pop('7L')
        airline_carriers.pop('UD')

        airline_provider_list = [
            {
                'value': 'all',
                'name': 'All'
            }, {
                'value': 'amadeus',
                'name': 'Amadeus'
            }, {
                'value': 'sabre',
                'name': 'GDS (IATA)'
            }, {
                'value': 'altea',
                'name': 'Garuda Al'
            }, {
                'value': 'garuda',
                'name': 'Garuda AGS'
            }, {
                'value': 'airasia',
                'name': 'Air Asia'
            }, {
                'value': 'citilink',
                'name': 'Citilink'
            }, {
                'value': 'jetstar',
                'name': 'Jetstar'
            }, {
                'value': 'lionair',
                'name': 'Lion Air'
            }, {
                'value': 'sriwijaya',
                'name': 'Sriwijaya'
            }, {
                'value': 'trigana',
                'name': 'Trigana'
            }, {
                'value': 'transnusa',
                'name': 'Transnusa'
            }, {
                'value': 'scoot',
                'name': 'Scoot'
            }, {
                'value': 'xpress_scrap',
                'name': 'Xpress'
            }
        ]

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

        providers = []
        try:
            try:
                if request.POST['radio_airline_type'] == 'roundtrip':
                    direction = 'RT'
                    return_date = request.POST['airline_return']
                else:
                    direction = 'OW'
                    return_date = request.POST['airline_departure']
                    print('no return')
            except:
                direction = 'OW'
                return_date = request.POST['airline_departure']
                print('no return')

            try:
                if request.POST['is_combo_price'] == '':
                    is_combo_price = 'true'
            except:
                is_combo_price = 'false'


            for provider in airline_provider_list:
                try:
                    providers.append(request.POST['provider_box_'+provider['value']])

                except:
                    print('%s %s' % ('no ', provider))



            airline_request = {
                'origin': request.POST['origin_id_flight'],
                'destination': request.POST['destination_id_flight'],
                'departure': request.POST['airline_departure'],
                'return': return_date,
                'direction': direction,
                'adult': int(request.POST['adult_flight']),
                'child': int(request.POST['child_flight']),
                'infant': int(request.POST['infant_flight']),
                'cabin_class': request.POST['cabin_class_flight'],
                'provider': providers,
                'is_combo_price': is_combo_price,
                'carrier_codes': []
            }
        except:
            airline_request = request.session['airline_request']

        check = 2
        flight = ''
        for list_airline in airline_destinations:
            if list_airline['name'] == airline_request['origin'].split(' - ')[0] or list_airline['name'] == airline_request['destination'].split(' - ')[0] or list_airline['code'] == airline_request['origin'].split(' - ')[0] or list_airline['code'] == airline_request['destination'].split(' - ')[0] or list_airline['city'] == airline_request['origin'].split(' - ')[0] or list_airline['city'] == airline_request['destination'].split(' - ')[0]:
                if list_airline['country'] == 'Indonesia':
                    if flight == 'domestic' or flight == '':
                        flight = 'domestic'
                else:
                    flight = 'international'
                check -= 1
            if check == 0:
                break

        airline_request['flight'] = flight
        request.session['airline_request'] = airline_request
        # get_balance(request)


        # airline

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser



        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'journeys': journeys,
            'airline_request': airline_request,
            'airline_destinations': airline_destinations,
            'flight': flight,
            'airline_provider_list': airline_provider_list,
            'airline_cabin_class_list': airline_cabin_class_list,
            'airline_carriers': airline_carriers,
            'username': request.session['user_account'],
            # 'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_search_templates.html', values)
    else:
        return index(request)

def passenger(request):
    if 'user_account' in request.session._session:
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

        airline_carriers = response['result']['response']['airline']['carriers']

        airline_carriers.pop('SO')
        airline_carriers.pop('E9')
        airline_carriers.pop('7L')
        airline_carriers.pop('UD')

        # get_balance(request)

        #pax
        adult = []
        infant = []
        child = []
        for i in range(int(request.session['airline_request']['adult'])):
            adult.append('')
        for i in range(int(request.session['airline_request']['child'])):
            child.append('')
        for i in range(int(request.session['airline_request']['infant'])):
            infant.append('')
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            request.session['airline_pick'] = request.POST['airline_pick']
        except:
            pass
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'countries': airline_country,
            'airline_request': request.session['airline_request'],
            'price': request.session['airline_price_itinerary'],
            'airline_carriers': airline_carriers,
            'airline_pick': request.session['airline_pick'],
            'adults': adult,
            'childs': child,
            'infants': infant,
            'adult_title': adult_title,
            'infant_title': infant_title,
            'id_types': id_type,
            'username': request.session['user_account'],
            # 'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_passenger_templates.html', values)
    else:
        return index(request)

def ssr(request):
    if 'user_account' in request.session._session:
        file = open(str(datetime.now().date()) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        adult = []
        child = []
        infant = []
        passenger = []
        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'nationality_code': request.POST['booker_nationality'],
            'country_code': request.POST['booker_nationality'],
            'email': request.POST['booker_email'],
            'work_phone': request.POST['booker_phone_code'] + request.POST['booker_phone'],
            'home_phone': request.POST['booker_phone_code'] + request.POST['booker_phone'],
            'other_phone': request.POST['booker_phone_code'] + request.POST['booker_phone'],
            'postal_code': 0,
            "city": request.session._session['company_details']['city'],
            "province_state": request.session._session['company_details']['state'],
            'address': request.session['company_details']['address'],
            'mobile': request.POST['booker_phone_code'] + request.POST['booker_phone'],
            'agent_id': int(request.session['agent']['id']),
            'booker_id': request.POST['booker_id']
        }
        # "city": this.state.city_agent,
        # "province_state": this.state.state_agent,
        # "contact_id": "",

        for i in range(int(request.session['airline_request']['adult'])):

            adult.append({
                "first_name": request.POST['adult_first_name' + str(i + 1)],
                "last_name": request.POST['adult_last_name' + str(i + 1)],
                "name": request.POST['adult_first_name' + str(i + 1)] + " " + request.POST['adult_last_name' + str(i + 1)],
                "nationality_code": request.POST['adult_nationality' + str(i + 1)],
                "title": request.POST['adult_title' + str(i + 1)],
                "pax_type": "ADT",
                "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                "passport_number": request.POST['adult_passport_number' + str(i + 1)],
                "passport_expdate":request.POST['adult_passport_expired_date' + str(i + 1)],
                "country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['adult_id' + str(i + 1)]
            })
            passenger.append({
                "first_name": request.POST['adult_first_name' + str(i + 1)],
                "last_name": request.POST['adult_last_name' + str(i + 1)],
                "name": request.POST['adult_first_name' + str(i + 1)] + " " + request.POST['adult_last_name' + str(i + 1)],
                "nationality_code": request.POST['adult_nationality' + str(i + 1)],
                "title": request.POST['adult_title' + str(i + 1)],
                "pax_type": "ADT",
                "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                "passport_number": request.POST['adult_passport_number' + str(i + 1)],
                "passport_expdate":request.POST['adult_passport_expired_date' + str(i + 1)],
                "country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['adult_id' + str(i + 1)]
            })
        for i in range(int(request.session['airline_request']['child'])):
            child.append({
                "first_name": request.POST['child_first_name' + str(i + 1)],
                "last_name": request.POST['child_last_name' + str(i + 1)],
                "name": request.POST['child_first_name' + str(i + 1)] + " " + request.POST['child_last_name' + str(i + 1)],
                "nationality_code": request.POST['child_nationality' + str(i + 1)],
                "title": request.POST['child_title' + str(i + 1)],
                "pax_type": "CHD",
                "birth_date": request.POST['child_birth_date' + str(i + 1)],
                "passport_number": request.POST['child_passport_number' + str(i + 1)],
                "passport_expdate":request.POST['child_passport_expired_date' + str(i + 1)],
                "country_of_issued_code": request.POST['child_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['child_id' + str(i + 1)]
            })
            passenger.append({
                "first_name": request.POST['child_first_name' + str(i + 1)],
                "last_name": request.POST['child_last_name' + str(i + 1)],
                "name": request.POST['child_first_name' + str(i + 1)] + " " + request.POST['child_last_name' + str(i + 1)],
                "nationality_code": request.POST['child_nationality' + str(i + 1)],
                "title": request.POST['child_title' + str(i + 1)],
                "pax_type": "CHD",
                "birth_date": request.POST['child_birth_date' + str(i + 1)],
                "passport_number": request.POST['child_passport_number' + str(i + 1)],
                "passport_expdate": request.POST['child_passport_expired_date' + str(i + 1)],
                "country_of_issued_code": request.POST['child_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['child_id' + str(i + 1)]
            })
        for i in range(int(request.session['airline_request']['infant'])):
            infant.append({
                "first_name": request.POST['infant_first_name' + str(i + 1)],
                "last_name": request.POST['infant_last_name' + str(i + 1)],
                "name": request.POST['infant_first_name' + str(i + 1)] + " " + request.POST['infant_last_name' + str(i + 1)],
                "nationality_code": request.POST['infant_nationality' + str(i + 1)],
                "title": request.POST['infant_title' + str(i + 1)],
                "pax_type": "INF",
                "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                "passport_number": request.POST['infant_passport_number' + str(i + 1)],
                "passport_expdate":request.POST['infant_passport_expired_date' + str(i + 1)],
                "country_of_issued_code": request.POST['infant_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['infant_id' + str(i + 1)]
            })

        request.session['airline_create_passengers'] = {
            'booker': booker,
            'adult': adult,
            'child': child,
            'infant': infant,
        }

        airline_carriers = response['result']['response']['airline']['carriers']

        airline_carriers.pop('SO')
        airline_carriers.pop('E9')
        airline_carriers.pop('7L')
        airline_carriers.pop('UD')

        # agent
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        # agent

        get_balance(request)

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_request': request.session['airline_request'],
            'price': request.session['airline_price_itinerary'],
            'airline_carriers': airline_carriers,
            # 'airline_destinations': airline_destinations,
            'airline_pick': request.session['airline_pick'],
            'airline_ssrs': request.session['airline_ssr'],
            'passengers': passenger,
            'username': request.session['user_account'],
            'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_ssr_templates.html', values)
    else:
        return index(request)

def review(request):
    if 'user_account' in request.session._session:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        ssr_code = []
        ssr = []
        passenger = []
        ssr_segment = []
        segment_code = ''
        try:
            for pax in range(int(request.session['airline_request']['adult']) + int(request.session['airline_request']['child']) + int(request.session['airline_request']['infant'])):
                for counter, baggage in enumerate(request.session['airline_ssr']['ssr_codes']['baggage_per_route']):
                    for segment_idx, temp in enumerate(baggage['segment_code_list']):
                        try:
                            if request.session['airline_ssr']['ssr_codes']['baggage_per_route'][counter]['segment_code_list'][segment_idx]:
                                segment_code = request.session['airline_ssr']['ssr_codes']['baggage_per_route'][counter]['segment_code_list'][segment_idx]
                        except:
                            try:
                                if request.session['airline_ssr']['ssr_codes']['equip_per_route'][counter]['segment_code_list'][segment_idx]:
                                    segment_code = request.session['airline_ssr']['ssr_codes']['equip_per_route'][counter]['segment_code_list'][segment_idx]
                            except:
                                try:
                                    if request.session['airline_ssr']['ssr_codes']['for_free_per_route'][counter]['segment_code_list'][segment_idx]:
                                        segment_code = request.session['airline_ssr']['ssr_codes']['for_free_per_route'][counter]['segment_code_list'][segment_idx]
                                except:
                                    print('no segment code')
                        for idx, baggage in enumerate(request.session['airline_ssr']['ssr_codes']['baggage_per_route']):
                            for code in baggage['ssr_codes']:
                                if request.POST['baggage' + str(int(idx) + 1) + '_' + str(int(pax) + 1)] == code['ssr_code']:
                                    ssr_code.append(code)
                                    break
                            for code in request.session['airline_ssr']['ssr_codes']['meal_per_segment'][segment_idx]['ssr_codes']:
                                if request.POST['meal'+str(int(segment_idx)+1)+'_'+str(int(pax)+1)] == code['ssr_code']:
                                    ssr_code.append(code)
                                    break
                        for idx, equip in enumerate(request.session['airline_ssr']['ssr_codes']['equip_per_route']):
                            for code in equip['ssr_codes']:
                                if request.POST['equip'+str(int(idx)+1)+'_'+str(int(pax)+1)] == code['ssr_code']:
                                    ssr_code.append(code)
                                    break
                        for idx, for_free in enumerate(request.session['airline_ssr']['ssr_codes']['for_free_per_route']):
                            for code in for_free['ssr_codes']:
                                if request.POST['for_free'+str(int(idx)+1)+'_'+str(int(pax)+1)] == code['ssr_code']:
                                    ssr_code.append(code)
                                    break
                        ssr_segment.append({
                            "segment_code": segment_code,
                            "passengers": {
                                "passenger_number": pax,
                                "ssr_codes": ssr_code
                            }
                        })
                        segment_code = ''
                        ssr_code = []
                ssr.append(ssr_segment)
                ssr_segment = []
        except:
            print('no ssr')
        # agent
        # TODO LIST INTRO SSR sudah list perpassenger --> list per segment --> isi semua ssr tinggal dipisah
        #tampilkan ssr ke depan & pisah send api

        # get_balance(request)
        request.session['airline_request_ssr'] = ssr
        if request.META.get('HTTP_REFERER') == get_url()+'airline/passenger':
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
                'nationality_code': request.POST['booker_nationality'],
                'booker_id': request.POST['booker_id']
            }
            for i in range(int(request.session['airline_request']['adult'])):
                adult.append({
                    "pax_type": "ADT",
                    "first_name": request.POST['adult_first_name' + str(i + 1)],
                    "last_name": request.POST['adult_last_name' + str(i + 1)],
                    "title": request.POST['adult_title' + str(i + 1)],
                    "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                    "nationality_code": request.POST['adult_nationality' + str(i + 1)],
                    "country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1)],
                    "passport_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                    "passport_number": request.POST['adult_passport_number' + str(i + 1)],
                    "passenger_id": request.POST['adult_id' + str(i + 1)]
                })
                if i == 0:
                    try:
                        if request.POST['adult_cp' + str(i + 1)] == 'on':
                            adult[0].update({
                                "is_contact": True
                            })
                        else:
                            adult[0].update({
                                "is_contact": False
                            })
                    except:
                        adult[0].update({
                            "is_contact": False
                        })
                    if request.POST['myRadios'] == 'yes':
                        adult[0].update({
                            "is_booker": True,
                            "is_contact": True
                        })
                    else:
                        adult[0].update({
                            "is_booker": False,
                            "is_contact": False
                        })


                try:
                    if request.POST['adult_cp'+str(i+1)] == 'on':
                        contact.append({
                            "first_name": request.POST['adult_first_name' + str(i + 1)],
                            "last_name": request.POST['adult_last_name' + str(i + 1)],
                            "title": request.POST['adult_title' + str(i + 1)],
                            "email": "asndasdn@gmail.com",
                            "calling_code": "+62",
                            "mobile": "81237123812",
                            "nationality_code": request.POST['adult_nationality' + str(i + 1)],
                            "contact_id": request.POST['adult_id' + str(i + 1)]
                        })
                    if i == 0:
                        if request.POST['myRadios'] == 'yes':
                            contact[0].update({
                                'is_booker': True
                            })
                        else:
                            contact[0].update({
                                'is_booker': False
                            })
                except:
                    continue

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
                    'is_booker': True
                })

            for i in range(int(request.session['airline_request']['child'])):
                child.append({
                    "pax_type": "CHD",
                    "first_name": request.POST['child_first_name' + str(i + 1)],
                    "last_name": request.POST['child_last_name' + str(i + 1)],
                    "title": request.POST['child_title' + str(i + 1)],
                    "birth_date": request.POST['child_birth_date' + str(i + 1)],
                    "nationality_code": request.POST['child_nationality' + str(i + 1)],
                    "passport_number": request.POST['child_passport_number' + str(i + 1)],
                    "passport_expdate": request.POST['child_passport_expired_date' + str(i + 1)],
                    "country_of_issued_code": request.POST['child_country_of_issued' + str(i + 1)],
                    "passenger_id": request.POST['child_id' + str(i + 1)]
                })

            for i in range(int(request.session['airline_request']['infant'])):
                infant.append({
                    "pax_type": "INF",
                    "first_name": request.POST['infant_first_name' + str(i + 1)],
                    "last_name": request.POST['infant_last_name' + str(i + 1)],
                    "title": request.POST['infant_title' + str(i + 1)],
                    "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                    "nationality_code": request.POST['infant_nationality' + str(i + 1)],
                    "passport_number": request.POST['infant_passport_number' + str(i + 1)],
                    "passport_expdate": request.POST['infant_passport_expired_date' + str(i + 1)],
                    "country_of_issued_code": request.POST['infant_country_of_issued' + str(i + 1)],
                    "passenger_id": request.POST['infant_id' + str(i + 1)]
                })

            request.session['airline_create_passengers'] = {
                'booker': booker,
                'adult': adult,
                'child': child,
                'infant': infant,
                'contact': contact
            }
        try:
            if request.POST['additional_price'] != "":
                additional_price = request.POST['additional_price']
            else:
                additional_price = 0
        except:
            additional_price = 0

        airline_carriers = response['result']['response']['airline']['carriers']

        airline_carriers.pop('SO')
        airline_carriers.pop('E9')
        airline_carriers.pop('7L')
        airline_carriers.pop('UD')

        json_airline_pick = request.session['airline_pick'].replace('&&&', ',')

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_request': request.session['airline_request'],
            'price': request.session['airline_price_itinerary'],
            'airline_pick': request.session['airline_pick'],
            'back_page': request.META.get('HTTP_REFERER'),
            'json_airline_pick': json.loads(json_airline_pick),
            'airline_get_price_request': request.session['airline_get_price_request'],
            'airline_carriers': airline_carriers,
            'additional_price': additional_price,
            'username': request.session['user_account'],
            'passengers': request.session['airline_create_passengers']
            # 'co_uid': request.session['co_uid'],
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_review_templates.html', values)
    else:
        return index(request)

def booking(request):
    if 'user_account' in request.session._session:

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['user_account'],
            'order_number': request.POST['order_number'],
            'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_visa_booking_templates.html', values)
    else:
        return index(request)
