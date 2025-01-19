import json
import os

from dotenv import load_dotenv
from openai import OpenAI

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

STATIC_PROMPT_WORD_GUESS = (
    "You are playing a word-guessing game governed by a consistent logical rule. Your task is to generate a single word guess based on the information provided, including the lists of allowed and disallowed words, feedback from previous guesses, and patterns you observe. "
    "Avoid repeating any previously guessed words. Carefully analyze the characteristics of the allowed and disallowed words (such as length, structure, letters, or meaning) to refine your understanding of the rule. "
    "Your response must be strictly structured as follows:\n"
    "Word: <your_guess>\n"
    "Allowed: <yes/no>\n"
    "Reasoning: <your logical explanation of why this word fits or does not fit the rule>. "
    "Your goal is to deduce the always-true logical rule based on your guesses. Be creative, but ensure your reasoning is precise and supports progress toward understanding the rule. The rule has no exceptions, so focus on patterns that apply universally."
)


STATIC_PROMPT_RULE_GUESS = (
    "You are analyzing a word-guessing game based on a logical, consistent rule, such as 'Words that end with \"ing\"'. Use the reasoning history, patterns in the allowed and disallowed words, and any notable features of the words (such as length, structure, or meaning) to deduce the rule. "
    "Think critically and creatively to identify the underlying logic but remember the solution is simple and logic based. Provide a single clear and concise sentence describing the rule, ensuring it accounts for all observed examples."
)

class AIAgent:
    def make_guess(self, message_history):
        """
        AI generates a word guess based on the rule and avoids repeating guesses.
        """
        try:
            data_packet = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=message_history,
                response_format=AIResponse,
            )
            ai_response = data_packet.choices[0].message.content
            ai_response_dict = AIResponse(**json.loads(ai_response))
            return ai_response_dict.guess, ai_response_dict.is_allowed, ai_response_dict.reasoning
        except Exception as e:
            print(f"Error generating AI rule guess: {e}")
            return "Unable to guess the rule.", False, ""


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
