import json
import logging
import traceback

def get_cache_version():
    try:
        file = open(var_log_path()+"cache_version.txt", "r")
        cache_version = int(file.read())
        file.close()
    except Exception as e:
        logging.getLogger("error_logger").error('ERROR cache_version\n' + str(e) + '\n' + traceback.format_exc())
    return cache_version

def get_cache_data(javascript_version):
    try:
        file = open(var_log_path()+'version' + str(javascript_version) + ".txt", "r")
        for line in file:
            response = json.loads(line)
        file.close()
    except Exception as e:
        logging.getLogger("error_logger").error('ERROR version javascript file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def var_log_path():
    return '/var/log/django/file_cache/'