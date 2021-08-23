import requests
import json
from tools import util, ERR
from .tt_webservice_views import *
import logging
_logger = logging.getLogger("rodextrip_logger")

def send_notif(msg, url, segments='All', icon=False):

    file = read_cache_with_folder_path("one_signal", 90911)
    if file:
        url_data = ''
        app_id = file.split('\n')[0]
        if url:
            url_data = url
        else:
            url_data = file.split('\n')[1]
        header = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": file.split('\n')[2]
        }
        payload = {
            "app_id": app_id,
            "url": url_data,
            "contents": {
                "en": msg['contents'],
            },
            'included_segments': segments,
            "headings": {
                "en": msg['headings']
            }
        }
        file = read_cache_with_folder_path("data_cache_template", 90911)
        if file:
            for idx, line in enumerate(file.split('\n')):
                if idx == 11:
                    if line != '':
                        payload['chrome_web_icon'] = line.split('\n')[0]


        # Digunakan untuk User tertentu
        # "include_player_ids": ["6392d91a-b206-4b7b-a620-cd68e32c3a76", "76ece62b-bcfe-468c-8a78-839aeaa8c5fa",
        # "8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86"],

        # "excluded_segments"

        res = requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
        _logger.info(json.dumps(res))
        return {
            "result": {
                "error_code": 0,
                "error_msg": '',
                "response": {}
            }
        }
    else:
        return {
            "result": {
                "error_code": 100,
                "error_msg": 'App Id not found',
                "response": {}
            }
        }