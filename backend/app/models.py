from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="farmer", nullable=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    farms = relationship("Farm", back_populates="owner")
    produce_batches = relationship("ProduceBatch", back_populates="farmer")
    listings = relationship("Listing", back_populates="seller")
    buyer_orders = relationship("Order", foreign_keys="Order.buyer_id", back_populates="buyer")
    seller_orders = relationship("Order", foreign_keys="Order.seller_id", back_populates="seller")


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    region = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="farms")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ProduceBatch(Base):
    __tablename__ = "produce_batches"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(150), nullable=False)
    harvest_date = Column(Date, nullable=False)
    temperature_c = Column(Float, nullable=False)
    humidity_percent = Column(Float, nullable=False)
    sunlight_hours = Column(Float, nullable=False)
    storage_method = Column(String(150), nullable=False)
    photo_url = Column(String(255), nullable=True)
    video_url = Column(String(255), nullable=True)

    grade = Column(String(20), default="A")
    freshness_score = Column(Float, default=0.0)
    spoilage_risk = Column(Float, default=0.0)
    estimated_shelf_life_days = Column(Integer, default=0)
    advice = Column(Text, nullable=True)
    defect_flags = Column(Text, nullable=True)
    crop_confidence = Column(Float, default=0.0)

    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    farmer = relationship("User", back_populates="produce_batches")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(150), nullable=False)
    price_per_kg = Column(Float, nullable=False)
    quantity_kg = Column(Float, nullable=False)
    location = Column(String(150), nullable=False)
    status = Column(String(50), default="available")

    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller = relationship("User", back_populates="listings")

    batch_id = Column(Integer, ForeignKey("produce_batches.id"), nullable=False)
    batch = relationship("ProduceBatch")

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)

    quantity_kg = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="pending")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="buyer_orders")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="seller_orders")
