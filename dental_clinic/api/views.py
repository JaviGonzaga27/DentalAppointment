from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Patient, Appointment
from .serializers import UserSerializer, PatientSerializer, AppointmentSerializer
from django.utils import timezone
from datetime import timedelta
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    @action(detail=False, methods=['get'])
    def reports(self, request):
        report_type = request.query_params.get('type', 'daily')
        today = timezone.now().date()

        if report_type == 'daily':
            start_date = today
            end_date = today + timedelta(days=1)
        elif report_type == 'weekly':
            start_date = today - timedelta(days=today.weekday())
            end_date = start_date + timedelta(days=7)
        elif report_type == 'monthly':
            start_date = today.replace(day=1)
            end_date = (start_date + timedelta(days=32)).replace(day=1)
        else:
            return Response({"error": "Invalid report type"}, status=status.HTTP_400_BAD_REQUEST)

        appointments = Appointment.objects.filter(date__range=[start_date, end_date])
        serializer = self.get_serializer(appointments, many=True)
        
        return Response({
            "report_type": report_type,
            "start_date": start_date,
            "end_date": end_date,
            "appointments": serializer.data
        })