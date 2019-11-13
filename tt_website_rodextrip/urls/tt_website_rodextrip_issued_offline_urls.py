from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_issued_offline_views as view

# urlpatterns.append(re_path('', view.login, name="login"))
urlpatterns.append(re_path('issued_offline/history', view.issued_offline_history, name="issued_offline_history"))
urlpatterns.append(re_path('issued_offline', view.issued_offline, name="issued_offline"))