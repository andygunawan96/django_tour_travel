from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_views as view
from ..views import tt_website_rodextrip_activity_views as viewActivity
##HANYA UNTUK FILE PATH YANG DI AKSES SEMUA BIAR TIDAK TERTUMPUK KALAU ADA URL YG TERTUMPUK PAKAI PATH BOLEH DIPINDAH KE SINI
urlpatterns.append(path(r'page/<str:data>', view.page, name="dynamic_page"))
urlpatterns.append(path(r'page_mobile/<str:data>', view.page_mobile, name="dynamic_page_mobile"))
urlpatterns.append(path('payment', view.payment, name="payment"))
urlpatterns.append(path('payment/<str:provider>/<str:order_number>', view.payment_method, name="payment_embed_espay"))
urlpatterns.append(path('live_mobile/<str:data>', view.mobile_live, name="mobile_live"))
urlpatterns.append(path('live/<str:data>', view.live, name="live"))
urlpatterns.append(path('assign_analyst/<str:vendor>', view.assign_analyst, name="assign_analyst"))
urlpatterns.append(path('reservation_request/<str:request_number>', view.get_reservation_request, name="get_reservation_request"))


# (?i) buat upper case to lower case bisa detect walaupun uppercase