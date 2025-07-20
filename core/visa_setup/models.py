from django.db import models
from django.core.validators import FileExtensionValidator


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
    description = models.TextField(blank=True, help_text="Detailed description of the document requirements")
    is_mandatory = models.BooleanField(default=True)
    document_format = models.CharField(max_length=50, default="PDF", choices=[
        ("PDF", "PDF File"),
        ("IMAGE", "Image File (JPG, PNG)"),
        ("DOC", "Word Document")
    ])
    max_file_size = models.IntegerField(default=5, help_text="Maximum file size in MB")
    additional_instructions = models.TextField(blank=True)

class VisaType(models.Model):
    name = models.CharField(max_length=100)
    headings = models.TextField()
    active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='visa_type_images/', null=True, blank=True)

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
    image = models.ImageField(upload_to='country_images/', null=True, blank=True)

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
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('in_review', 'In Review'),
        ('additional_docs_required', 'Additional Documents Required'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='visa_applications')
    visa_type = models.ForeignKey(VisaType, on_delete=models.CASCADE, related_name='applications')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=50, default='pending', choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ])
    admin_notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.visa_type.name} - {self.country.name}"

class VisaTypeDocument(models.Model):
    visa_type = models.ForeignKey(VisaType, on_delete=models.CASCADE)
    document = models.ForeignKey(RequiredDocuments, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        unique_together = ['visa_type', 'document']

class ApplicationDocument(models.Model):
    application = models.ForeignKey(VisaApplication, on_delete=models.CASCADE, related_name='documents')
    required_document = models.ForeignKey(RequiredDocuments, on_delete=models.CASCADE)
    file = models.FileField(
        upload_to='visa_documents/%Y/%m/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'])]
    )
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ])
    admin_notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)  # New field for rejection reason