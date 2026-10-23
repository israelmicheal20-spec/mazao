from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.crud import create_produce_batch, get_user_batches
from app.dependencies import get_current_user, get_db
from app.models import User
from app.services.quality_service import calculate_quality

router = APIRouter(prefix="/produce", tags=["produce"])


@router.post("/quality-check")
async def quality_check(
    crop_name: str = Form(...),
    harvest_date: str = Form(...),
    temperature_c: float = Form(...),
    humidity_percent: float = Form(...),
    sunlight_hours: float = Form(...),
    storage_method: str = Form(...),
    file: UploadFile = File(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        image_bytes = await file.read() if file else None
        result = calculate_quality(
            crop_name=crop_name,
            harvest_date=harvest_date,
            temperature_c=temperature_c,
            humidity_percent=humidity_percent,
            sunlight_hours=sunlight_hours,
            storage_method=storage_method,
            image_present=file is not None,
            image_bytes=image_bytes,
        )

        batch = create_produce_batch(
            db=db,
            user_id=current_user.id,
            batch_data={
                "crop_name": result["crop_name"],
                "harvest_date": __import__("datetime").date.fromisoformat(harvest_date),
                "temperature_c": temperature_c,
                "humidity_percent": humidity_percent,
                "sunlight_hours": sunlight_hours,
                "storage_method": storage_method,
                "photo_url": file.filename if file else None,
                "video_url": None,
                "grade": result["grade"],
                "freshness_score": result["freshness_score"],
                "spoilage_risk": result["spoilage_risk"],
                "estimated_shelf_life_days": result["estimated_shelf_life_days"],
                "advice": "; ".join(result["advice"]),
                "defect_flags": result.get("defect_flags"),
                "crop_confidence": result.get("crop_confidence", 0.0),
            }
        )

        return {
            "success": True,
            "data": {"batch_id": batch.id, **result},
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/my-batches")
def my_batches(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_user_batches(db, current_user.id)
