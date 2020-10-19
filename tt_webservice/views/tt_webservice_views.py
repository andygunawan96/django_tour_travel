import json
import logging
import traceback
import random
import os, time
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
        file = read_cache_with_folder_path("version" + str(javascript_version))
        if file:
            response = json.loads(file)
    except Exception as e:
        _logger.error('ERROR version javascript file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def var_log_path():
    return '/var/log/django/file_cache/'

def var_log_path_without_folder():
    return '/var/log/django/'

def write_cache(data, file):
    try:
        rand_id = str(random.randint(0, 1000))
        temp_name = '%s%s.%s.txt' % (var_log_path_without_folder(), file, rand_id)
        file_name = '%s%s.txt' % (var_log_path_without_folder(), file)
        _file = open(temp_name, 'w+')
        _file.write(data)
        _file.close()

        os.rename(temp_name, file_name)
        return True
    except Exception as e:
        return False

def write_cache_with_folder(data, file):
    try:
        rand_id = str(random.randint(0, 1000))
        temp_name = '%s%s.%s.txt' % (var_log_path(), file, rand_id)
        file_name = '%s%s.txt' % (var_log_path(), file)
        _file = open(temp_name, 'w+')
        _file.write(data)
        _file.close()

        os.rename(temp_name, file_name)
        return True
    except Exception as e:
        return False

def read_cache_without_folder_path(file):
    try:
        file = open(var_log_path_without_folder() + "%s.txt" % (file), "r")
        data = file.read()
        file.close()
        return data
    except Exception as e:
        return False

def read_cache_with_folder_path(file):
    try:
        file = open(var_log_path() + "%s.txt" % (file), "r")
        data = file.read()
        file.close()
        return data
    except Exception as e:
        return False