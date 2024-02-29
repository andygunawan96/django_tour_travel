import json
import logging
import traceback
import random
import os, time, re
from tools.parser import *
from datetime import datetime
import requests
from tools import util
from ..static.tt_webservice.url import *
_logger = logging.getLogger("website_logger")

def get_cache_data(request):
    try:
        file = read_cache("version", 'cache_web', request, 90911)
        if file:
            response = file
    except Exception as e:
        _logger.error('ERROR version javascript file\n' + str(e) + '\n' + traceback.format_exc())
    return response

def var_log_path(request, folder_name):
    folder_path = "/var/log/django/"
    _check_folder_exists(folder_path)
    domain = get_domain_cache(request)
    folder_path = "/var/log/django/%s" % domain
    _check_folder_exists(folder_path)
    folder_path += '/file_cache'
    _check_folder_exists(folder_path)
    folder_path += '/%s' % folder_name
    _check_folder_exists(folder_path)
    return folder_path

def var_log_path_global(folder_name):
    folder_path = "/var/log/django"
    _check_folder_exists(folder_path)
    folder_path += '/global'
    _check_folder_exists(folder_path)
    folder_path += '/file_cache'
    _check_folder_exists(folder_path)
    folder_path += '/%s' % folder_name
    _check_folder_exists(folder_path)
    return folder_path

def media_path(request, base_path, folder_name):
    domain = get_domain_cache(request)
    folder_path = "%s/%s" % (base_path, domain)
    _check_folder_exists(folder_path)
    folder_path += "/%s" % folder_name
    return folder_path


def _check_folder_exists(folder_path):
    if not os.path.exists(folder_path):
        try:
            os.mkdir(folder_path)
        except Exception as e:
            _logger.error("Can't create folder %s, %s" % (str(e), traceback.format_exc()))
            raise e

def write_cache(data, file_name, request, folder='cache_web', cache_global=False):
    try:
        ## ISI DATA file_name HANYA NAMA FILE TANPA EXTENSION
        save_res = {}
        date_time = parse_save_cache(datetime.now())
        save_res['datetime'] = date_time
        save_res['data'] = data
        rand_id = str(random.randint(0, 1000))
        if not cache_global:
            folder_path = var_log_path(request, folder)
        else:
            folder_path = var_log_path_global(folder)
        _check_folder_exists(folder_path)
        temp_name = '%s/%s.%s.txt' % (folder_path, file_name, rand_id)
        file_name = '%s/%s.txt' % (folder_path, file_name)
        _file = open(temp_name, 'w+')
        _file.write(json.dumps(save_res))
        _file.close()

        os.rename(temp_name, file_name)
        return True
    except Exception as e:
        return False

def read_cache(file_name, folder, request, time=300, cache_global=False):
    try:
        date_time = datetime.now()
        if not cache_global:
            file = open("%s/%s.txt" % (var_log_path(request, folder), file_name), "r")
        else:
            file = open("%s/%s.txt" % (var_log_path_global(folder), file_name), "r")
        data = file.read()
        file.close()
        if data:
            try:
                res = json.loads(data)
                if res.get('data'):
                    delta_time = date_time - parse_load_cache(res['datetime'])
                    if delta_time.total_seconds() <= time or time == 90911: #### TIME 90911 ULTAH RODEX, TIME TIDAK TERPAKAI, CACHE SELAMANYA
                        return res['data']
                    else:
                        return False
                else:
                    return False
            except:
                # return data data lama sudah terpindah semua, kalau tidak sesuai ambil cache baru
                return False
        else:
            return False
    except Exception as e:
        ## gagal read file tidak ada
        is_read_file = False
        if file_name == 'popular_destination_airline_cache': ## AUTO CREATE FILE
            data = {"UPG": True, "MDC": True, "LOP": True, "KNO": True, "PDG": True, "PLM": True, "PKU": True,
                    "SRI": True, "SRG": True, "SUB": True, "SOC": True, "JOG": True, "CGK": True, "HLP": True,
                    "DPS": True, "BDO": True, "BPN": True, "AMQ": True, "PKY": True, "DJJ": True, "BDJ": True,
                    "KOE": True, "PLW": True, "KDI": True, "SIN": True, "KUL": True, "BKK": True, "PEK": True,
                    "NAY": True, "CAN": True, "HAN": True, "SHA": True, "PVG": True, "HKG": True, "MFM": True,
                    "TSA": True, "TPE": True, "GMP": True, "ICN": True, "DEL": True, "KIX": True, "HND": True,
                    "NRT": True, "LAX": True, "JFK": True, "SFO": True, "YUL": True, "YVR": True, "LCY": True,
                    "LGW": True, "LHR": True, "LTN": True, "SEN": True, "STN": True, "SYD": True, "PER": True,
                    "CBR": True, "FCO": True, "TXL": True, "SXF": True, "BER": True, "FRA": True, "HHN": True,
                    "HAM": True, "MUC": True, "JED": True}
            write_cache(data, "popular_destination_airline_cache", request, 'cache_web')
            is_read_file = True
        elif file_name == 'javascript_version':## AUTO CREATE FILE
            write_cache('1', "javascript_version", request, 'cache_web', True)
            is_read_file = True
        elif file_name == 'cache_version':## AUTO CREATE FILE
            write_cache('1', "cache_version", request, 'cache_web')
            is_read_file = True
        if is_read_file:
            return read_cache(file_name, folder, request, time)
        else:
            return False

def get_credential(request, return_type=''):
    file = read_cache("credential", 'cache_web', request, 90911)
    try:
        if return_type == '':
            if file:
                return file['username'], file['password'], file['api_key']
            else:
                return '', '', ''
        else:
            if file:
                return{
                    "user_name": file['username'],
                    "password": file['password'],
                    "api_key": file['api_key']
                }
            else:
                return {}
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))
        return {}

def get_credential_user_default(request, return_type=''):
    file = read_cache("credential_user_default", 'cache_web', request, 90911)
    if return_type == '':
        if file:
            return file['username'], file['password']
        else:
            return '', ''
    else:
        if file:
            return {
                "user_name": file['username'],
                "password": file['password']
            }
        else:
            return {}

def check_captcha(request):
    try:
        secret_key = ''
        file = read_cache("google_recaptcha", 'cache_web', request, 90911)
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

def delete_cache_file(request, signature):
    folder_path = var_log_path(request, 'cache_session/%s' % request.session['user_account']['co_user_login'])
    for file in os.listdir(folder_path):
        if signature in file:
            os.remove("%s/%s" % (folder_path, file))

def delete_all_cache_file(request):
    try:
        file = read_cache("delete_cache_user", 'cache_web', request, 90911)
        if file:
            delete_cache_user = file
        else:
            delete_cache_user = '2'
        folder_path = var_log_path(request, 'cache_session')
        now = float(datetime.now().strftime("%s"))
        for user_account in os.listdir(folder_path):
            if user_account != '.DS_Store': ## FOLDER OTOMATIS DI MAC BYPASS
                for file in os.listdir("%s/%s" % (folder_path, user_account)):
                    # if os.path.getctime("%s/%s/%s" % (folder_path, user_account, file)) + (86400*2) < now:
                    if os.path.getctime("%s/%s/%s" % (folder_path, user_account, file)) + (86400*int(delete_cache_user)) < now:
                        os.remove("%s/%s/%s" % (folder_path, user_account, file))
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))

def read_cache_file(request, signature, session_key, get_full_data=False, time=False):
    try:
        file = open("%s/%s.txt" % (var_log_path(request, 'cache_session/%s' % request.session['user_account']['co_user_login']), ("%s_%s" % (signature, session_key))), "r")
        data = file.read()
        file.close()
        date_time = datetime.now()
        if data:
            try:
                res = json.loads(data)
                if res.get('data'):
                    if time:
                        delta_time = date_time - parse_load_cache(res['datetime'])
                        if time < delta_time.total_seconds() or time != 90911:  #### TIME 90911 ULTAH RODEX, TIME TIDAK TERPAKAI, CACHE SELAMANYA
                            return False
                    if get_full_data:
                        return res
                    else:
                        return res['data']
                else:
                    return False
            except:
                # return data data lama sudah terpindah semua, kalau tidak sesuai ambil cache baru
                return False
        else:
            return False
    except Exception as e:
        return False

def read_cache_file_by_signature(request, signature, session_key):
    try:
        folder_path = var_log_path(request, 'cache_session')
        now = float(datetime.now().strftime("%s"))
        for user_account in os.listdir(folder_path):
            if user_account != '.DS_Store': ## FOLDER OTOMATIS DI MAC BYPASS
                if "%s_%s.txt" % (signature, session_key) in os.listdir("%s/%s" % (folder_path, user_account)):
                    read_file = open("%s/%s/%s_%s.txt" % (folder_path, user_account, signature, session_key), "r")
                    data = read_file.read()
                    read_file.close()
                    if data:
                        res = json.loads(data)
                        return res['data']
        return False
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))
    return False

def get_list_file_name(request, session_key):
    res_file = []
    for file in os.listdir(var_log_path(request, 'cache_session/%s' % request.session['user_account']['co_user_login'])):
        try:
            if session_key in file:
                res_file.append(file)
        except Exception as e:
            _logger.error("%s, %s" % (str(e), traceback.format_exc()))
    return res_file

def write_cache_file(request, signature, session_key, data, depth = 1):
    try:
        ## ISI DATA file_name HANYA NAMA FILE TANPA EXTENSION
        save_res = {}
        date_time = parse_save_cache(datetime.now())
        save_res['datetime'] = date_time
        save_res['data'] = data
        rand_id = str(random.randint(0, 1000))
        folder_path = var_log_path(request, 'cache_session')
        _check_folder_exists(folder_path)
        folder_path = var_log_path(request, 'cache_session/%s' % request.session['user_account']['co_user_login'])
        _check_folder_exists(folder_path)
        temp_name = '%s/%s.%s.txt' % (folder_path, ("%s_%s" % (signature, session_key)), rand_id)
        file_name = '%s/%s.txt' % (folder_path, ("%s_%s" % (signature, session_key)))
        _file = open(temp_name, 'w+')
        _file.write(json.dumps(save_res))
        _file.close()

        os.rename(temp_name, file_name)
        return True
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))
        if depth < 10:
            write_cache_file(request, signature, session_key, data, depth + 1)

def get_ip_address(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def replace_metacharacter_file_name(file_name, default_name=''):
    if not default_name:
        default_name = file_name
    new_name = "%s" % (re.sub('[^A-za-z0-9 .]', '', default_name)).strip()
    if not '.' in new_name:
        new_name = '%s.%s' % (new_name, file_name.split('.')[-1])
    return new_name

def get_domain_cache(request):
    try:
        folder_path = "/var/log/django/%s/file_cache/cache_web/domain_copy" % (request.META['HTTP_HOST'].split(':')[0])
        file = open("%s.txt" % (folder_path), "r")
        data_domain_cache = file.read()
        file.close()
        if data_domain_cache:
            data_domain_cache = json.loads(data_domain_cache)
            if data_domain_cache.get('data'):
                if data_domain_cache['data'].get('domain'):
                    return data_domain_cache['data']['domain']
    except Exception as e:
        _logger.error("%s, %s" % (str(e), traceback.format_exc()))
    return request.META['HTTP_HOST'].split(':')[0]
