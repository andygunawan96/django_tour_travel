from .tt_website_rodextrip_header_urls import *
from ..views import tt_website_rodextrip_views as view
from ..views import tt_website_rodextrip_activity_views as viewActivity

urlpatterns.append(path(r'page/<str:data>', view.page, name="dynamic_page"))
urlpatterns.append(path('payment', view.payment, name="payment"))
urlpatterns.append(path('payment/<slug:provider>/<str:order_number>', view.payment_method, name="payment_embed_espay"))
urlpatterns.append(re_path('reservation', view.reservation, name="reservation"))
urlpatterns.append(re_path('page_admin', view.admin, name="admin"))
urlpatterns.append(re_path('testing_chat', view.testing_chat, name="testing_chat"))
urlpatterns.append(re_path('testing', view.testing, name="testing"))
urlpatterns.append(re_path('highlight_setting', view.highlight_setting, name="highlight_setting"))
urlpatterns.append(re_path('top_up/history', view.top_up_history, name="top_up_history"))
urlpatterns.append(re_path('top_up/quota_pnr', view.top_up_quota_pnr, name="quota_pnr"))
urlpatterns.append(re_path('top_up', view.top_up, name="top_up"))
urlpatterns.append(re_path('contact_us', view.contact_us, name="contact_us"))
urlpatterns.append(re_path('about_us', view.about_us, name="about_us"))
urlpatterns.append(re_path('faq', view.faq, name="faq"))
urlpatterns.append(re_path('dashboard', view.index, name="index"))
urlpatterns.append(re_path('', view.login, name="login"))
# (?i) buat upper case to lower case bisa detect walaupun uppercase