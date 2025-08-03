from rest_framework import serializers
from django.contrib.auth import authenticate
from accounts.models import User

class AdminUserSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.is_superuser:
            raise serializers.ValidationError("Only superusers can log in here.")

        data['user'] = user
        return data
