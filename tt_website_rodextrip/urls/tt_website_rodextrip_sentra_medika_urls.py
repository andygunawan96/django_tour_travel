from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_sentra_medika_views as view


urlpatterns.append(path('sentra_medika/confirm_order/<path:order_number>', view.confirm_order_booking, name="sentra_medika_confirm_order_booking"))
urlpatterns.append(path('sentra_medika/booking/<path:order_number>', view.booking, name="sentra_medika_booking"))
urlpatterns.append(path('sentra_medika/passenger/<path:test_type>', view.passenger, name="sentra_medika_passenger"))
urlpatterns.append(re_path('sentra_medika/confirm_order', view.confirm_order, name="sentra_medika_confirm_order_page"))
urlpatterns.append(re_path('sentra_medika/review', view.review, name="sentra_medika_review"))
urlpatterns.append(re_path('sentra_medika', view.sentra_medika, name="sentra_medika"))

