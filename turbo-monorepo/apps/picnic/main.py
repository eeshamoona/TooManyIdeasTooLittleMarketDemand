import os
import random
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),  # Fetch the API key from environment variables
)

# Load rules dataset from a text file
def load_rules_dataset(file_path):
    """
    Loads the rules dataset from a text file.
    :param file_path: Path to the dataset file.
    :return: A list of rules (dictionaries).
    """
    rules = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                rule = eval(line.strip())
                rules.append(rule)
    except FileNotFoundError:
        print(f"Dataset file {file_path} not found. Starting with an empty dataset.")
    return rules

# Save the updated dataset back to the text file
def save_updated_rules(file_path, rules):
    """
    Rewrites the dataset file with updated rules.
    :param file_path: Path to the dataset file.
    :param rules: The full list of updated rules.
    """
    with open(file_path, "w", encoding="utf-8") as f:
        for rule in rules:
            f.write(f"{rule}\n")
    print("Rules dataset updated!")

rules_dataset = load_rules_dataset("rules_dataset.txt")

# Function to evaluate whether a word satisfies a rule
def evaluate_rule(rule_condition, word):
    """
    Evaluates a word against a given rule condition using Python's eval function.
    :param rule_condition: A string defining the rule logic (e.g., "word.startswith('B')").
    :param word: The word to be evaluated.
    :return: True if the word satisfies the rule, False otherwise.
    """
    try:
        word = word.lower()
        return eval(rule_condition.format(word=repr(word)))
    except Exception as e:
        print(f"Error evaluating rule: {e}")
        return False

# Function to use GPT-4o to generate a word guess
def ai_guess_word(allowed, disallowed):
    """
    Uses GPT-4o-mini to generate a single-word guess that fits the rule based on allowed examples.
    :param allowed: List of examples that fit the rule.
    :param disallowed: List of examples that do not fit the rule.
    :return: The AI's guessed word.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a word-guessing assistant. Guess a single word that fits the given examples.",
                },
                {
                    "role": "user",
                    "content": f"""
                    Based on these examples, guess a single word that fits the pattern:
                    Allowed: {allowed}
                    Already guessed (do not repeat): {allowed + disallowed}
                    Output only the word, nothing else.
                    """,
                },
            ],
        )
        # Extract and clean the AI's response
        return response.choices[0].message.content.strip()
        # Ensure only a single word is returned
        return guessed_word.split()[0]
    except Exception as e:
        print(f"Error while generating AI guess: {e}")
        return "Error"

# Function to start a new game
def start_game():
    """
    Starts a new round of the Picnic Rule Guessing Game. 
    The player can choose a predefined rule or create their own, and the AI attempts to guess words.
    """
    print("\nNew game started!")
    print("You can either select a predefined rule or create your own.")
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

    # AI guesses words
    print("\nThe AI will now try to guess words that fit your rule...")
    correct_guesses = 0
    incorrect_guesses = 0

    while correct_guesses < 3 and incorrect_guesses < 3:
        ai_word_guess = ai_guess_word(allowed, disallowed)
        print(f"AI's Guess: {ai_word_guess}")

        if ai_word_guess in allowed or ai_word_guess in disallowed:
            print("This word was already guessed. AI loses this turn!")
            incorrect_guesses += 1
        elif evaluate_rule(condition, ai_word_guess):
            print("Correct!")
            allowed.append(ai_word_guess)  # Add to allowed if correct
            correct_guesses += 1
        else:
            print("Incorrect!")
            disallowed.append(ai_word_guess)  # Add to disallowed if incorrect
            incorrect_guesses += 1

        print(f"Score: AI {correct_guesses} correct, {incorrect_guesses} incorrect.")

    if correct_guesses == 3:
        print("\nThe AI wins!")
    else:
        print("\nThe AI loses!")

    # Update rule in the dataset
    rule["allowed"] = allowed
    rule["disallowed"] = disallowed
    save_updated_rules("rules_dataset.txt", rules_dataset)

# Main program loop
def main():
    """
    The main function for the Picnic Rule Guessing Game.
    Provides a command-line interface for starting new games or exiting the program.
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
