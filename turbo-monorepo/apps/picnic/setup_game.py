from host_game_engine import HostPicnicGame
from rules import RuleManager


class SetupGame: 
    def __init__(self):
        self.rule_manager = RuleManager()  

    def start_game(self):
        print("New game started!")
        mode = input("Do you want to play as the '1 - host' or the '2 - invitee'? ").strip().lower()

        if mode == '1':
            self.play_as_host()
        elif mode == '2':
            print("Invitee mode is not implemented yet. Stay tuned!")
        else:
            print("Invalid choice. Returning to the main menu.")

    def play_as_host(self):
        rule_type = input("Enter '1 - predefined' or '2 - custom' to set a rule: ").strip().lower()
        rule = None
        if rule_type == '1':
            rule = self.rule_manager.get_random_predefined_rule()
        elif rule_type == '2':
            rule_description = input("Enter a description for your custom rule: ").strip()
            rule_pattern = input("Enter the Python-compatible logic for your rule: ").strip()
            allowed = input("Enter examples that fit your rule, separated by commas: ").split(", ")
            disallowed = input("Enter examples that do not fit your rule, separated by commas: ").split(", ")
            rule = self.rule_manager.create_custom_rule(rule_description, rule_pattern, allowed, disallowed)
            print("Rule created and validated successfully!")
            save_rule = input("Do you want to save this rule? (yes/no): ").strip().lower()
            if save_rule == 'yes':
                self.rule_manager.update_rules_dataset(rule)
        else:
            print("Invalid rule type. Exiting host mode.")
            return

        if not rule:
            print("Error creating or retrieving rule. Exiting host mode.")
            return

        print(f"Selected Rule: {rule.description} - {rule.condition}")
        new_game = HostPicnicGame(rule_text = rule.description, criteria = rule.condition)
        new_game.host_game(rule)