from .tt_website_header_urls import *
from ..views import tt_website_visa_views as view


urlpatterns.append(path('visa/booking/<path:order_number>', view.booking, name="visa_booking"))
urlpatterns.append(path('visa/passenger/<str:signature>', view.passenger, name="visa_passenger"))
urlpatterns.append(path('visa/review/<str:signature>', view.review, name="visa_review"))
urlpatterns.append(re_path('visa/search', view.search, name="visa_search"))
urlpatterns.append(re_path('visa', view.visa, name="visa"))
