from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import *
from tools.parser import *
from ..static.tt_webservice.config import *
from ..static.tt_webservice.url import *
import json

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
    data = {
        # 'agent_id': request.POST['agent_id'],
        # 'booker_id': request.POST['booker_id'],
        'booker_seq_id': "CU.010101",
        # 'order_number': request.session['order_number'],
        # 'order_number': 'AL.19080509118',
        'transaction_type': 'billing',
        'amount': 1000
    }
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_payment_acquirer",
        "signature": request.session['signature'],
    }

    res = util.send_request(url=url + 'content', data=data, headers=headers, method='POST')

    if res['result']['error_code'] == 0:
        pass
    return res