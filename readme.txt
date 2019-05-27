# [TERMINAL] Check Python Version (minimum 3.6) :
>> python --version

# [TERMINAL] Install Requirements :
>> pip install -r requirements.txt

# [TERMINAL] Create Project :
>> django-admin createproject <project_name>

# [SETTINGS] Setting for Database Access
settings.py > DATABASE

# [TERMINAL] Migrate Database :
>> python manage.py migrate

# [TERMINAL] Create Super User :
>> python manage.py createsuperuser

# [SETTINGS] Setting Languages and Locale Paths:
setting.py > LANGUAGES, LOCALE_PATHS

# [TERMINAL] Create Super User :
>> python manage.py createsuperuser

# [TERMINAL] Translate Language (gettext_lazy in py, {% trans '<text>' %} in html:
>> django-admin makemessage -l <language_code>
>> django-admin compilemessages
