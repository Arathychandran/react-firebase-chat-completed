<<<<<<< HEAD

# SignAssist

=======

# Sign Language Translator Application

A comprehensive application for bridging communication gaps between sign language users and others. This application provides translation between text/speech and Indian Sign Language (ISL), as well as sign language recognition with emotion detection.

## Features

- **Voice to Text Conversion**: Record speech and convert it to text
- **Text to Sign Language**: Convert text to Indian Sign Language videos
- **Sign Language to Text**: Record sign language videos and convert them to text
- **Emotion Recognition**: Detect emotions from both text and sign language videos

## Prerequisites

- Python 3.8 or higher
- Webcam for sign language recording
- Microphone for voice recording
- The required ISL videos in the data/isl_videos directory

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/Arathychandran/react-firebase-chat-completed.git
   cd sign-language-translator
   ```

2. Install the required dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Download pre-trained models (not included in the repository due to size):

   - Place sign language model in: `models/sign_language_model.h5`
   - Place metadata file in: `models/metadata.pkl`
   - Place emotion models in: `models/emotion_model_svm.pkl`, `models/tfidf_vectorizer.pkl`, and `models/label_encoder.pkl`

4. Add ISL videos to `vedios - Copy - Copy`. The videos should follow these naming conventions:
   - Word videos: `Word.mp4` (e.g., `Hello.mp4`, `Thank.mp4`)
   - Letter videos: `A.mp4`, `B.mp4`, etc.

## Usage

1. Start the application:

   ```
   python app.py  #For conversion interface
   npm run dev    #For chat interface
   ```

2. Open your browser and navigate to http://localhost:5173

3. Choose the desired functionality:
   - Text to Sign Language: Enter text or record voice to convert to ISL videos
   - Sign Language to Text: Record or upload sign language videos to convert to text

## Application Structure

```
REACT-FIREBASE-CHAT-C...          #The Chat Interface
│
├── models/
├── node_modules/
├── public/
├── src/
├── ...
├── signassist/                   #The Conversion Part
│   ├── __pycache__/
│   ├── models/
│   ├── static/
│   ├── templates/
│   ├── vedios - Copy - Copy/
│   ├── vedios - Copy/
│   ├── app.py
│   ├── balanced_emotions.pkl
│   ├── emotion_model_svm.pkl
│   ├── label_encoder.pkl
│   ├── output.mp4
│   ├── README.md
│   ├── sign_processor.py
│   ├── signtrain.py
│   ├── text_processor.py
│   ├── tfidf_vectorizer.pkl
│   ├── train.py
├── src/
├── vedios - Copy*/
│
├── .eslintrc.cjs
├── .gitignore
├── emotion_model_svm.pkl
├── index.html
├── label_encoder.pkl
├── logo.png
├── package.json
├── package-lock.json
├── README.md
├── requirement.txt
├── sign_history.pkl
├── text_history.pkl
├── tfidf_vectorizer.pkl
├── vite.config.js
│
└── sign_language_app/
├── models/
├── data/
├── static/
├── templates/
├── app.py
├── text_processor.py
├── sign_language_processor.py
└── requirements.txt

```

## Technologies Used

- **Backend**: Flask, TensorFlow, MediaPipe, DeepFace, NLTK
- **Frontend**: HTML, CSS, JavaScript, React
- **Media Processing**: OpenCV, MoviePy, SpeechRecognition

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This application uses pre-trained models for sign language recognition and emotion detection
- Special thanks to the MediaPipe team for their hand tracking implementation
  > > > > > > > 79ebef6 (ch)
