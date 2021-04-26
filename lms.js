 const Joi = require('joi');
 const express = require('express');
const { pattern } = require('joi/lib/types/object');
 const app = express();
 app.use(express.json());

 const courses = [
   { id: 1, name: 'course1', code:"cse111", description:"Taken by 200 students and it is optional"},
   { id: 2, name: 'course2'},
   { id: 3, name: 'course3'},
 ]

 const students = [
  { id: 1, name: 'Zeinab_Ismail', code:"1600613"},
  { id: 2, name: 'Abdelrahman_Ismail', code: '1808113'},
]
  
app.get('/api/courses', (req, res) =>{
    res.send(courses);
  });

app.get('/api/students', (req, res) =>{
    res.send(courses);
  });

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    if(error.details[0].message.includes("fails to match the required pattern: /^[a-zA-Z]{3}[0-9]{3}$/"))
      return res.status(400).send("The Code must be 3 letters followed by 3 numbers");
    else return res.status(400).send(error.details[0].message);}
const course = {
  id: courses.length + 1,
  name: req.body.name,
  code: req.body.code,
  description: req.body.description
};
courses.push(course);
res.send(course);
});

app.post('/api/students', (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
const student = {
  id: students.length + 1,
  name: req.body.name,
  code: req.body.code
};
students.push(student);
res.send(student);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find( c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send("Course not found");
  res.send(course);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find( c => c.id === parseInt(req.params.id));
  if(!student) return res.status(404).send("Student not found");
  res.send(student);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find( c => c.id === parseInt(req.params.id));
  if(!course) {res.status(404).send("Course not found");
  return;
}

    const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);


  course.name = req.body.name;
  course.code = req.body.code;
  course.description = req.body.description;
  res.send(course);

});

app.put('/api/students/:id', (req, res) => {
  const student = students.find( c => c.id === parseInt(req.params.id));
  if(!student) {res.status(404).send("student not found");
  return;
}

    const { error } = validateStudent(req.body);

  if (error) return res.status(400).send(error.details[0].message);


  student.name = req.body.name;
  student.code = req.body.code;
  res.send(student);

});

app.delete('/api/students/:id', (req, res) => {
  const student = students.find( c => c.id === parseInt(req.params.id));
  if(!student)  return res.status(404).send("student not found");
  const index = students.indexOf(student);
  students.splice(index, 1);
  res.send(student);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find( c => c.id === parseInt(req.params.id));
  if(!course)  return res.status(404).send("Course not found");
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateStudent(student){
  const pattern = "^[a-zA-Z_,]*$";
  const schema = {
    name: Joi.string().regex(RegExp(pattern)).required(),
    code: Joi.string().length(7).required()
  };
  
  return Joi.validate(student, schema);
};

function validateCourse(course){
  const pattern = "^[a-zA-Z]{3}[0-9]{3}$";
  const schema = {
    name: Joi.string().min(5).required(),
    code: Joi.string().regex(RegExp(pattern)).required(),
    description: Joi.string().max(200).optional()
  };
  
  return Joi.validate(course, schema);
};



  const port = process.env.PORT || 3000;
  app.listen(port, () =>{
      console.log("Listening on port ",port, "...");
  })