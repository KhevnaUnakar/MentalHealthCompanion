import openai
import os
from dotenv import load_dotenv

load_dotenv('.env')

openai.api_key = os.getenv('OPENAI_API_KEY')

print(f"Testing OpenAI API...")
print(f"API Key: {openai.api_key[:20]}...")

try:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello!"}
        ],
        max_tokens=50
    )
    print("✅ SUCCESS! OpenAI API is working!")
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"❌ ERROR: {type(e).__name__}")
    print(f"Details: {str(e)}")
