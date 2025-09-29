from django.apps import AppConfig


class VisaSetupConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'visa_setup'

    def ready(self):
        # Import signal handlers
        from . import signals  # noqa: F401