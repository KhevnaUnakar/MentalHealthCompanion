from django.urls import path
from . import views

urlpatterns = [
    # Journal
    path('entries/', views.journal_entries, name='journal_entries'),
    path('entries/<int:pk>/', views.journal_entry_detail, name='journal_entry_detail'),
    
    # Meditation
    path('meditation/', views.meditation_sessions, name='meditation_sessions'),
    path('meditation/stats/', views.meditation_stats, name='meditation_stats'),
    
    # Self-Care
    path('selfcare/', views.selfcare_activities, name='selfcare_activities'),
    path('selfcare/<int:pk>/complete/', views.complete_activity, name='complete_activity'),
    path('selfcare/<int:pk>/delete/', views.delete_activity, name='delete_activity'),
]
