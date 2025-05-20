const router = require("express").Router();
const {
  getTasksById,
  getAllTasks,
  createTask,
  updateTask,
  removeTask,
  getTasksAndEmployee,
  getTasksAndEmployeeById
} = require("../../controllers/task.controller");

const { checktaskId, checkdataTask } = require("../../middleware/tasks.middleware");

router.get("/", getAllTasks);
router.get("/task", getTasksAndEmployee);
router.get("/task/:taskId", getTasksAndEmployee);
router.get("/employee/:employeeId", getTasksAndEmployeeById);
router.get("/:taskId",checktaskId,getTasksById);
router.post("/",checkdataTask, createTask);
router.put("/:taskId", checktaskId,checkdataTask,updateTask);
router.delete("/:taskId",checktaskId, removeTask);
module.exports = router;
