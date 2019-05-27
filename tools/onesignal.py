import requests
import json


def send_notif(msg, url, segments='All', icon=False):
    header = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic MGVjZDRkNTEtZGRmNS00YWJlLTg5NTUtODExNWU0NWI1ZWI0"
    }
    payload = {
        "app_id": "68cb8644-27c1-42b8-861a-eceb9ebc6605",
        "url": url,
        "contents": {
            "en": msg,
        },
        'included_segments': segments,
    }
    if icon:
        payload['chrome_web_icon'] = icon

    # Digunakan untuk User tertentu
    # "include_player_ids": ["6392d91a-b206-4b7b-a620-cd68e32c3a76", "76ece62b-bcfe-468c-8a78-839aeaa8c5fa",
    # "8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86"],

    # "excluded_segments"

    requests.post("https://onesignal.com/api/v1/notifications", headers=header, data=json.dumps(payload))
