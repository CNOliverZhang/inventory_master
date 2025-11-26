const getDescendantList = async ({ model, id, childrenAttrName }) => {
  const current = await model.findOne({
    where: { id },
    include: [{ all: true }],
  });
  if (!current) {
    return [];
  }
  const children = current.toJSON()[childrenAttrName];
  let list = [current.id];
  for (const child of children) {
    list = list.concat(await getDescendantList({ model, id: child.id, childrenAttrName }));
  }
  return list;
};

module.exports = getDescendantList;
