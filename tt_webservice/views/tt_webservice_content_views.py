from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import base64
import re
import logging
import traceback
from .tt_webservice_views import *
from .tt_webservice import *
from tt_website.views import tt_website_views as tt_website
_logger = logging.getLogger("website_logger")

from django.core.files.storage import FileSystemStorage
import os
import uuid
from .onesignal import *

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

cabin_class_list = {
    'All': 'ALL',
    'Y': 'Economy',
    'W': 'Premium Economy',
    'C': 'Business',
    'F': 'First',
    'ALL': 'All',
    'Economy': 'Y',
    'Premium': 'W',
    'Business': 'C',
    'First': 'F',
}

data_bca = {
    'client_id': 'cd7db9f2-8107-46c7-aeec-a1fc4d62b376',
    'client_secret': 'b02a586f-4c41-40ed-9682-c674799750dd',
    'key': "ae20ad3c-cc2c-4676-82a6-e22484af05b1",
    'api_secret': 'aa7d2816-32a1-4779-beb2-4a04fa063cd4'
}

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'upload_file':
            res = upload_file(request)
        elif req_data['action'] == 'add_banner':
            res = add_banner(request)
        elif req_data['action'] == 'get_banner':
            res = get_banner(request)
        elif req_data['action'] == 'test_ledger':
            res = create_legder(request)
        elif req_data['action'] == 'set_inactive_delete_banner':
            res = set_inactive_delete_banner(request)
        elif req_data['action'] == 'get_country':
            res = get_country(request)
        elif req_data['action'] == 'update_image_passenger':
            res = update_image_passenger(request)
        elif req_data['action'] == 'get_public_holiday':
            res = get_public_holiday(request)
        elif req_data['action'] == 'get_dynamic_page':
            res = get_dynamic_page(request)
        elif req_data['action'] == 'set_dynamic_page':
            res = set_dynamic_page(request)
        elif req_data['action'] == 'delete_dynamic_page':
            res = delete_dynamic_page(request)
        elif req_data['action'] == 'get_dynamic_page_detail':
            res = get_dynamic_page_detail(request)
        elif req_data['action'] == 'get_dynamic_page_mobile_detail':
            res = get_dynamic_page_mobile_detail(request)
        elif req_data['action'] == 'get_top_up_term':
            res = get_top_up_term(request)
        elif req_data['action'] == 'get_privacy_policy':
            res = get_privacy_policy(request)
        elif req_data['action'] == 'set_privacy_policy':
            res = set_privacy_policy(request)
        elif req_data['action'] == 'get_term_and_condition':
            res = get_term_and_condition(request)
        elif req_data['action'] == 'set_term_and_condition':
            res = set_term_and_condition(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'youtube_api':
            res = youtube_api_check(request)
        elif req_data['action'] == 'cancel_payment_method_api':
            res = cancel_payment_method_api(request)
        elif req_data['action'] == 'send_notif_message':
            res = send_notif_message(request)
        elif req_data['action'] == 'update_notification_train':
            res = update_notification_train(request)
        elif req_data['action'] == 'update_notification_airline':
            res = update_notification_airline(request)
        elif req_data['action'] == 'get_notification_train':
            res = get_notification_train(request)
        elif req_data['action'] == 'get_notification_airline':
            res = get_notification_airline(request)
        elif req_data['action'] == 'create_reservation_issued_request':
            res = create_reservation_issued_request(request)
        elif req_data['action'] == 'get_reservation_issued_request':
            res = get_reservation_issued_request(request)
        elif req_data['action'] == 'get_issued_request_list':
            res = get_issued_request_list(request)
        elif req_data['action'] == 'approve_reservation_issued_request':
            res = approve_reservation_issued_request(request)
        elif req_data['action'] == 'reject_reservation_issued_request':
            res = reject_reservation_issued_request(request)
        elif req_data['action'] == 'cancel_reservation_issued_request':
            res = cancel_reservation_issued_request(request)
        elif req_data['action'] == 'get_provider_type_sequence':
            res = get_provider_type_sequence(request)
        elif req_data['action'] == 'get_agent_currency_rate':
            res = get_agent_currency_rate(request)
        elif req_data['action'] == 'update_estimate_price':
            res = update_estimate_price(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def upload_file(request):
    try:
        imgData = []

        for i in request.FILES:
            for img in request.FILES.getlist(i):
                imgData.append({
                    'filename': img.name,
                    'file_reference': img.name,
                    'file': base64.b64encode(img.file.read()).decode('ascii'),
                    'type': i
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "upload_file",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    list_img = []
    for img in imgData:
        data = img
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        list_img.append([res['result']['response']['seq_id'], 4])
    try:
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': list_img
            }
        }
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def update_image_passenger(request):
    try:
        imgData = []

        for i in request.FILES:
            for img in request.FILES.getlist(i):
                file_reference = request.POST.get(i.replace('files','description'))
                if file_reference == '':
                    file_reference = img.name
                imgData.append({
                    'filename': img.name,
                    'file_reference': file_reference,
                    'file': base64.b64encode(img.file.read()).decode('ascii'),
                    'type': i
                })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "upload_file",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    list_img = []
    for img in imgData:
        data = img
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        list_img.append([res['result']['response']['seq_id'], 4, img['type']])
    try:
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': list_img
            }
        }
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_country(request):
    response = get_cache_data(request)
    try:
        airline_country = response['result']['response']['airline']['country']
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': airline_country
            }
        }
    except:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': 'No Cache',
                'response': ''
            }
        }
    return res

def parser_get_booking_product(data):
    data_send = {}
    for rec in data:
        data_send[rec] = data[rec]
    if data_send.get('date'):
        data_send['date'] = parse_date_time_to_server(data_send['date'])
    if data_send['product'] == 'airline' and data_send.get('forget_booking') == True:
        data_send['origin'] = data_send['origin'].split(' - ')[0]
        data_send['destination'] = data_send['destination'].split(' - ')[0]
    return data_send

def get_booking(request):
    try:
        data = parser_get_booking_product(json.loads(request.POST['data']))
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_booking_b2c_api",
            "signature": data['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('content')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            if data['product'] == 'airline' or data['product'] == 'train':
                if type(res['result']['response']) == list:
                    for rec in res['result']['response']:
                        rec['departure_date'] = convert_string_to_date_to_string_front_end(rec['departure_date'])
            if data['product'] == 'hotel':
                if type(res['result']['response']) == list:
                    for rec in res['result']['response']:
                        rec['checkin_date'] = convert_string_to_date_to_string_front_end(rec['checkin_date'])
                        rec['checkout_date'] = convert_string_to_date_to_string_front_end(rec['checkout_date'])
            _logger.info("SUCCESS get_booking_b2c SIGNATURE " + data['signature'])
        else:
            _logger.error("ERROR get_booking_b2c SIGNATURE " + data['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel_payment_method_api(request):
    try:
        data = {"order_number": request.POST['order_number']}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "cancel_payment_method_api",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = get_url_gateway('payment')
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel_payment_method_api SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_payment_method_api SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def send_notif_message(request):
    data = {
        "contents": request.POST['message'],
        "headings": request.POST['title']
    }
    res = send_notif(msg=data,url=request.POST['url'])
    return res

def update_notification_train(request):
    try:
        text = ''
        text += request.POST['train_page'] + '\n'
        text += request.POST['train_search'] + '\n'
        text += request.POST['train_passenger'] + '\n'
        text += request.POST['train_review'] + '\n'
        text += request.POST['train_booking'] + '\n'
        text += request.POST['html']
        write_cache(text, "notification_train", request, 'cache_web')

        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': ''
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def update_notification_airline(request):
    try:
        text = ''
        text += request.POST['airline_page'] + '\n'
        text += request.POST['airline_search'] + '\n'
        text += request.POST['airline_passenger'] + '\n'
        text += request.POST['airline_review'] + '\n'
        text += request.POST['airline_booking'] + '\n'
        text += request.POST['html']
        write_cache(text, "notification_airline", request, 'cache_web')

        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': ''
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_notification_train(request):
    try:
        file = read_cache("notification_train", 'cache_web', request, 90911)
        if file:
            data = {}
            for idx,rec in enumerate(file.split('\n')):
                if idx == 0:
                    if rec == 'true':
                        data['train_page'] = True
                    else:
                        data['train_page'] = False
                elif idx == 1:
                    if rec == 'true':
                        data['train_search'] = True
                    else:
                        data['train_search'] = False
                elif idx == 2:
                    if rec == 'true':
                        data['train_passenger'] = True
                    else:
                        data['train_passenger'] = False
                elif idx == 3:
                    if rec == 'true':
                        data['train_review'] = True
                    else:
                        data['train_review'] = False
                elif idx == 4:
                    if rec == 'true':
                        data['train_booking'] = True
                    else:
                        data['train_booking'] = False
                elif idx == 5:
                    data['html'] = rec

            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                    'response': data
                }
            }
        else:
            res = {
                'result': {
                    'error_code': 500,
                    'error_msg': 'file not found',
                    'response': ''
                }
            }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'file not found',
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_notification_airline(request):
    try:
        file = read_cache("notification_airline", 'cache_web', request, 90911)
        if file:
            data = {}
            for idx,rec in enumerate(file.split('\n')):
                if idx == 0:
                    if rec == 'true':
                        data['airline_page'] = True
                    else:
                        data['airline_page'] = False
                elif idx == 1:
                    if rec == 'true':
                        data['airline_search'] = True
                    else:
                        data['airline_search'] = False
                elif idx == 2:
                    if rec == 'true':
                        data['airline_passenger'] = True
                    else:
                        data['airline_passenger'] = False
                elif idx == 3:
                    if rec == 'true':
                        data['airline_review'] = True
                    else:
                        data['airline_review'] = False
                elif idx == 4:
                    if rec == 'true':
                        data['airline_booking'] = True
                    else:
                        data['airline_booking'] = False
                elif idx == 5:
                    data['html'] = rec

            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                    'response': data
                }
            }
        else:
            res = {
                'result': {
                    'error_code': 500,
                    'error_msg': 'file not found',
                    'response': ''
                }
            }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'file not found',
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def youtube_api_check(request):
    ### FITUR TIDAK DAPAT DI PAKAI KARENA PINDAH OAUTH2
    api_key_youtube = ''
    channel_id_youtube = ''
    file = read_cache("youtube", 'cache_web', request, 90911)
    if file:
        for idx, line in enumerate(file.split('\n')):
            if idx == 0 and line != '':
                api_key_youtube = line
            elif idx == 1 and line != '':
                channel_id_youtube = line
    if api_key_youtube != '' and channel_id_youtube != '':
        url_request = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channel_id_youtube + "&eventType=live&type=video&key=" + api_key_youtube
        res = send_request_api(request, url_request, {}, {}, 'GET')
        res = ERR.get_no_error_api(data={'url': '' if len(res['items']) == 0 else res['items'][0]['id']['videoId']})
    else:
        res = ERR.get_no_error_api(data={'url': ''})
    return res
    # https://www.youtube.com/watch?v=2FYm3GOonhk

def add_banner(request):
    try:
        imgData = []

        for i in request.FILES:
            for img in request.FILES.getlist(i):
                if i not in ['fileToUpload', 'fileBackgroundLogin', 'fileBackgroundHome', 'fileBackgroundSearch', 'filelogoicon', 'fileRegistrationBanner', 'image_carousel'] and 'live_chat' not in i:
                    imgData.append({
                        'filename': img.name,
                        'file_reference': img.name,
                        'file': base64.b64encode(img.file.read()).decode('ascii'),
                        'type': i
                    })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "add_banner",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    for img in imgData:
        data = img
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if len(imgData) == 0:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                }
            }
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_banner(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_banner",
            "signature": request.POST['signature'],
        }
        data = {
            'type': request.POST['type']
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    if request.POST['type'] == 'big_banner':
        file = get_banner_data(request, 'big_banner')
    elif request.POST['type'] == 'small_banner':
        file = get_banner_data(request, 'small_banner')
    elif request.POST['type'] == 'promotion':
        file = get_banner_data(request, 'promotion')
    if not file:
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
        try:
            if res['result']['error_code'] == 0:
                if request.POST['type'] == 'big_banner':
                    try:
                        empty_sequence = False
                        last_sequence = 0
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                empty_sequence = True
                            elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']):  # check isi int atau tidak
                                last_sequence = int(rec['sequence'])
                        if empty_sequence:
                            for rec in res['result']['response']:
                                if rec['sequence'] == '':
                                    last_sequence += 1
                                    rec['sequence'] = last_sequence
                        res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                        write_cache(res, "big_banner_cache", request, 'cache_web')
                        _logger.info("big_banner RENEW SUCCESS SIGNATURE " + request.POST['signature'])
                    except Exception as e:
                        _logger.error(
                            'ERROR big banner file \n' + str(e) + '\n' + traceback.format_exc())
                elif request.POST['type'] == 'small_banner':
                    try:
                        empty_sequence = False
                        last_sequence = 0
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                empty_sequence = True
                            elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']):  # check isi int atau tidak
                                last_sequence = int(rec['sequence'])
                        if empty_sequence:
                            for rec in res['result']['response']:
                                if rec['sequence'] == '':
                                    last_sequence += 1
                                    rec['sequence'] = last_sequence
                        res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                        write_cache(res, "small_banner_cache", request, 'cache_web')
                        _logger.info("small_banner RENEW SUCCESS SIGNATURE " + request.POST['signature'])
                    except Exception as e:
                        _logger.error(
                            'ERROR small banner file \n' + str(e) + '\n' + traceback.format_exc())
                elif request.POST['type'] == 'promotion':
                    try:
                        empty_sequence = False
                        last_sequence = 0
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                empty_sequence = True
                            elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']):  # check isi int atau tidak
                                last_sequence = int(rec['sequence'])
                        if empty_sequence:
                            for rec in res['result']['response']:
                                if rec['sequence'] == '':
                                    last_sequence += 1
                                    rec['sequence'] = last_sequence
                        res['result']['response'] = sorted(res['result']['response'],key=lambda k: int(k['sequence']))
                        write_cache(res, "promotion_banner_cache", request, 'cache_web')
                        _logger.info("promotion_banner RENEW SUCCESS SIGNATURE " + request.POST['signature'])
                    except Exception as e:
                        _logger.error(
                            'ERROR promotion banner file \n' + str(e) + '\n' + traceback.format_exc())
                _logger.info("SUCCESS get_banner_content SIGNATURE " + request.POST['signature'])
            else:
                _logger.error("ERROR get_banner_content SIGNATURE " + request.POST['signature'])

        except Exception as e:
            _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    else:
        res = file
    return res

def get_banner_data(request, type):
    if type == "big_banner":
        file = read_cache("big_banner_cache", 'cache_web', request, 86400)
    elif type == "small_banner":
        file = read_cache("small_banner_cache", 'cache_web', request, 86400)
    elif type == "promotion":
        file = read_cache("promotion_banner_cache", 'cache_web', request, 86400)
    else:
        file = False
    return file

def set_inactive_delete_banner(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_inactive_delete_banner",
            "signature": request.POST['signature'],
        }

    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    imgs = json.loads(request.POST['img'])
    for img in imgs:
        data = img
        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if len(imgs) == 0:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                }
            }
        # request.session['signature'] = res['result']['response']['signature']
        # if func == 'get_config':
        #     get_config(request)
        # elif func == 'register':
        #     register(request)
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def create_legder(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "test_ledger",
            "signature": request.POST['signature'],
        }
        data = {
            'value': int(request.POST['value'])
        }

        url_request = get_url_gateway('content')
        res = send_request_api(request, url_request, headers, data, 'POST')
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_top_up_term(request):
    data_template = tt_website.get_data_template(request, 'home')
    text = data_template['top_up_term']
    file = read_cache("top_up_term", 'cache_web', request, 90911)
    if file:
        text = file
    return text

def get_privacy_policy(request):
    try:
        response = []
        file = read_cache("privacy_policy", 'cache_web', request, 90911)
        if file:
            title = ''
            body = ''
            active = ''
            version = 0
            for idx, line in enumerate(file.split('\n')):
                if idx == 0:
                    title = line.split('\n')[0]
                elif idx == 1:
                    body = json.loads(line.split('\n')[0])
                elif idx == 2:
                    active = line.split('\n')[0]
                elif idx == 2:
                    active = line.split('\n')[0]
            response.append({
                "title": title,
                "body": body,
                "active": active,
                "version": version,
            })

        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def set_privacy_policy(request):
    try:
        title = request.POST['title']
        body = request.POST['body']
        active = request.POST['active']
        version = request.POST['version']

        text = title + '\n' + body + '\n' + active + '\n' + version
        write_cache(text, "privacy_policy", request, 'cache_web')

        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        error = "Can't update"
        res = {
            'result': {
                'error_code': 500,
                'error_msg': error,
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_term_and_condition(request):
    try:
        response = []
        file = read_cache("term_and_condition", 'cache_web', request, 90911)
        if file:
            title = ''
            body = ''
            active = ''
            version = 0
            for idx, line in enumerate(file.split('\n')):
                if idx == 0:
                    title = line.split('\n')[0]
                elif idx == 1:
                    body = json.loads(line.split('\n')[0])
                elif idx == 2:
                    active = line.split('\n')[0]
                elif idx == 3:
                    version = line.split('\n')[0]
            response.append({
                "title": title,
                "body": body,
                "active": active,
                "version": version,
            })

        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def set_term_and_condition(request):
    try:
        title = request.POST['title']
        body = request.POST['body']
        active = request.POST['active']
        version = request.POST['version']

        text = title + '\n' + body + '\n' + active + '\n' + version
        write_cache(text, "term_and_condition", request, 'cache_web')

        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        error = "Can't update"
        res = {
            'result': {
                'error_code': 500,
                'error_msg': error,
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res


def get_public_holiday(request):
    try:
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_public_holiday",
            "signature": request.POST['signature'],
        }
        data = {
            'country_id': request.POST['country_id'],
            'start_date': request.POST['start_date'],
            'end_date': request.POST.get('end_date') and request.POST['end_date'] or False,
        }
        file = read_cache("get_holiday_cache", 'cache_web', request, 86400)
        if not file:
            url_request = get_url_gateway('content')
            res = send_request_api(request, url_request, headers, data, 'POST')
            try:
                #tambah datetime
                write_cache(res, "get_holiday_cache", request, 'cache_web')
                _logger.info("get_public_holiday RENEW SUCCESS SIGNATURE " + request.POST['signature'])
            except Exception as e:
                _logger.error('ERROR get_public_holiday file \n' + str(e) + '\n' + traceback.format_exc())
        else:
            try:
                res = file
            except Exception as e:
                _logger.error('ERROR get_holiday_cache file\n' + str(e) + '\n' + traceback.format_exc())
    except Exception as e:
        res = {
            'result': {
                'error_code': -1,
                'error_msg': str(e),
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_dynamic_page(request):
    try:
        response = []
        path = var_log_path(request, 'page_dynamic')
        if not os.path.exists(path):
            os.mkdir(path)
        empty_sequence = False
        last_sequence = 1
        for data in os.listdir('%s/' % path):
            try:
                file = read_cache(data[:-4], "page_dynamic", request, 90911)
                if file:
                    state = ''
                    title = ''
                    body = ''
                    image_carousel = ''
                    sequence = ''
                    for idx, line in enumerate(file.split('\n')):
                        if idx == 0:
                            if line.split('\n')[0] == 'false':
                                state = False
                            else:
                                state = True
                        elif idx == 1:
                            title = line.split('\n')[0]
                        elif idx == 2:
                            #ketemu case jika hanya 1 line saja json dumps nya tidak ada waktu load error jadi sementara tambah try except
                            try:
                                body = json.loads(line.split('\n')[0])
                            except:
                                body = line.split('\n')[0]
                        elif idx == 3:
                            image_carousel = line.split('\n')[0]
                        elif idx == 4:
                            sequence = line.split('\n')[0]
                    response.append({
                        "state": bool(state),
                        "title": title,
                        "body": body,
                        "image_carousel": image_carousel,
                        "sequence": sequence,
                        "url": data.split('.')[0]
                    })
                    try:
                        if sequence != '':
                            if last_sequence < int(sequence):
                                last_sequence = int(sequence)
                        if sequence == '':
                            empty_sequence = True
                    except Exception as e:
                        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
                        empty_sequence = True
            except Exception as e:
                _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        if empty_sequence:
            for page_dynamic_dict in response:
                try:
                    if int(page_dynamic_dict['sequence']):
                        page_dynamic_dict['sequence'] = str(last_sequence)
                except Exception as e:
                    page_dynamic_dict['sequence'] = str(last_sequence)
                    _logger.error(msg=str(e) + '\n' + traceback.format_exc())
                last_sequence += 1
        response = sorted(response, key=lambda k: int(k['sequence']))
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_dynamic_page_detail(request):
    try:
        path = var_log_path(request, 'page_dynamic')
        if not os.path.exists(path):
            os.mkdir(path)
        response = {}
        file = read_cache(request.POST['data'], "page_dynamic", request, 90911)
        if file:
            state = ''
            title = ''
            body = ''
            image_carousel = ''
            for idx, line in enumerate(file.split('\n')):
                if idx == 0:
                    if line.split('\n')[0] == 'false':
                        state = False
                    else:
                        state = True
                elif idx == 1:
                    title = line.split('\n')[0]
                elif idx == 2:
                    body = json.loads(line.split('\n')[0])
                elif idx == 3:
                    image_carousel = line.split('\n')[0]
            response = {
                "state": bool(state),
                "title": title,
                "body": body,
                "image_carousel": image_carousel
            }
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def get_dynamic_page_mobile_detail(request):
    try:
        path = var_log_path(request, 'page_dynamic')
        if not os.path.exists(path):
            os.mkdir(path)
        response = {}
        file = read_cache(request.data['data'], "page_dynamic", request, 90911)
        if file:
            state = ''
            title = ''
            body = ''
            image_carousel = ''
            for idx, line in enumerate(file.split('\n')):
                if idx == 0:
                    if line.split('\n')[0] == 'false':
                        state = False
                    else:
                        state = True
                elif idx == 1:
                    title = line.split('\n')[0]
                elif idx == 2:
                    body = json.loads(line.split('\n')[0])
                elif idx == 3:
                    image_carousel = line.split('\n')[0]
            response = {
                "state": bool(state),
                "title": title,
                "body": body,
                "image_carousel": image_carousel
            }
        res = {
            'result': {
                'error_code': 0,
                'error_msg': '',
                'response': response
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'not found',
                'response': []
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def delete_dynamic_page(request):
    try:
        path = var_log_path(request, 'page_dynamic')
        data = os.listdir(path)
        os.remove('%s/%s.txt' % (path, request.POST['page_url']))
        # check image
        fs = FileSystemStorage()
        fs.location = media_path(request, fs.location,'image_dynamic')
        data = os.listdir(path)
        image_list = []
        for rec in data:
            file = read_cache(rec[:-4], "page_dynamic", request, 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 3:
                        line = line.split('\n')[0]
                        line = line.split('/')
                        line.pop(0) ## ''
                        line.pop(0) ## media
                        line.pop(0) ## image dynamic
                        line = '/'.join(line) ## image
                        image_list.append(line)
        for data in os.listdir(fs.location):
            if not data in image_list:
                os.remove(fs.location + '/' + data)
        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        res = {
            'result': {
                'error_code': 500,
                'error_msg': 'Error Delete',
                'response': ''
            }
        }
    return res

def set_dynamic_page(request):
    try:
        fs = FileSystemStorage()
        fs.location = media_path(request, fs.location, 'image_dynamic')
        path = var_log_path(request, 'page_dynamic')
        if not os.path.exists(path):
            os.mkdir(path)

        filename = ''
        try:
            if request.FILES['image_carousel'].content_type == 'image/jpeg' or request.FILES['image_carousel'].content_type == 'image/png' or request.FILES['image_carousel'].content_type == 'image/png':
                file = request.FILES['image_carousel']
                filename = fs.save(file.name, file)
        except Exception as e:
            _logger.error('no image dynamic page')

        data = os.listdir(path)
        #create new
        title = request.POST['title']
        sequence = request.POST['sequence']
        if int(request.POST['page_number']) == -1: ##new page
            title_duplicate_counter = 0
            trimmed_title_name = re.compile('[\W_]+').sub(' ',title).strip().lower().replace(' ','-') ## trimming non alphanumeric except "-" while replacing spaces to "-"
            while True:
                if trimmed_title_name + '.txt' not in data:
                    break
                else:
                    title_duplicate_counter += 1
                    trimmed_title_name += str(title_duplicate_counter)
            text = request.POST['state'] + '\n' + title + '\n' + request.POST['body'] + '\n' + fs.base_url + request.META['HTTP_HOST'].split(':')[0] + "/image_dynamic/" + filename + '\n' + sequence
            write_cache(text, trimmed_title_name, request, 'page_dynamic')
        #replace page
        else:
            if filename == '':
                file = read_cache("%s" % request.POST['page_url'], "page_dynamic", request, 90911)
                if file:
                    for idx, line in enumerate(file.split('\n')):
                        if idx == 3:
                            text = line.split('\n')[0].split('/')
                            text.pop(0) ## ''
                            text.pop(0) ## media
                            text.pop(0) ## image dynamic
                            text.pop(0) ## domain
                            filename = "/".join(text) ## image
            text = request.POST['state'] + '\n' + title + '\n' + request.POST['body'] + '\n' + fs.base_url + request.META['HTTP_HOST'].split(':')[0] + "/image_dynamic/" + filename + '\n' + sequence
            write_cache(text, "%s" % request.POST['page_url'], request, 'page_dynamic')
        #check image
        data = os.listdir(path)
        image_list = []
        for rec in data:
            file = read_cache(rec[:-4], "page_dynamic", request, 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 3:
                        text = line.split('\n')[0].split('/')
                        text.pop(0)  ## ''
                        text.pop(0)  ## media
                        text.pop(0)  ## image dynamic
                        text.pop(0)  ## domain
                        image_list.append("/".join(text))
        for data in os.listdir(fs.location):
            if not data in image_list:
                os.remove(fs.location + '/' + data)

        res = {
            'result': {
                'error_code': 0,
                'error_msg': 'Success',
                'response': ''
            }
        }
    except Exception as e:
        if int(request.POST['page_number']) == -1:
            error = "Can't create"
        else:
            error = "Can't update"
        res = {
            'result': {
                'error_code': 500,
                'error_msg': error,
                'response': ''
            }
        }
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    return res

def create_reservation_issued_request(request):
    data = {
        'order_number': request.POST['order_number'],
        'table_name': request.POST['table_name']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "create_reservation_issued_request_api",
        "signature": request.POST['signature'],
    }

    url_request = get_url_gateway('content')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS reate_reservation_issued_request SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR create_reservation_issued_request SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_reservation_issued_request(request):
    data = {
        'request_number': request.POST['request_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_reservation_issued_request_api",
        "signature": request.POST['signature'],
    }

    url_request = get_url_gateway('content')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            if res['result']['response'].get('created_date'):
                res['result']['response'].update({
                    'created_date': convert_string_to_date_to_string_front_end_with_time(res['result']['response']['created_date'])
                })
            if res['result']['response'].get('approvals'):
                for app in res['result']['response']['approvals']:
                    if app.get('approved_date'):
                        app.update({
                            'approved_date': convert_string_to_date_to_string_front_end_with_time(app['approved_date'])
                        })
            _logger.info("SUCCESS get_reservation_issued_request SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_reservation_issued_request SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_issued_request_list(request):
    data = {

    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_issued_request_list_api",
        "signature": request.POST['signature'],
    }

    url_request = get_url_gateway('content')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            for rec in res['result']['response']:
                if rec.get('created_date'):
                    rec.update({
                        'created_date': convert_string_to_date_to_string_front_end_with_time(rec['created_date'])
                    })
            _logger.info("SUCCESS get_issued_request_list SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_issued_request_list SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def approve_reservation_issued_request(request):
    data = {
        'request_number': request.POST['request_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "approve_reservation_issued_request_api",
        "signature": request.POST['signature'],
    }

    url_request = get_url_gateway('content')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            if res['result']['response'].get('created_date'):
                res['result']['response'].update({
                    'created_date': convert_string_to_date_to_string_front_end_with_time(res['result']['response']['created_date'])
                })
            if res['result']['response'].get('approvals'):
                for app in res['result']['response']['approvals']:
                    if app.get('approved_date'):
                        app.update({
                            'approved_date': convert_string_to_date_to_string_front_end_with_time(app['approved_date'])
                        })
            _logger.info("SUCCESS approve_reservation_issued_request SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR approve_reservation_issued_request SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def reject_reservation_issued_request(request):
    data = {
        'request_number': request.POST['request_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "reject_reservation_issued_request_api",
        "signature": request.POST['signature'],
    }

    url_request = get_url_gateway('content')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            if res['result']['response'].get('created_date'):
                res['result']['response'].update({
                    'created_date': convert_string_to_date_to_string_front_end_with_time(res['result']['response']['created_date'])
                })
            if res['result']['response'].get('approvals'):
                for app in res['result']['response']['approvals']:
                    if app.get('approved_date'):
                        app.update({
                            'approved_date': convert_string_to_date_to_string_front_end_with_time(app['approved_date'])
                        })
            _logger.info("SUCCESS reject_reservation_issued_request SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR reject_reservation_issued_request SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def cancel_reservation_issued_request(request):
    data = {
        'request_number': request.POST['request_number']
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "cancel_reservation_issued_request_api",
        "signature": request.POST['signature'],
    }

    url_request = get_url_gateway('content')
    res = send_request_api(request, url_request, headers, data, 'POST', 300)
    try:
        if res['result']['error_code'] == 0:
            if res['result']['response'].get('created_date'):
                res['result']['response'].update({
                    'created_date': convert_string_to_date_to_string_front_end_with_time(res['result']['response']['created_date'])
                })
            if res['result']['response'].get('approvals'):
                for app in res['result']['response']['approvals']:
                    if app.get('approved_date'):
                        app.update({
                            'approved_date': convert_string_to_date_to_string_front_end_with_time(app['approved_date'])
                        })
            _logger.info("SUCCESS cancel_reservation_issued_request SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel_reservation_issued_request SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_provider_type_sequence(request):
    provider_types_sequence = []
    file = read_cache("provider_types_sequence", 'cache_web', request, 90911)
    if file:
        provider_types_sequence_file = file
        for rec in provider_types_sequence_file:
            try:
                provider_types_sequence.append({
                    'name': rec,
                    'sequence': provider_types_sequence_file[rec]
                })
            except:
                pass

    # check sequence
    last_sequence = 0
    empty_sequence = False
    for provider_obj in provider_types_sequence:
        try:
            if provider_obj['sequence'] == '':
                empty_sequence = True
            elif isinstance(int(provider_obj['sequence']), int) and last_sequence < int(
                    provider_obj['sequence']):  # check isi int atau tidak
                last_sequence = int(provider_obj['sequence'])
        except:
            provider_obj['sequence'] = ''
            empty_sequence = True
    if empty_sequence:
        for provider_obj in provider_types_sequence:
            if provider_obj['sequence'] == '':
                last_sequence += 1
                provider_obj['sequence'] = str(last_sequence)

    provider_types_sequence = sorted(provider_types_sequence, key=lambda k: int(k['sequence']))

    return {
        "error_code": 0,
        "error_msg": '',
        "response": provider_types_sequence
    }

def get_agent_currency_rate(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_agent_currency_rate",
            "signature": request.POST['signature'],
        }

        url_request = get_url_gateway('content')
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))

    file = read_cache("currency_rate", 'cache_web', request, 86400)
    if file:
        res = file
    else:
        res = send_request_api(request, url_request, headers, data, 'POST', 300)
        try:
            if res['result']['error_code'] == 0:
                write_cache(res, 'currency_rate', request)
                _logger.info("SUCCESS cancel_reservation_issued_request SIGNATURE " + request.POST['signature'])
            else:
                _logger.error(
                    "ERROR cancel_reservation_issued_request SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(
                        res))
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())

    file = read_cache("currency_rate_show", 'cache_web', request, 90911)
    if file:
        res['result'].update(file)
    else:
        res['result']['is_show'] = False
        res['result']['is_show_provider'] = []
    return res

def update_estimate_price(request):
    if request.POST['is_show_estimate_price'] == 'true':
        is_show_estimate_price = True
    else:
        is_show_estimate_price = False
    req = {
        "is_show": is_show_estimate_price,
        "is_show_provider": json.loads(request.POST['provider'])
    }
    write_cache(req, 'currency_rate_show', request)
    if request.POST['is_show_breakdown_price'] == 'true':
        req = True
    else:
        req = False
    write_cache(req, 'show_breakdown_price', request)
    return ERR.get_no_error_api()

