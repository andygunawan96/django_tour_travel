from django.contrib.sessions.models import Session
import time

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