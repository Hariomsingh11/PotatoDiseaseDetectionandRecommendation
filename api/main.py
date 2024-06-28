from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("./models/1")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

def is_potato_leaf(image: np.ndarray) -> bool:
    
    green_threshold = 15
    min_green_ratio = 0.05 
    green_pixels = np.sum((image[:, :, 1] > 100) & (image[:, :, 0] < 150) & (image[:, :, 2] < 150))
    total_pixels = image.shape[0] * image.shape[1]
    green_percentage = (green_pixels / total_pixels) * 100
    if green_percentage > green_threshold and (green_pixels / total_pixels) > min_green_ratio:
        return True
    else:
        return False

    

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


@app.get("/ping")
async def ping():
    return "Hello, I am alive"


@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    try:
        
        image = read_file_as_image(await file.read())
        
       
        if is_potato_leaf(image):
            img_batch = np.expand_dims(image, 0)
            
            
            predictions = MODEL.predict(img_batch)
            predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
            confidence =float(np.max(predictions[0]))
            
            return {
                'class': predicted_class,
                'confidence': confidence
            }
        else:
            return {
                'class': "Not a potato leaf",
                'confidence': 0
            }
    except Exception as e:
        print("Error:", e)
        return {"error": "An error occurred"}

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)