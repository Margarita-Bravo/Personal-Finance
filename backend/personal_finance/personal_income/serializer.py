from rest_framework import serializers
from .models import Personal_income

class Personal_incomeSerializer(serializers.ModelSerializer):
   class Meta:
            model = Personal_income
            fields = '__all__'