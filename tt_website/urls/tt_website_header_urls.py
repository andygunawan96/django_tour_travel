from django.urls import path, re_path
from ..views import tt_website_views as view
"""django_training URL Configuration

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

"""
    Access Path : /{HOST_URL}/ ... / ... / ... 
    Example : /destinations/get_destinations_list
"""

HOST_URL = ''

app_name = 'tt_website'

urlpatterns = []


urlpatterns.append(path('signature/<str:signature>/<str:product_type>/<str:page>', view.login_by_signature, name="login_by_signature_bypass_page"))
urlpatterns.append(path('signature/<str:signature>/<str:product_type>', view.login_by_signature, name="login_by_signature_with_product"))
urlpatterns.append(path('signature/<str:signature>', view.login_by_signature, name="login_by_signature"))