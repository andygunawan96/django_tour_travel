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
from tt_webservice.views.tt_webservice import *
from .tt_website_rodextrip_views import *
_logger = logging.getLogger("rodextrip_logger")

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

MODEL_NAME = 'tt_website_rodextrip'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

def tour(request):
    if 'user_account' in request.session._session and 'ticketing_tour' in request.session['user_account']['co_agent_frontend_security']:
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
            # get_data_awal
            cache = {}
            try:
                cache['tour'] = {
                    'name': request.session['tour_request']['tour_query']
                }
            except:
                pass

                # tour
                try:
                    tour_countries = response['result']['response']['tour']['countries']
                except Exception as e:
                    tour_countries = []
                    _logger.error(str(e) + '\n' + traceback.format_exc())
                # tour

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'cache': json.dumps(cache),
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                # 'balance': request.session['balance']['balance'] + request.session['balance']['credit_limit'],
                'username': request.session['user_account'],
                # 'co_uid': request.session['co_uid'],
                'tour_countries': tour_countries,
                'javascript_version': javascript_version,
                'update_data': 'false',
                'static_path_url_server': get_url_static_path(),
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/tour/tour_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            values = get_data_template(request, 'search')

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

            try:
                set_session(request, 'tour_request', {
                    'tour_query': request.POST.get('tour_query') and request.POST['tour_query'] or '',
                    'country_id': request.POST.get('tour_countries') != '0' and int(request.POST['tour_countries']) or 0,
                    'city_id': request.POST.get('tour_cities') != '0' and int(request.POST['tour_cities']) or 0,
                    'month': request.POST['tour_dest_month'],
                    'year': request.POST['tour_dest_year'],
                    'limit': 25,
                    'offset': 0,
                })
            except:
                set_session(request, 'tour_request', request.session['tour_request'])
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'tour_request': request.session['tour_request'],
                'query': request.session['tour_request']['tour_query'],
                'dest_country': request.session['tour_request']['country_id'],
                'dest_city': request.session['tour_request']['city_id'],
                'dest_year': request.session['tour_request']['year'],
                'dest_month': request.session['tour_request']['month'],
                'dest_month_data': dest_month_data,
                'javascript_version': javascript_version,
                'signature': request.session['signature'],
                'time_limit': 1200,
                'static_path_url_server': get_url_static_path(),
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/tour/tour_search_templates.html', values)
    else:
        return no_session_logout(request)


def detail(request, tour_code):
    try:
        javascript_version = get_javascript_version()
        cache_version = get_cache_version()
        values = get_data_template(request, 'search')
        if 'user_account' not in request.session:
            signin_btc(request)
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser
        response = get_cache_data(cache_version)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

        try:
            set_session(request, 'time_limit', int(request.POST['time_limit_input']))
        except:
            if request.session.get('time_limit'):
                set_session(request, 'time_limit', request.session['time_limit'])
            else:
                set_session(request, 'time_limit', 1200)

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

        if not request.session.get('tour_request'):
            set_session(request, 'tour_request', {
                'tour_query': '',
                'country_id': 0,
                'city_id': 0,
                'month': '00',
                'year': '0000',
                'limit': 25,
                'offset': 0,
            })

        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'response': request.session['tour_search'][int(request.POST['sequence'])],
            # 'response': request.session['tour_pick'],
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'phone_code': phone_code,
            'tour_code': tour_code,
            'query': request.session['tour_request']['tour_query'],
            'dest_country': request.session['tour_request']['country_id'],
            'dest_city': request.session['tour_request']['city_id'],
            'dest_year': request.session['tour_request']['year'],
            'dest_month': request.session['tour_request']['month'],
            'dest_month_data': dest_month_data,
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': request.session.get('tour_signature') and request.session['tour_signature'] or '',
            'time_limit': request.session.get('time_limit') and request.session['time_limit'] or 1200,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')

    return render(request, MODEL_NAME+'/tour/tour_detail_templates.html', values)


def passenger(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)

            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            try:
                set_session(request, 'time_limit', int(request.POST['time_limit_input']))
            except:
                set_session(request, 'time_limit', request.session['time_limit'])

            # agent
            adult_title = ['MR', 'MRS', 'MS']
            infant_title = ['MSTR', 'MISS']
            child_title = infant_title

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            # pax
            try:
                set_session(request, 'tour_room_mapping', {
                    'room_amount': request.POST['room_amount']
                })
            except:
                request.session['tour_room_mapping']['room_amount'] = request.session['tour_room_mapping']['room_amount']

            adult_amt = 0
            child_amt = 0
            infant_amt = 0
            adult = []
            infant = []
            child = []

            try:
                for r in range(int(request.session['tour_room_mapping']['room_amount'])):
                    adult_amt += int(request.POST['adult_tour_room_' + str(r+1)])
                    child_amt += int(request.POST['child_tour_room_' + str(r+1)])
                    infant_amt += int(request.POST['infant_tour_room_' + str(r+1)])
                set_session(request, 'tour_pax_amount', {
                    'adult_amt': adult_amt,
                    'child_amt': child_amt,
                    'infant_amt': infant_amt,
                })
            except:
                set_session(request, 'tour_pax_amount', request.session['tour_pax_amount'])

            try:
                for i in range(request.session['tour_pax_amount']['adult_amt']):
                    adult.append('')
            except:
                print('no adult')

            try:
                for i in range(request.session['tour_pax_amount']['child_amt']):
                    child.append('')
            except:
                print('no children')

            try:
                for i in range(request.session['tour_pax_amount']['infant_amt']):
                    infant.append('')
            except:
                print('no infant')

            try:
                set_session(request, 'tour_line_code', request.POST['tour_line_code'])
            except:
                set_session(request, 'tour_line_code', request.session['tour_line_code'])

            try:
                set_session(request, 'tour_data', json.loads(request.POST['tour_data']))
            except:
                set_session(request, 'tour_data', request.session['tour_data'])

            try:
                tour_dept_date = ''
                tour_arr_date = ''
                if request.session.get('tour_pick'):
                    for line in request.session['tour_pick']['tour_lines']:
                        if line['tour_line_code'] == request.POST['tour_line_code']:
                            tour_dept_date = line['departure_date']
                            tour_arr_date = line['arrival_date']
                set_session(request, 'tour_dept_return_data', {
                    'departure': request.POST.get('departure_date_tour2') and request.POST['departure_date_tour2'] or tour_dept_date,
                    'arrival': request.POST.get('arrival_date_tour2') and request.POST['arrival_date_tour2'] or tour_arr_date
                })
            except:
                set_session(request, 'tour_dept_return_data', request.session['tour_dept_return_data'])

            dept = request.session['tour_dept_return_data'].get('departure') and datetime.strptime(request.session['tour_dept_return_data']['departure'], '%Y-%m-%d').strftime('%d %b %Y') or ''
            arr = request.session['tour_dept_return_data'].get('arrival') and datetime.strptime(request.session['tour_dept_return_data']['arrival'], '%Y-%m-%d').strftime('%d %b %Y') or ''

            try:
                room_amount = int(request.session['tour_room_mapping']['room_amount'])
                render_pax_per_room = []
                for idx in range(room_amount):
                    note = 'notes_' + str(idx + 1)

                    room = {
                        'adult': int(request.POST['adult_tour_room_' + str(idx + 1)]),
                        'child': int(request.POST['child_tour_room_' + str(idx + 1)]),
                        'infant': int(request.POST['infant_tour_room_' + str(idx + 1)]),
                    }

                    chosen_room = False
                    for temp_room in request.session['tour_data']['accommodations']:
                        if temp_room['room_code'] == request.POST['room_code_' + str(idx + 1)]:
                            chosen_room = temp_room

                    room.update({
                        'address': chosen_room['address'],
                        'bed_type': chosen_room['bed_type'],
                        'description': chosen_room['description'],
                        'hotel': chosen_room['hotel'],
                        'name': chosen_room['name'],
                        'star': chosen_room['star'],
                        'room_code': chosen_room['room_code'],
                        'notes': request.POST.get(note) and request.POST[note] or '',
                        'room_seq': 'Room ' + str(idx + 1),
                    })
                    render_pax_per_room.append(room)
                request.session['tour_room_mapping'].update({
                    'render_pax_per_room': render_pax_per_room
                })
            except:
                set_session(request, 'tour_room_mapping', request.session['tour_room_mapping'])

            set_session(request, 'tour_booking_data', {
                'room_list': request.session['tour_room_mapping']['render_pax_per_room'],
                'room_amount': request.session['tour_room_mapping']['room_amount'],
                'adult': request.session['tour_pax_amount']['adult_amt'],
                'child': request.session['tour_pax_amount']['child_amt'],
                'infant': request.session['tour_pax_amount']['infant_amt'],
                'tour_line_code': request.session['tour_line_code'],
                'tour_data': request.session['tour_pick'],
            })

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'adult_title': adult_title,
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'infant_title': infant_title,
                'child_title': child_title,
                'username': request.session['user_account'],
                'tour_data': request.session['tour_pick'],
                'departure_date': dept,
                'arrival_date': arr,
                'adults': adult,
                'infants': infant,
                'childs': child,
                'adult_amt': request.session['tour_pax_amount']['adult_amt'],
                'infant_amt': request.session['tour_pax_amount']['infant_amt'],
                'child_amt': request.session['tour_pax_amount']['child_amt'],
                'room_list': request.session['tour_room_mapping']['render_pax_per_room'],
                'room_amount': request.session['tour_room_mapping']['room_amount'],
                'time_limit': request.session['time_limit'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['tour_signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/tour/tour_passenger_templates.html', values)
    else:
        return no_session_logout(request)


def review(request):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version()
            cache_version = get_cache_version()
            response = get_cache_data(cache_version)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)
            values = get_data_template(request)
            # res = json.loads(request.POST['response'])
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            set_session(request, 'time_limit', int(request.POST['time_limit_input']))
            adult = []
            child = []
            infant = []
            all_pax = []
            contact = []
            printout_paxs = []

            booker = {
                'title': request.POST['booker_title'],
                'first_name': request.POST['booker_first_name'],
                'last_name': request.POST['booker_last_name'],
                'nationality_name': request.POST['booker_nationality'],
                'email': request.POST['booker_email'],
                'calling_code': request.POST['booker_phone_code'],
                'mobile': request.POST['booker_phone'],
                'booker_seq_id': request.POST['booker_id']
            }

            temp_pax_id = 0
            for i in range(int(request.session['tour_booking_data']['adult'])):
                adult.append({
                    "temp_pax_id": temp_pax_id,
                    "first_name": request.POST['adult_first_name' + str(i + 1)],
                    "last_name": request.POST['adult_last_name' + str(i + 1)],
                    "nationality_name": request.POST['adult_nationality' + str(i + 1)],
                    "title": request.POST['adult_title' + str(i + 1)],
                    "pax_type": "ADT",
                    "pax_type_str": "Adult",
                    "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                    "identity_number": request.POST.get('adult_passport_number' + str(i + 1)) and request.POST['adult_passport_number' + str(i + 1)] or '',
                    "identity_expdate": request.POST.get('adult_passport_expired_date' + str(i + 1)) and request.POST['adult_passport_expired_date' + str(i + 1)] or '',
                    "identity_country_of_issued_name": request.POST.get('adult_country_of_issued' + str(i + 1)) and request.POST['adult_country_of_issued' + str(i + 1)] or '',
                    "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                    "identity_type": "passport",
                    "calling_code": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone_code' + str(i + 1)],
                    "mobile": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone' + str(i + 1)] or ' - ',
                    "email": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_email' + str(i + 1)] or ' - ',
                    "is_cp": request.POST.get('adult_cp' + str(i + 1)),
                })
                printout_paxs.append({
                    "name": request.POST['adult_title' + str(i + 1)] + ' ' + request.POST['adult_first_name' + str(i + 1)] + ' ' + request.POST['adult_last_name' + str(i + 1)],
                    'ticket_number': '',
                    'birth_date': request.POST['adult_birth_date' + str(i + 1)],
                    'pax_type': 'Adult',
                    'additional_info': [],
                })
                temp_pax_id += 1

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
                    'is_also_booker': True
                })

            for i in range(int(request.session['tour_booking_data']['child'])):
                child.append({
                    "temp_pax_id": temp_pax_id,
                    "first_name": request.POST['child_first_name'+str(i+1)],
                    "last_name": request.POST['child_last_name'+str(i+1)],
                    "nationality_name": request.POST['child_nationality'+str(i+1)],
                    "title": request.POST['child_title'+str(i+1)],
                    "pax_type": "CHD",
                    "pax_type_str": "Child",
                    "birth_date": request.POST['child_birth_date'+str(i+1)],
                    "identity_number": request.POST.get('child_passport_number' + str(i + 1)) and request.POST['child_passport_number' + str(i + 1)] or '',
                    "identity_expdate": request.POST.get('child_passport_expired_date' + str(i + 1)) and request.POST['child_passport_expired_date' + str(i + 1)] or '',
                    "identity_country_of_issued_name": request.POST.get('child_country_of_issued' + str(i + 1)) and request.POST['child_country_of_issued' + str(i + 1)] or '',
                    "passenger_seq_id": request.POST['child_id'+str(i+1)],
                    "identity_type": "passport",
                })
                printout_paxs.append({
                    "name": request.POST['child_title' + str(i + 1)] + ' ' + request.POST['child_first_name' + str(i + 1)] + ' ' + request.POST['child_last_name' + str(i + 1)],
                    'ticket_number': '',
                    'birth_date': request.POST['child_birth_date' + str(i + 1)],
                    'pax_type': 'Child',
                    'additional_info': [],
                })
                temp_pax_id += 1

            for i in range(int(request.session['tour_booking_data']['infant'])):
                infant.append({
                    "temp_pax_id": temp_pax_id,
                    "first_name": request.POST['infant_first_name'+str(i+1)],
                    "last_name": request.POST['infant_last_name'+str(i+1)],
                    "nationality_name": request.POST['infant_nationality'+str(i+1)],
                    "title": request.POST['infant_title'+str(i+1)],
                    "pax_type": "INF",
                    "pax_type_str": "Infant",
                    "birth_date": request.POST['infant_birth_date'+str(i+1)],
                    "identity_number": request.POST.get('infant_passport_number' + str(i + 1)) and request.POST['infant_passport_number' + str(i + 1)] or '',
                    "identity_expdate": request.POST.get('infant_passport_expired_date' + str(i + 1)) and request.POST['infant_passport_expired_date' + str(i + 1)] or '',
                    "identity_country_of_issued_name": request.POST.get('infant_country_of_issued' + str(i + 1)) and request.POST['infant_country_of_issued' + str(i + 1)] or '',
                    "passenger_seq_id": request.POST['infant_id'+str(i+1)],
                    "identity_type": "passport",
                })
                printout_paxs.append({
                    "name": request.POST['infant_title' + str(i + 1)] + ' ' + request.POST['infant_first_name' + str(i + 1)] + ' ' + request.POST['infant_last_name' + str(i + 1)],
                    'ticket_number': '',
                    'birth_date': request.POST['infant_birth_date' + str(i + 1)],
                    'pax_type': 'Infant',
                    'additional_info': [],
                })
                temp_pax_id += 1

            for rec in adult:
                all_pax.append(rec)
            for rec in child:
                all_pax.append(rec)
            for rec in infant:
                all_pax.append(rec)

            temp_idx = 0
            for rec in all_pax:
                rec.update({
                    'sequence': temp_idx,
                    'tour_room_code': '',
                    'tour_room_seq': 0,
                })
                temp_idx += 1

            temp_booking_data = request.session['tour_booking_data']

            temp_booking_data.update({
                'adult_pax': adult,
                'child_pax': child,
                'infant_pax': infant,
                'contact': contact,
                'booker': booker,
                'total_pax_all': temp_idx,
            })

            set_session(request, 'tour_booking_data', temp_booking_data)

            printout_prices = []
            for temp_prices in request.session['tour_price']['result']['response']['service_charges']:
                printout_prices.append({
                    "fare": temp_prices['amount'],
                    "name": temp_prices['charge_type'],
                    "qty": temp_prices['pax_count'],
                    "total": temp_prices['total'],
                    "pax_type": temp_prices['pax_type'],
                    "tax": 0
                })

            printout_rec = {
                "type": "tour",
                "agent_name": request.session._session['user_account']['co_agent_name'],
                "passenger": printout_paxs,
                "price_detail": printout_prices,
                "line": [
                    {
                        "resv": "-",
                        "checkin": request.session['tour_dept_return_data'].get('departure') and request.session['tour_dept_return_data']['departure'] or '',
                        "checkout": request.session['tour_dept_return_data'].get('departure') and request.session['tour_dept_return_data']['arrival'] or '',
                        "tour_name": request.session['tour_pick']['name'],
                    }
                ],
            }

            dept = request.session['tour_dept_return_data'].get('departure') and datetime.strptime(request.session['tour_dept_return_data']['departure'], '%Y-%m-%d').strftime('%d %b %Y') or ''
            arr = request.session['tour_dept_return_data'].get('arrival') and datetime.strptime(request.session['tour_dept_return_data']['arrival'], '%Y-%m-%d').strftime('%d %b %Y') or ''

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'tour_data': request.session['tour_pick'],
                'departure_date': dept,
                'arrival_date': arr,
                'adult': request.session['tour_booking_data']['adult'],
                'child': request.session['tour_booking_data']['child'],
                'infant': request.session['tour_booking_data']['infant'],
                'room_list': request.session['tour_booking_data']['room_list'],
                'room_amount': int(request.session['tour_booking_data']['room_amount']),
                'upsell': request.session.get('tour_upsell_'+request.session['tour_signature']) and request.session.get('tour_upsell_'+request.session['tour_signature']) or 0,
                'booker': booker,
                'adult_pax': adult,
                'child_pax': child,
                'infant_pax': infant,
                'all_pax': all_pax,
                'contact_person': contact,
                'total_pax_all': temp_idx,
                'printout_rec': json.dumps(printout_rec),
                'time_limit': request.session['time_limit'],
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': request.session['tour_signature'],
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')

        return render(request, MODEL_NAME+'/tour/tour_review_templates.html', values)
    else:
        return no_session_logout(request)


def booking(request, order_number):
    try:
        javascript_version = get_javascript_version()
        values = get_data_template(request)
        if 'user_account' not in request.session:
            signin_btc(request)
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            set_session(request, 'tour_order_number', base64.b64decode(order_number).decode('ascii'))
        except:
            set_session(request, 'tour_order_number', order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': request.session['tour_order_number'],
            'javascript_version': javascript_version,
            'signature': request.session['signature'],

            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/tour/tour_booking_templates.html', values)

