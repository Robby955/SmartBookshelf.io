import cv2
import matplotlib.pyplot as plt

def preprocess_image(image_path, crop_coordinates=None):
    image = cv2.imread(image_path)
    if crop_coordinates:
        x, y, w, h = crop_coordinates
        cropped_image = image[y:y+h, x:x+w]
        return cropped_image
    return image

def visualize_image(image, title="Image"):
    plt.figure(figsize=(10, 10))
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    plt.title(title)
    plt.axis('off')
    plt.show()

def draw_crop_rectangle(image, crop_coordinates, color=(0, 255, 0), thickness=2):
    x, y, w, h = crop_coordinates
    image_with_rectangle = image.copy()
    cv2.rectangle(image_with_rectangle, (x, y), (x+w, y+h), color, thickness)
    return image_with_rectangle

# Example usage
image_path = '../test_images/IMG_7_3.jpg'
crop_coordinates = (50, 50, 400, 300)  # Example coordinates (x, y, width, height)

# Full image
full_image = preprocess_image(image_path)
visualize_image(full_image, title="Full Image")

# Cropped image
cropped_image = preprocess_image(image_path, crop_coordinates)
visualize_image(cropped_image, title="Cropped Image")

# Full image with crop rectangle
full_image_with_rectangle = draw_crop_rectangle(full_image, crop_coordinates)
visualize_image(full_image_with_rectangle, title="Full Image with Crop Rectangle")
