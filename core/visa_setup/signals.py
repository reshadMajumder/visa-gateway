from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.core.cache import cache
from django.conf import settings

from .models import Country, VisaType
from .serializers import CountrySerializer, DetailedVisaTypeSerializer


def _clear_country_cache(country_id: int | None = None) -> None:
    cache.delete("countries:active")
    if country_id is not None:
        cache.delete(f"country:{country_id}")
        cache.delete(f"country:{country_id}:visa_types")


def _clear_visa_type_cache(visa_type_id: int | None = None) -> None:
    cache.delete("visa_types:active")
    if visa_type_id is not None:
        cache.delete(f"visa_type:{visa_type_id}")


@receiver(post_save, sender=Country)
def country_saved(sender, instance: Country, **kwargs):
    _clear_country_cache(instance.id)
    # Warm caches: list and detail
    countries = list(Country.objects.filter(active=True).prefetch_related('types'))
    cache.set("countries:active", countries, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
    cache.set(f"country:{instance.id}", instance, getattr(settings, 'CACHE_DEFAULT_TTL', 300))


@receiver(post_delete, sender=Country)
def country_deleted(sender, instance: Country, **kwargs):
    _clear_country_cache(instance.id)
    # Warm list cache after deletion
    countries = list(Country.objects.filter(active=True).prefetch_related('types'))
    cache.set("countries:active", countries, getattr(settings, 'CACHE_DEFAULT_TTL', 300))


@receiver(post_save, sender=VisaType)
def visa_type_saved(sender, instance: VisaType, **kwargs):
    _clear_visa_type_cache(instance.id)
    # Warm caches: list and detail
    visa_types = list(VisaType.objects.filter(active=True).prefetch_related('processes', 'overviews', 'notes', 'required_documents'))
    cache.set("visa_types:active", visa_types, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
    cache.set(f"visa_type:{instance.id}", instance, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
    # Countries referencing this visa type may change list payloads
    for country in instance.countries.all():
        _clear_country_cache(country.id)


@receiver(post_delete, sender=VisaType)
def visa_type_deleted(sender, instance: VisaType, **kwargs):
    _clear_visa_type_cache(instance.id)
    # Warm list cache after deletion
    visa_types = list(VisaType.objects.filter(active=True).prefetch_related('processes', 'overviews', 'notes', 'required_documents'))
    cache.set("visa_types:active", visa_types, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
    for country in instance.countries.all():
        _clear_country_cache(country.id)


@receiver(m2m_changed, sender=Country.types.through)
def country_types_changed(sender, instance: Country, action, **kwargs):
    if action in {"post_add", "post_remove", "post_clear"}:
        _clear_country_cache(instance.id)
        # Warm relevant caches
        countries = list(Country.objects.filter(active=True).prefetch_related('types'))
        cache.set("countries:active", countries, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
        cache.set(f"country:{instance.id}", instance, getattr(settings, 'CACHE_DEFAULT_TTL', 300))
        cache.delete("visa_types:active")

