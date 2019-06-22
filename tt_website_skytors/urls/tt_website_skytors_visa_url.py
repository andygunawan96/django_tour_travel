from .tt_website_skytors_header_urls import *
from ..views import tt_website_skytors_visa_views as view

urlpatterns.append(re_path('visa', view.search, name="visa_search"))