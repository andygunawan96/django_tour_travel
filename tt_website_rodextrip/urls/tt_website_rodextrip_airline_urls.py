from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_airline_views as view

urlpatterns.append(path(r'airline/booking/<path:order_number>/refund', view.refund, name="airline_refund"))
urlpatterns.append(path(r'airline/booking/<path:order_number>', view.booking, name="airline_booking"))
urlpatterns.append(path('airline/ssr/<str:signature>', view.ssr, name="airline_ssr"))
urlpatterns.append(path('airline/seat_map/<str:signature>', view.seat_map, name="airline_seat_map"))
urlpatterns.append(path('airline/review/<str:signature>', view.review, name="airline_review"))
urlpatterns.append(path('airline/passenger/<str:signature>', view.passenger, name="airline_passenger"))
urlpatterns.append(path('airline/passenger/aftersales/<str:signature>', view.passenger_aftersales, name="airline_passenger_aftersales"))
urlpatterns.append(path(r'airline/public/<str:signature>', view.seat_map_public, name="airline_public_seat_map"))
urlpatterns.append(path('airline/review_after_sales/<str:signature>', view.review_after_sales, name="airline_review_after_sales"))
urlpatterns.append(re_path('airline/search', view.search, name="airline_search"))
urlpatterns.append(re_path('airline', view.airline, name="airline"))