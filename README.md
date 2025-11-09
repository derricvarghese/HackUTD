# README

## Frontend
- **Using**: React + TypeScript + Vite
- **Styling**: Tailwind CSS

### Features:
- Webcam emotion detection with face tracking
- Speech-to-text feedback input
- Live dashboard with charts

## Backend
- **Using**: Express.js + TypeScript
- **Storage**: In-Memory

### Endpoints:
- `POST /api/emotions/analyze`  
  Send webcam image → Get emotion detection

- `POST /api/feedback`  
  Send text feedback → Get sentiment analysis

- `GET /api/happiness-score`  
  Get overall happiness score (0-100)

- `GET /api/trends`  
  Get 24-hour emotion trends

## AI
- **Using**: Google Gemini 2.0 Flash API

### Vision API
- Analyzes facial expressions

### Text API
- Analyzes customer feedback

### Face detection
- Runs in browser (TensorFlow.js)
