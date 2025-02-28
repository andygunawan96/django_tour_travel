"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import url, include
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
import django.views.static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),

]


urlpatterns += i18n_patterns(

    # url(_(r'^admin/'), admin.site.urls),
    url(r'^static/(?P<path>.*)$', django.views.static.serve, {'document_root': settings.STATIC_ROOT, 'show_indexes': settings.DEBUG}),
    url(r'^media(?P<path>.*)$', django.views.static.serve, {'document_root': settings.MEDIA_ROOT}),
    path('webservice', include('tt_webservice.urls')),
    path('', include('tt_website.urls')), #django frontend aja
    # path('tt_base', include('tt_base.urls')),
    # path('activity', include('tt_website_activity.urls')),
    # path('web', include('tt_backend_skytors.urls')),
    # path('', include('tt_website.urls')), #django backend
    # re_path('', website_skytors.index),
    # url('', view_tutorial.website_booking, name="home"),
    prefix_default_language=False,
)

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

handler400 = 'tt_website.views.tt_website_error.handler400'
handler403 = 'tt_website.views.tt_website_error.handler403'
handler404 = 'tt_website.views.tt_website_error.handler404'
handler500 = 'tt_website.views.tt_website_error.handler500'