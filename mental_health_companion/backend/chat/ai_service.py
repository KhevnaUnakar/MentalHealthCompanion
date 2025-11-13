import google.generativeai as genai
from django.conf import settings
import logging
import random

logger = logging.getLogger(__name__)

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

MOOD_PROMPTS = {
    'happy': """You are a warm, friendly, and supportive mental health companion. The user is feeling happy! 
    Respond with genuine enthusiasm and joy. Use emojis, exclamation points, and positive language. 
    Help them celebrate their happiness and reflect on what's bringing them joy. 
    Ask engaging questions about their positive experiences. Keep responses under 150 words and very conversational.""",
    
    'sad': """You are a compassionate, gentle, and caring mental health companion. The user is feeling sad. 
    Respond with deep empathy, warmth, and understanding. Use soft, comforting language. 
    Validate their feelings completely and offer gentle support. Let them know they're not alone. 
    Ask caring questions to help them express their feelings. Keep responses under 150 words and very nurturing.""",
    
    'anxious': """You are a calming, reassuring, and patient mental health companion. The user is feeling anxious. 
    Respond with a soothing, peaceful tone. Use calming language and gentle reassurance. 
    Help them feel grounded and safe. Offer simple, practical coping strategies. 
    Remind them that anxiety is temporary and they can get through this. Keep responses under 150 words and very supportive.""",
    
    'angry': """You are an understanding, non-judgmental, and patient mental health companion. The user is feeling angry. 
    Respond with complete acceptance and understanding. Validate their anger as normal and okay. 
    Help them process these feelings safely without judgment. Use calm, steady language. 
    Ask gentle questions to help them explore what's underneath the anger. Keep responses under 150 words and very accepting.""",
    
    'stressed': """You are a supportive, understanding, and helpful mental health companion. The user is feeling stressed. 
    Respond with empathy and practical support. Acknowledge how overwhelming stress can feel. 
    Offer gentle relaxation techniques and perspective. Use encouraging, hopeful language. 
    Help them break things down into manageable pieces. Keep responses under 150 words and very encouraging.""",
    
    'neutral': """You are a friendly, warm, and engaging mental health companion. 
    Respond with genuine interest and care. Use a conversational, approachable tone. 
    Help them explore their feelings and thoughts in a safe space. Ask open-ended questions. 
    Be curious about their experiences and show that you truly care. Keep responses under 150 words and very personable."""
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

# Friendly fallback responses for when API is unavailable
FRIENDLY_FALLBACK_RESPONSES = {
    'happy': [
        "That's absolutely wonderful to hear! 😊 Your happiness is contagious! What's been bringing you the most joy lately? I'd love to celebrate with you!",
        "I'm so thrilled that you're feeling happy! 🌟 There's nothing better than hearing someone share their joy. What amazing things have been happening in your life?",
        "Your happiness just made my day brighter! ✨ I can feel your positive energy through your words. Tell me more about what's making you feel so good!"
    ],
    'sad': [
        "I'm here with you, and I want you to know that your feelings are completely valid. 💙 It takes courage to share when you're feeling sad. What's been weighing on your heart?",
        "Thank you for trusting me with your feelings. I can sense you're going through a difficult time, and I want you to know you're not alone. Would you like to talk about what's making you feel this way?",
        "I hear you, and I'm sending you so much care and compassion right now. 🤗 Sadness is a natural part of being human. What would help you feel a little bit of comfort today?"
    ],
    'anxious': [
        "I can feel that you're feeling anxious, and I want you to know that's completely okay. 🌸 Let's take this one breath at a time. What's been making you feel worried lately?",
        "Anxiety can feel so overwhelming, but you're incredibly brave for reaching out. 💚 I'm right here with you. What thoughts have been racing through your mind?",
        "You're safe here with me. 🕊️ Anxiety is tough, but you're tougher. Let's work through this together. What's been triggering these anxious feelings for you?"
    ],
    'angry': [
        "I hear your anger, and it's completely valid to feel this way. 🔥 Anger often tells us something important about our boundaries. What's been frustrating you?",
        "Thank you for being honest about your anger. It takes strength to acknowledge these feelings. 💪 I'm here to listen without any judgment. What's been making you feel this way?",
        "Your anger is telling you something important, and I want to understand. 🤝 You're in a safe space here. What situation or person has been triggering these feelings?"
    ],
    'stressed': [
        "I can feel how overwhelmed you must be feeling right now. 🌊 Stress can be so heavy to carry. I'm here to help you sort through this. What's been piling up for you lately?",
        "Stress is exhausting, and you're doing your best to handle everything. 🌱 Let's break things down together. What are the main things that have been stressing you out?",
        "You're carrying a lot right now, and that's really hard. 💜 I'm here to support you through this. What would help you feel even just a little bit lighter today?"
    ],
    'neutral': [
        "Hi there! I'm so glad you're here. 😊 I'm here to listen and support you in whatever way you need. How has your day been treating you?",
        "Welcome! It's wonderful to connect with you. 🌟 I'm here as your supportive companion. What's on your mind today?",
        "Hello! I'm really happy you decided to reach out. 💙 This is your safe space to share anything. What would you like to talk about?"
    ]
}

def get_friendly_fallback_response(mood, message):
    """Get a very friendly contextual fallback response that feels personalized"""
    mood_key = mood.lower() if mood.lower() in FRIENDLY_FALLBACK_RESPONSES else 'neutral'
    base_responses = FRIENDLY_FALLBACK_RESPONSES[mood_key]
    
    # Make response contextual and personalized based on their actual message
    message_lower = message.lower()
    
    # Try to reflect back what they said to show we're listening
    if len(message.split()) > 3:  # If they gave us enough to work with
        if any(word in message_lower for word in ['work', 'job', 'boss', 'colleague', 'office', 'meeting']):
            return f"I hear that work has been on your mind. {random.choice(base_responses)} What's been happening at work that's affecting you? 💼"
        elif any(word in message_lower for word in ['family', 'parent', 'sibling', 'child', 'mom', 'dad', 'mother', 'father']):
            return f"Family situations can bring up so many emotions. {random.choice(base_responses)} Tell me more about what's going on with your family. 👨‍👩‍👧‍👦"
        elif any(word in message_lower for word in ['friend', 'relationship', 'partner', 'boyfriend', 'girlfriend', 'dating']):
            return f"Relationships can be both wonderful and challenging. {random.choice(base_responses)} What's been happening in your relationships? 💕"
        elif any(word in message_lower for word in ['school', 'study', 'exam', 'test', 'homework', 'college', 'university']):
            return f"School can be so demanding and stressful. {random.choice(base_responses)} What's been the most challenging part of your studies? 📚"
        elif any(word in message_lower for word in ['tired', 'exhausted', 'sleep', 'insomnia']):
            return f"Being tired can make everything feel harder. {random.choice(base_responses)} How has your sleep been lately? 😴"
        elif any(word in message_lower for word in ['money', 'financial', 'bills', 'debt', 'expensive']):
            return f"Financial stress can be really overwhelming. {random.choice(base_responses)} What's been weighing on you financially? 💰"
        elif any(word in message_lower for word in ['health', 'sick', 'doctor', 'hospital', 'pain']):
            return f"Health concerns can be so scary and stressful. {random.choice(base_responses)} How are you taking care of yourself? 🏥"
    
    # If we can't find specific context, give a more general but still personalized response
    if mood_key == 'happy':
        return f"I love hearing positive energy in your message! {random.choice(base_responses)} What's been the highlight of your day? ✨"
    elif mood_key == 'sad':
        return f"I can sense you're going through a tough time right now. {random.choice(base_responses)} What's been weighing on your heart? 💙"
    elif mood_key == 'anxious':
        return f"I can feel some worry in your words. {random.choice(base_responses)} What thoughts have been racing through your mind? 🌸"
    elif mood_key == 'angry':
        return f"I hear some frustration in what you're sharing. {random.choice(base_responses)} What's been making you feel this way? 🔥"
    elif mood_key == 'stressed':
        return f"It sounds like you have a lot on your plate right now. {random.choice(base_responses)} What's been the most overwhelming part? 🌊"
    else:
        return f"Thank you for sharing with me. {random.choice(base_responses)} What's been on your mind today? 💭"

def get_ai_response(mood, message, conversation_history=None):
    """Generate friendly AI therapist response using Google Gemini"""
    
    # Check if API key is set
    if not settings.GEMINI_API_KEY:
        logger.warning("Gemini API key is not set, using friendly fallback responses")
        return get_friendly_fallback_response(mood, message)
    
    try:
        # Initialize the Gemini model with working model
        model = genai.GenerativeModel('models/gemini-2.0-flash')
        
        # Get mood-specific prompt
        system_prompt = MOOD_PROMPTS.get(mood.lower(), MOOD_PROMPTS['neutral'])
        
        # Build conversation context
        conversation_context = ""
        if conversation_history and len(conversation_history) > 1:
            # Get the last 6 messages (3 exchanges) for better context, excluding the current message
            recent_history = conversation_history[-7:-1] if len(conversation_history) > 6 else conversation_history[:-1]
            for msg in recent_history:
                role = "User" if msg['sender'] == 'user' else "Assistant"
                conversation_context += f"{role}: {msg['content']}\n"
        
        # Create a more dynamic and personalized prompt
        full_prompt = f"""
{system_prompt}

Context: You are chatting with someone who selected "{mood}" as their current mood.

{f"Previous conversation context:\n{conversation_context}" if conversation_context else "This is the start of a new conversation."}

User just said: "{message}"

Instructions:
- Build on our previous conversation naturally
- Respond directly to what they said with genuine understanding
- Reference previous topics if relevant to show you remember
- Match their energy level and mood appropriately  
- Ask thoughtful follow-up questions about their specific situation
- Use their exact words when reflecting back to show you're listening
- Be conversational and natural, like a caring friend who remembers what they shared
- Use emojis sparingly but meaningfully
- Keep response under 120 words
- Make each response unique and personalized to their message and our conversation history

Respond now:
"""
        
        # Generate response with safety settings
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.8,
                max_output_tokens=150,
                top_p=0.9,
            )
        )
        
        if response.text and len(response.text.strip()) > 10:
            return response.text.strip()
        else:
            logger.warning("Gemini returned empty or very short response, using fallback")
            return get_friendly_fallback_response(mood, message)
            
    except Exception as e:
        logger.error(f"Gemini API Error: {type(e).__name__} - {e}")
        # For debugging, let's see what the actual error is
        print(f"DEBUG: Gemini API Error: {e}")
        return get_friendly_fallback_response(mood, message)
