let tab = [];
let x = [];
function marquer(
  options,
  idValue,
  arrows,
  setPositionChildren,
  setArrows,
  positionChildren
) {
  const start = options?.start;
  const end = options?.end;
  if (
    arrows.filter((elem) => elem.start == start) != 0 &&
    arrows.filter((elem) => elem.end == end) != 0
  ) {
    if (!positionChildren.find((val) => val.id === start)?.mark) {
      setPositionChildren(
        positionChildren.map((child) =>
          child.id === start ? { ...child, mark: true } : child
        )
      );
      x.push({ x: start, value: 0 });
      tab.push(start);
    } else {
      const notMark = arrows.filter(
        (arrow) =>
          positionChildren.find((val) => val.id === arrow.start)?.mark &&
          !positionChildren.find((val) => val.id === arrow.end)?.mark
      );

      if (notMark.length > 1) {
        const uniqueData = Object.values(
          notMark.reduce((acc, obj) => {
            const key = `${obj.start}`; // Clé unique basée sur start-end

            if (
              !acc[key] ||
              Number(x.find((val) => val.x === obj.start).value + obj.value) <
                Number(
                  x.find((val) => val.x === obj.start).value + acc[key]?.value
                )
            ) {
              acc[key] = obj;
            }

            return acc;
          }, {})
        );

        if (uniqueData.length > 1) {
          const minElem = notMark.reduce((min, current) =>
            parseInt(x.find((val) => val.x === current.start).value) +
              parseInt(current.value) <
            parseInt(x.find((val) => val.x === min.start).value) +
              parseInt(min.value)
              ? current
              : min
          );

          setPositionChildren(
            positionChildren.map((child) =>
              child.id === minElem?.end ? { ...child, mark: true } : child
            )
          );
          x.push({
            parent: minElem?.start,
            x: minElem?.end,
            value:
              x.find((val) => val.x === minElem.start).value +
              parseInt(minElem?.value),
          });
          tab.push(minElem?.end);
        } else {
          const minElem = notMark.reduce((min, current) =>
            parseInt(x.find((val) => val.x === current.start).value) +
              parseInt(current.value) <
            parseInt(x.find((val) => val.x === min.start).value) +
              parseInt(min.value)
              ? current
              : min
          );
          x.push({
            parent: minElem?.start,
            x: minElem?.end,
            value:
              x.find((val) => val.x === minElem.start).value +
              parseInt(minElem?.value),
          });
          tab.push(minElem?.end);

          setPositionChildren(
            positionChildren.map((child) =>
              child.id === minElem?.end ? { ...child, mark: true } : child
            )
          );
        }
      } else {
        x.push({
          parent: notMark[0]?.start,
          x: notMark[0]?.end,
          value:
            x.find((val) => val.x === notMark[0].start).value +
            parseInt(notMark[0]?.value),
        });
        tab.push(notMark[0]?.end);

        setPositionChildren(
          positionChildren.map((child) =>
            child.id === notMark[0]?.end ? { ...child, mark: true } : child
          )
        );
      }
    }
  } else {
    console.log("algo: à verifier");
    alert("Chemin inexistante");
  }

  return x;
}

function makeMinPath(options, arrows, positionChildren) {
  const start = options?.start;
  const end = options?.end;

  x.push({ x: start, value: 0 });
  tab.push(start);

  const visited = new Set();
  visited.add(start);

  while (true) {
    // Get all children of nodes in 'tab' (frontier)
    const frontier = positionChildren.filter((item) => visited.has(item.start));

    if (frontier.length === 0) break;

    // Get the edge with minimal total cost from visited to unvisited
    let minEdge = null;
    let minCost = Infinity;

    for (const edge of frontier) {
      if (visited.has(edge.end)) continue; // Skip already visited

      const parentValue = x.find((n) => n.x === edge.start)?.value ?? Infinity;
      const totalCost = parentValue + parseInt(edge.value);

      if (totalCost < minCost) {
        minCost = totalCost;
        minEdge = edge;
      }
    }

    if (!minEdge) break; // No more reachable nodes

    x.push({
      parent: minEdge.start,
      x: minEdge.end,
      value: minCost,
    });

    visited.add(minEdge.end);
    tab.push(minEdge.end);

    if (minEdge.end === end) break; // Reached destination
  }

  return x;
}

function calculMinPathValue(setTotalValue, path, arrows) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = arrows.find(
      (arrow) => arrow.start === path[i] && arrow.end === path[i + 1]
    );

    total += parseFloat(segment?.value || 0);
  }
  setTotalValue(total);
}

function makeShortPath(
  end,
  start,
  setPositionChildren,
  positionChildren,
  setTotalValue,
  arrows
) {
  if (!positionChildren) return;
  let finalPath = x?.find((val) => val?.x === end);
  let shortPath = [finalPath];
  if (
    arrows.filter((elem) => elem.start == start) != 0 &&
    arrows.filter((elem) => elem.end == end) != 0
  ) {
    while (finalPath?.parent) {
      let inter = x.find((val) => val.x === finalPath.parent);
      shortPath.unshift(inter);
      finalPath = inter;
    }

    // Récupère tous les ids de la shortPath
    const shortPathIds = shortPath.map((node) => node.x);
    // Met à jour tous les éléments en une seule fois
    const updatedChildren = positionChildren.map((val) =>
      shortPathIds.includes(val.id) ? { ...val, short: true } : val
    );

    setPositionChildren(updatedChildren);
    calculMinPathValue(setTotalValue, shortPathIds, arrows);
  } else {
    console.log("algo: à verifier");
    alert("Chemin inexistante");
  }
  return shortPath;
}

export { marquer, makeShortPath, makeMinPath };
