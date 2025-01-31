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
# Define your system instructions if needed (optional)
system_instructions=f"You are modern day comedic story teller based on the observations you are making about this wildlife scene. You are good at personification and generating interest through conflict in short descriptive action statements, as a narrator adding commentary in one quick concise single sentence. You must be concise and witty."

# Helper function to extract the stream URL using yt-dlp
def get_stream_url(video_url):
    ydl_opts = {
        'quiet': True,
        'skip_download': True,
        'format': 'best[ext=mp4]/best'
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(video_url, download=False)
            return info['url']
        except Exception as e:
            print("Error extracting video URL:", e)
            return None

# Load YOLOv5 model from torch hub
try:
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
except Exception as e:
    print("Error loading YOLOv5 model:", e)
    raise

# Function to encode an image frame into a base64 string
def encode_frame_to_base64(frame, img_ext=".jpg"):
    ret, buffer = cv2.imencode(img_ext, frame)
    if not ret:
        print("Error encoding frame to image format.")
        return None
    return base64.b64encode(buffer).decode('utf-8')

# Enhanced story generation function that sends both text and image information
def generate_detailed_story(detailed_descriptions, frame, img_type='image/jpeg'):
    # If no detailed descriptions are provided, return a fallback message.
    if not detailed_descriptions:
        return "No significant wildlife observed in the current interval."
    
    # Construct a prompt that includes the detailed descriptions.
    # For example: "Describe a small blue jay perched on a branch..."
    prompt = f"Comment on these current wildlife observations."
    
    # Encode the provided frame to a base64 string.
    img_b64_str = encode_frame_to_base64(frame, img_ext=".jpg")
    if img_b64_str is None:
        return "Failed to encode image for story generation."
    
    try:
        # Call the OpenAI ChatCompletion API using the model that supports image input.
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                # Optionally include a system message if desired.
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:{img_type};base64,{img_b64_str}"}}
                ]}
            ],
            temperature=1,
            max_tokens=2048,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        # Extract and return the text from the API response.
        return response.choices[0].message.content.strip()
    except Exception as e:
        print("OpenAI API error:", e)
        return "Story generation failed due to an API error."

# Main loop to capture the stream, run detection, and generate a story periodically.
video_url = "https://www.youtube.com/watch?v=EvsLqQS_80E"
stream_url = get_stream_url(video_url)
if not stream_url:
    raise RuntimeError("Failed to get the stream URL.")

cap = cv2.VideoCapture(stream_url)
if not cap.isOpened():
    raise RuntimeError("Could not open video stream.")

detections_log = []  # This will store detailed detection descriptions
last_story_time = cv2.getTickCount()  # Initialize timer

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("No frame retrieved; check stream connectivity.")
        break

    # Run object detection using YOLOv5
    try:
        results = model(frame)
        annotated_frame = results.render()[0]
    except Exception as e:
        print("Detection error:", e)
        annotated_frame = frame

    # Here we assume that results.pandas().xyxy[0]['name'] returns labels.
    # For detailed descriptors, you might want to add extra processing.
    try:
        labels = results.pandas().xyxy[0]['name'].tolist()
        # Example: Enhance "bird" detections with extra descriptors.
        detailed_descriptions = []
        for label in labels:
            if label.lower() == "bird":
                # In a real application, you could use an image classification or captioning model here.
                detailed_descriptions.append("a small blue jay with striking plumage perched gracefully on a branch")
            else:
                detailed_descriptions.append(label)
        detections_log.extend(detailed_descriptions)
    except Exception as e:
        print("Error processing detection results:", e)

    cv2.imshow("Wildlife Detection", annotated_frame)

    # Check if 30 seconds have passed (using tick count for higher resolution timing)
    current_ticks = cv2.getTickCount()
    elapsed_sec = (current_ticks - last_story_time) / cv2.getTickFrequency()
    if elapsed_sec > 30 and detections_log:
        # Remove duplicates for clarity
        unique_detections = list(set(detections_log))
        story = generate_detailed_story(unique_detections, frame)
        print("Generated Story:", story)
        detections_log = []  # Reset log for next interval
        last_story_time = cv2.getTickCount()

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
