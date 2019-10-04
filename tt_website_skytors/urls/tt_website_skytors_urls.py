from .tt_website_skytors_header_urls import *
from ..views import tt_website_skytors_views as view

urlpatterns.append(re_path('(?i)reservation', view.reservation, name="reservation"))
urlpatterns.append(re_path('(?i)admin', view.admin, name="admin"))
urlpatterns.append(re_path('(?i)testing', view.testing, name="testing"))
urlpatterns.append(re_path('(?i)top_up/history', view.top_up_history, name="top_up_history"))
urlpatterns.append(re_path('(?i)top_up', view.top_up, name="top_up"))
urlpatterns.append(re_path('(?i)web', view.login, name="login"))
urlpatterns.append(re_path('(?i)', view.index, name="index"))
# (?i) buat upper case to lower case bisa detect walaupun uppercase