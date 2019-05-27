import pytz
from django.utils.translation import gettext_lazy as _
from django.conf import settings


TIMEZONES = tuple(zip(pytz.all_timezones, pytz.all_timezones))

DESTINATION_TYPE = (
    ('airport', _('Airport')),
    ('train_station', _('Train Station')),
)


def get_config(_key):
    return getattr(settings, _key, None)
