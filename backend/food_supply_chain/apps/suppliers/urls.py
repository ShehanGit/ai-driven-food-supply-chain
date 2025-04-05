# food_supply_chain/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/suppliers/', include('apps.suppliers.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/logistics/', include('apps.logistics.urls')),
]
