from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import json

# local.ai configuration
LOCAL_AI_BASE_URL = 'http://localhost:8000'  # Your local.ai server
LOCAL_AI_ENDPOINT = f'{LOCAL_AI_BASE_URL}/api/generate'  # Adjust based on local.ai's actual endpoint

@api_view(['POST'])
def generate_text(request):
    """
    Handle AI text generation requests via local.ai
    Endpoint: POST /api/models/generate/
    """
    try:
        prompt = request.data.get('prompt', '')
        input_text = request.data.get('input', '')
        
        # Use prompt if available, otherwise use input
        text_to_process = prompt[0] if isinstance(prompt, list) and prompt else input_text
        
        if not text_to_process:
            return Response(
                {'error': 'No text provided. Please provide "prompt" or "input" field.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Call local.ai API
        try:
            # Prepare payload for local.ai
            payload = {
                'prompt': text_to_process,
                'max_tokens': 500,
                'temperature': 0.7,
            }
            
            # Make request to local.ai
            response = requests.post(
                LOCAL_AI_ENDPOINT,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                ai_response = response.json()
                # Extract the generated text from local.ai response
                result = ai_response.get('response', '') or ai_response.get('text', '') or ai_response.get('generated_text', '')
                
                return Response({'result': result}, status=status.HTTP_200_OK)
            else:
                # If local.ai fails, fall back to simple processing
                print(f"local.ai returned status {response.status_code}, using fallback")
                result = fallback_processing(text_to_process)
                return Response({'result': result, 'note': 'Using fallback processing'}, status=status.HTTP_200_OK)
                
        except requests.exceptions.ConnectionError:
            # local.ai is not running, use fallback
            print("Cannot connect to local.ai, using fallback processing")
            result = fallback_processing(text_to_process)
            return Response(
                {'result': result, 'warning': 'local.ai not available, using fallback processing'}, 
                status=status.HTTP_200_OK
            )
        except requests.exceptions.Timeout:
            return Response(
                {'error': 'local.ai request timed out'},
                status=status.HTTP_504_GATEWAY_TIMEOUT
            )
    
    except Exception as e:
        return Response(
            {'error': f'Processing failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def check_availability(request):
    """
    Check AI API availability (check if local.ai is running)
    Endpoint: GET /api/models/check/
    """
    # Check if local.ai is running
    try:
        response = requests.get(f'{LOCAL_AI_BASE_URL}/api/models/', timeout=2)
        local_ai_available = response.status_code == 200
    except:
        local_ai_available = False
    
    availability = {
        'summarizer': local_ai_available,
        'translator': local_ai_available,
        'writer': local_ai_available,
        'rewriter': local_ai_available,
        'languageModel': local_ai_available,
        'status': 'available' if local_ai_available else 'fallback',
        'backend': 'local.ai' if local_ai_available else 'django-fallback'
    }
    return Response(availability, status=status.HTTP_200_OK)


def fallback_processing(text):
    """
    Fallback processing when local.ai is not available
    Simple rule-based processing for demo purposes
    """
    import re
    
    text_lower = text.lower()
    
    # Detect request type
    if 'summarize' in text_lower:
        content = extract_content_after_colon(text)
        sentences = re.split(r'[.!?]+', content)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if len(sentences) <= 3:
            return '. '.join(sentences[:3]) + '.'
        else:
            return f"{sentences[0]}. {sentences[len(sentences)//2]}. {sentences[-1]}."
    
    elif 'fix grammar' in text_lower or 'proofread' in text_lower:
        content = extract_content_after_colon(text)
        # Simple grammar fixes
        corrected = re.sub(r'\s+', ' ', content)
        corrected = re.sub(r'([.!?])\s*([a-z])', lambda m: m.group(1) + ' ' + m.group(2).upper(), corrected)
        if corrected:
            corrected = corrected[0].upper() + corrected[1:]
        return corrected
    
    elif 'generate' in text_lower and 'question' in text_lower:
        content = extract_content_after_colon(text)
        sentences = re.split(r'[.!?]+', content)
        sentences = [s.strip() for s in sentences if s.strip() and len(s) > 20]
        
        questions = []
        for i, sentence in enumerate(sentences[:5], 1):
            questions.append(f"{i}. What is the main point about: {sentence[:50]}...?")
        
        return '\n'.join(questions) if questions else "1. What is the main topic?\n2. What are the key points?"
    
    elif 'simplify' in text_lower or 'rewrite' in text_lower:
        content = extract_content_after_colon(text)
        simplified = content
        simplified = re.sub(r'however', 'but', simplified, flags=re.IGNORECASE)
        simplified = re.sub(r'therefore', 'so', simplified, flags=re.IGNORECASE)
        return simplified
    
    else:
        return f"Processed text (fallback mode - start local.ai for AI processing): {text[:200]}..."


def extract_content_after_colon(text):
    """Extract content after colon or newlines in prompts"""
    if ':' in text:
        return text.split(':', 1)[1].strip()
    elif '\n\n' in text:
        return text.split('\n\n', 1)[1].strip()
    return text