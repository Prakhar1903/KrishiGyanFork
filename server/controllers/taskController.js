// controllers/taskController.js
import Task from "../models/Task.js";

export const addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      priority,
      status,
      farmId,
    } = req.body;

    if (!title || !category || !date) {
      return res.status(400).json({
        message: "Title, category and date are required",
      });
    }

    const task = await Task.create({
      userId: req.user.userId,
      farmId: farmId || null,
      title,
      description,
      category,
      date: new Date(date), // ✅ IMPORTANT FIX
      time,
      priority,
      status,
    });

    res.status(201).json({ message: "Task added", task });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({
      message: "Error adding task",
      error: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).sort({ date: 1, createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
