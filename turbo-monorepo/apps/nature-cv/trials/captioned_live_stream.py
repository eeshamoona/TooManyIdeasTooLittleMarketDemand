# pylint: disable=missing-module-docstring, invalid-name, no-member

import cv2
import yt_dlp  # for extracting the YouTube stream URL
import torch
import time
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

# ---------------------------
# Step 1: Get the YouTube stream URL using yt-dlp
# ---------------------------
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

# ---------------------------
# Step 2: Load the pre-trained BLIP image captioning model
# ---------------------------
print("Loading BLIP model...")
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
caption_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def generate_caption(frame):
    # Convert the OpenCV frame (BGR) to a PIL Image (RGB)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(rgb_frame)
    inputs = processor(pil_image, return_tensors="pt")
    out = caption_model.generate(**inputs)
    caption = processor.decode(out[0], skip_special_tokens=True)
    return caption

# ---------------------------
# Step 3: Open the YouTube stream with OpenCV
# ---------------------------
video_url = "https://www.youtube.com/watch?v=EvsLqQS_80E"
stream_url = get_stream_url(video_url)
if not stream_url:
    raise RuntimeError("Failed to get the stream URL.")

cap = cv2.VideoCapture(stream_url)
if not cap.isOpened():
    raise RuntimeError("Could not open video stream.")

print("Press 'q' in the display window to quit.")

# ---------------------------
# Step 4: Process frames and update caption every N seconds
# ---------------------------
caption_interval = 5.0  # seconds between caption updates
last_caption_time = 0
current_caption = "Generating caption..."  # initial placeholder

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("No frame retrieved; stream may have ended or encountered an error.")
        break

    # Check if it's time to update the caption
    current_time = time.time()
    if current_time - last_caption_time > caption_interval:
        try:
            # Update the caption based on the current frame
            current_caption = generate_caption(frame)
            last_caption_time = current_time
        except Exception as e:
            print("Error generating caption:", e)
            current_caption = "Caption unavailable."

    # Draw a background rectangle for better contrast
    (text_width, text_height), baseline = cv2.getTextSize(current_caption, cv2.FONT_HERSHEY_PLAIN, 0.7, 2)
    
    # Get frame dimensions
    frame_h, frame_w = frame.shape[:2]
    # Choose the font, scale, and thickness (using a larger scale for readability)
    font = cv2.FONT_HERSHEY_DUPLEX
    font_scale = 1.2
    thickness = 3

    # Compute text size and baseline
    (text_width, text_height), baseline = cv2.getTextSize(current_caption, font, font_scale, thickness)
    # Position: bottom center of the frame with a margin (say 20 pixels from bottom)
    x = (frame_w - text_width) // 2
    y = frame_h - 20

    # Draw a filled rectangle for the background behind the text
    cv2.rectangle(frame, (x, y - text_height - baseline), (x + text_width, y + baseline), (0, 0, 0), thickness=cv2.FILLED)
    
    # Draw the text outline for contrast (thicker black text)
    cv2.putText(frame, current_caption, (x, y), font, font_scale, (0, 0, 0), thickness+2, lineType=cv2.LINE_AA)
    # Draw the text in white
    cv2.putText(frame, current_caption, (x, y), font, font_scale, (255, 255, 255), thickness, lineType=cv2.LINE_AA)
    
    
    cv2.imshow("Smart Wildlife Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()