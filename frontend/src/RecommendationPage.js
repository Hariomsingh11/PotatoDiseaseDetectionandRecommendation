import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './RecommendationPage.css';

const RecommendationPage = () => {
    const [recommendation, setRecommendation] = useState("Loading...");
    const [confidence, setConfidence] = useState(0);
    const location = useLocation();
    const selectedFile = location.state ? location.state.selectedFile : null;

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                if (!selectedFile) return; // No file selected, exit

                // Create a FormData object
                const formData = new FormData();
                formData.append("file", selectedFile);

                // Send a POST request to  FastAPI backend
                const response = await axios.post("http://localhost:8000/predict", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const { data } = response;

                // Determine recommendation based on the predicted class and confidence
                let recommendationText;
                const currentConfidence = parseFloat(data.confidence) * 100;

              
                switch (data.class) {
                  case "Early Blight":
                      recommendationText = "Recommendation for Potato Early Blight: Apply fungicides, Remove and destroy infected leaves, Practice crop rotation.Use mancozeb";
                      break;
                  case "Late Blight":
                      recommendationText = "Recommendation for Potato Late Blight: Use resistant varieties, Avoid overhead watering, Remove infected plants and debris.";
                      break;
                  case "Healthy":
                      recommendationText = "No recommendations needed. Potato plants are healthy.";
                      break;
                  default:
                      recommendationText = "No recommendations available.";
              }


                // Set the recommendation and confidence
                setRecommendation(recommendationText);
                setConfidence(currentConfidence);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
                setRecommendation("Error fetching recommendations. Please try again later.");
            }
        };

        fetchRecommendation();
    }, [selectedFile]); // Fetch recommendations whenever the selected file changes

    return (
      <div className="container" >
      <h1 className="title">Recommendations</h1>
      <div className="recommendation">
          <p className="text">{recommendation}</p>
          <p className="confidence">Confidence: {confidence.toFixed(2)}%</p>
      </div>
  </div>
    );
};

export default RecommendationPage;



































/*  if (currentConfidence >= 70) {
                    switch (data.class) {
                        case "Early Blight":
                            recommendationText = "Recommendation for Potato Early Blight (Confidence: " + currentConfidence.toFixed(2) + "%): Apply fungicides, Remove and destroy infected leaves, Practice crop rotation.";
                            break;
                        case "Late Blight":
                            recommendationText = "Recommendation for Potato Late Blight (Confidence: " + currentConfidence.toFixed(2) + "%): Use resistant varieties, Avoid overhead watering, Remove infected plants and debris.";
                            break;
                        default:
                            recommendationText = "No recommendations available.";
                    }
                } else if (currentConfidence >= 50) {
                    recommendationText = "The disease is not confirmed with high confidence (Confidence: " + currentConfidence.toFixed(2) + "%). Please consult a professional for accurate diagnosis.";
                } else {
                    recommendationText = "Not enough confidence in the prediction (Confidence: " + currentConfidence.toFixed(2) + "%). Please try again with a clearer image.";
                }*/