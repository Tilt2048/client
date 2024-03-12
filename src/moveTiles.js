function createNewData(row) {
  return new Array(row).fill(null).map(() => new Array());
}

export function moveTiles(
  board,
  direction,
  size,
  setBoard,
  setDirection,
  createNew2Tile,
) {
  let tiles = JSON.parse(JSON.stringify(board));

  switch (direction) {
    case "left": {
      const newData = createNewData(size);

      board.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(cellData);
            }
          }
        });
      });

      [...board].forEach((rowData, i) => {
        [...board].forEach((cellData, j) => {
          tiles[i][j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }

    case "right": {
      const newData = createNewData(size);

      board.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (rowData[board.length - 1 - j]) {
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === rowData[board.length - 1 - j]) {
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(rowData[board.length - 1 - j]);
            }
          }
        });
      });

      [...board].forEach((rowData, i) => {
        [...board].forEach((cellData, j) => {
          tiles[i][board.length - 1 - j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }

    case "up": {
      const newData = createNewData(size);

      board.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[j];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(cellData);
            }
          }
        });
      });

      [...board].forEach((cellData, i) => {
        [...board].forEach((rowData, j) => {
          tiles[j][i] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }

    case "down": {
      const newData = createNewData(size);

      board.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (board[board.length - 1 - i][j]) {
            const currentRow = newData[j];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === board[board.length - 1 - i][j]) {
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(board[board.length - 1 - i][j]);
            }
          }
        });
      });

      [...board].forEach((cellData, i) => {
        [...board].forEach((rowData, j) => {
          tiles[board.length - 1 - j][i] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
  }
  setBoard(tiles);
  if (createNew2Tile) {
    createNew2Tile(tiles);
  }
  setDirection("");
}
