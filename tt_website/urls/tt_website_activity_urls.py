from .tt_website_header_urls import *
from ..views import tt_website_activity_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('activity/booking/<str:order_number>', view.booking, name="activity_booking"))
urlpatterns.append(path('activity/review/<str:signature>', view.review, name="activity_review"))
urlpatterns.append(path('activity/passenger/<str:signature>', view.passenger, name="activity_passenger"))
urlpatterns.append(path('activity/detail/<path:activity_uuid>/<str:signature>', view.detail, name="activity_detail"))
# urlpatterns.append(re_path('activity/detail', view.detail, name="activity_detail"))
urlpatterns.append(re_path('activity/search', view.search, name="activity_search"))
urlpatterns.append(re_path('activity', view.activity, name="activity"))
urlpatterns.append(re_path('random', view.search, name=""))
