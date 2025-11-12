import openai
from django.conf import settings
import logging
import random

logger = logging.getLogger(__name__)

# Set OpenAI API key
openai.api_key = settings.OPENAI_API_KEY

MOOD_PROMPTS = {
    'happy': "You are a supportive therapist. The user is feeling happy. Engage positively and help them reflect on their joy.",
    'sad': "You are a compassionate therapist. The user is feeling sad. Provide empathy, validation, and gentle support.",
    'anxious': "You are a calming therapist. The user is feeling anxious. Help them feel grounded and offer coping strategies.",
    'angry': "You are an understanding therapist. The user is feeling angry. Help them process their emotions safely.",
    'stressed': "You are a supportive therapist. The user is feeling stressed. Offer relaxation techniques and perspective.",
    'neutral': "You are a friendly therapist. Engage in supportive conversation and help the user explore their feelings."
}

# Fallback responses when OpenAI is unavailable
FALLBACK_RESPONSES = {
    'happy': [
        "That's wonderful to hear! What's been bringing you joy lately? I'd love to hear more about what's making you feel this way.",
        "I'm so glad you're feeling happy! Can you share what's been going well for you? Sometimes reflecting on positive moments helps us appreciate them even more.",
        "It's great that you're in a good place right now. What activities or people have been contributing to your happiness?"
    ],
    'sad': [
        "I hear you, and I want you to know that it's okay to feel sad. Your feelings are valid. Would you like to talk about what's been weighing on your heart?",
        "Thank you for sharing that with me. Sadness is a natural emotion, and I'm here to support you through it. What's been on your mind?",
        "I'm here for you. Sometimes just talking about what's making us sad can help. Would you like to share more about how you're feeling?"
    ],
    'anxious': [
        "I understand that anxiety can feel overwhelming. Let's take this one step at a time. Can you tell me what's been making you feel anxious?",
        "Anxiety is challenging, but you're not alone. I'm here to help. What thoughts or situations have been triggering these feelings?",
        "Thank you for trusting me with this. Let's work through this together. What's been causing you the most worry lately?"
    ],
    'angry': [
        "I hear that you're feeling angry, and that's completely valid. Anger often tells us something important. What's been frustrating you?",
        "It's okay to feel angry. Let's talk about what's been bothering you. Sometimes expressing these feelings can help us understand them better.",
        "Thank you for being honest about your anger. I'm here to listen without judgment. What situation or person has been triggering these feelings?"
    ],
    'stressed': [
        "Stress can be really difficult to manage. I'm here to help you work through it. What's been causing you the most stress lately?",
        "I understand you're feeling overwhelmed. Let's break things down together. What are the main sources of stress in your life right now?",
        "Thank you for sharing. Stress affects us all. What would help you feel more balanced right now? Let's explore some strategies together."
    ],
    'neutral': [
        "I'm here to listen and support you. How has your day been? Is there anything on your mind you'd like to talk about?",
        "Thank you for reaching out. I'm here for you. What would you like to discuss today?",
        "I'm glad you're here. Sometimes it helps just to talk. What's been happening in your life lately?"
    ]
}

def get_fallback_response(mood, message):
    """Get a contextual fallback response when OpenAI is unavailable"""
    mood_key = mood.lower() if mood.lower() in FALLBACK_RESPONSES else 'neutral'
    responses = FALLBACK_RESPONSES[mood_key]
    
    # Try to make response contextual based on keywords
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['work', 'job', 'boss', 'colleague']):
        return f"I hear that work has been challenging. {random.choice(responses)} How is this affecting your daily life?"
    elif any(word in message_lower for word in ['family', 'parent', 'sibling', 'child']):
        return f"Family relationships can be complex. {random.choice(responses)} Would you like to explore this further?"
    elif any(word in message_lower for word in ['friend', 'relationship', 'partner']):
        return f"Relationships are important to our wellbeing. {random.choice(responses)} How long has this been affecting you?"
    else:
        return random.choice(responses)

def get_ai_response(mood, message, conversation_history=None):
    """Generate AI therapist response based on mood and message"""
    
    # Check if API key is set
    if not settings.OPENAI_API_KEY:
        logger.warning("OpenAI API key is not set, using fallback responses")
        return get_fallback_response(mood, message)
    
    system_prompt = MOOD_PROMPTS.get(mood.lower(), MOOD_PROMPTS['neutral'])
    system_prompt += " Keep responses empathetic, supportive, and under 150 words. Ask open-ended questions."
    
    messages = [{"role": "system", "content": system_prompt}]
    
    if conversation_history:
        for msg in conversation_history[-6:]:  # Last 6 messages for context
            role = "user" if msg['sender'] == 'user' else "assistant"
            messages.append({"role": role, "content": msg['content']})
    
    messages.append({"role": "user", "content": message})
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=200,
            temperature=0.7
        )
        return response.choices[0].message.content
    except openai.error.AuthenticationError as e:
        logger.error(f"OpenAI Authentication Error: {e}")
        return get_fallback_response(mood, message) + "\n\n(Note: Please check your OpenAI API key and billing settings at https://platform.openai.com/account/billing)"
    except openai.error.RateLimitError as e:
        logger.warning(f"OpenAI Rate Limit Error: {e}")
        return get_fallback_response(mood, message) + "\n\n(Note: OpenAI API quota exceeded. Please add credits at https://platform.openai.com/account/billing)"
    except openai.error.APIError as e:
        logger.error(f"OpenAI API Error: {e}")
        return get_fallback_response(mood, message)
    except Exception as e:
        logger.error(f"Unexpected error in AI service: {type(e).__name__} - {e}")
        return get_fallback_response(mood, message)
