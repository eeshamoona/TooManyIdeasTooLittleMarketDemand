import random

from util import evaluate_rule, load_rules_dataset


class Rule:
    def __init__(self, description, pattern, allowed=None, disallowed=None):
        self.description = description
        self.pattern = pattern
        self.allowed = allowed
        self.disallowed = disallowed

    def check_word(self, word, is_allowed=True):
        """
        Checks if a word satisfies the rule's pattern.
        The pattern is assumed to be a Python expression where the word is evaluated.
        """
        try:
            return evaluate_rule(self.pattern, word) == is_allowed
        except Exception as e:
            print(f"Error evaluating rule: {e}")
            return False

class RuleManager:
    def __init__(self):
        self.predefined_rules = load_rules_dataset("rules_dataset.txt")
        self.custom_rules = []

    def get_random_predefined_rule(self):
        """
        Returns a random predefined rule.
        """
        return random.choice(self.predefined_rules)

    def create_custom_rule(self, description, pattern, allowed, disallowed):
        """
        Creates a custom rule based on user input.
        """
        try:
            # Validate that it works for allowed and disallowed words
            for word in allowed:
                if not evaluate_rule(pattern, word):
                    return None
            for word in disallowed:
                if evaluate_rule(pattern, word):
                    return None
            new_rule = Rule(description, pattern, allowed, disallowed)
            self.custom_rules.append(new_rule)
            return new_rule
        except Exception as e:
            print(f"Error creating custom rule: {e}")
            return None

    def update_rules_dataset(self, rule):
        """
        Placeholder for updating a rules dataset.
        """
        self.predefined_rules.append(rule)
        # write to file
        with open("rules_dataset.txt", "a") as f:
            f.write(f"{rule.description}\n")
        print(f"Rule '{rule.description}' has been added to the dataset.")
