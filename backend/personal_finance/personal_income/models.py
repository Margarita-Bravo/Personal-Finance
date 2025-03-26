from django.db import models
from datetime import datetime

# INGRESO PERSONAL
class Personal_income(models.Model):
     # monto
    amount=models.DecimalField(
        max_digits=10,  # Total de dígitos que pueden ser almacenados (incluidos los decimales)
        decimal_places=2,  # Número de decimales
        default=0.00, ) # Valor por defecto
    
    
    # fecha
    date=models.DateTimeField(default=datetime.now)


class Meta:
    db_table = "personal_income"
    verbose_name_plural = "personal_income"
    verbose_name = "personal_income"

    def __str__(self):
        return self.amount
