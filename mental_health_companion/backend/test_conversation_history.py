import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from chat.ai_service import get_ai_response

def test_conversation_history():
    print("🧪 Testing Conversation History with Gemini AI")
    print("=" * 50)
    
    # Simulate a conversation history
    conversation_history = [
        {'sender': 'bot', 'content': "Hello! I'm here to support you. I understand you're feeling happy. How can I help you today?"},
        {'sender': 'user', 'content': "Hi! I'm feeling really good today because I got a promotion at work!"},
        {'sender': 'bot', 'content': "That's absolutely wonderful news! 🎉 Congratulations on your promotion! I can feel your excitement and joy. What does this promotion mean to you?"},
        {'sender': 'user', 'content': "Thank you! It means I'll be leading a team now, which is both exciting and a bit scary."},
        {'sender': 'bot', 'content': "That's such a natural mix of emotions! 😊 Excitement and nervousness often go hand in hand with new opportunities. Leading a team is a big step! What part feels most exciting to you?"},
    ]
    
    # Test new message with conversation history
    new_message = "I'm most excited about mentoring junior developers and helping them grow."
    mood = "happy"
    
    print(f"Mood: {mood}")
    print(f"Conversation History ({len(conversation_history)} messages):")
    for i, msg in enumerate(conversation_history):
        print(f"  {i+1}. {msg['sender']}: {msg['content'][:60]}...")
    
    print(f"\nNew User Message: {new_message}")
    print("\nGenerating AI Response...")
    print("-" * 30)
    
    # Get AI response
    response = get_ai_response(mood, new_message, conversation_history)
    
    print(f"AI Response: {response}")
    print(f"Response Length: {len(response)} characters")
    
    # Test if response references previous conversation
    keywords_to_check = ['promotion', 'team', 'leading', 'mentor', 'junior', 'developers']
    referenced_keywords = [word for word in keywords_to_check if word.lower() in response.lower()]
    
    print(f"\nContext Analysis:")
    print(f"Keywords from conversation found in response: {referenced_keywords}")
    print(f"Context awareness: {'✅ Good' if len(referenced_keywords) > 0 else '❌ Poor'}")
    
    # Test another message
    print("\n" + "=" * 50)
    print("Testing Second Message in Conversation")
    print("=" * 50)
    
    # Add the previous response to history
    conversation_history.append({'sender': 'user', 'content': new_message})
    conversation_history.append({'sender': 'bot', 'content': response})
    
    second_message = "Actually, I'm a bit worried about managing people who are older than me."
    print(f"New User Message: {second_message}")
    print("\nGenerating AI Response...")
    print("-" * 30)
    
    second_response = get_ai_response(mood, second_message, conversation_history)
    
    print(f"AI Response: {second_response}")
    print(f"Response Length: {len(second_response)} characters")
    
    # Check if it references the concern about age
    age_keywords = ['older', 'age', 'managing', 'worry', 'concerned']
    age_references = [word for word in age_keywords if word.lower() in second_response.lower()]
    
    print(f"\nContext Analysis:")
    print(f"Age-related keywords found in response: {age_references}")
    print(f"Context awareness: {'✅ Good' if len(age_references) > 0 else '❌ Poor'}")

if __name__ == "__main__":
    test_conversation_history()