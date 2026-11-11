from pydantic import BaseModel, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    research_interests: str

# Researcher Response Schema
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    research_interests: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# Research Paper Creation Schema
class PaperCreate(BaseModel):
    title: str
    authors: Optional[str] = None
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    publication_year: Optional[int] = None


# Research Paper Response Schema
class PaperResponse(BaseModel):
    id: int
    title: str
    authors: Optional[str] = None
    abstract: Optional[str] = None
    keywords: Optional[str] = None
    publication_year: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: str
    password: str