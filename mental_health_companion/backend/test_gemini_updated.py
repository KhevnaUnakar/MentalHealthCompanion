import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key loaded: {'Yes' if api_key else 'No'}")

if api_key:
    genai.configure(api_key=api_key)
    
    try:
        # Test the models we're using in the AI service
        model_names = ['models/gemini-2.5-flash', 'models/gemini-2.0-flash', 'gemini-flash-latest']
        
        for model_name in model_names:
            try:
                print(f"\n🧪 Testing model: {model_name}")
                model = genai.GenerativeModel(model_name)
                
                test_prompt = """
                You are a very friendly, warm, and supportive mental health companion. 
                The user is feeling happy and just said: "I had a great day at work today!"
                
                Previous conversation context:
                User: Hi, I'm feeling pretty good today
                Assistant: That's wonderful to hear! I'm so glad you're feeling good today. What's been contributing to your positive mood?
                
                Respond with genuine enthusiasm, reference the previous conversation, and ask a follow-up question. Use emojis and keep it under 100 words.
                """
                
                response = model.generate_content(
                    test_prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.8,
                        max_output_tokens=150,
                        top_p=0.9,
                    )
                )
                
                if response.text:
                    print(f"✅ SUCCESS! Model {model_name} is working!")
                    print(f"Response: {response.text}")
                    print(f"Response length: {len(response.text)} characters")
                    break
                else:
                    print(f"❌ No response text from {model_name}")
                    
            except Exception as model_error:
                print(f"❌ Model {model_name} failed: {model_error}")
                continue
            
    except Exception as e:
        print(f"❌ ERROR: {type(e).__name__}")
        print(f"Details: {str(e)}")
else:
    print("❌ No API key found")