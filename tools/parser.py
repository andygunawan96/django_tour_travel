from datetime import *

def parse_date(date):
    return date.strftime("%a, %d-%m-%Y")

def parse_date_ppob(date):
    return datetime.strptime(date, "%Y%m").strftime('%b %Y')

def parse_datetime(date):
    return date.strftime("%a, %d-%m-%Y %H:%M")

def parse_date_time_front_end(date):
    return date.strftime("%d %b %Y - %H:%M")

def parse_save_cache(date):
    return date.strftime("%Y-%m-%d %H:%M:%S")

def parse_load_cache(date):
    return datetime.strptime(date, "%Y-%m-%d %H:%M:%S")

def parse_date_time_to_server(date):
    return datetime.strptime(date, '%d %b %Y').strftime('%Y-%m-%d')

def string_to_datetime(date):
    return datetime.strptime(date, '%Y-%m-%d %H:%M:%S')

def convert_string_to_date_to_string_front_end(date):
    return datetime.strptime(date, "%Y-%m-%d").strftime('%d %b %Y')

def convert_string_to_date_to_string_front_end_with_unkown_separator(date):
    return datetime.strptime(date, "%d/%m/%Y").strftime('%d %b %Y')

def convert_string_to_date_to_string_front_end_with_date(date):
    return datetime.strptime(date, "%Y-%m-%d").strftime('%A, %d %b %Y')

def convert_string_to_date_to_string_front_end_with_time(date):
    return datetime.strptime(date, "%Y-%m-%d %H:%M:%S").strftime('%d %b %Y  %H:%M')

def to_date_now(date):
    return datetime.strftime(datetime.strptime(date, '%Y-%m-%d %H:%M:%S') + timedelta(hours=7), '%Y-%m-%d %H:%M:%S')