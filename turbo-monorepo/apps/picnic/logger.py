"""
logger.py

This module provides logging functionality for the Picnic game.
"""
def how_to_play_instructions():
    """
    Prints the instructions for the Picnic Rule Guessing Game.
    """
    instructions = (
        "\n"
        "Welcome to the Picnic Rule Guessing Game!\n"
        "--------------------------------------------------\n"
        "You and your friends are invited to a picnic, but there's a twist!\n"
        "The host has a secret rule that determines what items are allowed at the picnic.\n"
        "Your task is to figure out the rule by guessing whether certain items\n"
        "can be brought to the picnic or not.\n"
        "\n"
        "Here's how it works:\n"
        "1. The host will think of a rule (e.g., 'Items must end with \"ing\"').\n"
        "2. As an invitee, you can suggest items to bring, and the host will tell\n"
        "   you if they fit the rule.\n"
        "3. Every correct guess (whether allowed or disallowed) earns you a point.\n"
        "4. Once you earn 3 points, you get a chance to guess the rule.\n"
        "   - If your guess is correct, congratulations! You're officially invited\n"
        "     to the picnic.\n"
        "   - If your guess is incorrect, your points reset and you can keep playing\n"
        "     to earn more points and guess again.\n"
        "\n"
        "Game Modes:\n"
        "- Play as the invitee: The AI becomes the host and comes up with a rule.\n"
        "- Play as the host: You create the rule, and the AI tries to figure it out.\n"
        "\n"
        "Get ready to test your reasoning and deduction skills!\n"
        "--------------------------------------------------\n"
    )
    return instructions
