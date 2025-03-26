from django.contrib import admin


from .models import Personal_expenses


class Personal_expensesAdmin(admin.ModelAdmin):
    list_display = ('name','method_of_payment','date','amount')
    list_display_links =   ('name','method_of_payment','date','amount')
    search_fields =  ('name','method_of_payment','date','amount')
    list_per_page = 25


admin.site.register(Personal_expenses,Personal_expensesAdmin)







