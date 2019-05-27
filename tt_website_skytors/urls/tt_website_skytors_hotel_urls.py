from .tt_website_skytors_header_urls import *
from ..views import tt_website_skytors_hotel_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(re_path('hotel/booking', view.detail, name="hotel_booking"))
urlpatterns.append(re_path('hotel/review', view.review, name="hotel_review"))
urlpatterns.append(re_path('hotel/passenger', view.passengers, name="hotel_passenger"))
urlpatterns.append(re_path('hotel/detail', view.detail, name="hotel_detail"))
urlpatterns.append(re_path('hotel', view.search, name="hotel_search"))