def evaluate_rule(rule_condition, word, expected=True):
    """
    Evaluates a word against a given rule condition.
    :param rule_condition: A string defining the rule logic (e.g., "word.startswith('B')").
    :param word: The word to be evaluated.
    :return: True if the word satisfies the rule, False otherwise.
    """
    try:
        word = word.lower()
        formatted_condition = rule_condition.format(word=repr(word))
        return eval(formatted_condition) == expected
    except Exception as e:
        print(f"Error evaluating rule: {e}")
        return False

# Load rules dataset from a text file
def load_rules_dataset(file_path):
    """
    Loads the rules dataset from a text file.
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