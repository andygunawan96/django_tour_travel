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
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()
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

        file = open("get_airline_active_carriers.txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

        airline_carriers = {'All': {'name': 'All', 'code': 'all'}}
        for i in response:
            airline_carriers[i] = {
                'name': response[i]['name'],
                'code': response[i]['code'],
                'icao': response[i]['icao'],
                'call_sign': response[i]['call_sign']
            }

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

            #check MC OW RT
            try:
                if request.POST['radio_airline_type'] == 'multicity':
                    direction = 'MC'
                    try:
                        if request.POST['is_combo_price'] == '':
                            is_combo_price = 'true'
                    except:
                        is_combo_price = 'false'
                    return_date = request.POST['airline_departure']

                    airline_carriers = []
                    airline_carrier = {'All': {'name': 'All', 'code': 'all'}}
                    for j in response:
                        airline_carrier[j] = {
                            'name': response[j]['name'],
                            'code': response[j]['code'],
                            'icao': response[j]['icao'],
                            'call_sign': response[j]['call_sign']
                        }
                    airline_carriers.append(airline_carrier)
                    airline_carrier = []

                    for idx, arr in enumerate(airline_carriers):
                        for provider in arr:
                            try:
                                if (request.POST['provider_box_' + provider+'_1']):
                                    airline_carriers[idx][provider]['bool'] = True
                                else:
                                    airline_carriers[idx][provider]['bool'] = False
                            except:
                                airline_carriers[idx][provider]['bool'] = False
                                print('%s %s' % ('no ', provider))

                    origin = []
                    destination = []
                    departure = []
                    cabin_class = []
                    return_date = []
                    cabin_class.append(request.POST['cabin_class_flight1'])
                    for i in range(int(request.POST['counter'])):
                        origin.append(request.POST['origin_id_flight'+str(i+1)])
                        destination.append(request.POST['destination_id_flight'+str(i+1)])
                        departure.append(request.POST['airline_departure'+str(i+1)])
                        return_date.append(request.POST['airline_departure'+str(i+1)])

                else:
                    try:
                        if request.POST['is_combo_price'] == '':
                            is_combo_price = 'true'
                    except:
                        is_combo_price = 'false'

                    airline_carriers = []
                    airline_carrier = {'All': {'name': 'All', 'code': 'all'}}
                    for j in response:
                        airline_carrier[j] = {
                            'name': response[j]['name'],
                            'code': response[j]['code'],
                            'icao': response[j]['icao'],
                            'call_sign': response[j]['call_sign']
                        }
                    airline_carriers.append(airline_carrier)
                    airline_carrier = []

                    for idx, arr in enumerate(airline_carriers):
                        for provider in arr:
                            try:
                                if (request.POST['provider_box_' + provider]):
                                    airline_carriers[idx][provider]['bool'] = True
                                else:
                                    airline_carriers[idx][provider]['bool'] = False
                            except:
                                airline_carriers[idx][provider]['bool'] = False
                                print('%s %s' % ('no ', provider))
                    origin = []
                    destination = []
                    departure = []
                    cabin_class = []
                    return_date = []

                    origin.append(request.POST['origin_id_flight'])
                    destination.append(request.POST['destination_id_flight'])
                    departure.append(request.POST['airline_departure'])
                    cabin_class.append(request.POST['cabin_class_flight'])

                    if request.POST['radio_airline_type'] == 'roundtrip':
                        direction = 'RT'
                        departure.append(request.POST['airline_return'])
                        return_date.append(request.POST['airline_return'])
                        origin.append(request.POST['destination_id_flight'])
                        destination.append(request.POST['origin_id_flight'])
                    elif request.POST['radio_airline_type'] == 'oneway':
                        direction = 'OW'
                        return_date.append(request.POST['airline_departure'])
            except:
                direction = 'OW'
                return_date = request.POST['airline_departure']
                print('no return')


            airline_request = {
                'origin': origin,
                'destination': destination,
                'departure': departure,
                'return': return_date,
                'direction': direction,
                'adult': int(request.POST['adult_flight']),
                'child': int(request.POST['child_flight']),
                'infant': int(request.POST['infant_flight']),
                'cabin_class': cabin_class,
                'is_combo_price': is_combo_price,
                'carrier_codes': [],
                'counter': request.POST['counter']
            }
            request.session['airline_carriers_request'] = airline_carriers
        except:
            airline_request = request.session['airline_request']
            airline_carriers = request.session['airline_carriers_request']

        flight = ''

        check = 2
        for idx, airline_request_search in enumerate(airline_request['origin']):
            for list_airline in airline_destinations:
                if list_airline['name'] == airline_request['origin'][idx].split(' - ')[0] or list_airline['name'] == \
                        airline_request['destination'][idx].split(' - ')[0] or list_airline['code'] == \
                        airline_request['origin'][idx].split(' - ')[0] or list_airline['code'] == \
                        airline_request['destination'][idx].split(' - ')[0] or list_airline['city'] == \
                        airline_request['origin'][idx].split(' - ')[0] or list_airline['city'] == \
                        airline_request['destination'][idx].split(' - ')[0]:
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
        request.session['airline_mc_counter'] = 0
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
            'airline_cabin_class_list': airline_cabin_class_list,
            'airline_carriers': airline_carriers,
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'time_limit': 600
            # 'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_search_templates.html', values)
    else:
        return index(request)

def passenger(request):
    if 'user_account' in request.session._session:
        try:
            file = open("javascript_version.txt", "r")
            for line in file:
                javascript_version = json.loads(line)
            file.close()
            file = open("version_cache.txt", "r")
            for line in file:
                file_cache_name = line
            file.close()

            file = open(str(file_cache_name) + ".txt", "r")
            for line in file:
                response = json.loads(line)
            file.close()

            file = open("get_airline_active_carriers.txt", "r")
            for line in file:
                carrier = json.loads(line)
            file.close()

            # agent
            adult_title = ['MR', 'MRS', 'MS']

            infant_title = ['MSTR', 'MISS']

            id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

            # agent

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
            #CHECK INI
            try:
                request.session['airline_pick'] = json.loads(request.POST['airline_pick'].replace('&&&', ','))
            except:
                request.session['airline_pick'] = json.loads(request.POST['airline_pick'])
        except:
            request.session['airline_pick'] = request.session['airline_pick']

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'countries': response['result']['response']['airline']['country'],
            'airline_request': request.session['airline_request'],
            'price': request.session['airline_price_itinerary'],
            'airline_carriers': carrier,
            'airline_pick': request.session['airline_pick'],
            'adults': adult,
            'childs': child,
            'infants': infant,
            'adult_title': adult_title,
            'infant_title': infant_title,
            'id_types': id_type,
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['airline_signature'],
            'time_limit': int(request.POST['time_limit_input'])
            # 'co_uid': request.session['co_uid'],
            # 'cookies': json.dumps(res['result']['cookies']),
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_passenger_templates.html', values)
    else:
        return index(request)

def ssr(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()
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

        # agent
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        # agent

        # get_balance(request)

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
            'javascript_version': javascript_version
            # 'cookies': json.dumps(res['result']['cookies']),

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_ssr_templates.html', values)
    else:
        return index(request)

def review(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()
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
                'booker_seq_id': request.POST['booker_id']
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
                    "passenger_seq_id": request.POST['adult_id' + str(i + 1)]
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
                    if request.POST['adult_cp' + str(i+1)] == 'on':
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

        file = open("get_airline_active_carriers.txt", "r")
        for line in file:
            airline_carriers = json.loads(line)
        file.close()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_request': request.session['airline_request'],
            'price': request.session['airline_price_itinerary'],
            'airline_pick': request.session['airline_pick'],
            'back_page': request.META.get('HTTP_REFERER'),
            'json_airline_pick': request.session['airline_pick'],
            'airline_carriers': airline_carriers,
            'additional_price': additional_price,
            'username': request.session['user_account'],
            'passengers': request.session['airline_create_passengers'],
            'javascript_version': javascript_version,
            'signature': request.session['airline_signature'],
            'time_limit': int(request.POST['time_limit_input'])
            # 'co_uid': request.session['co_uid'],
            # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_review_templates.html', values)
    else:
        return index(request)

def booking(request):
    if 'user_account' in request.session._session:
        file = open("javascript_version.txt", "r")
        for line in file:
            javascript_version = json.loads(line)
        file.close()

        file = open("get_airline_active_carriers.txt", "r")
        for line in file:
            airline_carriers = json.loads(line)
        file.close()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['user_account'],
            'airline_carriers': airline_carriers,
            'order_number': request.POST['order_number'],
            # 'order_number': 'AL.19081332140',
            'javascript_version': javascript_version

            # 'order_number': 'AL.19072446048',
        }
        return render(request, MODEL_NAME+'/airline/tt_website_skytors_airline_booking_templates.html', values)
    else:
        return index(request)
