from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
import re
from datetime import date

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'full_name', 'phone_number',
                 'date_of_birth', 'address', 'profile_picture')

    def validate_email(self, value):
        """
        Validate email format and uniqueness
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        
        # Basic email format validation
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Invalid email format.")
        
        return value.lower()  # Convert email to lowercase

    def validate_username(self, value):
        """
        Validate username format and uniqueness
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        
        # Username format validation
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', value):
            raise serializers.ValidationError(
                "Username must be 3-20 characters long and contain only letters, numbers, and underscores."
            )
        
        return value

    def validate_phone_number(self, value):
        """
        Validate phone number format
        """
        if value:  # Phone number is optional
            # Remove any spaces or special characters
            cleaned_number = re.sub(r'[^0-9+]', '', value)
            
            # Basic phone number validation (adjust regex according to your needs)
            if not re.match(r'^\+?[0-9]{10,15}$', cleaned_number):
                raise serializers.ValidationError(
                    "Invalid phone number format. Please enter a valid number with 10-15 digits."
                )
            
            if User.objects.filter(phone_number=cleaned_number).exists():
                raise serializers.ValidationError("This phone number is already registered.")
            
            return cleaned_number
        return value

    def validate_full_name(self, value):
        """
        Validate full name format
        """
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters long.")
        
        if not re.match(r'^[a-zA-Z\s\'-]+$', value):
            raise serializers.ValidationError(
                "Full name can only contain letters, spaces, hyphens, and apostrophes."
            )
        
        return value.strip()

    def validate_date_of_birth(self, value):
        """
        Validate date of birth
        """
        if value:
            today = date.today()
            age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
            
            if age < 18:
                raise serializers.ValidationError("You must be at least 18 years old to register.")
            
            if age > 120:
                raise serializers.ValidationError("Please enter a valid date of birth.")
        
        return value

    def validate_profile_picture(self, value):
        """
        Validate profile picture
        """
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Profile picture size cannot exceed 5MB.")
            
            # Check file extension
            allowed_extensions = ['.jpg', '.jpeg', '.png']
            ext = '.' + value.name.split('.')[-1].lower()
            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"Only {', '.join(allowed_extensions)} files are allowed for profile picture."
                )
        
        return value

    def validate(self, attrs):
        """
        Validate the entire data set
        """
        # Password matching validation
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Additional password strength validation
        password = attrs['password']
        if len(password) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters long."})
        
        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError({"password": "Password must contain at least one number."})
        
        if not any(char.isupper() for char in password):
            raise serializers.ValidationError({"password": "Password must contain at least one uppercase letter."})
        
        if not any(char.islower() for char in password):
            raise serializers.ValidationError({"password": "Password must contain at least one lowercase letter."})
        
        if not any(char in "!@#$%^&*(),.?\":{}|<>" for char in password):
            raise serializers.ValidationError({"password": "Password must contain at least one special character."})

        # Validate address if provided
        address = attrs.get('address')
        if address and len(address.strip()) < 10:
            raise serializers.ValidationError({"address": "Address must be at least 10 characters long."})

        return attrs

    def create(self, validated_data):
        """
        Create new user after all validations pass
        """
        # Remove password confirmation field
        validated_data.pop('password2')
        
        # Create the user
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            raise serializers.ValidationError({"error": f"Error creating user: {str(e)}"})

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'full_name', 'phone_number',
                 'date_of_birth', 'address', 'profile_picture', 'is_active',
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
