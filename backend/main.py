from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from scam_detector import analyze_text, analyze_image
from fastapi.middleware.cors import CORSMiddleware
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageInput(BaseModel):
    text: str

@app.get("/")
def home():
    return {
        "message": "Guardian AI Running"
    }

@app.post("/analyze-text")
def analyze_message(data: MessageInput):

    result = analyze_text(data.text)

    return result

@app.post("/analyze-image")
async def analyze_uploaded_image(file: UploadFile = File(...)):

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_image(file_path)

    return result