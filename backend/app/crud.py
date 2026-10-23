from sqlalchemy.orm import Session

from app.auth import get_password_hash, verify_password
from app.models import User, ProduceBatch, Listing, Order


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_data: dict):
    user = User(
        full_name=user_data["full_name"],
        email=user_data["email"],
        phone=user_data.get("phone"),
        password_hash=get_password_hash(user_data["password"]),
        role=user_data.get("role", "farmer"),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user


def create_produce_batch(db: Session, user_id: int, batch_data: dict):
    batch = ProduceBatch(
        crop_name=batch_data["crop_name"],
        harvest_date=batch_data["harvest_date"],
        temperature_c=batch_data["temperature_c"],
        humidity_percent=batch_data["humidity_percent"],
        sunlight_hours=batch_data["sunlight_hours"],
        storage_method=batch_data["storage_method"],
        photo_url=batch_data.get("photo_url"),
        video_url=batch_data.get("video_url"),
        grade=batch_data["grade"],
        freshness_score=batch_data["freshness_score"],
        spoilage_risk=batch_data["spoilage_risk"],
        estimated_shelf_life_days=batch_data["estimated_shelf_life_days"],
        advice=batch_data.get("advice"),
        defect_flags=batch_data.get("defect_flags"),
        crop_confidence=batch_data.get("crop_confidence"),
        farmer_id=user_id,
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


def get_user_batches(db: Session, user_id: int):
    return db.query(ProduceBatch).filter(ProduceBatch.farmer_id == user_id).order_by(ProduceBatch.created_at.desc()).all()


def create_listing(db: Session, user_id: int, listing_data: dict):
    listing = Listing(
        crop_name=listing_data["crop_name"],
        price_per_kg=listing_data["price_per_kg"],
        quantity_kg=listing_data["quantity_kg"],
        location=listing_data["location"],
        seller_id=user_id,
        batch_id=listing_data["batch_id"],
        status="available",
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


def get_marketplace_listings(db: Session):
    return db.query(Listing).order_by(Listing.created_at.desc()).all()


def create_order(db: Session, buyer_id: int, seller_id: int, listing_id: int, quantity_kg: float):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        return None

    total_price = listing.price_per_kg * quantity_kg
    order = Order(
        buyer_id=buyer_id,
        seller_id=seller_id,
        listing_id=listing_id,
        quantity_kg=quantity_kg,
        total_price=total_price,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
