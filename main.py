import os
from fastapi import FastAPI
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

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

class InputQuery(BaseModel):
    #If you want me to send in different data structures let me know
    selectedButtons: list[str]
    selectedCuisine: str
    calories: str


class Response(BaseModel):
    #placeholder for testing, feel free to change
    message: str

"""
PLAN:

Singular end point ##query##, takes string

1. Query the OpenAI API with the string

generate prompt

TO DETERMINE:

return type needed (what media?)

"""
@app.post("/query", response_model=Response)
def query(query: InputQuery):
    # Process the data received from the frontend (query)
    selected_buttons = query.selectedButtons
    selected_cuisine = query.selectedCuisine
    calories = query.calories

    #Testing return message feel free to change
    return {"message": f"Received buttons: {selected_buttons}, Cuisine: {selected_cuisine}, Calories: {calories}"} 

@app.get("/", response_model=Response)
def read_root():
    return {"message": "API is running"}
