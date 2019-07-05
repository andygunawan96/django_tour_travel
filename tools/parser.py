from datetime import *

def parse_date(date):
    return date.strftime("%a, %d-%m-%Y")

def parse_datetime(date):
    return date.strftime("%a, %d-%m-%Y %H:%M")

def parse_date_time_front_end(date):
    return date.strftime("%d %b %Y - %H:%M")

def string_to_datetime(date):
    return datetime.strptime(date, '%Y-%m-%d %H:%M:%S')

def convert_string_to_date_to_string_front_end(date):
    return datetime.strptime(date, "%Y-%m-%d").strftime('%d %b %Y')

def convert_string_to_date_to_string_front_end_with_time(date):
    return datetime.strptime(date, "%Y-%m-%d %H:%M:%S").strftime('%d %b %Y  %H:%M')

def to_date_now(date):
    return datetime.strftime(datetime.strptime(date, '%Y-%m-%d %H:%M:%S') + timedelta(hours=7), '%Y-%m-%d %H:%M:%S')