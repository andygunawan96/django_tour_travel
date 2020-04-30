from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_tour_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('tour/booking/<path:order_number>', view.booking, name="tour_booking"))
urlpatterns.append(re_path('tour/review', view.review, name="tour_review"))
urlpatterns.append(re_path('tour/passenger', view.passenger, name="tour_passenger"))
urlpatterns.append(re_path('tour/detail', view.detail, name="tour_detail"))
urlpatterns.append(re_path('tour/search', view.search, name="tour_search"))
urlpatterns.append(re_path('tour', view.tour, name="tour"))