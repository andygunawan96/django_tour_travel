from .tt_website_header_urls import *
from ..views import tt_website_tour_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('tour/booking/<path:order_number>', view.booking, name="tour_booking"))
urlpatterns.append(path('tour/review/<str:signature>', view.review, name="tour_review"))
urlpatterns.append(path('tour/passenger/<str:signature>', view.passenger, name="tour_passenger"))
urlpatterns.append(path('tour/detail/<path:tour_code>/<str:signature>', view.detail, name="tour_detail"))
urlpatterns.append(path('tour/detail/<path:tour_code>', view.detail_without_signature, name="tour_detail_without_signature"))
# urlpatterns.append(re_path('tour/detail', view.detail, name="tour_detail"))
urlpatterns.append(re_path('tour/search', view.search, name="tour_search"))
urlpatterns.append(re_path('tour', view.tour, name="tour"))