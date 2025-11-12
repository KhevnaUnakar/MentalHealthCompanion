from django.urls import path
from . import views

urlpatterns = [
    path('track/', views.track_mood, name='track_mood'),
    path('history/', views.mood_history, name='mood_history'),
    path('analytics/', views.mood_analytics, name='mood_analytics'),
]
