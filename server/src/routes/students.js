import { Router } from "express";

import { v4 as uuidv4 } from "uuid";

const router = Router();

const defaultStudentId = uuidv4();
let students = [
  {
    id: defaultStudentId,
    fullname: "John Smith",
    dateOfBirth: "1995-05-15",
    gender: "male",
    city: "New York",
    socialNetworkLinks: "https://linkedin.com/in/johnsmith",
  },
];

// Function to get students array - for use in other modules
const getStudents = () => students;

// CRUD for students
router.get("/", (req, res) => res.json(students));

router.get("/:id", (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

router.post("/", (req, res) => {
  const { fullname, city } = req.body;
  const newStudent = {
    id: uuidv4(),
    fullname,
    city,
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

router.put("/:id", (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  student.fullname = req.body.fullname || student.fullname;
  student.city = req.body.city || student.city;
  res.json(student);
});

router.delete("/:id", (req, res) => {
  students = students.filter((s) => s.id !== req.params.id);
  res.status(204).send();
});

// Attach the getStudents function to the router object
router.getStudents = getStudents;

export default router;
