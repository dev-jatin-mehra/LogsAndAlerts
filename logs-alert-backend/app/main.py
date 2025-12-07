from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import upload_routes

app = FastAPI(
    title='Logs & Alerts Helper',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#Include Routes
app.include_router(upload_routes.router,prefix='/api')

@app.get("/")
def root():
    return {"message" : "Logs & Alerts Helper API is running"}