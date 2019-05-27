# -*- encoding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>). All Rights Reserved
#    $Id$
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

import logging

LOG_DEBUG='debug'
LOG_INFO='info'
LOG_WARNING='warn'
LOG_ERROR='error'
LOG_CRITICAL='critical'
_custom_logger = logging.getLogger(__name__)

def custom_logger_init():
    import os
    # logfile_name = os.path.join(tempfile.gettempdir(), "custom-logger.log")
    logfile_name = os.path.join('/var/log/odoo/', "custom-log.log")
    # hdlr = logging.FileHandler(logfile_name)
    hdlr = logging.handlers.TimedRotatingFileHandler(filename=logfile_name, when='D', interval=1, backupCount=30)
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    hdlr.setFormatter(formatter)
    _custom_logger.addHandler(hdlr)
    _custom_logger.setLevel(logging.INFO)
    # _custom_logger.debug()

custom_logger_init()

class custom_logger(object):
    def error(self, msg):
        self.log_write(LOG_ERROR, msg)

    def info(self, msg):
        self.log_write(LOG_INFO, msg)

    def log_write(self, level, msg):
        getattr(_custom_logger, level)(msg)

    def shutdown(self):
        logging.shutdown()


# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
