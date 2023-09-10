
const node = (vertices) => {
  children = [];
  return {
    vertices,
    children
  }
};
const board = (size = 4) => {
  const boardArr = [];
  for (let i = 0; i < size; i++) {
    boardArr[i] = [];
    for (let j = 0; j < size; j++) {
      boardArr[i].push(0);
    }
  }
  return boardArr;
};
const checkPaths = (start, board) => {
  const paths = [];
  const rowMax = board.length;
  const colMax = board[0].length;

  //up
  if (start[0] - 2 >= 0) {
    // up left
    if (start[1] - 1 >= 0) {
      if (board[start[0] - 2][start[1] - 1] != 1) {
        paths.push([start[0] - 2, start[1] - 1]);
      }
    }

    // up right
    if (start[1] + 1 < colMax) {
      if (board[start[0] - 2][start[1] + 1] != 1) {
        paths.push([start[0] - 2, start[1] + 1]);
      }
    }
    /*if (board[start[0] - 1][start[1]] != 1) {
      paths.push([start[0] - 1, start[1]]);
    }*/
  }

  //right
  if (start[1] + 2 < colMax) {
    // right up
    if (start[0] - 1 >= 0) {
      if (board[start[0] - 1][start[1] + 2] != 1) {
        paths.push([start[0] - 1, start[1] + 2]);
      }
    }

    // right down
    if (start[0] + 1 < rowMax) {
      if (board[start[0] + 1][start[1] + 2] != 1) {
        paths.push([start[0] + 1, start[1] + 2]);
      }
    }
  }

  //down
  if (start[0] + 2 < rowMax) {
    // down left
    if (start[1] - 1 >= 0) {
      if (board[start[0] + 2][start[1] - 1] != 1) {
        paths.push([start[0] + 2, start[1] - 1]);
      }
    }

    // down right
    if (start[1] + 1 < colMax) {
      if (board[start[0] + 2][start[1] + 1] != 1) {
        paths.push([start[0] + 2, start[1] + 1]);
      }
    }
  }

  //left
  if (start[1] - 2 >= 0) {
    // left up
    if (start[0] - 1 >= 0) {
      if (board[start[0] - 1][start[1] - 2] != 1) {
        paths.push([start[0] - 1, start[1] - 2]);
      }
    }

    // left down
    if (start[0] + 1 < rowMax) {
      if (board[start[0] + 1][start[1] - 2] != 1) {
        paths.push([start[0] + 1, start[1] - 2]);
      }
    }
  }

  return paths;
};
const knightMoves = (start, end) => {
  const gboard = board(8);
  const startNode = node(start);
  let shortestPath = [];
  let otherShortPath = [];
  const currentPath = [];
  let numberOfTraversals = 0;

  // 1 in board is traversed
  //console.log(gboard);

  let queue1 = [];
  let queue2 = [];
  let Q1 = true;
  let level = 0; // final number is earliest occurence
  let numBFS = 0;
  queue1.push(startNode);

  // bfs function to find earliest occurence of end vertices
  // then use in below recursion to traverse the tree
  (function bfs() {
    while (queue1.length > 0 || queue2.length > 0) {  
      let currentQueue;
      let toAddQueue;
      if (Q1) {
        currentQueue = queue1;
        toAddQueue = queue2;
      }
      else {
        currentQueue = queue2;
        toAddQueue = queue1;
      }

      while (currentQueue.length > 0) {
        ++numBFS;
        let tmp = currentQueue.shift();
        if (tmp.vertices[0] === end[0] &&
          tmp.vertices[1] === end[1]) {
          return;
        }

        Array.from(checkPaths(tmp.vertices, gboard))
          .forEach((v) => {
            toAddQueue.push(node(v));
          });
      }
      Q1 ? Q1 = false : Q1 = true;
      ++level;
    }
  })();
  console.log(level);
  console.log(numBFS);

  // path traversal
  const searchPath = (function re(startN, end) {
    ++numberOfTraversals;
    gboard[startN.vertices[0]][startN.vertices[1]] = 1;
    currentPath.push([startN.vertices[0], startN.vertices[1]]);

    if (shortestPath.length > 0) return; // bfs check
    //if (shortestPath.length > 0) { // recursive check
    // COLLECTING paths
    // make it >= to return early
    // or > to still traverse even if path is same length
    //if (currentPath.length >= shortestPath.length) return; // recursive check

    //} //recursive check

    //check if start and end vertices match
    if (startN.vertices[0] === end[0] &&
      startN.vertices[1] === end[1]) {
      if (shortestPath.length > 0) {
        if (currentPath.length < shortestPath.length) {
          shortestPath = Array.from(currentPath);

          //reset otherShortPath if this found shorter paths
          otherShortPath.splice(0);
        }
        // uncomment below for collecting other paths
        // refer to COLLECTING paths above
        else if (currentPath.length === shortestPath.length) {
          otherShortPath.push(Array.from(currentPath));
        }
      }
      else shortestPath = Array.from(currentPath);
      return;
    }

    // run only base on level from early bfs function...
    if (currentPath.length >= level + 1) return; //bfs check

    //check paths then add to children property of current node
    startN.children = Array.from(checkPaths(startN.vertices, gboard))
      .map((v) => node(v));

    //recursively traverse each path
    while (startN.children.length > 0) {
      let tmp = startN.children.pop();
      re(tmp, end);
      currentPath.pop();
      gboard[tmp.vertices[0]][tmp.vertices[1]] = 0;
    }
  })(startNode, end);

  // Print with reverse rows...
  let strBoard = '';
  for (let i = 7; i >= 0; i--) {
    strBoard += `${i} O O O O O O O O` + '\n';
    if (i === 0) strBoard += '  0 1 2 3 4 5 6 7' + '\n';
  }
  console.log(strBoard);
  console.log(numberOfTraversals);
  console.log(`You made it in ${shortestPath.length - 1} moves!`);
  let str = shortestPath.reduce((acc, curr) => {
    return `${acc} => [${Math.abs(curr[0] - 7)},${curr[1]}]`;
  }, '');
  console.log(str);

  //console.log('Alternative paths below:');
  otherShortPath.forEach((path) => {
    let tmp = path.reduce((acc, curr) => {
      return `${acc} => [${Math.abs(curr[0] - 7)},${curr[1]}]`;
    }, '');
    console.log(tmp);
  });
};









function tester() {
  (function reverseRow(start, end) {
    // from reversed row input to normal array row
    start[0] = Math.abs(start[0] - 7);
    end[0] = Math.abs(end[0] - 7);
    knightMoves(start, end);
  })([0, 0], [7, 7]);
}
tester();

//export {
//  knightMoves
//};