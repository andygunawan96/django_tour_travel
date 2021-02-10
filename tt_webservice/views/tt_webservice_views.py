import json
import logging
import traceback
import random
import os, time
from tools.parser import *
from datetime import datetime
import requests
from tools import util
_logger = logging.getLogger("rodextrip_logger")

def get_cache_version():
    cache_version = 0
    try:
        file = read_cache_with_folder_path("cache_version", 90911)
        if file:
            cache_version = int(file)
    except Exception as e:
        _logger.error('ERROR cache_version\n' + str(e) + '\n' + traceback.format_exc())
    return cache_version

def get_cache_data(javascript_version):
    try:
        file = read_cache_with_folder_path("version" + str(javascript_version), 90911)
        if file:
            response = file
    except Exception as e:
        _logger.error('ERROR version javascript file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def var_log_path():
    return '/var/log/django/file_cache/'

def var_log_path_without_folder():
    return '/var/log/django/'

def write_cache(data, file_name):
    try:
        save_res = {}
        date_time = parse_save_cache(datetime.now())
        save_res['datetime'] = date_time
        save_res['data'] = data
        rand_id = str(random.randint(0, 1000))
        temp_name = '%s%s.%s.txt' % (var_log_path_without_folder(), file_name, rand_id)
        file_name = '%s%s.txt' % (var_log_path_without_folder(), file_name)
        _file = open(temp_name, 'w+')
        _file.write(json.dumps(save_res))
        _file.close()

        os.rename(temp_name, file_name)
        return True
    except Exception as e:
        return False

def write_cache_with_folder(data, file_name):
    try:
        save_res = {}
        date_time = parse_save_cache(datetime.now())
        save_res['datetime'] = date_time
        save_res['data'] = data
        rand_id = str(random.randint(0, 1000))
        temp_name = '%s%s.%s.txt' % (var_log_path(), file_name, rand_id)
        file_name = '%s%s.txt' % (var_log_path(), file_name)
        _file = open(temp_name, 'w+')
        _file.write(json.dumps(save_res))
        _file.close()

        os.rename(temp_name, file_name)
        return True
    except Exception as e:
        return False

def read_cache_without_folder_path(file_name, time=300):
    try:
        date_time = datetime.now()
        file = open(var_log_path_without_folder() + "%s.txt" % (file_name), "r")
        data = file.read()
        file.close()
        if data:
            try:
                res = json.loads(data)
                if res.get('data'):
                    delta_time = date_time - parse_load_cache(res['datetime'])
                    if delta_time.seconds <= time or time == 90911:
                        return res['data']
                    else:
                        return False
                else:
                    return False
            except:
                return data
    except Exception as e:
        return False

def read_cache_with_folder_path(file_name, time=300):
    try:
        date_time = datetime.now()
        file = open(var_log_path() + "%s.txt" % (file_name), "r")
        data = file.read()
        file.close()
        if data:
            try:
                res = json.loads(data)
                if res.get('data'):
                    delta_time = date_time - parse_load_cache(res['datetime'])
                    if delta_time.seconds <= time or time == 90911:
                        return res['data']
                    else:
                        return False
                else:
                    return False
            except:
                return data

    except Exception as e:
        return False


def check_captcha(request):
    try:
        secret_key = ''
        file = read_cache_with_folder_path("google_recaptcha", 90911)
        if file:
            for idx, line in enumerate(file.split('\n')):
                if idx == 2 and line != '':
                    secret_key = line

        # captcha verification
        data = {
            'response': request.POST.get('g-recaptcha-response'),
            'secret': secret_key
        }
        _logger.info(json.dumps(data))
        if secret_key != '':
            if request.session.get('airline_recaptcha'):
                result_json = {
                    'success': True,
                    'additional': 'use cache'
                }
            else:
                resp = requests.post('https://www.google.com/recaptcha/api/siteverify', data=data)
                result_json = resp.json()
            _logger.info(json.dumps(result_json))

            if not result_json.get('success'):
                raise Exception('Make response code 500!')
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        raise Exception('we know you scrap our web, please use our web')
    # end captcha verification