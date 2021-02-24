const db = require("../models");
const Todo = db.todos;

// Create and Save a new Todo
exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const todo = new Todo({
    title: req.body.title,
    isDone: false,
  });

  todo
    .save(todo)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Todo.",
      });
    });
};

// Retrieve all Todos from the database.
exports.findAll = (req, res) => {
  Todo.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Todos.",
      });
    });
};

// Find a single Todo with an id
exports.findById = (req, res) => {
  const id = req.params.id;

  Todo.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Todo with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Todo with id=" + id });
    });
};

// Update a Todo by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Todo.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Todo with id=${id}. Maybe Todo was not found!`,
        });
      } else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Todo with id=" + id,
      });
    });
};

// Delete a Todo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Todo with id=${id}. Maybe Todo was not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Todo with id=" + id,
      });
    });
};

// Delete completed Todos from the database.
exports.deleteCompleted = (req, res) => {
  Todo.deleteMany({ isDone: true })
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Todos were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing completed Todos.",
      });
    });
};

exports.toggleAll = (req, res) => {
  const toggle = req.body.toggle;

  Todo.updateMany({ isDone: toggle })
    .then((data) => {
      res.send({
        message: `${data.nModified} Todos were updated successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating Todos.",
      });
    });
};
