from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_event_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
# urlpatterns.append(path('hotel/booking/<path:order_number>', view.booking, name="hotel_booking"))
# urlpatterns.append(re_path('hotel/review', view.review, name="hotel_review"))
# urlpatterns.append(re_path('hotel/passenger', view.passengers, name="hotel_passenger"))
# urlpatterns.append(re_path('hotel/detail', view.detail, name="hotel_detail"))
# urlpatterns.append(re_path('hotel/det_static', view.detail_static, name="hotel_detail_static"))
urlpatterns.append(re_path('event/search', view.search, name="event_search"))
urlpatterns.append(re_path('event', view.event, name="event"))