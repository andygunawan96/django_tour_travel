import json

def get_cache_version():
    file = open(var_log_path()+"cache_version.txt", "r")
    cache_version = int(file.read())
    file.close()
    return cache_version

def get_cache_data(javascript_version):
    file = open(var_log_path()+'version' + str(javascript_version) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()
    return response

def var_log_path():
    return '/var/log/django/file_cache/'