import cv2
import yt_dlp  # for extracting the YouTube stream URL
import torch
import time
import threading
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import textwrap
import warnings

warnings.filterwarnings("ignore", category=FutureWarning)

# ---------------------------
# Global Variables for Multithreading
# ---------------------------
caption_interval = 5.0  # How often to update BLIP caption
current_caption = "Captions starting..."
frame_lock = threading.Lock()
latest_frame = None

# Store bounding boxes from YOLO in a separate global to help with rendering
boxes_lock = threading.Lock()
bounding_boxes = []  # Each item: (x1, y1, x2, y2, label)

# ---------------------------
# Get Detection Models
# ---------------------------
def load_models():
    """
    Load the AI models for image captioning (BLIP) and object detection (YOLOv5).

    :return: Tuple (processor, caption_model, detection_model).
    """
    print("Loading BLIP captioning model...")
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    caption_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    
    print("Loading YOLOv5 detection model...")
    detection_model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    
    return processor, caption_model, detection_model

# ---------------------------
# Use Loaded Models on an image frame
# ---------------------------
def generate_blip_caption(frame, processor, caption_model):
    """
    Use BLIP to generate an English caption for a given frame.
    """
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(rgb_frame)
    inputs = processor(pil_image, return_tensors="pt")
    out = caption_model.generate(**inputs)
    return processor.decode(out[0], skip_special_tokens=True)

def run_yolo_detection(frame, detection_model, confidence_threshold=0.5):
    """
    Run YOLOv5 detection on a given frame and return bounding boxes.

    :param frame: The BGR image (numpy array) on which to perform detection.
    :param detection_model: The loaded YOLOv5 model object (e.g. from torch hub).
    :param confidence_threshold: Minimum confidence required to keep a detection.
    :return: A list of tuples (x1, y1, x2, y2, label).
    """
    new_boxes = []
    try:
        # Perform detection
        results = detection_model(frame)
        df = results.pandas().xyxy[0]

        # Filter out low confidence predictions
        for _, row in df.iterrows():
            if row['confidence'] > confidence_threshold:
                x1 = int(row['xmin'])
                y1 = int(row['ymin'])
                x2 = int(row['xmax'])
                y2 = int(row['ymax'])
                label = row['name']
                new_boxes.append((x1, y1, x2, y2, label))
    except Exception as e:
        print("Error in object detection:", e)
    
    return new_boxes

# ---------------------------
# Helper Functions
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
# Header Banner Function
# ---------------------------
def print_header_banner():
    """
    Print a header banner introducing the Smart Wildlife Detection program.
    """
    banner = f"""\nWelcome to Smart Wildlife Viewer:\n1. Streams any YouTube video.\n2. Generates image captions using the BLIP model.\n3. Detects objects with green borders using YOLOv5.
    \n\nPress 'q' in the display window to quit.\n"""
    print(banner)

def wrap_text(text, max_width=40):
    """Wrap text into multiple lines for better readability."""
    return textwrap.wrap(text, width=max_width)

def draw_caption(frame, text):
    """
    Draw the BLIP caption at the bottom center of the frame.
    """
    lines = wrap_text(text, max_width=70)
    font = cv2.FONT_HERSHEY_SIMPLEX

    frame_h, frame_w = frame.shape[:2]
    font_scale = min(frame_w / 1300, 0.8)
    thickness = 2

    # Calculate text sizes for proper positioning.
    text_sizes = [cv2.getTextSize(line, font, font_scale, thickness)[0] for line in lines]
    max_text_width = max(size[0] for size in text_sizes) if text_sizes else 0
    line_height = text_sizes[0][1] if text_sizes else 20
    total_height = sum(sz[1] for sz in text_sizes) + 5 * (len(lines) - 1)

    x = (frame_w - max_text_width) // 2
    y_start = frame_h - total_height - 20

    # Draw each line with an outline
    y = y_start
    for line in lines:
        cv2.putText(frame, line, (x, y), font, font_scale, (0, 0, 0), thickness + 2, cv2.LINE_AA)
        cv2.putText(frame, line, (x, y), font, font_scale, (255, 255, 255), thickness, cv2.LINE_AA)
        y += line_height + 5

def draw_yolo_boxes(frame):
    """
    Draw bounding boxes (from YOLO detection) on the given frame.
    """
    with boxes_lock:
        for (x1, y1, x2, y2, label) in bounding_boxes:
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            # Draw label text (with outline)
            lbl_y = y1 - 10 if (y1 - 10) > 10 else y1 + 20
            cv2.putText(frame, label, (x1, lbl_y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 3, cv2.LINE_AA)
            cv2.putText(frame, label, (x1, lbl_y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 1, cv2.LINE_AA)

# ---------------------------
# Worker for Captioning and Detection Service
# ---------------------------
def caption_and_detection_worker(processor, caption_model, detection_model):
    """
    Background thread that:
      - Grabs the latest frame every few seconds.
      - Runs BLIP for captioning.
      - Runs YOLOv5 for bounding boxes.
      - Updates global state.
    """
    global current_caption, bounding_boxes, latest_frame

    while True:
        time.sleep(caption_interval)
        with frame_lock:
            if latest_frame is None:
                continue
            frame_copy = latest_frame.copy()

        # Generate BLIP caption
        try:
            blip_text = generate_blip_caption(frame_copy, processor, caption_model)
        except Exception as e:
            print("Error generating BLIP caption:", e)
            blip_text = "Caption unavailable."

        # Run YOLO detection
        try:
            new_boxes = run_yolo_detection(frame_copy, detection_model, confidence_threshold=0.5)
        except Exception as e:
            print("Error generating YOLO Boxes:", e)
            new_boxes = []  # Ensure new_boxes is defined

        # Update global state
        with frame_lock:
            current_caption = blip_text
        with boxes_lock:
            bounding_boxes = new_boxes

# ---------------------------
# MAIN: Open the YouTube Stream with OpenCV
# ---------------------------
def main():
    global latest_frame  # Declare global since we update it in this function
    print_header_banner()
    
    # Get YouTube URL from the user (or use default)
    default_url = "https://www.youtube.com/watch?v=QfVOXYPIZqs"
    user_input = input("Enter a YouTube URL or press Enter for default:\n>").strip()
    video_url = user_input if user_input else default_url

    stream_url = get_stream_url(video_url)
    if not stream_url:
        print("Failed to obtain stream URL. Exiting.")
        return
    else:
        print("\nSuccess! Loading models...\n")

    # Load the AI models
    processor, caption_model, detection_model = load_models()

    # Start the background thread for captioning and detection
    worker_thread = threading.Thread(
        target=caption_and_detection_worker,
        args=(processor, caption_model, detection_model),
        daemon=True
    )
    worker_thread.start()

    cap = cv2.VideoCapture(stream_url)
    if not cap.isOpened():
        raise RuntimeError("Could not open video stream.")

    # Create a named window with a fixed size
    cv2.namedWindow("Smart Wildlife Detection", cv2.WINDOW_NORMAL)
    cv2.resizeWindow("Smart Wildlife Detection", 800, 600)

    print("\nRemember: Press 'q' in the display window to quit.\n")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("No frame retrieved; stream may have ended or encountered an error.")
            break

        # Update the global latest_frame
        with frame_lock:
            latest_frame = frame.copy()

        # Draw YOLO bounding boxes
        draw_yolo_boxes(frame)

        # Draw the BLIP caption
        draw_caption(frame, current_caption)

        cv2.imshow("Smart Wildlife Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Goodbye. Thanks for watching!")

if __name__ == "__main__":
    main()
