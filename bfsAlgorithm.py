from collections import deque

def bfs(labirinto, inicio, fim):
    fila = deque([(inicio, [inicio])])
    visitados = set([inicio])

    while fila:
        (x, y), caminho = fila.popleft()

        if (x, y) == fim:
            return caminho

        vizinhos = [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]

        for nx, ny in vizinhos:
            if 0 <= nx < len(labirinto) and 0 <= ny < len(labirinto[0]) and labirinto[nx][ny] != '#' and (nx, ny) not in visitados:
                fila.append(((nx, ny), caminho + [(nx, ny)]))
                visitados.add((nx, ny))

    return None

if __name__ == "__main__":
    labirinto = [
        ['E', '.', '.', '#', '.'],
        ['.', '#', '.', '.', '.'],
        ['.', '#', '#', '.', 'S'],
        ['.', '.', '.', '#', '.'],
        ['#', '.', '.', '.', '.']
    ]

    inicio = (0, 0)
    fim = (2, 4)

    caminho = bfs(labirinto, inicio, fim)

    if caminho:
        print("Caminho encontrado:", caminho)
    else:
        print("Caminho nao encontrado")