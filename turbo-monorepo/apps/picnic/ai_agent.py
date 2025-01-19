import os

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import json_schema

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),  # Fetch the API key from environment variables
)

from pydantic import BaseModel


class AIResponse(BaseModel):
    guess: str
    is_allowed: bool
    reasoning: str
    
class AIAgent:
    def make_guess(self, message_history):
        """
        AI generates a word guess based on the rule and avoids repeating guesses.
        """
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_history,
                response_format=AIResponse,

            )
            return response.guess, response.is_allowed, response.reasoning
        except Exception as e:
            print(f"Error generating AI rule guess: {e}")
            return "Unable to guess the rule."

    def guess_rule(self, message_history):
        """
        AI attempts to guess the rule based on reasoning from guessed words.
        """
       
        # Example static reasoning for demonstration purposes
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=message_history
            )
            guess = response.choices[0].message.content.strip()
            return guess
        except Exception as e:
            print(f"Error generating AI rule guess: {e}")
            return "Unable to guess the rule."

