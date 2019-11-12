from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_visa_views as view


urlpatterns.append(re_path('visa/booking', view.booking, name="visa_booking"))
urlpatterns.append(re_path('visa/passenger', view.passenger, name="visa_passenger"))
urlpatterns.append(re_path('visa/review', view.review, name="visa_review"))
urlpatterns.append(re_path('visa', view.search, name="visa_search"))
