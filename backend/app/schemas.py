from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
    role: Optional[str] = "farmer"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str]
    role: str
    is_active: bool

    class Config:
        orm_mode = True


class ProduceBatchCreate(BaseModel):
    crop_name: str
    harvest_date: date
    temperature_c: float
    humidity_percent: float
    sunlight_hours: float
    storage_method: str
    photo_url: Optional[str] = None
    video_url: Optional[str] = None


class ProduceBatchOut(BaseModel):
    id: int
    crop_name: str
    harvest_date: date
    temperature_c: float
    humidity_percent: float
    sunlight_hours: float
    storage_method: str
    photo_url: Optional[str]
    video_url: Optional[str]
    grade: str
    freshness_score: float
    spoilage_risk: float
    estimated_shelf_life_days: int
    advice: Optional[str]
    defect_flags: Optional[str]
    crop_confidence: float
    farmer_id: int

    class Config:
        orm_mode = True


class ListingCreate(BaseModel):
    crop_name: str
    price_per_kg: float
    quantity_kg: float
    location: str
    batch_id: int


class ListingOut(BaseModel):
    id: int
    crop_name: str
    price_per_kg: float
    quantity_kg: float
    location: str
    status: str
    batch_id: int
    seller_id: int

    class Config:
        orm_mode = True


class OrderCreate(BaseModel):
    listing_id: int
    quantity_kg: float
