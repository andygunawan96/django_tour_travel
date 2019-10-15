from django.urls import re_path
from ..views import tt_webservice_agent_views as AgentWebserviceView
from ..views import tt_webservice_account_views as AccountWebserviceView
from ..views import tt_webservice_train_views as TrainWebserviceView
from ..views import tt_webservice_issued_offline_views as IssuedOfflineWebserviceView
from ..views import tt_webservice_activity_views as ActivityWebserviceView
from ..views import tt_webservice_airline_views as AirlineWebserviceView
from ..views import tt_webservice_tour_views as TourWebserviceView
from ..views import tt_webservice_payment as PaymentWebserviceView
from ..views import tt_webservice_hotel_views as HotelWebserviceView
from ..views import tt_webservice_visa_views as VisaWebserviceView
from ..views import tt_webservice_registration_views as RegisterWebserviceView
from ..views import tt_webservice_bca_views as BcaWebserviceView
from ..views import tt_webservice_testing_views as TestWebserviceView
from ..views import tt_webservice_content_views as ContentWebserviceView

app_name = 'tt_webservice'

urlpatterns = [
    re_path('agent', AgentWebserviceView.api_models, name="agent"),
    re_path('account', AccountWebserviceView.api_models, name="account"),
    re_path('payment', PaymentWebserviceView.api_models, name="payment"),
    re_path('train', TrainWebserviceView.api_models, name="train"),
    re_path('activity', ActivityWebserviceView.api_models, name="activity"),
    re_path('issued_offline', IssuedOfflineWebserviceView.api_models, name="issued_offline"),
    re_path('airline', AirlineWebserviceView.api_models, name="airline"),
    re_path('tour', TourWebserviceView.api_models, name="tour"),
    re_path('hotel', HotelWebserviceView.api_models, name="hotel"),
    re_path('registration', RegisterWebserviceView.api_models, name="registration"),
    re_path('visa', VisaWebserviceView.api_models, name="visa"),
    re_path('bca', BcaWebserviceView.api_models, name="bca"),
    re_path('content', ContentWebserviceView.api_models, name="content"),
    re_path('test', TestWebserviceView.api_models, name="test"),
    # url(r'^$', views.index),
]
