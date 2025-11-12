# Mental Health Companion 💙

A modern, AI-powered mental health companion web application built with Django. This application provides a safe, private space for users to express their feelings and receive empathetic AI-powered support.

## ✨ Features

- **Real-time Chat Interface**: Beautiful, responsive chat UI with smooth animations
- **AI-Powered Responses**: Empathetic responses using OpenAI's GPT-4o-mini
- **Mood Analysis**: Automatic sentiment analysis (Positive, Negative, Neutral)
- **Message History**: All conversations are stored securely in the database
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Crisis Detection**: Built-in safety disclaimers and crisis resource information

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/MentalHealthCompanion.git
cd MentalHealthCompanion
```

### 2. Create & Activate Virtual Environment
```bash
# Windows
python -m venv virtualenv
virtualenv\Scripts\activate

# Linux/Mac
python3 -m venv virtualenv
source virtualenv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the `mental_health_companion` directory:
```env
OPENAI_API_KEY=your-openai-api-key-here
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

### 5. Run Migrations
```bash
cd mental_health_companion
python manage.py migrate
```

### 6. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 7. Run the Development Server
```bash
python manage.py runserver
```

Now open http://localhost:8000 in your browser.

## 🎨 Frontend Features

- **Modern UI**: Clean, gradient-based design with smooth animations
- **Real-time Typing Indicators**: Shows when AI is generating a response
- **Mood Badges**: Visual indicators showing detected emotional state
- **Auto-scrolling**: Automatically scrolls to latest messages
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🧪 AI Integration

- **Mood Analysis**: Uses Hugging Face Transformers or OpenAI for sentiment classification
- **Response Generation**: OpenAI GPT-4o-mini generates empathetic, supportive responses
- **Fallback Handling**: Graceful degradation when AI services are unavailable
- **Safety Features**: Crisis detection and appropriate resource recommendations

## 📁 Project Structure

```
MentalHealthCompanion/
├── mental_health_companion/
│   ├── companion/              # Main Django app
│   │   ├── migrations/         # Database migrations
│   │   ├── templates/          # HTML templates
│   │   │   └── chat.html       # Main chat interface
│   │   ├── admin.py            # Admin configuration
│   │   ├── ai.py               # AI integration logic
│   │   ├── models.py           # Database models
│   │   ├── urls.py             # App URL routing
│   │   └── views.py            # View functions
│   ├── mental_health_companion/  # Project settings
│   │   ├── settings.py         # Django settings
│   │   ├── urls.py             # Main URL routing
│   │   └── wsgi.py             # WSGI configuration
│   ├── static/                 # Static files
│   │   ├── css/
│   │   │   └── style.css       # Main stylesheet
│   │   └── js/
│   │       └── chat.js         # Chat functionality
│   ├── .env                    # Environment variables
│   ├── db.sqlite3              # SQLite database
│   └── manage.py               # Django management script
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔒 Security Notes

- Never commit your `.env` file or API keys to version control
- Use strong `SECRET_KEY` in production
- Set `DEBUG=False` in production
- Configure proper `ALLOWED_HOSTS` for production deployment
- Implement CSRF protection for production (remove `@csrf_exempt`)
- Use HTTPS in production

## 🌐 Deployment

For production deployment:

1. Set environment variables properly
2. Use a production-grade database (PostgreSQL recommended)
3. Configure static file serving with WhiteNoise or CDN
4. Use Gunicorn or uWSGI as WSGI server
5. Set up reverse proxy with Nginx
6. Enable HTTPS with Let's Encrypt

## ⚠️ Important Disclaimer

**This project is for educational purposes only.** It is NOT a substitute for professional therapy, medical advice, or mental health treatment. 

If you or someone you know is in crisis:
- **US**: Call 988 (Suicide & Crisis Lifeline)
- **International**: Visit https://findahelpline.com

## 🛠️ Technologies Used

- **Backend**: Django 5.2.6, Django REST Framework
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **AI**: OpenAI GPT-4o-mini, Hugging Face Transformers
- **Database**: SQLite (development), PostgreSQL (recommended for production)

## 📝 Future Enhancements

- User authentication and personal chat history
- Voice input (speech-to-text)
- Sentiment trend graphs and analytics
- Journaling prompts and coping strategies
- Mindfulness exercises and resources
- Multi-language support
- Export chat history

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.
