from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import JournalEntry, MeditationSession, SelfCareActivity
from .serializers import JournalEntrySerializer, MeditationSessionSerializer, SelfCareActivitySerializer

# Journal Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def journal_entries(request):
    if request.method == 'GET':
        entries = JournalEntry.objects.filter(user=request.user)
        serializer = JournalEntrySerializer(entries, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = JournalEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def journal_entry_detail(request, pk):
    try:
        entry = JournalEntry.objects.get(pk=pk, user=request.user)
    except JournalEntry.DoesNotExist:
        return Response({'error': 'Entry not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = JournalEntrySerializer(entry)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = JournalEntrySerializer(entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Meditation Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def meditation_sessions(request):
    if request.method == 'GET':
        sessions = MeditationSession.objects.filter(user=request.user)
        serializer = MeditationSessionSerializer(sessions, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = MeditationSessionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def meditation_stats(request):
    sessions = MeditationSession.objects.filter(user=request.user)
    total_sessions = sessions.count()
    total_minutes = sum(s.duration for s in sessions) // 60
    
    return Response({
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'recent_sessions': MeditationSessionSerializer(sessions[:5], many=True).data
    })

# Self-Care Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def selfcare_activities(request):
    if request.method == 'GET':
        activities = SelfCareActivity.objects.filter(user=request.user)
        serializer = SelfCareActivitySerializer(activities, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SelfCareActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_activity(request, pk):
    try:
        activity = SelfCareActivity.objects.get(pk=pk, user=request.user)
    except SelfCareActivity.DoesNotExist:
        return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)
    
    activity.completed = True
    activity.completed_at = timezone.now()
    activity.save()
    
    serializer = SelfCareActivitySerializer(activity)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_activity(request, pk):
    try:
        activity = SelfCareActivity.objects.get(pk=pk, user=request.user)
        activity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except SelfCareActivity.DoesNotExist:
        return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)
