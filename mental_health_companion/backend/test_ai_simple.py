import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

def test_conversation_with_history():
    print("🧪 Testing Conversation History with Gemini AI")
    print("=" * 50)
    
    # Initialize the model
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    
    # Simulate conversation history
    conversation_context = """User: Hi! I'm feeling really good today because I got a promotion at work!
Assistant: That's absolutely wonderful news! 🎉 Congratulations on your promotion! I can feel your excitement and joy. What does this promotion mean to you?
User: Thank you! It means I'll be leading a team now, which is both exciting and a bit scary.
Assistant: That's such a natural mix of emotions! 😊 Excitement and nervousness often go hand in hand with new opportunities. Leading a team is a big step! What part feels most exciting to you?"""
    
    # Test message
    new_message = "I'm most excited about mentoring junior developers and helping them grow."
    
    # Create prompt with conversation history
    full_prompt = f"""
You are a warm, friendly, and supportive mental health companion. The user is feeling happy! 
Respond with genuine enthusiasm and joy. Use emojis, exclamation points, and positive language. 
Help them celebrate their happiness and reflect on what's bringing them joy. 
Ask engaging questions about their positive experiences. Keep responses under 150 words and very conversational.

Context: You are chatting with someone who selected "happy" as their current mood.

Previous conversation context:
{conversation_context}

User just said: "{new_message}"

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
    
    print("Conversation Context:")
    print(conversation_context)
    print(f"\nNew Message: {new_message}")
    print("\nGenerating Response...")
    print("-" * 30)
    
    try:
        response = model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.8,
                max_output_tokens=150,
                top_p=0.9,
            )
        )
        
        if response.text:
            print(f"✅ AI Response: {response.text}")
            print(f"Response Length: {len(response.text)} characters")
            
            # Check for context awareness
            context_keywords = ['promotion', 'team', 'leading', 'mentor', 'junior', 'developers']
            found_keywords = [word for word in context_keywords if word.lower() in response.text.lower()]
            print(f"\nContext Keywords Found: {found_keywords}")
            print(f"Context Awareness: {'✅ Good' if len(found_keywords) > 0 else '❌ Poor'}")
            
        else:
            print("❌ No response generated")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_without_history():
    print("\n" + "=" * 50)
    print("🧪 Testing WITHOUT Conversation History")
    print("=" * 50)
    
    model = genai.GenerativeModel('models/gemini-2.0-flash')
    
    new_message = "I'm most excited about mentoring junior developers and helping them grow."
    
    # Create prompt without conversation history
    simple_prompt = f"""
You are a warm, friendly, and supportive mental health companion. The user is feeling happy! 
Respond with genuine enthusiasm and joy. Use emojis, exclamation points, and positive language. 
Help them celebrate their happiness and reflect on what's bringing them joy. 
Ask engaging questions about their positive experiences. Keep responses under 150 words and very conversational.

Context: You are chatting with someone who selected "happy" as their current mood.

This is the start of a new conversation.

User just said: "{new_message}"

Instructions:
- Respond directly to what they said with genuine understanding
- Match their energy level and mood appropriately  
- Ask thoughtful follow-up questions about their specific situation
- Use their exact words when reflecting back to show you're listening
- Be conversational and natural, like a caring friend
- Use emojis sparingly but meaningfully
- Keep response under 120 words
- Make each response unique and personalized to their message

Respond now:
"""
    
    print(f"Message: {new_message}")
    print("\nGenerating Response...")
    print("-" * 30)
    
    try:
        response = model.generate_content(
            simple_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.8,
                max_output_tokens=150,
                top_p=0.9,
            )
        )
        
        if response.text:
            print(f"✅ AI Response: {response.text}")
            print(f"Response Length: {len(response.text)} characters")
            
        else:
            print("❌ No response generated")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_conversation_with_history()
    test_without_history()