import os
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Dict, Any
import json

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

class WeekRequest(BaseModel):
    restrictions: list
    cuisine : str
    calories: int

class Meal(BaseModel):
    meal: str
    description: str

class Nutrition(BaseModel):
    calories: int
    sodium: int
    fat: int
    protein: int

class DayPlan(BaseModel):
    breakfast: Meal
    lunch: Meal
    dinner: Meal
    nutrition: Nutrition

class WeeklyPlan(BaseModel):
    plan : Dict[str, DayPlan]

def generate_day(history: list, restrictions: list, cuisine: str, calories: int):
    system_prompt = """
                    You are a helpful assistant that specializes in generating daily meal plans. The user will give you a list
                    of dietary restrictions. It is imperative that you follow these restrictions when generating the meal plan for the day.
                    The user will also provide you with a cuisine type and a calorie limit. You must generate a meal plan for the day that
                    aheres to the specified restrictions, cuisine type, and calorie limit. The meal plan should include breakfast, lunch, and dinner.
                    For each meal, specify the meal and give a short description of the meal. The user will provide you with a history of the
                    meal plans that you have generated for them. Make sure that the meal plan for the day is unique and different from the
                    meal plans that you have generated in the past. You will also need to provide the total calories, sodium, fat, and protein.
                    """
    user_prompt = f"""My restrictions are {restrictions}, I would like a {cuisine} meal plan, and I would like to stay under {calories} calories.
                    I have had {history} in the past."""
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format = DayPlan
    )
    return response.choices[0].message.content
@app.post("/get_week", response_model=WeeklyPlan)
def get_week(request: WeekRequest):
    try:
        history = {}
        for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]:
            plan = generate_day(request.restrictions, request.cuisine, request.calories, history)
            history[day] = json.loads(plan)
        print(history)
        return WeeklyPlan(plan = history)
    except Exception as e:
        # retain previously raised HTTPExceptions, otherwise default to 500
        print(e)
        if type(e) is HTTPException:
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")