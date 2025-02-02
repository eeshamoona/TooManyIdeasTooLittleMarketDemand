# pylint: disable=missing-module-docstring, invalid-name, no-member

import warnings

import cv2
import torch
import yt_dlp  # using yt-dlp directly instead of pafy

warnings.filterwarnings("ignore", category=FutureWarning)

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

# Load YOLOv5 model (using torch hub; ensure PyTorch >=1.8 is installed)
try:
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
except Exception as e:
    print("Error loading YOLOv5 model:", e)
    raise

# Replace with your desired YouTube URL
video_url = "https://www.youtube.com/watch?v=EvsLqQS_80E"
stream_url = get_stream_url(video_url)
if not stream_url:
    raise RuntimeError("Failed to get the stream URL.")

cap = cv2.VideoCapture(stream_url)
if not cap.isOpened():
    raise RuntimeError("Could not open video stream.")

print("Press 'q' in the display window to quit. Meanwhile, the latest frame is saved to 'current_frame.jpg'.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("No frame retrieved; check stream connectivity.")
        break

    # Run detection; note that we only display the annotated frame.
    try:
        results = model(frame)
        annotated_frame = results.render()[0]
    except Exception as e:
        print("Detection error:", e)
        annotated_frame = frame

    # Save the current frame to disk for story generation.
    cv2.imwrite("current_frame.jpg", frame)

    cv2.imshow("Live Wildlife Detection", annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
