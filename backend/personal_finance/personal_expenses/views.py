from django.shortcuts import render
from rest_framework import viewsets
from .models import Personal_expenses
from .serializer import Personal_expensesSerializer



class ExpensesViewSet(viewsets.ModelViewSet):
    queryset = Personal_expenses.objects.all()
    serializer_class = Personal_expensesSerializer



    