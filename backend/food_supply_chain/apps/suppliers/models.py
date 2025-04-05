from django.db import models


class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self):
        return self.name
