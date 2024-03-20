const getUndefinedCells = (board) => {
  const undefinedCells = [];

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (!cell) {
        undefinedCells.push({ positionY: i, positionX: j });
      }
    });
  });

  return undefinedCells;
};

export const createRandomTile = (board) => {
  const undefinedCells = getUndefinedCells(board);
  const randomPosition = Math.floor(Math.random() * undefinedCells.length);
  const twoOrFour = Math.random() < 0.5 ? 4 : 2;
  const newTile = undefinedCells[randomPosition];

  board[newTile.positionY][newTile.positionX] = {
    ...newTile,
    value: twoOrFour,
    id: Date.now(),
  };

  return board;
};

export function createGameBoard(size) {
  return new Array(size).fill(null).map(() => new Array(size).fill(undefined));
}

const rotateMatrix = (board) => {
  return board[0].map((val, index) => board.map((row) => row[index]));
};

const arrangeBoard = (board) => {
  const newBoard = createGameBoard(4);

  board.forEach((row, rowIndex) =>
    row.forEach((cell, cellIndex) => {
      if (cell) {
        newBoard[cell.positionY][cell.positionX] = cell;
      }
    }),
  );

  return newBoard;
};

export const moveTiles = (board, direction, homeBoard) => {
  let hasChanged = false;
  let newScore = 0;
  const newBoard =
    direction === "left" || direction === "right"
      ? [...board]
      : rotateMatrix(board);
  const axis =
    direction === "left" || direction === "right" ? "positionX" : "positionY";

  newBoard.forEach((row, rowIndex) => {
    const filteredAndCombinedArr = combineAndFilterTiles(row, direction);
    const undefinedArr = new Array(4 - filteredAndCombinedArr.length).fill(
      undefined,
    );

    if (direction === "left" || direction === "up") {
      newBoard[rowIndex] = filteredAndCombinedArr.concat(undefinedArr);
    } else {
      newBoard[rowIndex] = undefinedArr.concat(filteredAndCombinedArr);
    }
    newBoard[rowIndex].forEach((cell, cellIndex) => {
      if (cell) {
        hasChanged = cell[axis] !== cellIndex ? true : hasChanged;
        cell[axis] = cellIndex;
      }
    });
  });

  const arrangedBoard = arrangeBoard(newBoard);
  // if (isOnCheckGameOverMode) return newScore;
  let boardWithNewTile;

  if (!homeBoard) {
    boardWithNewTile =
      hasChanged || newScore > 0
        ? createRandomTile(arrangedBoard)
        : arrangedBoard;
  } else {
    boardWithNewTile = arrangeBoard;
  }

  return { newBoard: boardWithNewTile, newScore };

  function combineAndFilterTiles(row, direction) {
    // 오른쪽 또는 아래로 이동하는 경우 배열을 역순으로 처리
    let reverseProcessing = direction === "right" || direction === "down";
    let filteredRow = row.filter((x) => x !== undefined);

    // 이동 방향에 따라 배열 순서를 조정
    if (reverseProcessing) {
      filteredRow.reverse();
    }

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i]?.value === filteredRow[i + 1]?.value) {
        newScore += filteredRow[i].value * 2;
        filteredRow[i] = {
          ...filteredRow[i],
          value: filteredRow[i].value * 2,
        };
        filteredRow[i + 1] = undefined;
        i++;
      }
    }

    filteredRow = filteredRow.filter((x) => x !== undefined);

    if (reverseProcessing) {
      filteredRow.reverse();
    }

    return filteredRow;
  }
};

// export const isGameOver = (board) => {
//   const undefinedCells = getUndefinedCells(board);
//   if (undefinedCells.length > 0) return false;

//   for (const direction in directions) {
//     const newScore = moveTiles(board, directions[direction], true);
//     if (newScore > 0) return false;
//   }
//   return true;
// };
