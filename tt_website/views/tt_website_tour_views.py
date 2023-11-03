from rest_framework.response import Response
from rest_framework import authentication, permissions
from tools import path_util
from tools.parser import *
from django.utils import translation
import json
import base64
import re
from io import BytesIO
from datetime import *
from tt_webservice.views.tt_webservice_agent_views import *
from tt_webservice.views.tt_webservice import *
from .tt_website_views import *
_logger = logging.getLogger("website_logger")

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

MODEL_NAME = 'tt_website'

adult_title = ['MR', 'MRS', 'MS']

infant_title = ['MSTR', 'MISS']

def tour(request):
    if 'user_account' in request.session._session and 'ticketing_tour' in request.session['user_account']['co_agent_frontend_security']:
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
            # get_data_awal
            cache = {}
            try:
                file = read_cache_file(request, '', 'hotel_request')
                if file:
                    cache['hotel'] = {
                        'name': file['tour_query']
                    }
                # cache['tour'] = {
                #     'name': request.session['tour_request']['tour_query']
                # }
            except:
                pass

            # tour
            try:
                tour_countries = response['result']['response']['tour']['countries']
                tour_types = response['result']['response']['tour']['tour_types']
            except Exception as e:
                tour_countries = []
                tour_types = []
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
                'tour_types': tour_types,
                'javascript_version': javascript_version,
                'update_data': 'false',
                'static_path_url_server': get_url_static_path(),
                'big_banner_value': check_banner('tour', 'big_banner', request),
                'small_banner_value': check_banner('tour', 'small_banner', request),
                'dynamic_page_value': check_banner('', 'dynamic_page', request),
                'signature': request.session['signature'],

            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME + '/tour/tour_templates.html', values)

    else:
        return no_session_logout(request)

def search(request):
    ## CELINDO DARI COMPANY PROFILE REDIRECT KE PAGE SEARCH TOUR CHECK WEBSITE MODE
    user_default = get_credential_user_default(request, 'dict')
    values = get_data_template(request, 'search')
    ## kalau belum signin, web btc & ada user default
    if not request.session.get('user_account') and values['website_mode'] in ['btc', 'btc_btb'] and user_default:
        signin_btc(request)
    if 'user_account' in request.session:
        try:
            # check_captcha(request)
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)
            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            values = get_data_template(request, 'search')

            frontend_signature = generate_signature()

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
                write_cache_file(request, frontend_signature, 'tour_request', {
                    'tour_query': request.POST.get('tour_query') and request.POST['tour_query'] or '',
                    'country_id': request.POST.get('tour_countries') != '0' and int(request.POST['tour_countries']) or 0,
                    'city_id': request.POST.get('tour_cities') != '0' and int(request.POST['tour_cities']) or 0,
                    'month': request.POST['tour_dest_month'],
                    'year': request.POST['tour_dest_year'],
                    'limit': 25,
                    'offset': 0,
                })

                # set_session(request, 'tour_request', {
                #     'tour_query': request.POST.get('tour_query') and request.POST['tour_query'] or '',
                #     'country_id': request.POST.get('tour_countries') != '0' and int(request.POST['tour_countries']) or 0,
                #     'city_id': request.POST.get('tour_cities') != '0' and int(request.POST['tour_cities']) or 0,
                #     'month': request.POST['tour_dest_month'],
                #     'year': request.POST['tour_dest_year'],
                #     'limit': 25,
                #     'offset': 0,
                # })
            except Exception as e:
                _logger.error('Data POST for tour_request not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))
                ## ## CELINDO DARI COMPANY PROFILE REDIRECT KE PAGE SEARCH TOUR
                ## search all
                write_cache_file(request, frontend_signature, 'tour_request', {
                    'tour_query': '',
                    'country_id': 0,
                    'city_id': 0,
                    'month': '',
                    'year': '',
                    'limit': 25,
                    'offset': 0,
                })
                # set_session(request, 'tour_request', {
                #     'tour_query': '',
                #     'country_id': 0,
                #     'city_id': 0,
                #     'month': '',
                #     'year': '',
                #     'limit': 25,
                #     'offset': 0,
                # })

            file = read_cache_file(request, frontend_signature, 'tour_request')
            if file:
                tour_request = file
            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'frontend_signature': frontend_signature,
                'phone_code': phone_code,
                'tour_request': tour_request,
                'query': tour_request['tour_query'],
                'dest_country': tour_request['country_id'],
                'dest_city': tour_request['city_id'],
                'dest_year': tour_request['year'],
                'dest_month': tour_request['month'],
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

def detail_without_signature(request, tour_code):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Tour detail error without login')
        create_session_product(request, 'tour', 20, request.session['signature'])
        return redirect('/tour/detail/%s/%s' % (tour_code[:-1] if tour_code[-1] == '/' else tour_code, request.session['signature']))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')

        raise Exception('Make response code 500!')

def detail(request, tour_code, signature=''):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request, 'search')
        if 'user_account' not in request.session:
            signin_btc(request)
        if not signature:
            return redirect('/tour/detail/%s/%s' % (tour_code, request.session['signature']))
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY]  # get language from browser
        response = get_cache_data(request)
        airline_country = response['result']['response']['airline']['country']
        phone_code = []
        for i in airline_country:
            if i['phone_code'] not in phone_code:
                phone_code.append(i['phone_code'])
        phone_code = sorted(phone_code)

        # time_limit = get_timelimit_product(request, 'tour')
        # if time_limit == 0:
        #     try:
        #         time_limit = int(request.POST['time_limit_input'])
        #     except:
        #         if request.session.get('time_limit'):
        #             time_limit = request.session['time_limit']
        #         else:
        #             time_limit = 1200
        # set_session(request, 'time_limit', time_limit)

        try:
            time_limit = get_timelimit_product(request, 'tour', signature)
            if time_limit == 0:
                time_limit = int(request.POST['time_limit_input'])
            write_cache_file(request, signature, 'time_limit', time_limit)
            # set_session(request, 'time_limit_%s' % signature, time_limit)
        except:
            if request.POST.get('time_limit_input'):
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
            else:
                return redirect('/tour/detail/%s' % (tour_code[:-1] if tour_code[-1] == '/' else tour_code))


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

        file = read_cache_file(request, signature, 'tour_request')
        if not file:
            write_cache_file(request, signature, 'tour_request', {
                'tour_query': '',
                'country_id': 0,
                'city_id': 0,
                'month': '',
                'year': '',
                'limit': 25,
                'offset': 0,
            })
        # if not request.session.get('tour_request'):
            # set_session(request, 'tour_request', {
            #     'tour_query': '',
            #     'country_id': 0,
            #     'city_id': 0,
            #     'month': '00',
            #     'year': '0000',
            #     'limit': 25,
            #     'offset': 0,
            # })

        file = read_cache_file(request, signature, 'tour_request')
        if file:
            tour_request = file

        file = read_cache_file(request, signature, 'time_limit')
        if file:
            time_limit = file
        else:
            time_limit = 1200

        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            # 'response': request.session['tour_search'][int(request.POST['sequence'])],
            # 'response': request.session['tour_pick'],
            'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
            'countries': airline_country,
            'phone_code': phone_code,
            'tour_code': tour_code,
            'query': tour_request['tour_query'],
            'dest_country': tour_request['country_id'],
            'dest_city': tour_request['city_id'],
            'dest_year': tour_request['year'],
            'dest_month': tour_request['month'],
            'dest_month_data': dest_month_data,
            'username': request.session['user_account'],
            'javascript_version': javascript_version,
            'signature': signature,
            'time_limit': time_limit,
            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('Make response code 500!')

    return render(request, MODEL_NAME+'/tour/tour_detail_templates.html', values)

def passenger(request, signature=''):
    if 'user_account' in request.session._session:
        try:
            javascript_version = get_javascript_version(request)
            response = get_cache_data(request)

            values = get_data_template(request)

            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            try:
                time_limit = get_timelimit_product(request, 'tour', signature)
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)
                # set_session(request, 'time_limit_%s' % signature, time_limit)
            except:
                time_limit = int(request.POST['time_limit_input'])
                write_cache_file(request, signature, 'time_limit', time_limit)

            # agent
            adult_title = ['', 'MR', 'MRS', 'MS']
            infant_title = ['', 'MSTR', 'MISS']
            child_title = infant_title

            airline_country = response['result']['response']['airline']['country']
            phone_code = []
            for i in airline_country:
                if i['phone_code'] not in phone_code:
                    phone_code.append(i['phone_code'])
            phone_code = sorted(phone_code)

            # pax
            try:

                write_cache_file(request, signature, 'tour_room_mapping', {
                    "room_amount":request.POST['room_amount']
                })

                # set_session(request, 'tour_room_mapping', {
                #     'room_amount': request.POST['room_amount']
                # })
            except Exception as e:
                _logger.error('Data POST for tour_room_mapping not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            adult_amt = 0
            child_amt = 0
            infant_amt = 0
            adult = []
            infant = []
            child = []

            try:
                file = read_cache_file(request, signature, 'tour_room_mapping')
                if file:
                    for r in range(int(file['room_amount'])):
                        adult_amt += int(request.POST['adult_tour_room_' + str(r + 1)])
                        child_amt += int(request.POST['child_tour_room_' + str(r + 1)])
                        infant_amt += int(request.POST['infant_tour_room_' + str(r + 1)])

                    write_cache_file(request, signature, 'tour_pax_amount', {
                        'adult_amt': adult_amt,
                        'child_amt': child_amt,
                        'infant_amt': infant_amt,
                    })
                # for r in range(int(request.session['tour_room_mapping']['room_amount'])):
                #     adult_amt += int(request.POST['adult_tour_room_' + str(r+1)])
                #     child_amt += int(request.POST['child_tour_room_' + str(r+1)])
                #     infant_amt += int(request.POST['infant_tour_room_' + str(r+1)])
                # set_session(request, 'tour_pax_amount', {
                #     'adult_amt': adult_amt,
                #     'child_amt': child_amt,
                #     'infant_amt': infant_amt,
                # })
            except Exception as e:
                _logger.error('Data POST for tour_pax_amount not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'tour_pax_amount')
            if file:
                tour_pax_amount = file

            try:
                for i in range(tour_pax_amount['adult_amt']):
                    adult.append('')
            except:
                print('no adult')

            try:
                for i in range(tour_pax_amount['child_amt']):
                    child.append('')
            except:
                print('no children')

            try:
                for i in range(tour_pax_amount['infant_amt']):
                    infant.append('')
            except:
                print('no infant')

            try:
                write_cache_file(request, signature, 'tour_line_code', request.POST['tour_line_code'])
                # set_session(request, 'tour_line_code', request.POST['tour_line_code'])
            except Exception as e:
                _logger.error('Data POST for tour_line_code not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            try:
                write_cache_file(request, signature, 'tour_data', json.loads(request.POST['tour_data']))
                # set_session(request, 'tour_data', json.loads(request.POST['tour_data']))
            except Exception as e:
                _logger.error('Data POST for tour_data not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            try:
                tour_dept_date = ''
                tour_arr_date = ''
                file = read_cache_file(request, signature, 'tour_pick')
                if file:
                    tour_pick = file
                    if tour_pick['tour_type']['is_open_date']:
                        tour_dept_date = request.POST.get('open_tour_departure_date') and datetime.strptime(request.POST['open_tour_departure_date'], '%d %b %Y').strftime('%Y-%m-%d') or ''
                        tour_arr_date = request.POST.get('open_tour_arrival_date') and datetime.strptime(request.POST['open_tour_arrival_date'], '%d %b %Y').strftime('%Y-%m-%d') or ''
                    else:
                        for line in tour_pick['tour_lines']:
                            if line['tour_line_code'] == request.POST['tour_line_code']:
                                tour_dept_date = line['departure_date']
                                tour_arr_date = line['arrival_date']
                    write_cache_file(request, signature, 'tour_pick', tour_pick)
                    write_cache_file(request, signature, 'tour_dept_return_data', {
                    'departure': tour_dept_date,
                    'arrival': tour_arr_date
                })

                # if request.session.get('tour_pick'):
                #     if request.session['tour_pick']['tour_type'] == 'open':
                #         tour_dept_date = request.POST.get('open_tour_departure_date') and datetime.strptime(request.POST['open_tour_departure_date'], '%d %b %Y').strftime('%Y-%m-%d') or ''
                #         tour_arr_date = request.POST.get('open_tour_arrival_date') and datetime.strptime(request.POST['open_tour_arrival_date'], '%d %b %Y').strftime('%Y-%m-%d') or ''
                #     else:
                #         for line in request.session['tour_pick']['tour_lines']:
                #             if line['tour_line_code'] == request.POST['tour_line_code']:
                #                 tour_dept_date = line['departure_date']
                #                 tour_arr_date = line['arrival_date']
                # set_session(request, 'tour_dept_return_data', {
                #     'departure': tour_dept_date,
                #     'arrival': tour_arr_date
                # })
            except Exception as e:
                _logger.error('Data POST for tour_dept_return_data not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'tour_dept_return_data')
            if file:
                dept = file.get('departure') and datetime.strptime(file['departure'], '%Y-%m-%d').strftime('%d %b %Y') or ''
                arr = file.get('arrival') and datetime.strptime(file['arrival'], '%Y-%m-%d').strftime('%d %b %Y') or ''

            try:
                file = read_cache_file(request, signature, 'tour_room_mapping')
                if file:
                    tour_room_mapping = file
                    room_amount = int(tour_room_mapping['room_amount'])
                    render_pax_per_room = []
                    for idx in range(room_amount):
                        note = 'notes_' + str(idx + 1)

                        room = {
                            'adult': int(request.POST['adult_tour_room_' + str(idx + 1)]),
                            'child': int(request.POST['child_tour_room_' + str(idx + 1)]),
                            'infant': int(request.POST['infant_tour_room_' + str(idx + 1)]),
                        }

                        chosen_room = False
                        file = read_cache_file(request, signature, 'tour_data')
                        if file:
                            tour_data = file
                            for temp_room in tour_data['accommodations']:
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
                    tour_room_mapping['render_pax_per_room'] = render_pax_per_room
                    write_cache_file(request, signature, 'tour_room_mapping', tour_room_mapping)

                # room_amount = int(request.session['tour_room_mapping']['room_amount'])
                # render_pax_per_room = []
                # for idx in range(room_amount):
                #     note = 'notes_' + str(idx + 1)
                #
                #     room = {
                #         'adult': int(request.POST['adult_tour_room_' + str(idx + 1)]),
                #         'child': int(request.POST['child_tour_room_' + str(idx + 1)]),
                #         'infant': int(request.POST['infant_tour_room_' + str(idx + 1)]),
                #     }
                #
                #     chosen_room = False
                #     for temp_room in request.session['tour_data']['accommodations']:
                #         if temp_room['room_code'] == request.POST['room_code_' + str(idx + 1)]:
                #             chosen_room = temp_room
                #
                #     room.update({
                #         'address': chosen_room['address'],
                #         'bed_type': chosen_room['bed_type'],
                #         'description': chosen_room['description'],
                #         'hotel': chosen_room['hotel'],
                #         'name': chosen_room['name'],
                #         'star': chosen_room['star'],
                #         'room_code': chosen_room['room_code'],
                #         'notes': request.POST.get(note) and request.POST[note] or '',
                #         'room_seq': 'Room ' + str(idx + 1),
                #     })
                #     render_pax_per_room.append(room)
                # request.session['tour_room_mapping'].update({
                #     'render_pax_per_room': render_pax_per_room
                # })
            except Exception as e:
                _logger.error('Data POST for tour_room_mapping not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            file = read_cache_file(request, signature, 'tour_room_mapping')
            if file:
                tour_room_mapping = file

            file = read_cache_file(request, signature, 'tour_pax_amount')
            if file:
                tour_pax_amount = file

            file = read_cache_file(request, signature, 'tour_line_code')
            if file:
                tour_line_code = file

            file = read_cache_file(request, signature, 'tour_pick')
            if file:
                tour_pick = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            write_cache_file(request, signature, 'tour_booking_data', {
                'room_list': tour_room_mapping['render_pax_per_room'],
                'room_amount': tour_room_mapping['room_amount'],
                'adult': tour_pax_amount['adult_amt'],
                'child': tour_pax_amount['child_amt'],
                'infant': tour_pax_amount['infant_amt'],
                'tour_line_code': tour_line_code,
                'tour_data': tour_pick,
            })

            # set_session(request, 'tour_booking_data', {
            #     'room_list': request.session['tour_room_mapping']['render_pax_per_room'],
            #     'room_amount': request.session['tour_room_mapping']['room_amount'],
            #     'adult': request.session['tour_pax_amount']['adult_amt'],
            #     'child': request.session['tour_pax_amount']['child_amt'],
            #     'infant': request.session['tour_pax_amount']['infant_amt'],
            #     'tour_line_code': request.session['tour_line_code'],
            #     'tour_data': request.session['tour_pick'],
            # })

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'adult_title': adult_title,
                'titles': ['', 'MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'infant_title': infant_title,
                'child_title': child_title,
                'username': request.session['user_account'],
                'tour_data': tour_pick,
                'tour_line_code': tour_line_code,
                'departure_date': dept,
                'arrival_date': arr,
                'adults': adult,
                'infants': infant,
                'childs': child,
                'adult_amt': tour_pax_amount['adult_amt'],
                'infant_amt': tour_pax_amount['infant_amt'],
                'child_amt': tour_pax_amount['child_amt'],
                'room_list': tour_room_mapping['render_pax_per_room'],
                'room_amount': tour_room_mapping['room_amount'],
                'time_limit': time_limit,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': signature,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')
        return render(request, MODEL_NAME+'/tour/tour_passenger_templates.html', values)
    else:
        return no_session_logout(request)

def review(request, signature=''):
    if 'user_account' in request.session._session:
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
            # res = json.loads(request.POST['response'])
            if translation.LANGUAGE_SESSION_KEY in request.session:
                del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser

            try:
                time_limit = get_timelimit_product(request, 'tour')
                if time_limit == 0:
                    time_limit = int(request.POST['time_limit_input'])
                set_session(request, 'time_limit', time_limit)
            except:
                pass
            try:
                adult = []
                child = []
                infant = []
                all_pax = []
                contact = []
                printout_paxs = []

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
                    'nationality_code': request.POST['booker_nationality_id'],
                    'email': email,
                    'calling_code': request.POST['booker_phone_code_id'],
                    'mobile': mobile,
                    'booker_seq_id': request.POST['booker_id']
                }

                temp_pax_id = 0

                file = read_cache_file(request, signature, 'tour_booking_data')
                if file:
                    for i in range(int(file['adult'])):
                        img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'adult' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                        behaviors = {}
                        if request.POST.get('adult_behaviors_' + str(i + 1)):
                            behaviors = {'tour': request.POST['adult_behaviors_' + str(i + 1)]}

                        first_name = re.sub(r'\s', ' ', request.POST['adult_first_name' + str(i + 1)]).replace(':', '').strip()
                        last_name = re.sub(r'\s', ' ', request.POST.get('adult_last_name' + str(i + 1), '')).replace(':', '').strip()
                        email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1), '')).replace(':', '').strip()
                        mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1), '')).replace(':', '').strip()
                        identity_number = re.sub(r'\s', ' ', request.POST.get('adult_passport_number' + str(i + 1)) and request.POST['adult_passport_number' + str(i + 1)] or '').replace(':', '').strip()

                        adult.append({
                            "temp_pax_id": temp_pax_id,
                            "first_name": first_name,
                            "last_name": last_name,
                            "nationality_code": request.POST['adult_nationality' + str(i + 1) + '_id'],
                            "title": request.POST['adult_title' + str(i + 1)],
                            "pax_type": "ADT",
                            "pax_type_str": "Adult",
                            "birth_date": request.POST['adult_birth_date' + str(i + 1)],
                            "identity_number": identity_number,
                            "identity_expdate": request.POST.get('adult_passport_expired_date' + str(i + 1)) and request.POST['adult_passport_expired_date' + str(i + 1)] or '',
                            "identity_country_of_issued_code": request.POST.get('adult_country_of_issued' + str(i + 1) + '_id') and request.POST['adult_country_of_issued' + str(i + 1) + '_id'] or '',
                            "identity_image": img_identity_data,
                            "passenger_seq_id": request.POST['adult_id' + str(i + 1)],
                            "identity_type": "passport",
                            "calling_code": request.POST.get('adult_cp' + str(i + 1) + '_id') and request.POST['adult_phone_code' + str(i + 1) + '_id'],
                            "mobile": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_phone' + str(i + 1)] or ' - ',
                            "email": request.POST.get('adult_cp' + str(i + 1)) and request.POST['adult_email' + str(i + 1)] or ' - ',
                            "is_cp": request.POST.get('adult_cp' + str(i + 1)),
                            "behaviors": behaviors,

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

                    for i in range(int(file['child'])):
                        img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'child' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                        behaviors = {}
                        if request.POST.get('child_behaviors_' + str(i + 1)):
                            behaviors = {'tour': request.POST['child_behaviors_' + str(i + 1)]}

                        first_name = re.sub(r'\s', ' ', request.POST['child_first_name'+str(i+1)]).replace(':', '').strip()
                        last_name = re.sub(r'\s', ' ', request.POST.get('child_last_name'+str(i+1))).replace(':', '').strip()
                        # email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                        # mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1))).replace(':', '').strip()
                        identity_number = re.sub(r'\s', ' ', request.POST.get('child_passport_number' + str(i + 1)) and request.POST['child_passport_number' + str(i + 1)] or '').replace(':','')

                        child.append({
                            "temp_pax_id": temp_pax_id,
                            "first_name": first_name,
                            "last_name": last_name,
                            "nationality_code": request.POST['child_nationality'+str(i+1) + '_id'],
                            "title": request.POST['child_title'+str(i+1)],
                            "pax_type": "CHD",
                            "pax_type_str": "Child",
                            "birth_date": request.POST['child_birth_date'+str(i+1)],
                            "identity_number": identity_number,
                            "identity_expdate": request.POST.get('child_passport_expired_date' + str(i + 1)) and request.POST['child_passport_expired_date' + str(i + 1)] or '',
                            "identity_country_of_issued_code": request.POST.get('child_country_of_issued' + str(i + 1) + '_id') and request.POST['child_country_of_issued' + str(i + 1) + '_id'] or '',
                            "identity_image": img_identity_data,
                            "passenger_seq_id": request.POST['child_id'+str(i+1)],
                            "identity_type": "passport",
                            "behaviors": behaviors,
                        })
                        printout_paxs.append({
                            "name": request.POST['child_title' + str(i + 1)] + ' ' + request.POST['child_first_name' + str(i + 1)] + ' ' + request.POST['child_last_name' + str(i + 1)],
                            'ticket_number': '',
                            'birth_date': request.POST['child_birth_date' + str(i + 1)],
                            'pax_type': 'Child',
                            'additional_info': [],
                        })
                        temp_pax_id += 1

                    for i in range(int(file['infant'])):
                        img_identity_data = [sel_img[:2] for sel_img in img_list_data if 'infant' in sel_img[2].lower() and 'identity' in sel_img[2].lower() and str(i + 1) in sel_img[2].lower()]
                        behaviors = {}
                        if request.POST.get('infant_behaviors_' + str(i + 1)):
                            behaviors = {'tour': request.POST['infant_behaviors_' + str(i + 1)]}

                        first_name = re.sub(r'\s', ' ', request.POST['infant_first_name' + str(i + 1)]).replace(':', '').strip()
                        last_name = re.sub(r'\s', ' ', request.POST.get('infant_last_name' + str(i + 1))).replace(':', '').strip()
                        # email = re.sub(r'\s', ' ', request.POST.get('adult_email' + str(i + 1))).replace(':', '').strip()
                        # mobile = re.sub(r'\s', ' ', request.POST.get('adult_phone' + str(i + 1))).replace(':', '').strip()
                        identity_number = re.sub(r'\s', ' ', request.POST.get('infant_passport_number' + str(i + 1)) and request.POST['infant_passport_number' + str(i + 1)] or '').replace(':','')

                        infant.append({
                            "temp_pax_id": temp_pax_id,
                            "first_name": first_name,
                            "last_name": last_name,
                            "nationality_code": request.POST['infant_nationality'+str(i+1) + '_id'],
                            "title": request.POST['infant_title'+str(i+1)],
                            "pax_type": "INF",
                            "pax_type_str": "Infant",
                            "birth_date": request.POST['infant_birth_date'+str(i+1)],
                            "identity_number": identity_number,
                            "identity_expdate": request.POST.get('infant_passport_expired_date' + str(i + 1)) and request.POST['infant_passport_expired_date' + str(i + 1)] or '',
                            "identity_country_of_issued_code": request.POST.get('infant_country_of_issued' + str(i + 1) + '_id') and request.POST['infant_country_of_issued' + str(i + 1) + '_id'] or '',
                            "identity_image": img_identity_data,
                            "passenger_seq_id": request.POST['infant_id'+str(i+1)],
                            "behaviors": behaviors,
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

                file = read_cache_file(request, signature, 'tour_booking_data')
                if file:
                    temp_booking_data = file
                # temp_booking_data = request.session['tour_booking_data']

                temp_booking_data.update({
                    'adult_pax': adult,
                    'child_pax': child,
                    'infant_pax': infant,
                    'contact': contact,
                    'booker': booker,
                    'total_pax_all': temp_idx,
                })

                write_cache_file(request, signature, 'tour_booking_data', temp_booking_data)
                write_cache_file(request, signature, 'all_pax', all_pax)
                # set_session(request, 'tour_booking_data', temp_booking_data)
                # set_session(request, 'all_pax', all_pax)
            except Exception as e:
                _logger.error('Data POST for tour_booking_data, all_pax not found use cache')
                _logger.error("%s, %s" % (str(e), traceback.format_exc()))

            printout_prices = []

            file = read_cache_file(request, signature, 'tour_price')
            if file:
                tour_price = file
                for temp_prices in tour_price['result']['response']['service_charges']:
                    printout_prices.append({
                        "fare": temp_prices['amount'],
                        "name": temp_prices['charge_type'],
                        "qty": temp_prices['pax_count'],
                        "total": temp_prices['total'],
                        "pax_type": temp_prices['pax_type'],
                        "tax": 0
                    })
            # for temp_prices in request.session['tour_price']['result']['response']['service_charges']:
            #     printout_prices.append({
            #         "fare": temp_prices['amount'],
            #         "name": temp_prices['charge_type'],
            #         "qty": temp_prices['pax_count'],
            #         "total": temp_prices['total'],
            #         "pax_type": temp_prices['pax_type'],
            #         "tax": 0
            #     })

            file = read_cache_file(request, signature, 'tour_dept_return_data')
            if file:
                tour_dept_return_data = file

            file = read_cache_file(request, signature, 'tour_pick')
            if file:
                tour_pick = file

            printout_rec = {
                "type": "tour",
                "agent_name": request.session._session['user_account']['co_agent_name'],
                "passenger": printout_paxs,
                "price_detail": printout_prices,
                "line": [
                    {
                        "resv": "-",
                        "checkin": tour_dept_return_data.get('departure') and tour_dept_return_data['departure'] or '',
                        "checkout": tour_dept_return_data.get('departure') and tour_dept_return_data['arrival'] or '',
                        "tour_name": tour_pick['name'],
                    }
                ],
            }

            dept = tour_dept_return_data.get('departure') and datetime.strptime(tour_dept_return_data['departure'], '%Y-%m-%d').strftime('%d %b %Y') or ''
            arr = tour_dept_return_data.get('arrival') and datetime.strptime(tour_dept_return_data['arrival'], '%Y-%m-%d').strftime('%d %b %Y') or ''

            file = read_cache_file(request, signature, 'tour_booking_data')
            if file:
                tour_booking_data = file

            file = read_cache_file(request, signature, 'tour_pick')
            if file:
                tour_pick = file

            file = read_cache_file(request, signature, 'tour_line_code')
            if file:
                tour_line_code = file

            file = read_cache_file(request, signature, 'all_pax')
            if file:
                all_pax = file

            file = read_cache_file(request, signature, 'time_limit')
            if file:
                time_limit = file

            file = read_cache_file(request, signature, 'tour_upsell')
            if file:
                tour_upsell = file
            else:
                tour_upsell = 0

            values.update({
                'static_path': path_util.get_static_path(MODEL_NAME),
                'username': request.session['user_account'],
                'titles': ['MR', 'MRS', 'MS', 'MSTR', 'MISS'],
                'countries': airline_country,
                'phone_code': phone_code,
                'tour_data': tour_pick,
                'tour_line_code': tour_line_code,
                'departure_date': dept,
                'arrival_date': arr,
                'adult': tour_booking_data['adult'],
                'child': tour_booking_data['child'],
                'infant': tour_booking_data['infant'],
                'room_list': tour_booking_data['room_list'],
                'room_amount': int(tour_booking_data['room_amount']),
                'upsell': tour_upsell,
                'booker': tour_booking_data['booker'],
                'adult_pax': tour_booking_data['adult_pax'],
                'child_pax': tour_booking_data['child_pax'],
                'infant_pax': tour_booking_data['infant_pax'],
                'all_pax': all_pax,
                'contact_person': tour_booking_data['contact'],
                'total_pax_all': tour_booking_data['total_pax_all'],
                'printout_rec': json.dumps(printout_rec),
                'time_limit': time_limit,
                'static_path_url_server': get_url_static_path(),
                'javascript_version': javascript_version,
                'signature': signature,
            })
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
            raise Exception('Make response code 500!')

        return render(request, MODEL_NAME+'/tour/tour_review_templates.html', values)
    else:
        return no_session_logout(request)


def booking(request, order_number):
    try:
        javascript_version = get_javascript_version(request)
        values = get_data_template(request)
        web_mode = get_web_mode(request)
        if 'user_account' not in request.session and 'btc' in web_mode:
            signin_btc(request)
        elif 'user_account' not in request.session and 'btc' not in web_mode:
            raise Exception('Tour get booking without login in btb web')
        if translation.LANGUAGE_SESSION_KEY in request.session:
            del request.session[translation.LANGUAGE_SESSION_KEY] #get language from browser
        try:
            tour_order_number = base64.b64decode(order_number).decode('ascii')
        except:
            try:
                tour_order_number = base64.b64decode(order_number[:-1]).decode('ascii')
            except:
                tour_order_number = order_number
        write_cache_file(request, request.session['signature'], 'tour_order_number', tour_order_number)
        values.update({
            'static_path': path_util.get_static_path(MODEL_NAME),
            'username': request.session.get('user_account') or {'co_user_login': ''},
            'order_number': tour_order_number,
            'javascript_version': javascript_version,
            'signature': request.session['signature'],

            'static_path_url_server': get_url_static_path(),
        })
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        web_mode = get_web_mode(request)
        if 'btc' not in web_mode:
            return redirect('/login?redirect=%s' % request.META['PATH_INFO'])
        if 'btc' in web_mode:
            raise Exception('Make response code 500!')
    return render(request, MODEL_NAME+'/tour/tour_booking_templates.html', values)

