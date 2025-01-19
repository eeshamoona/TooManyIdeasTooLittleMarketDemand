import random

from util import evaluate_rule, load_rules_dataset


class Rule:
    def __init__(self, rule, condition, allowed=None, disallowed=None):
        """
        Represents a rule with a rule, condition, and examples of allowed and disallowed words.
        """
        self.rule = rule
        self.condition = condition
        self.allowed = allowed or []
        self.disallowed = disallowed or []

class RuleManager:
    def __init__(self):
        """
        Manages predefined and custom rules.
        Loads predefined rules from a dataset.
        """
        raw_values = load_rules_dataset("rules_dataset.txt")
        self.predefined_rules = [Rule(**rule) for rule in raw_values]
        self.custom_rules = []

    def get_random_predefined_rule(self):
        """
        Selects and returns a random predefined rule.

        Returns:
            Rule: A randomly selected predefined rule.
        """
        # Cast the return as a Rule object
        return random.choice(self.predefined_rules)

    def create_custom_rule(self, rule, condition, allowed, disallowed):
        """
        Creates and validates a custom rule based on user input.

        Parameters:
            rule (str): The rule's description.
            condition (str): The Python-compatible logic defining the rule.
            allowed (list of str): Examples of words that should satisfy the rule.
            disallowed (list of str): Examples of words that should not satisfy the rule.

        Returns:
            Rule or None: The created rule if valid, or None if validation fails.
        """
        try:
            # Validate the rule with allowed and disallowed examples
            for word in allowed:
                if not evaluate_rule(condition, word):
                    print(f"Validation failed: '{word}' should be allowed but isn't.")
                    return None
            for word in disallowed:
                if evaluate_rule(condition, word):
                    print(f"Validation failed: '{word}' should not be allowed but is.")
                    return None

            # Create and store the new custom rule
            new_rule = Rule(rule, condition, allowed, disallowed)
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
                f.write(f"{rule.rule}\n")
            print(f"Rule '{rule.rule}' has been added to the dataset.")
        except Exception as e:
            print(f"Error saving rule to dataset: {e}")