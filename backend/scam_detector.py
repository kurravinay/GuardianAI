from openai import OpenAI
from dotenv import load_dotenv
import os
import json
import base64
import requests
import re

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

VIRUSTOTAL_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

SYSTEM_PROMPT = """
You are an AI cybersecurity assistant.

Analyze messages and screenshots for:
- phishing
- fake job scams
- impersonation
- malicious links
- urgency tactics
- OTP theft
- payment fraud

Return ONLY valid JSON.

{
  "risk_level": "",
  "scam_score": 0,
  "explanation": "",
  "recommended_action": ""
}
"""

def extract_urls(text):

    url_pattern = r"(https?://\S+|www\.\S+)"
    return re.findall(url_pattern, text)

def check_url_with_virustotal(url):

    headers = {
        "x-apikey": VIRUSTOTAL_API_KEY
    }

    response = requests.post(
        "https://www.virustotal.com/api/v3/urls",
        headers=headers,
        data={"url": url}
    )

    if response.status_code != 200:
        return {
            "malicious": False
        }

    return {
        "malicious": False
    }

def analyze_text(text):

    urls = extract_urls(text)

    url_results = []

    for url in urls:

        result = check_url_with_virustotal(url)

        url_results.append({
            "url": url,
            "analysis": result
        })

    response = client.chat.completions.create(
        model="gpt-5.4-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"""
Analyze this suspicious message:

{text}

URL Analysis:
{url_results}
"""
            }
        ]
    )

    return json.loads(
        response.choices[0].message.content
    )

def encode_image(image_path):

    with open(image_path, "rb") as image_file:
        return base64.b64encode(
            image_file.read()
        ).decode("utf-8")

def analyze_image(image_path):

    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
        model="gpt-5.4-mini",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
Analyze this screenshot for scams,
phishing, fake job offers,
malicious warnings, or fraud.
"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    )

    return json.loads(
        response.choices[0].message.content
    )