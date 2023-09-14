from .tt_website_header_urls import *
from ..views import tt_website_event_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('event/booking/<path:order_number>', view.booking, name="event_booking"))
urlpatterns.append(path('event/category/<path:category_name>', view.search_category, name="event_category"))
urlpatterns.append(path('event/review/<str:signature>', view.review, name="event_review"))
urlpatterns.append(path('event/passenger/<str:signature>', view.contact_passengers, name="event_passenger"))
urlpatterns.append(path('event/detail/<str:signature>', view.detail, name="event_detail"))
urlpatterns.append(re_path('event/vendor', view.vendor, name="event_vendor"))
urlpatterns.append(re_path('event/search', view.search, name="event_search"))
urlpatterns.append(re_path('event', view.event, name="event"))