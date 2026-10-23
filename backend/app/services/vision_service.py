import cv2
import numpy as np


def normalize_crop_name(crop_name: str) -> str:
    return crop_name.strip().lower()


def run_image_analysis(image_bytes: bytes, crop_name: str) -> dict:
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not read image")

    image_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    brightness = float(np.mean(image_rgb))
    saturation = float(np.mean(hsv[:, :, 1]))
    contrast = float(np.std(image_rgb))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    edge_density = float(np.mean(edges > 0))

    defects = []
    defect_score = 0

    if saturation < 60:
        defects.append("dull color")
        defect_score += 12

    if brightness < 80:
        defects.append("dark appearance")
        defect_score += 12

    if brightness > 200:
        defects.append("overexposed lighting")
        defect_score += 10

    if contrast > 150:
        defects.append("high visual variance")
        defect_score += 6

    if edge_density > 0.12:
        defects.append("possible bruising or damage")
        defect_score += 18

    if edge_density < 0.03:
        defects.append("low texture detail")
        defect_score += 8

    crop = normalize_crop_name(crop_name)
    base_life = {
        "potato": 60,
        "potatoes": 60,
        "cabbage": 45,
        "tomato": 10,
        "tomatoes": 10,
        "carrot": 35,
        "carrots": 35,
        "onion": 90,
        "onions": 90,
        "maize": 120,
        "cassava": 30,
        "beans": 180,
        "pepper": 12,
        "spinach": 7,
    }.get(crop, 30)

    visual_quality = 100 - defect_score
    visual_quality = max(0, min(100, visual_quality))

    return {
        "visual_quality_score": round(float(visual_quality), 2),
        "defects": sorted(set(defects)),
        "brightness": round(brightness, 2),
        "saturation": round(saturation, 2),
        "contrast": round(contrast, 2),
        "edge_density": round(edge_density, 2),
        "estimated_base_life_days": base_life,
        "crop_confidence": 0.82,
    }
