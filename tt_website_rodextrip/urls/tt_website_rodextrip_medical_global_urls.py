from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_medical_global_views as view


urlpatterns.append(path('medical_global/confirm_order/<path:order_number>', view.confirm_order_booking, name="medical_global_confirm_order_booking"))
urlpatterns.append(path('medical_global/booking/<path:order_number>', view.booking, name="medical_global_booking"))
urlpatterns.append(path('medical_global/passenger_edit/<path:order_number>', view.passenger_edit, name="medical_global_passenger_edit"))
urlpatterns.append(path('medical_global/passenger/<path:test_type>', view.passenger, name="medical_global_passenger"))
urlpatterns.append(re_path('medical_global/confirm_order', view.confirm_order, name="medical_global_confirm_order_page"))
urlpatterns.append(re_path('medical_global/review', view.review, name="medical_global_review"))
urlpatterns.append(re_path('medical_global', view.medical, name="medical_global"))

