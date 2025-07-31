from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount the 'static' directory to serve CSS, JS, images etc.
# The path to the static directory is now relative to BASE_DIR
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# Configure Jinja2 templates
# The path to the templates directory is also relative to BASE_DIR
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    # Pass the request object to the template, which is good practice
    # and required for things like url_for in Jinja2.
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    import uvicorn
    # For development with auto-reload, use the "uvicorn main:app --reload" command in your terminal.
    # Add --host 0.0.0.0 if you want to access it from other devices on your network.
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
