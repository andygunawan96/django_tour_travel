from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_views as view

urlpatterns.append(re_path('(?i)reservation', view.reservation, name="reservation"))
urlpatterns.append(re_path('(?i)page_admin', view.admin, name="admin"))
urlpatterns.append(re_path('(?i)payment', view.payment, name="payment"))
urlpatterns.append(re_path('(?i)testing', view.testing, name="testing"))
urlpatterns.append(re_path('(?i)top_up/history', view.top_up_history, name="top_up_history"))
urlpatterns.append(re_path('(?i)top_up', view.top_up, name="top_up"))
urlpatterns.append(re_path('(?i)dashboard', view.index, name="index"))
urlpatterns.append(re_path('(?i)', view.login, name="login"))
# (?i) buat upper case to lower case bisa detect walaupun uppercase