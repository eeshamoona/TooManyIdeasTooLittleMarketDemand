from host_game_engine import HostPicnicGame
from rules import RuleManager


class SetupGame:
    def __init__(self):
        """
        Initializes the SetupGame class, setting up the RuleManager instance.
        """
        self.rule_manager = RuleManager()  # Manages predefined and custom rules

    def start_game(self):
        """
        Starts the game, allowing the user to choose their role as host or invitee.
        """
        print("--------------------------------------------------")
        print("We are going to a picnic, try to guess the rules and get invited!")
        print("--------------------------------------------------")
        mode = input("Do you want to play as the '1 - Host' or the '2 - Invitee'? ").strip().lower()

        if mode == '1':
            self.play_as_host()
        elif mode == '2':
            print("\nInvitee mode is not implemented yet. Stay tuned!\n")
        else:
            print("\nInvalid choice. Returning to the main menu.\n")

    def play_as_host(self):
        """
        Allows the user to play as the host, selecting or creating a rule for the game.
        """
        print("\n--- Host Mode: Pick a Rule ---")
        print("Either pick a predefined rule or create a custom one, or any other key to exit.")
        print("--------------------------------------------------")
        rule_type = input("Enter '1 - Predefined', '2 - Custom', to set a rule: ").strip().lower()

        if rule_type == '1':
            # Fetch a random predefined rule
            selected_rule = self.rule_manager.get_random_predefined_rule()
            print("\nPredefined rule selected successfully!\n")
        elif rule_type == '2':
            # Create a custom rule based on user input
            print("\nCreating a custom rule...")
            rule_description = input("Enter a description for your custom rule: ").strip()
            rule_pattern = input("Enter the Python-compatible logic for your rule: ").strip()
            allowed = input("Enter examples that fit your rule, separated by commas: ").split(", ")
            disallowed = input("Enter examples that do not fit your rule, separated by commas: ").split(", ")

            selected_rule = self.rule_manager.create_custom_rule(
                rule_description, rule_pattern, allowed, disallowed
            )

            if selected_rule:
                print("\nRule created and validated successfully!")
                save_rule = input("Do you want to save this rule? (yes/no): ").strip().lower()
                if save_rule == 'yes':
                    self.rule_manager.update_rules_dataset(selected_rule)
                    print("\nCustom rule saved successfully!\n")
            else:
                print("\nError: The custom rule could not be validated.\n")
        elif rule_type == '':
            print("\nReturning to the main menu.\n")
            return
        else:
            print("\nExiting host mode.\n")
            return

        # Exit if no rule was successfully created or retrieved
        if not selected_rule:
            print("\nError creating or retrieving rule. Exiting host mode.\n")
            return

        # Display the selected rule
        print(f"\nSelected Rule: \n- Description: {selected_rule.rule}\n- Python Check Condition: {selected_rule.condition}\n")

        # Initialize and start the host game
        new_game = HostPicnicGame(selected_rule)
        new_game.host_game()
