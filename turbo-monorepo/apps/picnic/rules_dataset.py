# Dataset containing predefined rules for the Picnic Rule Guessing Game
rules_dataset = [
    {
        "rule": "Starts with B",
        "condition": "word.startswith('B')",
        "allowed": ["Banana", "Book", "Bag"],
        "disallowed": ["Apple", "Car", "Dog"]
    },
    {
        "rule": "Contains double letters",
        "condition": "'ee' in word or 'oo' in word",
        "allowed": ["Feet", "Book", "Balloon"],
        "disallowed": ["Cat", "Dog", "Apple"]
    },
    {
        "rule": "Ends with 'ing'",
        "condition": "word.endswith('ing')",
        "allowed": ["Running", "Jumping", "Swimming"],
        "disallowed": ["Run", "Jump", "Swim"]
    },
    {
        "rule": "Has more than 5 letters",
        "condition": "len(word) > 5",
        "allowed": ["Banana", "Orange", "Giraffe"],
        "disallowed": ["Apple", "Cat", "Dog"]
    },
    {
        "rule": "Starts and ends with the same letter",
        "condition": "word[0].lower() == word[-1].lower()",
        "allowed": ["Level", "Radar", "Kayak"],
        "disallowed": ["Apple", "Car", "Book"]
    }
]
