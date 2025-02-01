import cv2
import yt_dlp  # For extracting the stream URL
import torch
import openai
import base64
import warnings
import os
from dotenv import load_dotenv
load_dotenv()
warnings.filterwarnings("ignore", category=FutureWarning)
from openai import OpenAI
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),  # This is the default and can be omitted
)
# Define your system instructions (customize as needed)
system_instructions=f"You are modern day comedic story teller based on the observations you are making about this wildlife scene. You are good at personification and generating interest through conflict in short descriptive action statements, as a narrator adding commentary in one quick concise single sentence. You must be concise and witty."

def encode_image_to_base64(image_path, img_ext=".jpg"):
    # Read the image from disk
    image = cv2.imread(image_path)
    if image is None:
        print("Could not load image from", image_path)
        return None
    ret, buffer = cv2.imencode(img_ext, image)
    if not ret:
        print("Error encoding image.")
        return None
    return base64.b64encode(buffer).decode('utf-8')

def generate_story_from_image():
    # Construct a basic prompt. (You can further customize with context.)
    prompt = f"Comment on these current wildlife observations."

    # Encode the latest screenshot
    img_b64_str = encode_image_to_base64("current_frame.jpg", img_ext=".jpg")
    if img_b64_str is None:
        return "Failed to encode the image for story generation."

    try:
        # Call the OpenAI API with both text and an encoded image.
        # (This example assumes your endpoint/model supports an 'image_url' field using a data URI.)
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Replace with your desired model
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64_str}"}}
                ]}
            ],
            temperature=0.7,
            max_tokens=100,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        # Extract the generated story from the response.
        story = response.choices[0].message.content.strip()
        return story
    except Exception as e:
        print("OpenAI API error:", e)
        return "Story generation failed due to an API error."

if __name__ == "__main__":
    print("Type 'exit' and press Enter to quit.")
    while True:
        user_input = input("\nPress Enter to capture the current frame and generate a story (or type 'exit' to quit): ").strip().lower()
        if user_input == "exit":
            print("Exiting story generation.")
            break
        story = generate_story_from_image()
        print("Generated Story:\n", story)
