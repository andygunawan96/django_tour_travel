from .tt_website_header_urls import *
from ..views import tt_website_report_view as view

# urlpatterns.append(path('report/<str:type>', view.report_view, name="report_view"))
urlpatterns.append(re_path('report', view.report_view, name="report"))