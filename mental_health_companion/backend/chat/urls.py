from django.urls import path
from . import views

urlpatterns = [
    path('sessions/', views.get_sessions, name='get_sessions'),
    path('sessions/create/', views.create_session, name='create_session'),
    path('sessions/<int:session_id>/', views.get_session, name='get_session'),
    path('sessions/<int:session_id>/message/', views.send_message, name='send_message'),
    path('sessions/<int:session_id>/delete/', views.delete_session, name='delete_session'),
]
