from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.auth.router import router as auth_router
from backend.startup import on_startup

_ = load_dotenv()

app = FastAPI()

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

on_startup()


@app.get("/health")
def health_check():
    return {"message": "OK"}
