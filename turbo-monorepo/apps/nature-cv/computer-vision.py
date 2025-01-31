import cv2
import yt_dlp  # using yt-dlp directly instead of pafy
import torch
import warnings
import time
import os
from dotenv import load_dotenv
warnings.filterwarnings("ignore", category=FutureWarning)

load_dotenv()
from openai import OpenAI
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),  # This is the default and can be omitted
)
def get_stream_url(video_url):
    ydl_opts = {
        'quiet': True,
        'skip_download': True,
        'format': 'best[ext=mp4]/best'
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(video_url, download=False)
            # Use the best available stream
            return info['url']
        except Exception as e:
            print("Error extracting video URL:", e)
            return None

def generate_story(detections):
    if not detections:
        return "No significant wildlife observed in the current interval."
    system_instructions=f"You are modern day comedic story teller based on the observations you are making about this wildlife scene. You are good at personification and generating interest through conflict in short descriptive action statements, as a narrator adding commentary in a single sentence."
    prompt = f"Comment on these current wildlife observations: {', '.join(detections)}."
    try:
        chat_completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_instructions},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        # The new ChatCompletion API returns a list of choices where each choice has a 'message' key.
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        print("OpenAI API error:", e)
        return "Story generation failed due to an API error."
# Load YOLOv5 model (ensure PyTorch >=1.8)
try:
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
except Exception as e:
    print("Error loading YOLOv5 model:", e)
    raise


video_url = "https://www.youtube.com/watch?v=kRzPf-cGRec"
stream_url = get_stream_url(video_url)
if not stream_url:
    raise RuntimeError("Failed to get the stream URL.")

cap = cv2.VideoCapture(stream_url)
if not cap.isOpened():
    raise RuntimeError("Could not open video stream.")


detections_log = []

# Periodically generate a narrative every 30 seconds
last_story_time = time.time()
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    try:
        results = model(frame)
        annotated_frame = results.render()[0]
        print(results.pandas().xyxy)
        detected_labels = results.pandas().xyxy[0]['name'].tolist()
        detections_log.extend(detected_labels)
    except Exception as e:
        print("Detection error:", e)
        annotated_frame = frame

    cv2.imshow("Wildlife Detection", annotated_frame)

    # current_time = time.time()
    # if current_time - last_story_time > 30 and detections_log:
    #     unique_detections = list(set(detections_log))
    #     story = generate_story(unique_detections)
    #     print("Generated Story:", story)
    #     detections_log = []  # reset log
    #     last_story_time = current_time

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()


