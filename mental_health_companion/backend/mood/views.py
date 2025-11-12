from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from datetime import datetime, timedelta
from .models import MoodEntry
from .serializers import MoodEntrySerializer
from .mood_analyzer import analyze_mood_from_text

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def track_mood(request):
    mood = request.data.get('mood')
    notes = request.data.get('notes', '')
    
    # Analyze mood from text if provided
    if notes and not mood:
        mood = analyze_mood_from_text(notes)
    
    entry = MoodEntry.objects.create(
        user=request.user,
        mood=mood,
        notes=notes
    )
    return Response(MoodEntrySerializer(entry).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mood_history(request):
    days = int(request.query_params.get('days', 30))
    start_date = datetime.now() - timedelta(days=days)
    
    entries = MoodEntry.objects.filter(
        user=request.user,
        created_at__gte=start_date
    )
    return Response(MoodEntrySerializer(entries, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mood_analytics(request):
    days = int(request.query_params.get('days', 30))
    start_date = datetime.now() - timedelta(days=days)
    
    mood_counts = MoodEntry.objects.filter(
        user=request.user,
        created_at__gte=start_date
    ).values('mood').annotate(count=Count('mood'))
    
    total = sum(item['count'] for item in mood_counts)
    
    analytics = {
        'mood_distribution': [
            {
                'mood': item['mood'],
                'count': item['count'],
                'percentage': round((item['count'] / total * 100), 2) if total > 0 else 0
            }
            for item in mood_counts
        ],
        'total_entries': total,
        'period_days': days
    }
    
    return Response(analytics)
