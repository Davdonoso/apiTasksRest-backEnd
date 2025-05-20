const Task = require("../models/tasks.model");
const Employee = require("../models/employees.model");


const getTasksById = async (req, res) => {
  const { taskId } = req.params;
  const tasks = await Task.selectByTaskId(taskId);
  res.json(tasks);
};

const getAllTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const tasks = await Task.selectAllTasks(Number(page), Number(limit));
  res.json({
    page: Number(page),
    limit: Number(limit),
    total: tasks.length,
    data: tasks,
  });
};

const getTasksAndEmployee = async (req, res) => {
  const tasks = await Task.selectAllTasks(1, 500);

  for (let task of tasks) {
    const employee = await Employee.selectById(task.employee_id);
    if (employee) {
      task.employee = {
        name: employee.name,
        email: employee.email,
        username: employee.username,
        password: employee.password,
        position: employee.position,
      };
    } else {
      task.employee = null;
    }
  }

  res.json(task);
};

const getTasksAndEmployeeById = async (req, res) => {
  const { employeeId } = req.params;
  const tasks = await Task.selectByEmployeeId(employeeId);
  const employee = await Employee.selectById(employeeId);

  if (!tasks) {
    return res.status(404).send("No se encontraron las tareas para este empleado");
  }

  for (let task of tasks) {
    task.employee = {
        name: employee.name,
        email: employee.email,
        username: employee.username,
        password: employee.password,
        position: employee.position,
    };
  }

  res.json(tasks);
}
const createTask = async (req, res) => {
  const { title,description,status,due_date,employee_id } = req.body;
  const result= await Task.insert(title,description,status,due_date,employee_id);
  const task = await Task.selectByTaskId(result.insertId);

  res.json(task);
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const result = await Task.update(taskId, req.body);
  const { title, description, status, due_date, employee_id } = req.body;
  const task = await Task.selectByTaskId(taskId);

    res.json(task);
};

const removeTask = async (req, res) => {
  const { taskId } = req.params;
  const result = await Task.remove(taskId);
  const tasks = await Post.selectAllTasks(1, 1000);

  res.json({ message: "Tarea eliminada ", data: tasks });
};

module.exports = {
  getTasksById,
  getAllTasks,
  createTask,
  updateTask,
  removeTask,
  getTasksAndEmployee,
  getTasksAndEmployeeById
};
