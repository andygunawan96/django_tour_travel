import os, time
import json

_path = '/var/log/tour_travel/'

class session_client(object):
    _cache_limit = 15 * 60  # in sec
    _session_limit = 15 * 60  # in sec
    _service_attempt_allow = 25

    def __init__(self):
        if not os.path.exists(_path):
            os.mkdir(_path)

        self.path = _path + 'session_frontend/'

        if not os.path.exists(self.path):
            os.mkdir(self.path)
        self.context = {
            'uid': 0,
            'sid': '',
            'search_id': 0,
            'remote_addr': ''
        }

    def _session_file(self):
        return ''.join((self.path, 'client_', self.context['sid'], '.sess'))

    def write_search_id(self, search_id):
        self.context['search_id'] = search_id
        session_file = open(self._session_file(), 'w')
        session_file.write(str(self.context))
        session_file.close()

    def _cache_file(self, action_name, extention='.json'):
        return ''.join((self.path, self.context['sid'], '_', action_name, '_', str(self.context['co_uid'])
                , extention))

    def write_JSONCache(self, data, service_name, context):
        self.context = context
        _file = open(self._cache_file(service_name), 'w')
        _file.write(json.dumps(data))
        _file.close()
        return True

    def read_JSONCache(self, service_name, context):
        self.context = context
        try:
            _file = open(self._cache_file(service_name), 'r')
        except:
            return False

        data = _file.read()
        _file.close()
        return json.loads(data)

    def _check_context(self):
        if not self.context.get('search_id'):
            self.context['search_id'] = 0

    def write_session(self, context):
        self.context = context
        self._check_context()
        session_file = open(self._session_file(), 'w')
        session_file.write(str(self.context))
        session_file.close()

    def is_valid(self, context):
        self.context = context
        if not os.path.exists(self._session_file()):
            return False

        if self._isExpired_session():
            return False
        return True

    def update_timer(self, context):
        """
        Untuk Write session & Update Modified Date agar Expire Time di normalisasi
        :return:
        """
        self.context = context
        self._check_context()
        session_file = open(self._session_file(), 'w')
        session_file.write(str(self.context))
        session_file.close()
        return True

    def read_session(self, sid):
        self.context['sid'] = sid
        if not self.is_valid(self.context):
            return False

        session_file = open(self._session_file(), 'r')
        #Fixme: SyntaxError: unexpected EOF while parsing
        self.context = eval(session_file.read())
        session_file.close()
        return True

    def _isExpired_session(self):
        return time.time() - os.path.getmtime(self._session_file()) > self._session_limit

    def is_malware_attack(self, service_name, context):
        #Cek : 25 detik terakhir, service_name yang sama tidak diijinkan
        self.context = context
        if not os.path.exists(self._cache_file(service_name, '.json')):
            return False
        return time.time() - os.path.getmtime(self._cache_file(service_name)) < self._service_attempt_allow
