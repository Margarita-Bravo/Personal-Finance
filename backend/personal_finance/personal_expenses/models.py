from django.db import models
from datetime import datetime

# GASTO PERSONAL
class Personal_expenses(models.Model):
    name=models.CharField(max_length=100)

    # metodo de pago
    method_of_payment=models.CharField(max_length=100)

    # fecha
    date=models.DateTimeField(default=datetime.now)

    # monto
    amount=models.DecimalField(
        max_digits=10,  # Total de dígitos que pueden ser almacenados (incluidos los decimales)
        decimal_places=2,  # Número de decimales
        default=0.00, ) # Valor por defecto
    



class Meta:
    db_table = "personal_expenses"
    verbose_name_plural = "personal_expenses"
    verbose_name = "personal_expenses"

    def __str__(self):
        return self.name
