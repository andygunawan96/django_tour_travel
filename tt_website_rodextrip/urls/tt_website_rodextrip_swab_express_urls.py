from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_swab_express_views as view


urlpatterns.append(path('swab_express/confirm_order/<path:order_number>', view.confirm_order_booking, name="swab_express_confirm_order_booking"))
urlpatterns.append(path('swab_express/booking/<path:order_number>', view.booking, name="swab_express_booking"))
urlpatterns.append(path('swab_express/passenger/<path:test_type>', view.passenger, name="swab_express_passenger"))
urlpatterns.append(re_path('swab_express/confirm_order', view.confirm_order, name="swab_express_confirm_order_page"))
urlpatterns.append(re_path('swab_express/review', view.review, name="swab_express_review"))
urlpatterns.append(re_path('swab_express', view.swab_express, name="swab_express"))

