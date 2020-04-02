from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_train_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('train/booking/<path:order_number>', view.booking, name="train_booking"))
urlpatterns.append(re_path('train/seat_map/', view.seat_map, name="train_seat_map"))
urlpatterns.append(re_path('train/review', view.review, name="train_review"))
urlpatterns.append(re_path('train/passenger', view.passenger, name="train_passenger"))
urlpatterns.append(re_path('train', view.search, name="train_search"))