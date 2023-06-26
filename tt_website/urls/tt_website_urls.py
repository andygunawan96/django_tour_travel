from .tt_website_header_urls import *
from ..views import tt_website_views as view
from ..views import tt_website_activity_views as viewActivity

urlpatterns.append(path(r'page/<slug:data>', view.page, name="dynamic_page"))
urlpatterns.append(path(r'page_mobile/<str:data>', view.page_mobile, name="dynamic_page_mobile"))
urlpatterns.append(path('payment', view.payment, name="payment"))
urlpatterns.append(path('payment/<str:provider>/<str:order_number>', view.payment_method, name="payment_embed_espay"))
urlpatterns.append(path('live_mobile/<str:data>', view.mobile_live, name="mobile_live"))
urlpatterns.append(path('live/<str:data>', view.live, name="live"))
urlpatterns.append(path('currency/<str:data>', view.set_currency, name="currency"))
urlpatterns.append(path('assign_analyst/<str:vendor>', view.assign_analyst, name="assign_analyst"))
urlpatterns.append(path('reservation_request/<str:request_number>', view.get_reservation_request, name="get_reservation_request"))
urlpatterns.append(path('create_passenger/<str:signature>', view.create_passenger_request, name="create_reservation_request"))
urlpatterns.append(re_path('history_transaction', view.history_transaction_ledger, name="history_transaction"))
urlpatterns.append(re_path('setting_footer_printout', view.setting_footer_printout, name="setting_footer_printout"))
urlpatterns.append(re_path('reservation_request', view.reservation_request, name="reservation_request"))
urlpatterns.append(re_path('reservation', view.reservation, name="reservation"))
urlpatterns.append(re_path('page_admin', view.admin, name="admin"))
urlpatterns.append(re_path('testing_chat', view.testing_chat, name="testing_chat"))
urlpatterns.append(re_path('highlight_setting', view.highlight_setting, name="highlight_setting"))
urlpatterns.append(re_path('top_up/history', view.top_up_history, name="top_up_history"))
urlpatterns.append(re_path('top_up', view.top_up, name="top_up"))
urlpatterns.append(re_path('contact_us', view.contact_us, name="contact_us"))
urlpatterns.append(re_path('about_us', view.about_us, name="about_us"))
urlpatterns.append(re_path('faq', view.faq, name="faq"))
urlpatterns.append(re_path('terms', view.terms_and_condition, name="terms_and_condition"))
urlpatterns.append(re_path('policy', view.privacy_policy, name="privacy_policy"))
urlpatterns.append(re_path('login', view.login, name="login"))
urlpatterns.append(re_path('error/credential', view.error_credential, name="error_credential"))
urlpatterns.append(re_path('credential_b2c', view.credential_b2c, name="credential_b2c"))
urlpatterns.append(re_path('credential', view.credential, name="credential"))
# urlpatterns.append(re_path('guide/re_order_phc', view.tutorial_re_order_phc, name="tutorial_re_order_phc"))
# urlpatterns.append(re_path('guide', view.tutorial, name="guide"))
urlpatterns.append(re_path('', view.index, name="index"))

# (?i) buat upper case to lower case bisa detect walaupun uppercase