
const getIdMap = (arr) => {
  let idMap = {};
  if (!arr || !arr.length) {
    return idMap;
  }
  arr.forEach(item => {
    let id = item.id;
    if (!idMap[id]) {
      idMap[id] = item;
    }
  });
  return idMap;
}


const getTotalName = (id, idMap) => {
  let item = idMap[id]; 
  let parentId = item.parentId;
  if (parentId == '0') {
    return item.name
  } else {
    let parent = idMap[parentId];
    if (parent.parentId == '0') {
      return `${parent.name}-${item.name}`;
    } else {
      let grandParentId = idMap[parentId]['parentId'];
      let grandParent = idMap[grandParentId];
      return `${grandParent.name}-${parent.name}-${item.name}`;
    }
  }
}

const getSelectArrTotalName = (selecdArr,idMap) => {
  if (!selecdArr || !selecdArr.length) {
    return;
  }
  let result = selecdArr.map(id => {
    let totalName = getTotalName(id, idMap);
    return {
      id, totalName
    }
  });
  return result;
}

export {
  getSelectArrTotalName,
  getIdMap
}