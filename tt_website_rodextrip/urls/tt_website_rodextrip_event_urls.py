from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_event_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('event/booking/<path:order_number>', view.booking, name="event_booking"))
urlpatterns.append(re_path('event/review', view.review, name="event_review"))
urlpatterns.append(re_path('event/passenger', view.contact_passengers, name="event_passenger"))
urlpatterns.append(re_path('event/detail', view.detail, name="event_detail"))
urlpatterns.append(re_path('event/vendor', view.vendor, name="event_vendor"))
urlpatterns.append(re_path('event/search', view.search, name="event_search"))
urlpatterns.append(re_path('event', view.event, name="event"))