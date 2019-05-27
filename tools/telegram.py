import requests
from datetime import datetime, timedelta
# import odoo.tools as tools
import logging
_logger = logging.getLogger(__name__)

# ================================================== FOR TESTING ==================================================
# import addons_tour_travel.tools.telegram as test
# =================================================================================================================

# ================================================== USAGE EXAMPLE ================================================
# from ...tools.telegram import TelegramInfoNotification
# data = {
#    'message': 'Insert message here. ex: "Top up request TU.1234567890 From Rodex Darmo"',
#    'notes': 'Insert notes here. ex: url/pnr',
#    'main_title': 'ex: "Top Up"',
# }
# TelegramInfoNotification(data).send_message()
# ================================================================================================================

# ============================================== SEND TO OTHER CATEGORY ==========================================
# TelegramInfoNotification(data).send_message()         => send to operational (default InfoNotification)
# TelegramBalanceNotification(data).send_message()      => send to accounting  (default BalanceNotification)
# TelegramInfoNotification(data).send_message('it')     => send to Group IT. More group see get_category_id
# ================================================================================================================


def get_category_id(category):
    data = {
        'corpor': '-308772730',
        'accounting': '-213376564',
        'operational': '-249494821',
        'it': '-280622663',
        'rodextour': '153958048',
        'rodexb2b': '216699011',
        'vanesa': '527965220',
        'rodexit': '472193982',
    }
    return data.get(category, False)


class TelegramInfoNotification():
    def __init__(self, data={}):
        self.__dict__ = self.__default()
        self.update(data)

    def __default(self):
        return {
            'date': '',
            'main_title': '',
            'message': '',
            'notes': '-',
        }

    def update(self, data):
        self.__dict__.update(data)

    def to_text(self):
        payload = self.__dict__.copy()
        utc = 7
        payload.update({
            'date': get_datetime(utc),
            'main_title': payload['main_title'].upper(),
        })

        res = """
Info - <b>{main_title}</b>
======================
Date : {date}
Message : 
{message}

Notes :
{notes}
""".format(**payload)
        return res

    def send_message(self, category='operational'):
        res = send_notif(self.to_text(), category)
        if res['error_code'] != 0:
            _logger.error('Telegram Info Notification Error: ' + res['error_msg'])


class TelegramErrorNotification():
    def __init__(self, data={}):
        self.__dict__ = self.__default()
        self.update(data)

    def __default(self):
        return {
            'date': '',
            'main_title': '',
            'message': '',
            'notes': '-',
        }

    def update(self, data):
        self.__dict__.update(data)

    def to_text(self):
        payload = self.__dict__.copy()
        utc = 7
        payload.update({
            'date': get_datetime(utc),
            'main_title': payload['main_title'].upper(),
        })

        res = """
Error - <b>{main_title}</b>
======================
Date : {date}
Message : 
{message}

Notes :
{notes}
""".format(**payload)
        return res

    def send_message(self, category='it'):
        res = send_notif(self.to_text(), category)
        if res['error_code'] != 0:
            _logger.error('Telegram Error Notification Error: ' + res['error_msg'])


class TelegramBalanceNotification():
    def __init__(self, data={}):
        self.__dict__ = self.__default()
        self.update(data)

    def __default(self):
        return {
            'date': '',
            'main_title': '',
            'balance': 0,
            'notes': '-',
        }

    def update(self, data):
        self.__dict__.update(data)

    def to_text(self):
        payload = self.__dict__.copy()
        utc = 7
        balance = payload.get('balance', 0)
        payload.update({
            'date': get_datetime(utc),
            'main_title': payload['main_title'].upper(),
            'balance': 'Rp {:,.0f}'.format(balance)
        })

        res = """
Balance - <b>{main_title}</b>
======================
Date : {date}
Balance : {balance}

Notes :
{notes}
""".format(**payload)
        return res

    def send_message(self, category='accounting'):
        res = send_notif(self.to_text(), category)
        if res['error_code'] != 0:
            _logger.error('Telegram Balance Notification Error: ' + res['error_msg'])
            _logger.info(self.to_text())


def send_notif(message, category):
    '''
    :param message: message to be sent
    :param category: accounting for balance, operational for notifications. it for error
    :return:
    '''
    if tools.config.get('telegram_notifications', 'local') == 'local':
        message = 'LOCAL\n\n' + message
        category = 'vanesa'
    res = {
        'error_msg': '',
        'error_code': -1,
        'url': 'https://api.telegram.org/bot540103491:AAFN41QGa9Cf_fm7_GKKGxEBckBt6SbTlYI/sendMessage',
        'response': False,
        'cookie': False
    }
    chat_id = get_category_id(category)
    if not chat_id:
        res.update({
            'error_code': -1,
            'error_msg': 'Category not found',
        })
        return res
    text = split_text(message)

    try:
        for t in text:
            req_post = {'chat_id': chat_id, 'text': t, 'parse_mode': 'HTML'}
            response = requests.post(res['url'], json=req_post)
            if not response.status_code == 200:
                res.update({
                    'error_code': response.status_code,
                    'error_msg': response.text
                })
                return res
            else:
                res.update({
                    'error_code': 0,
                    'error_msg': 'Success'
                })
    except Exception as e:
        res['error_msg'] = str(e)
    return res


def split_text(text):
    result = []
    temp = ''
    for i in text.split('\n'):
        if len(temp) < 4096:
            temp += i + '\n'
        else:
            result.append(temp)
            temp = i + '\n'
    result.append(temp)
    return result


def adjustment_datetime(now_time, hours, minutes, seconds):
    now_time = now_time + timedelta(hours=hours, minutes=minutes, seconds=seconds)
    return now_time


def get_datetime(utc=0):
    now_datetime = datetime.now() + timedelta(hours=utc)
    # adjustment server time
    # now_datetime = adjustment_datetime(now_datetime, 0, 7, 6)
    if utc >= 0:
        utc = '+{}'.format(utc)
    return '{} (GMT{})'.format(now_datetime.strftime('%d-%b-%Y %H:%M:%S'), utc)