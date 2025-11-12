# MentalHealthCompanion
Mental Health Companion is a web-based application built with Django and AI that helps users reflect on their feelings through private journaling and AI-powered insights.

Users can chat about their emotions.

AI analyzes mood (happy, sad, anxious, etc.).

Personalized journaling prompts and coping tips are provided.

Django manages secure sessions and user data privately.

⚠️ Disclaimer: This project is for educational purposes only. It is not a substitute for professional therapy or medical help.


**🚀 Installation & Setup**
1. Clone the Repository
```bash
git clone https://github.com/your-username/MentalHealthCompanion.git
cd MentalHealthCompanion
```

2. Create & Activate Virtual Environment
```bash
python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows
```

3. Install Dependencies
```bash
pip install -r requirements.txt
```

4. Configure Environment Variables
- Copy `mental_health_companion/.env` and update with your actual OpenAI API key
- Generate a new Django SECRET_KEY for production use

5. Navigate to Django Project Directory
```bash
cd mental_health_companion
```

6. Apply Migrations
```bash
python manage.py migrate
```

7. Run the Development Server
```bash
python manage.py runserver
```

**🧪 AI Integration**

Mood Analysis: Emotion classification using Hugging Face models (transformers).

Prompt Generation: OpenAI API or local LLM model for journaling prompts.

Future Scope: Voice input (speech-to-text), sentiment graphs, mindfulness content.


Now open http://localhost:8000
 in your browser.

**🔧 Configuration Notes**

- **API Key Security**: Never commit your actual OpenAI API key to version control
- **Environment Variables**: Update the `.env` file with your actual values before running
- **CSRF Protection**: The application now includes proper CSRF protection for security
- **Database**: Uses SQLite by default for development; consider PostgreSQL for production
- **Static Files**: Run `python manage.py collectstatic` before deploying to production

**🛡️ Security Considerations**

- Generate a strong SECRET_KEY for production
- Set DEBUG=False in production
- Configure proper ALLOWED_HOSTS for your domain
- Use HTTPS in production
- Consider implementing rate limiting for the chat API
- Regular security updates for dependencies