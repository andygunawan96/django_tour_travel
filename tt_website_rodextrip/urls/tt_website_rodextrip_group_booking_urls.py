from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_group_booking_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
# urlpatterns.append(re_path('issued_offline/history', view.issued_offline_history, name="issued_offline_history"))
urlpatterns.append(path('group_booking/booking/<path:order_number>', view.booking, name="group_booking_order_number"))
urlpatterns.append(re_path('group_booking', view.group_booking, name="group_booking"))