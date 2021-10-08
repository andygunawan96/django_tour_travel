from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_lab_pintar_views as view


urlpatterns.append(path('lab_pintar/confirm_order/<path:order_number>', view.confirm_order_booking, name="lab_pintar_confirm_order_booking"))
urlpatterns.append(path('lab_pintar/booking/<path:order_number>', view.booking, name="lab_pintar_booking"))
urlpatterns.append(re_path('lab_pintar/confirm_order', view.confirm_order, name="lab_pintar_confirm_order_page"))
urlpatterns.append(re_path('lab_pintar/passenger', view.passenger, name="lab_pintar_passenger"))
urlpatterns.append(re_path('lab_pintar/review', view.review, name="lab_pintar_review"))
urlpatterns.append(re_path('lab_pintar', view.lab_pintar, name="lab_pintar"))

