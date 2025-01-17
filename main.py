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
    cuisines : list
    calories: int
    preferences: str

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

class Recipe(BaseModel):
    ingredients: list[str]
    steps: list[str]
    response: str

class DayRecipes(BaseModel):
    breakfast: Recipe
    lunch: Recipe
    dinner: Recipe

class WeeklyPlan(BaseModel):
    plan : Dict[str, DayPlan]

class DailyRecipe(BaseModel):
    details : dict
    image_url: str
    response: str
    messages: list[dict]

class UpdateRecipe(BaseModel):
    recipe: DailyRecipe
    update: str

def generate_recipe(meal: str, description: str):
    system_prompt = """
                    You are a helpful assistant that specializes in generating recipes. The user will give you a meal name and description of the meal. It is imperative that you follow these restrictions when generating the meal plan for the day.
                    The recipe should entail a list of ingredients along with measurements of each ingredient, and a list of numbered steps to create this meal using all the ingredients.
                    """
    user_prompt = f"""Create a recipe for {meal}: {description}."""
    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format = Recipe
    )
    return response.choices[0].message.content

def generate_recipe_image(meal: str, description: str):
    # Create a prompt to generate an image for the recipe using DALL-E 2
    dalle_prompt = f"A plate of {meal}: {description}. The dish should look appetizing and be well-presented."

    image_response = client.images.generate(
        model="dall-e-2",
        prompt=dalle_prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = image_response.data[0].url

    return image_url  # Extract image URL from the response


def generate_day(history: list, restrictions: list, cuisine: list, calories: int, preferences: str):
    system_prompt = """
                    You are a helpful assistant that specializes in generating daily meal plans. The user will give you a list
                    of dietary restrictions. It is imperative that you follow these restrictions when generating the meal plan for the day.
                    The user will also provide you with a cuisine type and a calorie limit. You must generate a meal plan for the day that
                    aheres to the specified restrictions, cuisine type, and calorie limit. The meal plan should include breakfast, lunch, and dinner.
                    For each meal, specify the meal and give a short description of the meal. The user will provide you with a history of the
                    meal plans that you have generated for them. Make sure that the meal plan for the day is unique and different from the
                    meal plans that you have generated in the past. You will also need to provide the total calories, sodium, fat, and protein. The user
                    may also ask you to generate recipes for multiple cuisine. You must provide the user with a plan that incorporates all the cuisines
                    they had requested. Each meal may also be a combination of multiple cuisines.
                    """
    user_prompt = f"""My restrictions are {restrictions}, I would like a {cuisine} meal plan, and I would like to stay under {calories} calories.
                    I have had {history} in the past and these are my preferences: {preferences}. Please generate me a plan that follows these specifications"""
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
            plan = generate_day(request.restrictions, request.cuisines, request.calories, history, request.preferences)
            history[day] = json.loads(plan)

        return WeeklyPlan(plan = history)
    except Exception as e:
        # retain previously raised HTTPExceptions, otherwise default to 500
        if type(e) is HTTPException:
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
@app.post("/get_recipe", response_model=DailyRecipe)
def get_recipe(request: Meal):
    try:
        generated_recipe = generate_recipe(request.meal, request.description)

        generated_recipe_json = json.loads(generated_recipe)
        
        image_url = generate_recipe_image(request.meal, request.description)
        
        return DailyRecipe(details = generated_recipe_json, image_url=image_url, response="", messages=[])
    except Exception as e:
        # retain previously raised HTTPExceptions, otherwise default to 500
        if type(e) is HTTPException:
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/update_recipe", response_model=DailyRecipe)
def update_recipe(request: UpdateRecipe):
    try:
        recipe = request.recipe
        update = request.update


        system_prompt = """
                    You are a helpful assistant that specializes in updating recipes. The user will provide you with a recipe and an update to the recipe. It is imperative that you follow these instructions when updating the recipe.
                    The recipe should entail a list of ingredients along with measurements of each ingredient, and a list of numbered steps to create this meal using all the ingredients. You must update the recipe with the provided information.
                    It is imperative you answer any question given by the user about the recipe or your function and anything related to what you can do and your job.
                    You work work in these steps:

                    1. Read the recipe provided by the user.
                    2. If the user asks a question, answer the question if it is related to the recipe or if the user has any questions.
                    3. Determine whether the update is relevent to the recipe. If it is not, ask the user for more information and return the original recipe provided by the user.
                    4. Update the recipe with the provided information.
                    """
        
        user_prompt = f"""
                    I was given the following recipe:
                    {recipe.details.get("ingredients")}
                    {recipe.details.get("steps")}
                    
                    I would like to update the recipe with the following information:
                    {update}
                    It is imperative that you follow these instructions when updating the recipe if it is relevant to the recipe.
                    It is imperative that you do not modify the original recipe or delete any information from the original recipe beyond what is necessary to make the dish. If the user requests to delete important aspects of the dish
                    or modify the dish in a way that would make it unrecognizable, you must inform the user that you cannot make the requested changes and provide a thorough reason why. Answer any questions the user may have
                    about the recipe or your function and anything related to what you can do and your job.

                    """

        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format = Recipe
        )

        existing_messages = request.recipe.messages
        new_message = {"text": request.update, "sender": "user"}
        bot_response = {"text": response.choices[0].message.parsed.response, "sender": "bot"}
        updated_messages = existing_messages + [new_message, bot_response]



        return DailyRecipe(
            details=json.loads(response.choices[0].message.content),
            image_url=request.recipe.image_url,
            response=response.choices[0].message.parsed.response,
            messages=updated_messages  # Return the updated messages
        )
    except Exception as e:
        # retain previously raised HTTPExceptions, otherwise default to 500
        if type(e) is HTTPException:
            raise e
        raise HTTPException(status_code=500, detail="Internal Server Error")