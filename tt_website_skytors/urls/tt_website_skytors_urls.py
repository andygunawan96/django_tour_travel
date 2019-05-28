from .tt_website_skytors_header_urls import *
from ..views import tt_website_skytors_views as view

urlpatterns.append(re_path('reservation', view.reservation, name="reservation"))
urlpatterns.append(re_path('top_up/payment', view.top_up_payment, name="top_up_payment"))
urlpatterns.append(re_path('top_up/history', view.top_up_history, name="top_up_history"))
urlpatterns.append(re_path('top_up', view.top_up, name="top_up"))
urlpatterns.append(re_path('web', view.login, name="login"))
urlpatterns.append(re_path('', view.index, name="index"))
# (?i) buat upper case to lower case bisa detect walaupun uppercase