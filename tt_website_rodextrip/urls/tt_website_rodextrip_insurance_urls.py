from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_insurance_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('insurance/booking/<str:order_number>', view.booking, name="insurance_booking"))
urlpatterns.append(re_path('insurance/review', view.review, name="insurance_review"))
urlpatterns.append(re_path('insurance/passenger', view.passenger, name="insurance_passenger"))
urlpatterns.append(path('insurance/detail/<path:activity_uuid>', view.detail, name="insurance_detail"))
# urlpatterns.append(re_path('activity/detail', view.detail, name="insurance_detail"))
urlpatterns.append(re_path('insurance/search', view.search, name="insurance_search"))
urlpatterns.append(re_path('insurance', view.insurance, name="insurance"))
