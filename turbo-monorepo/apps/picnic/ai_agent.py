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
    "You are playing a word-guessing game with a clear, logical rule. Use the allowed and disallowed words to form and test concise hypotheses about the rule. "
    "Each guess should explore a specific, testable feature, such as word length, spelling patterns, or categories (e.g., fruits, animals). "
    "Format your response strictly as: "
    "Word: <your_guess>\nAllowed: <yes/no>\nReasoning: <a concise explanation of why this word fits or does not fit the rule>. "
    "Avoid repeating previously guessed or known words. Use feedback from incorrect guesses to refine your understanding. Focus on clear, observable patterns for each guess."
)


STATIC_PROMPT_RULE_GUESS = (
    "You are analyzing a word-guessing game to deduce a clear, consistent rule governing the allowed and disallowed words. "
    "Use patterns observed in the lists to form a concise, logical hypothesis about the rule. The rule should be simple and testable, describing a single feature that applies to all allowed words and none of the disallowed words. "
    "Format your response strictly as: "
    "Rule: <a single, concise sentence describing the rule>. "
    "For example: 'Allowed words have more than 5 letters.' If incorrect, refine your rule based on feedback and avoid contradictions. Focus on binary, consistent patterns."
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
                temperature=0.7
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
                messages=message_history,
                temperature=0.7
            )   
            guess = response.choices[0].message.content.strip()
            return guess
        except Exception as e:
            print(f"Error generating AI rule guess: {e}")
            return "Unable to guess the rule."
