import json

def get_cache_version():
    file = open("javascript_version.txt", "r")
    for idx, line in enumerate(file):
        if idx == 0:
            javascript_version = line.split('\n')[0]
    file.close()
    return javascript_version

def get_cache_data(javascript_version):
    file = open('version' + str(javascript_version) + ".txt", "r")
    for line in file:
        response = json.loads(line)
    file.close()
    return response