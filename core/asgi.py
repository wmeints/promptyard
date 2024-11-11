"""
ASGI config for promptyard project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

app_environment = os.getenv("APP_ENVIRONMENT", "development")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", f"core.settings.{app_environment}")

application = get_asgi_application()
