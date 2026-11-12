# ResearchConnect
### Research Collaboration & Publication Recommendation System

ResearchConnect is a web-based research collaboration platform designed to help researchers discover academic publications and connect with other researchers who share similar research interests.

The system provides research paper searching, paper summarization, researcher profiles, and collaborator recommendations based on research-interest similarity.

## 1. Project Objectives

- Help researchers discover relevant academic publications.
- Provide summaries of research papers.
- Recommend researchers with similar research interests.
- Maintain researcher profiles.
- Simplify the process of discovering potential research collaborators.

## 2. Key Features

### User Registration and Authentication
- Researcher registration and login.
- Secure password hashing.
- Session-based authentication.
- Logout functionality.

### Research Paper Search
- Search academic publications using the OpenAlex API.
- Display paper titles, authors, abstracts, publication years and available links.

### Paper Summarization
- Generate concise summaries of research paper abstracts.
- Uses a local extractive summarization approach.

### Researcher Recommendations
- Recommend researchers based on similar research interests.
- Uses TF-IDF vectorization and cosine similarity.
- Displays similarity scores for recommended researchers.

### Researcher Profile
- Display researcher name, email and research interests.
- Retrieve profile information from the backend database.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Programming Language | JavaScript |
| Styling | HTML, CSS, Bootstrap |
| Frontend Development Tool | Vite |
| API Communication | Axios |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | Session-based authentication |
| Password Security | Password Hashing |
| Research Paper API | OpenAlex |
| Recommendation Algorithm | TF-IDF and Cosine Similarity |

## 4. System Architecture

ResearchConnect follows a client-server architecture.

1. **Frontend:** React provides the user interface and dashboard.
2. **Backend:** FastAPI handles authentication, application logic and API requests.
3. **Database:** PostgreSQL stores researcher information.
4. **External API:** OpenAlex provides academic publication data.
5. **Recommendation Engine:** TF-IDF and cosine similarity identify researchers with similar interests.

## 5. Project Structure

```text
Research-Collaboration-System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── venv/
├── main.py
├── database.py
├── models.py
├── schemas.py
├── summarizer.py
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

## 6. Installation and Setup

### Prerequisites

- Python
- Node.js and npm
- PostgreSQL
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/PriyanshuJohnx/ResearchConnect.git
```

```bash
cd ResearchConnect
```

### Step 2: Set Up the Python Environment

```bash
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

### Step 3: Configure the Database

- Install and start PostgreSQL.
- Create the required database.
- Configure the database connection using the environment variables expected by `database.py`.
- Create the `.env` file with the required configuration.

### Step 4: Start the Backend

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Step 5: Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

### Step 6: Start the React Application

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## 7. Team Members and Responsibilities

### Member 1 – System Analysis and Documentation
**Role: System Analyst**

- Problem identification and requirement analysis.
- Project objectives and scope definition.
- Existing and proposed system analysis.
- System architecture and design.
- Project documentation and presentation preparation.

### Member 2 – Backend and Database Development
**Role: Backend Developer**

- FastAPI backend development.
- PostgreSQL database integration.
- Researcher registration and authentication.
- Password hashing and session management.
- OpenAlex API integration.
- Researcher recommendation algorithm using TF-IDF and cosine similarity.
- Backend API development.

### Member 3 – Frontend and Application Integration
**Role: Frontend Developer**

- React frontend development.
- Homepage and dashboard design.
- Registration and login interfaces.
- Research paper search interface.
- Paper summarization interface.
- Researcher profile interface.
- Collaborator recommendation display.
- Frontend-backend integration and application testing.

All three members contributed to the overall development, integration and testing of the project.

## 8. Current Limitations

- Paper summarization currently uses a basic extractive summarization approach.
- Researcher recommendations are based on similarities in textual research interests.
- The system does not currently provide direct collaboration invitations or messaging.

## 9. Future Enhancements

- Advanced AI-based research paper summarization.
- Improved researcher recommendation algorithms.
- Collaboration request and acceptance functionality.
- Researcher-to-researcher messaging.
- Research group creation and management.
- Advanced publication filtering and recommendations.

## 10. Repository

GitHub Repository:

https://github.com/PriyanshuJohnx/ResearchConnect

---

**ResearchConnect – Connecting Researchers, Discovering Knowledge.**