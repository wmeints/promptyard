"""
WSGI config for promptyard project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

app_environment = os.getenv("APP_ENVIRONMENT", "development")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"core.settings.{app_environment}")

application = get_wsgi_application()
