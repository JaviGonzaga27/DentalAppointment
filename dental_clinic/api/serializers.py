from rest_framework import serializers
from .models import Patient, Appointment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        extra_kwargs = {'username': {'required': False}}

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Patient
        fields = ['id', 'user', 'phone', 'password']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password')
        
        user_serializer = UserSerializer(data=user_data)
        if not user_serializer.is_valid():
            print('Errores de validación del usuario:', user_serializer.errors)
            raise serializers.ValidationError(user_serializer.errors)
        
        user = User.objects.create(
            username=user_data['email'],
            email=user_data['email'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name']
        )
        user.set_password(password)
        user.save()
        
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'date', 'description']