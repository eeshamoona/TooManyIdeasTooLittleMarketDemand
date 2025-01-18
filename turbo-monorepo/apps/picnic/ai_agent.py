import random

class AIAgent:
    def make_guess(self, rule, guessed_words, message_history):
        """
        AI generates a word guess based on the rule and avoids repeating guesses.
        """
        word_pool = ["Running", "Jumping", "Swimming", "Hiking", "Flying", "Acting", "Writing"]
        remaining_words = [word for word in word_pool if word not in guessed_words]
        if not remaining_words:
            return "No valid guesses left", "AI ran out of words to guess."

        guess = random.choice(remaining_words)
        reasoning = f"\"{guess}\" matches the rule's logic as per the allowed examples."
        return guess, reasoning

    def guess_rule(self, guessed_words):
        """
        AI attempts to guess the rule based on reasoning from guessed words.
        """
        # Example static reasoning for demonstration purposes
        return "Words must end with 'ing'."
