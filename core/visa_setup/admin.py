from django.contrib import admin

# Register your models here.


from .models import VisaType, Country, VisaProcess, VisaOverview, Notes, RequiredDocuments,VisaApplication,ApplicationDocument

admin.site.register(VisaType)
admin.site.register(Country)    
admin.site.register(VisaProcess)
admin.site.register(VisaOverview)
admin.site.register(Notes)
admin.site.register(RequiredDocuments)
admin.site.register(VisaApplication)
admin.site.register(ApplicationDocument)