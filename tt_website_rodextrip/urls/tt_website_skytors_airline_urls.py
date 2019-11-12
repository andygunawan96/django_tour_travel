from .tt_website_skytors_header_urls import *
from ..views import tt_website_skytors_airline_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(re_path('airline/booking', view.booking, name="airline_booking"))
urlpatterns.append(re_path('airline/review_after_sales', view.review_after_sales, name="airline_review_after_sales"))
urlpatterns.append(re_path('airline/review', view.review, name="airline_review"))
urlpatterns.append(re_path('airline/seat_map', view.seat_map, name="airline_seat_map"))
urlpatterns.append(re_path('airline/ssr', view.ssr, name="airline_ssr"))
urlpatterns.append(re_path('airline/passenger', view.passenger, name="airline_passenger"))
urlpatterns.append(re_path('airline', view.search, name="airline_search"))