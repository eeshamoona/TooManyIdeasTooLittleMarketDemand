import random
from util import evaluate_rule, load_rules_dataset

class Rule:
    def __init__(self, description, pattern, allowed=None, disallowed=None):
        """
        Represents a rule with a description, pattern, and examples of allowed and disallowed words.
        """
        self.description = description
        self.pattern = pattern
        self.allowed = allowed or []
        self.disallowed = disallowed or []

    def check_word(self, word, is_allowed=True):
        """
        Checks if a word satisfies the rule's pattern.
        The pattern is assumed to be a Python expression where the word is evaluated.
        
        Parameters:
            word (str): The word to check.
            is_allowed (bool): True to check if the word is allowed; False for disallowed.

        Returns:
            bool: Whether the word satisfies the rule's condition.
        """
        try:
            return evaluate_rule(self.pattern, word) == is_allowed
        except Exception as e:
            print(f"Error evaluating rule: {e}")
            return False

class RuleManager:
    def __init__(self):
        """
        Manages predefined and custom rules.
        Loads predefined rules from a dataset.
        """
        self.predefined_rules = load_rules_dataset("rules_dataset.txt")
        self.custom_rules = []

    def get_random_predefined_rule(self):
        """
        Selects and returns a random predefined rule.

        Returns:
            Rule: A randomly selected predefined rule.
        """
        return random.choice(self.predefined_rules)

    def create_custom_rule(self, description, pattern, allowed, disallowed):
        """
        Creates and validates a custom rule based on user input.

        Parameters:
            description (str): The rule's description.
            pattern (str): The Python-compatible logic defining the rule.
            allowed (list of str): Examples of words that should satisfy the rule.
            disallowed (list of str): Examples of words that should not satisfy the rule.

        Returns:
            Rule or None: The created rule if valid, or None if validation fails.
        """
        try:
            # Validate the rule with allowed and disallowed examples
            for word in allowed:
                if not evaluate_rule(pattern, word):
                    print(f"Validation failed: '{word}' should be allowed but isn't.")
                    return None
            for word in disallowed:
                if evaluate_rule(pattern, word):
                    print(f"Validation failed: '{word}' should not be allowed but is.")
                    return None

            # Create and store the new custom rule
            new_rule = Rule(description, pattern, allowed, disallowed)
            self.custom_rules.append(new_rule)
            return new_rule
        except Exception as e:
            print(f"Error creating custom rule: {e}")
            return None

    def update_rules_dataset(self, rule):
        """
        Updates the dataset with a new rule and saves it to the file.

        Parameters:
            rule (Rule): The rule to add to the dataset.
        """
        self.predefined_rules.append(rule)
        try:
            with open("rules_dataset.txt", "a") as f:
                f.write(f"{rule.description}\n")
            print(f"Rule '{rule.description}' has been added to the dataset.")
        except Exception as e:
            print(f"Error saving rule to dataset: {e}")