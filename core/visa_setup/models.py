from django.db import models


class Notes(models.Model):
    notes = models.TextField()

    def __str__(self):
        return self.notes[:50]  # Show first 50 characters


class VisaProcess(models.Model):
    points = models.TextField()

    def __str__(self):
        return self.points[:50]


class VisaOverview(models.Model):
    points = models.TextField()
    overview = models.TextField()

    def __str__(self):
        return self.points[:50]

class RequiredDocuments(models.Model):
    document_name = models.CharField(max_length=100)

    def __str__(self):
        return self.document_name

class VisaType(models.Model):
    name = models.CharField(max_length=100)
    headings = models.TextField()
    active = models.BooleanField(default=True)

    # Changed to ManyToMany for flexibility
    processes = models.ManyToManyField(VisaProcess, related_name='visa_types', blank=True)
    overviews = models.ManyToManyField(VisaOverview, related_name='visa_types', blank=True)
    notes = models.ManyToManyField(Notes, related_name='visa_types', blank=True)
    required_documents = models.ManyToManyField(RequiredDocuments, related_name='visa_types', blank=True)

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Visa Type'
        verbose_name_plural = 'Visa Types'


class Country(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    code= models.CharField(max_length=10, unique=True)

    # One-to-many: one VisaType to many Countries
    types = models.ManyToManyField(VisaType, related_name='countries')
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']



class VisaApplication(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='visa_applications')
    visa_type = models.ForeignKey(VisaType, on_delete=models.CASCADE, related_name='applications')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, default='pending', choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.visa_type.name} - {self.country.name}"