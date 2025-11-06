# companion/models.py
from django.db import models
from django.conf import settings

class Message(models.Model):
    SENDER_CHOICES = (("user", "User"), ("ai", "AI"))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    text = models.TextField()
    mood_label = models.CharField(max_length=50, null=True, blank=True)
    mood_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.text[:40]}"
