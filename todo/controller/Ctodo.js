const { Todo } = require("../models");

exports.ToDoList = async (req, res) => {
  try {
    const toDoList = await Todo.findAll({});
    if (!toDoList) {
      res.send({ data: null });
    } else {
      res.send({ toDoList });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.ToDoCreate = async (req, res) => {
  try {
    const { title, done } = req.body;

    const titleInfo = await Todo.findOne({
      where: { title: title },
    });
    if (!titleInfo) {
      const result = await Todo.create({
        title: title,
        done: done,
      });
      if (result) {
        res.send({ data: result });
      }
    } else {
      res.send({ data: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.ToDoUpdate = async (req, res) => {
  try {
    const { id, title, done } = req.body;
    const idInfo = await Todo.findOne({
      where: { id: id },
    });
    if (idInfo) {
      const result = await Todo.update(
        { title: title, done: done },
        { where: { id: id } }
      );
      if (result) {
        res.send({ result });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.ToDoDelete = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log("Delete 실행");

    const idInfo = await Todo.findOne({
      where: { id: id },
    });
    if (idInfo) {
      const result = await Todo.destroy({
        where: { id: id },
      });
      if (result) {
        res.send({ result: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
