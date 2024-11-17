from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

system_prompt = "Generate 100 meal name and descriptions. Each pair should include a meal name and a description of the meal."

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "system",
            "content": "You generate a list of meal names with their descriptions. Each meal name should be paired with a description in a dictionary format."
        },
        {
            "role": "user",
            "content": "Generate 100 meal name and description pairs."
        }
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "meal_schema",
            "schema": {
                "type": "object",
                "properties": {
                    "meals": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "meal": {
                                    "description": "The name of the meal",
                                    "type": "string"
                                },
                                "description": {
                                    "description": "A description of the meal",
                                    "type": "string"
                                }
                            },
                            "required": ["meal", "description"],
                            "additionalProperties": False
                        }
                    }
                },
                "required": ["meals"],
                "additionalProperties": False
            }
        }
    }
)

meal_data = response.choices[0].message.content.strip()

try:
    meal_dict = json.loads(meal_data)
    
    with open("meal_data.json", "w") as f:
        json.dump(meal_dict, f, indent=4)
    print("Data has been saved to meal_data.json")
except json.JSONDecodeError as e:
    print(f"Error parsing the JSON response: {e}")