import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env')

# Configure Gemini API
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
print(f"API Key starts with: {api_key[:20] if api_key else 'None'}...")

if api_key:
    genai.configure(api_key=api_key)
    
    try:
        # First, let's see what models are available
        print("\n📋 Available models:")
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"  - {model.name}")
        
        # Try different model names
        model_names = ['gemini-pro', 'models/gemini-pro', 'models/gemini-1.5-flash', 'gemini-1.5-flash']
        
        for model_name in model_names:
            try:
                print(f"\n🧪 Testing model: {model_name}")
                model = genai.GenerativeModel(model_name)
                
                test_prompt = """
                You are a very friendly, warm, and supportive mental health companion. 
                The user is feeling happy and just said: "I had a great day at work today!"
                
                Respond with genuine enthusiasm and ask a follow-up question. Use emojis and keep it under 100 words.
                """
                
                response = model.generate_content(test_prompt)
                
                if response.text:
                    print(f"✅ SUCCESS! Model {model_name} is working!")
                    print(f"Response: {response.text}")
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