from rest_framework import serializers
from .models import Personal_expenses

class Personal_expensesSerializer(serializers.ModelSerializer):
   class Meta:
            model = Personal_expenses
            fields = '__all__'