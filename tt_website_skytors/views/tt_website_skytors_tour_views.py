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
    if 'username' in request.session._session:
        file = open("version_cache.txt", "r")
        for line in file:
            file_cache_name = line
        file.close()

        file = open(str(file_cache_name) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()

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

        budget_data = [
            {'value': '0-999999999', 'string': 'All'},
            {'value': '0-1000000', 'string': '0-1 juta'},
            {'value': '1000000-2000000', 'string': '1-2 juta'},
            {'value': '2000000-5000000', 'string': '2-5 juta'},
            {'value': '5000000-10000000', 'string': '5-10 juta'},
            {'value': '10000000-20000000', 'string': '10-20 juta'},
            {'value': '20000000-99000000', 'string': '> 20 juta'},
        ]

        budget_limit = request.POST['tour_budget'].split('-')
        request.session['tour_request'] = {
            'country_id': request.POST['tour_destination'],
            'month': request.POST['tour_dest_month'],
            'year': request.POST['tour_dest_year'],
            'budget_min': budget_limit[0],
            'budget_max': budget_limit[1],
            'limit': 25,
            'offset': 0,
        }

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'dest_destination': request.POST['tour_destination'],
            'dest_year': request.POST['tour_dest_year'],
            'dest_month': request.POST['tour_dest_month'],
            'dest_month_data': dest_month_data,
            'budget_sel': request.POST['tour_budget'],
            'budget_data': budget_data,
        }
        return render(request, MODEL_NAME + '/tour/tt_website_skytors_tour_search_templates.html', values)
    else:
        return index(request)

def detail(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
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
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
        }

        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_detail_templates.html', values)
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

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        # agent
        adult_title = ['MR', 'MRS', 'MS']
        infant_title = ['MSTR', 'MISS']
        child_title = infant_title

        airline_country = response['result']['response']['airline']['country']

        # pax
        adult = []
        infant = []
        child = []

        try:
            for i in range(int(request.POST['adult_total_pax'].replace(',', ''))):
                adult.append('')
        except:
            print('no adult')

        try:
            for i in range(int(request.POST['child_total_pax'].replace(',', ''))):
                child.append('')
        except:
            print('no children')

        try:
            for i in range(int(request.POST['infant_amount'].replace(',', ''))):
                infant.append('')
        except:
            print('no infant')

        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'adult_title': adult_title,
            'infant_title': infant_title,
            'child_title': child_title,
            'countries': airline_country,
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
            'tour_data': request.session['tour_pick'],
            'adults': adult,
            'infants': infant,
            'childs': child,
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
                'additional_charge_amount': int(request.POST['additional_charge_amount'].replace(',', '')),
                'additional_charge_total': int(request.POST['additional_charge_total'].replace(',', '')),
                'total_itinerary_price': int(request.POST['grand_total_hidden']),
                'discount_total_itinerary_price': int(request.POST['discount_total_hidden']),
                'sub_total_itinerary_price': int(request.POST['sub_total_hidden']),
                'commission_total': int(request.POST['commission_total'])
            },
            'total_itinerary_price': int(request.POST['grand_total_hidden']),
        }
        if request.POST.get('departure_date_tour2'):
            dept = request.POST['departure_date_tour2']
        else:
            dept = request.session['tour_pick']['departure_date']

        if request.POST.get('arrival_date_tour2'):
            arr = request.POST['arrival_date_tour2']
        else:
            arr = request.session['tour_pick']['arrival_date']

        request.session['tour_pick'].update({
            'tour_departure_date': dept,
            'tour_arrival_date': arr,
        })

        room_amount = int(request.POST['room_amount'])
        render_pax_per_room = []
        for idx in range(room_amount):
            temp = str(idx + 1)
            note = 'notes_' + str(idx + 1)
            room = {
                'adult': request.POST['adult_tour_room_' + temp],
                'child': request.POST['child_tour_room_' + temp],
                'infant': request.POST['infant_tour_room_' + temp],
                'data': request.POST['data_per_room_hidden_' + temp].split('~'),
            }
            adult_obj = []
            child_obj = []
            infant_obj = []

            try:
                for temp in range(int(room['adult'])):
                    adult_obj.append('')
            except:
                print('no adult')
            try:
                for temp in range(int(room['child'])):
                    child_obj.append('')
            except:
                print('no child')
            try:
                for temp in range(int(room['infant'])):
                    infant_obj.append('')
            except:
                print('no infant')

            room.update({
                'address': room['data'][1],
                'bed_type': room['data'][4].title(),
                'description': room['data'][7],
                'hotel': room['data'][8],
                'name': room['data'][9].title(),
                'star': room['data'][12],
                'id': room['data'][14],
                'notes': request.POST.get(note) and request.POST[note] or '',
                'adult_obj': adult_obj,
                'child_obj': child_obj,
                'infant_obj': infant_obj,
            })
            render_pax_per_room.append(room)

        values.update({
            'room_list': render_pax_per_room,
            'room_amount': room_amount,
        })
        request.session['booking_data'] = {
            'room_list': render_pax_per_room,
            'room_amount': room_amount,
        }

        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_passenger_templates.html', values)
    else:
        return index(request)


def review(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
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
                'additional_charge_amount': int(request.POST['additional_charge_amount'].replace(',', '')),
                'additional_charge_total': int(request.POST['additional_charge_total'].replace(',', '')),
                'total_itinerary_price': int(request.POST['grand_total_hidden']),
                'discount_total_itinerary_price': int(request.POST['discount_total_hidden']),
                'sub_total_itinerary_price': int(request.POST['sub_total_hidden']),
                'commission_total': int(request.POST['commission_total'])
            },
            'total_itinerary_price': int(request.POST['grand_total_hidden']),
            'sameBooker': request.POST['myRadios'],
        }

        booker = {
            'title': request.POST['booker_title'],
            'first_name': request.POST['booker_first_name'],
            'last_name': request.POST['booker_last_name'],
            'nationality_code': request.POST['booker_nationality'],
            'email': request.POST['booker_email'],
            'mobile': request.POST['booker_phone_code'] + request.POST['booker_phone'],
            'agent_id': int(request.session['agent']['id']),
            'booker_id': request.POST['booker_id']
        }

        for j in range(int(request.session['booking_data']['room_amount'])):
            adult = []
            child = []
            infant = []
            prs_idx = 1
            for i in range(int(request.session['booking_data']['room_list'][j]['adult'])):
                adult.append({
                    "first_name": request.POST['room' + str(j + 1) + '_adult_first_name' + str(i + 1)],
                    "last_name": request.POST['room' + str(j + 1) + '_adult_last_name' + str(i + 1)],
                    "name": request.POST['room' + str(j + 1) + '_adult_first_name' + str(i + 1)] + " " + request.POST[
                        'room' + str(j + 1) + '_adult_last_name' + str(i + 1)],
                    "nationality_code": request.POST['room' + str(j + 1) + '_adult_nationality' + str(i + 1)],
                    "title": request.POST['room' + str(j + 1) + '_adult_title' + str(i + 1)],
                    "pax_type": "ADT",
                    "birth_date": request.POST['room' + str(j + 1) + '_adult_birth_date' + str(i + 1)],
                    "birth_date_f": '%s-%s-%s' % (request.POST['room' + str(j + 1) + '_adult_birth_date' + str(i + 1)].split(' ')[2], month[request.POST['room' + str(j + 1) + '_adult_birth_date' + str(i + 1)].split(' ')[1]], request.POST['room' + str(j + 1) + '_adult_birth_date' + str(i + 1)].split(' ')[0]),
                    "passport_number": request.POST['room' + str(j + 1) + '_adult_passport_number' + str(i + 1)],
                    "passport_expdate": request.POST['room' + str(j + 1) + '_adult_passport_expired_date' + str(i + 1)],
                    "passport_expdate_f": '%s-%s-%s' % (request.POST['room' + str(j + 1) + '_adult_passport_expired_date' + str(i + 1)].split(' ')[2], month[request.POST['room' + str(j + 1) + '_adult_passport_expired_date' + str(i + 1)].split(' ')[1]], request.POST['room' + str(j + 1) + '_adult_passport_expired_date' + str(i + 1)].split(' ')[0]),
                    "country_of_issued_code": request.POST['room' + str(j + 1) + '_adult_country_of_issued' + str(i + 1)],
                    "passenger_id": request.POST['room' + str(j + 1) + '_adult_id' + str(i + 1)],
                    "mobile": request.POST.get('room' + str(j + 1) + '_adult_cp' + str(i + 1)) and request.POST['room' + str(j + 1) + '_adult_phone_code' + str(i + 1)] + request.POST['room' + str(j + 1) + '_adult_phone' + str(i + 1)] or ' - ',
                    "email": request.POST.get('room' + str(j + 1) + '_adult_cp' + str(i + 1)) and request.POST['room' + str(j + 1) + '_adult_email' + str(i + 1)] or ' - ',
                    "room_id": request.session['booking_data']['room_list'][j]['data'][14],
                    'agent_id': int(request.session['agent']['id']),
                    "sequence": prs_idx,
                })
                prs_idx += 1

            for i in range(int(request.session['booking_data']['room_list'][j]['child'])):
                child.append({
                    "first_name": request.POST['room' + str(j + 1) + '_child_first_name' + str(i + 1)],
                    "last_name": request.POST['room' + str(j + 1) + '_child_last_name' + str(i + 1)],
                    "name": request.POST['room' + str(j + 1) + '_child_first_name' + str(i + 1)] + " " + request.POST[
                        'room' + str(j + 1) + '_child_last_name' + str(i + 1)],
                    "nationality_code": request.POST['room' + str(j + 1) + '_child_nationality' + str(i + 1)],
                    "title": request.POST['room' + str(j + 1) + '_child_title' + str(i + 1)],
                    "pax_type": "CHD",
                    "birth_date": request.POST['room' + str(j + 1) + '_child_birth_date' + str(i + 1)],
                    "birth_date_f": '%s-%s-%s' % (request.POST['room' + str(j + 1) + '_child_birth_date' + str(i + 1)].split(' ')[2],month[request.POST['room' + str(j + 1) + '_child_birth_date' + str(i + 1)].split(' ')[1]],request.POST['room' + str(j + 1) + '_child_birth_date' + str(i + 1)].split(' ')[0]),
                    "passport_number": request.POST['room' + str(j + 1) + '_child_passport_number' + str(i + 1)],
                    "passport_expdate": request.POST['room' + str(j + 1) + '_child_passport_expired_date' + str(i + 1)],
                    "passport_expdate_f": '%s-%s-%s' % (request.POST['room' + str(j + 1) + '_child_passport_expired_date' + str(i + 1)].split(' ')[2], month[request.POST['room' + str(j + 1) + '_child_passport_expired_date' + str(i + 1)].split(' ')[1]], request.POST['room' + str(j + 1) + '_child_passport_expired_date' + str(i + 1)].split(' ')[0]),
                    "country_of_issued_code": request.POST['room' + str(j + 1) + '_child_country_of_issued' + str(i + 1)],
                    "passenger_id": request.POST['room' + str(j + 1) + '_child_id' + str(i + 1)],
                    "room_id": request.session['booking_data']['room_list'][j]['data'][14],
                    'agent_id': int(request.session['agent']['id']),
                    "sequence": prs_idx,
                })
                prs_idx += 1

            for i in range(int(request.session['booking_data']['room_list'][j]['infant'])):
                infant.append({
                    "first_name": request.POST['room' + str(j + 1) + '_infant_first_name' + str(i + 1)],
                    "last_name": request.POST['room' + str(j + 1) + '_infant_last_name' + str(i + 1)],
                    "name": request.POST['room' + str(j + 1) + '_infant_first_name' + str(i + 1)] + " " + request.POST[
                        'room' + str(j + 1) + '_infant_last_name' + str(i + 1)],
                    "nationality_code": request.POST['room' + str(j + 1) + '_infant_nationality' + str(i + 1)],
                    "title": request.POST['room' + str(j + 1) + '_infant_title' + str(i + 1)],
                    "pax_type": "INF",
                    "birth_date": request.POST['room' + str(j + 1) + '_infant_birth_date' + str(i + 1)],
                    "birth_date_f": '%s-%s-%s' % (request.POST['room' + str(j + 1) + '_infant_birth_date' + str(i + 1)].split(' ')[2],month[request.POST['room' + str(j + 1) + '_infant_birth_date' + str(i + 1)].split(' ')[1]],request.POST['room' + str(j + 1) + '_infant_birth_date' + str(i + 1)].split(' ')[0]),
                    "passport_number": request.POST['room' + str(j + 1) + '_infant_passport_number' + str(i + 1)],
                    "passport_expdate": request.POST['room' + str(j + 1) + '_infant_passport_expired_date' + str(i + 1)],
                    "passport_expdate_f": '%s-%s-%s' % (request.POST['room' + str(j + 1) + '_infant_passport_expired_date' + str(i + 1)].split(' ')[2], month[request.POST['room' + str(j + 1) + '_infant_passport_expired_date' + str(i + 1)].split(' ')[1]], request.POST['room' + str(j + 1) + '_infant_passport_expired_date' + str(i + 1)].split(' ')[0]),
                    "country_of_issued_code": request.POST['room' + str(j + 1) + '_infant_country_of_issued' + str(i + 1)],
                    "passenger_id": request.POST['room' + str(j + 1) + '_infant_id' + str(i + 1)],
                    "room_id": request.session['booking_data']['room_list'][j]['data'][14],
                    'agent_id': int(request.session['agent']['id']),
                    "sequence": prs_idx,
                })
                prs_idx += 1

            request.session['booking_data']['room_list'][j].update({
                'adult_obj': adult,
                'child_obj': child,
                'infant_obj': infant,
            })

        values.update({
            'contact': booker,
            'room_list': request.session['booking_data']['room_list'],
            'room_amount': request.session['booking_data']['room_amount'],
        })

        request.session['booking_data'].update({
            'sameBooker': request.POST['myRadios'],
            'contact': booker,
        })

        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_review_templates.html', values)
    else:
        return index(request)

def booking(request):
    if 'username' in request.session._session:
        # res = json.loads(request.POST['response'])
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        values = {
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session['username'],
            'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],

        }
        return render(request, MODEL_NAME+'/tour/tt_website_skytors_tour_booking_templates.html', values)
    else:
        return index(request)

