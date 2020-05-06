from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_bills_views as view

urlpatterns.append(path(r'bills/booking/<path:order_number>', view.booking, name="bills_booking"))
urlpatterns.append(re_path('bills/review', view.review, name="bills_review"))
