from rest_framework import serializers
from .models import JournalEntry, MeditationSession, SelfCareActivity

class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ('id', 'title', 'content', 'mood', 'tags', 'is_favorite', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class MeditationSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeditationSession
        fields = ('id', 'session_type', 'duration', 'notes', 'created_at')
        read_only_fields = ('id', 'created_at')

class SelfCareActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = SelfCareActivity
        fields = ('id', 'activity_type', 'title', 'description', 'completed', 'scheduled_date', 'completed_at')
        read_only_fields = ('id', 'completed_at')
