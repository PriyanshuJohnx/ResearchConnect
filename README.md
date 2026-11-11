# ResearchConnect
### Research Collaboration & Publication Recommendation System

ResearchConnect is a web-based platform designed to help researchers discover relevant research publications, identify potential collaborators and understand research papers through automated summarization.

## 🚀 Features

- **Researcher Registration:** Create researcher accounts and securely manage login sessions.
- **Research Paper Search:** Search for academic publications using research topics and keywords.
- **Paper Recommendations:** Discover relevant research publications with links to their sources.
- **Researcher Collaboration:** Find potential research collaborators based on similarities in research interests.
- **Paper Summarization:** Generate concise summaries of research paper abstracts.
- **Database Integration:** Store researcher information using PostgreSQL.

## 🛠️ Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript
- Jinja2 Templates

**Backend**
- Python
- FastAPI
- SQLAlchemy

**Database**
- PostgreSQL

**Machine Learning**
- Scikit-learn
- TF-IDF Vectorization
- Cosine Similarity

**External API**
- OpenAlex API

## 📁 Project Structure

```text
Research-Collaboration-System/
│
├── main.py
├── database.py
├── models.py
├── schemas.py
├── summarizer.py
├── requirements.txt
├── .gitignore
│
└── templates/
    ├── dashboard.html
    ├── index.html
    └── register.html
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PriyanshuJohnx/ResearchConnect.git
```

### 2. Navigate to the Project

```bash
cd ResearchConnect
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

### 4. Activate the Virtual Environment

Windows:

```bash
venv\Scripts\activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Configure PostgreSQL

- Install and start PostgreSQL.
- Create a database named `research_collaboration`.
- Configure your database connection and session secret in a `.env` file according to the variables used in the project.

**Note:** Never upload your `.env` file or expose database passwords and secret keys.

### 7. Run the Application

```bash
python -m uvicorn main:app --reload
```

### 8. Open in Browser

```text
http://127.0.0.1:8000
```

## 🧠 Recommendation Method

ResearchConnect uses TF-IDF vectorization and cosine similarity to identify researchers whose research interests are similar.

The system compares research-interest text and recommends potential collaborators based on similarity scores.

## 📄 Paper Summarization

The system uses a local extractive summarization algorithm to identify important sentences from research paper abstracts and generate concise summaries.

## 🎯 Project Objective

The primary objective of ResearchConnect is to simplify academic research discovery and encourage collaboration by connecting researchers with relevant publications and potential research partners.

## 👨‍💻 Developer

Developed as a Final Year Project.

**Project Name:** ResearchConnect  
**Domain:** Research Collaboration and Recommendation System