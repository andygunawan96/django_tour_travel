from .tt_website_header_urls import *
from ..views import tt_website_bus_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('bus/booking/<path:order_number>', view.booking, name="bus_booking"))
urlpatterns.append(path('bus/seat_map/<str:signature>', view.seat_map, name="bus_seat_map"))
urlpatterns.append(path('bus/review/<str:signature>', view.review, name="bus_review"))
urlpatterns.append(path('bus/passenger/<str:signature>', view.passenger, name="bus_passenger"))
urlpatterns.append(re_path('bus/search', view.search, name="bus_search"))
urlpatterns.append(re_path('bus', view.bus, name="bus"))