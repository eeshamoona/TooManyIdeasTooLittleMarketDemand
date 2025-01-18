import os
import random
from dotenv import load_dotenv
from openai import OpenAI
from evaluate_rules import evaluate_rule, load_rules_dataset

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),  # Fetch the API key from environment variables
)

# Save updated rules to the dataset
def save_updated_rules(file_path, rules):
    """
    Rewrites the dataset file with updated rules.
    """
    with open(file_path, "w", encoding="utf-8") as f:
        for rule in rules:
            f.write(f"{rule}\n")
    print("Rules dataset updated!")

rules_dataset = load_rules_dataset("rules_dataset.txt")

def ai_guess_word(allowed, disallowed, guessed_words, condition):
    """
    Uses GPT to generate a single-word guess that has not been guessed before.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are playing a word-guessing game. Generate a single word guess "
                        "based on the allowed and disallowed examples. Avoid repeating words that have already been guessed. "
                        "Your response should be concise and provide reasoning for your guess."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Allowed words: {allowed}\n"
                        f"Disallowed words: {disallowed}\n"
                        f"Already guessed words: {guessed_words}\n\n"
                        f"Guess a single word that fits the pattern and provide reasoning. Format your response as follows:\n"
                        f"Word: <your_guess>\nReasoning: <explanation>"
                    ),
                },
            ],
        )
        ai_response = response.choices[0].message.content.strip()

        # Extract guessed word and reasoning
        guessed_word = ai_response.split("Word:")[1].split("\n")[0].strip()
        reasoning = ai_response.split("Reasoning:")[1].strip()
        return guessed_word, reasoning
    except Exception as e:
        print(f"Error generating AI guess: {e}")
        return "error", "No reasoning available."


def ai_guess_rule(conversation_history):
    """
    AI reflects on its reasoning and guesses the rule.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are analyzing a word-guessing game. Reflect on the reasoning history to infer the rule. "
                        "Be concise and provide a single sentence describing the rule."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Reasoning history:\n{conversation_history}\n\n"
                        f"Based on this history, guess the rule governing the allowed words."
                    ),
                },
            ],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating AI rule guess: {e}")
        return "Unable to guess the rule."


def start_game():
    """
    Starts a new round of the Picnic Rule Guessing Game.
    """
    print("\nNew game started!")
    choice = input("Enter 'predefined' or 'custom': ").strip().lower()

    if choice == "predefined":
        rule = random.choice(rules_dataset)
        print(f"\nSelected Rule: {rule['rule']}")
        allowed = rule["allowed"]
        disallowed = rule["disallowed"]
        condition = rule["condition"]
    elif choice == "custom":
        rule_name = input("Enter a description of your rule: ")
        condition = input("Enter the Python-compatible logic for your rule: ")
        allowed = input("Enter examples that fit your rule, separated by commas: ").split(", ")
        disallowed = []
        rule = {"rule": rule_name, "condition": condition, "allowed": allowed, "disallowed": disallowed}
        rules_dataset.append(rule)
    else:
        print("Invalid choice. Returning to main menu.")
        return

    conversation_history = ""
    guessed_words = []
    correct_guesses = 0

    while True:
        ai_word_guess, reasoning = ai_guess_word(allowed, disallowed, guessed_words, condition)

        if ai_word_guess == "error":
            print("The AI encountered an error. Skipping this turn.")
            continue

        print(f"AI's Guess: {ai_word_guess}")
        print(f"Reasoning: {reasoning}")
        guessed_words.append(ai_word_guess)
        conversation_history += f"Guess: {ai_word_guess}\nReasoning: {reasoning}\n"

        try:
            if evaluate_rule(condition, ai_word_guess):
                print("Correct!")
                correct_guesses += 1
            else:
                print("Incorrect!")
        except Exception as e:
            print(f"Error evaluating the rule for word '{ai_word_guess}': {e}")

        print(f"Score: AI {correct_guesses} correct.")

        if correct_guesses >= 3:
            print("\nThe AI has earned a guess for the rule!")
            guessed_rule = ai_guess_rule(conversation_history)
            print(f"The AI thinks the rule is: '{guessed_rule}'")
            is_correct = input("Is this correct? (yes/no): ").strip().lower()

            if is_correct == "yes":
                print("The AI guessed the rule correctly!")
                break
            else:
                print("The AI's guess was incorrect. Continuing the game.")
                correct_guesses = 0

    # Update rule in the dataset
    rule["allowed"] = allowed
    rule["disallowed"] = disallowed
    save_updated_rules("rules_dataset.txt", rules_dataset)

# Main function
def main():
    """
    Main function for the Picnic Rule Guessing Game.
    """
    print("Welcome to the Picnic Rule Guessing Game!")
    while True:
        user_input = input("\nEnter a command ('new game', 'exit'): ").strip().lower()
        if user_input == "new game":
            start_game()
        elif user_input == "exit":
            print("Goodbye!")
            break
        else:
            print("Invalid command. Try again.")

if __name__ == "__main__":
    main()
