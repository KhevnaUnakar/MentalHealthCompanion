# companion/admin.py
from django.contrib import admin
from .models import Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'text_preview', 'mood_label', 'mood_score', 'created_at')
    list_filter = ('sender', 'mood_label', 'created_at')
    search_fields = ('text',)
    readonly_fields = ('created_at',)
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Message'
