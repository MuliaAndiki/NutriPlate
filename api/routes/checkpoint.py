from app import app

@app.get("/")
async def checkPoint():
    return {"Hello World"}
