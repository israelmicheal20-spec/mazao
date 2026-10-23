from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import create_listing, create_order, get_marketplace_listings
from app.dependencies import get_current_user, get_db
from app.models import User
from app.schemas import ListingCreate, ListingOut, OrderCreate

router = APIRouter(prefix="/marketplace", tags=["marketplace"])


@router.get("/", response_model=list[ListingOut])
def list_marketplace(db: Session = Depends(get_db)):
    return get_marketplace_listings(db)


@router.post("/list", response_model=ListingOut)
def create_new_listing(payload: ListingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return create_listing(db, current_user.id, {
        "crop_name": payload.crop_name,
        "price_per_kg": payload.price_per_kg,
        "quantity_kg": payload.quantity_kg,
        "location": payload.location,
        "batch_id": payload.batch_id,
    })


@router.post("/orders")
def create_purchase_order(payload: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    listing = db.query(__import__("app.models", fromlist=["Listing"]).Listing).filter(__import__("app.models", fromlist=["Listing"]).Listing.id == payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    order = create_order(
        db,
        buyer_id=current_user.id,
        seller_id=listing.seller_id,
        listing_id=payload.listing_id,
        quantity_kg=payload.quantity_kg,
    )
    return {"success": True, "data": order}
