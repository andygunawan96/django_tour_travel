from .tt_website_header_urls import *
from ..views import tt_website_issued_offline_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(re_path('issued_offline/history', view.issued_offline_history, name="issued_offline_history"))
urlpatterns.append(path('issued_offline/booking/<path:order_number>', view.booking, name="issued_offline_booking"))
urlpatterns.append(re_path('issued_offline', view.issued_offline, name="issued_offline"))