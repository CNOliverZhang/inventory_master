module.exports = ({ list, childrenAttrName, parentAttrName }) => {
  const map = list.reduce((acc, element, index) => {
    acc[element.id] = index;
    return acc;
  }, {});
  const tree = [];
  list.forEach((node) => {
    if (node[parentAttrName]) {
      const parent = list[map[node[parentAttrName]]];
      parent[childrenAttrName] = [...(parent[childrenAttrName] || []), node];
    } else {
      tree.push(node);
    }
  });
  return tree;
};
