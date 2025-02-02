"""Two Truths and a Lie Game using AI and Wikipedia.

This module implements an interactive game where players try to identify
AI-generated fake facts among real Wikipedia facts. The game uses
OpenAI's GPT model for option generation and sentence_transformers
for text embeddings.

Dependencies:
    - openai: For GPT-based text generation
    - nltk: For sentence tokenization
    - wikipedia: For fetching Wikipedia content
    - sentence_transformers: For text embeddings
"""

# pylint: disable=import-error
import os
import random
import re
from typing import List

import numpy as np
import wikipedia
from dotenv import load_dotenv
from nltk.tokenize import sent_tokenize
from openai import OpenAI
from sentence_transformers import SentenceTransformer

# Initialize environment and models
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
model = SentenceTransformer("all-MiniLM-L6-v2")


class WikipediaError(Exception):
    """Custom exception for Wikipedia-related errors."""

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


def get_user_selection(options: List[str], prompt: str) -> int:
    """Get user selection from a list of options.

    Args:
        options: List of options to choose from
        prompt: Prompt to display to user

    Returns:
        Selected index from the options list
    """
    while True:
        try:
            choice = int(input(prompt)) - 1
            if 0 <= choice < len(options):
                return choice
            print("⚠️ Invalid choice. Enter a number between 1 and", len(options))
        except ValueError:
            print("⚠️ Please enter a valid number.")


def handle_disambiguation(title: str) -> wikipedia.WikipediaPage:
    """Handle Wikipedia disambiguation pages.

    Args:
        title: Wikipedia article title

    Returns:
        Selected Wikipedia page
    """
    while True:
        try:
            return wikipedia.page(title, auto_suggest=False)
        except wikipedia.DisambiguationError as e:
            print(f"\n⚠️ '{title}' is ambiguous. Choose a more specific option:")
            options = e.options[:5]
            for i, option in enumerate(options, 1):
                print(f"{i}. {option}")
            choice = get_user_selection(options, "Choose correct option (1-5): ")
            title = options[choice]


def get_wikipedia_facts(topic: str, num_facts: int = 5) -> tuple[List[str], str]:
    """Fetch Wikipedia facts with robust error handling.

    Args:
        topic: Topic to search for
        num_facts: Number of facts to retrieve

    Returns:
        Tuple of (list of facts, page title)

    Raises:
        WikipediaError: If no results found or other Wikipedia-related errors
    """
    try:
        search_results = wikipedia.search(topic, results=5)
        if not search_results:
            raise WikipediaError(f"No results found for '{topic}'")

        print(f"\n🔍 Wikipedia results for '{topic}':")
        for i, result in enumerate(search_results, 1):
            print(f"{i}. {result}")

        choice = get_user_selection(search_results, "Choose article number (1-5): ")
        page = handle_disambiguation(search_results[choice])

        sentences = re.split(
            r"(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s", page.content
        )[:num_facts]
        cleaned_sentences = [
            re.sub(r"^\d+\.\s*|^[-•]\s*", "", s.strip()) for s in sentences if s.strip()
        ]

        print("\n---------------------")
        print(f"🔗 Read more: {page.url}")
        print("---------------------\n")

        return cleaned_sentences, page.title

    except Exception as e:
        raise WikipediaError(f"Error fetching Wikipedia content: {str(e)}") from e


def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculate cosine similarity between two vectors.

    Args:
        vec1: First vector
        vec2: Second vector

    Returns:
        Cosine similarity between the vectors
    """
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


def check_fact_similarity(
    fact: str, stored_embeddings: List[np.ndarray], threshold: float = 0.7
) -> bool:
    """Check if a fact is too similar to existing facts.

    Args:
        fact: Fact to check
        stored_embeddings: List of stored fact embeddings
        threshold: Similarity threshold

    Returns:
        True if fact is sufficiently different, False otherwise
    """
    fact_embedding = model.encode([fact])[0]
    for embedding in stored_embeddings:
        if cosine_similarity(fact_embedding, embedding) > threshold:
            return False
    return True


def reword_facts_with_gpt(facts: List[str], topic: str) -> List[str]:
    """Use GPT to rewrite Wikipedia facts while preserving meaning.

    Args:
        facts: List of facts to rewrite
        topic: Topic of the facts

    Returns:
        List of rewritten facts
    """
    prompt = f"""Rewrite these 2 facts about {topic} as standalone statements.
    Each must be ONE sentence. Do NOT number them. Maintain accuracy:
    - {facts[0]}
    - {facts[1]}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=150,
    )

    rewritten = response.choices[0].message.content.strip()
    sentences = sent_tokenize(rewritten)
    return [re.sub(r"^(\d+\.\s*|-\s*)", "", s).strip() for s in sentences[:2]]


def generate_fake_fact(real_fact: str, topic: str) -> str:
    """Generate a plausible but false statement.

    Args:
        real_fact: Example real fact to base generation on
        topic: Topic of the fact

    Returns:
        Generated fake fact
    """
    prompt = f"""Create a believable-sounding but false statement about {topic}.
    Use this real fact as a training example.
    Make sure to generate into a different FALSE single sentence statement that is still believable.
    Real Fact: {real_fact}
    Fake Version:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
    )
    return response.choices[0].message.content.strip()


def play_game_round() -> None:
    """Run a single round of the Two Truths and a Lie game."""
    try:
        topic = input("🔍 Enter a topic (e.g., Black Holes, Ancient Rome, The Moon): ")
        print("\n🔍 Fetching real facts from Wikipedia...")

        original_facts, page_title = get_wikipedia_facts(topic)
        if len(original_facts) < 2:
            print("❌ Not enough facts found. Try another topic.")
            return

        true_facts = reword_facts_with_gpt(original_facts, page_title)
        stored_embeddings = [model.encode([fact])[0] for fact in original_facts]

        # Generate and validate fake fact
        lie_fact = generate_fake_fact(random.choice(original_facts), page_title)
        attempts = 0
        while not check_fact_similarity(lie_fact, stored_embeddings) and attempts < 3:
            print("⚠️ Lie too similar to real fact! Regenerating...")
            lie_fact = generate_fake_fact(random.choice(original_facts), page_title)
            attempts += 1

        # Present facts and handle user interaction
        all_facts = true_facts + [lie_fact]
        random.shuffle(all_facts)

        print("\n🤔 Which one is the LIE?")
        for idx, fact in enumerate(all_facts, 1):
            print(f"{idx}. {fact}")

        guess = get_user_selection(all_facts, "\nEnter the number of the fake fact: ")
        print(
            "🎉 Correct! That was the lie."
            if all_facts[guess] == lie_fact
            else "❌ Nope! That was actually true."
        )

        if input("\nWant to see the real facts? (yes/no): ").strip().lower() == "yes":
            print("\n✅ Some Real Facts:")
            for i, fact in enumerate(original_facts, 1):
                print(f"{i}. {fact}")

    except WikipediaError as e:
        print(f"❌ {str(e)}")
    except (ValueError, IndexError) as e:
        print(f"❌ An error occurred: {str(e)}")


def main() -> None:
    """Main game loop."""
    while True:
        print("\n🎭 Welcome to 'Two Truths and a Lie' - AI Edition!")
        play_game_round()

        if input("\nDo you want to play again? (yes/no): ").strip().lower() != "yes":
            print("Thanks for playing! Goodbye!")
            break


if __name__ == "__main__":
    main()
