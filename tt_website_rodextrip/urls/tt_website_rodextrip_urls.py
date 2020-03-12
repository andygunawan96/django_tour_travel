from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_views as view

urlpatterns.append(re_path('reservation', view.reservation, name="reservation"))
urlpatterns.append(re_path('page_admin', view.admin, name="admin"))
urlpatterns.append(re_path('payment', view.payment, name="payment"))
urlpatterns.append(re_path('testing', view.testing, name="testing"))
urlpatterns.append(re_path('highlight_setting', view.highlight_setting, name="highlight_setting"))
urlpatterns.append(re_path('top_up/history', view.top_up_history, name="top_up_history"))
urlpatterns.append(re_path('top_up/quota_pnr', view.top_up_quota_pnr, name="quota_pnr"))
urlpatterns.append(re_path('top_up', view.top_up, name="top_up"))
urlpatterns.append(path(r'page/<slug:data>', view.page, name="dynamic_page"))
urlpatterns.append(re_path('dashboard', view.index, name="index"))
urlpatterns.append(re_path('', view.login, name="login"))
# (?i) buat upper case to lower case bisa detect walaupun uppercase