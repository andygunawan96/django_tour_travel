ERR_CODE = {
    50: 'Error Code Message not Found',
    420: 'Method failure',
    500: 'Error',
    1001: 'Invalid action type',
    1002: 'Your Credential is Invalid',
    1003: 'Your Credential has been expired',
}


def default_api_response(data=None):
    data = data and data or {}
    res = {
        'error_code': 0,
        'error_msg': '',
        'response': '',
    }
    res.update(data)
    return res


def get_no_error_api(data=None):
    data = data and data or {
        'response': 'Success'
    }
    res = default_api_response(data)
    return res


def get_error_message(_error_code, parameter='', additional_message=''):
    res = ERR_CODE.get(_error_code, ERR_CODE[50])
    if parameter:
        res = res % parameter
    if additional_message:
        res = '%s, %s' % (res, additional_message)
    return res


def get_error_api(_error_code, parameter='', additional_message=''):
    res = default_api_response({
        'error_code': _error_code,
        'error_msg': get_error_message(_error_code, parameter, additional_message)
    })
    return res


class RequestException(Exception):
    def __init__(self, msg, code):
        self.code = code
        self.message = msg
        super(RequestException, self).__init__(msg)

    def __str__(self):
        return 'Request Error %s: %s' % (self.code, self.message)

    def error_dict(self):
        return {'error_code': self.code, 'error_msg': self.message}
