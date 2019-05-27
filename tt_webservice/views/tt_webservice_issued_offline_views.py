from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR
from datetime import *
from tools.parser import *
from ..static.tt_webservice.config import *
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
        if req_data['action'] == 'get_data':
            res = get_data(request)
        elif req_data['action'] == 'create_issued_offline':
            res = create_issued_offline(request)
        elif req_data['action'] == 'get_history_issued_offline':
            res = get_history_issued_offline(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)


def get_data(request):
    file = open("version_cache.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()

    file = open(str(file_cache_name) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()

    res = response['result']['response']['issued_offline']
    # res = search2(request)

    return res

def create_issued_offline(request):

    file = open("version_cache.txt", "r")
    for line in file:
        file_cache_name = line
    file.close()

    file = open(str(file_cache_name) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()

    carriers = response['result']['response']['issued_offline']['carrier_id']
    for carrier in carriers:
        if carrier['name'] == request.POST['provider']:
            carrier_id = carrier['id']
            break


    passenger = []
    line = []

    for i in range(int(request.POST['counter_passenger'])):
        passenger.append({'id':int(request.POST['id_passenger'+str(i)])})

    for i in range(int(request.POST['counter_line'])):
        departure = request.POST['line_departure'+str(i)].split('T')
        arrival = request.POST['line_arrival'+str(i)].split('T')
        line.append({
            "origin": request.POST['line_origin'+str(i)].split(' - ')[0],
            "destination": request.POST['line_destination'+str(i)].split(' - ')[0],
            "departure": departure[0]+' '+departure[1],
            "arrival": arrival[0]+' '+arrival[1],
            "carrier_code": request.POST['line_carrier_code'+str(i)],
            "carrier_number": request.POST['line_carrier_number'+str(i)],
            "sub_class": request.POST['line_sub_class'+str(i)],
            "class_of_service": request.POST['line_class_of_service'+str(i)]
        })

    exp_date = request.POST['expired_date'].split('T')

    data = {
        "agent_id": int(request.session['agent']['id']),
        "sub_agent_id": int(request.POST['sub_agent_id']),
        "sub_agent_type": int(request.session['agent']['type_id']),
        "contact_id": int(request.POST['contact_id']),
        "type": request.POST['type'],
        "sector_type": request.POST['sector_type'],
        "total_sale_price": int(request.POST['total_sale_price']),
        "desc": request.POST['desc'],
        "carrier_id": int(carrier_id),
        "provider": request.POST['provider'],
        "pnr": request.POST['pnr'],
        "social_media_id": int(request.POST['social_media_id']),
        "expired_date": exp_date[0]+' '+exp_date[1],
        "co_uid": int(request.session['co_uid']),
        "passenger_ids": passenger,
        "line_ids": line
    }
    headers.update({
        "action": 'create_issued_offline',
        "sid": request.session['agent_sid'],
    })
    res = util.send_request(url=url + "agent/issued_offline", data=data, cookies=request.session['agent_cookie'], headers=headers, method='POST')
    return res

def get_history_issued_offline(request):
    data = {
        "co_uid": int(request.session['co_uid']),
        "offset": int(request.POST['offset']),
        "limit": 80
    }
    headers.update({
        "action": 'get_history_issued_offline',
        "sid": request.session['agent_sid']
    })
    res = util.send_request(url=url + "agent/issued_offline", data=data, cookies=request.session['agent_cookie'], headers=headers, method='POST')
    return res
