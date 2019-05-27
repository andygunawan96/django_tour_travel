
import os, time
import json

# mkdir for linux
# mkdir /var/log/api_session/
# chown odoo:odoo /var/log/api_session/

_path = '/var/log/tour_travel/'


class session_file(object):
    _cache_limit = 6 * 60  # in sec
    _session_limit = 6 * 60  # in sec

    def __init__(self):
        if not os.path.exists(_path):
            os.mkdir(_path)

        self.path = _path + 'session/'
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


    def write_JSONCache(self, sid, session_attribute, data={}):
        file_name = '_'.join((sid, session_attribute)) + '.sess'
        _file = open(self.path + file_name, 'w')
        _file.write(json.dumps(data))
        _file.close()
        return True

    def read_JSONCache(self, sid, session_attribute):
        file_name = '_'.join((sid, session_attribute)) + '.sess'
        if not os.path.exists(self.path + file_name):
            _file = open(self.path + file_name, 'w')
            _file.write('{}')
            _file.close()
            return {}

        _file = open(self.path + file_name, 'r')
        data = _file.read()
        _file.close()
        return json.loads(data)


    def _isExpired_session(self):
        return time.time() - os.path.getmtime(self._session_file()) > self._session_limit


class SessionAttributes(object):
    def __init__(self, sid, session_attribute):
        self._session_file = session_file()
        self.sid = sid
        self.attibute = session_attribute
        self.data = self._session_file.read_JSONCache(self.sid, session_attribute)

    def __getitem__(self, item):
        # New Item : uses save({'NewItem': 'NewItem_value'})
        return self.data[item]

    def __getattr__(self, item):
        return self.data[item]

    def save(self, data_dict=None):
        if data_dict:
            self.data.update(data_dict)
        self._session_file.write_JSONCache(self.sid, self.attibute, self.data)


class ClientSession(object):

    def __init__(self, sid):
        self.sid = sid

    def __getitem__(self, session_attribute):
        return SessionAttributes(self.sid, session_attribute)

    def __getattr__(self, session_attribute):
        return SessionAttributes(self.sid, session_attribute)


class SearchResult(object):
    def __init__(self):
        self.data = {
            'state': 'new',
            'max_hit': 1,
            'hit': 0,
            'carrier_code_list': set(),
            'last_sequence': 0,
            'selected_schedules': []
        }

    def add(self, schedules_len, carrier_code_list=[]):
        '''
        Add schedules
        :param schedules: list of schedule
        :return:
        '''
        self.data['carrier_code_list'] = self.data['carrier_code_list'].union(carrier_code_list)
        self.data['last_sequence'] += schedules_len

        # self.__selected_sechudule = [5, 20]

        self.__hit += 1
        if self.__hit >= self.__max_hit:
            self.__state = 'loaded'

    # def search(self, journey_code):
    #     return self.__schedules_index.get(journey_code)

    def get_flight_itinerary(self, sequences):
        self.selected_schedules = []
        for seq in sequences:
            self.selected_schedules.append(self.schedules[int(seq)])

    def reset(self):
        self.__state = 'new'
        self.schedules = []
        self.last_sequence = 0
        self.__hit = 0
        self.__carrier_code_list = set()
        # self.__schedules_index = {}

    def set_max_hit(self, hit):
        self.__max_hit = hit

    @property
    def state(self):
        return self.__state

    @property
    def carrier_code_list(self):
        return list(self.__carrier_code_list)

    @property
    def hit(self):
        return self.__hit

    @property
    def max_hit(self):
        return self.__max_hit


class SessionManager(object):
    def __init__(self):
        pass

    def __getitem__(self, sid):
        return ClientSession(sid)
