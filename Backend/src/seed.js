// seed.js
// To run the seed: node seed.js or node src/seed.js (if .env is outside src)
require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Role = require('./models/Role');
const Account = require('./models/Account');
const User = require('./models/User');
const Student = require('./models/Student');
const Business = require('./models/Business');
const Language = require('./models/Language');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Test = require('./models/Test');
const Question = require('./models/Question');
const Answer = require('./models/Answer');
const History = require('./models/History');
const Rating = require('./models/Rating');
const Blog = require('./models/Blog');
const StudentLessonProgress = require('./models/StudentLessonProgress');

const bcrypt = require('bcrypt');

const uri = process.env.MONGO_URI || 'mongodb+srv://PhanAnhHao:anhhao1234567@clustertandinh.ass8o.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection failed:', err));

async function seed() {
  try {
    await mongoose.connection.dropDatabase();

    const roles = await Role.insertMany([
      { _id: new ObjectId('660edabc12eac0f2fc123401'), name: 'Admin', description: 'System administrator' },
      { _id: new ObjectId('660edabc12eac0f2fc123402'), name: 'Student', description: 'IT intern' },
      { _id: new ObjectId('660edabc12eac0f2fc123403'), name: 'Business', description: 'Recruiting company' },
    ]);

    const accounts = await Account.insertMany([
      { _id: new ObjectId(), username: 'admin01', password: 'admin123', email: 'admin01@gmail.com', role: roles[0]._id },
      { _id: new ObjectId(), username: 'student01', password: 'student123', email: 'student01@gmail.com', role: roles[1]._id },
      { _id: new ObjectId(), username: 'student02', password: 'student456', email: 'student02@gmail.com', role: roles[1]._id },
      { _id: new ObjectId(), username: 'student03', password: 'student789', email: 'student03@gmail.com', role: roles[1]._id },
      { _id: new ObjectId(), username: 'student04', password: 'student101', email: 'student04@gmail.com', role: roles[1]._id },
      { _id: new ObjectId(), username: 'business01', password: 'business123', email: 'biz01@gmail.com', role: roles[2]._id },
      { _id: new ObjectId(), username: 'business02', password: 'business456', email: 'biz02@gmail.com', role: roles[2]._id },
    ]);

    // Firebase Storage bucket name (from your environment)
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'intern-training-ed6ba.appspot.com';
    
    // Default avatars - one per role (Admin, Student, Business)
    const avatarUrls = {
      admin: `https://storage.googleapis.com/${storageBucket}/avatars/default-admin.jpg`,
      student: `https://storage.googleapis.com/${storageBucket}/avatars/default-student.jpg`,
      business: `https://storage.googleapis.com/${storageBucket}/avatars/default-business.jpg`
    };

    const users = await User.insertMany([
      { userName: 'John Smith', email: 'a@gmail.com', location: 'Hanoi', phone: '0901111111', avatar: avatarUrls.admin, idAccount: accounts[0]._id },
      { userName: 'Emily Johnson', email: 'b@gmail.com', location: 'Ho Chi Minh City', phone: '0902222222', avatar: avatarUrls.student, idAccount: accounts[1]._id },
      { userName: 'Michael Williams', email: 'c@gmail.com', location: 'Da Nang', phone: '0903333333', avatar: avatarUrls.student, idAccount: accounts[2]._id },
      { userName: 'Sophia Lee', email: 'd@gmail.com', location: 'Hue', phone: '0904444444', avatar: avatarUrls.student, idAccount: accounts[3]._id },
      { userName: 'Daniel Nguyen', email: 'e@gmail.com', location: 'Nha Trang', phone: '0905555555', avatar: avatarUrls.student, idAccount: accounts[4]._id },
      { userName: 'Sarah Brown', email: 'f@gmail.com', location: 'Hue', phone: '0906666666', avatar: avatarUrls.business, idAccount: accounts[5]._id },
      { userName: 'David Jones', email: 'g@gmail.com', location: 'Can Tho', phone: '0907777777', avatar: avatarUrls.business, idAccount: accounts[6]._id },
    ]);

    const students = await Student.insertMany([
      { idStudent: 'S1001', age: 20, school: 'Bach Khoa University', course: ['Software Engineering', 'Web Development'], englishSkill: 'Intermediate', userId: users[1]._id },
      { idStudent: 'S1002', age: 21, school: 'University of Technology', course: ['Information Systems', 'Database Management'], englishSkill: 'Fluent', userId: users[2]._id },
      { idStudent: 'S1003', age: 19, school: 'FPT University', course: ['Artificial Intelligence', 'Machine Learning'], englishSkill: 'Advanced', userId: users[3]._id },
      { idStudent: 'S1004', age: 22, school: 'RMIT University', course: ['Computer Science', 'Mobile App Development'], englishSkill: 'Fluent', userId: users[4]._id },
    ]);

    const businesses = await Business.insertMany([
      { idBusiness: 'B1001', type: 'Technology', detail: 'Software company recruiting web development interns', userId: users[5]._id },
      { idBusiness: 'B1002', type: 'Education', detail: 'Company training programmers', userId: users[6]._id },
    ]);

    const languages = await Language.insertMany([
      { _id: new ObjectId(), languageId: 'JS', name: 'JavaScript' },
      { _id: new ObjectId(), languageId: 'PY', name: 'Python' },
      { _id: new ObjectId(), languageId: 'JAVA', name: 'Java' },
      { _id: new ObjectId(), languageId: 'C#', name: 'C Sharp' },
      { _id: new ObjectId(), languageId: 'HTML', name: 'HTML/CSS' },
    ]);

    const courses = await Course.insertMany([
      { _id: new ObjectId(), idCourse: 'C001', infor: 'Frontend programming with JavaScript', languageID: languages[0]._id, businessId: businesses[0]._id, creator: users[5]._id },
      { _id: new ObjectId(), idCourse: 'C002', infor: 'Basic Python programming for AI', languageID: languages[1]._id, businessId: businesses[0]._id, creator: users[5]._id },
      { _id: new ObjectId(), idCourse: 'C003', infor: 'OOP with Java', languageID: languages[2]._id, businessId: businesses[1]._id, creator: users[6]._id },
      { _id: new ObjectId(), idCourse: 'C004', infor: 'Application development with C#', languageID: languages[3]._id, businessId: businesses[1]._id, creator: users[6]._id },
      { _id: new ObjectId(), idCourse: 'C005', infor: 'Web design with HTML/CSS', languageID: languages[4]._id, businessId: businesses[0]._id, creator: users[5]._id },
    ]);

    const testIds = Array.from({ length: 10 }, () => new ObjectId());
    const lessonIds = Array.from({ length: 10 }, () => new ObjectId());
    
    // Create 50 question IDs (5 questions per test now)
    const questionIds = Array.from({ length: 50 }, () => new ObjectId());

    const tests = await Test.insertMany([
      { _id: testIds[0], idTest: 'JS101', idLesson: lessonIds[0], idCourse: courses[0]._id, content: 'Test on basic JavaScript variables', idQuestion: [] },
      { _id: testIds[1], idTest: 'PY101', idLesson: lessonIds[1], idCourse: courses[1]._id, content: 'Test on Python functions and modules', idQuestion: [] },
      { _id: testIds[2], idTest: 'JAVA101', idLesson: lessonIds[2], idCourse: courses[2]._id, content: 'Test on Java OOP knowledge', idQuestion: [] },
      { _id: testIds[3], idTest: 'HTML101', idLesson: lessonIds[3], idCourse: courses[4]._id, content: 'Test on basic HTML tags', idQuestion: [] },
      { _id: testIds[4], idTest: 'C#101', idLesson: lessonIds[4], idCourse: courses[3]._id, content: 'Test on C# basics', idQuestion: [] },
      { _id: testIds[5], idTest: 'JS201', idLesson: lessonIds[5], idCourse: courses[0]._id, content: 'Test on JavaScript loops and conditions', idQuestion: [] },
      { _id: testIds[6], idTest: 'PY201', idLesson: lessonIds[6], idCourse: courses[1]._id, content: 'Test on Python control structures', idQuestion: [] },
      { _id: testIds[7], idTest: 'JAVA201', idLesson: lessonIds[7], idCourse: courses[2]._id, content: 'Test on Java inheritance and polymorphism', idQuestion: [] },
      { _id: testIds[8], idTest: 'HTML201', idLesson: lessonIds[8], idCourse: courses[4]._id, content: 'Test on basic CSS for HTML', idQuestion: [] },
      { _id: testIds[9], idTest: 'C#201', idLesson: lessonIds[9], idCourse: courses[3]._id, content: 'Test on C# variables, functions, and classes', idQuestion: [] },
    ]);

    const lessons = await Lesson.insertMany([
      { _id: lessonIds[0], idLesson: 'L001', idCourse: courses[0]._id, name: 'JavaScript variable declarations', content: 'What are let, const, var and when to use them', linkVideo: 'https://youtu.be/js-vars', status: 'published', idTest: testIds[0] },
      { _id: lessonIds[1], idLesson: 'L002', idCourse: courses[1]._id, name: 'Functions and modules in Python', content: 'def, import and module structure', linkVideo: 'https://youtu.be/py-functions', status: 'published', idTest: testIds[1] },
      { _id: lessonIds[2], idLesson: 'L003', idCourse: courses[2]._id, name: 'Object-oriented programming with Java', content: 'class, object, inheritance, polymorphism', linkVideo: 'https://youtu.be/java-oop', status: 'published', idTest: testIds[2] },
      { _id: lessonIds[3], idLesson: 'L004', idCourse: courses[4]._id, name: 'Basic HTML tags', content: 'html, head, body, div, p, h1-h6', linkVideo: 'https://youtu.be/html-tags', status: 'published', idTest: testIds[3] },
      { _id: lessonIds[4], idLesson: 'L005', idCourse: courses[3]._id, name: 'Variables and data types in C#', content: 'string, int, bool, var, dynamic', linkVideo: 'https://youtu.be/csharp-vars', status: 'published', idTest: testIds[4] },
      { _id: lessonIds[5], idLesson: 'L006', idCourse: courses[0]._id, name: 'Conditional structures and loops in JS', content: 'if, else, for, while, do-while', linkVideo: 'https://youtu.be/js-loops', status: 'published', idTest: testIds[5] },
      { _id: lessonIds[6], idLesson: 'L007', idCourse: courses[1]._id, name: 'Conditions and loops in Python', content: 'if-elif-else, for, while', linkVideo: 'https://youtu.be/py-control', status: 'published', idTest: testIds[6] },
      { _id: lessonIds[7], idLesson: 'L008', idCourse: courses[2]._id, name: 'Inheritance and polymorphism in Java', content: 'extends, override, interface', linkVideo: 'https://youtu.be/java-inheritance', status: 'published', idTest: testIds[7] },
      { _id: lessonIds[8], idLesson: 'L009', idCourse: courses[4]._id, name: 'Introduction to basic CSS', content: 'selector, color, font-size, box model', linkVideo: 'https://youtu.be/css-basics', status: 'published', idTest: testIds[8] },
      { _id: lessonIds[9], idLesson: 'L010', idCourse: courses[3]._id, name: 'Classes and methods in C#', content: 'Creating classes, constructors, methods', linkVideo: 'https://youtu.be/csharp-class', status: 'published', idTest: testIds[9] },
    ]);

    // JavaScript Test Questions (Test 0)
    const jsQuestions = [
      { 
        _id: questionIds[0], 
        idQuestion: 'JS001', 
        idTest: testIds[0], 
        question: 'Which keyword is used to declare a constant variable in JavaScript?', 
        options: ['var', 'let', 'const', 'static'],
        correctAnswerIndex: 2,
        answer: 'const' 
      },
      { 
        _id: questionIds[1], 
        idQuestion: 'JS002', 
        idTest: testIds[0], 
        question: 'What is the result of 5 + "5" in JavaScript?', 
        options: ['10', '55', 'Error', 'undefined'],
        correctAnswerIndex: 1,
        answer: '55' 
      },
      { 
        _id: questionIds[2], 
        idQuestion: 'JS003', 
        idTest: testIds[0], 
        question: 'Which method is used to add an element to the end of an array?', 
        options: ['push()', 'append()', 'add()', 'insert()'],
        correctAnswerIndex: 0,
        answer: 'push()' 
      },
      { 
        _id: questionIds[3], 
        idQuestion: 'JS004', 
        idTest: testIds[0], 
        question: 'What does the "===" operator do in JavaScript?', 
        options: ['Assigns a value', 'Compares value only', 'Compares value and type', 'None of the above'],
        correctAnswerIndex: 2,
        answer: 'Compares value and type' 
      },
      { 
        _id: questionIds[4], 
        idQuestion: 'JS005', 
        idTest: testIds[0], 
        question: 'How do you declare a function in JavaScript?', 
        options: ['function myFunction()', 'def myFunction()', 'myFunction = function()', 'Both A and C are correct'],
        correctAnswerIndex: 3,
        answer: 'Both A and C are correct' 
      }
    ];

    // Python Test Questions (Test 1)
    const pyQuestions = [
      { 
        _id: questionIds[5], 
        idQuestion: 'PY001', 
        idTest: testIds[1], 
        question: 'Which statement is used to define a function in Python?', 
        options: ['function', 'def', 'fun', 'method'],
        correctAnswerIndex: 1,
        answer: 'def' 
      },
      { 
        _id: questionIds[6], 
        idQuestion: 'PY002', 
        idTest: testIds[1], 
        question: 'What is the output of print(3 ** 2) in Python?', 
        options: ['6', '9', '5', 'Error'],
        correctAnswerIndex: 1,
        answer: '9' 
      },
      { 
        _id: questionIds[7], 
        idQuestion: 'PY003', 
        idTest: testIds[1], 
        question: 'Which is NOT a valid way to create a list in Python?', 
        options: ['a = []', 'a = list()', 'a = [1, 2, 3]', 'a = array(1, 2, 3)'],
        correctAnswerIndex: 3,
        answer: 'a = array(1, 2, 3)' 
      },
      { 
        _id: questionIds[8], 
        idQuestion: 'PY004', 
        idTest: testIds[1], 
        question: 'How do you import a module named "math" in Python?', 
        options: ['#include math', 'import math', 'using math', 'require math'],
        correctAnswerIndex: 1,
        answer: 'import math' 
      },
      { 
        _id: questionIds[9], 
        idQuestion: 'PY005', 
        idTest: testIds[1], 
        question: 'Which of the following is NOT a Python data type?', 
        options: ['int', 'float', 'char', 'bool'],
        correctAnswerIndex: 2,
        answer: 'char' 
      }
    ];

    // Java Test Questions (Test 2)
    const javaQuestions = [
      { 
        _id: questionIds[10], 
        idQuestion: 'JAVA001', 
        idTest: testIds[2], 
        question: 'What is the correct way to declare a class in Java?', 
        options: ['class MyClass { }', 'def MyClass { }', 'function MyClass() { }', 'object MyClass { }'],
        correctAnswerIndex: 0,
        answer: 'class MyClass { }' 
      },
      { 
        _id: questionIds[11], 
        idQuestion: 'JAVA002', 
        idTest: testIds[2], 
        question: 'Which keyword is used to inherit a class in Java?', 
        options: ['extends', 'implements', 'inherits', 'using'],
        correctAnswerIndex: 0,
        answer: 'extends' 
      },
      { 
        _id: questionIds[12], 
        idQuestion: 'JAVA003', 
        idTest: testIds[2], 
        question: 'What is the default access modifier in Java if none is specified?', 
        options: ['public', 'private', 'protected', 'package/default'],
        correctAnswerIndex: 3,
        answer: 'package/default' 
      },
      { 
        _id: questionIds[13], 
        idQuestion: 'JAVA004', 
        idTest: testIds[2], 
        question: 'Which of the following is NOT a pillar of OOP?', 
        options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Concatenation'],
        correctAnswerIndex: 3,
        answer: 'Concatenation' 
      },
      { 
        _id: questionIds[14], 
        idQuestion: 'JAVA005', 
        idTest: testIds[2], 
        question: 'What is the purpose of the "super" keyword in Java?', 
        options: ['To call the superclass constructor', 'To access the parent class methods', 'To create a superobject', 'Both A and B'],
        correctAnswerIndex: 3,
        answer: 'Both A and B' 
      }
    ];

    // HTML Test Questions (Test 3)
    const htmlQuestions = [
      { 
        _id: questionIds[15], 
        idQuestion: 'HTML001', 
        idTest: testIds[3], 
        question: 'Which HTML tag is used for creating a table?', 
        options: ['<table>', '<tab>', '<tb>', '<grid>'],
        correctAnswerIndex: 0,
        answer: '<table>' 
      },
      { 
        _id: questionIds[16], 
        idQuestion: 'HTML002', 
        idTest: testIds[3], 
        question: 'What does HTML stand for?', 
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
        correctAnswerIndex: 0,
        answer: 'Hyper Text Markup Language' 
      },
      { 
        _id: questionIds[17], 
        idQuestion: 'HTML003', 
        idTest: testIds[3], 
        question: 'Which tag is used to define an image in HTML?', 
        options: ['<img>', '<image>', '<picture>', '<src>'],
        correctAnswerIndex: 0,
        answer: '<img>' 
      },
      { 
        _id: questionIds[18], 
        idQuestion: 'HTML004', 
        idTest: testIds[3], 
        question: 'Which attribute is used to specify the URL of the page the link goes to?', 
        options: ['href', 'src', 'link', 'url'],
        correctAnswerIndex: 0,
        answer: 'href' 
      },
      { 
        _id: questionIds[19], 
        idQuestion: 'HTML005', 
        idTest: testIds[3], 
        question: 'Which HTML element is used for creating a dropdown list?', 
        options: ['<select>', '<dropdown>', '<option>', '<list>'],
        correctAnswerIndex: 0,
        answer: '<select>' 
      }
    ];

    // C# Test Questions (Test 4)
    const csharpQuestions = [
      { 
        _id: questionIds[20], 
        idQuestion: 'CS001', 
        idTest: testIds[4], 
        question: 'Which of the following is a value type in C#?', 
        options: ['string', 'int', 'class', 'delegate'],
        correctAnswerIndex: 1,
        answer: 'int' 
      },
      { 
        _id: questionIds[21], 
        idQuestion: 'CS002', 
        idTest: testIds[4], 
        question: 'What is the correct way to declare a variable in C#?', 
        options: ['var x = 10;', 'let x = 10;', 'const x = 10;', 'dim x = 10;'],
        correctAnswerIndex: 0,
        answer: 'var x = 10;' 
      },
      { 
        _id: questionIds[22], 
        idQuestion: 'CS003', 
        idTest: testIds[4], 
        question: 'Which keyword is used to define a constant in C#?', 
        options: ['const', 'static', 'readonly', 'final'],
        correctAnswerIndex: 0,
        answer: 'const' 
      },
      { 
        _id: questionIds[23], 
        idQuestion: 'CS004', 
        idTest: testIds[4], 
        question: 'What is the C# equivalent of null in SQL or JavaScript?', 
        options: ['nil', 'null', 'nothing', 'undefined'],
        correctAnswerIndex: 1,
        answer: 'null' 
      },
      { 
        _id: questionIds[24], 
        idQuestion: 'CS005', 
        idTest: testIds[4], 
        question: 'Which collection in C# allows storing key-value pairs?', 
        options: ['List<T>', 'Array', 'Dictionary<K,V>', 'ArrayList'],
        correctAnswerIndex: 2,
        answer: 'Dictionary<K,V>' 
      }
    ];

    // JS Loops Test Questions (Test 5)
    const jsLoopsQuestions = [
      { 
        _id: questionIds[25], 
        idQuestion: 'JSL001', 
        idTest: testIds[5], 
        question: 'Which loop in JavaScript will always execute at least once?', 
        options: ['for loop', 'while loop', 'do-while loop', 'for-in loop'],
        correctAnswerIndex: 2,
        answer: 'do-while loop' 
      },
      { 
        _id: questionIds[26], 
        idQuestion: 'JSL002', 
        idTest: testIds[5], 
        question: 'What does the "continue" statement do in a loop?', 
        options: ['Exits the loop completely', 'Skips the current iteration and continues with the next iteration', 'Halts the program', 'Returns a value from the loop'],
        correctAnswerIndex: 1,
        answer: 'Skips the current iteration and continues with the next iteration' 
      },
      { 
        _id: questionIds[27], 
        idQuestion: 'JSL003', 
        idTest: testIds[5], 
        question: 'Which loop is best suited for iterating over object properties?', 
        options: ['for loop', 'while loop', 'for-in loop', 'do-while loop'],
        correctAnswerIndex: 2,
        answer: 'for-in loop' 
      },
      { 
        _id: questionIds[28], 
        idQuestion: 'JSL004', 
        idTest: testIds[5], 
        question: 'How do you break out of a loop in JavaScript?', 
        options: ['exit;', 'break;', 'stop;', 'return;'],
        correctAnswerIndex: 1,
        answer: 'break;' 
      },
      { 
        _id: questionIds[29], 
        idQuestion: 'JSL005', 
        idTest: testIds[5], 
        question: 'What is the modern loop for iterating over array elements in JavaScript?', 
        options: ['for-of loop', 'for-in loop', 'for-each loop', 'for loop'],
        correctAnswerIndex: 0,
        answer: 'for-of loop' 
      }
    ];

    // Python Control Test Questions (Test 6)
    const pythonControlQuestions = [
      { 
        _id: questionIds[30], 
        idQuestion: 'PYC001', 
        idTest: testIds[6], 
        question: 'What is the correct syntax for an if statement in Python?', 
        options: ['if (x > 5) { }', 'if x > 5:', 'if x > 5 then', 'if (x > 5):'],
        correctAnswerIndex: 1,
        answer: 'if x > 5:' 
      },
      { 
        _id: questionIds[31], 
        idQuestion: 'PYC002', 
        idTest: testIds[6], 
        question: 'How do you create an infinite loop in Python?', 
        options: ['for(;;)', 'while(1)', 'while True:', 'loop:'],
        correctAnswerIndex: 2,
        answer: 'while True:' 
      },
      { 
        _id: questionIds[32], 
        idQuestion: 'PYC003', 
        idTest: testIds[6], 
        question: 'Which of these is NOT a valid loop in Python?', 
        options: ['for loop', 'while loop', 'do-while loop', 'list comprehension'],
        correctAnswerIndex: 2,
        answer: 'do-while loop' 
      },
      { 
        _id: questionIds[33], 
        idQuestion: 'PYC004', 
        idTest: testIds[6], 
        question: 'What is the purpose of "pass" in Python?', 
        options: ['To break out of a loop', 'To skip the current iteration', 'To act as a placeholder when no code is needed', 'To throw an exception'],
        correctAnswerIndex: 2,
        answer: 'To act as a placeholder when no code is needed' 
      },
      { 
        _id: questionIds[34], 
        idQuestion: 'PYC005', 
        idTest: testIds[6], 
        question: 'How do you iterate over both the index and value in a Python list?', 
        options: ['for i, v in list:', 'for i, v in enumerate(list):', 'for i = 0; i < len(list); i++:', 'foreach (i, v) in list:'],
        correctAnswerIndex: 1,
        answer: 'for i, v in enumerate(list):' 
      }
    ];

    // Java Inheritance Test Questions (Test 7)
    const javaInheritanceQuestions = [
      { 
        _id: questionIds[35], 
        idQuestion: 'JAVAI001', 
        idTest: testIds[7], 
        question: 'What keyword is used to prevent a class from being inherited?', 
        options: ['sealed', 'private', 'final', 'static'],
        correctAnswerIndex: 2,
        answer: 'final' 
      },
      { 
        _id: questionIds[36], 
        idQuestion: 'JAVAI002', 
        idTest: testIds[7], 
        question: 'What is method overriding in Java?', 
        options: ['Creating a method with the same name but different parameters in the same class', 'Hiding a method in the subclass by creating a method with the same signature as in the superclass', 'Creating a static method in a subclass', 'Making a method abstract'],
        correctAnswerIndex: 1,
        answer: 'Hiding a method in the subclass by creating a method with the same signature as in the superclass' 
      },
      { 
        _id: questionIds[37], 
        idQuestion: 'JAVAI003', 
        idTest: testIds[7], 
        question: 'Which of these is NOT a type of inheritance in Java?', 
        options: ['Single inheritance', 'Multiple inheritance through classes', 'Hierarchical inheritance', 'Multiple inheritance through interfaces'],
        correctAnswerIndex: 1,
        answer: 'Multiple inheritance through classes' 
      },
      { 
        _id: questionIds[38], 
        idQuestion: 'JAVAI004', 
        idTest: testIds[7], 
        question: 'What is the purpose of the "abstract" keyword in Java?', 
        options: ['To create a final class', 'To declare a class that cannot be instantiated', 'To define a concrete implementation', 'To make a variable constant'],
        correctAnswerIndex: 1,
        answer: 'To declare a class that cannot be instantiated' 
      },
      { 
        _id: questionIds[39], 
        idQuestion: 'JAVAI005', 
        idTest: testIds[7], 
        question: 'What is the difference between an interface and an abstract class in Java?', 
        options: ['Abstract classes can have constructors, interfaces cannot', 'Abstract classes can have method implementations, interfaces cannot (before Java 8)', 'Abstract classes can be instantiated, interfaces cannot', 'Both A and B'],
        correctAnswerIndex: 3,
        answer: 'Both A and B' 
      }
    ];

    // CSS Test Questions (Test 8)
    const cssQuestions = [
      { 
        _id: questionIds[40], 
        idQuestion: 'CSS001', 
        idTest: testIds[8], 
        question: 'What does CSS stand for?', 
        options: ['Creative Style Sheets', 'Computer Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
        correctAnswerIndex: 2,
        answer: 'Cascading Style Sheets' 
      },
      { 
        _id: questionIds[41], 
        idQuestion: 'CSS002', 
        idTest: testIds[8], 
        question: 'Which property is used to change the background color?', 
        options: ['background-color', 'bgcolor', 'color', 'background'],
        correctAnswerIndex: 0,
        answer: 'background-color' 
      },
      { 
        _id: questionIds[42], 
        idQuestion: 'CSS003', 
        idTest: testIds[8], 
        question: 'How do you select an element with id "header" in CSS?', 
        options: ['.header', '#header', 'header', '*header'],
        correctAnswerIndex: 1,
        answer: '#header' 
      },
      { 
        _id: questionIds[43], 
        idQuestion: 'CSS004', 
        idTest: testIds[8], 
        question: 'Which property controls the text size?', 
        options: ['text-size', 'font-style', 'font-size', 'text-height'],
        correctAnswerIndex: 2,
        answer: 'font-size' 
      },
      { 
        _id: questionIds[44], 
        idQuestion: 'CSS005', 
        idTest: testIds[8], 
        question: 'What is the box model in CSS?', 
        options: ['A layout system for texts', 'A model that defines how elements are structured with margins, borders, padding, and content', 'A way to create 3D boxes', 'A model for image galleries'],
        correctAnswerIndex: 1,
        answer: 'A model that defines how elements are structured with margins, borders, padding, and content' 
      }
    ];

    // C# Classes Test Questions (Test 9)
    const csharpClassesQuestions = [
      { 
        _id: questionIds[45], 
        idQuestion: 'CSC001', 
        idTest: testIds[9], 
        question: 'What keyword is used to create a constructor in C#?', 
        options: ['new', 'constructor', 'create', 'same name as the class'],
        correctAnswerIndex: 3,
        answer: 'same name as the class' 
      },
      { 
        _id: questionIds[46], 
        idQuestion: 'CSC002', 
        idTest: testIds[9], 
        question: 'Which access modifier makes a class member accessible only within the containing class?', 
        options: ['public', 'private', 'protected', 'internal'],
        correctAnswerIndex: 1,
        answer: 'private' 
      },
      { 
        _id: questionIds[47], 
        idQuestion: 'CSC003', 
        idTest: testIds[9], 
        question: 'What is an instance method in C#?', 
        options: ['A method that belongs to the class itself', 'A method that belongs to an instance of the class', 'A method that cannot be overridden', 'A method that is initialized when the class is created'],
        correctAnswerIndex: 1,
        answer: 'A method that belongs to an instance of the class' 
      },
      { 
        _id: questionIds[48], 
        idQuestion: 'CSC004', 
        idTest: testIds[9], 
        question: 'Which keyword is used to implement an interface in C#?', 
        options: ['extends', 'inherits', 'implements', ':'],
        correctAnswerIndex: 3,
        answer: ':' 
      },
      { 
        _id: questionIds[49], 
        idQuestion: 'CSC005', 
        idTest: testIds[9], 
        question: 'What are properties in C#?', 
        options: ['Variables that store values', 'Methods that perform actions', 'Special methods that provide a flexible mechanism to read and write the value of a private field', 'Interfaces that define behavior'],
        correctAnswerIndex: 2,
        answer: 'Special methods that provide a flexible mechanism to read and write the value of a private field' 
      }
    ];

    const allQuestions = [
      ...jsQuestions,
      ...pyQuestions,
      ...javaQuestions,
      ...htmlQuestions,
      ...csharpQuestions,
      ...jsLoopsQuestions,
      ...pythonControlQuestions,
      ...javaInheritanceQuestions,
      ...cssQuestions,
      ...csharpClassesQuestions
    ];

    await Question.insertMany(allQuestions);

    // Update each test with its questions (5 questions per test)
    for (let i = 0; i < testIds.length; i++) {
      const questionIdsForTest = questionIds.slice(i * 5, (i + 1) * 5);
      await Test.findByIdAndUpdate(testIds[i], { idQuestion: questionIdsForTest });
    }

    // Seed more comprehensive data for test history (History)
    const historyRecords = [
      // Student 1 test histories
      { 
        studentId: students[0]._id, 
        testId: testIds[0], 
        score: 85, 
        completedAt: new Date('2023-06-15'), 
        passed: true 
      },
      { 
        studentId: students[0]._id, 
        testId: testIds[1], 
        score: 70, 
        completedAt: new Date('2023-06-20'), 
        passed: true 
      },
      { 
        studentId: students[0]._id, 
        testId: testIds[2], 
        score: 90, 
        completedAt: new Date('2023-07-05'), 
        passed: true 
      },
      { 
        studentId: students[0]._id, 
        testId: testIds[3], 
        score: 65, 
        completedAt: new Date('2023-07-15'), 
        passed: true 
      },
      { 
        studentId: students[0]._id, 
        testId: testIds[5], 
        score: 88, 
        completedAt: new Date('2023-08-01'), 
        passed: true 
      },
      
      // Student 2 test histories
      { 
        studentId: students[1]._id, 
        testId: testIds[0], 
        score: 60, 
        completedAt: new Date('2023-06-22'), 
        passed: true 
      },
      { 
        studentId: students[1]._id, 
        testId: testIds[2], 
        score: 45, 
        completedAt: new Date('2023-06-25'), 
        passed: false 
      },
      { 
        studentId: students[1]._id, 
        testId: testIds[1], 
        score: 80, 
        completedAt: new Date('2023-07-10'), 
        passed: true 
      },
      { 
        studentId: students[1]._id, 
        testId: testIds[4], 
        score: 75, 
        completedAt: new Date('2023-07-20'), 
        passed: true 
      },
      { 
        studentId: students[1]._id, 
        testId: testIds[6], 
        score: 92, 
        completedAt: new Date('2023-08-05'), 
        passed: true 
      },
      
      // Student 3 test histories
      { 
        studentId: students[2]._id, 
        testId: testIds[0], 
        score: 75, 
        completedAt: new Date('2023-06-18'), 
        passed: true 
      },
      { 
        studentId: students[2]._id, 
        testId: testIds[1], 
        score: 85, 
        completedAt: new Date('2023-06-28'), 
        passed: true 
      },
      { 
        studentId: students[2]._id, 
        testId: testIds[4], 
        score: 40, 
        completedAt: new Date('2023-07-08'), 
        passed: false 
      },
      { 
        studentId: students[2]._id, 
        testId: testIds[7], 
        score: 78, 
        completedAt: new Date('2023-07-25'), 
        passed: true 
      },
      { 
        studentId: students[2]._id, 
        testId: testIds[8], 
        score: 82, 
        completedAt: new Date('2023-08-10'), 
        passed: true 
      },
      
      // Student 4 test histories
      { 
        studentId: students[3]._id, 
        testId: testIds[3], 
        score: 95, 
        completedAt: new Date('2023-06-25'), 
        passed: true 
      },
      { 
        studentId: students[3]._id, 
        testId: testIds[5], 
        score: 80, 
        completedAt: new Date('2023-07-05'), 
        passed: true 
      },
      { 
        studentId: students[3]._id, 
        testId: testIds[9], 
        score: 88, 
        completedAt: new Date('2023-07-22'), 
        passed: true 
      },
      { 
        studentId: students[3]._id, 
        testId: testIds[2], 
        score: 72, 
        completedAt: new Date('2023-08-07'), 
        passed: true 
      },
      { 
        studentId: students[3]._id, 
        testId: testIds[8], 
        score: 91, 
        completedAt: new Date('2023-08-18'), 
        passed: true 
      }
    ];
    
    await History.insertMany(historyRecords);

    // Seed more comprehensive answer data
    const answerRecords = [
      // Student 1 answers for JavaScript test
      {
        content: 'const',
        questionId: questionIds[0],
        userId: users[1]._id,
        selectedOptionIndex: 2,
        isCorrect: true
      },
      {
        content: '55',
        questionId: questionIds[1],
        userId: users[1]._id,
        selectedOptionIndex: 1,
        isCorrect: true
      },
      {
        content: 'push()',
        questionId: questionIds[2],
        userId: users[1]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: 'Compares value only',
        questionId: questionIds[3],
        userId: users[1]._id,
        selectedOptionIndex: 1,
        isCorrect: false
      },
      {
        content: 'Both A and C are correct',
        questionId: questionIds[4],
        userId: users[1]._id,
        selectedOptionIndex: 3,
        isCorrect: true
      },
      
      // Student 2 answers for Python test
      {
        content: 'def',
        questionId: questionIds[5],
        userId: users[2]._id,
        selectedOptionIndex: 1,
        isCorrect: true
      },
      {
        content: '9',
        questionId: questionIds[6],
        userId: users[2]._id,
        selectedOptionIndex: 1,
        isCorrect: true
      },
      {
        content: 'a = []',
        questionId: questionIds[7],
        userId: users[2]._id,
        selectedOptionIndex: 0,
        isCorrect: false
      },
      {
        content: 'import math',
        questionId: questionIds[8],
        userId: users[2]._id,
        selectedOptionIndex: 1,
        isCorrect: true
      },
      {
        content: 'char',
        questionId: questionIds[9],
        userId: users[2]._id,
        selectedOptionIndex: 2,
        isCorrect: true
      },
      
      // Student 3 answers for Java test
      {
        content: 'class MyClass { }',
        questionId: questionIds[10],
        userId: users[3]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: 'extends',
        questionId: questionIds[11],
        userId: users[3]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: 'protected',
        questionId: questionIds[12],
        userId: users[3]._id,
        selectedOptionIndex: 2,
        isCorrect: false
      },
      {
        content: 'Concatenation',
        questionId: questionIds[13],
        userId: users[3]._id,
        selectedOptionIndex: 3,
        isCorrect: true
      },
      {
        content: 'Both A and B',
        questionId: questionIds[14],
        userId: users[3]._id,
        selectedOptionIndex: 3,
        isCorrect: true
      },
      
      // Student 4 answers for HTML test
      {
        content: '<table>',
        questionId: questionIds[15],
        userId: users[4]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: 'Hyper Text Markup Language',
        questionId: questionIds[16],
        userId: users[4]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: '<img>',
        questionId: questionIds[17],
        userId: users[4]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: 'href',
        questionId: questionIds[18],
        userId: users[4]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: '<select>',
        questionId: questionIds[19],
        userId: users[4]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      
      // Student 1 answers for C# test
      {
        content: 'int',
        questionId: questionIds[20],
        userId: users[1]._id,
        selectedOptionIndex: 1,
        isCorrect: true
      },
      {
        content: 'var x = 10;',
        questionId: questionIds[21],
        userId: users[1]._id,
        selectedOptionIndex: 0,
        isCorrect: true
      },
      {
        content: 'readonly',
        questionId: questionIds[22],
        userId: users[1]._id,
        selectedOptionIndex: 2,
        isCorrect: false
      },
      {
        content: 'null',
        questionId: questionIds[23],
        userId: users[1]._id,
        selectedOptionIndex: 1,
        isCorrect: true
      },
      {
        content: 'Dictionary<K,V>',
        questionId: questionIds[24],
        userId: users[1]._id,
        selectedOptionIndex: 2,
        isCorrect: true
      }
    ];
    
    await Answer.insertMany(answerRecords);

    // Seed more comprehensive rating data
    const ratingRecords = [
      {
        studentId: students[0]._id,
        courseId: courses[0]._id,
        stars: 4,
        feedback: "Great JavaScript course! Really helped me understand the fundamentals."
      },
      {
        studentId: students[0]._id,
        courseId: courses[1]._id,
        stars: 5,
        feedback: "The Python course was excellent, especially the sections on functions and modules."
      },
      {
        studentId: students[0]._id,
        courseId: courses[2]._id,
        stars: 4,
        feedback: "Good introduction to Java OOP concepts. Would like more practical examples."
      },
      {
        studentId: students[1]._id,
        courseId: courses[0]._id,
        stars: 3,
        feedback: "The JavaScript course was helpful but could use more exercises."
      },
      {
        studentId: students[1]._id,
        courseId: courses[3]._id,
        stars: 5,
        feedback: "Fantastic C# course! Made complex concepts easy to understand."
      },
      {
        studentId: students[2]._id,
        courseId: courses[1]._id,
        stars: 4,
        feedback: "The Python course was very comprehensive and well-structured."
      },
      {
        studentId: students[2]._id,
        courseId: courses[4]._id,
        stars: 2,
        feedback: "The HTML/CSS course felt too basic. Would like more advanced topics."
      },
      {
        studentId: students[3]._id,
        courseId: courses[2]._id,
        stars: 5,
        feedback: "Excellent Java course! The explanations on inheritance were particularly clear."
      },
      {
        studentId: students[3]._id,
        courseId: courses[4]._id,
        stars: 5,
        feedback: "Perfect introduction to web design. The CSS section was very helpful."
      },
      {
        studentId: students[3]._id,
        courseId: courses[0]._id,
        stars: 4,
        feedback: "The JavaScript loops and conditions section was extremely well explained."
      }
    ];
    
    await Rating.insertMany(ratingRecords);

    // Sample blog image URLs for Firebase Storage
    const blogImageUrls = [
      `https://storage.googleapis.com/${storageBucket}/blogs/blog1-nextjs-react.jpg`,
      `https://storage.googleapis.com/${storageBucket}/blogs/blog2-learning-programming.jpg`,
      `https://storage.googleapis.com/${storageBucket}/blogs/blog3-cloud-computing.jpg`,
      `https://storage.googleapis.com/${storageBucket}/blogs/blog4-fullstack-skills.jpg`,
    ];

    // Seed Blogs with Firebase Storage URLs for images
    const blogs = await Blog.insertMany([
      {
        title: 'The Future of Web Development: React vs Next.js',
        content: `<p>As web technologies continue to evolve, developers must stay informed about the most efficient tools and frameworks available. React has long been a dominant force in frontend development, but Next.js is quickly gaining traction for its powerful features.</p>
                 <p>In this article, we'll compare React and Next.js and help you decide which might be best for your projects.</p>
                 <h2>Key Advantages of Next.js</h2>
                 <ul>
                   <li>Built-in server-side rendering for improved SEO and performance</li>
                   <li>Automatic code splitting for faster page loads</li>
                   <li>Simplified routing with file-system based router</li>
                   <li>API routes that make backend development easier</li>
                   <li>Static site generation for lightning-fast static websites</li>
                 </ul>
                 <p>While React remains an excellent choice for many applications, Next.js provides additional features that can significantly enhance user experience and developer productivity.</p>`,
        image: blogImageUrls[0],
        tags: ['Web Development', 'React', 'Next.js', 'JavaScript', 'Frontend'],
        userId: users[2]._id,
        views: 251,
        status: 'published'
      },
      {
        title: 'Effective Learning Strategies for New Programmers',
        content: `<p>Learning to code can be a challenging journey, especially for those new to programming concepts. The right learning strategies can make all the difference in your progress.</p>
                 <p>Here are some proven techniques to help you master programming more effectively and efficiently.</p>
                 <h2>Top Learning Strategies</h2>
                 <ol>
                   <li><strong>Build projects from day one</strong> - Don't just read or watch tutorials; apply what you learn by building small projects.</li>
                   <li><strong>Code daily</strong> - Consistency is key. Even 30 minutes of coding per day is better than 8 hours once a week.</li>
                   <li><strong>Understand the fundamentals</strong> - Focus on learning core concepts rather than just memorizing syntax.</li>
                   <li><strong>Join a community</strong> - Engage with other learners through forums, Discord servers, or local meetups.</li>
                   <li><strong>Teach others</strong> - Explaining concepts to others is one of the best ways to solidify your own understanding.</li>
                 </ol>
                 <p>Remember that learning to code is a marathon, not a sprint. Be patient with yourself and celebrate small victories along the way.</p>`,
        image: blogImageUrls[1],
        tags: ['Programming', 'Learning', 'Education', 'Beginners', 'Tech Career'],
        userId: users[1]._id,
        views: 189,
        status: 'published'
      },
      {
        title: 'Cloud Computing in 2024: AWS vs Azure vs Google Cloud',
        content: `<p>The cloud computing landscape continues to evolve rapidly, with the major providers constantly introducing new services and features to stay competitive.</p>
                 <p>Let's examine how AWS, Azure, and Google Cloud compare in 2024 and what factors might influence your choice of platform.</p>
                 <h2>Market Leaders Comparison</h2>
                 <h3>AWS</h3>
                 <p>Still maintains the largest market share with the most comprehensive set of services. Particularly strong in:</p>
                 <ul>
                   <li>Extensive service catalog with the most mature offerings</li>
                   <li>Global infrastructure with the most regions</li>
                   <li>Advanced networking capabilities</li>
                 </ul>
                 <h3>Microsoft Azure</h3>
                 <p>Continues to grow rapidly with strong enterprise integration:</p>
                 <ul>
                   <li>Seamless integration with Microsoft products</li>
                   <li>Hybrid cloud solutions with Azure Arc</li>
                   <li>Strong enterprise support and compliance offerings</li>
                 </ul>
                 <h3>Google Cloud</h3>
                 <p>Gaining traction with data and ML strengths:</p>
                 <ul>
                   <li>Industry-leading data analytics and machine learning tools</li>
                   <li>Strong Kubernetes support (as the original creators)</li>
                   <li>Innovative pricing models and cost optimization tools</li>
                 </ul>
                 <p>The right choice depends on your specific needs, existing technology stack, and long-term goals.</p>`,
        image: blogImageUrls[2],
        tags: ['Cloud Computing', 'AWS', 'Azure', 'Google Cloud', 'Infrastructure'],
        userId: users[3]._id,
        views: 172,
        status: 'published'
      },
      {
        title: 'Essential Skills for Full-Stack Developers in 2024',
        content: `<p>The full-stack development landscape is constantly evolving, requiring developers to continuously update their skillsets to remain competitive in the job market.</p>
                 <p>Here are the essential skills that every full-stack developer should focus on in 2024.</p>
                 <h2>Frontend Skills</h2>
                 <ul>
                   <li><strong>JavaScript Frameworks</strong>: React, Vue, or Angular with component-based architecture</li>
                   <li><strong>TypeScript</strong>: For type safety and improved developer experience</li>
                   <li><strong>Modern CSS</strong>: Flexbox, Grid, CSS-in-JS, and responsive design principles</li>
                   <li><strong>Web Performance</strong>: Optimization techniques for faster loading and rendering</li>
                 </ul>
                 <h2>Backend Skills</h2>
                 <ul>
                   <li><strong>Node.js</strong>: For JavaScript-based backend development</li>
                   <li><strong>API Development</strong>: RESTful and GraphQL API design patterns</li>
                   <li><strong>Database Knowledge</strong>: Both SQL and NoSQL database management</li>
                   <li><strong>Authentication & Security</strong>: JWT, OAuth, and HTTPS implementation</li>
                 </ul>
                 <h2>DevOps & Infrastructure</h2>
                 <ul>
                   <li><strong>Containerization</strong>: Docker and container orchestration with Kubernetes</li>
                   <li><strong>CI/CD</strong>: Automated testing and deployment pipelines</li>
                   <li><strong>Cloud Services</strong>: Experience with AWS, Azure, or Google Cloud</li>
                 </ul>
                 <p>Continuous learning remains one of the most important skills for any developer. Allocate time regularly to explore new technologies and deepen your understanding of core concepts.</p>`,
        image: blogImageUrls[3],
        tags: ['Full-Stack Development', 'Programming', 'Career', 'Web Development', 'Technology'],
        userId: users[4]._id,
        views: 258,
        status: 'published'
      }
    ]);
    
    console.log('Database seeded successfully');

    // After seeding all other data, add StudentLessonProgress data
    // Seed data for StudentLessonProgress
    const studentLessonProgressRecords = [
      // Student 1 - JS Course
      {
        studentId: students[0]._id,
        lessonId: lessonIds[0], // JavaScript variable declarations
        status: 'completed',
        progress: 100,
        startedAt: new Date('2023-06-14'),
        completedAt: new Date('2023-06-15'),
        lastAccessedAt: new Date('2023-06-15'),
        watchTime: 1800, // 30 minutes
        notes: 'Completed all variable declaration exercises'
      },
      {
        studentId: students[0]._id,
        lessonId: lessonIds[5], // Conditional structures and loops in JS
        status: 'in_progress',
        progress: 60,
        startedAt: new Date('2023-06-18'),
        lastAccessedAt: new Date('2023-06-20'),
        watchTime: 1200, // 20 minutes
        notes: 'Still need to review for loops'
      },

      // Student 1 - Python Course
      {
        studentId: students[0]._id,
        lessonId: lessonIds[1], // Functions and modules in Python
        status: 'completed',
        progress: 100,
        startedAt: new Date('2023-06-19'),
        completedAt: new Date('2023-06-20'),
        lastAccessedAt: new Date('2023-06-20'),
        watchTime: 2400, // 40 minutes
        notes: 'Very helpful module structure examples'
      },
      {
        studentId: students[0]._id,
        lessonId: lessonIds[6], // Conditions and loops in Python
        status: 'not_started',
        progress: 0,
        lastAccessedAt: new Date('2023-06-20')
      },

      // Student 2 - JS Course
      {
        studentId: students[1]._id,
        lessonId: lessonIds[0], // JavaScript variable declarations
        status: 'completed',
        progress: 100,
        startedAt: new Date('2023-06-20'),
        completedAt: new Date('2023-06-22'),
        lastAccessedAt: new Date('2023-06-22'),
        watchTime: 1500, // 25 minutes
        notes: 'Confused about let vs var scoping at first, but got it eventually'
      },
      {
        studentId: students[1]._id,
        lessonId: lessonIds[5], // Conditional structures and loops in JS
        status: 'not_started',
        progress: 0,
        lastAccessedAt: new Date('2023-06-22')
      },

      // Student 2 - C# Course
      {
        studentId: students[1]._id,
        lessonId: lessonIds[4], // Variables and data types in C#
        status: 'in_progress',
        progress: 45,
        startedAt: new Date('2023-06-25'),
        lastAccessedAt: new Date('2023-07-05'),
        watchTime: 900, // 15 minutes
        notes: 'Need more practice with dynamic types'
      },
      {
        studentId: students[1]._id,
        lessonId: lessonIds[9], // Classes and methods in C#
        status: 'not_started',
        progress: 0,
        lastAccessedAt: new Date('2023-07-05')
      },

      // Student 3 - Python Course
      {
        studentId: students[2]._id,
        lessonId: lessonIds[1], // Functions and modules in Python
        status: 'completed',
        progress: 100,
        startedAt: new Date('2023-06-25'),
        completedAt: new Date('2023-06-28'),
        lastAccessedAt: new Date('2023-06-28'),
        watchTime: 2100, // 35 minutes
        notes: 'Understood module imports perfectly'
      },
      {
        studentId: students[2]._id,
        lessonId: lessonIds[6], // Conditions and loops in Python
        status: 'in_progress',
        progress: 75,
        startedAt: new Date('2023-06-30'),
        lastAccessedAt: new Date('2023-07-05'),
        watchTime: 1500, // 25 minutes
        notes: 'The while loop examples were great'
      },

      // Student 3 - HTML/CSS Course
      {
        studentId: students[2]._id,
        lessonId: lessonIds[3], // Basic HTML tags
        status: 'in_progress',
        progress: 30,
        startedAt: new Date('2023-07-06'),
        lastAccessedAt: new Date('2023-07-08'),
        watchTime: 600, // 10 minutes
        notes: 'Finding HTML easy to understand so far'
      },
      {
        studentId: students[2]._id,
        lessonId: lessonIds[8], // Introduction to basic CSS
        status: 'not_started',
        progress: 0,
        lastAccessedAt: new Date('2023-07-08')
      },

      // Student 4 - Java Course
      {
        studentId: students[3]._id,
        lessonId: lessonIds[2], // Object-oriented programming with Java
        status: 'completed',
        progress: 100,
        startedAt: new Date('2023-06-20'),
        completedAt: new Date('2023-06-25'),
        lastAccessedAt: new Date('2023-06-25'),
        watchTime: 3000, // 50 minutes
        notes: 'Great explanation of OOP principles'
      },
      {
        studentId: students[3]._id,
        lessonId: lessonIds[7], // Inheritance and polymorphism in Java
        status: 'completed',
        progress: 100,
        startedAt: new Date('2023-06-26'),
        completedAt: new Date('2023-07-01'),
        lastAccessedAt: new Date('2023-07-01'),
        watchTime: 2700, // 45 minutes
        notes: 'The interface examples were extremely helpful'
      },

      // Student 4 - HTML/CSS Course
      {
        studentId: students[3]._id,
        lessonId: lessonIds[3], // Basic HTML tags
        status: 'completed',
        progress: 100,
        startedAt: new Date('2023-07-10'),
        completedAt: new Date('2023-07-15'),
        lastAccessedAt: new Date('2023-07-15'),
        watchTime: 1200, // 20 minutes
        notes: 'Found HTML structure very intuitive'
      },
      {
        studentId: students[3]._id,
        lessonId: lessonIds[8], // Introduction to basic CSS
        status: 'in_progress',
        progress: 85,
        startedAt: new Date('2023-07-16'),
        lastAccessedAt: new Date('2023-07-20'),
        watchTime: 1800, // 30 minutes
        notes: 'Enjoying the creative aspects of CSS'
      }
    ];

    await StudentLessonProgress.insertMany(studentLessonProgressRecords);
    console.log('Student lesson progress data seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
