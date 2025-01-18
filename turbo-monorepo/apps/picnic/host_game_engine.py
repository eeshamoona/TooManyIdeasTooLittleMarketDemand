from ai_agent import AIAgent
from rules import RuleManager


class HostPicnicGame:
    def __init__(self, rule_text=None, criteria=None):
        self.rule_manager = RuleManager()
        self.ai_agent = AIAgent()
        self.rule_text = rule_text
        self.criteria = criteria
        self.message_history = []

    def host_game(self, rule):
        correct_guesses = 0
        guessed_words = []

        while correct_guesses < 3:
            guess, reasoning = self.ai_agent.make_guess(rule, guessed_words, self.message_history)
            print(f"AI's Guess: \"{guess}\" is allowed. Reasoning: {reasoning}")

            if guess in guessed_words:
                print("AI repeated a guess. Skipping this turn.")
                continue

            guessed_words.append(guess)

            is_correct = rule.check_word(guess)

            if is_correct:
                correct_guesses += 1
                print(f"Correct! Score: AI {correct_guesses} correct.")
            else:
                print("Incorrect! Score: AI reset to 0.")
                correct_guesses = 0

        self.handle_rule_guess(rule, guessed_words)

    def handle_rule_guess(self, rule, guessed_words):
        rule_guess = self.ai_agent.guess_rule(guessed_words)
        print(f"The AI thinks the rule is: \"{rule_guess}\".")
        user_feedback = input("Is this correct? (yes/no): ").strip().lower()
        if user_feedback == 'yes':
            print("The AI guessed the rule correctly!")
            self.rule_manager.update_rules_dataset(rule)
        else:
            print("The AI's rule description was incorrect. Continuing the game.")
