import json

def get_cache_version():
    file = open(var_log_path()+"javascript_version.txt", "r")
    for idx, line in enumerate(file):
        if idx == 0:
            javascript_version = line.split('\n')[0]
    file.close()
    return javascript_version

def get_cache_data(javascript_version):
    file = open(var_log_path()+'version' + str(javascript_version) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()
    return response

def var_log_path():
    return '/var/log/django/file_cache/'