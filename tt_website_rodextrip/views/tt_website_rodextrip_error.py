from django.shortcuts import render, redirect
from .tt_website_rodextrip_views import *
import logging
_logger = logging.getLogger("rodextrip_logger")
MODEL_NAME = 'tt_website_rodextrip'

def handler400(request, *args, **argv):
    values = get_data_template(request, 'login')
    javascript_version = get_javascript_version()
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account'),
    })
    logger_error_path(request)
    return render(request, MODEL_NAME + '/error/404.html', {})

def handler403(request, *args, **argv):
    values = get_data_template(request, 'login')
    javascript_version = get_javascript_version()
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account'),
    })
    logger_error_path(request)
    return render(request, MODEL_NAME + '/error/404.html', {})

def handler404(request, *args, **argv):
    values = get_data_template(request, 'login')
    javascript_version = get_javascript_version()
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account'),
    })
    logger_error_path(request)
    return render(request, MODEL_NAME + '/error/404.html', {})

def handler500(request, *args, **argv):
    values = get_data_template(request, 'login')
    javascript_version = get_javascript_version()
    values.update({
        'static_path': path_util.get_static_path(MODEL_NAME),
        'javascript_version': javascript_version,
        'static_path_url_server': get_url_static_path(),
        'username': request.session.get('user_account'),
    })
    logger_error_path(request)
    return render(request, MODEL_NAME + '/error/500.html', values)

def logger_error_path(request):
    _logger.error("ERROR path " + request.path)
