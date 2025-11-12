# companion/admin.py
from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "sender", "user", "mood_label", "mood_score", "created_at")
    list_filter = ("sender", "mood_label", "created_at")
