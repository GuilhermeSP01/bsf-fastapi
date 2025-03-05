from fastapi import FastAPI

from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.responses import FileResponse

from bfsAlgorithm import bfs

app = FastAPI()

@app.get("/")
def root():
    return FileResponse("static/index.html")

@app.post("/solve")
async def solve(request: Request):
    data = await request.json()

    tabela = data.get("tabela")
    entrada = tuple(data.get("entrada"))
    saida = tuple(data.get("saida"))

    caminho = bfs(tabela, entrada, saida)

    if caminho: return JSONResponse(content={"caminho": caminho}, status_code=200)
    else: return JSONResponse(content={"error": "Caminho não encontrado"}, status_code=500)