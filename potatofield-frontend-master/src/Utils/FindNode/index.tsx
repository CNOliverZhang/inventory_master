const findNode = (nodes: any[], value: number, attribute = 'id'): any => {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i][attribute] === value) {
      return nodes[i];
    }
    if (nodes[i].children) {
      const node = findNode(nodes[i].children as any[], value);
      if (node) {
        return node;
      }
    }
  }
};

export default findNode;
