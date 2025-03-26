from django.shortcuts import render
from rest_framework import viewsets
from .models import Personal_income
from .serializer import Personal_incomeSerializer



class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Personal_income.objects.all()
    serializer_class = Personal_incomeSerializer