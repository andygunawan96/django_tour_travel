from django.contrib.sessions.models import Session
import time
from tools import util, ERR

def set_session(request, session_key, data, depth = 1):
    if session_key in request.session:
        del request.session[session_key]
    time.sleep(0.1)
    request.session[session_key] = data
    try:
        request.session.save()
    except Exception as e:
        pass
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
        if type(request) != dict:
            _check_expired(request, res)
    except Exception as e:
        pass
    return res

def _check_expired(request, res):
    if res.get('result')['error_code'] == 4003:
        if request.session._session:
            for key in reversed(list(request.session._session.keys())):
                if key != '_language':
                    del request.session[key]

