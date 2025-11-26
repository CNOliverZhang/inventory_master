const findNode = (nodes, value, attribute = 'id') => {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i][attribute] === value) {
      return nodes[i];
    }
    if (nodes[i].children) {
      const node = findNode(nodes[i].children, value);
      if (node) {
        return node;
      }
    }
  }
};

module.exports = findNode;
