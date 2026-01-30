import os
import joblib
import numpy as np
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

DATASET_PATH = "dataset/option_c_dataset_v2"
MODEL_PATH = "model"

os.makedirs(MODEL_PATH, exist_ok=True)

def read_text(file_path):
    if file_path.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    if file_path.endswith(".pdf"):
        reader = PdfReader(file_path)
        return " ".join(page.extract_text() or "" for page in reader.pages)

    return ""  # binary or unsupported

def load_dataset():
    texts, labels = [], []

    for label in ["LOW", "MEDIUM", "HIGH"]:
        folder = os.path.join(DATASET_PATH, label)
        for file in os.listdir(folder):
            path = os.path.join(folder, file)
            content = read_text(path)

            if content.strip():
                texts.append(content)
                labels.append(label)

    return texts, labels

print("🔹 Loading dataset...")
texts, labels = load_dataset()

print("🔹 Vectorizing text...")
vectorizer = TfidfVectorizer(
    max_features=5000,
    stop_words="english"
)
X = vectorizer.fit_transform(texts)

print("🔹 Training classifier...")
model = LogisticRegression(
    max_iter=1000,
    n_jobs=1
)
model.fit(X, labels)

print("🔹 Saving model...")
joblib.dump(model, os.path.join(MODEL_PATH, "classifier.pkl"))
joblib.dump(vectorizer, os.path.join(MODEL_PATH, "vectorizer.pkl"))

print("✅ Training complete")
