import requests
from datetime import datetime, timedelta
from django.conf import settings
from .models import Article

NEWS_API_KEY = settings.NEWS_API_KEY
NEWS_API_URL = 'https://newsapi.org/v2/everything'

def fetch_mental_health_news(force=False):
    """Fetch mental health related news articles"""
    
    # Check if we have recent articles
    recent = Article.objects.filter(
        created_at__gte=datetime.now() - timedelta(hours=6)
    ).exists()
    
    if recent and not force:
        return
    
    try:
        params = {
            'q': 'mental health OR wellness OR mindfulness',
            'language': 'en',
            'sortBy': 'publishedAt',
            'pageSize': 20,
            'apiKey': NEWS_API_KEY
        }
        
        response = requests.get(NEWS_API_URL, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            for article_data in data.get('articles', []):
                Article.objects.get_or_create(
                    url=article_data['url'],
                    defaults={
                        'title': article_data.get('title', ''),
                        'description': article_data.get('description', ''),
                        'image_url': article_data.get('urlToImage'),
                        'source': article_data.get('source', {}).get('name', 'Unknown'),
                        'published_at': article_data.get('publishedAt', datetime.now())
                    }
                )
    except Exception as e:
        # Fallback: create sample articles if API fails
        if not Article.objects.exists():
            create_sample_articles()

def create_sample_articles():
    """Create sample articles for demo purposes"""
    samples = [
        {
            'title': '5 Ways to Improve Your Mental Health',
            'description': 'Discover practical strategies to enhance your mental wellbeing.',
            'url': 'https://example.com/article1',
            'source': 'Mental Health Today',
        },
        {
            'title': 'Understanding Anxiety: A Complete Guide',
            'description': 'Learn about anxiety disorders and effective coping mechanisms.',
            'url': 'https://example.com/article2',
            'source': 'Wellness Magazine',
        },
    ]
    
    for sample in samples:
        Article.objects.get_or_create(
            url=sample['url'],
            defaults={**sample, 'published_at': datetime.now()}
        )
