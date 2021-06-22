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
import logging
import traceback
from .tt_webservice_views import *
_logger = logging.getLogger("rodextrip_logger")

from django.core.files.storage import FileSystemStorage
import os
import uuid

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
            res = get_country()
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
        elif req_data['action'] == 'testing_espay_close':
            res = testing_espay_close(request)
        elif req_data['action'] == 'get_top_up_term':
            res = get_top_up_term(request)
        elif req_data['action'] == 'get_booking':
            res = get_booking(request)
        elif req_data['action'] == 'youtube_api':
            res = youtube_api_check(request)
        elif req_data['action'] == 'cancel_payment_method_api':
            res = cancel_payment_method_api(request)
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
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
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
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
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

def get_country():
    javascript_version = get_cache_version()
    response = get_cache_data(javascript_version)
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
    if data_send['date']:
        data_send['date'] = parse_date_time_to_server(data_send['date'])
    if data_send['product'] == 'airline' and data_send['forget_booking'] == True:
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
    res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
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
            _logger.info("SUCCESS get booking b2c SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get booking b2c SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
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
    res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS cancel payment SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR cancel payment SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def youtube_api_check(request):
    api_key_youtube = ''
    channel_id_youtube = ''
    file = read_cache_with_folder_path("youtube", 90911)
    if file:
        for idx, line in enumerate(file.split('\n')):
            if idx == 0 and line != '':
                api_key_youtube = line
            elif idx == 1 and line != '':
                channel_id_youtube = line
    if api_key_youtube != '' and channel_id_youtube != '':
        url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channel_id_youtube + "&eventType=live&type=video&key=" + api_key_youtube
        res = util.send_request(url=url, method='GET')
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
                if i != 'fileToUpload' and i != 'fileBackgroundLogin' and i != 'fileBackgroundHome' and i != 'fileBackgroundSearch' and i != 'filelogoicon' and i != 'fileRegistrationBanner' and i != 'image_carousel':
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
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
    try:
        if len(imgData) == 0:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                }
            }
        pass
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
        file = read_cache_with_folder_path("big_banner_cache", 86400)
    elif request.POST['type'] == 'small_banner':
        file = read_cache_with_folder_path("small_banner_cache", 86400)
    elif request.POST['type'] == 'promotion':
        file = read_cache_with_folder_path("promotion_banner_cache", 86400)
    if not file:
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
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
                        write_cache_with_folder(res, "big_banner_cache")
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
                        write_cache_with_folder(res, "small_banner_cache")
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
                        write_cache_with_folder(res, "promotion_banner_cache")
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
        res = util.send_request(url=url+"content", data=data, headers=headers, method='POST')
    try:
        if len(imgs) == 0:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': '',
                }
            }
        pass
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

        res = util.send_request(url=url + "content", data=data, headers=headers, method='POST')
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
    text = '''
<h6>BANK TRANSFER / CASH</h6>
<li>1. Before you click SUBMIT, please make sure you have inputted the correct amount of TOP UP. If there is a mismatch data, such as the transferred amount/bank account is different from the requested amount/bank account, so the TOP UP will be approved by tomorrow (D+1).<br></li>
<li>2. Bank Transfer / CASH TOP UP can be used on Monday-Sunday: 8 AM - 8 PM (GMT +7)<br></li>
<li>3. Bank Transfer (BCA or Mandiri) auto validate in 15 minutes<br></li>
<h6>National Holiday included</h6>
<h6>For CASH you have to send money to Rodextrip (Jl. Raya Darmo 177 B Surabaya)</h6><br>
<h6>VIRTUAL ACCOUNT</h6>

<li>1. Top Up Transaction from ATM / LLG open for 24 hours. Balance will be added automatically (REAL TIME) after payment. Top up fee will be charged to user and if there's other charge for LLG it will be charged to user too. LLG will be added ± 2 hours from payment.<br><br></li>
<h6>MANDIRI INTERNET BANKING</h6>
<li>1. Transaction Top up from internet banking mandiri open for 24 hours. Balance will be added automatically (REAL TIME) after payment with additional admin Top Up.<br><br></li>
    '''
    file = read_cache_with_folder_path("top_up_term", 90911)
    if file:
        text = file
    return text

def testing_espay_close(request):
    try:
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }
        data = "rq_uuid=b9e04730-19c0-436b-bd72-1c2781fbcce8&rq_datetime=2020-03-27 14:50:25&sender_id=SGOPLUS&receiver_id=SGWRODEXDY&password=SZUWPWRT&comm_code=SGWRODEXDY&member_code=1234521260592585&member_cust_id=SYSTEM&member_cust_name=SYSTEM&ccy=IDR&amount=1887300&debit_from=1234521260592585&debit_from_name=1234521260592585&debit_from_bank=014&credit_to=22222222&credit_to_name=ESPAY&credit_to_bank=014&payment_datetime=2020-03-27 14:50:25&payment_ref=ESP15852925062WFVU&payment_remark=2020-03-27 14:44:17&order_id=AL.20033043065&product_code=BCAATM&product_value=1234521260592585&status=0&total_amount=1887300&tx_key=ESP1585295062WFVU&fee_type=S&tx_fee=0.00&member_id=1234521260592585&approval_code_full_bca=1234521260592585&signature=21e4ad5962820cd5551e861b61ed06d27afa350158dac6fd0e8a7cb348e34056"

        res = util.send_request(url=url + "webhook/payment/espay/notification", data=data, headers=headers, method='POST')
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
        file = read_cache_with_folder_path("get_holiday_cache", 86400)
        if not file:
            res = util.send_request(url=url + "content", data=data, headers=headers, method='POST')
            try:
                #tambah datetime
                write_cache_with_folder(res, "get_holiday_cache")
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
        if not os.path.exists("/var/log/django/page_dynamic"):
            os.mkdir('/var/log/django/page_dynamic')
        for data in os.listdir('/var/log/django/page_dynamic'):
            file = read_cache_without_folder_path("page_dynamic/"+data[:-4], 90911)
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
                response.append({
                    "state": bool(state),
                    "title": title,
                    "body": body,
                    "image_carousel": image_carousel,
                    "url": data.split('.')[0]
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

def get_dynamic_page_detail(request):
    try:
        if not os.path.exists("/var/log/django/page_dynamic"):
            os.mkdir('/var/log/django/page_dynamic')
        response = {}
        file = read_cache_without_folder_path("page_dynamic/" + request.POST['data'], 90911)
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
        data = os.listdir('/var/log/django/page_dynamic')
        os.remove('/var/log/django/page_dynamic/' + data[int(request.POST['page_number'])])
        # check image
        fs = FileSystemStorage()
        fs.location += '/image_dynamic'
        data = os.listdir('/var/log/django/page_dynamic')
        image_list = []
        for rec in data:
            file = read_cache_without_folder_path("page_dynamic/" + rec[:-4], 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 3:
                        line = line.split('\n')[0]
                        line = line.split('/')
                        line.pop(0)
                        line.pop(0)
                        line.pop(0)
                        line = '/'.join(line)
                        image_list.append(line)
        for data in os.listdir(fs.location):
            if not data in image_list:
                os.remove(fs.base_location + '/image_dynamic/' + data)
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
        fs.location += '/image_dynamic'
        if not os.path.exists(fs.location):
            os.mkdir(fs.location)
        if not os.path.exists("/var/log/django/page_dynamic"):
            os.mkdir('/var/log/django/page_dynamic')

        filename = ''
        try:
            if request.FILES['image_carousel'].content_type == 'image/jpeg' or request.FILES['image_carousel'].content_type == 'image/png' or request.FILES['image_carousel'].content_type == 'image/png':
                file = request.FILES['image_carousel']
                filename = fs.save(file.name, file)
        except:
            pass

        data = os.listdir('/var/log/django/page_dynamic')
        #create new
        title = request.POST['title']
        counter = 1
        generate_uuid = ''
        if int(request.POST['page_number']) == -1:
            while True:
                generate_uuid = str(uuid.uuid4()).replace('-', '')
                if generate_uuid + '.txt' not in data:
                    break
            text = request.POST['state'] + '\n' + title + '\n' + request.POST['body'] + '\n' + fs.base_url + "image_dynamic/" + filename
            write_cache(text, "page_dynamic/" + generate_uuid)
        #replace
        else:
            if filename == '':
                file = read_cache_without_folder_path("page_dynamic/" + data[int(request.POST['page_number'])][:-4], 90911)
                if file:
                    for idx, line in enumerate(file.split('\n')):
                        if idx == 3:
                            text = line.split('\n')[0].split('/')
                            text.pop(0)
                            text.pop(0)
                            text.pop(0)
                            filename = "/".join(text)
            # os.remove('/var/log/django/page_dynamic/' + data[int(request.POST['page_number'])])
            text = request.POST['state'] + '\n' + title + '\n' + request.POST['body'] + '\n' + fs.base_url + "image_dynamic/" + filename
            write_cache(text, "page_dynamic/" + data[int(request.POST['page_number'])][:-4])
        #check image
        data = os.listdir('/var/log/django/page_dynamic')
        image_list = []
        for rec in data:
            file = read_cache_without_folder_path("page_dynamic/" + rec[:-4], 90911)
            if file:
                for idx, line in enumerate(file.split('\n')):
                    if idx == 3:
                        text = line.split('\n')[0].split('/')
                        text.pop(0)
                        text.pop(0)
                        text.pop(0)
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
