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
from .tt_webservice import *
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

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'get_printout':
            res = get_printout(request)
        elif req_data['action'] == 'get_list_report_footer':
            res = get_list_report_footer(request)
        elif req_data['action'] == 'set_color_printout_api':
            res = set_color_printout(request)
        elif req_data['action'] == 'update_list_report_footer_api':
            res = update_list_report_footer(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def get_printout(request):
    try:
        provider_type = request.POST['provider_type']
        if provider_type == 'medical':
            if 'PK' in request.POST['order_number']:
                provider_type = 'periksain'
            elif 'PH' in request.POST['order_number']:
                provider_type = 'phc'
            elif 'MD' in request.POST['order_number']:
                provider_type = 'medical'

        data = {
            'order_number': request.POST['order_number'],
            'mode': request.POST['mode'],
            'provider_type': provider_type,
            'is_hide_agent_logo': request.POST.get('is_hide_agent_logo') == 'true' and True or False,
            'bill_name': request.POST['bill_name_to'],
            'bill_address': request.POST['bill_address'],
            'additional_information': request.POST['additional_information'],
            'kwitansi_name': request.POST['kwitansi_name'],
        }
        if request.POST.get('is_dynamic_print'):
            data.update({
                'is_dynamic_print': request.POST['is_dynamic_print'] == 'true' and True or False
            })
        if request.POST.get('included_pax_names'):
            data.update({
                'included_pax_names': json.loads(request.POST['included_pax_names'])
            })
        if request.POST['mode'] == 'itinerary' and request.POST['provider_type'] == 'hotel':
            data.update({
                'json_printout': request.session.get('hotel_json_printout' + request.session['hotel_signature']) and request.session['hotel_json_printout' + request.session['hotel_signature']] or ''
            })
        elif request.POST['mode'] == 'itinerary' and request.POST['provider_type'] == 'activity':
            data.update({
                'json_printout': request.session.get('activity_json_printout' + request.session['activity_signature']) and request.session['activity_json_printout' + request.session['activity_signature']] or ''
            })
        elif request.POST['mode'] == 'itinerary' and request.POST['provider_type'] == 'event':
            data.update({
                'json_printout': request.session.get('event_json_printout' + request.session['event_signature']) and request.session['event_json_printout' + request.session['event_signature']] or ''
            })
        elif request.POST['type'] == 'reschedule':
            data.update({
                "reschedule_number": request.POST['reschedule_number']
            })
        # if request.POST['bill_address'] != '':
        #     bill_address = request.POST['bill_address']
        #     bill_address = bill_address.split('\n')
        #     bill_address = "<br/>".join(bill_address)
        #     data.update({
        #         'bill_address': bill_address
        #     })
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_printout_api",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'printout'
    res = send_request_api(request, url_request, headers, data, 'POST', int(request.POST.get('timeout')) or 60)
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_printout_api_printout " + request.POST['provider_type'] + " SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_printout_api_printout" + request.POST['provider_type'] + " SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def get_list_report_footer(request):
    try:
        data = {

        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_list_report_footer_api",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'printout'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS get_printout_api_printout SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_printout_api_printout SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def set_color_printout(request):
    try:
        data = {
            'color': request.POST['color']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_color_printout_api",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'printout'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            # save color
            text = request.POST['color']
            write_cache(text, 'color_printout', 'cache_web')
            _logger.info("SUCCESS get_printout_api_printout " + request.POST['provider_type'] + " SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("ERROR get_printout_api_printout" + request.POST['provider_type'] + " SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    return res

def update_list_report_footer(request):
    try:
        data = {
            'html': request.POST['html'],
            'code': request.POST['code'],
            'name': request.POST['name']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "set_report_footer_api",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    url_request = url + 'printout'
    res = send_request_api(request, url_request, headers, data, 'POST')

    return res