import os
from fastapi import FastAPI
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

"""
PLAN:

Singular end point ##query##, takes string

1. Query the OpenAI API with the string

generate prompt

TO DETERMINE:

return type needed (what media?)

"""

@app.get("/")
def query(q: str):
    pass