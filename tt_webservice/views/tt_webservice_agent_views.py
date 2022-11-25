from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from tools import util, ERR, parser
from datetime import datetime
from ..static.tt_webservice.url import *
from dateutil.relativedelta import *
import json
from .tt_webservice_views import *
from .tt_webservice import *
from ..views import tt_webservice_airline_views as airline
import re
import logging
import traceback
import copy

_logger = logging.getLogger("rodextrip_logger")

month = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}

alpha3_country_codes = {
    "ALA": "Aland Islands",
    "ALB": "Albania",
    "DZA": "Algeria",
    "ASM": "American Samoa",
    "AND": "Andorra",
    "AGO": "Angola",
    "AIA": "Anguilla",
    "ATA": "Antarctica",
    "ATG": "Antigua and Barbuda",
    "ARG": "Argentina",
    "ARM": "Armenia",
    "ABW": "Aruba",
    "AUS": "Australia",
    "AUT": "Austria",
    "AZE": "Azerbaijan",
    "BHS": "Bahamas",
    "BHR": "Bahrain",
    "BGD": "Bangladesh",
    "BRB": "Barbados",
    "BLR": "Belarus",
    "BEL": "Belgium",
    "BLZ": "Belize",
    "BEN": "Benin",
    "BMU": "Bermuda",
    "BTN": "Bhutan",
    "BOL": "Bolivia",
    "BES": "Bonaire, Sint Eustatius and Saba",
    "BIH": "Bosnia and Herzegovina",
    "BWA": "Botswana",
    "BVT": "Bouvet Island",
    "BRA": "Brazil",
    "IOT": "British Indian Ocean Territory",
    "BRN": "Brunei Darussalam",
    "BGR": "Bulgaria",
    "BFA": "Burkina Faso",
    "BDI": "Burundi",
    "KHM": "Cambodia",
    "CMR": "Cameroon",
    "CAN": "Canada",
    "CPV": "Cape Verde",
    "CYM": "Cayman Islands",
    "CAF": "Central African Republic",
    "TCD": "Chad",
    "CHL": "Chile",
    "CHN": "China",
    "CXR": "Christmas Island",
    "CCK": "Cocos (Keeling) Islands",
    "COL": "Colombia",
    "COM": "Comoros",
    "COG": "Congo",
    "COD": "Democratic Republic of the Congo",
    "COK": "Cook Islands",
    "CRI": "Costa Rica",
    "CIV": "Cote d'Ivoire",
    "HRV": "Croatia",
    "CUB": "Cuba",
    "CUW": "Curaçao",
    "CYP": "Cyprus",
    "CZE": "Czechia",
    "DNK": "Denmark",
    "DJI": "Djibouti",
    "DMA": "Dominica",
    "DOM": "Dominican Republic",
    "ECU": "Ecuador",
    "EGY": "Egypt",
    "SLV": "El Salvador",
    "GNQ": "Equatorial Guinea",
    "ERI": "Eritrea",
    "EST": "Estonia",
    "ETH": "Ethiopia",
    "FLK": "Falkland Islands (Malvinas)",
    "FRO": "Faroe Islands",
    "FJI": "Fiji",
    "FIN": "Finland",
    "FRA": "France",
    "GUF": "French Guiana",
    "PYF": "French Polynesia",
    "ATF": "French Southern Territories",
    "GAB": "Gabon",
    "GMB": "Gambia",
    "GEO": "Georgia",
    "DEU": "Germany",
    "GHA": "Ghana",
    "GIB": "Gibraltar",
    "GRC": "Greece",
    "GRL": "Greenland",
    "GRD": "Grenada",
    "GLP": "Guadeloupe",
    "GUM": "Guam",
    "GTM": "Guatemala",
    "GGY": "Guernsey",
    "GIN": "Guinea",
    "GNB": "Guinea-Bissau",
    "GUY": "Guyana",
    "HTI": "Haiti",
    "HMD": "Heard and Mc Donald Islands",
    "VAT": "Holy See (Vatican City State)",
    "HND": "Honduras",
    "HKG": "Hong Kong",
    "HUN": "Hungary",
    "ISL": "Iceland",
    "IND": "India",
    "IDN": "Indonesia",
    "IRN": "Iran, Islamic Republic of",
    "IRQ": "Iraq",
    "IRL": "Ireland",
    "IMN": "Isle of Man",
    "ISR": "Israel",
    "ITA": "Italy",
    "JAM": "Jamaica",
    "JPN": "Japan",
    "JEY": "Jersey",
    "JOR": "Jordan",
    "KAZ": "Kazakstan",
    "KEN": "Kenya",
    "KIR": "Kiribati",
    "PRK": "Korea, Democratic People's Republic of",
    "KOR": "Korea, Republic of",
    "XKX": "Kosovo (temporary code)",
    "KWT": "Kuwait",
    "KGZ": "Kyrgyzstan",
    "LAO": "Lao, People's Democratic Republic",
    "LVA": "Latvia",
    "LBN": "Lebanon",
    "LSO": "Lesotho",
    "LBR": "Liberia",
    "LBY": "Libyan Arab Jamahiriya",
    "LIE": "Liechtenstein",
    "LTU": "Lithuania",
    "LUX": "Luxembourg",
    "MAC": "Macao",
    "MKD": "Macedonia, The Former Yugoslav Republic Of",
    "MDG": "Madagascar",
    "MWI": "Malawi",
    "MYS": "Malaysia",
    "MDV": "Maldives",
    "MLI": "Mali",
    "MLT": "Malta",
    "MHL": "Marshall Islands",
    "MTQ": "Martinique",
    "MRT": "Mauritania",
    "MUS": "Mauritius",
    "MYT": "Mayotte",
    "MEX": "Mexico",
    "FSM": "Micronesia, Federated States of",
    "MDA": "Moldova, Republic of",
    "MCO": "Monaco",
    "MNG": "Mongolia",
    "MNE": "Montenegro",
    "MSR": "Montserrat",
    "MAR": "Morocco",
    "MOZ": "Mozambique",
    "MMR": "Myanmar",
    "NAM": "Namibia",
    "NRU": "Nauru",
    "NPL": "Nepal",
    "NLD": "Netherlands",
    "NCL": "New Caledonia",
    "NZL": "New Zealand",
    "NIC": "Nicaragua",
    "NER": "Niger",
    "NGA": "Nigeria",
    "NIU": "Niue",
    "NFK": "Norfolk Island",
    "MNP": "Northern Mariana Islands",
    "NOR": "Norway",
    "OMN": "Oman",
    "PAK": "Pakistan",
    "PLW": "Palau",
    "PSE": "Palestinian Territory, Occupied",
    "PAN": "Panama",
    "PNG": "Papua New Guinea",
    "PRY": "Paraguay",
    "PER": "Peru",
    "PHL": "Philippines",
    "PCN": "Pitcairn",
    "POL": "Poland",
    "PRT": "Portugal",
    "PRI": "Puerto Rico",
    "QAT": "Qatar",
    "SRB": "Republic of Serbia",
    "REU": "Reunion",
    "ROU": "Romania",
    "RUS": "Russia Federation",
    "RWA": "Rwanda",
    "BLM": "Saint Barthélemy",
    "SHN": "Saint Helena",
    "KNA": "Saint Kitts & Nevis",
    "LCA": "Saint Lucia",
    "MAF": "Saint Martin",
    "SPM": "Saint Pierre and Miquelon",
    "VCT": "Saint Vincent and the Grenadines",
    "WSM": "Samoa",
    "SMR": "San Marino",
    "STP": "Sao Tome and Principe",
    "SAU": "Saudi Arabia",
    "SEN": "Senegal",
    "SYC": "Seychelles",
    "SLE": "Sierra Leone",
    "SGP": "Singapore",
    "SXM": "Sint Maarten",
    "SVK": "Slovakia",
    "SVN": "Slovenia",
    "SLB": "Solomon Islands",
    "SOM": "Somalia",
    "ZAF": "South Africa",
    "SGS": "South Georgia & The South Sandwich Islands",
    "SSD": "South Sudan",
    "ESP": "Spain",
    "LKA": "Sri Lanka",
    "SDN": "Sudan",
    "SUR": "Suriname",
    "SJM": "Svalbard and Jan Mayen",
    "SWZ": "Swaziland",
    "SWE": "Sweden",
    "CHE": "Switzerland",
    "SYR": "Syrian Arab Republic",
    "TWN": "Taiwan, Province of China",
    "TJK": "Tajikistan",
    "TZA": "Tanzania, United Republic of",
    "THA": "Thailand",
    "TLS": "Timor-Leste",
    "TGO": "Togo",
    "TKL": "Tokelau",
    "TON": "Tonga",
    "TTO": "Trinidad and Tobago",
    "TUN": "Tunisia",
    "TUR": "Turkey",
    "XTX": "Turkish Rep N Cyprus (temporary code)",
    "TKM": "Turkmenistan",
    "TCA": "Turks and Caicos Islands",
    "TUV": "Tuvalu",
    "UGA": "Uganda",
    "UKR": "Ukraine",
    "ARE": "United Arab Emirates",
    "GBR": "United Kingdom",
    "USA": "United States",
    "UMI": "United States Minor Outlying Islands",
    "URY": "Uruguay",
    "UZB": "Uzbekistan",
    "VUT": "Vanuatu",
    "VEN": "Venezuela",
    "VNM": "Vietnam",
    "VGB": "Virgin Islands (British)",
    "VIR": "Virgin Islands (USA)",
    "WLF": "Wallis and Futuna",
    "ESH": "Western Sahara",
    "YEM": "Yemen",
    "ZMB": "Zambia",
    "ZWE": "Zimbabwe"
}

@api_view(['GET', 'POST'])
def api_models(request):
    try:
        req_data = util.get_api_request_data(request)
        if req_data['action'] == 'signin':
            res = signin(request)
        elif req_data['action'] == 'signin_btc':
            res = signin_btc(request)
        elif req_data['action'] == 'delete_session':
            res = delete_session(request)
        elif req_data['action'] == 'static_path_url_server':
            res = get_url_static_path()
        elif req_data['action'] == 'get_customer_list':
            res = get_customer_list(request)
        elif req_data['action'] == 'update_cache_data':
            res = update_cache_data(request)
        elif req_data['action'] == 'update_cache_image':
            res = update_cache_image(request)
        elif req_data['action'] == 'create_customer':
            res = create_customer(request)
        elif req_data['action'] == 'update_customer':
            res = update_customer(request)
        elif req_data['action'] == 'update_customer_list':
            res = update_customer_list(request)
        elif req_data['action'] == 'get_automatic_booker':
            res = get_automatic_booker(request)
        elif req_data['action'] == 'add_passenger_cache':
            res = add_passenger_cache(request)
        elif req_data['action'] == 'del_passenger_cache':
            res = del_passenger_cache(request)
        elif req_data['action'] == 'get_passenger_cache':
            res = get_passenger_cache(request)
        elif req_data['action'] == 'get_customer_parent':
            res = get_customer_parent(request)
        elif req_data['action'] == 'activate_corporate_mode':
            res = activate_corporate_mode(request)
        elif req_data['action'] == 'deactivate_corporate_mode':
            res = deactivate_corporate_mode(request)
        elif req_data['action'] == 'read_idcard_img_to_text':
            res = read_idcard_img_to_text(request)
        else:
            res = ERR.get_error_api(1001)
    except Exception as e:
        res = ERR.get_error_api(500, additional_message=str(e))
    return Response(res)

def signin(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signin",
        "signature": ''
    }

    data = {
        "user": user_global,
        "password": password_global,
        "api_key":  api_key,

        "co_user": request.POST.get('username') or user_default,
        "co_password": request.POST.get('password') or password_default,
        # "co_user": user_default,  # request.POST['username'],
        # "co_password": password_default, #request.POST['password'],
        # "co_uid": ""
    }
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 10)
    try:
        if res['result']['error_code'] == 0:
            for key in reversed(list(request.session._session.keys())):
                if key != '_language':
                    del request.session[key]
            request.session.create()
            request.session.set_expiry(3 * 60 * 60)  # jam detik menit
            set_session(request, 'signature', res['result']['response']['signature'])
            set_session(request, 'username', request.POST.get('username') or user_default)
            set_session(request, 'password', request.POST.get('password') or password_default)

            if request.POST.get('keep_me_signin') == 'true':
                set_session(request, 'keep_me_signin', True)
            else:
                set_session(request, 'keep_me_signin', False)
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_account",
                "signature": res['result']['response']['signature']
            }
            url_request = url + 'account'
            res_user = send_request_api(request, url_request, headers, data, 'POST')
            # pakai kalo template PER USER
            # user_template = UserTemplate().get_data_by_id(request.POST['username'], True) #true buat rodextrip false buat tors
            # res_user['result']['response'].update({
            #     'logo_url': user_template.logo_url,
            #     'name': user_template.name,
            #     'template': user_template.template_id,
            #     'desc': user_template.desc
            # })
            if 'login' in res_user['result']['response']['co_agent_frontend_security']:
                set_session(request, 'user_account', res_user['result']['response'])
                try:
                    if res['result']['error_code'] == 0:
                        data = {}
                        headers = {
                            "Accept": "application/json,text/html,application/xml",
                            "Content-Type": "application/json",
                            "action": "get_provider_type_list",
                            "signature": res['result']['response']['signature']
                        }
                        url_request = url + 'content'
                        provider_type = send_request_api(request, url_request, headers, data, 'POST')
                        try:
                            if provider_type['result']['error_code'] == 0:
                                provider_type_list = []
                                for provider in provider_type['result']['response']['provider_type_list']:
                                    provider_type_list.append(provider['code'])
                                set_session(request, 'provider', provider_type_list)
                            else:
                                # request.session['provider'] = ['airline', 'train', 'visa', 'activity', 'tour', 'hotel']
                                set_session(request, 'provider', [])
                        except:
                            set_session(request, 'provider', [])
                        _logger.info("SIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
                        response = get_cache_data()

                        res['result']['response'].update({
                            # 'visa': response['result']['response']['visa'],
                            # 'issued_offline': response['result']['response']['issued_offline'],
                            # 'train': response['result']['response']['train'],
                            'activity': response['result']['response']['activity'],
                            'tour': response['result']['response']['tour'],
                            'airline': response['result']['response']['airline'],
                            # 'hotel_config': response['result']['response']['hotel_config'],
                        })
                        logging.getLogger("info_logger").error("SUCCESS SIGNIN USE CACHE IN TXT!")
                except Exception as e:
                    get_new_cache(res['result']['response']['signature'])
                    request.session.create()
            else:
                res_user['result']['error_code'] = 500
                res_user['result']['error_msg'] = 'Permission Denied'
                _logger.error('ERROR NO FRONTEND PERMISSION LOGIN' + json.dumps(res))

        else:
            _logger.error('ERROR SIGNIN_agent SOMETHING WHEN WRONG ' + json.dumps(res))

    except Exception as e:
        _logger.error('ERROR SIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    try:
        return res_user
    except:
        if res['result']['error_code'] == 4002:
            res['result']['error_msg'] = 'User and password is not match'
            return res
        else:
            return res

def delete_session(request):
    request.session.set_expiry(0)
    request.session.modified = True
    if request.session._session:
        for key in reversed(list(request.session._session.keys())):
            if key != '_language':
                del request.session[key]
    return 0

def signin_btc(request):
    headers = {
        "Accept": "application/json,text/html,application/xml",
        "Content-Type": "application/json",
        "action": "signin",
        "signature": ''
    }

    try:
        data = {
            "user": user_global,
            "password": password_global,
            "api_key":  api_key,

            "co_user": request.POST.get('username') or user_default,
            "co_password": request.POST.get('password') or password_default,
            # "co_user": user_default,  # request.POST['username'],
            # "co_password": password_default, #request.POST['password'],
            # "co_uid": ""
        }
    except Exception as e:
        _logger.error('ERROR get user or password for btc login\n' + str(e) + '\n' + traceback.format_exc())
    if request.POST.get('g-recaptcha-response'):
        check_captcha(request)
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST', 10)
    try:
        if res['result']['error_code'] == 0:
            request.session.create()
            request.session.set_expiry(3 * 60 * 60)  # jam detik menit
            set_session(request, 'signature', res['result']['response']['signature'])
            set_session(request, 'username', request.POST.get('username') or user_default)
            set_session(request, 'password', request.POST.get('password') or password_default)
            if request.POST.get('keep_me_signin') == 'true':
                set_session(request, 'keep_me_signin', True)
            elif request.POST.get('keep_me_signin') == 'false':
                set_session(request, 'keep_me_signin', False)
            else:
                set_session(request, 'keep_me_signin', True) #default b2c
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_account",
                "signature": res['result']['response']['signature']
            }
            url_request = url + 'account'
            res_user = send_request_api(request, url_request, headers, data, 'POST')
            # pakai kalo template PER USER
            # user_template = UserTemplate().get_data_by_id(request.POST['username'], True) #true buat rodextrip false buat tors
            # res_user['result']['response'].update({
            #     'logo_url': user_template.logo_url,
            #     'name': user_template.name,
            #     'template': user_template.template_id,
            #     'desc': user_template.desc
            # })
            res_user['result']['response']['signature'] = res['result']['response']['signature']
            if "login" in res_user['result']['response']['co_agent_frontend_security']:
                set_session(request, 'user_account', res_user['result']['response'])
            try:
                if res['result']['error_code'] == 0:
                    data = {}
                    headers = {
                        "Accept": "application/json,text/html,application/xml",
                        "Content-Type": "application/json",
                        "action": "get_provider_type_list",
                        "signature": res['result']['response']['signature']
                    }
                    url_request = url + 'content'
                    provider_type = send_request_api(request, url_request, headers, data, 'POST')
                    try:
                        if provider_type['result']['error_code'] == 0:
                            provider_type_list = []
                            for provider in provider_type['result']['response']['provider_type_list']:
                                provider_type_list.append(provider['code'])
                            set_session(request, 'provider', provider_type_list)
                        else:
                            # request.session['provider'] = ['airline', 'train', 'visa', 'activity', 'tour', 'hotel']
                            set_session(request, 'provider', [])
                    except:
                        set_session(request, 'provider', [])
                    _logger.info("SIGNIN SUCCESS SIGNATURE " + res['result']['response']['signature'])
                    javascript_version = get_cache_version()
                    response = get_cache_data()

                    res['result']['response'].update({
                        # 'visa': response['result']['response']['visa'],
                        # 'issued_offline': response['result']['response']['issued_offline'],
                        # 'train': response['result']['response']['train'],
                        'activity': response['result']['response']['activity'],
                        'tour': response['result']['response']['tour'],
                        'airline': response['result']['response']['airline'],
                        # 'hotel_config': response['result']['response']['hotel_config'],
                    })
                    logging.getLogger("info_logger").error("SUCCESS SIGNIN USE CACHE IN TXT!")
            except:
                get_new_cache(res['result']['response']['signature'])
        else:
            _logger.error('ERROR SIGNIN_agent SOMETHING WHEN WRONG ' + json.dumps(res))

    except Exception as e:
        _logger.error('ERROR SIGNIN\n' + str(e) + '\n' + traceback.format_exc())
        # pass
        # # logging.getLogger("error logger").error('testing')
        # _logger.error(msg=str(e) + '\n' + traceback.format_exc())
    try:
        res_user['result']['response']['provider'] = provider_type_list
        return res_user
    except:
        return res

def get_new_cache(signature, type='all'):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_data_gateway",
            "signature": signature
        }
        url_request = url + 'content'
        send_request_api({}, url_request, headers, data, 'POST', 1) ## timeout 1, fungsi ini hanya untuk bantu gateway ambil data terbaru kalau frontend update cache data

        if type == 'all' or type == 'data':
            logging.getLogger("info_logger").error("ERROR GENERATE NEW CACHE!")
            # airline
            data = {'provider_type': 'airline'}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_destinations",
                "signature": signature
            }
            url_request = url + 'content'
            res_destination_airline = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_destination_airline['result']['error_code'] == 0:
                    res_destination_airline = res_destination_airline['result']['response']
                else:
                    res_destination_airline = False
                    _logger.info("ERROR GET CACHE FROM DESTINATION TRAIN AUTOCOMPLETE " + json.dumps(res_destination_airline) + '\n' + traceback.format_exc())
            except Exception as e:
                res_destination_airline = False
                _logger.info("ERROR GET CACHE FROM HOTEL SEARCH AUTOCOMPLETE " + json.dumps(res_destination_airline) + '\n' + str(e) + '\n' + traceback.format_exc())
            data = {'provider_type': 'train'}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_destinations",
                "signature": signature
            }
            url_request = url + 'content'
            res_destination_train = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                destination_train = []
                if res_destination_train['result']['error_code'] == 0:
                    for country in res_destination_train['result']['response']:
                        for destination in country['destinations']:
                            destination_train.append({
                                'name': destination['name'],
                                'code': destination['code'],
                                'country': country['name'],
                                'city': destination['city']
                            })
                    write_cache(destination_train, "train_cache_data", 'cache_web')
                else:
                    _logger.info("ERROR GET CACHE FROM TRAIN SEARCH AUTOCOMPLETE " + json.dumps(res_destination_train)  + '\n' + traceback.format_exc())
            except Exception as e:
                _logger.info("ERROR GET CACHE FROM TRAIN SEARCH AUTOCOMPLETE " + json.dumps(res_destination_train) + '\n' + str(e) + '\n' + traceback.format_exc())

            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_countries",
                "signature": signature
            }
            url_request = url + 'content'
            res_country_airline = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_country_airline['result']['error_code'] == 0:
                    res_country_airline = res_country_airline['result']['response']
                else:
                    res_country_airline = False
                    _logger.info("ERROR GET CACHE FROM COUNTRY AIRLINE AUTOCOMPLETE " + json.dumps(res_country_airline) + '\n' + traceback.format_exc())
            except Exception as e:
                res_country_airline = False
                _logger.info("ERROR GET CACHE FROM COUNTRY AIRLINE AUTOCOMPLETE " + json.dumps(res_country_airline) + '\n' + str(e) + '\n' + traceback.format_exc())
            # hotel
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search_autocomplete",
                "signature": signature
            }

            data = {
                "name": '',
                "limit": 999999999999
            }
            url_request = url + 'booking/hotel'
            res_cache_hotel = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res_cache_hotel['result']['error_code'] == 0:
                    write_cache(json.loads(res_cache_hotel['result']['response']), "hotel_cache_data", 'cache_web')
            except Exception as e:
                _logger.info("ERROR GET CACHE FROM HOTEL SEARCH AUTOCOMPLETE " + json.dumps(res_cache_hotel) + '\n' + str(e) + '\n' + traceback.format_exc())

            # visa odoo12
            data = {
                'provider': 'rodextrip_visa'
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature
            }
            url_request = url + 'booking/visa'
            res_config_visa = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_config_visa['result']['error_code'] == 0:
                    res_config_visa = res_config_visa['result']['response']
                else:
                    res_config_visa = False
                    _logger.info("ERROR GET CACHE FROM VISA AUTOCOMPLETE " + json.dumps(res_config_visa) + '\n' + traceback.format_exc())
            except Exception as e:
                res_config_visa = False
                _logger.info("ERROR GET CACHE FROM VISA AUTOCOMPLETE " + json.dumps(res_config_visa) + '\n' + str(e) + '\n' + traceback.format_exc())
            #

            # passport odoo12
            data = {
                'provider': 'rodextrip_passport'
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature
            }
            url_request = url + 'booking/passport'
            res_config_passport = send_request_api({}, url_request, headers, data, 'POST', 60)

            try:
                if res_config_passport['result']['error_code'] == 0:
                    res_config_passport = res_config_passport['result']['response']
                else:
                    res_config_passport = False
                    _logger.info(
                        "ERROR GET CACHE FROM PASSPORT AUTOCOMPLETE " + json.dumps(res_config_passport) + '\n' + traceback.format_exc())
            except Exception as e:
                res_config_passport = False
                _logger.info(
                    "ERROR GET CACHE FROM VISA AUTOCOMPLETE " + json.dumps(res_config_passport) + '\n' + str(e) + '\n' + traceback.format_exc())
            #

            # issuedoffline
            data = {
                'provider': 'rodextrip_issued_offline'
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature
            }
            url_request = url + 'booking/issued_offline'
            res_config_issued_offline = send_request_api({}, url_request, headers, data, 'POST', 60)
            try:
                if res_config_issued_offline['result']['error_code'] == 0:
                    res_config_issued_offline = res_config_issued_offline['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM ISSUED OFFLINE AUTOCOMPLETE " + json.dumps(res_config_issued_offline) + '\n' + traceback.format_exc())
                    res_config_issued_offline = False
            except Exception as e:
                res_config_issued_offline = False
                _logger.info("ERROR GET CACHE FROM ISSUED OFFLINE AUTOCOMPLETE " + json.dumps(res_config_issued_offline) + '\n' + str(e) + '\n' + traceback.format_exc())
            # return res

            url_request = url + 'booking/airline'
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_frequent_flyer_all_data",
                "signature": signature,
            }
            data = {}
            ff_request = send_request_api({}, url_request, headers, data, 'POST', 300)
            try:
                if ff_request['result']['error_code'] == 0:
                    write_cache(ff_request['result']['response'], "frequent_flyer_data", 'cache_web')
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())

            # activity
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature
            }
            url_request = url + 'booking/activity'
            res_config_activity = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res_config_activity['result']['error_code'] == 0:
                    res_config_activity = res_config_activity['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM ACTIVITY " + json.dumps(res_config_activity) + '\n' + traceback.format_exc())
                    res_config_activity = False
            except Exception as e:
                res_config_activity = False
                _logger.info("ERROR GET CACHE FROM ACTIVITY " + json.dumps(res_config_activity) + '\n' + str(e) + '\n' + traceback.format_exc())

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search_autocomplete",
                "signature": signature
            }

            data = {
                "name": '',
                "limit": 9999
            }
            url_request = url + 'booking/activity'
            res_cache_activity = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res_cache_activity['result']['error_code'] == 0:
                    write_cache(res_cache_activity['result']['response'], "activity_cache_data", 'cache_web')
            except Exception as e:
                _logger.info(
                    "ERROR GET CACHE FROM ACTIVITY SEARCH AUTOCOMPLETE " + json.dumps(res_cache_activity) + '\n' + str(
                        e) + '\n' + traceback.format_exc())

            # tour
            data = {}
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature,
            }
            url_request = url + 'booking/tour'
            res_config_tour = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res_config_tour['result']['error_code'] == 0:
                    res_config_tour = res_config_tour['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_config_tour) + '\n' + traceback.format_exc())
                    res_config_tour = False
            except Exception as e:
                res_config_tour = False
                _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_config_tour) + '\n' + str(e) + '\n' + traceback.format_exc())

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "search_autocomplete",
                "signature": signature
            }

            data = {
                "name": '',
                "limit": 9999
            }
            url_request = url + 'booking/tour'
            res_cache_tour = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res_cache_tour['result']['error_code'] == 0:
                    write_cache(res_cache_tour['result']['response'], "tour_cache_data", 'cache_web')
            except Exception as e:
                _logger.info(
                    "ERROR GET CACHE FROM TOUR SEARCH AUTOCOMPLETE " + json.dumps(res_cache_tour) + '\n' + str(
                        e) + '\n' + traceback.format_exc())

            #ppob
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_config",
                "signature": signature
            }

            data = {}

            url_request = url + 'booking/ppob'
            res_cache_ppob = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res_cache_ppob['result']['error_code'] == 0:
                    res_cache_ppob = res_cache_ppob['result']['response']
                else:
                    _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_cache_ppob) + '\n' + traceback.format_exc())
                    res_cache_ppob = False
            except Exception as e:
                res_cache_ppob = False
                _logger.info("ERROR GET CACHE FROM TOUR " + json.dumps(res_cache_ppob) + '\n' + str(e) + '\n' + traceback.format_exc())

            res = {
                'result': {
                    'response': {
                        'visa': res_config_visa,
                        'passport': res_config_passport,
                        'issued_offline': res_config_issued_offline,  # belum di install
                        # 'train': res_origin_train['result']['response'],
                        'activity': res_config_activity,
                        'tour': res_config_tour,
                        'airline': {
                            'country': res_country_airline,
                            'destination': res_destination_airline
                        },
                        'ppob': res_cache_ppob
                    }
                }

            }

            # cache airline popular
            file = read_cache("popular_destination_airline_cache", 'cache_web', 90911)
            if file:
                popular_airline = file
                popular = []
                average = []
                for country in res_destination_airline:
                    for destination in country['destinations']:
                        try:
                            if popular_airline.get(destination['code']) == True:
                                popular.append({
                                    'name': destination['name'],
                                    'code': destination['code'],
                                    'city': destination['city'],
                                    'country': country['name']
                                })
                            else:
                                average.append({
                                    'name': destination['name'],
                                    'code': destination['code'],
                                    'city': destination['city'],
                                    'country': country['name']
                                })
                        except:
                            average.append({
                                'name': destination['name'],
                                'code': destination['code'],
                                'city': destination['city'],
                                'country': country['name']
                            })
            popular = popular + average

            write_cache(popular, "airline_destination", 'cache_web')
            write_cache(res, "version", 'cache_web')

            # cache tanggal libur
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_public_holiday",
                "signature": signature,
            }
            data = {
                'country_id': 100,
                'start_date': datetime.now().strftime('%Y-%m-%d'),
                'end_date': (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d'),
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            write_cache(res, "get_holiday_cache", 'cache_web')
            # remove cache airline
            try:
                os.remove("/var/log/django/file_cache/cache_web/get_list_provider.txt")
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
            try:
                os.remove("/var/log/django/file_cache/cache_web/get_list_provider_data.txt")
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
            try:
                os.remove("/var/log/django/file_cache/cache_web/get_airline_carriers.txt")
                airline.get_carriers('', signature)
            except:
                airline.get_carriers('', signature)
            try:
                os.remove("/var/log/django/file_cache/cache_web/get_airline_active_carriers.txt")
                airline.get_carriers_search('', signature)
            except:
                airline.get_carriers_search('', signature)

            try:
                file = open("tt_webservice/static/tt_webservice/phc_city.json", "r")
                data_kota = json.loads(file.read())
                file.close()
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
                data_kota = {}
            provider = 'phc'
            additional_url = 'booking/'
            additional_url += 'phc'
            data = {
                'provider': provider
            }
            action = 'get_config_vendor'
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    res['result']['response']['kota'] = data_kota
                    write_cache(res, "medical_cache_data_%s" % provider, 'cache_web')
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE medical " + provider + ' ' + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())

            try:
                file = open("tt_webservice/static/tt_webservice/periksain_city.json", "r")
                data_kota = json.loads(file.read())
                file.close()
            except:
                data_kota = {}
            provider = 'periksain'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    res['result']['response'] = {
                        "carriers_code": res['result']['response'],
                        "kota": data_kota
                    }
                    write_cache(res, "medical_cache_data_%s" % provider, 'cache_web')
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE medical " + provider + ' ' + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())

            provider = 'medical'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    write_cache(res, "medical_global_cache_data", 'cache_web')
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE medical " + provider + ' ' + json.dumps(res) + '\n' + str(e) + '\n' + traceback.format_exc())

            provider = 'swabexpress'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    write_cache(res, "swab_express_cache_data", 'cache_web')
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE swab express " + provider + ' ' + json.dumps(res) + '\n' + str(
                    e) + '\n' + traceback.format_exc())

            provider = 'labpintar'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    write_cache(res, "lab_pintar_cache_data", 'cache_web')
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE lab pintar " + provider + ' ' + json.dumps(res) + '\n' + str(
                    e) + '\n' + traceback.format_exc())

            provider = 'mitrakeluarga'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    response = copy.deepcopy(res)
                    response['result']['response'] = {}
                    # HOMECARE DULUAN
                    for rec in res['result']['response']:
                        if 'HC' in rec:
                            response['result']['response'][rec] = res['result']['response'][rec]
                    for rec in res['result']['response']:
                        if rec not in response['result']['response']:
                            response['result']['response'][rec] = res['result']['response'][rec]
                    write_cache(response, "mitra_keluarga_cache_data", 'cache_web')
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE mitra keluarga " + provider + ' ' + json.dumps(res) + '\n' + str(
                    e) + '\n' + traceback.format_exc())

            provider = 'sentramedika'
            additional_url = 'content'
            data = {
                'provider_type': provider
            }
            action = "get_carriers"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": action,
                "signature": signature
            }
            url_request = url + additional_url
            res = send_request_api({}, url_request, headers, data, 'POST', 120)

            try:
                if res['result']['error_code'] == 0:
                    response = copy.deepcopy(res)
                    response['result']['response'] = {}
                    # HOMECARE DULUAN
                    for rec in res['result']['response']:
                        if 'HC' in rec:
                            response['result']['response'][rec] = res['result']['response'][rec]
                    for rec in res['result']['response']:
                        if rec not in response['result']['response']:
                            response['result']['response'][rec] = res['result']['response'][rec]
                    write_cache(response, "sentra_medika_cache_data", 'cache_web')
            except Exception as e:
                _logger.info("ERROR UPDATE CACHE sentra medika " + provider + ' ' + json.dumps(res) + '\n' + str(
                    e) + '\n' + traceback.format_exc())

            #bus
            data = {}
            action = "get_config"

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": 'get_config',
                "signature": signature
            }
            url_request = url + 'booking/bus'
            res = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res['result']['error_code'] == 0:
                    res = res['result']['response']
                    write_cache(res, "get_bus_config", 'cache_web')
                    name_city_dict = {}
                    for rec in res['station']:
                        name_city_dict["%s - %s" % (res['station'][rec]['city'],res['station'][rec]['name'])] = rec
                    write_cache(name_city_dict, "get_bus_config_dict_key_city", 'cache_web')
                    _logger.info("get_bus_config BUS RENEW SUCCESS SIGNATURE " + headers['signature'])
                else:
                    _logger.error('ERROR get_bus_config file\n' + str(e) + '\n' + traceback.format_exc())
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())

            #insurance
            data = {}

            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": 'get_config',
                "signature": signature
            }
            url_request = url + 'booking/insurance'
            res = send_request_api({}, url_request, headers, data, 'POST', 120)
            try:
                if res['result']['error_code'] == 0:
                    res = res
                    write_cache(res, "insurance_cache_data", 'cache_web')
                    _logger.info("get_bus_config INSURANCE RENEW SUCCESS SIGNATURE " + headers['signature'])
                else:
                    _logger.error('ERROR get_insurance_config file\n' + str(e) + '\n' + traceback.format_exc())
            except Exception as e:
                _logger.error(str(e) + '\n' + traceback.format_exc())


        if type == 'all' or type == 'image':
            #banner
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_banner",
                "signature": signature,
            }
            data = {
                'type': 'big_banner'
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            if res['result']['error_code'] == 0:
                try:
                    empty_sequence = False
                    last_sequence = 0
                    for rec in res['result']['response']:
                        if rec['sequence'] == '':
                            empty_sequence = True
                        elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']): #check isi int atau tidak
                            last_sequence = int(rec['sequence'])
                    if empty_sequence:
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                last_sequence += 1
                                rec['sequence'] = last_sequence
                    res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                    write_cache(res, "big_banner_cache", 'cache_web')
                    _logger.info("big_banner RENEW SUCCESS SIGNATURE " + signature)
                except Exception as e:
                    _logger.error(
                        'ERROR big banner file \n' + str(e) + '\n' + traceback.format_exc())
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_banner",
                "signature": signature,
            }
            data = {
                'type': 'small_banner'
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            if res['result']['error_code'] == 0:
                try:
                    empty_sequence = False
                    last_sequence = 0
                    for rec in res['result']['response']:
                        if rec['sequence'] == '':
                            empty_sequence = True
                        elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']):  # check isi int atau tidak
                            last_sequence = int(rec['sequence'])
                    if empty_sequence:
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                last_sequence += 1
                                rec['sequence'] = last_sequence
                    res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                    write_cache(res, "small_banner_cache", 'cache_web')
                    _logger.info("small_banner RENEW SUCCESS SIGNATURE " + signature)
                except Exception as e:
                    _logger.error(
                        'ERROR small banner file \n' + str(e) + '\n' + traceback.format_exc())
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "get_banner",
                "signature": signature,
            }
            data = {
                'type': 'promotion'
            }
            url_request = url + 'content'
            res = send_request_api({}, url_request, headers, data, 'POST')
            if res['result']['error_code'] == 0:
                try:
                    empty_sequence = False
                    last_sequence = 0
                    for rec in res['result']['response']:
                        if rec['sequence'] == '':
                            empty_sequence = True
                        elif isinstance(int(rec['sequence']), int) and last_sequence < int(rec['sequence']):  # check isi int atau tidak
                            last_sequence = int(rec['sequence'])
                    if empty_sequence:
                        for rec in res['result']['response']:
                            if rec['sequence'] == '':
                                last_sequence += 1
                                rec['sequence'] = last_sequence
                    res['result']['response'] = sorted(res['result']['response'], key=lambda k: int(k['sequence']))
                    write_cache(res, "promotion_banner_cache", 'cache_web')
                    _logger.info("promotion_banner RENEW SUCCESS SIGNATURE " + signature)
                except Exception as e:
                    _logger.error(
                        'ERROR promotion banner file \n' + str(e) + '\n' + traceback.format_exc())


        logging.getLogger("info_logger").error("DONE GENERATE NEW CACHE!")
        return True
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        _logger.error(msg='check wiki gitlab file cache baru')
        return False

    # cache airline popular

def update_cache_data(request):
    try:
        res = get_new_cache(request.POST['signature'], 'data')
        if res == True:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': 'Success update cache!',
                    'response': ''
                }
            }
        else:
            res = {
                'result': {
                    'error_code': -1,
                    'error_msg': 'Error update cache!',
                    'response': ''
                }
            }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        res = {
            'result': {
                'error_code': -1,
                'error_msg': 'Error update cache!',
                'response': ''
            }
        }
    return res

def update_cache_image(request):
    try:
        res = get_new_cache(request.POST['signature'], 'image')
        if res == True:
            res = {
                'result': {
                    'error_code': 0,
                    'error_msg': 'Success update cache!',
                    'response': ''
                }
            }
        else:
            res = {
                'result': {
                    'error_code': -1,
                    'error_msg': 'Error update cache!',
                    'response': ''
                }
            }
    except Exception as e:
        _logger.error(msg=str(e) + '\n' + traceback.format_exc())
        res = {
            'result': {
                'error_code': -1,
                'error_msg': 'Error update cache!',
                'response': ''
            }
        }
    return res

def get_url_static_path():
    return static_path_url

def get_automatic_booker(request):
    try:
        upper = 200
        lower = 0
        passenger = 'book'

        data = {
            'search_type': 'cust_name',
            'name': '',
            'upper': upper,
            'lower': lower,
            'type': passenger,
            'email': '',
            'cust_code': request.POST['cust_code']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_list",
            "signature": request.POST['signature']
        }
        url_request = url + 'content'
        res = send_request_api(request, url_request, headers, data, 'POST')
        if res['result']['error_code'] == 0:
            counter = 0
            for pax in res['result']['response']:
                try:
                    if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                        title = 'MRS'
                    elif pax['gender'] == 'female':
                        title = 'MS'

                    else:
                        title = 'MR'
                    pax.update({
                        'sequence': counter,
                        'title': title
                    })
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2], month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2], month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2], month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2], month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    counter += 1
                except Exception as e:
                    _logger.error(str(e) + traceback.format_exc())
            _logger.info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_customer_booker_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def get_customer_list(request):
    try:
        upper = 200
        lower = 0
        #define per product DEFAULT 0 - 200 / AMBIL SEMUA PASSENGER
        #check jos
        if request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'contact':
            passenger = 'book'
        else:
            passenger = 'psg'
        if request.POST['product'] == 'airline' or request.POST['product'] == 'visa' or request.POST['product'] == 'tour':
            if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'booker':
                upper = 200
                lower = 12
            elif request.POST['passenger_type'] == 'child':
                upper = 12
                lower = 2
            elif request.POST['passenger_type'] == 'infant':
                upper = 2
                lower = 0
        elif request.POST['product'] == 'hotel':
            if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'booker':
                upper = 200
                lower = 12
            elif request.POST['passenger_type'] == 'child':
                upper = 11
                lower = 0
        elif request.POST['product'] == 'activity':
            upper = int(request.POST['maxAge'])
            lower = int(request.POST['minAge'])
        elif request.POST['product'] == 'train':
            if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'booker':
                upper = 200
                lower = 3
            elif request.POST['passenger_type'] == 'infant':
                upper = 2
                lower = 0
        name = request.POST['name']
        if request.POST.get('search_type','cust_name') == 'birth_date':
            name = parse_date_time_to_server(name)
        data = {
            'search_type': request.POST.get('search_type', 'cust_name'),
            'name': name,
            'upper': upper,
            'lower': lower,
            'type': passenger,
            'email': '',
            'cust_code': ''
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_list",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            counter = 0
            for pax in res['result']['response']:
                try:
                    if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                        if 'Adult' in request.POST['passenger_type'] or request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'contact' or request.POST['passenger_type'] == 'passenger': #buat insurance pakai keyword adult<something> jadi pakai in
                            title = 'MRS'
                        else:
                            title = 'MISS'
                    elif pax['gender'] == 'female':
                        if 'Adult' in request.POST['passenger_type'] or request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'contact' or request.POST['passenger_type'] == 'passenger': #buat insurance pakai keyword adult<something> jadi pakai in
                            title = 'MS'
                        else:
                            title = 'MISS'
                    else:
                        if 'Adult' in request.POST['passenger_type'] or request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'contact' or request.POST['passenger_type'] == 'passenger': #buat insurance pakai keyword adult<something> jadi pakai in
                            title = 'MR'
                        else:
                            title = 'MSTR'
                    pax.update({
                        'sequence': counter,
                        'title': title
                    })
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2], month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2], month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2], month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2], month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    counter += 1
                except Exception as e:
                    _logger.error(str(e) + traceback.format_exc())
            _logger.info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_customer_list(request):
    try:
        upper = 200
        lower = 0
        #define per product DEFAULT 0 - 200 / AMBIL SEMUA PASSENGER
        #check jos
        passenger = 'psg'
        data = {
            'search_type': 'cust_name',
            'name': '',
            'upper': upper,
            'lower': lower,
            'type': passenger,
            'email': '',
            'cust_code': request.POST['cust_code']
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_list",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            counter = 0
            for pax in res['result']['response']:
                try:
                    if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MRS'
                        else:
                            title = 'MISS'
                    elif pax['gender'] == 'female':
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MS'
                        else:
                            title = 'MISS'
                    else:
                        if request.POST['passenger_type'] == 'adult' or request.POST['passenger_type'] == 'senior' or request.POST['passenger_type'] == 'booker' or request.POST['passenger_type'] == 'passenger':
                            title = 'MR'
                        else:
                            title = 'MSTR'
                    pax.update({
                        'sequence': counter,
                        'title': title
                    })
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2], month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2], month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2], month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2], month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    counter += 1
                except Exception as e:
                    _logger.error(str(e) + traceback.format_exc())
            #ganti cache
            for pax in request.session.get('cache_passengers'):
                if pax['seq_id'] == request.POST['cust_code']:
                    pax = res['result']['response'][0]
                    break
            res['result']['response'] = request.session.get('cache_passengers')
            _logger.info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def create_customer(request):
    try:
        response = get_cache_data()
        pax = json.loads(request.POST['passenger'])
        image = {
            'files_attachment_edit': 'avatar',
            'files_attachment_edit1': 'passport',
            'files_attachment_edit2': 'ktp',
            'files_attachment_edit3': 'sim',
            'files_attachment_edit4': 'other',
            'files_attachment': 'avatar',
            'files_attachment_1': 'passport',
            'files_attachment_2': 'ktp',
            'files_attachment_3': 'sim',
            'files_attachment_4': 'other',
        }
        image_list = json.loads(request.POST['image_list'])
        if pax['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if pax['nationality_name'] == country['name']:
                    pax['nationality_code'] = country['code']
                    break
        pax.update({
            'birth_date': '%s-%s-%s' % (
                pax['birth_date'].split(' ')[2], month[pax['birth_date'].split(' ')[1]],
                pax['birth_date'].split(' ')[0]),
        })
        for img in image_list:
            if img[2] == 'files_attachment':
                pax.update({
                    'face_image': [img[0], img[1]]
                })
        for identity in pax['identity']:
            image_selected = []
            for img in image_list:
                if image[img[2]] == identity:
                    image_selected.append([img[0], img[1]])
            pax['identity'][identity].update({
                'identity_image': image_selected
            })
            try:
                pax['identity'][identity].update({
                    'identity_expdate': '%s-%s-%s' % (
                        pax['identity'][identity]['identity_expdate'].split(' ')[2], month[pax['identity'][identity]['identity_expdate'].split(' ')[1]],
                        pax['identity'][identity]['identity_expdate'].split(' ')[0])
                })
            except Exception as e:
                _logger.error(str(e) + traceback.format_exc())
            try:
                for country in response['result']['response']['airline']['country']:
                    if pax['identity'][identity]['identity_country_of_issued_name'] == country['name']:
                        pax['identity'][identity]['identity_country_of_issued_code'] = country['code']
                        break
            except:
                pax['identity'][identity]['identity_country_of_issued_code'] = ''
        data = {
            'passengers': pax
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "create_customer",
            "signature": request.POST['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:

            _logger.info("CREATE CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("create_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def update_customer(request):
    try:
        image = {
            'files_attachment_edit': 'avatar',
            'files_attachment_edit1': 'passport',
            'files_attachment_edit2': 'ktp',
            'files_attachment_edit3': 'sim',
            'files_attachment_edit4': 'other',
            'files_attachment': 'avatar',
            'files_attachment_1': 'passport',
            'files_attachment_2': 'ktp',
            'files_attachment_3': 'sim',
            'files_attachment_4': 'other'
        }
        response = get_cache_data()
        passenger = json.loads(request.POST['data'])
        passenger['birth_date'] = '%s-%s-%s' % (passenger['birth_date'].split(' ')[2], month[passenger['birth_date'].split(' ')[1]], passenger['birth_date'].split(' ')[0])

        if passenger['nationality_name'] != '':
            for country in response['result']['response']['airline']['country']:
                if passenger['nationality_name'] == country['name']:
                    passenger['nationality_code'] = country['code']
                    break

        for img in passenger['image']:
            if img[2] == 'files_attachment_edit':
                if 'face_image' in passenger and img[1] == 4:
                    passenger.update({
                        'face_image': [img[0], img[1]]
                    })
                else:
                    passenger.update({
                        'face_image': [img[0], img[1]]
                    })

        for identity in passenger['identity']:
            image_list = []
            for img in passenger['image']:
                if image[img[2]] == identity:
                    image_list.append([img[0], img[1]])
                elif image[img[2]] == 'files_attachment_edit':
                    passenger.update({
                        'face_image': [[img[0], img[1]]]
                    })
            passenger['identity'][identity].update({
                'identity_image': image_list
            })
            if(passenger['identity'][identity]['identity_expdate']):
                passenger['identity'][identity].update({
                    'identity_expdate': '%s-%s-%s' % (
                        passenger['identity'][identity]['identity_expdate'].split(' ')[2], month[passenger['identity'][identity]['identity_expdate'].split(' ')[1]],
                        passenger['identity'][identity]['identity_expdate'].split(' ')[0])
                })
            for country in response['result']['response']['airline']['country']:
                if passenger['identity'][identity]['identity_country_of_issued_name'] == country['name']:
                    passenger['identity'][identity]['identity_country_of_issued_code'] = country['code']
                    break
        passenger.pop('image')
        data = {
            'passengers': passenger
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "update_customer",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            passenger_cache = request.session['cache_passengers']
            for pax in passenger_cache:
                if pax['seq_id'] == res['result']['response']['seq_id']:
                    pax.update(res['result']['response'])
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2],
                                month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2],
                                    month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    break
            set_session(request, 'cache_passengers', passenger_cache)
            _logger.info("SUCCESS update_customer_agent SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("update_customer_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res


def get_customer_parent(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_parent",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            _logger.info("SUCCESS update_customer_agent SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("update_customer_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def activate_corporate_mode(request, signature=False):
    try:
        #DARI AJAX
        data = {
            'c_seq_id': request.POST['customer_seq_id'],
            'cp_seq_id': request.POST['customer_parent_seq_id']
        }
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "activate_corporate_mode",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        if signature == False:
            _logger.error(str(e) + '\n' + traceback.format_exc())

    if signature:
        #JIKA PAKAI CORPORATE MODE
        try:
            cur_session = request.session['user_account']
            data = {
                'c_seq_id': cur_session['co_customer_seq_id'],
                'cp_seq_id': cur_session['co_customer_parent_seq_id']
            }
            headers = {
                "Accept": "application/json,text/html,application/xml",
                "Content-Type": "application/json",
                "action": "activate_corporate_mode",
                "signature": signature,
            }
        except Exception as e:
            _logger.error(str(e) + '\n' + traceback.format_exc())
    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            cur_session = request.session['user_account']
            cur_session.update(res['result']['response'])
            cur_session.update({
                "co_customer_parent_seq_id": request.POST['customer_parent_seq_id']
            })
            set_session(request, 'user_account', cur_session)
            if signature == False:
                _logger.info("SUCCESS activate_corporate_mode SIGNATURE " + request.POST['signature'])
            else:
                _logger.info("SUCCESS activate_corporate_mode SIGNATURE " + signature)
        else:
            if signature == False:
                _logger.error("activate_corporate_mode ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
            else:
                _logger.error(
                    "activate_corporate_mode ERROR SIGNATURE " + signature + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def deactivate_corporate_mode(request):
    try:
        data = {}
        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "deactivate_corporate_mode",
            "signature": request.POST['signature'],
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'session'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            cur_session = request.session['user_account']
            for key in res['result']['response']:
                if cur_session.get(key):
                    del cur_session[key]
            if cur_session.get('co_customer_parent_seq_id'):
                del cur_session['co_customer_parent_seq_id']
            set_session(request, 'user_account', cur_session)
            _logger.info("SUCCESS deactivate_corporate_mode SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("deactivate_corporate_mode ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def add_passenger_cache(request):
    check = 0
    if 'cache_passengers' in request.session._session:
        passengers = request.session['cache_passengers']
        add_pax = json.loads(request.POST['passenger'])
        for pax in passengers:
            if pax['seq_id'] == add_pax['seq_id']:
                check = 1
        if check == 0:
            passengers.append(add_pax)
    else:
        passengers = [json.loads(request.POST['passenger'])]
    set_session(request, 'cache_passengers', passengers)
    if check == 0:
        res = {
            'result': {
                'error_msg': 'Success',
                'error_code': 0,
                'response': ''
            }
        }
    else:
        res = {
            'result': {
                'error_msg': 'Error, Already add this passenger',
                'error_code': 1,
                'response': ''
            }
        }
    return res

def del_passenger_cache(request):
    passenger = request.session['cache_passengers']
    passenger.pop(int(request.POST['index']))
    set_session(request, 'cache_passengers', passenger)
    res = {
        'result': {
            'error_msg': '',
            'error_code': 0,
            'response': passenger
        }
    }
    return res

def get_passenger_cache(request):
    if 'cache_passengers' in request.session._session:
        if request.POST.get('update_cache'):
            if request.POST['update_cache'] == 'true':
                response = get_data_customer_update_cache(request, request.session['cache_passengers'][int(request.POST['passenger_sequence'])]['seq_id'])
                if response['result']['error_code'] == 0:
                    passenger_cache = request.session['cache_passengers']
                    request.session['cache_passengers'][int(request.POST['passenger_sequence'])] = response['result']['response'][0]
                    set_session(request, 'cache_passengers', passenger_cache)
            pass
        res = {
            'result': {
                'error_msg': '',
                'error_code': 0,
                'response': request.session['cache_passengers']
            }
        }
        return res
    else:
        res = {
            'result': {
                'error_msg': '',
                'error_code': 0,
                'response': []
            }
        }
        return res

def get_data_customer_update_cache(request, seq_id):
    try:
        upper = 200
        lower = 0
        passenger = 'psg'

        data = {
            'search_type': '',
            'name': '',
            'upper': upper,
            'lower': lower,
            'type': passenger,
            'email': '',
            'cust_code': seq_id
        }

        headers = {
            "Accept": "application/json,text/html,application/xml",
            "Content-Type": "application/json",
            "action": "get_customer_list",
            "signature": request.session['signature']
        }
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())

    url_request = url + 'content'
    res = send_request_api(request, url_request, headers, data, 'POST')
    try:
        if res['result']['error_code'] == 0:
            counter = 0
            for pax in res['result']['response']:
                try:
                    if pax['gender'] == 'female' and pax['marital_status'] == 'married':
                        title = 'MRS'
                    elif pax['gender'] == 'female':
                        title = 'MS'
                    else:
                        title = 'MR'
                    pax.update({
                        'sequence': counter,
                        'title': title
                    })
                    if pax['birth_date'] != '':
                        pax.update({
                            'birth_date': '%s %s %s' % (
                                pax['birth_date'].split('-')[2], month[pax['birth_date'].split('-')[1]],
                                pax['birth_date'].split('-')[0]),
                        })
                    if pax['identities'].get('passport'):
                        pax['identities']['passport'].update({
                            'identity_expdate': '%s %s %s' % (
                                pax['identities']['passport']['identity_expdate'].split('-')[2], month[pax['identities']['passport']['identity_expdate'].split('-')[1]],
                                pax['identities']['passport']['identity_expdate'].split('-')[0]),
                        })
                    if pax['identities'].get('ktp'):
                        if pax['identities']['ktp']['identity_expdate'] != '':
                            pax['identities']['ktp'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['ktp']['identity_expdate'].split('-')[2], month[pax['identities']['ktp']['identity_expdate'].split('-')[1]],
                                    pax['identities']['ktp']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('sim'):
                        if pax['identities']['sim']['identity_expdate'] != '':
                            pax['identities']['sim'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['sim']['identity_expdate'].split('-')[2], month[pax['identities']['sim']['identity_expdate'].split('-')[1]],
                                    pax['identities']['sim']['identity_expdate'].split('-')[0]),
                            })
                    if pax['identities'].get('other'):
                        if pax['identities']['other']['identity_expdate'] != '':
                            pax['identities']['other'].update({
                                'identity_expdate': '%s %s %s' % (
                                    pax['identities']['other']['identity_expdate'].split('-')[2], month[pax['identities']['other']['identity_expdate'].split('-')[1]],
                                    pax['identities']['other']['identity_expdate'].split('-')[0]),
                            })
                    counter += 1
                except Exception as e:
                    _logger.error(str(e) + traceback.format_exc())
            _logger.info("GET CUSTOMER LIST SUCCESS SIGNATURE " + request.POST['signature'])
        else:
            _logger.error("get_customer_list_agent ERROR SIGNATURE " + request.POST['signature'] + ' ' + json.dumps(res))
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
    return res

def read_idcard_img_to_text(request):
    res = {}
    try:
        from imutils.contours import sort_contours
        from PIL import Image
        import cv2
        import pytesseract
        import imutils
        import numpy as np
    except Exception as e:
        _logger.error('Please install PIL, Imutils, OpenCV, and PyTesseract!\n' + str(e) + '\n' + traceback.format_exc())
        return ERR.get_error_api(500, additional_message=str(e))
    try:
        if request.POST.get('idcard_type') == 'ktp' and request.FILES.get('files_attachment_2'):
            pil_img = Image.open(request.FILES['files_attachment_2'])
            cv_img = np.array(pil_img)
            # img_file = cv2.imread(cv_img)
            gray_img = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            (thresh, threshed_img) = cv2.threshold(gray_img, 127, 255, cv2.THRESH_TRUNC)
            final_img = Image.fromarray(threshed_img)
            extracted_text = pytesseract.image_to_string(final_img, lang="ind")

            for word in extracted_text.split("\n"):
                res.update({
                    'nationality': 'Indonesia'
                })
                if "NIK" in word:
                    word = word.split(':')
                    word_dict = {
                        'b': "6",
                        'e': "2",
                    }
                    final_nik = ''
                    for letter in word[-1].replace(" ", ""):
                        if letter in word_dict:
                            final_nik += word_dict[letter]
                        else:
                            final_nik += letter
                    res.update({
                        'identity_number': final_nik
                    })
                    continue

                if "Nama" in word:
                    word = word.split(':')
                    pax_name = word[-1].replace('Nama ', '')
                    pax_name_split = pax_name.rsplit(' ', 1)
                    res.update({
                        'first_name': pax_name_split[0].strip()
                    })
                    if len(pax_name_split) > 1:
                        res.update({
                            'last_name': pax_name_split[-1].strip()
                        })
                    continue

                if "Tempat" in word:
                    word = word.split(':')
                    birth_date = re.search("([0-9]{2}\-[0-9]{2}\-[0-9]{4})", word[-1])
                    if birth_date:
                        res.update({
                            'birth_date': datetime.strptime(birth_date[0], '%d-%m-%Y').strftime('%d %b %Y'),
                            'age': relativedelta(datetime.now(), datetime.strptime(birth_date[0], '%d-%m-%Y')).years
                        })
                        birth_place = word[-1].replace(birth_date[0], '')
                        if birth_place:
                            res.update({
                                'birth_place': birth_place.replace(',', '').strip()
                            })
                    continue

                if 'Darah' in word:
                    gender = re.search("(LAKI-LAKI|LAKI|LELAKI|PEREMPUAN)", word)
                    if gender:
                        res.update({
                            'gender': gender[0]
                        })
                    word = word.split(':')
                    try:
                        blood_type = re.search("(O|A|B|AB)", word[-1])
                        if blood_type:
                            res.update({
                                'blood_type': blood_type[0]
                            })
                    except:
                        res.update({
                            'blood_type': '-'
                        })
                if 'Alamat' in word:
                    word_dict = {
                        '|': "1"
                    }
                    address = ""
                    for letter in word:
                        if letter in word_dict:
                            address += word_dict[letter]
                        else:
                            address += letter
                    res.update({
                        'address': address.replace("Alamat ", "")
                    })
                if 'NO.' in word:
                    if res.get('address'):
                        res['address'] += ' ' + word
                if "Kecamatan" in word:
                    district = word.split(':')
                    if len(district) > 1:
                        res.update({
                            'district': district[1].strip()
                        })
                if "Desa" in word:
                    wrd = word.split()
                    desa = []
                    for wr in wrd:
                        if not 'desa' in wr.lower():
                            desa.append(wr)
                    res.update({
                        'ward': ''.join(desa).replace(':', "").strip()
                    })
                if 'Kewarganegaraan' in word:
                    nationality = word.split(':')
                    if len(nationality) > 1:
                        res.update({
                            'nationality': nationality[1].strip()
                        })
                if 'Pekerjaan' in word:
                    wrod = word.split()
                    pekerjaan = []
                    for wr in wrod:
                        if not '-' in wr:
                            pekerjaan.append(wr)
                    res.update({
                        'job': ' '.join(pekerjaan).replace('Pekerjaan', '').replace(':', "").strip()
                    })
                if 'Agama' in word:
                    res.update({
                        'religion': word.replace('Agama', "").replace(':', "").strip()
                    })
                if 'Perkawinan' in word:
                    marriage_status = word.split(':')
                    if len(marriage_status) > 1:
                        res.update({
                            'marriage_status': marriage_status[1].strip()
                        })
                if "RT/RW" in word:
                    rtrw_word = word.replace("RT/RW", '')
                    split_rtrw = rtrw_word.split('/')
                    if len(split_rtrw) > 1:
                        res.update({
                            'rt': split_rtrw[0].strip(),
                            'rw': split_rtrw[1].strip()
                        })
                if 'Berlaku' in word:
                    expired_date = word.split(':')
                    if len(expired_date) > 1:
                        id_exp_date = expired_date[1].strip()
                        if id_exp_date != 'SEUMUR HIDUP':
                            try:
                                id_exp_date = datetime.strptime(id_exp_date, '%d-%m-%Y').strftime('%d %b %Y')
                            except:
                                id_exp_date = 'SEUMUR HIDUP'
                        res.update({
                            'identity_expired_date': id_exp_date
                        })
                if res.get('gender') in ['LAKI-LAKI', 'LAKI', 'LELAKI']:
                    if not res.get('age') or (res.get('age') and int(res['age']) > 12):
                        res.update({
                            'title': 'MR'
                        })
                    else:
                        res.update({
                            'title': 'MSTR'
                        })
                else:
                    if not res.get('age') or (res.get('age') and int(res['age']) > 12):
                        if res.get('marriage_status') == 'KAWIN':
                            res.update({
                                'title': 'MRS'
                            })
                        else:
                            res.update({
                                'title': 'MS'
                            })
                    else:
                        res.update({
                            'title': 'MISS'
                        })
            result = ERR.get_no_error_api()
            result['response'] = res
        elif request.POST.get('idcard_type') == 'passport' and request.FILES.get('files_attachment_1'):
            pil_img = Image.open(request.FILES['files_attachment_1'])
            cv_img = np.array(pil_img)

            # dimensions
            gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
            (H, W) = gray.shape

            # initialize a rectangular and square structuring kernel
            rectKernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 7))
            sqKernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21, 21))
            # smooth the image using a 3x3 Gaussian blur and then apply a
            # blackhat morpholigical operator to find dark regions on a light
            # background
            gray = cv2.GaussianBlur(gray, (3, 3), 0)
            blackhat = cv2.morphologyEx(gray, cv2.MORPH_BLACKHAT, rectKernel)

            # compute the Scharr gradient of the blackhat image and scale the
            # result into the range [0, 255]
            grad = cv2.Sobel(blackhat, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
            grad = np.absolute(grad)
            (minVal, maxVal) = (np.min(grad), np.max(grad))
            grad = (grad - minVal) / (maxVal - minVal)
            grad = (grad * 255).astype("uint8")

            # apply a closing operation using the rectangular kernel to close
            # gaps in between letters -- then apply Otsu's thresholding method
            grad = cv2.morphologyEx(grad, cv2.MORPH_CLOSE, rectKernel)
            thresh = cv2.threshold(grad, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

            # perform another closing operation, this time using the square
            # kernel to close gaps between lines of the MRZ, then perform a
            # series of erosions to break apart connected components
            thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, sqKernel)
            thresh = cv2.erode(thresh, None, iterations=2)

            # find contours in the thresholded image and sort them from bottom
            # to top (since the MRZ will always be at the bottom of the passport)
            cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                                    cv2.CHAIN_APPROX_SIMPLE)
            cnts = imutils.grab_contours(cnts)
            cnts = sort_contours(cnts, method="bottom-to-top")[0]

            # initialize the bounding box associated with the MRZ
            mrzBox = None

            # loop over the contours
            for c in cnts:
                # compute the bounding box of the contour and then derive the
                # how much of the image the bounding box occupies in terms of
                # both width and height
                (x, y, w, h) = cv2.boundingRect(c)
                percentWidth = w / float(W)
                percentHeight = h / float(H)
                # if the bounding box occupies > 80% width and > 1% height of the
                # image, then assume we have found the MRZ
                if percentWidth > 0.8 and percentHeight > 0.01:
                    mrzBox = (x, y, w, h)
                    break

            if mrzBox:
                (x, y, w, h) = mrzBox
                pX = int((x + w) * 0.03)
                pY = int((y + h) * 0.05)
                (x, y) = (x - pX, y - pY)
                (w, h) = (w + (pX * 2), h + (pY * 2))
                # extract the padded MRZ from the image
                mrz = cv_img[y:y + h, x:x + w]

                # cv2.imshow('MRZ', mrz)
                # cv2.waitKey(0)

                final_img = Image.fromarray(mrz)
                mrzText = pytesseract.image_to_string(final_img)
                mrzText = mrzText.replace(" ", "")

                mrz = [line for line in mrzText.split('\n') if len(line) > 10]
                first_name = ''
                last_name = ''
                passport_no = ''
                birth_date = ''
                exp_date = ''
                title = ''
                nationality = ''
                if mrz:
                    try:
                        nationality = alpha3_country_codes.get(mrz[0][2:5]) and alpha3_country_codes[mrz[0][2:5]] or 'IND'
                        if mrz[0][0:2] == 'P<':
                            last_name = mrz[0].split('<')[1][3:]
                        else:
                            last_name = mrz[0].split('<')[0][5:]
                        name_list = [i for i in mrz[0].split('<') if (i).isspace() == 0 and len(i) > 0]
                        if name_list[1] == '%s%s' % (mrz[0][2:5], last_name):
                            if len(name_list) > 2:
                                first_name = ' '.join(name_list[2:-1])
                            else:
                                first_name = last_name
                        else:
                            first_name = ' '.join(name_list[1:-1])
                    except:
                        first_name = 'Failed'
                        last_name = 'Failed'

                    if len(mrz) > 1:
                        passport_no = mrz[1][:9].replace("<", "")
                        birth_date = ''.join(mrz[1][13:19])
                        birth_year = int(birth_date[:2])
                        cur_year = int(datetime.today().strftime('%y'))
                        if birth_year > cur_year:
                            birth_date = '19' + birth_date
                        else:
                            birth_date = '20' + birth_date

                        birth_date = datetime.strptime(birth_date, '%Y%m%d').strftime('%d %b %Y')
                        exp_date = '20' + ''.join(mrz[1][21:27])
                        exp_date = datetime.strptime(exp_date, '%Y%m%d').strftime('%d %b %Y')
                        if mrz[1][20] == 'F':
                            title = 'MRS'
                        else:
                            title = 'MR'

                res.update({
                    'identity_number': passport_no,
                    'first_name': first_name,
                    'last_name': last_name,
                    'birth_date': birth_date,
                    'identity_expired_date': exp_date,
                    'title': title,
                    'nationality': nationality
                })

            result = ERR.get_no_error_api()
            result['response'] = res
        else:
            _logger.error("Error reading ID Card, file cannot be read.")
            result = ERR.get_error_api(500, additional_message="Error reading ID Card, file cannot be read.")
    except Exception as e:
        _logger.error(str(e) + '\n' + traceback.format_exc())
        result = ERR.get_error_api(500, additional_message=str(e))
    return result
