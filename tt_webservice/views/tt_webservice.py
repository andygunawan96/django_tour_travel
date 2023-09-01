from django.contrib.sessions.models import Session
import time
from tools import util, ERR
from datetime import datetime, timedelta
import traceback
import logging
import json
from ..static.tt_webservice.url import url
# from .tt_webservice_views import *
_logger = logging.getLogger("website_logger")

def set_session(request, session_key, data, depth = 1):
    if session_key in request.session:
        del request.session[session_key]
    request.session[session_key] = data
    try:
        request.session.save()
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    _logger.info('write cache %s %s try' % (session_key, depth))
    if session_key in request.session:
        _logger.info('Already save session %s' % session_key)
    elif depth < 10:
        set_session(request, session_key, data, depth+1)

def del_session(request, session_key):
    if session_key in request.session:
        del request.session[session_key]

def send_request_api(request, url, headers, data, method="POST", timeout=30):
    res = util.send_request(url=url, data=data, headers=headers, method=method, timeout=timeout)
    try:
        # if type(request) != dict and type(res) == 'dict' and len(res.keys()) > 0:
        if type(request) != dict:
            _check_expired(request, res)
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
        ################ PRINT HASIL YG BUKAN DICT BIAR BISA DI TRACE
        _logger.error('#########################CHECK SEND REQUEST RESPONSE ERROR#####################')
        _logger.error('URL: %s' % url)
        _logger.error('REQUEST DATA: %s' % json.dumps(data))
        _logger.error('RESPONSE %s' % json.dumps(res))
        _logger.error('#########################END LOGGER#####################')
    return res

def _check_expired(request, res):
    if res.get('result')['error_code'] == 4003:
        # if request.session._session and not request.session['keep_me_signin']:
        if request.session._session:
            for key in reversed(list(request.session._session.keys())):
                if key != '_language':
                    del request.session[key]
        ## do re-signin
        # else:
        #     if request.session.get('user_account'):
        #         del request.session['user_account']

def create_session_product(request, product, timelimit=20, signature=''): #timelimit product in minutes
    now = datetime.now()
    if request.session.get('session_%s_%s' % (product, signature)):
        del request.session['session_%s_%s' % (product, signature)]
    session_product = {
        "start": now.strftime('%Y-%m-%d %H:%M:%S'),
        "end": (datetime.now() + timedelta(minutes=timelimit)).strftime('%Y-%m-%d %H:%M:%S')
    }
    # write_cache_file(request, signature, 'session_%s_%s' % (product, signature), session_product)
    set_session(request, 'session_%s_%s' % (product, signature), session_product)

def get_timelimit_product(request, product, signature=''):
    now = datetime.now()
    session_product = request.session.get('session_%s_%s' % (product, signature))
    # session_product_cache = read_cache_file(request, signature, 'session_%s_%s' % (product, signature))
    # if session_product_cache:
    #     end_time = datetime.strptime(session_product['end'], '%Y-%m-%d %H:%M:%S')
    #     if end_time > now:
    #         return (end_time - now).seconds  # return seconds
    #     else:
    #         return 1  # agar langsung ke home kalau 0 di product ada pengecheckan kalau dari path 0
    if session_product:
        end_time = datetime.strptime(session_product['end'], '%Y-%m-%d %H:%M:%S')
        if end_time > now:
            return (end_time - now).seconds #return seconds
        else:
            return 1 # agar langsung ke home kalau 0 di product ada pengecheckan kalau dari path 0
    return 0

def get_url_gateway(path):
    data_path = url
    if data_path[len(data_path)-1] == '/' and path[0] == '/':
        return "%s%s" % (data_path[:-1], path)
    elif data_path[len(data_path)-1] != '/' and path[0] != '/':
        return "%s/%s" % (data_path, path)
    else:
        return "%s%s" % (data_path, path)
