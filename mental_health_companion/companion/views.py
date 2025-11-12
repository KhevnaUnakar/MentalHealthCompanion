# companion/views.py
import json
import logging
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .ai import analyze_mood, generate_response
from .models import Message

logger = logging.getLogger(__name__)

@require_http_methods(["GET"])
def chat_page(request):
    """Render the chat UI"""
    return render(request, "chat.html", {})

@csrf_exempt
@require_http_methods(["POST"])
def chat_api(request):
    """
    POST JSON: { "message": "User text" }
    Response JSON: {
      "user_message": "...",
      "ai_response": "...",
      "mood": {"label": "...", "score": 0.9}
    }
    """
    try:
        payload = json.loads(request.body.decode("utf-8"))
        user_message = payload.get("message", "").strip()
        
        if not user_message:
            return JsonResponse({"error": "Empty message"}, status=400)
        
        if len(user_message) > 2000:
            return JsonResponse({"error": "Message too long. Please keep it under 2000 characters."}, status=400)

        # Analyze mood
        mood = analyze_mood(user_message)

        # Save user message
        Message.objects.create(
            sender="user", 
            text=user_message, 
            mood_label=mood.get("label"), 
            mood_score=mood.get("score")
        )

        # Generate AI response
        ai_text = generate_response(user_message)

        # Save AI message
        Message.objects.create(sender="ai", text=ai_text)

        return JsonResponse({
            "user_message": user_message,
            "ai_response": ai_text,
            "mood": mood
        })
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request")
        return JsonResponse({"error": "Invalid JSON format"}, status=400)
    except Exception as e:
        logger.error(f"Error in chat_api: {str(e)}", exc_info=True)
        return JsonResponse({
            "error": "An error occurred while processing your message. Please try again."
        }, status=500)
