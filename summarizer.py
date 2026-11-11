import re
from collections import Counter


def summarize_text(text, sentence_count=5):

    if not text or not text.strip():
        return "No text available for summarization."

    # Split text into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())

    sentences = [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]

    # Return original text if it is already short
    if len(sentences) <= sentence_count:
        return " ".join(sentences)

    # Common words to ignore
    stop_words = {
        "the", "is", "are", "was", "were", "a", "an",
        "and", "or", "in", "on", "of", "to", "for",
        "with", "this", "that", "it", "by", "as",
        "using", "their", "they", "we", "our", "from",
        "which", "who", "what", "when", "where", "how",
        "has", "have", "had", "be", "been", "being",
        "will", "would", "could", "should", "can",
        "its", "these", "those", "than", "then",
        "also", "such", "into", "about", "between"
    }

    # Calculate word frequencies
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())

    filtered_words = [
        word for word in words
        if word not in stop_words and len(word) > 2
    ]

    word_frequencies = Counter(filtered_words)

    # Normalize word frequencies
    maximum_frequency = max(word_frequencies.values(), default=1)

    for word in word_frequencies:
        word_frequencies[word] /= maximum_frequency

    # Calculate sentence scores
    sentence_scores = {}

    for index, sentence in enumerate(sentences):

        sentence_words = re.findall(
            r'\b[a-zA-Z]+\b',
            sentence.lower()
        )

        sentence_words = [
            word for word in sentence_words
            if word not in stop_words and len(word) > 2
        ]

        if not sentence_words:
            sentence_scores[index] = 0
            continue

        score = sum(
            word_frequencies.get(word, 0)
            for word in sentence_words
        )

        # Prefer sentences containing more meaningful information
        score = score / len(sentence_words)

        # Give a small preference to sentences near the beginning
        if index < 3:
            score *= 1.15

        sentence_scores[index] = score

    # Select the highest-scoring sentences
    ranked_indices = sorted(
        sentence_scores,
        key=sentence_scores.get,
        reverse=True
    )

    selected_indices = sorted(
        ranked_indices[:sentence_count]
    )

    # Preserve the original sentence order
    summary = [
        sentences[index]
        for index in selected_indices
    ]

    return " ".join(summary)