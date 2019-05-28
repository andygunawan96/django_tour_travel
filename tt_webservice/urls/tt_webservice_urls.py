from django.urls import re_path
from ..views import tt_webservice_agent_views as AgentWebserviceView
from ..views import tt_webservice_train_views as TrainWebserviceView
from ..views import tt_webservice_issued_offline_views as IssuedOfflineWebserviceView
from ..views import tt_webservice_activity_views as ActivityWebserviceView
from ..views import tt_webservice_airline_views as AirlineWebserviceView
from ..views import tt_webservice_tour_views as TourWebserviceView
from ..views import tt_webservice_hotel_views as HotelWebserviceView

app_name = 'tt_webservice'

urlpatterns = [
    re_path('/agent', AgentWebserviceView.api_models, name="agent"),
    re_path('/train', TrainWebserviceView.api_models, name="train"),
    re_path('/activity', ActivityWebserviceView.api_models, name="activity"),
    re_path('/issued_offline', IssuedOfflineWebserviceView.api_models, name="issued_offline"),
    re_path('/airline', AirlineWebserviceView.api_models, name="airline"),
    re_path('/tour', TourWebserviceView.api_models, name="tour"),
    re_path('/hotel', HotelWebserviceView.api_models, name="hotel"),
    # url(r'^$', views.index),
]
