from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from tools.parser import *
from datetime import datetime
from ..static.tt_webservice.url import *
import json
import logging
import traceback
_logger = logging.getLogger("rodextrip_logger")
from .tt_webservice_views import *
import time

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'get_top_product_report':
            res = get_report(request)
        elif req_data['action'] == 'get_report_alles':
            res = get_report(request)
        elif req_data['action'] == 'update_chart':
            res = update_report(request)
        elif req_data['action'] == 'get_total_rupiah':
            res = get_total_rupiah(request)
        elif req_data['action'] == 'get_top_up_rupiah':
            res = get_top_up_rupiah(request)
        elif req_data['action'] == 'get_average_rupiah':
            res = get_average_rupiah(request)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def get_report(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_report_json",
        "signature": request.POST['signature']
    }

    # temp_date = datetime.now()
    # start = temp_date.replace(day=1)
    # start_date = datetime.strftime(datetime.now() - timedelta(days=30), '%Y-%m-%d')
    # end_date = datetime.strftime(datetime.now(), '%Y-%m-%d')
    end_date = ''
    start_date = ''
    if datetime.now().strftime('%Y-%m-%d') < request.POST['end_date']:
        end_date = datetime.now().strftime('%Y-%m-%d')
    else:
        end_date = request.POST['end_date']

    if datetime.now().strftime('%Y-%m-%d') < request.POST['start_date']:
        start_date = datetime.now().strftime('%Y-%m-%d')
    else:
        start_date = request.POST['start_date']

    data = {
        # "end_date": end_date,
        # "start_date": start_date,
        "end_date": end_date,
        "start_date": start_date,
        'report_type': request.POST['provider_type'],
        'provider': request.POST['provider'],
        'agent_seq_id': '',
        'agent_type_seq_id': '',
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST', timeout=1000)

    to_return = {
        'raw_data': res,
        'start_date': start_date,
        'end_date': end_date,
    }

    return to_return

def update_report(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_report_json",
        "signature": request.POST['signature']
    }

    end_date = ''
    start_date = ''
    if datetime.now().strftime('%Y-%m-%d') < request.POST['until_date']:
        end_date = datetime.now().strftime('%Y-%m-%d')
    else:
        end_date = request.POST['until_date']

    if datetime.now().strftime('%Y-%m-%d') < request.POST['start_date']:
        start_date = datetime.now().strftime('%Y-%m-%d')
    else:
        start_date = request.POST['start_date']

    data = {
        "start_date": start_date,
        "end_date": end_date,
        'report_type': request.POST['provider_type'],
        'provider': request.POST['provider'],
        'agent_seq_id': request.POST['agent'],
        'agent_type_seq_id': request.POST['agent_type'],
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST', timeout=300)
    to_return = {
        'raw_data': res,
        'start_date': start_date,
        'end_date': end_date,
    }
    return to_return

def get_total_rupiah(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_report_json",
        "signature": request.POST['signature']
    }

    data = {
        "end_date": datetime.strftime(datetime.now(), '%Y-%m-%d'),
        "start_date": datetime.strftime(datetime.now() - timedelta(days=1), '%Y-%m-%d'),
        'report_type': "get_total_rupiah",
        'agent_seq_id': 'Ani',
        'agent_type_seq_id': 'Budi'
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST', timeout=1000)
    return res

def get_top_up_rupiah(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_report_json",
        "signature": request.POST['signature']
    }

    data = {
        "end_date": datetime.strftime(datetime.now(), '%Y-%m-%d'),
        "start_date": datetime.strftime(datetime.now() - timedelta(days=1), '%Y-%m-%d'),
        'report_type': "get_top_up_rupiah",
        'agent_seq_id': 'Ani',
        'agent_type_seq_id': 'Budi'
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST', timeout=1000)
    return res

def get_average_rupiah(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "get_report_json",
        "signature": request.POST['signature']
    }
    data = {
        "end_date": datetime.strftime(datetime.now(), '%Y-%m-%d'),
        "start_date": datetime.strftime(datetime.now() - timedelta(days=1), '%Y-%m-%d'),
        'report_type': "get_average_rupiah",
        'agent_seq_id': 'Ani',
        'agent_type_seq_id': 'Budi'
    }

    res = util.send_request(url=url + 'account', data=data, headers=headers, method='POST', timeout=1000)
    return res