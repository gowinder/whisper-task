from fastapi import FastAPI, Depends
from pydantic import BaseModel


class SaveSettingDTO(BaseModel):
    values: str


app = FastAPI()


async def async_session():
    pass


@app.post("/settings")
async def save_setting(setting: SaveSettingDTO, session=Depends(async_session)):
    return {"status": "success"}
