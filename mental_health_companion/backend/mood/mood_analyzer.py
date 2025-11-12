import re

MOOD_KEYWORDS = {
    'happy': ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'good', 'cheerful'],
    'sad': ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'crying', 'tears'],
    'anxious': ['anxious', 'worried', 'nervous', 'panic', 'fear', 'scared', 'stress'],
    'angry': ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed'],
    'stressed': ['stressed', 'overwhelmed', 'pressure', 'tired', 'exhausted', 'busy'],
}

def analyze_mood_from_text(text):
    """Analyze text to determine mood"""
    text_lower = text.lower()
    mood_scores = {mood: 0 for mood in MOOD_KEYWORDS}
    
    for mood, keywords in MOOD_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                mood_scores[mood] += 1
    
    max_mood = max(mood_scores, key=mood_scores.get)
    return max_mood if mood_scores[max_mood] > 0 else 'neutral'
