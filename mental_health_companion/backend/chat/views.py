from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatSession, Message
from .serializers import ChatSessionSerializer, MessageSerializer
from .ai_service import get_ai_response
from mood.models import MoodEntry

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_session(request):
    mood = request.data.get('mood', 'neutral')
    session = ChatSession.objects.create(user=request.user, mood=mood)
    
    # Create mood entry for tracking
    MoodEntry.objects.create(
        user=request.user,
        mood=mood,
        notes=f"Started chat session with {mood} mood"
    )
    
    # Initial greeting from bot
    greeting = f"Hello! I'm here to support you. I understand you're feeling {mood}. How can I help you today?"
    Message.objects.create(session=session, sender='bot', content=greeting)
    
    return Response(ChatSessionSerializer(session).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sessions(request):
    sessions = ChatSession.objects.filter(user=request.user)
    return Response(ChatSessionSerializer(sessions, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_session(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
        return Response(ChatSessionSerializer(session).data)
    except ChatSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
    except ChatSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user_message = request.data.get('message', '')
    if not user_message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Save user message
    Message.objects.create(session=session, sender='user', content=user_message)
    
    # Get conversation history
    history = list(session.messages.values('sender', 'content'))
    
    # Generate AI response
    ai_response = get_ai_response(session.mood, user_message, history)
    
    # Save bot message
    bot_message = Message.objects.create(session=session, sender='bot', content=ai_response)
    
    return Response({
        'user_message': MessageSerializer(session.messages.filter(sender='user').last()).data,
        'bot_message': MessageSerializer(bot_message).data
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_session(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
        session.delete()
        return Response({'message': 'Session deleted'}, status=status.HTTP_204_NO_CONTENT)
    except ChatSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
