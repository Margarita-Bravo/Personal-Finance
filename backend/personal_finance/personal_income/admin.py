from django.contrib import admin
from .models import Personal_income


class Personal_incomeAdmin(admin.ModelAdmin):
    list_display = ('amount','date')
    list_display_links =    ('amount','date')
    search_fields =   ('amount','date')
    list_per_page = 25


admin.site.register(Personal_income,Personal_incomeAdmin)

# Register your models here.
