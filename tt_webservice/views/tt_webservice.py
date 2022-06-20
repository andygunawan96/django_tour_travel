from django.contrib.sessions.models import Session
import time
from tools import util, ERR
from datetime import datetime, timedelta
import traceback
import logging
import json
_logger = logging.getLogger("rodextrip_logger")

def set_session(request, session_key, data, depth = 1):
    if session_key in request.session:
        del request.session[session_key]
    time.sleep(0.1)
    request.session[session_key] = data
    try:
        request.session.save()
    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    request.session.modified = True
    if len(Session.objects.filter(session_key=request.session.session_key).all()) > 0:
        if session_key in Session.objects.filter(session_key=request.session.session_key).all()[0].get_decoded():
            pass
    elif depth < 10:
        set_session(request, session_key, data, depth+1)

def del_session(request, session_key):
    if session_key in request.session:
        del request.session[session_key]

def send_request_api(request, url, headers, data, method="POST", timeout=30):
    res = util.send_request(url=url, data=data, headers=headers, method=method, timeout=timeout)
    try:
        if type(request) != dict and type(res) == 'dict':
            _check_expired(request, res)
        else:
            ################ PRINT HASIL YG BUKAN DICT BIAR BISA DI TRACE
            _logger.error('#########################CHECK SEND REQUEST RESPONSE ERROR#####################')
            _logger.error('REQUEST DATA: %s' % json.dumps(res))
            _logger.error('RESPONSE %s' % json.dumps(res))
            _logger.error('#########################END LOGGER#####################')

    except Exception as e:
        _logger.error(str(e) + traceback.format_exc())
    return res

def _check_expired(request, res):
    if res.get('result')['error_code'] == 4003:
        if request.session._session:
            for key in reversed(list(request.session._session.keys())):
                if key != '_language':
                    del request.session[key]

def create_session_product(request, product, timelimit=20): #timelimit product in minutes
    now = datetime.now()
    if request.session.get('session_%s' % product):
        del request.session['session_%s' % product]
    session_product = {
        "start": now.strftime('%Y-%m-%d %H:%M:%S'),
        "end": (datetime.now() + timedelta(minutes=timelimit)).strftime('%Y-%m-%d %H:%M:%S')
    }
    set_session(request, 'session_%s' % product, session_product)

def get_timelimit_product(request, product):
    now = datetime.now()
    session_product = request.session.get('session_%s' % product)
    if session_product:
        end_time = datetime.strptime(session_product['end'], '%Y-%m-%d %H:%M:%S')
        if end_time > now:
            return (end_time - now).seconds #return seconds
        else:
            return 1 # agar langsung ke home kalau 0 di product ada pengecheckan kalau dari path 0
    return 0
