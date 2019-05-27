from django.urls import path, re_path
from django.contrib.staticfiles.templatetags.staticfiles import static


def generate_path(_host_url, _url, _view):
    return path('%s/%s' % (_host_url, _url), _view)


def generate_re_path(_host_url, _url, _view):
    return re_path(r'^%s/%s' % (_host_url, _url), _view)


def get_static_path(_dic_name=''):
    return static('%s/' % _dic_name)


def get_template_path(_model_name, _template_name):
    return '%s/%s' % (_model_name, _template_name)
