from host_game_engine import how_to_play_instructions
from setup_game import SetupGame


def main():
    print("Welcome to the Picnic Rule Guessing Game!")
    setup_game = SetupGame()

    while True:
        command = input("Main Menu, pick a number: ('1 - new game', '2 - how to play', '3 - exit'): ").strip().lower()
        if command == '3':
            print("Goodbye!")
            break
        elif command == '2':
            print(how_to_play_instructions())
        elif command == '1':
            setup_game.start_game()
        else:
            print("Invalid main menu command. Try again.")

if __name__ == "__main__":
    main()
