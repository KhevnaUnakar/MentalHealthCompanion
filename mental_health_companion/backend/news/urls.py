from django.urls import path
from . import views

urlpatterns = [
    path('articles/', views.get_articles, name='get_articles'),
    path('articles/refresh/', views.refresh_articles, name='refresh_articles'),
]
