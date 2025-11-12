# companion/ai.py
import os
import json
import logging
from typing import Optional

try:
    from openai import OpenAI
except Exception:
    OpenAI = None  # openai package may be unavailable in some environments


def _get_openai_client() -> Optional[object]:
    """Return an OpenAI client if the package is available and API key is set.
    Caller should handle None (no client) as meaning fallback behavior is required.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or OpenAI is None:
        return None
    try:
        return OpenAI(api_key=api_key)
    except Exception as e:
        logging.info("Could not initialize OpenAI client: %s", e)
        return None

# Try to load Hugging Face sentiment pipeline (optional, may be heavy)
sentiment_pipeline = None
try:
    from transformers import pipeline
    sentiment_pipeline = pipeline("sentiment-analysis")
except Exception as e:
    logging.info("Transformers sentiment pipeline unavailable; falling back to OpenAI-based sentiment. Exception: %s", str(e))
    sentiment_pipeline = None

def analyze_mood(user_input: str) -> dict:
    """
    Returns a dict: {'label': 'POSITIVE'|'NEGATIVE'|'NEUTRAL', 'score': float}
    Tries HF pipeline first, then falls back to OpenAI classification prompt.
    """
    if sentiment_pipeline:
        res = sentiment_pipeline(user_input)[0]
        return {"label": res.get("label"), "score": float(res.get("score", 0.0))}

    # fallback: try OpenAI classification if available
    client = _get_openai_client()
    if client is not None:
        prompt = (
            "Classify the sentiment of the text that follows into Positive, Neutral, or Negative. "
            "Return strictly JSON like: {\"label\": \"Positive\", \"score\": 0.83}\n\n"
            f"Text: \"{user_input}\""
        )
        try:
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=60,
                temperature=0.0
            )
            content = resp.choices[0].message.content.strip()
            parsed = json.loads(content)
            return {
                "label": parsed.get("label", "Neutral"),
                "score": float(parsed.get("score", 0.0))
            }
        except Exception as e:
            logging.info("OpenAI sentiment classification failed: %s", e)

    # last-resort naive parse
    text = user_input.lower()
    if any(x in text for x in ["sad", "depressed", "suicid", "hopeless", "angry"]):
        return {"label": "Negative", "score": 0.9}
    if any(x in text for x in ["okay", "fine", "neutral", "so-so", "meh"]):
        return {"label": "Neutral", "score": 0.6}
    return {"label": "Positive", "score": 0.7}

def generate_response(user_input: str, conversation_history: list = None, max_tokens: int = 200) -> str:
    """
    conversation_history is a list of dict messages in chat format (role/content)
    """

    system_prompt = (
        "You are a compassionate, nonjudgmental mental health companion. "
        "Respond with empathy and supportive language. Do NOT provide medical or legal advice. "
        "If the user mentions self-harm, suicidal intent, or imminent danger, encourage them to seek immediate help and provide crisis resources. "
        "Keep replies short and clear (one or two paragraphs)."
    )

    messages = [{"role": "system", "content": system_prompt}]
    if conversation_history:
        messages.extend(conversation_history)
    messages.append({"role": "user", "content": user_input})

    client = _get_openai_client()
    if client is None:
        # No OpenAI client available: return a safe, empathetic fallback response.
        return (
            "Thanks for sharing — I'm here to listen. "
            "It sounds like you're going through something important. Can you tell me more?"
        )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.7,
        )
        ai_text = response.choices[0].message.content.strip()
        return ai_text
    except Exception as e:
        logging.info("OpenAI generate_response failed: %s", e)
        return (
            "I'm having trouble generating a detailed response right now, "
            "but I'm here to listen. Could you say a bit more about how you're feeling?"
        )
