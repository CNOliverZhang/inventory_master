const buildTree = require('../../utils/data_structure/build_tree');
const findNode = require('../../utils/data_structure/find_node');
const getPagination = require('../../utils/db_query/get_pagination');

module.exports = {
  list: async (ctx) => {
    const { Blog_category } = ctx.db;
    try {
      const data = await Blog_category.findAndCountAll({
        ...getPagination(ctx),
        order: [['name', 'ASC']],
      });
      ctx.body = { count: data.count, list: data.rows };
    } catch (err) {
      ctx.throw(400, `Get category list error: ${err.message}.`);
    }
  },
  getTree: async (ctx) => {
    const { Blog_category } = ctx.db;
    try {
      const data = (await Blog_category.findAll()).map((item) => item.toJSON());
      const tree = buildTree({
        list: data,
        childrenAttrName: 'children',
        parentAttrName: 'parentId',
      });
      ctx.body = tree;
    } catch (err) {
      ctx.throw(400, `Get category tree error: ${err.message}.`);
    }
  },
  add: async (ctx) => {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      parentId: { type: 'number', required: false },
    });
    const { Blog_category } = ctx.db;
    const { name, parentId } = ctx.params;
    try {
      const homonymicCategory = await Blog_category.findOne({
        where: { name },
      });
      if (homonymicCategory) {
        throw new Error('category name collision');
      }
      if (parentId) {
        const parentCategory = await Blog_category.findOne({
          where: { id: parentId },
        });
        if (!parentCategory) {
          throw new Error('parent category not exists');
        }
      }
      const category = await Blog_category.create({ name, parentId: parentId || null });
      ctx.body = { success: true, category };
    } catch (err) {
      ctx.throw(400, `Add blog category error: ${err.message}.`);
    }
  },
  update: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
      name: { type: 'string', required: true },
      parentId: { type: 'number', required: false },
    });
    const { Blog_category } = ctx.db;
    const { id, name, parentId } = ctx.params;
    try {
      const category = await Blog_category.findOne({
        where: { id },
      });
      if (!category) {
        throw new Error('category not exists');
      }
      if (name) {
        const homonymicCategory = await Blog_category.findOne({
          where: { name },
        });
        if (homonymicCategory && homonymicCategory.id !== id) {
          throw new Error('category name collision');
        }
      }
      if (parentId) {
        if (parentId === id) {
          throw new Error('category can not be its own parent');
        }
        const categories = (await Blog_category.findAll()).map((item) => item.toJSON());
        const categoryTree = buildTree({
          list: categories,
          childrenAttrName: 'children',
          parentAttrName: 'parentId',
        });
        const currentNode = findNode(categoryTree, id);
        if (currentNode.children && findNode(currentNode.children, parentId)) {
          throw new Error('category can not be its own descendant');
        }
        const parentCategory = await Blog_category.findOne({
          where: { id: parentId },
        });
        if (!parentCategory) {
          throw new Error('parent category not exists');
        }
      }
      await category.update({
        name,
        parentId: parentId || null,
      });
      ctx.body = { success: true, category };
    } catch (err) {
      ctx.throw(400, `Update blog category error: ${err.message}.`);
    }
  },
  remove: async (ctx) => {
    ctx.verifyParams({
      id: { type: 'number', required: true },
    });
    const { Blog_category } = ctx.db;
    const { id } = ctx.params;
    try {
      const category = await Blog_category.findOne({
        where: { id },
      });
      if (!category) {
        throw new Error('category not exists');
      }
      await category.destroy();
      ctx.body = { success: true };
    } catch (err) {
      ctx.throw(400, `Remove blog category error: ${err.message}.`);
    }
  },
};
