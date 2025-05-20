const Task = require("../models/tasks.model");
const Employee = require("../models/employees.model");
const { generateTasksPDF } = require('../helper/pdf.helper');
const { sendTasksEmail } = require('../helper/email.helper');
const path = require('path');
const fs = require('node:fs');

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

// tareas para el pdf
const getAllTasksRaw = async () => {
  return await Task.selectAllTasksRaw();
};

const exportTasksPDF = async (req, res) => {
  console.log('Entrando a exportTasksPDF');
  try {
    const tasks = await Task.selectAllTasksRaw();
    const pdfDir = path.join(__dirname, 'pdfs');
    const filePath = path.join(pdfDir, 'tasks.pdf');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }
    // Generar el PDF
    console.log('Generando PDF en:', filePath);
    await generateTasksPDF(tasks, filePath);
    console.log('PDF generado');
    res.download(filePath, 'tasks.pdf', (err) => {
      if (err) {
        console.error('Error al enviar el PDF:', err);
      }
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error al borrar el PDF:', err);
      });
    });
  } catch (err) {
    console.error('Error al generar el PDF:', err);
    res.status(500).json({ error: 'Error al generar el PDF', details: err.message });
  }
};

const sendTaskPDF = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  try {
    const tasks = await Task.getAllTasksRaw();
    const filePath = path.join(__dirname, 'tasks.pdf');
    await generateTasksPDF(tasks, filePath);
    await sendTasksEmail(email, 'Lista de Tareas', 'Adjunto encontrarás el PDF con las tareas.', filePath);
    fs.unlinkSync(filePath);
    res.json({ message: 'Email enviado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al enviar el email' });
  }
};



module.exports = {
  getTasksById,
  getAllTasks,
  createTask,
  updateTask,
  removeTask,
  getTasksAndEmployee,
  getTasksAndEmployeeById,
  getAllTasksRaw,exportTasksPDF,sendTaskPDF
};
