from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_mitra_keluarga_views as view


urlpatterns.append(path('mitra_keluarga/confirm_order/<path:order_number>', view.confirm_order_booking, name="mitra_keluarga_confirm_order_booking"))
urlpatterns.append(path('mitra_keluarga/booking/<path:order_number>', view.booking, name="mitra_keluarga_booking"))
urlpatterns.append(path('mitra_keluarga/passenger/<path:test_type>', view.passenger, name="mitra_keluarga_passenger"))
urlpatterns.append(re_path('mitra_keluarga/confirm_order', view.confirm_order, name="mitra_keluarga_confirm_order_page"))
urlpatterns.append(re_path('mitra_keluarga/review', view.review, name="mitra_keluarga_review"))
urlpatterns.append(re_path('mitra_keluarga', view.mitra_keluarga, name="mitra_keluarga"))

