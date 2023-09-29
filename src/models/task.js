const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;
const { model } = mongoose;

// Create a new schema
const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },

  {
    timestamps: true,
  }
);

// Creating a collection
const Task = model('Task', taskSchema);

module.exports = Task;
