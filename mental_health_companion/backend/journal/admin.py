from django.contrib import admin
from .models import JournalEntry, MeditationSession, SelfCareActivity

admin.site.register(JournalEntry)
admin.site.register(MeditationSession)
admin.site.register(SelfCareActivity)
