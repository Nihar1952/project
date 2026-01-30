import sys
import os
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

vectorizer = joblib.load(os.path.join(MODEL_DIR, "vectorizer.pkl"))
classifier = joblib.load(os.path.join(MODEL_DIR, "classifier.pkl"))

def read_text(path):
    try:
        with open(path, "rb") as f:
            return f.read().decode(errors="ignore")
    except:
        return ""

if __name__ == "__main__":
    file_path = sys.argv[1]
    text = read_text(file_path)

    X = vectorizer.transform([text])
    label = classifier.predict(X)[0]
    print(label)
