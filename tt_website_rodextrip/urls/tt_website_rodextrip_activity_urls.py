from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_activity_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('activity/booking/<str:order_number>', view.booking, name="activity_booking"))
urlpatterns.append(re_path('activity/review', view.review, name="activity_review"))
urlpatterns.append(re_path('activity/passenger', view.passenger, name="activity_passenger"))
urlpatterns.append(re_path('activity/detail', view.detail, name="activity_detail"))
urlpatterns.append(re_path('activity', view.search, name="activity_search"))
urlpatterns.append(re_path('random', view.search, name=""))
