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
import random
import json
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice_airline_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_views import *
from tools.parser import *
import base64
_logger = logging.getLogger("website_logger")

MODEL_NAME = 'tt_website'

def elapse_time(dep, arr):
    elapse = arr - dep

    return str(int(elapse.seconds / 3600))+'h '+str(int((elapse.seconds / 60) % 60))+'m'

def can_book(now, dep):
    return dep > now

def airline(request):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
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
            try:
                file = read_cache_file(request, '', 'airline_request')
                if file:
                    cache['airline'] = {
                        'origin': file['origin'][0],
                        'destination': file['destination'][0],
                        'departure': file['departure'][0],
                    }
                if cache['airline']['departure'] == 'Invalid date':
                    cache['airline']['departure'] = convert_string_to_date_to_string_front_end(str(datetime.now())[:10])
            except:
                pass
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'cache': cache,
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
                'big_banner_value': check_banner('airline', 'big_banner', request),
                'small_banner_value': check_banner('airline', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],
            })
            values.update(get_airline_advance_pax_type(request))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/airline/airline_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
        try:
            # check_captcha(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            is_reorder = False
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            advance_search = get_airline_advance_pax_type(request)
            # airline
            file = read_cache("airline_destination", 'cache_web', request, 90911)
            if file:
                airline_destinations = file

            signature = copy.deepcopy(request.session['signature'])

            carrier = get_carriers(request, signature)
            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     carrier = file
            # airline_destinations = []
            # try:
            #     file = read_cache("get_airline_active_carriers", 'cache_web', request, 90911)
            #     if file:
            #         response = file
            # except Exception as e:
            #     _logger.error('ERROR get_airline_active_carriers file\n' + str(e) + '\n' + traceback.format_exc())
            response = get_carriers_search(request, signature)

            values = get_data_template(request, 'search')

            airline_carriers = {'All': {'name': 'All', 'code': 'all','is_excluded_from_b2c': False}}
            for i in response:
                try:
                    airline_carriers[i] = {
                        'name': response[i]['name'],
                        'code': response[i]['code'],
                        'icao': response[i]['icao'],
                        'call_sign': response[i]['call_sign']
                    }
                except Exception as e:
                    _logger.error(str(e) + '\n' + traceback.format_exc())

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

            carrier_codes = request.GET['carrier_codes'].split(',') if request.GET.get('carrier_codes') else []

            try:

                #check MC OW RT
                # try:
                #     if request.POST['radio_airline_type'] == 'multicity':
                #         direction = 'MC'
                #         try:
                #             if request.POST['is_combo_price'] == '':
                #                 is_combo_price = 'true'
                #         except:
                #             is_combo_price = 'false'
                #
                #         airline_carriers = []
                #         airline_carrier = {'All': {'name': 'All', 'code': 'all'}}
                #         for j in response:
                #             try:
                #                 airline_carrier[j] = {
                #                     'name': response[j]['name'],
                #                     'code': response[j]['code'],
                #                     'display_name': response[j]['display_name'],
                #                     'icao': response[j]['icao'],
                #                     'call_sign': response[j]['call_sign'],
                #                     'is_favorite': response[j]['is_favorite'],
                #                     'provider': response[j]['provider'],
                #                     'is_excluded_from_b2c': response[j].get('is_excluded_from_b2c')
                #                 }
                #             except Exception as e:
                #                 _logger.error(str(e) + '\n' + traceback.format_exc())
                #         airline_carriers.append(airline_carrier)
                #         airline_carrier = []
                #
                #         for idx, arr in enumerate(airline_carriers):
                #             for provider in arr:
                #                 try:
                #                     if (request.POST['provider_box_' + provider+'_1']):
                #                         airline_carriers[idx][provider]['bool'] = True
                #                     else:
                #                         airline_carriers[idx][provider]['bool'] = False
                #                 except:
                #                     airline_carriers[idx][provider]['bool'] = False
                #
                #         origin = []
                #         destination = []
                #         departure = []
                #         cabin_class_list = []
                #         return_date = []
                #         cabin_class = request.POST['cabin_class_flight_mc']
                #
                #         for i in range(int(request.POST['counter'])):
                #             origin.append(request.POST['origin_id_flight'+str(i+1)])
                #             destination.append(request.POST['destination_id_flight'+str(i+1)])
                #             departure.append(request.POST['airline_departure'+str(i+1)])
                #             return_date.append(request.POST['airline_departure'+str(i+1)])
                #             cabin_class_list.append(request.POST['cabin_class_flight'+str(i+1)])
                #
                #     else:
                #         try:
                #             if request.POST['is_combo_price'] == '':
                #                 is_combo_price = 'true'
                #         except:
                #             is_combo_price = 'false'
                #
                #         airline_carriers = []
                #         airline_carrier = {'All': {'name': 'All', 'code': 'all', 'is_favorite': False}}
                #         for j in response:
                #             try:
                #                 airline_carrier[j] = {
                #                     'name': response[j]['name'],
                #                     'display_name': response[j]['display_name'],
                #                     'code': response[j]['code'],
                #                     'icao': response[j]['icao'],
                #                     'call_sign': response[j]['call_sign'],
                #                     'is_favorite': response[j]['is_favorite'],
                #                     'provider': response[j]['provider'],
                #                     'is_excluded_from_b2c': response[j]['is_excluded_from_b2c']
                #                 }
                #             except Exception as e:
                #                 _logger.error(str(e) + '\n' + traceback.format_exc())
                #         airline_carriers.append(airline_carrier)
                #         airline_carrier = []
                #
                #         for idx, arr in enumerate(airline_carriers):
                #             for provider in arr:
                #                 try:
                #                     if (request.POST['provider_box_' + provider]):
                #                         airline_carriers[idx][provider]['bool'] = True
                #                     else:
                #                         airline_carriers[idx][provider]['bool'] = False
                #                 except:
                #                     airline_carriers[idx][provider]['bool'] = False
                #         origin = []
                #         destination = []
                #         departure = []
                #         cabin_class_list = []
                #         return_date = []
                #         cabin_class = ''
                #         origin.append(request.POST['origin_id_flight'])
                #         destination.append(request.POST['destination_id_flight'])
                #         try:
                #             departure.append(request.POST['airline_departure_return'].split(' - ')[0])
                #         except:
                #             departure.append(request.POST['airline_departure'])
                #         cabin_class_list.append(request.POST['cabin_class_flight'])
                #         cabin_class = request.POST['cabin_class_flight']
                #
                #         if request.POST['radio_airline_type'] == 'roundtrip':
                #             direction = 'RT'
                #             departure.append(request.POST['airline_departure_return'].split(' - ')[1])
                #             return_date.append(request.POST['airline_departure_return'].split(' - ')[1])
                #             origin.append(request.POST['destination_id_flight'])
                #             destination.append(request.POST['origin_id_flight'])
                #         elif request.POST['radio_airline_type'] == 'oneway':
                #             direction = 'OW'
                #             return_date.append(request.POST['airline_departure'])
                # except Exception as e:
                #     direction = 'OW'
                #     print('airline no return')

                airline_carriers = []
                airline_carrier = {'All': {'name': 'All', 'code': 'all'}}
                for j in response:
                    try:
                        airline_carrier[j] = {
                            'name': response[j]['name'],
                            'code': response[j]['code'],
                            'display_name': response[j]['display_name'],
                            'icao': response[j]['icao'],
                            'call_sign': response[j]['call_sign'],
                            'is_favorite': response[j]['is_favorite'],
                            'provider': response[j]['provider'],
                            'is_excluded_from_b2c': response[j].get('is_excluded_from_b2c')
                        }
                    except Exception as e:
                        _logger.error(str(e) + '\n' + traceback.format_exc())
                airline_carriers.append(airline_carrier)
                airline_carrier = []

                for idx, arr in enumerate(airline_carriers):
                    for provider in arr:
                        try:
                            if provider in carrier_codes or len(carrier_codes) == 0 and provider == 'All':
                                airline_carriers[idx][provider]['bool'] = True
                            else:
                                airline_carriers[idx][provider]['bool'] = False
                        except:
                            airline_carriers[idx][provider]['bool'] = False

                direction = request.GET['direction']
                if direction == 'oneway':
                    direction = 'OW'
                elif direction == 'roundtrip':
                    direction = 'RT'
                elif direction == 'multicity':
                    direction = 'MC'

                ## temporary list airline_destination_use
                temporary_airline_destination_choose_dict = {}
                ## update data origin
                origin = request.GET['origin'].split(',')
                for idx, origin_code in enumerate(origin):
                    if temporary_airline_destination_choose_dict.get(origin_code):
                        origin[idx] = "%s - %s - %s - %s" % (origin_code, temporary_airline_destination_choose_dict[origin_code]['city'], temporary_airline_destination_choose_dict[origin_code]['country'],temporary_airline_destination_choose_dict[origin_code]['name'])
                    else:
                        for airline_destination in airline_destinations:
                            if origin_code == airline_destination['code']:
                                temporary_airline_destination_choose_dict[origin_code] = {
                                    "name": airline_destination['name'],
                                    "city": airline_destination['city'],
                                    "country": airline_destination['country']
                                }
                                origin[idx] = "%s - %s - %s - %s" % (origin_code, airline_destination['city'], airline_destination['country'], airline_destination['name'])
                                break

                ## update data destination
                destination = request.GET['destination'].split(',')
                for idx,destination_code in enumerate(destination):
                    if temporary_airline_destination_choose_dict.get(destination_code):
                        destination[idx] = "%s - %s - %s - %s" % (destination_code, temporary_airline_destination_choose_dict[destination_code]['city'], temporary_airline_destination_choose_dict[destination_code]['country'],temporary_airline_destination_choose_dict[destination_code]['name'])
                    else:
                        for airline_destination in airline_destinations:
                            if destination_code == airline_destination['code']:
                                temporary_airline_destination_choose_dict[destination_code] = {
                                    "name": airline_destination['name'],
                                    "city": airline_destination['city'],
                                    "country": airline_destination['country']
                                }
                                destination[idx] = "%s - %s - %s - %s" % (destination_code, airline_destination['city'], airline_destination['country'], airline_destination['name'])
                                break
                airline_request = {
                    'origin': origin,
                    'destination': destination,
                    'departure': request.GET['departure'].split(','),
                    'return': request.GET['return'].split(','),
                    'direction': request.GET['direction'],
                    'adult': int(request.GET['adult']),
                    'child': int(request.GET['child']),
                    'infant': int(request.GET['infant']),
                    'cabin_class': request.GET['cabin_class'],
                    'cabin_class_list': request.GET['cabin_class_list'].split(','),
                    'is_combo_price': request.GET['is_combo_price'],
                    'carrier_codes': carrier_codes,
                    'counter': request.GET['counter']
                }

                if advance_search['airline_advance_pax_type'] == 'true':
                    if advance_search['airline_pax_type_student'] == 'true':
                        airline_request['student'] = int(request.GET['student'])
                    if advance_search['airline_pax_type_seaman'] == 'true':
                        airline_request['seaman'] = int(request.GET['seaman'])
                    if advance_search['airline_pax_type_labour'] == 'true':
                        airline_request['labour'] = int(request.GET['labour'])

                # request.session.modified = True
            except Exception as e:
                ## TIDAK ADA DATA POST, DARI REORDER
                _logger.error('Data POST for airline_request create new from reorder')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                file = read_cache_file(request, '', 'airline_request')
                if file:
                    airline_request = file
                # airline_request = request.session['airline_request']
                airline_carriers = [{
                    'All': {
                        'name': 'All',
                        'code': 'all',
                        'is_favorite': False,
                        'bool': True
                    }
                }]
                for rec in response:
                    airline_carriers[0][rec] = {
                        'name': response[rec]['name'],
                        'display_name': response[rec]['display_name'],
                        'code': response[rec]['code'],
                        'icao': response[rec]['icao'],
                        'call_sign': response[rec]['call_sign'],
                        'is_favorite': response[rec]['is_favorite'],
                        'provider': response[rec]['provider'],
                        'is_excluded_from_b2c': response[rec]['is_excluded_from_b2c'],
                        'bool': False
                    }
                is_reorder = True
                if file:
                    return_date = file['departure']


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
            frontend_signature = generate_signature()

            write_cache_file(request, frontend_signature, 'airline_carriers_request', airline_carriers)
            write_cache_file(request, frontend_signature, 'airline_request', airline_request)
            # set_session(request, 'airline_request_%s' % frontend_signature, airline_request)
            # set_session(request, 'airline_request', airline_request)
            # set_session(request, 'airline_mc_counter', 0)

            # get_balance(request)

            # airline

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            if request.POST.get('checkbox_corpor_mode_airline') and request.POST.get('airline_corpor_select_post') and request.POST.get('airline_corbooker_select_post'):
                updated_request = request.POST.copy()
                updated_request.update({
                    'customer_parent_seq_id': request.POST['airline_corpor_select_post']
                })
                cur_session = copy.deepcopy(request.session['user_account'])
                cur_session.update({
                    "co_customer_parent_seq_id": request.POST['airline_corpor_select_post'],
                    "co_customer_seq_id": request.POST['airline_corbooker_select_post']
                })
                set_session(request, 'user_account', cur_session)
                activate_corporate_mode(request, request.session['master_signature'])

            if request.GET.get('checkbox_corpor_mode_airline') and request.GET.get('airline_corpor_select') and request.GET.get('airline_corbooker_select'):
                updated_request = request.GET.copy()
                updated_request.update({
                    'customer_parent_seq_id': request.GET['airline_corpor_select']
                })
                cur_session = copy.deepcopy(request.session['user_account'])
                cur_session.update({
                    "co_customer_parent_seq_id": request.GET['airline_corpor_select'],
                    "co_customer_seq_id": request.GET['airline_corbooker_select']
                })
                set_session(request, 'user_account', cur_session)
                activate_corporate_mode(request, request.session['master_signature'])
            ## PROMO CODE
            promo_codes = []
            use_osi_code_backend = False

            ##GET
            try:
                promo_code_list_data_input = request.GET.get('promo_code_counter_list')
                for promo_code_data_input in json.loads(promo_code_list_data_input):
                    promo_codes.append({
                        'carrier_code': promo_code_data_input['carrier_code'],
                        'promo_code': promo_code_data_input['promo_code']
                    })
            except Exception as e:
                _logger.error('Data POST for promo code not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            try:
                if request.GET.get('checkbox_osi_code_backend_airline') == 'false' and request.session['user_account'].get('co_customer_parent_name') or request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-1] == 'search':
                    use_osi_code_backend = True
            except Exception as e:
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                # 'journeys': journeys,
                'frontend_signature': frontend_signature,
                'airline_request': airline_request,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'airline_destinations': airline_destinations,
                'flight': flight,
                'airline_cabin_class_list': airline_cabin_class_list,
                'airline_carriers': airline_carriers,
                'airline_all_carriers': carrier,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'static_path_url_server': get_url_static_path(),
                'is_reorder': is_reorder,
                'promo_codes': promo_codes,
                'use_osi_code_backend': use_osi_code_backend
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

            })
            values.update(advance_search)
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_search_templates.html', values)
    else:
        return no_session_logout(request)

def passenger(request, signature):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            carrier = get_carriers(request, signature)

            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     carrier = file

            values = get_data_template(request)

            # agent
            adult_title = ['', 'MR', 'MRS', 'MS']

            infant_title = ['', 'MSTR', 'MISS']

            id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]

            # agent

            # get_balance(request)
            #pax
            adult = []
            infant = []
            child = []
            labour = []
            seaman = []
            student = []
            try:
                write_cache_file(request, signature, 'airline_request', json.loads(request.POST['airline_search_request']))
                set_session(request, 'airline_request_%s' % signature, json.loads(request.POST['airline_search_request']))
            except Exception as e:
                _logger.error('No POST search request, from reorder')
            file = read_cache_file(request, signature, 'airline_request')
            if file:
                pax = file
            # pax = copy.deepcopy(request.session['airline_request_%s' % signature])
            for i in range(int(pax['adult'])):
                adult.append('')
            for i in range(int(pax['child'])):
                child.append('')
            for i in range(int(pax['infant'])):
                infant.append('')
            for i in range(int(pax.get('student') or 0)):
                student.append('')
            for i in range(int(pax.get('seaman') or 0)):
                seaman.append('')
            for i in range(int(pax.get('labour') or 0)):
                labour.append('')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            try:
                time_limit = get_timelimit_product(request, 'airline', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            # set_session(request, 'signature', signature)
            # set_session(request, 'airline_signature', signature)
            # signature = request.POST['signature']
        except Exception as e:
            _logger.info(str(e) + traceback.format_exc())
            # signature = request.session['airline_signature']

        # CHECK INI
        try:
            write_cache_file(request, signature, 'airline_price_itinerary', json.loads(request.POST['airline_price_itinerary']))
            write_cache_file(request, signature, 'airline_get_price_request', json.loads(request.POST['airline_price_itinerary_request']))
            write_cache_file(request, signature, 'airline_sell_journey', json.loads(request.POST['airline_sell_journey_response']))

            # set_session(request, 'airline_price_itinerary_%s' % signature,json.loads(request.POST['airline_price_itinerary']))
            # set_session(request, 'airline_get_price_request_%s' % signature,json.loads(request.POST['airline_price_itinerary_request']))
            # set_session(request, 'airline_sell_journey_%s' % signature,json.loads(request.POST['airline_sell_journey_response']))
        except Exception as e:
            _logger.error('Data POST for airline_price_itinerary, airline_get_price_request, airline_sell_journey not found use cache')
            _logger.error("%s, %s" % (str(e), traceback.format_exc()))
        # carrier_code = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        is_lionair = False
        is_international = False
        is_garuda = False
        is_identity_required = False
        is_birthdate_required = False
        is_need_valid_identity = False ## FOR COUNTRY US
        is_need_last_name = False ## FOR CITY DUBAI
        file = read_cache_file(request, signature, 'airline_sell_journey')
        if file:
            airline_price_provider_temp = file['sell_journey_provider']
        # airline_price_provider_temp = request.session['airline_sell_journey_%s' % signature]['sell_journey_provider']
        ## KURANG AMBIL DEFAULT DOMESTIC ORIGIN SEMENTARA PAKAI INDONESIA

        provider_data_dict = {}
        file = read_cache("get_list_provider_data", 'cache_web', request, 90911)
        try:
            if file and request.session['user_account']['co_ho_seq_id'] in file:
                provider_data_dict = file[request.session['user_account']['co_ho_seq_id']]
        except Exception as e:
            _logger.error('ERROR read file get_list_provider_data\n' + str(e) + '\n' + traceback.format_exc())

        is_pre_riz = False
        is_pre_riz_required = False

        file = read_cache_file(request, signature, 'airline_get_price_request')
        if file:
            airline_get_price_request = file

        for airline in airline_price_provider_temp:
            for journey in airline['journeys']:
                for segment in journey['segments']:
                    if carrier.get(segment['carrier_code']):
                        if carrier[segment['carrier_code']]['is_adult_birth_date_required']:
                            is_birthdate_required = True
                        if carrier[segment['carrier_code']].get('is_required_last_name'):
                            is_need_last_name = True
                    if segment['carrier_code'] == 'GA':
                        is_garuda = True
                    for leg in segment['legs']:
                        if leg.get('origin_country') and leg.get('destination_country'):
                            if leg['origin_country'] != 'Indonesia' or leg['destination_country'] != 'Indonesia':
                                is_international = True
                                if carrier:
                                    if carrier.get(segment['carrier_code']):
                                        if carrier[segment['carrier_code']]['required_identity_required_international']:
                                            is_identity_required = True
                                break
                            else:
                                if carrier:
                                    if carrier.get(segment['carrier_code']):
                                        if carrier[segment['carrier_code']]['required_identity_required_domestic']:
                                            is_identity_required = True
                                break
            if airline['provider'] == 'lionair' or airline['provider'] == 'lionairapi':
                is_lionair = True
            if provider_data_dict:
                if provider_data_dict[airline['provider']].get('is_pre_riz'):
                    if provider_data_dict[airline['provider']]['is_pre_riz']:
                        is_pre_riz = True
                if provider_data_dict[airline['provider']].get('is_pre_riz_required'):
                    if provider_data_dict[airline['provider']]['is_pre_riz_required']:
                        if is_garuda and not is_pre_riz_required:
                            for promo_code in airline_get_price_request['promo_codes']:
                                if promo_code['carrier_code'] == 'GA' and 'nkri' in promo_code['promo_code'].lower():
                                    is_pre_riz_required = True
                                    break


        for airline in airline_price_provider_temp:
            for journey in airline['journeys']:
                if journey.get('origin_country'):
                    if journey['origin_country'] == 'United States':
                        is_need_valid_identity = True
                if not is_need_valid_identity and journey.get('destination_country'):
                    if journey['destination_country'] == 'United States':
                        is_need_valid_identity = True
                if journey.get('origin_city'):
                    if journey['origin_city'] == 'Dubai':
                        is_need_last_name = True
                if not is_need_last_name and journey.get('origin_country'):
                    if journey['origin_country'] == 'Saudi Arabia':
                        is_need_last_name = True
                if not is_need_last_name and journey.get('destination_city'):
                    if journey['origin_country'] == 'Saudi Arabia':
                        is_need_last_name = True
                if not is_need_last_name and journey.get('destination_country'):
                    if journey['destination_country'] == 'Saudi Arabia':
                        is_need_last_name = True
                if is_need_valid_identity and is_need_last_name:
                    break
                for segment in journey['segments']:
                    if segment.get('origin_country'):
                        if segment['origin_country'] == 'United States':
                            is_need_valid_identity = True
                    if not is_need_valid_identity and segment.get('destination_country'):
                        if segment['destination_country'] == 'United States':
                            is_need_valid_identity = True
                    if segment.get('origin_city'):
                        if segment['origin_city'] == 'Dubai' or segment['origin_city'] == 'Saudi Arabia':
                            is_need_last_name = True
                    if not is_need_last_name and segment.get('destination_city'):
                        if segment['destination_city'] == 'Dubai' or segment['destination_city'] == 'Saudi Arabia':
                            is_need_last_name = True
                    if is_need_valid_identity and is_need_last_name:
                        break
                    for leg in segment['legs']:
                        if leg.get('origin_country'):
                            if leg['origin_country'] == 'United States':
                                is_need_valid_identity = True
                        if leg.get('destination_country'):
                            if leg['destination_country'] == 'United States':
                                is_need_valid_identity = True
                        if leg.get('origin_city'):
                            if leg['origin_city'] == 'Dubai' or leg['origin_city'] == 'Saudi Arabia':
                                is_need_last_name = True
                        if leg.get('destination_city'):
                            if leg['destination_city'] == 'Dubai' or leg['destination_city'] == 'Saudi Arabia':
                                is_need_last_name = True
                        if is_need_valid_identity and is_need_last_name:
                            break
                    if is_need_valid_identity and is_need_last_name:
                        break
                if is_need_valid_identity and is_need_last_name:
                    break
            if is_need_valid_identity and is_need_last_name:
                break

        try:
            file = read_cache_file(request, signature, 'airline_get_ff_availability')
            if file:
                ff_request = file['result']['response']['ff_availability_provider']
            # ff_request = request.session['airline_get_ff_availability_%s' % signature]['result']['response']['ff_availability_provider']
        except:
            ff_request = []
        try:
            file = read_cache_file(request, signature, 'airline_request')
            if file:
                airline_request = file
            file = read_cache_file(request, signature, 'airline_sell_journey')
            if file:
                airline_sell_journey = file
            file = read_cache_file(request, signature, 'airline_get_price_request')
            if file:
                airline_get_price_request = file
            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            values.update({
                'ff_request': ff_request,
                'static_path': path_util.get_static_path(MODEL_NAME),
                'is_lionair': is_lionair,
                'is_garuda': is_garuda,
                'is_international': is_international,
                'birth_date_required': is_birthdate_required,
                'is_need_valid_identity': is_need_valid_identity,
                'is_need_last_name': is_need_last_name,
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'is_identity_required': is_identity_required,
                # 'airline_request': request.session['airline_request_%s' % signature],
                # 'price': request.session['airline_sell_journey_%s' % signature],
                # 'airline_get_price_request': request.session['airline_get_price_request_%s' % signature],
                'airline_request': airline_request,
                'price': airline_sell_journey,
                'airline_get_price_request': airline_get_price_request,
                'airline_carriers': carrier,
                # 'airline_pick': request.session['airline_sell_journey_%s' % signature]['sell_journey_provider'],
                'airline_pick': airline_sell_journey['sell_journey_provider'],
                'adults': adult,
                'childs': child,
                'infants': infant,
                'students': student,
                'seamans': seaman,
                'labours': labour,
                'adult_title': adult_title,
                'infant_title': infant_title,
                'id_types': id_type,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'signature': signature,
                # 'time_limit': request.session['time_limit_%s' % signature],
                'time_limit': time_limit,
                'static_path_url_server': get_url_static_path(),
                'is_pre_riz': is_pre_riz,
                'is_pre_riz_required': is_pre_riz_required
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def passenger_aftersales(request, signature):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            carrier = get_carriers(request, signature)
            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     carrier = file

            values = get_data_template(request)

            # agent

            # get_balance(request)
            # pax
            adult = []
            infant = []
            child = []
            student = []
            seaman = []
            labour = []
            file = read_cache_file(request, signature, 'airline_request')
            if file:
                pax = file
            # pax = copy.deepcopy(request.session['airline_request_%s' % signature])
            for i in range(int(pax['adult'])):
                adult.append('')
            for i in range(int(pax['child'])):
                child.append('')
            for i in range(int(pax['infant'])):
                infant.append('')
            for i in range(int(pax.get('student') or 0)):
                student.append('')
            for i in range(int(pax.get('seaman') or 0)):
                seaman.append('')
            for i in range(int(pax.get('labour') or 0)):
                labour.append('')
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser
            # CHECK INI
            write_cache_file(request, signature, 'airline_price_itinerary', json.loads(request.POST['airline_price_itinerary']))
            write_cache_file(request, signature, 'airline_get_price_request', json.loads(request.POST['airline_price_itinerary_request']))
            write_cache_file(request, signature, 'airline_sell_journey', json.loads(request.POST['airline_sell_journey_response']))

            # set_session(request, 'airline_price_itinerary_%s' % signature,
            #             json.loads(request.POST['airline_price_itinerary']))
            # set_session(request, 'airline_get_price_request_%s' % signature,
            #             json.loads(request.POST['airline_price_itinerary_request']))
            # try:
            #     set_session(request, 'airline_sell_journey_%s' % signature,
            #                 json.loads(request.POST['airline_sell_journey_response']))
            # except:
            #     _logger.info('no sell journey input')

            try:
                time_limit = get_timelimit_product(request, 'airline', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                pass

            # set_session(request, 'signature', signature)
            # set_session(request, 'airline_signature', signature)
            # signature = request.POST['signature']
        except Exception as e:
            _logger.info(str(e) + traceback.format_exc())
            # signature = request.session['airline_signature']
        adult_title = ['MR', 'MRS', 'MS']

        infant_title = ['MSTR', 'MISS']

        id_type = [['ktp', 'KTP'], ['sim', 'SIM'], ['pas', 'Passport']]
        # carrier_code = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        provider_list_data = read_cache("get_list_provider_data", 'cache_web', request, 90911)
        is_lionair = False
        is_international = False
        is_garuda = False
        is_identity_required = False
        is_birthdate_required = False
        file = read_cache_file(request, signature, 'airline_get_booking_response')
        if file:
            get_booking = file
        # get_booking = request.session['airline_get_booking_response']
        is_change_identity = False
        is_change_name = False
        for provider_booking in get_booking['result']['response']['provider_bookings']:
            if provider_list_data.get(provider_booking['provider']):
                if provider_list_data.get(provider_booking['provider']).get('is_post_booked_pax_name'):
                    is_change_name = True
                if provider_list_data.get(provider_booking['provider']).get('is_post_booked_pax_identity'):
                    is_change_identity = True
            for journey in provider_booking['journeys']:
                if journey['origin_country'] != 'Indonesia' and is_international == False:
                    is_international = True
                    break
                for segment in journey['segments']:
                    if segment['origin_country'] != 'Indonesia' and is_international == False:
                        is_international = True
                    if carrier[segment['carrier_code']]['is_adult_birth_date_required']:
                        is_birthdate_required = True
                    if carrier[segment['carrier_code']]['required_identity_required_international']:
                        is_identity_required = True
                    if is_international == False:
                        for leg in segment['legs']:
                            if leg['origin_country'] != 'Indonesia' or leg['destination_country'] != 'Indonesia':
                                is_international = True
                                if carrier:
                                    if carrier[segment['carrier_code']]['required_identity_required_international']:
                                        is_identity_required = True
                                break
                            else:
                                if carrier:
                                    if carrier[segment['carrier_code']]['required_identity_required_domestic']:
                                        is_identity_required = True
                                break
                    if is_international and is_birthdate_required and is_identity_required:
                        break
                if is_international and is_birthdate_required and is_identity_required:
                    break

        try:
            file = read_cache_file(request, signature, 'airline_get_booking_response')
            if file:
                airline_get_booking = file
            file = read_cache_file(request, signature, 'airline_request')
            if file:
                airline_request = file

            values.update({
                # 'ff_request': ff_request,
                'ff_request': [],
                'static_path': path_util.get_static_path(MODEL_NAME),
                'is_lionair': is_lionair,
                'is_garuda': is_garuda,
                'is_international': is_international,
                'birth_date_required': is_birthdate_required,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'is_change_name': is_change_name,
                'is_change_identity': is_change_identity,
                'is_identity_required': is_identity_required,
                # 'order_number': request.session['airline_get_booking_response']['result']['response']['order_number'],
                # 'airline_request': request.session['airline_request_%s' % signature],
                'order_number': airline_get_booking['result']['response']['order_number'],
                'airline_request': airline_request,
                'airline_carriers': carrier,
                'adults': adult,
                'childs': child,
                'infants': infant,
                'students': student,
                'seamans': seaman,
                'labours': labour,
                'adult_title': adult_title,
                'infant_title': infant_title,
                'id_types': id_type,
                'username': request.session['user_account'],
                'javascript_version': javascript_version,
                'signature': signature,
                'time_limit': 1200,
                'static_path_url_server': get_url_static_path(),
                # 'co_uid': request.session['co_uid'],
                # 'cookies': json.dumps(res['result']['cookies']),
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/airline/airline_passenger_after_sales_templates.html', values)
    else:
        return no_session_logout(request)

def ssr(request, signature):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            carrier = get_carriers(request, signature)
            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     carrier = file


            values = get_data_template(request)

            try:
                passenger = []
                file = read_cache_file(request, signature, 'airline_create_passengers')
                if file:
                    for pax_type in file:
                        if pax_type not in ['infant', 'booker', 'contact']:
                            for pax in file[pax_type]:
                                passenger.append(pax)
                additional_price_input = ''
                additional_price = request.POST['additional_price_input'].split(' ')[-1].split(',')
                for i in additional_price:
                    additional_price_input += i
                # airline_ssr = request.session['airline_get_ssr']['result']['response']
                airline_ssr = {
                    'ssr_availability_provider': []
                }
                airline_list = []
                file = read_cache_file(request, signature, 'airline_get_ssr')
                if file:
                    for ssr_provider in file['result']['response']['ssr_availability_provider']:
                        if ssr_provider.get('ssr_availability'):
                            airline_ssr['ssr_availability_provider'].append(ssr_provider)
                            for available in ssr_provider['ssr_availability']:
                                for journey in ssr_provider['ssr_availability'][available]:
                                    for segment in journey['segments']:
                                        if segment['carrier_code'] not in airline_list:
                                            airline_list.append(segment['carrier_code'])
                                break
                        ssr_provider.update({
                            'airline_list': airline_list
                        })
                        airline_list = []
                file = read_cache_file(request, signature, 'passenger_with_ssr')
                if file:
                    passengers = file
                # passengers = request.session['passenger_with_ssr_%s' % signature]
                for pax in passengers:
                    if not pax.get('behaviors'):
                        pax['behaviors'] = {}
                    if not pax['behaviors'].get('airline'):
                        pax['behaviors']['airline'] = ""
                    if pax['behaviors'].get('airline'):
                        pax['behaviors']['airline'] = pax['behaviors']['airline'].replace('<br/>', '\n')

                try:
                    time_limit = get_timelimit_product(request, 'airline', signature)
                    if time_limit == 0:
                        time_limit = int(request.POST['time_limit_input'])
                    write_cache_file(request, signature, 'time_limit', time_limit)
                    # set_session(request, 'time_limit_%s' % signature, time_limit)
                except:
                    pass

                file = read_cache_file(request, signature, 'airline_request')
                if file:
                    airline_request = file

                file = read_cache_file(request, signature, 'airline_sell_journey')
                if file:
                    airline_sell_journey = file

                file = read_cache_file(request, signature, 'airline_upsell')
                if file:
                    airline_upsell = file
                else:
                    airline_upsell = 0

                file = read_cache_file(request, signature, 'time_limit')
                if file:
                    time_limit = file

                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    # 'airline_request': request.session['airline_request_%s' % signature],
                    # 'price': request.session['airline_sell_journey_%s' % signature],
                    'airline_request': airline_request,
                    'price': airline_sell_journey,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'after_sales': 0,
                    'additional_price': float(additional_price_input),
                    'airline_carriers': carrier,
                    # 'airline_destinations': airline_destinations,
                    # 'airline_pick': request.session['airline_sell_journey_%s' % signature]['sell_journey_provider'],
                    # 'upsell': request.session.get('airline_upsell_'+signature) and request.session.get('airline_upsell_'+signature) or 0,
                    'airline_pick': airline_sell_journey['sell_journey_provider'],
                    'upsell': airline_upsell,
                    'signature': signature,
                    'airline_ssrs': airline_ssr,
                    'passengers': passengers,
                    'username': request.session['user_account'],
                    'javascript_version': javascript_version,
                    'static_path_url_server': get_url_static_path(),
                    # 'time_limit': int(request.session['time_limit_%s' % signature]),
                    'time_limit': int(time_limit),
                    'airline_getbooking': ''
                })
            except:
                #dari getbooking
                #pax

                #CHECK SINI TEMBAK KO SAM

                # airline_ssr = request.session['airline_get_ssr']['result']['response']
                airline_ssr = {
                    'ssr_availability_provider': []
                }
                airline_list = []

                file = read_cache_file(request, signature, 'after_sales_data')
                file_ssr = read_cache_file(request, signature, 'airline_get_ssr')
                if file:
                    after_sales_data = file
                elif file_ssr:
                    after_sales_data = file_ssr
                # after_sales_data = json.loads(request.POST['after_sales_data_%s' % signature]) if request.POST.get('after_sales_data_%s' % signature) else request.session['airline_get_ssr_%s' % signature]
                for ssr_provider in after_sales_data['result']['response']['ssr_availability_provider']:
                    if ssr_provider.get('ssr_availability'):
                        airline_ssr['ssr_availability_provider'].append(ssr_provider)
                        for available in ssr_provider.get('ssr_availability'):
                            for journey in ssr_provider['ssr_availability'][available]:
                                for segment in journey['segments']:
                                    if segment['carrier_code'] not in airline_list:
                                        airline_list.append(segment['carrier_code'])
                            break
                        ssr_provider.update({
                            'airline_list': airline_list
                        })
                        airline_list = []

                adult = []
                infant = []
                child = []
                last_departure_date = ''

                file = read_cache_file(request, signature, 'airline_get_booking_response')
                if file:
                    airline_get_booking_resp = file
                else:
                    airline_get_booking_resp = json.loads(request.POST['get_booking_data_json'])
                # airline_get_booking_resp = request.session.get('airline_get_booking_response') if request.session.get('airline_get_booking_response') else json.loads(request.POST['get_booking_data_json'])
                for rec in airline_get_booking_resp['result']['response']['provider_bookings']:
                    last_departure_date = rec['departure_date']
                    for ticket in rec['tickets']:
                        for fee in ticket['fees']:
                            if fee.get('description_text'):
                                fee.pop('description_text')
                    if rec.get('rules'):
                        rec.pop('rules')
                    for journey in rec['journeys']:
                        for segment in journey['segments']:
                            if segment.get('fare_details'):
                                segment.pop('fare_details')
                for rec in airline_get_booking_resp['result']['response']['passengers']:
                    for fee in rec['fees']:
                        if fee.get('description_text'):
                            fee.pop('description_text')
                for rec in airline_get_booking_resp['result']['response']['reschedule_list']:
                    for provider_booking in rec['provider_bookings']:
                        if(provider_booking.get('rules')):
                            provider_booking.pop('rules')
                        for journey in provider_booking['journeys']:
                            for segment in journey['segments']:
                                if segment.get('fare_details'):
                                    segment.pop('fare_details')
                                if (segment.get('addons')):
                                    segment.pop('addons')
                    for new_segment in rec['new_segments']:
                        if new_segment.get('fare_details'):
                            new_segment.pop('fare_details')
                        if (new_segment.get('addons')):
                            new_segment.pop('addons')
                    for old_segment in rec['old_segments']:
                        if(old_segment.get('fare_details')):
                            old_segment.pop('fare_details')
                        if (old_segment.get('addons')):
                            old_segment.pop('addons')

                write_cache_file(request, signature, 'airline_get_booking_response', airline_get_booking_resp)
                # set_session(request, 'airline_get_booking_response_%s' % (signature), airline_get_booking_resp)
                for pax in airline_get_booking_resp['result']['response']['passengers']:
                    if pax.get('birth_date'):
                        pax_type = pax.get('pax_type', '')
                        if (datetime.strptime(last_departure_date, '%Y-%m-%d %H:%M:%S') - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 <= 2 and pax_type == '' or pax_type == 'INF':
                            infant.append({
                                "pax_type": 'INF',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "sequence": pax['sequence']
                            })
                        elif (datetime.strptime(last_departure_date, '%Y-%m-%d %H:%M:%S') - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 < 12 and pax_type == '' or pax_type == 'CHD':
                            child.append({
                                "pax_type": 'CHD',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "sequence": pax['sequence']
                            })
                            if len(pax['fees']):
                                child[len(child) - 1]['ssr_list'] = []
                                for ssr_availability_provider in airline_ssr['ssr_availability_provider']:
                                    if ssr_availability_provider.get('is_replace_ssr') and ssr_availability_provider['is_replace_ssr']:
                                        for fee in pax['fees']:
                                            for provider in ssr_availability_provider['ssr_availability']:
                                                for availability in ssr_availability_provider['ssr_availability'][provider]:
                                                    for ssr in availability['ssrs']:
                                                        if ssr.get('ssr_code'):
                                                            if ssr['ssr_code'] == fee['fee_code'] and fee['journey_code'] == ssr['journey_code']:
                                                                child[len(child) - 1]['ssr_list'].append({
                                                                    "fee_code": fee['fee_code'],
                                                                    "journey_code": ssr['journey_code'],
                                                                    "availability_type": fee['fee_category'].lower()
                                                                })
                                                        if ssr.get('fee_code'):
                                                            if fee['fee_code'] == ssr.get('ssr_code') and fee['journey_code'] == ssr['journey_code']:
                                                                child[len(adult) - 1]['ssr_list'].append({
                                                                    "fee_code": fee['fee_code'],
                                                                    "journey_code": ssr['journey_code'],
                                                                    "availability_type": fee['fee_category'].lower(),
                                                                    "price": fee['amount']
                                                                })
                        else:
                            adult.append({
                                "pax_type": pax_type if pax_type else 'ADT',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "sequence": pax['sequence']
                            })
                            if len(pax['fees']):
                                adult[len(adult) - 1]['ssr_list'] = []
                                for ssr_availability_provider in airline_ssr['ssr_availability_provider']:
                                    if ssr_availability_provider.get('is_replace_ssr') and ssr_availability_provider['is_replace_ssr']:
                                        for fee in pax['fees']:
                                            for provider in ssr_availability_provider['ssr_availability']:
                                                for availability in ssr_availability_provider['ssr_availability'][provider]:
                                                    for ssr in availability['ssrs']:
                                                        if ssr.get('fee_code'):
                                                            if fee['fee_code'] == ssr.get('fee_code') and fee['journey_code'] == ssr['journey_code']:
                                                                adult[len(adult) - 1]['ssr_list'].append({
                                                                    "fee_code": fee['fee_code'],
                                                                    "journey_code": ssr['journey_code'],
                                                                    "availability_type": fee['fee_category'].lower(),
                                                                    "price": fee['amount']
                                                                })
                                                        elif ssr.get('ssr_code'):
                                                            if fee['fee_code'] == ssr.get('ssr_code') and fee['journey_code'] == ssr['journey_code']:
                                                                adult[len(adult) - 1]['ssr_list'].append({
                                                                    "fee_code": fee['fee_code'],
                                                                    "journey_code": ssr['journey_code'],
                                                                    "availability_type": fee['fee_category'].lower(),
                                                                    "price": fee['amount']
                                                                })
                    else:
                        pax_type = pax.get('pax_type', '')
                        adult.append({
                            "pax_type": pax_type if pax_type else 'ADT',
                            "first_name": pax['first_name'],
                            "last_name": pax['last_name'],
                            "title": pax['title'],
                            "birth_date": pax['birth_date'],
                            "nationality_code": pax['nationality_code'],
                            "passport_number": pax['identity_number'],
                            "passport_expdate": pax['identity_expdate'],
                            "country_of_issued_code": pax['identity_country_of_issued_code'],
                            "identity_type": pax['identity_type'],
                            "sequence": pax['sequence']
                        })
                        if len(pax['fees']):
                            adult[len(adult) - 1]['ssr_list'] = []
                            if ssr_provider.get('is_replace_ssr') and ssr_provider['is_replace_ssr']:
                                for fee in pax['fees']:
                                    for provider in ssr_provider['ssr_availability']:
                                        for availability in ssr_provider['ssr_availability'][provider]:
                                            for ssr in availability['ssrs']:
                                                if ssr.get('fee_code') == fee['fee_code']:
                                                    adult[len(adult) - 1]['ssr_list'].append({
                                                        "fee_code": fee['fee_code'],
                                                        "journey_code": ssr['journey_code'],
                                                        "availability_type": fee['fee_category'].lower()
                                                    })
                                                elif ssr.get('ssr_code') == fee['fee_code']:
                                                    adult[len(adult) - 1]['ssr_list'].append({
                                                        "fee_code": fee['fee_code'],
                                                        "journey_code": ssr['journey_code'],
                                                        "availability_type": fee['fee_category'].lower()
                                                    })
                title_booker = 'MR'
                if airline_get_booking_resp['result']['response']['booker']['gender'] == 'female':
                    if airline_get_booking_resp['result']['response']['booker']['marital_status'] != '':
                        title_booker = 'MRS'
                    else:
                        title_booker = 'MS'
                airline_create_passengers = {
                    'booker': {
                        "first_name": airline_get_booking_resp['result']['response']['booker']['first_name'],
                        "last_name": airline_get_booking_resp['result']['response']['booker']['last_name'],
                        "title": title_booker,
                        "email": airline_get_booking_resp['result']['response']['booker']['email'],
                        "calling_code": airline_get_booking_resp['result']['response']['booker']['phones'][len(airline_get_booking_resp['result']['response']['booker']['phones']) - 1]['calling_code'],
                        "mobile": airline_get_booking_resp['result']['response']['booker']['phones'][len(airline_get_booking_resp['result']['response']['booker']['phones']) - 1]['calling_number'],
                        "nationality_name": airline_get_booking_resp['result']['response']['booker']['nationality_name'],
                        "contact_seq_id": airline_get_booking_resp['result']['response']['booker']['seq_id']
                    },
                    'adult': adult,
                    'child': child,
                    'infant': infant
                }
                write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
                # set_session(request, 'airline_create_passengers_%s' % signature, airline_create_passengers)

                passenger = []
                for pax in adult:
                    passenger.append(pax)
                for pax in child:
                    passenger.append(pax)

                upsell = 0
                for pax in airline_get_booking_resp['result']['response']['passengers']:
                    if pax.get('channel_service_charges'):
                        upsell = pax['channel_service_charges']['amount']
                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'after_sales': 1,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'airline_carriers': carrier,
                    'upsell': upsell,
                    'airline_getbooking': airline_get_booking_resp['result']['response'],
                    'airline_ssrs': airline_ssr,
                    'passengers': passenger,
                    'username': request.session['user_account'],
                    'static_path_url_server': get_url_static_path(),
                    'javascript_version': javascript_version,
                    'airline_request': '',
                    'price': '',
                    'additional_price': '',
                    'airline_pick': '',
                    'signature': signature,
                    'time_limit': '',
                })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_ssr_templates.html', values)
    else:
        return no_session_logout(request)

def seat_map(request, signature):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            carrier = get_carriers(request, signature)
            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     carrier = file

            values = get_data_template(request)

            ssr = []

            try:
                passenger = []

                file = read_cache_file(request, signature, 'airline_create_passengers')
                if file:
                    airline_passengers = file
                for pax_type in airline_passengers:
                    if pax_type not in ['infant', 'booker', 'contact']:
                        for pax in airline_passengers[pax_type]:
                            if not 'seat_list' in pax or 'seat_list' in pax and len(pax['seat_list']) == 0:
                                pax['seat_list'] = []

                                file = read_cache_file(request, signature, 'airline_get_seat_availability')
                                if file:
                                    airline_seat_availability = file
                                for seat_provider in airline_seat_availability['result']['response'][
                                    'seat_availability_provider']:
                                    if seat_provider.get('segments'):
                                        for segment in seat_provider['segments']:
                                            pax['seat_list'].append({
                                                'segment_code': segment['segment_code2'],
                                                'departure_date': segment['departure_date'],
                                                'seat_pick': '',
                                                'seat_code': '',
                                                'seat_name': '',
                                                'description': '',
                                                'currency': '',
                                                'price': ''
                                            })
                            if not pax.get('behaviors'):
                                pax['behaviors'] = {}
                            if not pax['behaviors'].get('airline'):
                                pax['behaviors']['airline'] = ""
                            if pax['behaviors'].get('airline'):
                                pax['behaviors']['airline'] = pax['behaviors']['airline'].replace('<br/>', '\n')
                            passenger.append(pax)


                additional_price_input = ''
                additional_price = request.POST['additional_price_input'].split(' ')[-1].split(',')
                for i in additional_price:
                    additional_price_input += i

                try:
                    time_limit = get_timelimit_product(request, 'airline', signature)
                    if time_limit == 0:
                        time_limit = int(request.POST['time_limit_input'])
                    write_cache_file(request, signature, 'time_limit', time_limit)
                    # set_session(request, 'time_limit_%s' % signature, time_limit)
                except:
                    pass

                write_cache_file(request, signature, 'airline_create_passengers', airline_passengers)

                file = read_cache_file(request, signature, 'airline_upsell')
                if file:
                    airline_upsell = file
                else:
                    airline_upsell = 0
                file = read_cache_file(request, signature, 'airline_request')
                if file:
                    airline_request = file
                file = read_cache_file(request, signature, 'airline_sell_journey')
                if file:
                    airline_sell_journey = file
                file = read_cache_file(request, signature, 'time_limit')
                if file:
                    time_limit = file

                values.update({
                    'static_path': path_util.get_static_path(MODEL_NAME),
                    'airline_carriers': carrier,
                    'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                    'countries': airline_country,
                    'phone_code': phone_code,
                    'after_sales': 0,
                    'upsell': airline_upsell,
                    'airline_request': airline_request,
                    'price': airline_sell_journey,
                    'additional_price': float(additional_price_input),
                    'passengers': passenger,
                    'username': request.session['user_account'],
                    'static_path_url_server': get_url_static_path(),
                    'javascript_version': javascript_version,
                    'time_limit': int(time_limit),
                    'airline_getbooking': '',
                    'signature': signature
                })
            except Exception as e:
                ## penanda pre booking / after sales
                file = read_cache_file(request, signature, 'airline_get_booking_response')
                if file:
                    airline_get_booking_resp = file
                else:
                    airline_get_booking_resp = json.loads(request.POST['get_booking_data_json'])
                # airline_get_booking_resp = request.session.get('airline_get_booking_response') if request.session.get('airline_get_booking_response') else json.loads(request.POST['get_booking_data_json'])

                file = read_cache_file(request, signature, 'airline_create_passengers')
                if not file:
                    #dari getbooking
                    #CHECK SINI TEMBAK KO SAM
                    #pax
                    adult = []
                    infant = []
                    child = []
                    last_departure_date = ''
                    for rec in airline_get_booking_resp['result']['response']['provider_bookings']:
                        last_departure_date = rec['departure_date']
                        for ticket in rec['tickets']:
                            for fee in ticket['fees']:
                                if fee.get('description_text'):
                                    fee.pop('description_text')
                        if rec.get('rules'):
                            rec.pop('rules')
                        for journey in rec['journeys']:
                            for segment in journey['segments']:
                                if segment.get('fare_details'):
                                    segment.pop('fare_details')
                    for rec in airline_get_booking_resp['result']['response']['passengers']:
                        for fee in rec['fees']:
                            if fee.get('description_text'):
                                fee.pop('description_text')
                    for rec in airline_get_booking_resp['result']['response']['reschedule_list']:
                        for provider_booking in rec['provider_bookings']:
                            if(provider_booking.get('rules')):
                                provider_booking.pop('rules')
                            for journey in provider_booking['journeys']:
                                for segment in journey['segments']:
                                    if segment.get('fare_details'):
                                        segment.pop('fare_details')
                                    if (segment.get('addons')):
                                        segment.pop('addons')

                        for new_segment in rec['new_segments']:
                            if new_segment.get('fare_details'):
                                new_segment.pop('fare_details')
                            if (new_segment.get('addons')):
                                new_segment.pop('addons')
                        for old_segment in rec['old_segments']:
                            if(old_segment.get('fare_details')):
                                old_segment.pop('fare_details')
                            if (old_segment.get('addons')):
                                old_segment.pop('addons')

                    write_cache_file(request, signature, 'airline_get_booking_response', airline_get_booking_resp)
                    # set_session(request, 'airline_get_booking_response_%s' % signature, airline_get_booking_resp)
                    for pax in airline_get_booking_resp['result']['response']['passengers']:
                        if pax.get('birth_date'):
                            pax_type = pax.get('pax_type', '')
                            if (datetime.strptime(last_departure_date, '%Y-%m-%d %H:%M:%S') - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 <= 2 and pax_type == '' or pax_type == 'INF':
                                infant.append({
                                    "pax_type": 'INF',
                                    "first_name": pax['first_name'],
                                    "last_name": pax['last_name'],
                                    "title": pax['title'],
                                    "birth_date": pax['birth_date'],
                                    "nationality_code": pax['nationality_code'],
                                    "passport_number": pax['identity_number'],
                                    "passport_expdate": pax['identity_expdate'],
                                    "country_of_issued_code": pax['identity_country_of_issued_code'],
                                    "identity_type": pax['identity_type'],
                                    "sequence": pax['sequence']
                                })
                            elif (datetime.strptime(last_departure_date, '%Y-%m-%d %H:%M:%S') - datetime.strptime(pax['birth_date'], '%d %b %Y')).days / 365 < 12 and pax_type == '' or pax_type == 'CHD':
                                child.append({
                                    "pax_type": 'CHD',
                                    "first_name": pax['first_name'],
                                    "last_name": pax['last_name'],
                                    "title": pax['title'],
                                    "birth_date": pax['birth_date'],
                                    "nationality_code": pax['nationality_code'],
                                    "passport_number": pax['identity_number'],
                                    "passport_expdate": pax['identity_expdate'],
                                    "country_of_issued_code": pax['identity_country_of_issued_code'],
                                    "identity_type": pax['identity_type'],
                                    "sequence": pax['sequence']
                                })
                            else:
                                adult.append({
                                    "pax_type": pax_type if pax_type else 'ADT',
                                    "first_name": pax['first_name'],
                                    "last_name": pax['last_name'],
                                    "title": pax['title'],
                                    "birth_date": pax['birth_date'],
                                    "nationality_code": pax['nationality_code'],
                                    "passport_number": pax['identity_number'],
                                    "passport_expdate": pax['identity_expdate'],
                                    "country_of_issued_code": pax['identity_country_of_issued_code'],
                                    "identity_type": pax['identity_type'],
                                    "sequence": pax['sequence']
                                })
                        else:
                            pax_type = pax.get('pax_type', '')
                            adult.append({
                                "pax_type": pax_type if pax_type else 'ADT',
                                "first_name": pax['first_name'],
                                "last_name": pax['last_name'],
                                "title": pax['title'],
                                "birth_date": pax['birth_date'],
                                "nationality_code": pax['nationality_code'],
                                "passport_number": pax['identity_number'],
                                "passport_expdate": pax['identity_expdate'],
                                "country_of_issued_code": pax['identity_country_of_issued_code'],
                                "identity_type": pax['identity_type'],
                                "sequence": pax['sequence']
                            })
                    title_booker = 'MR'
                    if airline_get_booking_resp['result']['response']['booker']['gender'] == 'female':
                        if airline_get_booking_resp['result']['response']['booker']['marital_status'] != '':
                            title_booker = 'MRS'
                        else:
                            title_booker = 'MS'
                    airline_create_passengers = {
                        'booker': {
                            "first_name": airline_get_booking_resp['result']['response']['booker']['first_name'],
                            "last_name": airline_get_booking_resp['result']['response']['booker']['last_name'],
                            "title": title_booker,
                            "email": airline_get_booking_resp['result']['response']['booker']['email'],
                            "calling_code":airline_get_booking_resp['result']['response']['booker']['phones'][len(airline_get_booking_resp['result']['response']['booker']['phones']) - 1]['calling_code'],
                            "mobile": airline_get_booking_resp['result']['response']['booker']['phones'][len(airline_get_booking_resp['result']['response']['booker']['phones']) - 1]['calling_number'],
                            "nationality_code": airline_get_booking_resp['result']['response']['booker']['nationality_name'],
                            "contact_seq_id": airline_get_booking_resp['result']['response']['booker']['seq_id']
                        },
                        'adult': adult,
                        'child': child,
                        'infant': infant
                    }

                    write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
                    # set_session(request, 'airline_create_passengers_%s' % signature, airline_create_passengers)
                    passenger = []

                    for pax_type in airline_create_passengers:
                        if pax_type not in ['infant', 'booker', 'contact']:
                            for pax in airline_create_passengers[pax_type]:
                                pax['seat_list'] = []
                                file = read_cache_file(request, signature, 'airline_get_seat_availability')
                                if file:
                                    airline_get_seat_availability = file
                                for seat_provider in airline_get_seat_availability['result']['response']['seat_availability_provider']:
                                    if seat_provider.get('segments'):
                                        for segment in seat_provider['segments']:
                                            found = False
                                            passenger_obj = {
                                                'seat_pick': '',
                                                'seat_code': '',
                                                'seat_name': '',
                                                'description': '',
                                                'currency': '',
                                                'price': ''
                                            }
                                            for pax_obj in airline_get_booking_resp['result']['response']['passengers']:
                                                if pax['first_name'] == pax_obj['first_name'] and pax['last_name'] == pax_obj['last_name'] and pax['birth_date'] == pax_obj['birth_date']:
                                                    for pax_obj in pax_obj['fees']:
                                                        if pax_obj['fee_type'] == 'SEAT' and segment['segment_code'] == pax_obj['journey_code']:
                                                            passenger_obj['seat_pick'] = pax_obj['fee_value']
                                                            passenger_obj['seat_code'] = pax_obj['fee_code']
                                                            passenger_obj['seat_name'] = pax_obj['fee_name']
                                                            passenger_obj['description'] = pax_obj['description']
                                                            passenger_obj['currency'] = pax_obj['currency']
                                                            passenger_obj['price'] = pax_obj['amount']
                                                            found = True
                                                            break
                                                if found:
                                                    break
                                            pax['seat_list'].append({
                                                'segment_code': segment['segment_code2'],
                                                'departure_date': segment['departure_date'],
                                                'seat_pick': passenger_obj['seat_pick'],
                                                'seat_code': passenger_obj['seat_code'],
                                                'seat_name': passenger_obj['seat_name'],
                                                'description': passenger_obj['description'],
                                                'currency': passenger_obj['currency'],
                                                'price': passenger_obj['price']
                                            })
                                passenger.append(pax)

                    write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)

                    upsell = 0
                    for pax in airline_get_booking_resp['result']['response']['passengers']:
                        if pax.get('channel_service_charges'):
                            upsell = pax['channel_service_charges']['amount']
                    airline_get_booking = copy.deepcopy(airline_get_booking_resp['result']['response'])
                    if airline_get_booking.get('reschedule_list'):
                        del airline_get_booking['reschedule_list']  # pop sementara ada list isi string pakai " wktu di parser error
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'airline_carriers': carrier,
                        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                        'countries': airline_country,
                        'phone_code': phone_code,
                        'after_sales': 1,
                        'upsell': upsell,
                        'airline_getbooking': airline_get_booking,
                        'additional_price': '',
                        'passengers': passenger,
                        'static_path_url_server': get_url_static_path(),
                        'username': request.session['user_account'],
                        'javascript_version': javascript_version,
                        'airline_request': '',
                        'price': '',
                        'time_limit': '',
                        'signature': signature,
                    })
                elif airline_get_booking_resp:
                    passenger = []
                    file = read_cache_file(request, signature, 'airline_create_passengers')
                    if file:
                        airline_create_passengers = file
                        for pax_type in airline_create_passengers:
                            if pax_type not in ['infant', 'booker', 'contact']:
                                for pax in airline_create_passengers[pax_type]:
                                    passenger.append(pax)
                    upsell = 0
                    for pax in airline_get_booking_resp['result']['response']['passengers']:
                        if pax.get('channel_service_charges'):
                            upsell = pax['channel_service_charges']['amount']
                    airline_get_booking = copy.deepcopy(airline_get_booking_resp['result']['response'])
                    values.update({
                        'static_path': path_util.get_static_path(MODEL_NAME),
                        'airline_carriers': carrier,
                        'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                        'countries': airline_country,
                        'phone_code': phone_code,
                        'after_sales': 1,
                        'upsell': upsell,
                        'airline_getbooking': airline_get_booking,
                        'additional_price': '',
                        'passengers': passenger,
                        'static_path_url_server': get_url_static_path(),
                        'username': request.session['user_account'],
                        'javascript_version': javascript_version,
                        'airline_request': '',
                        'price': '',
                        'time_limit': '',
                        'signature': signature,
                    })
                elif not hasattr(airline_get_booking_resp, 'dict'):
                    ## pre booking error
                    _logger.error(str(e) + '\n' + traceback.format_exc())
                    raise Exception('Make response code 500!')
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_seat_map_templates.html', values)
    else:
        return no_session_logout(request)

def seat_map_public(request, signature=-1):
    if signature != -1:
        javascript_version = get_javascript_version(request)
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)
        carrier = get_carriers(request, request.session['signature'])
        # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
        # if file:
        #     carrier = file

        values = get_data_template(request)


        additional_price_input = '0'

        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'airline_carriers': carrier,
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'phone_code': phone_code,
            'after_sales': 0,
            'additional_price': float(additional_price_input),
            # 'airline_destinations': airline_destinations,
            # 'airline_seat_map': request.session['airline_get_seat_availability']['result']['response'],
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
            # 'cookies': json.dumps(res['result']['cookies']),
        })
        return render(request, MODEL_NAME+'/airline/airline_seat_map_public_templates.html', values)
    else:
        #error 404
        return no_session_logout(request)

def review(request, signature):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            country = {}
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)

            ssr = []
            if request.META.get('HTTP_REFERER'):
                ## SSR
                if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-2] == 'ssr':
                    try:
                        passenger = []
                        file = read_cache_file(request, signature, 'airline_create_passengers')
                        if file:
                            airline_create_passengers = file
                            for pax_type in airline_create_passengers:
                                if pax_type not in ['infant', 'booker', 'contact']:
                                    for pax in airline_create_passengers[pax_type]:
                                        passenger.append(pax)
                        sell_ssrs = []
                        sell_ssrs_request = []
                        passengers_list = []
                        for idx, pax in enumerate(passenger, start=1):
                            pax['ssr_list'] = []
                            if not pax.get('behaviors'):
                                pax['behaviors'] = {}
                            if not pax['behaviors'].get('airline'):
                                pax['behaviors']['airline'] = ""
                            pax['behaviors']['airline'] = request.POST['passenger%s' % idx]

                        file = read_cache_file(request, signature, 'airline_get_ssr')
                        if file:
                            ssr_response = file['result']['response']
                        # ssr_response = request.session['airline_get_ssr_%s' % signature]['result']['response']
                        no_ssr_count = 0
                        for counter_ssr_availability_provider, ssr_package in enumerate(ssr_response['ssr_availability_provider']):
                            if (ssr_package.get('ssr_availability')):
                                for ssr_key in ssr_package['ssr_availability']:
                                    for counter_journey, journey_ssr in enumerate(ssr_package['ssr_availability'][ssr_key]):
                                        for idx, pax in enumerate(passenger):
                                            try:
                                                ssr_code = request.POST[ssr_key+'_'+str(counter_ssr_availability_provider+1-no_ssr_count)+'_'+str(idx+1)+'_'+str(counter_journey+1)].split('_')
                                                if len(ssr_code) > 0:
                                                    ssr_code.pop()
                                                if len(ssr_code) > 0:
                                                    ssr_code.pop()
                                                if ssr_code != '':
                                                    passengers_list.append({
                                                        "passenger_number": idx,
                                                        "ssr_code": "_".join(ssr_code)
                                                    })
                                                    for list_ssr in journey_ssr['ssrs']:
                                                        if "_".join(ssr_code) == list_ssr['ssr_code']:
                                                            list_ssr['fee_code'] = list_ssr['ssr_code']
                                                            list_ssr.update({
                                                                'origin': journey_ssr['origin'],
                                                                'destination': journey_ssr['destination'],
                                                                'departure_date': convert_string_to_date_to_string_front_end_with_time(journey_ssr['segments'][0]['departure_date']).split('  ')[0]
                                                            })
                                                            pax['ssr_list'].append(list_ssr)
                                                            break
                                            except:
                                                pass
                                        if len(passengers_list) > 0:
                                            sell_ssrs_request.append({
                                                'journey_code': journey_ssr['journey_code'],
                                                'passengers': passengers_list,
                                                'availability_type': ssr_key
                                            })
                                        passengers_list = []
                                if len(sell_ssrs_request) != 0:
                                    sell_ssrs.append({
                                        'sell_ssrs': sell_ssrs_request,
                                        'provider': ssr_package['provider']
                                    })
                            else:
                                no_ssr_count += 1
                            sell_ssrs_request = []
                        write_cache_file(request, signature, 'airline_ssr_request', sell_ssrs)
                            # set_session(request, 'airline_ssr_request_%s' % signature, sell_ssrs)
                        sell_ssrs = []
                        write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
                    except:
                        print('airline no ssr')

                ## SEAT
                elif request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-2] == 'seat_map':
                    try:
                        passenger = []
                        file = read_cache_file(request, signature, 'airline_create_passengers')
                        if file:
                            airline_create_passengers = file
                            for pax_type in airline_create_passengers:
                                if pax_type not in ['infant', 'booker', 'contact']:
                                    for pax in airline_create_passengers[pax_type]:
                                        passenger.append(pax)
                        passengers = json.loads(request.POST['passenger'])
                        #
                        for idx, pax in enumerate(passengers):
                            seat_list = []
                            for seat_data in passengers[idx]['seat_list']:
                                if seat_data['seat_code'] != '':
                                    seat_list.append(seat_data)
                            passenger[idx]['seat_list'] = seat_list
                            if not passenger[idx].get('behaviors'):
                                passenger[idx]['behaviors'] = {}
                            if not passenger[idx]['behaviors'].get('airline'):
                                passenger[idx]['behaviors']['airline'] = ""
                            passenger[idx]['behaviors']['airline'] = pax['behaviors']['airline']

                        file = read_cache_file(request, signature, 'airline_get_seat_availability')
                        if file:
                            seat_map_list = file['result']['response']
                        # seat_map_list = request.session['airline_get_seat_availability_%s' % signature]['result']['response']
                        segment_seat_request = []

                        for seat_map_provider in seat_map_list['seat_availability_provider']:
                            if seat_map_provider.get('segments'):
                                for seat_segment in seat_map_provider['segments']:
                                    pax_request = []
                                    for idx, pax in enumerate(passengers):
                                        for pax_seat in pax['seat_list']:
                                            if pax_seat['segment_code'] == seat_segment['segment_code2'] and pax_seat['departure_date'] == seat_segment['departure_date']:
                                                if pax_seat['seat_code'] != '':
                                                    pax_request.append({
                                                        'passenger_number': idx,
                                                        'seat_code': pax_seat['seat_code']
                                                    })
                                                    pax_seat['segment_code_check'] = seat_segment['segment_code']
                                                break

                                    if len(pax_request) != 0:
                                        segment_seat_request.append({
                                            'segment_code': seat_segment['segment_code'],
                                            'provider': seat_segment['provider'],
                                            'passengers': pax_request
                                        })
                                    pax_request = []

                        write_cache_file(request, signature, 'airline_seat_request', segment_seat_request)
                        write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
                        # set_session(request, 'airline_seat_request_%s' % signature, segment_seat_request)

                    except Exception as e:
                        _logger.error("#####ERROR CHOOSE SEAT#####")
                        _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                        try:
                            passenger = []
                            file = read_cache_file(request, signature, 'airline_create_passengers')
                            if file:
                                airline_create_passengers = file
                            for pax_type in airline_create_passengers:
                                if pax_type not in ['infant', 'booker', 'contact']:
                                    for pax in airline_create_passengers[pax_type]:
                                        passenger.append(pax)
                            for pax in passenger:
                                if pax.get('seat_list'):
                                    pax.pop('seat_list')
                        except Exception as e:
                            _logger.error("%s, %s" % (str(e), traceback.format_exc()))

                ## PASSENGER
                elif request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-2] == 'passenger':
                    write_cache_file(request, signature, 'airline_seat_request', {})
                    write_cache_file(request, signature, 'airline_ssr_request', {})
                    # set_session(request, 'airline_seat_request_%s' % signature, {})
                    # set_session(request, 'airline_ssr_request_%s' % signature, {})
                    adult = []
                    child = []
                    infant = []
                    contact = []
                    student = []
                    seaman = []
                    labour = []
                    try:
                        img_list_data = json.loads(request.POST['image_list_data'])
                    except:
                        img_list_data = []

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
                        'booker_seq_id': request.POST['booker_id'],
                    }
                    file = read_cache_file(request, signature, 'airline_request')
                    if file:
                        airline_request = file

                        file = read_cache_file(request, signature, 'airline_get_ff_availability')
                        if file and file['result']['error_code'] == 0:
                            ff_request = file['result']['response']['ff_availability_provider']
                        else:
                            ff_request = []

                        # try:
                        #     ff_request = request.session['airline_get_ff_availability_%s' % signature]['result']['response']['ff_availability_provider']
                        # except:
                        #     ff_request = []

                        for i in range(int(airline_request['adult'])):
                            ff_number = []
                            counter = 0
                            for j in ff_request:
                                try:
                                    if request.POST['adult_ff_number' + str(i + 1)+'_' + str(counter + 1)] != '':
                                        ff_number.append({
                                            "schedule_id": j['schedule_id'],
                                            "ff_number": request.POST['adult_ff_number' + str(i + 1)+'_' + str(counter + 1)],
                                            "ff_code": request.POST['adult_ff_request' + str(i + 1)+'_' + str(counter + 1)+'_id']
                                        })
                                except Exception as e:
                                    _logger.error('FF not found in  POST' + str(e) + '\n' + traceback.format_exc())
                                counter += 1

                            passport_number = ''
                            passport_first_name = ''
                            passport_last_name = ''
                            passport_ed = ''
                            passport_country_of_issued = ''
                            is_valid_identity = request.POST.get('adult_valid_passport' + str(i + 1), 'off')
                            is_wheelchair = request.POST.get('adult_wheelchair' + str(i + 1), 'off')
                            if is_valid_identity == 'on':
                                is_valid_identity = False
                            else:
                                is_valid_identity = True

                            if is_wheelchair == 'on':
                                is_wheelchair = True
                            else:
                                is_wheelchair = False
                            if request.POST.get('adult_id_type' + str(i + 1)):
                                passport_number = request.POST.get('adult_passport_number' + str(i + 1))
                                passport_number = re.sub(r'\s', ' ', passport_number).replace(':', '').strip()
                                passport_first_name = re.sub(r'\s', ' ', request.POST.get('adult_identity_first_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_last_name = re.sub(r'\s', ' ', request.POST.get('adult_identity_last_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_ed = request.POST.get('adult_passport_expired_date' + str(i + 1))
                                passport_country_of_issued = request.POST.get('adult_country_of_issued' + str(i + 1) + '_id')

                            img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                            behaviors = {}
                            if request.POST.get('adult_behaviors_' + str(i + 1)):
                                behaviors = {'airline': request.POST['adult_behaviors_' + str(i + 1)]}

                            description = ''
                            if request.POST.get('adult_description_' + str(i + 1)):
                                description = request.POST['adult_description_' + str(i + 1)]

                            first_name = re.sub(r'\s', ' ', request.POST['adult_first_name' + str(i + 1)]).replace(':', '').strip()
                            last_name = re.sub(r'\s', ' ', request.POST.get('adult_last_name' + str(i + 1), '')).replace(':', '').strip()
                            # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                            # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                            adult.append({
                                "pax_type": "ADT",
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['adult_title' + str(i + 1)],
                                "birth_date": request.POST.get('adult_birth_date' + str(i + 1)),
                                "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                                "identity_country_of_issued_code": passport_country_of_issued if is_valid_identity else '',
                                "identity_expdate": passport_ed if is_valid_identity else '',
                                "identity_number": passport_number if is_valid_identity else '',
                                "identity_first_name": passport_first_name if is_valid_identity else '',
                                "identity_last_name": passport_last_name if is_valid_identity else '',
                                "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                                "identity_type": request.POST['adult_id_type' + str(i + 1)] if is_valid_identity else '',
                                "ff_numbers": ff_number,
                                "behaviors": behaviors,
                                "description": description,
                                "identity_image": img_identity_data,
                                "is_valid_identity": is_valid_identity,
                                "is_request_wheelchair": is_wheelchair
                            })

                            if request.POST.get('adult_riz_text_' + str(i + 1)):
                                adult[-1].update({
                                    "riz_text": request.POST.get('adult_riz_text_' + str(i + 1))
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
                                    email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1), '')).replace(':', '').strip()
                                    mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1), '')).replace(':', '').strip()
                                    contact.append({
                                        "first_name": first_name,
                                        "last_name": last_name,
                                        "title": request.POST['adult_title' + str(i + 1)],
                                        "email": email,
                                        "calling_code": request.POST['adult_phone_code' + str(i + 1) + '_id'],
                                        "mobile": mobile,
                                        "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
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

                        for i in range(int(airline_request['child'])):
                            ff_number = []
                            # try:
                            #     ff_request = request.session['airline_get_ff_availability_%s' % signature]['result']['response']['ff_availability_provider']
                            # except:
                            #     ff_request = []
                            counter = 0
                            for j in ff_request:
                                try:
                                    if request.POST['child_ff_number' + str(i + 1) + '_' + str(counter + 1)] != '':
                                        ff_number.append({
                                            "schedule_id": j['schedule_id'],
                                            "ff_number": request.POST['child_ff_number' + str(i + 1) + '_' + str(counter + 1)],
                                            "ff_code": request.POST['child_ff_request' + str(i + 1)+'_' + str(counter + 1)+'_id']
                                        })
                                except Exception as e:
                                    _logger.error('FF not found in  POST' + str(e) + '\n' + traceback.format_exc())
                                counter += 1

                            passport_number = ''
                            passport_first_name = ''
                            passport_last_name = ''
                            passport_ed = ''
                            passport_country_of_issued = ''
                            is_valid_identity = request.POST.get('child_valid_passport' + str(i + 1), 'off')
                            is_wheelchair = request.POST.get('child_wheelchair' + str(i + 1), 'off')
                            if is_valid_identity == 'on':
                                is_valid_identity = False
                            else:
                                is_valid_identity = True

                            if is_wheelchair == 'on':
                                is_wheelchair = True
                            else:
                                is_wheelchair = False
                            if request.POST.get('child_id_type' + str(i + 1)):
                                passport_number = request.POST['child_passport_number' + str(i + 1)]
                                passport_number = re.sub(r'\s', ' ', passport_number).replace(':', '').strip()
                                passport_first_name = re.sub(r'\s', ' ', request.POST.get('child_identity_first_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_last_name = re.sub(r'\s', ' ', request.POST.get('child_identity_last_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_ed = request.POST['child_passport_expired_date' + str(i + 1)]
                                passport_country_of_issued = request.POST['child_country_of_issued' + str(i + 1) + '_id']

                            img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'child' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]

                            behaviors = {}
                            if request.POST.get('child_behaviors_' + str(i + 1)):
                                behaviors = {'airline': request.POST['child_behaviors_' + str(i + 1)]}

                            description = ''
                            if request.POST.get('child_description_' + str(i + 1)):
                                description = request.POST['child_description_' + str(i + 1)]

                            first_name = re.sub(r'\s', ' ', request.POST['child_first_name' + str(i + 1)]).replace(':', '').strip()
                            last_name = re.sub(r'\s', ' ', request.POST.get('child_last_name' + str(i + 1), '')).replace(':', '').strip()
                            # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                            # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                            child.append({
                                "pax_type": "CHD",
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['child_title' + str(i + 1)],
                                "birth_date": request.POST['child_birth_date' + str(i + 1)],
                                "nationality_code": request.POST['child_nationality' + str(i + 1) + '_id'],
                                "identity_number": passport_number if is_valid_identity else '',
                                "identity_first_name": passport_first_name if is_valid_identity else '',
                                "identity_last_name": passport_last_name if is_valid_identity else '',
                                "identity_expdate": passport_ed if is_valid_identity else '',
                                "identity_country_of_issued_code": passport_country_of_issued if is_valid_identity else '',
                                "passenger_seq_id": request.POST['child_id' + str(i + 1)],
                                "identity_type": request.POST['child_id_type' + str(i + 1)] if is_valid_identity else '',
                                "ff_numbers": ff_number,
                                "behaviors": behaviors,
                                "description": description,
                                "identity_image": img_identity_data,
                                "is_valid_identity": is_valid_identity,
                                "is_request_wheelchair": is_wheelchair
                            })
                            if request.POST.get('child_riz_text_' + str(i + 1)):
                                child[-1].update({
                                    "riz_text": request.POST.get('child_riz_text_' + str(i + 1))
                                })

                        for i in range(int(airline_request['infant'])):
                            passport_number = ''
                            passport_first_name = ''
                            passport_last_name = ''
                            passport_ed = ''
                            passport_country_of_issued = ''
                            is_valid_identity = request.POST.get('infant_valid_passport' + str(i + 1), 'off')
                            if is_valid_identity == 'on':
                                is_valid_identity = False
                            else:
                                is_valid_identity = True
                            is_wheelchair = False
                            if request.POST.get('infant_id_type' + str(i + 1)):
                                passport_number = request.POST['infant_passport_number' + str(i + 1)]
                                passport_number = re.sub(r'\s', ' ', passport_number).replace(':', '').strip()
                                passport_first_name = re.sub(r'\s', ' ', request.POST.get('infant_identity_first_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_last_name = re.sub(r'\s', ' ', request.POST.get('infant_identity_last_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_ed = request.POST['infant_passport_expired_date' + str(i + 1)]
                                passport_country_of_issued = request.POST['infant_country_of_issued' + str(i + 1) + '_id']

                            img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'infant' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                            behaviors = {}
                            if request.POST.get('infant_behaviors_' + str(i + 1)):
                                behaviors = {'airline': request.POST['infant_behaviors_' + str(i + 1)]}

                            description = ''
                            if request.POST.get('infant_description_' + str(i + 1)):
                                description = request.POST['infant_description_' + str(i + 1)]

                            first_name = re.sub(r'\s', ' ', request.POST['infant_first_name' + str(i + 1)]).replace(':', '').strip()
                            last_name = re.sub(r'\s', ' ', request.POST.get('infant_last_name' + str(i + 1), '')).replace(':', '').strip()
                            # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                            # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                            infant.append({
                                "pax_type": "INF",
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['infant_title' + str(i + 1)],
                                "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                                "nationality_code": request.POST['infant_nationality' + str(i + 1) + '_id'],
                                "identity_number": passport_number if is_valid_identity else '',
                                "identity_first_name": passport_first_name if is_valid_identity else '',
                                "identity_last_name": passport_last_name if is_valid_identity else '',
                                "identity_expdate": passport_ed if is_valid_identity else '',
                                "identity_country_of_issued_code": passport_country_of_issued if is_valid_identity else '',
                                "passenger_seq_id": request.POST['infant_id' + str(i + 1)],
                                "identity_type": request.POST['infant_id_type' + str(i + 1)] if is_valid_identity else '',
                                "behaviors": behaviors,
                                "description": description,
                                "identity_image": img_identity_data,
                                "is_valid_identity": is_valid_identity,
                                "is_request_wheelchair": is_wheelchair
                            })

                            if request.POST.get('infant_riz_text_' + str(i + 1)):
                                infant[-1].update({
                                    "riz_text": request.POST.get('infant_riz_text_' + str(i + 1))
                                })

                        for i in range(int(airline_request.get('student') or 0)):
                            ff_number = []
                            # try:
                            #     ff_request = request.session['airline_get_ff_availability_%s' % signature]['result']['response']['ff_availability_provider']
                            # except:
                            #     ff_request = []
                            counter = 0
                            for j in ff_request:
                                try:
                                    if request.POST['student_ff_number' + str(i + 1) + '_' + str(counter + 1)] != '':
                                        ff_number.append({
                                            "schedule_id": j['schedule_id'],
                                            "ff_number": request.POST['student_ff_number' + str(i + 1) + '_' + str(counter + 1)],
                                            "ff_code": request.POST['student_ff_request' + str(i + 1)+'_' + str(counter + 1)+'_id']
                                        })
                                except Exception as e:
                                    _logger.error('FF not found in  POST' + str(e) + '\n' + traceback.format_exc())
                                counter += 1

                            passport_number = ''
                            passport_first_name = ''
                            passport_last_name = ''
                            passport_ed = ''
                            passport_country_of_issued = ''
                            is_valid_identity = request.POST.get('student_valid_passport' + str(i + 1), 'off')
                            is_wheelchair = request.POST.get('student_wheelchair' + str(i + 1), 'off')
                            if is_valid_identity == 'on':
                                is_valid_identity = False
                            else:
                                is_valid_identity = True

                            if is_wheelchair == 'on':
                                is_wheelchair = True
                            else:
                                is_wheelchair = False
                            if request.POST.get('student_id_type' + str(i + 1)):
                                passport_number = request.POST['student_passport_number' + str(i + 1)]
                                passport_number = re.sub(r'\s', ' ', passport_number).replace(':', '').strip()
                                passport_first_name = re.sub(r'\s', ' ', request.POST.get('student_identity_first_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_last_name = re.sub(r'\s', ' ', request.POST.get('student_identity_last_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_ed = request.POST['student_passport_expired_date' + str(i + 1)]
                                passport_country_of_issued = request.POST['student_country_of_issued' + str(i + 1) + '_id']

                            img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'student' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]

                            behaviors = {}
                            if request.POST.get('student_behaviors_' + str(i + 1)):
                                behaviors = {'airline': request.POST['student_behaviors_' + str(i + 1)]}

                            description = ''
                            if request.POST.get('student_description_' + str(i + 1)):
                                description = request.POST['student_description_' + str(i + 1)]

                            first_name = re.sub(r'\s', ' ', request.POST['student_first_name' + str(i + 1)]).replace(':','')
                            last_name = re.sub(r'\s', ' ', request.POST.get('student_last_name' + str(i + 1), '')).replace(':','')
                            # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                            # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                            student.append({
                                "pax_type": "STU",
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['student_title' + str(i + 1)],
                                "birth_date": request.POST['student_birth_date' + str(i + 1)],
                                "nationality_code": request.POST['student_nationality' + str(i + 1) + '_id'],
                                "identity_number": passport_number,
                                "identity_first_name": passport_first_name,
                                "identity_last_name": passport_last_name,
                                "identity_expdate": passport_ed,
                                "identity_country_of_issued_code": passport_country_of_issued,
                                "passenger_seq_id": request.POST['student_id' + str(i + 1)],
                                "identity_type": request.POST['student_id_type' + str(i + 1)],
                                "ff_numbers": ff_number,
                                "behaviors": behaviors,
                                "description": description,
                                "identity_image": img_identity_data,
                                "is_valid_identity": is_valid_identity,
                                "is_request_wheelchair": is_wheelchair
                            })
                            if request.POST.get('student_riz_text_' + str(i + 1)):
                                student[-1].update({
                                    "riz_text": request.POST.get('student_riz_text_' + str(i + 1))
                                })

                        for i in range(int(airline_request.get('labour') or 0)):
                            ff_number = []
                            # try:
                            #     ff_request = request.session['airline_get_ff_availability_%s' % signature]['result']['response']['ff_availability_provider']
                            # except:
                            #     ff_request = []
                            counter = 0
                            for j in ff_request:
                                try:
                                    if request.POST['labour_ff_number' + str(i + 1) + '_' + str(counter + 1)] != '':
                                        ff_number.append({
                                            "schedule_id": j['schedule_id'],
                                            "ff_number": request.POST['labour_ff_number' + str(i + 1) + '_' + str(counter + 1)],
                                            "ff_code": request.POST['labour_ff_request' + str(i + 1)+'_' + str(counter + 1)+'_id']
                                        })
                                except Exception as e:
                                    _logger.error('FF not found in  POST' + str(e) + '\n' + traceback.format_exc())
                                counter += 1

                            passport_number = ''
                            passport_first_name = ''
                            passport_last_name = ''
                            passport_ed = ''
                            passport_country_of_issued = ''
                            is_valid_identity = request.POST.get('labour_valid_passport' + str(i + 1), 'off')
                            is_wheelchair = request.POST.get('labour_wheelchair' + str(i + 1), 'off')
                            if is_valid_identity == 'on':
                                is_valid_identity = False
                            else:
                                is_valid_identity = True

                            if is_wheelchair == 'on':
                                is_wheelchair = True
                            else:
                                is_wheelchair = False
                            if request.POST.get('labour_id_type' + str(i + 1)):
                                passport_number = request.POST['labour_passport_number' + str(i + 1)]
                                passport_number = re.sub(r'\s', ' ', passport_number).replace(':', '').strip()
                                passport_first_name = re.sub(r'\s', ' ', request.POST.get('labour_identity_first_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_last_name = re.sub(r'\s', ' ', request.POST.get('labour_identity_last_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_ed = request.POST['labour_passport_expired_date' + str(i + 1)]
                                passport_country_of_issued = request.POST['labour_country_of_issued' + str(i + 1) + '_id']

                            img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'labour' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]

                            behaviors = {}
                            if request.POST.get('labour_behaviors_' + str(i + 1)):
                                behaviors = {'airline': request.POST['labour_behaviors_' + str(i + 1)]}

                            description = ''
                            if request.POST.get('labour_description_' + str(i + 1)):
                                description = request.POST['labour_description_' + str(i + 1)]

                            first_name = re.sub(r'\s', ' ', request.POST['labour_first_name' + str(i + 1)]).replace(':','')
                            last_name = re.sub(r'\s', ' ', request.POST.get('labour_last_name' + str(i + 1), '')).replace(':','')
                            # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                            # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                            labour.append({
                                "pax_type": "LBR",
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['labour_title' + str(i + 1)],
                                "birth_date": request.POST['labour_birth_date' + str(i + 1)],
                                "nationality_code": request.POST['labour_nationality' + str(i + 1) + '_id'],
                                "identity_number": passport_number,
                                "identity_first_name": passport_first_name,
                                "identity_last_name": passport_last_name,
                                "identity_expdate": passport_ed,
                                "identity_country_of_issued_code": passport_country_of_issued,
                                "passenger_seq_id": request.POST['labour_id' + str(i + 1)],
                                "identity_type": request.POST['labour_id_type' + str(i + 1)],
                                "ff_numbers": ff_number,
                                "behaviors": behaviors,
                                "description": description,
                                "identity_image": img_identity_data,
                                "is_valid_identity": is_valid_identity,
                                "is_request_wheelchair": is_wheelchair
                            })
                            if request.POST.get('labour_riz_text_' + str(i + 1)):
                                labour[-1].update({
                                    "riz_text": request.POST.get('labour_riz_text_' + str(i + 1))
                                })

                        for i in range(int(airline_request.get('seaman') or 0)):
                            ff_number = []
                            # try:
                            #     ff_request = request.session['airline_get_ff_availability_%s' % signature]['result']['response']['ff_availability_provider']
                            # except:
                            #     ff_request = []
                            counter = 0
                            for j in ff_request:
                                try:
                                    if request.POST['seaman_ff_number' + str(i + 1) + '_' + str(counter + 1)] != '':
                                        ff_number.append({
                                            "schedule_id": j['schedule_id'],
                                            "ff_number": request.POST['seaman_ff_number' + str(i + 1) + '_' + str(counter + 1)],
                                            "ff_code": request.POST['seaman_ff_request' + str(i + 1)+'_' + str(counter + 1)+'_id']
                                        })
                                except Exception as e:
                                    _logger.error('FF not found in  POST' + str(e) + '\n' + traceback.format_exc())
                                counter += 1

                            passport_number = ''
                            passport_first_name = ''
                            passport_last_name = ''
                            passport_ed = ''
                            passport_country_of_issued = ''
                            is_valid_identity = request.POST.get('seaman_valid_passport' + str(i + 1), 'off')
                            is_wheelchair = request.POST.get('seaman_wheelchair' + str(i + 1), 'off')
                            if is_valid_identity == 'on':
                                is_valid_identity = False
                            else:
                                is_valid_identity = True

                            if is_wheelchair == 'on':
                                is_wheelchair = True
                            else:
                                is_wheelchair = False
                            if request.POST.get('seaman_id_type' + str(i + 1)):
                                passport_number = request.POST['seaman_passport_number' + str(i + 1)]
                                passport_number = re.sub(r'\s', ' ', passport_number).replace(':', '').strip()
                                passport_first_name = re.sub(r'\s', ' ', request.POST.get('seaman_identity_first_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_last_name = re.sub(r'\s', ' ', request.POST.get('seaman_identity_last_name' + str(i + 1), '')).replace(':', '').strip()
                                passport_ed = request.POST['seaman_passport_expired_date' + str(i + 1)]
                                passport_country_of_issued = request.POST['seaman_country_of_issued' + str(i + 1) + '_id']

                            img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'seaman' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]

                            behaviors = {}
                            if request.POST.get('seaman_behaviors_' + str(i + 1)):
                                behaviors = {'airline': request.POST['seaman_behaviors_' + str(i + 1)]}

                            description = ''
                            if request.POST.get('seaman_description_' + str(i + 1)):
                                description = request.POST['seaman_description_' + str(i + 1)]

                            first_name = re.sub(r'\s', ' ', request.POST['seaman_first_name' + str(i + 1)]).replace(':','')
                            last_name = re.sub(r'\s', ' ', request.POST.get('seaman_last_name' + str(i + 1), '')).replace(':','')
                            # email = re.sub(r'\s', ' ', request.POST['booker_email']).replace(':', '').strip()
                            # mobile = re.sub(r'\s', ' ', request.POST['booker_phone']).replace(':', '').strip()

                            seaman.append({
                                "pax_type": "SEA",
                                "first_name": first_name,
                                "last_name": last_name,
                                "title": request.POST['seaman_title' + str(i + 1)],
                                "birth_date": request.POST['seaman_birth_date' + str(i + 1)],
                                "nationality_code": request.POST['seaman_nationality' + str(i + 1) + '_id'],
                                "identity_number": passport_number,
                                "identity_first_name": passport_first_name,
                                "identity_last_name": passport_last_name,
                                "identity_expdate": passport_ed,
                                "identity_country_of_issued_code": passport_country_of_issued,
                                "passenger_seq_id": request.POST['seaman_id' + str(i + 1)],
                                "identity_type": request.POST['seaman_id_type' + str(i + 1)],
                                "ff_numbers": ff_number,
                                "behaviors": behaviors,
                                "description": description,
                                "identity_image": img_identity_data,
                                "is_valid_identity": is_valid_identity,
                                "is_request_wheelchair": is_wheelchair
                            })
                            if request.POST.get('seaman_riz_text_' + str(i + 1)):
                                seaman[-1].update({
                                    "riz_text": request.POST.get('seaman_riz_text_' + str(i + 1))
                                })


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
                            'is_also_booker': True
                        })

                    airline_create_passengers = {
                        'booker': booker,
                        'adult': adult,
                        'child': child,
                        'infant': infant,
                        'seaman': seaman,
                        'labour': labour,
                        'student': student,
                        'contact': contact
                    }
                    # write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
                    # set_session(request, 'airline_create_passengers_%s' % signature, airline_create_passengers)

                    # request.session.modified = True
                    passenger = []

                    # file = read_cache_file(request, signature, 'airline_create_passengers')
                    # if file:
                    #     airline_create_passengers = file
                    for pax_type in airline_create_passengers:
                        if pax_type not in ['infant', 'booker', 'contact']:
                            for pax in airline_create_passengers[pax_type]:
                                pax['ssr_list'] = []
                                passenger.append(pax)
                    write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
            else:
                # move from b2c to login user
                try:
                    write_cache_file(request, signature, 'airline_price_itinerary', json.loads(request.POST['airline_price_itinerary']))
                    write_cache_file(request, signature, 'airline_get_price_request', json.loads(request.POST['airline_price_itinerary_request']))
                    write_cache_file(request, signature, 'airline_sell_journey', json.loads(request.POST['airline_sell_journey_response']))
                    write_cache_file(request, signature, 'airline_create_passengers', json.loads(request.POST['airline_create_passengers']))
                    write_cache_file(request, signature, 'airline_ssr_request', json.loads(request.POST['airline_ssr_request']))
                    write_cache_file(request, signature, 'airline_seat_request', json.loads(request.POST['airline_seat_request']))
                    # set_session(request, 'airline_price_itinerary_%s' % signature,json.loads(request.POST['airline_price_itinerary']))
                    # set_session(request, 'airline_get_price_request_%s' % signature,json.loads(request.POST['airline_price_itinerary_request']))
                    # set_session(request, 'airline_sell_journey_%s' % signature, json.loads(request.POST['airline_sell_journey_response']))
                    # set_session(request, 'signature', request.POST['signature'])
                    # set_session(request, 'airline_signature', request.POST['signature'])
                    # set_session(request, 'airline_create_passengers_%s' % signature, json.loads(request.POST['airline_create_passengers']))
                    # set_session(request, 'airline_ssr_request_%s' % signature, json.loads(request.POST['airline_ssr_request']))
                    # set_session(request, 'airline_seat_request_%s' % signature, json.loads(request.POST['airline_seat_request']))
                except Exception as e:
                    _logger.error('use airline get price request from cache')
                passenger = []

                file = read_cache_file(request, signature, 'airline_create_passengers')
                if file:
                    airline_create_passengers = file
                    for pax_type in airline_create_passengers:
                        if pax_type not in ['infant', 'booker', 'contact']:
                            for pax in airline_create_passengers[pax_type]:
                                passenger.append(pax)

            airline_carriers = get_carriers(request, signature)
            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     airline_carriers = file
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
            try:
                additional_price_input = request.POST['additional_price_input'].split(' ')[-1].replace(',', '')
            except:
                additional_price_input = '0'

            force_issued = True
            try:
                file = read_cache_file(request, signature, 'airline_sell_journey')
                if file:
                    airline_price_temp = file['sell_journey_provider']
                    for airline in airline_price_temp:
                        if airline['provider'] == 'traveloka':
                            force_issued = False
            except Exception as e:
                # cache reset
                _logger.info('cache reset here ' + str(e) + '\n' + traceback.format_exc())
                write_cache_file(request, signature, 'airline_sell_journey',json.loads(request.POST['airline_sell_journey']))
                # set_session(request, 'airline_sell_journey_%s' % signature, json.loads(request.POST['airline_sell_journey']))

            try:
                time_limit = get_timelimit_product(request, 'airline', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit',time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                pass

            write_cache_file(request, signature, 'passenger_with_ssr', passenger)
            # set_session(request, 'passenger_with_ssr_%s' % signature, passenger)

            file = read_cache_file(request, signature, 'airline_get_ssr')
            if file:
                airline_get_ssr = file['result']['error_code']
            else:
                airline_get_ssr = 1

            file = read_cache_file(request, signature, 'airline_get_seat_availability')
            if file:
                airline_get_seat_availability = file['result']['error_code']
            else:
                airline_get_seat_availability = 1

            file = read_cache_file(request, signature, 'airline_request')
            if file:
                airline_request = file

            file = read_cache_file(request, signature, 'airline_sell_journey')
            if file:
                airline_sell_journey = file

            file = read_cache_file(request, signature, 'airline_create_passengers')
            if file:
                airline_create_passengers = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'ssr': airline_get_ssr,
                'seat': airline_get_seat_availability,
                'airline_request': airline_request,
                'price': airline_sell_journey,
                'airline_pick': airline_sell_journey['sell_journey_provider'],
                'back_page': request.META.get('HTTP_REFERER'),
                'json_airline_pick': airline_sell_journey['sell_journey_provider'],
                'airline_carriers': airline_carriers,
                'additional_price': float(additional_price_input.split(' ')[len(additional_price_input.split(' '))-1]),
                'username': request.session['user_account'],
                'passengers': airline_create_passengers,
                'passengers_ssr': passenger,
                'force_issued': force_issued,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'signature': signature,
                'time_limit': int(time_limit),
                'airline_get_price_request': airline_sell_journey,
                # 'co_uid': request.session['co_uid'],
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/airline/airline_review_templates.html', values)
    else:
        return no_session_logout(request)

def review_after_sales(request, signature):
    if 'user_account' in request.session._session and 'ticketing_airline' in request.session['user_account']['co_agent_frontend_security']:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)
            goto = 0
            ssr = []
            addons_type = ''

            if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/'))-2] == 'ssr':
                try:
                    passenger = []

                    file = read_cache_file(request, signature, 'airline_create_passengers')
                    if file:
                        airline_create_passengers = file
                        for pax_type in airline_create_passengers:
                            if pax_type not in ['infant', 'booker', 'contact']:
                                for pax in airline_create_passengers[pax_type]:
                                    passenger.append(pax)
                    sell_ssrs = []
                    sell_ssrs_request = []
                    passengers_list = []
                    page = 'ssr'
                    for pax in passenger:
                        pax['ssr_list'] = []

                    file = read_cache_file(request, signature, 'airline_get_ssr')
                    if file:
                        ssr_response = file['result']['response']
                    # ssr_response = request.session['airline_get_ssr_%s' % signature]['result']['response']

                    file = read_cache_file(request, signature, 'airline_get_booking_response')
                    if file:
                        data_booking = file['result']['response']['provider_bookings']
                    # data_booking = request.session['airline_get_booking_response']['result']['response']['provider_bookings']
                    no_ssr_count = 0
                    for counter_ssr_availability_provider, ssr_package in enumerate(ssr_response['ssr_availability_provider']):
                        if(ssr_package.get('ssr_availability')):
                            for ssr_key in ssr_package['ssr_availability']:
                                for counter_journey, journey_ssr in enumerate(ssr_package['ssr_availability'][ssr_key]):
                                    for idx, pax in enumerate(passenger):
                                        try:
                                            ssr_code = request.POST[ssr_key + '_' +str(counter_ssr_availability_provider+1 - no_ssr_count)+ '_' + str(idx + 1) + '_' + str(counter_journey + 1)].split('_')
                                            if len(ssr_code) > 0:
                                                ssr_code.pop()
                                            if len(ssr_code) > 0:
                                                ssr_code.pop()
                                            passengers_list.append({
                                                "passenger_number": pax['sequence'],
                                                "ssr_code": "_".join(ssr_code)
                                            })
                                            for list_ssr in journey_ssr['ssrs']:
                                                if "_".join(ssr_code) == list_ssr['ssr_code']:
                                                    list_ssr['is_replace_ssr'] = ssr_package['is_replace_ssr']
                                                    pax['ssr_list'].append(list_ssr)
                                                    break
                                        except Exception as e:
                                            _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                                            pass
                                    if len(passengers_list) > 0:
                                        sell_ssrs_request.append({
                                            'journey_code': journey_ssr['journey_code'],
                                            'passengers': passengers_list,
                                            'availability_type': ssr_key
                                        })
                                    passengers_list = []
                            if len(sell_ssrs_request) != 0:
                                sell_ssrs.append({
                                    'sell_ssrs': sell_ssrs_request,
                                    'pnr': data_booking[counter_ssr_availability_provider]['pnr']
                                    # 'provider': ssr_package['provider'] ganti ke pnr
                                })
                        else:
                            no_ssr_count += 1
                        sell_ssrs_request = []
                    addons_type = 'ssr'
                    if len(sell_ssrs) > 0:
                        write_cache_file(request, signature, 'airline_ssr_request', sell_ssrs)
                        # request.session['airline_ssr_request_%s' % signature] = sell_ssrs
                    sell_ssrs = []
                    write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
                except Exception as e:
                    _logger.error("%s\n%s" % (str(e), traceback.format_exc()))
                    print('airline no ssr')

            # SEAT
            if request.META.get('HTTP_REFERER').split('/')[len(request.META.get('HTTP_REFERER').split('/')) - 2] == 'seat_map':
                try:
                    passenger = []
                    file = read_cache_file(request, signature, 'airline_create_passengers')
                    if file:
                        airline_create_passengers = file
                        for pax_type in airline_create_passengers:
                            if pax_type not in ['infant', 'booker', 'contact']:
                                for pax in airline_create_passengers[pax_type]:
                                    passenger.append(pax)
                    passengers = json.loads(request.POST['passenger'])
                    #
                    page = 'seat'
                    for idx, pax in enumerate(passengers):
                        passenger[idx]['seat_list'] = passengers[idx]['seat_list']

                    file = read_cache_file(request, signature, 'airline_get_seat_availability')
                    if file:
                        seat_map_list = file['result']['response']
                    # seat_map_list = request.session['airline_get_seat_availability_%s' % signature]['result']['response']
                    segment_seat_request = []

                    file = read_cache_file(request, signature, 'airline_get_booking_response')
                    if file:
                        booking_dict = file['result']['response']
                        data_booking = file['result']['response']['provider_bookings']
                    # data_booking = request.session['airline_get_booking_response']['result']['response']['provider_bookings']
                    for counter_seat_availability_provider, seat_map_provider in enumerate(seat_map_list['seat_availability_provider']):
                        if seat_map_provider.get('segments'):
                            for seat_segment in seat_map_provider['segments']:
                                pax_request = []
                                for idx, pax in enumerate(passengers):
                                    for pax_seat in pax['seat_list']:
                                        if pax_seat['segment_code'] == seat_segment['segment_code2']:
                                            if pax_seat['seat_code'] != '':
                                                add_seat = False
                                                segment_code_found = False
                                                if booking_dict['passengers'][idx].get('fees') and len(booking_dict['passengers'][idx]['fees']) > 0:
                                                    for fee in booking_dict['passengers'][idx]['fees']:
                                                        if fee['journey_code'] == seat_segment['segment_code']:
                                                            segment_code_found = True
                                                            if fee['fee_code'] != pax_seat['seat_code']:
                                                                add_seat = True
                                                                break
                                                    if not segment_code_found:
                                                        add_seat = True
                                                else:
                                                    add_seat = True
                                                if add_seat:
                                                    pax_request.append({
                                                        'passenger_number': pax['sequence'],
                                                        'seat_code': pax_seat['seat_code']
                                                    })
                                if len(pax_request) != 0:
                                    segment_seat_request.append({
                                        'segment_code': seat_segment['segment_code'],
                                        'pnr': data_booking[counter_seat_availability_provider]['pnr'],
                                        # 'provider': seat_segment['provider'], ganti ke pnr
                                        'passengers': pax_request
                                    })
                                pax_request = []
                    addons_type = 'seat_map'

                    write_cache_file(request, signature, 'airline_seat_request', segment_seat_request)
                    write_cache_file(request, signature, 'airline_create_passengers', airline_create_passengers)
                    # set_session(request, 'airline_seat_request_%s' % signature, segment_seat_request)
                except Exception as e:
                    print('airline no seatmap')

            # agent
            # TODO LIST INTRO SSR sudah list perpassenger --> list per segment --> isi semua ssr tinggal dipisah
            # tampilkan ssr ke depan & pisah send api

            # get_balance(request)
            try:
                additional_price_input = request.POST['additional_price_input'].split(' ')[-1].replace(',', '')
            except:
                additional_price_input = '0'

            airline_carriers = get_carriers(request, signature)
            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     airline_carriers = file

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser

            file = read_cache_file(request, signature, 'airline_get_booking_response')
            if file:
                airline_get_booking = file['result']['response']
            # airline_get_booking = copy.deepcopy(request.session['airline_get_booking_response']['result']['response'])
            if airline_get_booking.get('reschedule_list'):
                del airline_get_booking['reschedule_list']  # pop sementara ada list isi string pakai " wktu di parser error
            for rec in airline_get_booking['provider_bookings']:
                if rec.get('rules'):
                    rec.pop('rules')

            file = read_cache_file(request, signature, 'airline_create_passengers')
            if file:
                airline_create_passengers = file

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'back_page': request.META.get('HTTP_REFERER'),
                'airline_carriers': airline_carriers,
                'goto': goto,
                'airline_getbooking': airline_get_booking,
                'additional_price': float(additional_price_input.split(' ')[len(additional_price_input.split(' '))-1]),
                'username': request.session['user_account'],
                'passengers': airline_create_passengers,
                'passengers_ssr': passenger,
                'addons_type': addons_type,
                'javascript_version': javascript_version,
                'static_path_url_server': get_url_static_path(),
                'signature': signature,
                'time_limit': 1200,
                'page': page
                # 'co_uid': request.session['co_uid'],
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/airline/airline_review_after_sales_templates.html', values)
    else:
        return no_session_logout(request)

def booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Airline get booking without login in btb web')
        airline_carriers = get_carriers(request, request.session['signature'])
        values = get_data_template(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            airline_order_number = base64.b64decode(order_number).decode('ascii')
        except:
            try:
                airline_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
            except:
                airline_order_number = order_number
        write_cache_file(request, request.session['signature'], 'airline_order_number', airline_order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'airline_carriers': airline_carriers,
            'order_number': airline_order_number,
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
    return render(request, MODEL_NAME+'/airline/airline_booking_templates.html', values)

def refund(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        try:
            airline_carriers = get_carriers(request, request.session['signature'])
            # file = read_cache("get_airline_carriers", 'cache_web', request, 90911)
            # if file:
            #     airline_carriers = file
        except Exception as e:
            _logger.error('ERROR get_airline_carriers file\n' + str(e) + '\n' + traceback.format_exc())
        values = get_data_template(request)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            airline_order_number = base64.b64decode(order_number).decode('ascii')
        except:
            try:
                airline_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
            except:
                airline_order_number = order_number
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'airline_carriers': airline_carriers,
            'order_number': airline_order_number,
            'static_path_url_server': get_url_static_path(),
            'javascript_version': javascript_version,
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/airline/airline_booking_refund_templates.html', values)
