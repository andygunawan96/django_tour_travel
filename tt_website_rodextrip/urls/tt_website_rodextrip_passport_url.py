from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_passport_views as view


urlpatterns.append(path('passport/booking/<path:order_number>', view.booking, name="passport_booking"))
urlpatterns.append(re_path('passport/passenger', view.passenger, name="passport_passenger"))
urlpatterns.append(re_path('passport/review', view.review, name="passport_review"))
urlpatterns.append(re_path('passport', view.search, name="passport_search"))
