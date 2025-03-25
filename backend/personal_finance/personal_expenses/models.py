from django.db import models
# GASTO PERSONAL
class Personal_expenses(models.Model):
    nombre=models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
