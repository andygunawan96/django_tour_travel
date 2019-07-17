from .tt_website_skytors_header_urls import *
from ..views import tt_website_skytors_registration_views as view

urlpatterns.append(re_path('registration/submit', view.register_agent, name="registration_register"))
urlpatterns.append(re_path('registration', view.open_page, name="registration"))

