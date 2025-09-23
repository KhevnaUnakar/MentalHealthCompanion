# MentalHealthCompanion
Mental Health Companion is a web-based application built with Django and AI that helps users reflect on their feelings through private journaling and AI-powered insights.

Users can chat about their emotions.

AI analyzes mood (happy, sad, anxious, etc.).

Personalized journaling prompts and coping tips are provided.

Django manages secure sessions and user data privately.

⚠️ Disclaimer: This project is for educational purposes only. It is not a substitute for professional therapy or medical help.

🚀 Installation & Setup
1. Clone the Repository
git clone https://github.com/your-username/MentalHealthCompanion.git
cd MentalHealthCompanion

2. Create & Activate Virtual Environment
python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows

3. Install Dependencies
pip install -r requirements.txt

4. Apply Migrations
python manage.py migrate

5. Run the Development Server
python manage.py runserver

🧪 AI Integration

Mood Analysis: Emotion classification using Hugging Face models (transformers).

Prompt Generation: OpenAI API or local LLM model for journaling prompts.

Future Scope: Voice input (speech-to-text), sentiment graphs, mindfulness content.


Now open http://localhost:8000
 in your browser.
