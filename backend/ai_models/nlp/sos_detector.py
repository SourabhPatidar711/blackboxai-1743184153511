import datetime
from transformers import pipeline
from flashtext import KeywordProcessor
from typing import Dict, List, Any

class SOSDetector:
    def __init__(self):
        # Load pre-trained disaster detection model
        self.classifier = pipeline(
            "text-classification",
            model="distilbert-base-uncased",
            top_k=2
        )
        self.keyword_processor = KeywordProcessor()
        self._initialize_keywords()

    def _initialize_keywords(self):
        """Initialize emergency keywords"""
        disaster_keywords = {
            'help': ['help', 'emergency', 'urgent'],
            'rescue': ['rescue', 'save', 'trapped'],
            'medical': ['injured', 'hurt', 'bleeding'],
            'fire': ['fire', 'burning', 'smoke'],
            'flood': ['flood', 'water', 'drowning']
        }
        for category, words in disaster_keywords.items():
            for word in words:
                self.keyword_processor.add_keyword(word, category)

    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyze text for emergency signals"""
        try:
            # Sentiment analysis
            sentiment_result = self.classifier(text)
            
            # Keyword extraction
            keywords_found = self.keyword_processor.extract_keywords(text)
            
            return {
                'success': True,
                'is_emergency': any(s['label'] == 'EMERGENCY' for s in sentiment_result),
                'keywords': list(set(keywords_found)),
                'sentiment': sentiment_result,
                'processed_at': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Singleton service instance
sos_detector = SOSDetector()