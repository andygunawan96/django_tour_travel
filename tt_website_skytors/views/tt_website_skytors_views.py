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
from datetime import *

MODEL_NAME = 'tt_website_skytors'
# _dest_env = TtDestinations()


# Create your views here.
def index(request):
    try:
        if request.POST['logout']:
            request.session.delete()
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
            }
    except:
        print('no logout')
        if bool(request.session._session):
            request.session.create()

            #get_data_awal
            try:
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
                domestic_carriers = ['airasia', 'citilink', 'sriwijaya', 'lionair', 'trigana', 'transnusa', 'altea',
                                     'xpress_scrap', 'garuda']

                international_carriers = ['sabre', 'airasia', 'jetstar', 'trigana', 'lionair', 'scoot', 'citilink', 'sriwijaya']

                # airline

                # activity
                activity_sub_categories = response['result']['response']['activity']['sub_categories']
                activity_categories = response['result']['response']['activity']['categories']
                activity_types = response['result']['response']['activity']['types']
                activity_countries = response['result']['response']['activity']['countries']
                # activity

                # issuedoffline
                issued_offline_transaction_type = response['result']['response']['issued_offline']['transaction_type']
                issued_offline_sector_type = response['result']['response']['issued_offline']['sector_type']
                issued_offline_carrier_id = response['result']['response']['issued_offline']['carrier_id']
                issued_offline_social_media_id = response['result']['response']['issued_offline']['social_media_id']

                # issuedoffline

                #get_data_awal
                cache = {}
                try:
                    cache['airline'] = {
                            'origin': request.session['airline_request']['origin'],
                            'destination': request.session['airline_request']['destination'],
                            'departure': request.session['airline_request']['departure'],
                        }
                except:
                    pass

                try:
                    cache['train'] = {
                            'origin': request.session['train_request']['origin'],
                            'destination': request.session['train_request']['destination'],
                            'departure': request.session['train_request']['departure'],
                        }
                except:
                    pass

                try:
                    cache['hotel'] = {
                            'checkin': request.session['hotel_request']['check_in'],
                            'checkout': request.session['hotel_request']['check_out']
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
                    # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                    'username': request.session['user_account'],
                    # 'co_uid': request.session['co_uid'],
                    'airline_provider_list': airline_provider_list,
                    'airline_cabin_class_list': airline_cabin_class_list,
                    'airline_country': airline_country,
                    'activity_sub_categories': activity_sub_categories,
                    'activity_categories': activity_categories,
                    'activity_types': activity_types,
                    'activity_countries': activity_countries,
                    #hotel
                    'issued_offline_transaction_type': issued_offline_transaction_type,
                    'issued_offline_sector_type': issued_offline_sector_type,
                    'issued_offline_carrier_id': issued_offline_carrier_id,
                    'issued_offline_social_media_id': issued_offline_social_media_id,
                }
            except:
                values = {
                    'static_path': path_util.get_static_path(MODEL_NAME),
                }
                return render(request, MODEL_NAME + '/tt_website_skytors_home_templates.html', values)
        else:
            values = {
                'static_path': path_util.get_static_path(MODEL_NAME),
            }
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

    return render(request, MODEL_NAME+'/tt_website_skytors_home_templates.html', values)

def login(request):
    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME)
    }
    return render(request, MODEL_NAME+'/tt_website_skytors_login_templates.html', values)

def reservation(request):

    file = open("version_cache.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()

    file = open(str(file_cache_name) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()

    airline_carriers = response['result']['response']['airline']['carriers']

    airline_carriers.pop('SO')
    airline_carriers.pop('E9')
    airline_carriers.pop('7L')
    airline_carriers.pop('UD')
    new_airline_carriers = {}
    for key, value  in airline_carriers.items():
        new_airline_carriers[value] = key

    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME),
        'airline_carriers': new_airline_carriers,
        'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        'username': request.session['user_account']
    }
    return render(request, MODEL_NAME+'/backend/tt_website_skytors_reservation_templates.html', values)

def top_up(request):

    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME),
        'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        'username': request.session['user_account']
    }
    return render(request, MODEL_NAME+'/backend/tt_website_skytors_top_up_templates.html', values)

def top_up_payment(request):
    try:
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'top_up_request': {
                'amount': request.POST['amount'],
                'qty': request.POST['qty'],
                'unique_amount': request.POST['unique_amount'],
                'total_amount': request.POST['total_amount'],
                'payment_method': request.POST['payment_method'],


            },
            'agent': request.session['agent'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'username': request.session['user_account']
        }
        return render(request, MODEL_NAME+'/backend/tt_website_skytors_top_up_payment_templates.html', values)
    except:
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
        }
        return render(request, MODEL_NAME + '/backend/tt_website_skytors_top_up_templates.html', values)

def top_up_history(request):

    if translation.LANGUAGE_SESSION_KEY in request.session:
        del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
    values = {
        'static_path': path_util.get_static_path(MODEL_NAME),
        'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        'username': request.session['user_account']
    }
    return render(request, MODEL_NAME+'/backend/tt_website_skytors_top_up_history_templates.html', values)



# @api_view(['GET'])
# def testing(request):
#     return Response(_dest_env.test())
#
#
# @api_view(['GET'])
# @permission_classes((IsAuthenticated, ))
# def testing2(request):
#     return Response(_dest_env.test_2())
