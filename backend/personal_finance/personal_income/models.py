from django.db import models

# INGRESO PERSONAL

class Personal_income(models.Model):
    nombre = models.CharField(max_length=100)


    def __str__(self):
        return self.nombre
