from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_medical_views as view


urlpatterns.append(path('<path:vendor>/booking/<path:order_number>', view.booking, name="medical_booking"))
urlpatterns.append(path('<path:vendor>/passenger/<path:test_type>', view.passenger, name="medical_passenger"))
urlpatterns.append(path('<path:vendor>', view.medical, name="medical"))
urlpatterns.append(re_path('medical/review', view.review, name="medical_review"))
