from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_bills_views as view

urlpatterns.append(path(r'ppob/booking/<path:order_number>', view.booking, name="bills_booking"))
urlpatterns.append(re_path('ppob/review', view.review, name="bills_review"))
urlpatterns.append(re_path('ppob', view.bill, name="bills"))
