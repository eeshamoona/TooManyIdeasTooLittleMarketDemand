from util import evaluate_rule


def test_rules_evaluation(rules_dataset):
    """
    Tests each rule's condition against its allowed and disallowed examples.
    Prints results for debugging.
    """
    all_passed = True
    results = []

    for rule in rules_dataset:
        rule_name = rule["rule"]
        condition = rule["condition"]
        allowed = rule["allowed"]
        disallowed = rule["disallowed"]

        print(f"\nTesting Rule: {rule_name}")
        print(f"Condition: {condition}")

        rule_passed = True
        # Test allowed words
        for word in allowed:
            try:
                result = evaluate_rule(condition, word)
                if result:
                    print(f"  Allowed word '{word}' passed.")
                else:
                    print(f"  ERROR: Allowed word '{word}' failed.")
                    rule_passed = False
                    all_passed = False
            except Exception as e:
                print(f"  ERROR: Failed to evaluate word '{word}' in allowed: {e}")
                rule_passed = False
                all_passed = False

        # Test disallowed words
        for word in disallowed:
            try:
                result = evaluate_rule(condition, word)
                if not result:
                    print(f"  Disallowed word '{word}' passed.")
                else:
                    print(f"  ERROR: Disallowed word '{word}' failed.")
                    rule_passed = False
                    all_passed = False
            except Exception as e:
                print(f"  ERROR: Failed to evaluate word '{word}' in disallowed: {e}")
                rule_passed = False
                all_passed = False

        results.append((rule_name, "Passed" if rule_passed else "Failed"))

    # Print summary
    print("\nTest Summary:")
    for rule_name, result in results:
        print(f"  Rule: {rule_name} - {result}")

    if all_passed:
        print("\nAll rules passed successfully!")
    else:
        print("\nSome rules failed. Please review the errors above.")
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

if __name__ == "__main__":
    rules_dataset = load_rules_dataset("rules_dataset.txt")
    test_rules_evaluation(rules_dataset)
