from django.contrib.staticfiles.templatetags.staticfiles import static
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from . import ERR
from .ERR import RequestException
import requests
import json
import uuid
import base64
import logging
import copy

_LOGGER = logging.getLogger(getattr(settings, 'django', __name__))

# In seconds
TIMEOUT = 30

def __init__(self):
    pass

def get_static():
    return static('')


def generate_api_key():
    return str(uuid.uuid4())


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR', '')
    return ip


def get_client_action(request):
    action = request.META.get('HTTP_ACTION', '')
    return action


def get_client_data(request):
    data = request.POST if request.method == 'POST' else request.GET
    if type(data) != dict:
        data = data.dict()
    return data


def get_client_authorization(request):
    action = request.META.get('HTTP_AUTHORIZATION', '')
    return action


def get_api_request_data(request):
    res = {
        'host_ip': get_client_ip(request),
        'data': get_client_data(request),
        'action': get_client_action(request),
        'authorization': get_client_authorization(request),
    }
    return res


def log(message, log_type='info'):
    if log_type == 'info':
        _LOGGER.info(message)
    elif log_type == 'error':
        _LOGGER.error(message)
    else:
        _LOGGER.error('Invalid Log Type')


def get_config(key):
    res = getattr(settings, key, '')
    return res


def encode_api_authorization(username, password, api_key):
    credential = '%s:%s:%s' % (username, password, api_key)
    res = base64.b64encode(credential.encode())
    return res


def decode_api_authorization(key):
    err_msg = 'The Authorization header is not valid.'
    # auth_key = 'Basic '
    # if key.find(auth_key) != 0:
    #     raise Exception(err_msg)
    # code = key[len(auth_key):]
    code = key
    credential = base64.b64decode(code).decode()
    cred = credential.split(':')
    if len(cred) != 3:
        raise Exception(err_msg)
    res = {
        'username': cred[0],
        'password': cred[1],
        'api_key': cred[2],
    }
    return res


def default_headers(data=None):
    data = data and data or {}
    res = {
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'python-requests/2.18.4',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
    }
    res.update(data)
    return res


def send_request(url, data=None, headers=None, cookies=None, method=None, timeout=TIMEOUT):
    ses = requests.Session()
    cookies and [ses.cookies.set(key, val) for key, val in cookies.items()]

    if type(data) == dict:
        data = json.dumps(data)
    else:
        data = data and data or {}
    headers = headers and headers or default_headers()
    if not method:
        method = data and 'POST' or 'GET'
    try:
        response = False
        if method == 'GET':
            response = ses.get(url=url, headers=headers, timeout=timeout)
        elif method == 'POST':
            response = ses.post(url=url, headers=headers, data=data, timeout=timeout)
        if not response:
            return ERR.get_error_api(420)
        status_code = response.status_code
        response.raise_for_status()
    except Exception as e:
        return ERR.get_error_api(500, additional_message=str(e))

    try:
        res = json.loads(response.content)
        res['result'].update({
            'sid': response.headers.get('set-cookie'),
            'cookies': response.cookies.get_dict(),
        })
    except:
        res = ERR.get_no_error_api({'response': response.content})
    return res


def is_authenticated_api(username=None, password=None, api_key=None, auth_key=None, request=None, data={}):
    if auth_key:
        data = decode_api_authorization(auth_key)
        username = data['username']
        password = data['password']
        api_key = data['api_key']

    user = authenticate(username=username, password=password)
    if not user:
        return ERR.get_error_api(1002, additional_message='authorization failed')

    try:
        if not user.credential_id.api_key == api_key:
            return ERR.get_error_api(1002, additional_message='invalid api key')
        if user.credential_id.api_role == 'not_set':
            return ERR.get_error_api(1002, additional_message='api role is not set')
    except:
        return ERR.get_error_api(1002, additional_message='credential is not set')

    if auth_key:
        if not user.credential_id.api_role == 'admin':
            return ERR.get_error_api(1002, additional_message='user authorization is not allowed')
        response = user.credential_id.get_data()
        return ERR.get_no_error_api({'response': response})

    co_user = copy.deepcopy(user)
    if not user.credential_id.api_role in ['operator', 'not_set']:
        if data.get('co_username') and data.get('co_password'):
            co_user = authenticate(username=data['co_username'], password=data['co_password'])
            if not co_user:
                return ERR.get_error_api(1002, additional_message='invalid username/password')

    if not request:
        return ERR.get_error_api(1002, additional_message='request is not set')

    login(request, co_user)
    context = user.credential_id.get_api_data()
    context.update({
        'co_user': co_user.credential_id.get_data()
    })

    access_list = {}
    try:
        access_data = user.credential_id.access_config_ids.all().filter(is_active=True)
        [access_list.update({rec.access_to: rec.get_data()}) for rec in access_data]
    except:
        access_list = {}

    context.update({'access_configs': access_list})
    response = {
        'sid': request.session.session_key,
        'context': context,
    }
    return ERR.get_no_error_api({'response': response})


def api_validator(data, mandatory_fields, mandatory_values):
    if type(data) != dict:
        raise Exception('Data format is not valid.')

    data_keys = [key for key in data.keys()]
    diff_fields = list(set(mandatory_fields).difference(data_keys))
    if diff_fields:
        raise Exception('Missing mandatory field(s) : %s' % ', '.join(diff_fields))

    diff_values = [key for key in mandatory_values if not data[key]]
    if diff_values:
        raise Exception('Missing mandatory field(s) : %s' % ', '.join(diff_values))

    return True
