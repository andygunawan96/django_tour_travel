from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.url import *
import json
import logging
import traceback
from .tt_webservice_views import *
_logger = logging.getLogger(__name__)

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

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'get_payment_acquirer':
            res = get_payment_acquirer(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def get_payment_acquirer(request):
    try:
        data = {
            'booker_seq_id': request.POST['booker_seq_id'],
            'order_number': request.POST['order_number'],
            'transaction_type': request.POST['transaction_type'],
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_payment_acquirer",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    if request.POST['type'] == 'airline' or request.POST['type'] == 'airline_review' or request.POST['type'] == 'airline_reissue':
        url_post = 'booking/airline'
    elif request.POST['type'] == 'train':
        url_post = 'booking/train'
    elif request.POST['type'] == 'activity' or request.POST['type'] == 'activity_review':
        url_post = 'booking/activity'
    elif request.POST['type'] == 'registration':
        url_post = 'session/agent_registration'
    elif request.POST['type'] == 'visa':
        url_post = 'booking/visa'
    elif request.POST['type'] == 'passport':
        url_post = 'booking/passport'
    elif request.POST['type'] == 'top_up':
        url_post = 'account'
    elif request.POST['type'] == 'issued_offline':
        url_post = 'booking/issued_offline'
    elif request.POST['type'] == 'hotel_review':
        url_post = 'booking/hotel'
        # data.update({
        #     # 'agent_seq_id': request.POST['agent_seq_id'],
        #     'top_up_name': request.POST['top_up_name']
        # })
    elif request.POST['type'] == 'tour':
        url_post = 'booking/tour'
    res = util.send_request(url=url + url_post, data=data, headers=headers, method='POST')
    try:
        if res['result']['error_code'] == 0:
            logging.getLogger("info_logger").info("SUCCESS get_payment_acquirer_payment " + request.POST['type'] + " SIGNATURE " + request.POST['signature'])
        else:
            logging.getLogger("error_logger").error("ERROR get_payment_acquirer_payment " + request.POST['type'] + " SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        logging.getLogger("error_logger").error(str(e) + '\n' + traceback.format_exc())
    if res['result']['error_code'] == 0:
        pass
    return res