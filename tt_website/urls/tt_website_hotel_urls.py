from .tt_website_header_urls import *
from ..views import tt_website_hotel_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('hotel/booking/<path:order_number>', view.booking, name="hotel_booking"))
urlpatterns.append(path('hotel/detail/<str:id>/<str:signature>', view.detail_with_path, name="hotel_detail_path"))
urlpatterns.append(path('hotel/review/<str:signature>', view.review, name="hotel_review"))
urlpatterns.append(path('hotel/passenger/<str:signature>', view.passengers, name="hotel_passenger"))
urlpatterns.append(path('hotel/detail/', view.detail, name="hotel_detail"))
urlpatterns.append(re_path('hotel/search', view.search, name="hotel_search"))
urlpatterns.append(re_path('hotel', view.hotel, name="hotel"))