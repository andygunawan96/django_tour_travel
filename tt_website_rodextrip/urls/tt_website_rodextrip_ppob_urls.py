from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_ppob_views as view

urlpatterns.append(path(r'ppob/booking/<path:order_number>', view.booking, name="ppob_booking"))
urlpatterns.append(re_path('ppob/review', view.review, name="ppob_review"))
urlpatterns.append(re_path('ppob', view.ppob, name="ppob"))
