from .tt_website_header_urls import *
from ..views import tt_website_insurance_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(path('insurance/booking/<str:order_number>', view.booking, name="insurance_booking"))
urlpatterns.append(path('insurance/review/<str:signature>', view.review, name="insurance_review"))
urlpatterns.append(path('insurance/passenger/<str:signature>', view.passenger, name="insurance_passenger"))
# urlpatterns.append(re_path('activity/detail', view.detail, name="insurance_detail"))
urlpatterns.append(re_path('insurance/search', view.search, name="insurance_search"))
urlpatterns.append(re_path('insurance', view.insurance, name="insurance"))
