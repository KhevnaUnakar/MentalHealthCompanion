from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Article
from .serializers import ArticleSerializer
from .news_service import fetch_mental_health_news

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_articles(request):
    # Try to fetch fresh articles
    fetch_mental_health_news()
    
    articles = Article.objects.all()[:20]
    return Response(ArticleSerializer(articles, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def refresh_articles(request):
    fetch_mental_health_news(force=True)
    articles = Article.objects.all()[:20]
    return Response(ArticleSerializer(articles, many=True).data)
