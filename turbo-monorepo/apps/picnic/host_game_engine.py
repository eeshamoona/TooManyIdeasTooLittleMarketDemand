import json

from ai_agent import (STATIC_PROMPT_RULE_GUESS, STATIC_PROMPT_WORD_GUESS,
                      AIAgent)
from pydantic_core.core_schema import int_schema
from rules import Rule


class HostPicnicGame:
    def __init__(self, rule: Rule):
        self.ai_agent = AIAgent()
        self.rule = rule
        self.message_history = []
        self.ai_rule_guesses = 0
        self.ai_score = {
            "correct": 0,
            "incorrect": 0
        }

    def host_game(self):
        # If no rule is selected, return to main menu
        if not self.rule:
            print("No rule selected. Returning to main menu.")
            return

        # Log for starting up the game with the rule
        print(f"Starting game with rule: {self.rule.rule} ({self.rule.condition}), allowed: {self.rule.allowed}, disallowed: {self.rule.disallowed}")
        # Initialize the game state
        allowed_words = self.rule.allowed
        disallowed_words = self.rule.disallowed
        guessed_words = []
    
        # System message
        self.message_history = [
            {
                "role": "system",
                "content": STATIC_PROMPT_WORD_GUESS
            }
        ]

        #Outer game loop
        while self.ai_rule_guesses < 3:
                
            # Inner Game loop
            while int(self.ai_score["correct"]) < ((self.ai_rule_guesses + 1)*3):
                # User message with current game state
                user_message = {
                    "role": "user",
                    "content": f"Allowed words: {allowed_words}\nDisallowed words: {disallowed_words}\n\nGuess a single word that fits the pattern and provide reasoning. Format your response as follows:\nWord: <your_guess>\nAllowed: <yes/no>\nReasoning: <explanation>"
                }
                self.message_history.append(user_message)
        
                with open("debug.txt", "w") as f:
                    f.write(json.dumps(self.message_history, indent=4))
                

                # AI makes a guess
                guess, is_allowed, reasoning = self.ai_agent.make_guess(self.message_history)
                guessed_words.append(guess)
        
                # Check if the guess is allowed
                evaluation = self.rule.check_word(guess, is_allowed)
        
                # Update game state
                self.ai_score["correct"] += 1 if evaluation == is_allowed else 0
                self.ai_score["incorrect"] += 1 if not evaluation == is_allowed else 0

                if evaluation:
                    allowed_words.append(guess)
                else:
                    disallowed_words.append(guess)

                # AI response   
                ai_message = {
                    "role": "assistant",
                    "content": f"Word: {guess}\nAllowed: {is_allowed}\nReasoning: {reasoning}"
                }
                self.message_history.append(ai_message)

                user_message = {
                    "role": "user",
                    "content": f"Correct! Score: {self.ai_score['correct']} incorrect: {self.ai_score['incorrect']}" if (evaluation == is_allowed) else f"Incorrect. Score: {self.ai_score['correct']} incorrect: {self.ai_score['incorrect']}"
                }
                self.message_history.append(user_message)
            

                # User feedback
                if int(self.ai_score["correct"]) >= int((self.ai_rule_guesses + 1)*3):
                    break
        
            final_message = {
                "role": "user",
                "content": f"Correct! You now have a chance to guess the rule based on your deductions."
            }
            self.message_history.append(final_message)

            # Replace the first message with a new system message indicating the user has won
            self.message_history[0]["content"] = STATIC_PROMPT_RULE_GUESS
            # Final message to indicate the AI has a chance to guess the rule
            ai_rule_guess = self.ai_agent.guess_rule(self.message_history)
            self.ai_rule_guesses += 1
            ai_rule_guess_correct = input(f"AI guessed the rule: {ai_rule_guess}. Is this correct? (yes/no): ").strip().lower()
            if ai_rule_guess_correct == "yes":
                self.complete_game()
            else:
                ai_message = {
                    "role": "assistant",
                    "content": f"Is the rule: {ai_rule_guess}"
                }
                self.message_history.append(ai_message)
                user_message = {
                    "role": "user",
                    "content": f"Incorrect! You have {3 - self.ai_rule_guesses} attempts left to guess the rule."
                }
                self.message_history.append(user_message)
                self.message_history[0]["content"] = STATIC_PROMPT_WORD_GUESS
                if self.ai_rule_guesses == 3:
                    self.end_game()
                else:
                    pass
    
        # Log the messages for debugging or game history
        print(self.message_history)
    
    def complete_game(self):
        print("\n\nThe AI has been invited to the picnic!")

        print("\nFinal score:")
        print(self.ai_score)

        with open("debug.txt", "w") as f:
            f.write(json.dumps(self.message_history, indent=4))

        # Reset the game state
        self.ai_agent = AIAgent()
        self.rule = None
        self.message_history = []
        self.ai_score = {"correct": 0, "incorrect": 0}

        # Return to the main menu
        return
    
    def end_game(self):
        print("The AI has not been invited to the picnic :(")
        print("Final message history:")
        print(self.message_history)
        print("AI score:")
        print(self.ai_score)
        print("Rule:")
        print(self.rule)

        # Reset the game state
        self.ai_agent = AIAgent()
        self.rule = None
        self.message_history = []
        self.ai_score = {"correct": 0, "incorrect": 0}

        # Return to the main menu
        return
    

def how_to_play_instructions():
    """
    Prints the instructions for the Picnic Rule Guessing Game.
    """
    instructions = (
        "\n"
        "Welcome to the Picnic Rule Guessing Game!\n"
        "--------------------------------------------------\n"
        "You and your friends are invited to a picnic, but there's a twist!\n"
        "The host has a secret rule that determines what items are allowed at the picnic.\n"
        "Your task is to figure out the rule by guessing whether certain items\n"
        "can be brought to the picnic or not.\n"
        "\n"
        "Here's how it works:\n"
        "1. The host will think of a rule (e.g., 'Items must end with \"ing\"').\n"
        "2. As an invitee, you can suggest items to bring, and the host will tell\n"
        "   you if they fit the rule.\n"
        "3. Every correct guess (whether allowed or disallowed) earns you a point.\n"
        "4. Once you earn 3 points, you get a chance to guess the rule.\n"
        "   - If your guess is correct, congratulations! You're officially invited\n"
        "     to the picnic.\n"
        "   - If your guess is incorrect, your points reset and you can keep playing\n"
        "     to earn more points and guess again.\n"
        "\n"
        "Game Modes:\n"
        "- Play as the invitee: The AI becomes the host and comes up with a rule.\n"
        "- Play as the host: You create the rule, and the AI tries to figure it out.\n"
        "\n"
        "Get ready to test your reasoning and deduction skills!\n"
        "--------------------------------------------------\n"
    )
    return instructions