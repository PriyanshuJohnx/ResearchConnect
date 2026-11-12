# ==========================================
# IMPORTS
# ==========================================

import os
import requests

from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Request
)

from starlette.middleware.sessions import SessionMiddleware

from sqlalchemy.orm import Session
from sqlalchemy import text

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from pwdlib import PasswordHash

import schemas
import models

from database import get_db, Base, engine
from summarizer import summarize_text


# ==========================================
# APPLICATION CONFIGURATION
# ==========================================

load_dotenv()

app = FastAPI(
    title="ResearchConnect",
    description="Research Collaboration and Publication Recommendation System",
    version="1.0.0"
)

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv(
        "SESSION_SECRET",
        "development-secret-change-this"
    ),
    same_site="lax",
    https_only=False
)

password_hash = PasswordHash.recommended()

Base.metadata.create_all(bind=engine)


# ==========================================
# HELPER FUNCTION: RECONSTRUCT ABSTRACT
# ==========================================

def reconstruct_abstract(abstract_index):

    if not abstract_index:
        return ""

    words = {}

    for word, positions in abstract_index.items():

        for position in positions:
            words[position] = word

    abstract = " ".join(
        words[position]
        for position in sorted(words)
    )

    return abstract


# ==========================================
# TEST API
# ==========================================

@app.get("/test")
def test():

    return {
        "message": "FastAPI is working correctly!"
    }


# ==========================================
# DATABASE CONNECTION TEST
# ==========================================

@app.get("/db-test")
def database_test():

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT version()")
            )

            version = result.scalar()

        return {
            "status": "success",
            "message": "PostgreSQL connected successfully!",
            "database_version": version
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }


# ==========================================
# RESEARCHER REGISTRATION
# ==========================================

@app.post("/users", response_model=schemas.UserResponse)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        research_interests=user.research_interests
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ==========================================
# RESEARCHER LOGIN
# ==========================================

@app.post("/login")
def login(
    credentials: schemas.LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(
        models.User.email == credentials.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.password_hash:

        raise HTTPException(
            status_code=401,
            detail="Please contact the administrator to activate your account"
        )

    if not password_hash.verify(
        credentials.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    request.session.clear()
    request.session["user_id"] = user.id

    return {
        "message": "Login successful!",
        "researcher_id": user.id,
        "name": user.name
    }


# ==========================================
# RESEARCHER PROFILE
# GET LOGGED-IN RESEARCHER DETAILS
# ==========================================

@app.get("/profile")
def get_profile(
    request: Request,
    db: Session = Depends(get_db)
):

    user_id = request.session.get("user_id")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Researcher not found"
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "research_interests": user.research_interests
    }


# ==========================================
# RESEARCHER LOGOUT
# ==========================================

@app.post("/logout")
def logout(request: Request):

    request.session.clear()

    return {
        "message": "Logged out successfully!"
    }


# ==========================================
# GET ALL RESEARCHERS
# ==========================================

@app.get(
    "/users",
    response_model=list[schemas.UserResponse]
)
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(models.User).all()

    return users


# ==========================================
# ADD RESEARCH PAPER
# ==========================================

@app.post(
    "/papers",
    response_model=schemas.PaperResponse
)
def create_paper(
    paper: schemas.PaperCreate,
    db: Session = Depends(get_db)
):

    new_paper = models.Paper(
        title=paper.title,
        authors=paper.authors,
        abstract=paper.abstract,
        keywords=paper.keywords,
        publication_year=paper.publication_year
    )

    db.add(new_paper)
    db.commit()
    db.refresh(new_paper)

    return new_paper


# ==========================================
# GET ALL RESEARCH PAPERS
# ==========================================

@app.get(
    "/papers",
    response_model=list[schemas.PaperResponse]
)
def get_papers(
    db: Session = Depends(get_db)
):

    papers = db.query(models.Paper).all()

    return papers


# ==========================================
# RESEARCH PAPER SEARCH
# USING OPENALEX API
# ==========================================

@app.get("/search/papers")
def search_papers(
    query: str,
    request: Request
):

    user_id = request.session.get("user_id")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    if not query.strip():

        raise HTTPException(
            status_code=400,
            detail="Please enter a research topic"
        )

    api_url = "https://api.openalex.org/works"

    params = {
        "search": query.strip(),
        "per-page": 10,
        "select": (
            "id,title,authorships,"
            "abstract_inverted_index,"
            "publication_year,doi,"
            "primary_location"
        )
    }

    try:

        response = requests.get(
            api_url,
            params=params,
            timeout=20
        )

        response.raise_for_status()

        data = response.json()

    except requests.RequestException:

        raise HTTPException(
            status_code=503,
            detail="Unable to connect to OpenAlex API. Please try again later."
        )

    papers = []

    for paper in data.get("results", []):

        authors = []

        for authorship in paper.get("authorships", []):

            author = authorship.get("author", {})

            if author.get("display_name"):

                authors.append(
                    author["display_name"]
                )

        abstract = reconstruct_abstract(
            paper.get("abstract_inverted_index")
        )

        doi = paper.get("doi")

        primary_location = paper.get(
            "primary_location"
        ) or {}

        landing_page = primary_location.get(
            "landing_page_url"
        )

        paper_link = (
            doi
            or landing_page
            or paper.get("id")
        )

        papers.append({

            "openalex_id": paper.get("id"),

            "title": paper.get("title"),

            "authors": ", ".join(authors),

            "abstract": abstract,

            "publication_year": paper.get(
                "publication_year"
            ),

            "doi": doi,

            "paper_link": paper_link

        })

    return {

        "search_query": query,

        "source": "OpenAlex API",

        "total_papers": len(papers),

        "papers": papers

    }


# ==========================================
# COLLABORATOR RECOMMENDATIONS
# USING TF-IDF AND COSINE SIMILARITY
# ==========================================

@app.get("/recommendations/collaborators")
def recommend_collaborators(
    request: Request,
    db: Session = Depends(get_db)
):

    user_id = request.session.get("user_id")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:

        raise HTTPException(
            status_code=404,
            detail="Researcher not found"
        )

    if not user.research_interests:

        return {
            "researcher": user.name,
            "message": "No research interests available",
            "recommendations": []
        }

    other_users = db.query(models.User).filter(
        models.User.id != user_id
    ).all()

    valid_users = []

    documents = [user.research_interests]

    for other_user in other_users:

        if other_user.research_interests:

            valid_users.append(other_user)

            documents.append(
                other_user.research_interests
            )

    if not valid_users:

        return {
            "researcher": user.name,
            "recommendations": []
        }

    vectorizer = TfidfVectorizer()

    try:

        tfidf_matrix = vectorizer.fit_transform(
            documents
        )

    except ValueError:

        return {
            "researcher": user.name,
            "recommendations": []
        }

    similarity_scores = cosine_similarity(
        tfidf_matrix[0:1],
        tfidf_matrix[1:]
    )[0]

    recommendations = []

    for index, score in enumerate(similarity_scores):

        if score > 0:

            other_user = valid_users[index]

            percentage = round(
                float(score) * 100,
                2
            )

            recommendations.append({

                "researcher_id": other_user.id,

                "name": other_user.name,

                "email": other_user.email,

                "research_interests": other_user.research_interests,

                "similarity_score": round(
                    float(score),
                    4
                ),

                "similarity_percentage": percentage

            })

    recommendations.sort(
        key=lambda x: x["similarity_percentage"],
        reverse=True
    )

    top_recommendations = recommendations[:4]

    return {

        "researcher": user.name,

        "method": "TF-IDF and Cosine Similarity",

        "total_recommendations": len(
            top_recommendations
        ),

        "recommendations": top_recommendations

    }


# ==========================================
# FREE LOCAL SUMMARIZATION
# FOR PAPERS STORED IN POSTGRESQL
# ==========================================

@app.get("/papers/{paper_id}/summary")
def get_paper_summary(
    paper_id: int,
    request: Request,
    db: Session = Depends(get_db)
):

    user_id = request.session.get("user_id")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    paper = db.query(models.Paper).filter(
        models.Paper.id == paper_id
    ).first()

    if not paper:

        raise HTTPException(
            status_code=404,
            detail="Research paper not found"
        )

    if not paper.abstract:

        raise HTTPException(
            status_code=400,
            detail="No abstract available for summarization"
        )

    try:

        summary = summarize_text(
            paper.abstract,
            sentence_count=5
        )

        return {

            "paper_id": paper.id,

            "title": paper.title,

            "original_abstract": paper.abstract,

            "summary": summary

        }

    except Exception as e:

        print("Summarization Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to generate research paper summary"
        )


# ==========================================
# FREE LOCAL SUMMARIZATION
# FOR PAPERS SELECTED FROM DASHBOARD
# ==========================================

@app.post("/summarize-paper")
async def summarize_research_paper(request: Request):

    user_id = request.session.get("user_id")

    if not user_id:

        raise HTTPException(
            status_code=401,
            detail="Please login first"
        )

    try:

        data = await request.json()

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid request data"
        )

    if not isinstance(data, dict):

        raise HTTPException(
            status_code=400,
            detail="Invalid request data"
        )

    title = data.get("title", "")
    abstract = data.get("abstract", "")

    if not isinstance(title, str) or not isinstance(abstract, str):

        raise HTTPException(
            status_code=400,
            detail="Invalid paper details"
        )

    title = title.strip()
    abstract = abstract.strip()

    if not abstract:

        raise HTTPException(
            status_code=400,
            detail="Research paper abstract is required."
        )

    if len(abstract) > 40000:

        raise HTTPException(
            status_code=400,
            detail="Abstract is too long."
        )

    if not title:

        title = "Untitled Research Paper"

    try:

        summary = summarize_text(
            abstract,
            sentence_count=5
        )

        return {

            "title": title,

            "summary": summary

        }

    except Exception as e:

        print("Summarization Error:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to generate research paper summary."
        )