import json
import logging
import traceback
import random
import os, time
from tools.parser import *
from datetime import datetime
_logger = logging.getLogger("rodextrip_logger")

def get_cache_version():
    cache_version = 0
    try:
        file = read_cache_with_folder_path("cache_version")
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
            res = json.loads('data')
            if res.get('data'):
                delta_time = date_time - parse_load_cache(res['datetime'])
                if delta_time.seconds <= time:
                    return res['data']
                elif time != 90911:
                    return res['data']
                else:
                    return False
            else:
                return res
    except Exception as e:
        return False

def read_cache_with_folder_path(file_name, time=300):
    try:
        date_time = datetime.now()
        file = open(var_log_path() + "%s.txt" % (file_name), "r")
        data = file.read()
        file.close()
        if data:
            res = json.loads(data)
            if res.get('data'):
                delta_time = date_time - parse_load_cache(res['datetime'])
                if delta_time.seconds <= time:
                    return res['data']
                elif time != 90911:
                    return res['data']
                else:
                    return False
            else:
                return res

    except Exception as e:
        return False