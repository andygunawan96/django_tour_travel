from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from tools.parser import *
from django.utils import translation
import json
import base64
from io import BytesIO
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from .tt_website_skytors_views import *

month = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',

}

MODEL_NAME = 'tt_website_skytors'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

MODEL_NAME = 'tt_website_skytors'

def search(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        airline_country = response['result']['response']['airline']['country']

        template, logo = get_logo_template()

        dest_month_data = [
            {'value': '00', 'string': 'All Months'},
            {'value': '01', 'string': 'January'},
            {'value': '02', 'string': 'February'},
            {'value': '03', 'string': 'March'},
            {'value': '04', 'string': 'April'},
            {'value': '05', 'string': 'May'},
            {'value': '06', 'string': 'June'},
            {'value': '07', 'string': 'July'},
            {'value': '08', 'string': 'August'},
            {'value': '09', 'string': 'September'},
            {'value': '10', 'string': 'October'},
            {'value': '11', 'string': 'November'},
            {'value': '12', 'string': 'December'},
        ]

        tour_countries = response['result']['response']['tour']['countries']

        request.session['tour_request'] = {
            'tour_query': request.POST.get('tour_query') and request.POST['tour_query'] or '',
            'country_id': request.POST['tour_countries'],
            'city_id': request.POST['tour_cities'],
            'month': request.POST['tour_dest_month'],
            'year': request.POST['tour_dest_year'],
            'limit': 25,
            'offset': 0,
        }

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['user_account'],
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'tour_countries': tour_countries,
            'tour_query': request.POST.get('tour_query') and request.POST['tour_query'] or '',
            'dest_country': request.POST.get('tour_countries') != '0' and int(request.POST['tour_countries']) or 0,
            'dest_city': request.POST.get('tour_cities') != '0' and int(request.POST['tour_cities']) or 0,
            'dest_year': request.POST['tour_dest_year'],
            'dest_month': request.POST['tour_dest_month'],
            'dest_month_data': dest_month_data,
            'javascript_version': javascript_version,
            'signature': request.session['signature'],
            'static_path_url_server': get_url_static_path(),
            'logo': logo,
            'template': template
        }
        return render(request, MODEL_NAME + '/tour/tt_website_skytors_tour_search_templates.html', values)
    else:
        return no_session_logout()

def detail(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        airline_country = response['result']['response']['airline']['country']

        template, logo = get_logo_template()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        request.session['tour_pick'] = json.loads(request.POST['tour_pick'])
        request.session['tour_pick'].update({
            'departure_date_f': str(request.session['tour_search'][int(request.POST['sequence'])]['departure_date_f'])
        })
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'response': request.session['tour_search'][int(request.POST['sequence'])],
            'response': request.session['tour_pick'],
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session['tour_signature'],
            'static_path_url_server': get_url_static_path(),
            'logo': logo,
            'template': template
        }

        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_detail_templates.html', values)
    else:
        return no_session_logout()

def passenger(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)

        template, logo = get_logo_template()

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        # agent
        adult_title = ['MR', 'MRS', 'MS']
        infant_title = ['MSTR', 'MISS']
        child_title = infant_title

        airline_country = response['result']['response']['airline']['country']

        # pax
        room_amount = request.POST['room_amount']
        adult_amt = 0
        child_amt = 0
        infant_amt = 0
        adult = []
        infant = []
        child = []

        for r in range(int(room_amount)):
            adult_amt += int(request.POST['adult_tour_room_' + str(r+1)])
            child_amt += int(request.POST['child_tour_room_' + str(r+1)])
            infant_amt += int(request.POST['infant_tour_room_' + str(r+1)])

        try:
            for i in range(adult_amt):
                adult.append('')
        except:
            print('no adult')

        try:
            for i in range(child_amt):
                child.append('')
        except:
            print('no children')

        try:
            for i in range(infant_amt):
                infant.append('')
        except:
            print('no infant')

        request.session['tour_data'] = json.loads(request.POST['tour_data'])
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'adult_title': adult_title,
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'infant_title': infant_title,
            'child_title': child_title,
            'username': request.session['user_account'],
            'tour_data': request.session['tour_pick'],
            'adults': adult,
            'infants': infant,
            'childs': child,
            'javascript_version': javascript_version,
            'signature': request.session['tour_signature'],
            'logo': logo,
            'template': template
        }
        if request.POST.get('departure_date_tour2'):
            dept = request.POST['departure_date_tour2']
        else:
            dept = request.session['tour_pick']['departure_date']

        if request.POST.get('return_date_tour2'):
            arr = request.POST['return_date_tour2']
        else:
            arr = request.session['tour_pick']['return_date']

        request.session['tour_pick'].update({
            'tour_departure_date': dept,
            'tour_return_date': arr,
        })

        room_amount = int(request.POST['room_amount'])
        render_pax_per_room = []
        for idx in range(room_amount):
            note = 'notes_' + str(idx + 1)
            room = {
                'adult': int(request.POST['adult_tour_room_' + str(idx + 1)]),
                'child': int(request.POST['child_tour_room_' + str(idx + 1)]),
                'infant': int(request.POST['infant_tour_room_' + str(idx + 1)]),
                'data': request.session['tour_data']['accommodations'][idx],
            }

            room.update({
                'address': room['data']['address'],
                'bed_type': room['data']['bed_type'],
                'description': room['data']['description'],
                'hotel': room['data']['hotel'],
                'name': room['data']['name'],
                'star': room['data']['star'],
                'id': room['data']['id'],
                'notes': request.POST.get(note) and request.POST[note] or '',
            })
            room.pop('data')
            render_pax_per_room.append(room)

        values.update({
            'room_list': render_pax_per_room,
            'room_amount': room_amount,
        })
        request.session['booking_data'] = {
            'room_list': render_pax_per_room,
            'room_amount': room_amount,
            'adults': adult_amt,
            'childs': child_amt,
            'infants': infant_amt,
            'static_path_url_server': get_url_static_path(),
            'tour_data': request.session['tour_pick'],
            'javascript_version': javascript_version
        }

        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_passenger_templates.html', values)
    else:
        return no_session_logout()


def review(request):
    if 'user_account' in request.session._session:
        javascript_version = get_cache_version()
        response = get_cache_data(javascript_version)
        airline_country = response['result']['response']['airline']['country']
        template, logo = get_logo_template()
        # res = json.loads(request.POST['response'])
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['user_account'],
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'tour_data': request.session['tour_pick'],
            'price_itinerary': {
                'adult_amount': int(request.POST['adult_amount'].replace(',', '')),
                'adult_total_pax': int(request.POST['adult_total_pax'].replace(',', '')),
                'adult_price': int(request.POST['adult_price'].replace(',', '')),
                'adult_surcharge_amount': int(request.POST['adult_surcharge_amount'].replace(',', '')),
                'adult_surcharge_price': int(request.POST['adult_surcharge_price'].replace(',', '')),
                'child_amount': int(request.POST['child_amount'].replace(',', '')),
                'child_total_pax': int(request.POST['child_total_pax'].replace(',', '')),
                'child_price': int(request.POST['child_price'].replace(',', '')),
                'child_surcharge_amount': int(request.POST['child_surcharge_amount'].replace(',', '')),
                'child_surcharge_price': int(request.POST['child_surcharge_price'].replace(',', '')),
                'infant_amount': int(request.POST['infant_amount'].replace(',', '')),
                'infant_price': int(request.POST['infant_price'].replace(',', '')),
                'single_supplement_amount': int(request.POST['single_supplement_amount'].replace(',', '')),
                'single_supplement_price': int(request.POST['single_supplement_price'].replace(',', '')),
                'airport_tax_amount': int(request.POST['airport_tax_amount'].replace(',', '')),
                'airport_tax_total': int(request.POST['airport_tax_total'].replace(',', '')),
                'tipping_guide_amount': int(request.POST['tipping_guide_amount'].replace(',', '')),
                'tipping_guide_total': int(request.POST['tipping_guide_total'].replace(',', '')),
                'tipping_tour_leader_amount': int(request.POST['tipping_tour_leader_amount'].replace(',', '')),
                'tipping_tour_leader_total': int(request.POST['tipping_tour_leader_total'].replace(',', '')),
                'tipping_driver_amount': int(request.POST['tipping_driver_amount'].replace(',', '')),
                'tipping_driver_total': int(request.POST['tipping_driver_total'].replace(',', '')),
                'additional_charge_amount': int(request.POST['additional_charge_amount'].replace(',', '')),
                'additional_charge_total': int(request.POST['additional_charge_total'].replace(',', '')),
                'total_itinerary_price': int(request.POST['grand_total_hidden']),
                'discount_total_itinerary_price': int(request.POST['discount_total_hidden']),
                'sub_total_itinerary_price': int(request.POST['sub_total_hidden']),
                'commission_total': int(request.POST['commission_total'])
            },
            'static_path_url_server': get_url_static_path(),
            'total_itinerary_price': int(request.POST['grand_total_hidden']),
            'sameBooker': request.POST['myRadios'],
            'javascript_version': javascript_version,
            'signature': request.session['tour_signature'],
            'logo': logo,
            'template': template
        }

        adult = []
        child = []
        infant = []
        all_pax = []
        contact = []

        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'nationality_code': request.POST['booker_nationality'],
            'email': request.POST['booker_email'],
            'mobile': request.POST['booker_phone_code'] + request.POST['booker_phone'],
            'booker_id': request.POST['booker_id']
        }

        for i in range(int(request.session['booking_data']['adults'])):
            adult.append({
                "first_name": request.POST['adult_first_name' + str(i + 1)],
                "last_name": request.POST['adult_last_name' + str(i + 1)],
                "name": request.POST['adult_first_name' + str(i + 1)] + " " + request.POST['adult_last_name' + str(i + 1)],
                "nationality_code": request.POST['adult_nationality' + str(i + 1)],
                "title": request.POST['adult_title' + str(i + 1)],
                "pax_type": "ADT",
                "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                "birth_date_f": '%s-%s-%s' % (request.POST['adult_birth_date' + str(i + 1)].split(' ')[2], month[request.POST['adult_birth_date' + str(i + 1)].split(' ')[1]], request.POST['adult_birth_date' + str(i + 1)].split(' ')[0]),
                "passport_number": request.POST['adult_passport_number' + str(i + 1)],
                "passport_expdate": request.POST['adult_passport_expired_date' + str(i + 1)],
                "passport_expdate_f": '%s-%s-%s' % (request.POST['adult_passport_expired_date' + str(i + 1)].split(' ')[2], month[request.POST['adult_passport_expired_date' + str(i + 1)].split(' ')[1]], request.POST['adult_passport_expired_date' + str(i + 1)].split(' ')[0]),
                "country_of_issued_code": request.POST['adult_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['adult_id' + str(i + 1)],
                "mobile": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone_code' + str(i + 1)] + request.POST['adult_phone' + str(i + 1)] or ' - ',
                "email": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_email' + str(i + 1)] or ' - ',
                "is_cp": request.POST.get('adult_cp' + str(i + 1)),
            })

        for i in range(int(request.session['booking_data']['childs'])):
            child.append({
                "first_name": request.POST['child_first_name' + str(i + 1)],
                "last_name": request.POST['child_last_name' + str(i + 1)],
                "name": request.POST['child_first_name' + str(i + 1)] + " " + request.POST['child_last_name' + str(i + 1)],
                "nationality_code": request.POST['child_nationality' + str(i + 1)],
                "title": request.POST['child_title' + str(i + 1)],
                "pax_type": "CHD",
                "birth_date": request.POST['child_birth_date' + str(i + 1)],
                "birth_date_f": '%s-%s-%s' % (request.POST['child_birth_date' + str(i + 1)].split(' ')[2],month[request.POST['child_birth_date' + str(i + 1)].split(' ')[1]],request.POST['child_birth_date' + str(i + 1)].split(' ')[0]),
                "passport_number": request.POST['child_passport_number' + str(i + 1)],
                "passport_expdate": request.POST['child_passport_expired_date' + str(i + 1)],
                "passport_expdate_f": '%s-%s-%s' % (request.POST['child_passport_expired_date' + str(i + 1)].split(' ')[2], month[request.POST['child_passport_expired_date' + str(i + 1)].split(' ')[1]], request.POST['child_passport_expired_date' + str(i + 1)].split(' ')[0]),
                "country_of_issued_code": request.POST['child_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['child_id' + str(i + 1)],
            })

        for i in range(int(request.session['booking_data']['infants'])):
            infant.append({
                "first_name": request.POST['infant_first_name' + str(i + 1)],
                "last_name": request.POST['infant_last_name' + str(i + 1)],
                "name": request.POST['infant_first_name' + str(i + 1)] + " " + request.POST['infant_last_name' + str(i + 1)],
                "nationality_code": request.POST['infant_nationality' + str(i + 1)],
                "title": request.POST['infant_title' + str(i + 1)],
                "pax_type": "INF",
                "birth_date": request.POST['infant_birth_date' + str(i + 1)],
                "birth_date_f": '%s-%s-%s' % (request.POST['infant_birth_date' + str(i + 1)].split(' ')[2],month[request.POST['infant_birth_date' + str(i + 1)].split(' ')[1]],request.POST['infant_birth_date' + str(i + 1)].split(' ')[0]),
                "passport_number": request.POST['infant_passport_number' + str(i + 1)],
                "passport_expdate": request.POST['infant_passport_expired_date' + str(i + 1)],
                "passport_expdate_f": '%s-%s-%s' % (request.POST['infant_passport_expired_date' + str(i + 1)].split(' ')[2], month[request.POST['infant_passport_expired_date' + str(i + 1)].split(' ')[1]], request.POST['infant_passport_expired_date' + str(i + 1)].split(' ')[0]),
                "country_of_issued_code": request.POST['infant_country_of_issued' + str(i + 1)],
                "passenger_id": request.POST['infant_id' + str(i + 1)],
            })

        for rec in adult:
            all_pax.append(rec)
            if rec.get('is_cp'):
                contact.append(rec)
        for rec in child:
            all_pax.append(rec)
        for rec in infant:
            all_pax.append(rec)

        temp_idx = 0
        for rec in all_pax:
            rec.update({
                'sequence': temp_idx,
                'room_id': 0,
                'room_seq': 0,
            })
            temp_idx += 1

        temp_booking_data = request.session['booking_data']

        temp_booking_data.update({
            'adult_pax': adult,
            'child_pax': child,
            'infant_pax': infant,
            'all_pax': all_pax,
            'contact': contact,
            'sameBooker': request.POST['myRadios'],
            'booker': booker,
            'total_pax_all': temp_idx,
        })

        request.session['booking_data'] = temp_booking_data

        values.update({
            'booker': booker,
            'room_list': request.session['booking_data']['room_list'],
            'room_amount': request.session['booking_data']['room_amount'],
            'adult_pax': adult,
            'child_pax': child,
            'infant_pax': infant,
            'all_pax': all_pax,
            'contact': contact,
            'total_pax_all': temp_idx,
        })

        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_review_templates.html', values)
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
            'signature': request.session['tour_signature'],
            'logo': logo,
            'static_path_url_server': get_url_static_path(),
            'template': template
        }
        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_booking_templates.html', values)
    else:
        return no_session_logout()

