from .tt_website_header_urls import *
from ..views import tt_website_registration_views as view

urlpatterns.append(re_path('registration/submit', view.register_agent, name="registration_register"))
urlpatterns.append(path('registration/<path:signature>', view.open_page_with_signature, name="registration_with_signature"))
urlpatterns.append(re_path('registration', view.open_page, name="registration"))

