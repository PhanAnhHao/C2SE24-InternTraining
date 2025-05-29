// seed.js - Enhanced version with realistic data
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
const History = require('./models/History');
const Rating = require('./models/Rating');
const Blog = require('./models/Blog');
const StudentLessonProgress = require('./models/StudentLessonProgress');

const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

// Set the locale for English content
faker.locale = 'en';

const uri = process.env.MONGO_URI || 'mongodb+srv://PhanAnhHao:anhhao1234567@clustertandinh.ass8o.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection failed:', err));

// Hash password function
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

async function seed() {
  try {
    // Drop existing database
    console.log('Dropping existing database...');
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');

    // ===== CREATE ROLES =====
    console.log('Creating roles...');
    const roles = await Role.insertMany([
      { _id: new ObjectId('660edabc12eac0f2fc123401'), name: 'Admin', description: 'System administrator' },
      { _id: new ObjectId('660edabc12eac0f2fc123402'), name: 'Student', description: 'IT intern' },
      { _id: new ObjectId('660edabc12eac0f2fc123403'), name: 'Business', description: 'Recruiting company' },
    ]);
    console.log('Roles created: ', roles.length);

    // ===== CREATE LANGUAGES =====
    console.log('Creating languages...');
    const languages = await Language.insertMany([
      { _id: new ObjectId(), languageId: 'JS', name: 'JavaScript' },
      { _id: new ObjectId(), languageId: 'PY', name: 'Python' },
      { _id: new ObjectId(), languageId: 'JAVA', name: 'Java' },
      { _id: new ObjectId(), languageId: 'CSharp', name: 'C#' },
      { _id: new ObjectId(), languageId: 'HTML', name: 'HTML/CSS' },
    ]);
    console.log('Languages created: ', languages.length);

    // ===== CREATE ACCOUNTS =====
    console.log('Creating accounts...');
    
    // Create student accounts (20)
    const studentAccounts = [];
    for (let i = 1; i <= 20; i++) {
      const username = `student${i.toString().padStart(2, '0')}`;
      const hashedPassword = await hashPassword(`student${i}`);
      
      studentAccounts.push({
        _id: new ObjectId(),
        username: username,
        password: hashedPassword,
        email: `${username}@example.com`,
        role: roles[1]._id // Student role
      });
    }
    
    // Create business accounts (5)
    const businessAccounts = [];
    for (let i = 1; i <= 5; i++) {
      const username = `business${i.toString().padStart(2, '0')}`;
      const hashedPassword = await hashPassword(`business${i}`);
      
      businessAccounts.push({
        _id: new ObjectId(),
        username: username,
        password: hashedPassword,
        email: `${username}@business.com`,
        role: roles[2]._id // Business role
      });
    }
    
    // Combine and insert all accounts
    const accounts = await Account.insertMany([
      ...studentAccounts,
      ...businessAccounts
    ]);
    console.log('Accounts created: ', accounts.length);
    
    // ===== CREATE USERS =====
    console.log('Creating users...');
    
    // Firebase Storage bucket name (from your environment)
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'intern-training-ed6ba.appspot.com';
    
    // Default avatars
    const avatarUrls = {
      student: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/avatars%2Fdefault-student.jpg?alt=media`,
      business: (i) => `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/avatars%2Fdefault-business${i+1}.jpg?alt=media`
    };
    
    // Create student users
    const studentUsers = [];
    for (let i = 0; i < 20; i++) {
      studentUsers.push({
        userName: faker.person.fullName(),
        email: studentAccounts[i].email,
        location: faker.location.city(),
        phone: faker.phone.number('+1##########'),
        avatar: avatarUrls.student,
        idAccount: studentAccounts[i]._id
      });
    }
    
    // Create business users
    const businessUsers = [];
    for (let i = 0; i < 5; i++) {
      businessUsers.push({
        userName: faker.company.name(),
        email: businessAccounts[i].email,
        location: faker.location.city(),
        phone: faker.phone.number('+1##########'),
        avatar: avatarUrls.business(i),
        idAccount: businessAccounts[i]._id
      });
    }
    
    // Combine and insert all users
    const users = await User.insertMany([
      ...studentUsers,
      ...businessUsers
    ]);
    console.log('Users created: ', users.length);
    
    // Update studentUsers and businessUsers arrays with the actual _id values from MongoDB
    // First 20 documents are student users, next 5 are business users
    for (let i = 0; i < studentUsers.length; i++) {
      studentUsers[i] = users[i];
    }
    for (let i = 0; i < businessUsers.length; i++) {
      businessUsers[i] = users[studentUsers.length + i];
    }
    
    // ===== CREATE STUDENTS =====
    console.log('Creating students...');
    const englishLevels = ['Beginner', 'Intermediate', 'Advanced', 'Fluent'];
    const schools = [
      'MIT', 
      'Stanford University', 
      'Harvard University', 
      'University of California',
      'Georgia Tech',
      'University of Washington',
      'Carnegie Mellon University'
    ];
    const coursesStudied = [
      'Software Engineering', 
      'Web Development', 
      'Computer Science', 
      'Data Science',
      'Mobile Application Development',
      'Artificial Intelligence',
      'Information Technology',
      'Cybersecurity',
      'Network Engineering'
    ];
    
    const students = [];
    for (let i = 0; i < 20; i++) {
      // Make sure we have a valid user ID for each student
      if (!studentUsers[i] || !studentUsers[i]._id) {
        console.warn(`Missing user for student at index ${i}`);
        continue; // Skip this student if we don't have a user
      }
      
      students.push({
        idStudent: `S${(1000 + i + 1).toString()}`,
        age: faker.number.int({ min: 18, max: 30 }),
        school: faker.helpers.arrayElement(schools),
        course: faker.helpers.arrayElements(coursesStudied, { min: 1, max: 3 }),
        englishSkill: faker.helpers.arrayElement(englishLevels),
        userId: studentUsers[i]._id
      });
    }
    
    // Add validation to check that we have students to create
    if (students.length === 0) {
      throw new Error('No valid students to create. Check if studentUsers were created properly.');
    }
    
    const createdStudents = await Student.insertMany(students);
    console.log('Students created: ', createdStudents.length);
    
    // ===== CREATE BUSINESSES =====
    console.log('Creating businesses...');
    const businessTypes = ['Technology', 'Education', 'Finance', 'Marketing', 'Healthcare'];
    
    const businesses = [];
    for (let i = 0; i < 5; i++) {
      businesses.push({
        idBusiness: `B${(1000 + i + 1).toString()}`,
        type: faker.helpers.arrayElement(businessTypes),
        detail: faker.company.catchPhrase(),
        userId: businessUsers[i]._id
      });
    }
    
    const createdBusinesses = await Business.insertMany(businesses);
    console.log('Businesses created: ', createdBusinesses.length);
    
    // ===== CREATE COURSES =====
    console.log('Creating courses...');
    
    const courseInfos = [
      'Frontend Development with JavaScript', 
      'Python Programming for Data Science',
      'Java Enterprise Applications',
      'C# and .NET Development',
      'Full-stack Web Development',
      'Mobile App Development',
      'Advanced JavaScript'
    ];
    
    const courseImages = [
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/courses%2Fjavascript-course.jpg?alt=media`,
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/courses%2Fpython-course.jpg?alt=media`,
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/courses%2Fjava-course.jpg?alt=media`,
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/courses%2Fcsharp-course.jpg?alt=media`,
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/courses%2Fweb-dev-course.jpg?alt=media`,
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/courses%2Fmobile-course.jpg?alt=media`,
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/courses%2Fadvanced-js-course.jpg?alt=media`
    ];
    
    const courses = [];
    for (let i = 0; i < 7; i++) {
      // Assign languages in an appropriate manner (match course to language where possible)
      let languageID;
      switch (i) {
        case 0:
        case 6:
          languageID = languages[0]._id; // JavaScript
          break;
        case 1:
          languageID = languages[1]._id; // Python
          break;
        case 2:
          languageID = languages[2]._id; // Java
          break;
        case 3:
          languageID = languages[3]._id; // C#
          break;
        case 4:
          languageID = languages[4]._id; // HTML/CSS
          break;
        case 5:
          languageID = faker.helpers.arrayElement([languages[0]._id, languages[2]._id]); // JS or Java for mobile
          break;
        default:
          languageID = faker.helpers.arrayElement(languages.map(l => l._id));
      }
      
      // Distribute courses among businesses
      const businessId = createdBusinesses[i % createdBusinesses.length]._id;
      
      courses.push({
        _id: new ObjectId(),
        idCourse: `C${(100 + i + 1).toString().padStart(3, '0')}`,
        infor: courseInfos[i],
        languageID: languageID,
        businessId: businessId,
        image: courseImages[i]
      });
    }
    
    const createdCourses = await Course.insertMany(courses);
    console.log('Courses created: ', createdCourses.length);
    
    // ===== CREATE LESSONS (10 per course) =====
    console.log('Creating lessons...');
    
    const lessonContents = {
      'JavaScript': [
        'Introduction to JavaScript', 'Variables and Data Types', 'Functions', 'Arrays and Objects',
        'DOM Manipulation', 'Events', 'Async JavaScript', 'Error Handling', 'ES6+ Features', 'Project: Interactive Website'
      ],
      'Python': [
        'Python Basics', 'Control Structures', 'Functions and Modules', 'Data Structures', 
        'File Handling', 'Object-Oriented Python', 'Error Handling', 'Libraries and Packages', 'Web Scraping', 'Project: Data Analysis'
      ],
      'Java': [
        'Java Fundamentals', 'OOP Concepts', 'Inheritance and Interfaces', 'Collections Framework',
        'Exception Handling', 'I/O Operations', 'Multithreading', 'JDBC', 'Spring Framework Introduction', 'Project: Simple Application'
      ],
      'C#': [
        'C# Basics', 'Object-Oriented Programming', 'Collections', 'LINQ',
        'Asynchronous Programming', 'File Operations', 'Windows Forms', 'ASP.NET Introduction', 'Entity Framework', 'Project: Desktop Application'
      ],
      'HTML/CSS': [
        'HTML Basics', 'CSS Fundamentals', 'Layout and Positioning', 'Responsive Design',
        'Flexbox', 'CSS Grid', 'Forms and Validation', 'CSS Animations', 'CSS Frameworks', 'Project: Portfolio Website'
      ]
    };
    
    const lessons = [];
    const tests = [];
    const questionIds = [];
    
    let lessonIdCounter = 1;
    let testIdCounter = 1;
    
    // YouTube video IDs for educational content (10 unique IDs)
    const youtubeVideoIds = [
      'Tn6-PIqc4UM', // JavaScript tutorial
      'rfscVS0vtbw', // Python tutorial 
      'eIrMbAQSU34', // Java tutorial
      'gfkTfcpWqAY', // C# tutorial
      'qz0aGYrrlhU', // HTML tutorial
      'yfoY53QXEnI', // CSS tutorial
      'pQN-pnXPaVg', // Javascript beginner
      'WGJJIrtnfpk', // Data structures
      '8jLOx1hD3_o', // Object Oriented Programming
      'kqtD5dpn9C8'  // Python beginner
    ];
    
    // Create lessons for each course
    for (let courseIndex = 0; courseIndex < createdCourses.length; courseIndex++) {
      const course = createdCourses[courseIndex];
      
      // Find the language name for this course
      const language = languages.find(lang => lang._id.toString() === course.languageID.toString());
      const languageName = language ? language.name : 'JavaScript'; // Default to JavaScript if not found
      
      // Get appropriate lesson content
      let contentList;
      if (languageName === 'JavaScript' || courseIndex === 6) {
        contentList = lessonContents['JavaScript'];
      } else if (languageName === 'Python') {
        contentList = lessonContents['Python'];
      } else if (languageName === 'Java') {
        contentList = lessonContents['Java'];
      } else if (languageName === 'C#') {
        contentList = lessonContents['C#'];
      } else if (languageName === 'HTML/CSS') {
        contentList = lessonContents['HTML/CSS'];
      } else {
        contentList = lessonContents['JavaScript']; // Default
      }
      
      // Create 10 lessons for this course
      for (let i = 0; i < 10; i++) {
        const lessonNumber = lessonIdCounter++;
        
        // Generate more meaningful English content for lessons
        const lessonContent = `
          This lesson covers key concepts about ${contentList[i % contentList.length]}. 
          Students will learn essential principles and practical applications.
          
          ${faker.lorem.paragraph(5)}
          
          Key points to remember:
          - ${faker.commerce.productDescription()}
          - ${faker.commerce.productDescription()}
          - ${faker.commerce.productDescription()}
          
          For practice, students should complete the exercises at the end of this lesson.
        `;
        
        // Log first lesson of first course to check language
        if (courseIndex === 0 && i === 0) {
          console.log('Sample Lesson Content:', lessonContent.substring(0, 100) + '...');
        }
        
        // Create a lesson-specific test
        const testId = new ObjectId();
        
        tests.push({
          _id: testId,
          idTest: `T${(100 + testIdCounter++).toString().padStart(3, '0')}`,
          idCourse: course._id,
          idLesson: lessonNumber, // Add idLesson field to associate test with a specific lesson
          content: `Test for ${contentList[i % contentList.length]}`,
          idQuestion: [] // Will be populated later with actual question ObjectIds
        });
        
        // Use different video IDs for each lesson
        const videoId = youtubeVideoIds[i % youtubeVideoIds.length];
        
        lessons.push({
          _id: new ObjectId(),
          idLesson: `L${lessonNumber.toString().padStart(3, '0')}`,
          idCourse: course._id,
          name: contentList[i % contentList.length],
          content: lessonContent,
          linkVideo: `https://www.youtube.com/watch?v=${videoId}`, // Using unique YouTube video IDs
          status: 'published',
          idTest: testId // Each lesson has its own test
        });
        
        // Create 5 question IDs for each test (50 per course distributed across 10 lessons)
        for (let j = 0; j < 5; j++) {
          questionIds.push({
            id: new ObjectId(),
            testId: testId,
            index: j,
            courseIndex: courseIndex,
            lessonIndex: i
          });
        }
      }
    }
    
    const createdLessons = await Lesson.insertMany(lessons);
    console.log('Lessons created: ', createdLessons.length);
    
    // ===== CREATE TESTS =====
    const createdTests = await Test.insertMany(tests);
    console.log('Tests created: ', createdTests.length);
    
    // ===== CREATE QUESTIONS (50 per test) =====
    console.log('Creating questions...');
    
    const questions = [];
    
    // Define realistic questions by course/language type
    const questionsBySubject = {
      'JavaScript': [
        {
          question: 'What is the output of console.log(typeof null) in JavaScript?',
          options: ['object', 'null', 'undefined', 'number'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which array method adds elements to the end and returns the new length?',
          options: ['push()', 'append()', 'concat()', 'splice()'],
          correctAnswerIndex: 0
        },
        {
          question: 'In a browser, what does "this" refer to in an event handler added via addEventListener?',
          options: ['The DOM element that triggered the event', 'The window object', 'The document object', 'The event object'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which of the following is NOT a valid state for JavaScript Promises?',
          options: ['rejected', 'resolved', 'fulfilled', 'pending'],
          correctAnswerIndex: 1
        },
        {
          question: 'What will the following code output? \nlet x = 10;\nfunction foo() {\n  console.log(x);\n  let x = 20;\n}\nfoo();',
          options: [
            'ReferenceError: Cannot access "x" before initialization',
            '10',
            '20',
            'undefined'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'How would you correctly check if a variable "value" is an array in JavaScript?',
          options: ['Array.isArray(value)', 'typeof value === "array"', 'value instanceof Array', 'value.isArray()'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the result of 3 + 4 + "5" in JavaScript?',
          options: ['"75"', '"345"', '12', '35'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which JavaScript method is used for converting a JSON string into a JavaScript object?',
          options: ['JSON.parse()', 'JSON.stringify()', 'eval()', 'Object.fromJSON()'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the scope of variables declared with the "let" keyword?',
          options: ['Block scope', 'Function scope', 'Global scope', 'Module scope'],
          correctAnswerIndex: 0
        },
        {
          question: 'What does the following code return? \nconst arr = [1, 2, 3, 4, 5];\nconst result = arr.filter(num => num % 2 === 0);',
          options: [
            '[2, 4]',
            '[1, 3, 5]',
            '[2, 4, undefined]',
            '2'
          ],
          correctAnswerIndex: 0
        }
      ],
      'Python': [
        {
          question: 'What is the output of the following code?\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)',
          options: ['[1, 2, 3, 4]', '[1, 2, 3]', '[4, 1, 2, 3]', 'Error'],
          correctAnswerIndex: 0
        },
        {
          question: 'How would you import specific functions from a module in Python?',
          options: ['from math import sin, cos', 'import math.sin, math.cos', 'include math(sin, cos)', 'using math: sin, cos'],
          correctAnswerIndex: 0
        },
        {
          question: 'What does the following list comprehension do?\n[x**2 for x in range(5) if x % 2 == 0]',
          options: ['[0, 4, 16]', '[0, 1, 4, 9, 16]', '[0, 2, 4, 6, 8]', '[4, 16]'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which data structure in Python uses keys and values?',
          options: ['Dictionary', 'List', 'Tuple', 'Set'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the proper way to catch multiple exceptions in Python?',
          options: [
            'try:\n    code\nexcept (ValueError, TypeError):\n    handler',
            'try:\n    code\nexcept ValueError or TypeError:\n    handler',
            'try:\n    code\ncatch (ValueError, TypeError):\n    handler',
            'try:\n    code\nexcept ValueError, TypeError:\n    handler'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the output of the following?\nclass MyClass:\n    def __init__(self):\n        self.x = 1\n    def increment(self):\n        self.x += 1\nobj = MyClass()\nobj.increment()\nprint(obj.x)',
          options: [
            '2',
            '1',
            'None',
            'Error'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of the "with" statement in Python?',
          options: [
            'To ensure proper acquisition and release of resources',
            'To create a new function scope',
            'To handle exceptions specifically',
            'To import modules conditionally'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the difference between a deep copy and a shallow copy in Python?',
          options: [
            'Deep copy creates independent copies of nested objects, shallow copy doesn\'t',
            'Deep copy is faster than shallow copy',
            'Deep copy works only with lists, shallow copy works with all data types',
            'There is no difference between them'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is a Python generator?',
          options: [
            'A function that uses "yield" to return values one at a time',
            'A class that generates random numbers',
            'A tool that creates Python module templates',
            'A type of loop that generates sequences'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What would this code output in Python 3?\nprint("Hello" > "World")',
          options: ['False', 'True', 'Error', '"HelloWorld"'],
          correctAnswerIndex: 0
        }
      ],
      'Java': [
        {
          question: 'What will happen when you attempt to compile and run this code?\npublic class Test {\n    public static void main(String[] args) {\n        int[] array = new int[3];\n        System.out.println(array[3]);\n    }\n}',
          options: ['ArrayIndexOutOfBoundsException at runtime', 'Compilation error', 'Prints "null"', 'Prints "0"'],
          correctAnswerIndex: 0
        },
        {
          question: 'What feature of Java provides the "write once, run anywhere" capability?',
          options: ['JVM (Java Virtual Machine)', 'Garbage collection', 'Multithreading', 'Object-oriented design'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which of the following is true about interfaces in Java?',
          options: [
            'A class can implement multiple interfaces',
            'Interfaces can contain method implementations prior to Java 8',
            'Interfaces can have instance variables',
            'A class can extend multiple interfaces'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What access modifier makes a method accessible within its own package and to all subclasses?',
          options: ['protected', 'public', 'private', 'default (no modifier)'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which collection class would be most appropriate for storing unique elements in sorted order?',
          options: ['TreeSet', 'ArrayList', 'LinkedHashSet', 'HashMap'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the output of this code?\npublic class Test {\n    public static void main(String[] args) {\n        String s1 = "Java";\n        String s2 = new String("Java");\n        System.out.println(s1 == s2);\n    }\n}',
          options: [
            'false',
            'true',
            'Compilation error',
            'Runtime error'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which statement about Java\'s Exception handling is correct?',
          options: [
            'Checked exceptions must be explicitly caught or declared',
            'All exceptions must be handled with try-catch blocks',
            'RuntimeExceptions must be declared in method signatures',
            'The finally block is executed only when an exception occurs'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of the "synchronized" keyword in Java?',
          options: [
            'To control access to blocks of code by multiple threads',
            'To ensure methods return synchronously, not asynchronously',
            'To synchronize data between multiple JVMs',
            'To force ordered execution of methods'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What will this code print?\npublic class Test {\n    public static void main(String[] args) {\n        int x = 5;\n        System.out.println(x++ + ++x);\n    }\n}',
          options: ['12', '11', '10', '13'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is autowiring in Spring Framework?',
          options: [
            'Automatic dependency injection',
            'Automatic exception handling',
            'Automatic class loading',
            'Automatic transaction management'
          ],
          correctAnswerIndex: 0
        }
      ],
      'C#': [
        {
          question: 'What will be the output of this code?\nint x = 10;\nObject obj = x;\nConsole.WriteLine(obj.GetType());',
          options: ['System.Int32', 'System.Object', 'System.Integer', 'Error'],
          correctAnswerIndex: 0
        },
        {
          question: 'What advantage does LINQ provide to C# developers?',
          options: [
            'Type-safe queries integrated into the language',
            'Faster execution of database operations',
            'Automatic memory management for database objects',
            'Simplified UI development'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the difference between "readonly" and "const" in C#?',
          options: [
            'readonly can be assigned in constructor, const cannot',
            'readonly is for reference types, const is for value types',
            'const can be modified at runtime, readonly cannot',
            'There is no difference'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which statement about delegates in C# is correct?',
          options: [
            'Delegates can be used to pass methods as parameters to other methods',
            'Delegates are used only for database connections',
            'Delegates store references to variables, not methods',
            'Delegates are a type of value type'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the difference between "is" and "as" operators in C#?',
          options: [
            '"is" returns a boolean, "as" returns an object or null',
            '"is" performs conversion, "as" checks type compatibility',
            'They are identical in functionality',
            '"is" is for reference types only, "as" works with all types'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What will this code output?\nstring s = null;\nConsole.WriteLine(s?.Length ?? -1);',
          options: [
            '-1',
            '0',
            'null',
            'NullReferenceException'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of IDisposable interface in C#?',
          options: [
            'To provide a mechanism for releasing unmanaged resources',
            'To mark classes for garbage collection',
            'To implement event handling',
            'To enable object serialization'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which of these is NOT a C# collection?',
          options: ['Vector', 'Dictionary', 'List', 'HashSet'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the output of this code?\nvar list = new List<int> { 1, 2, 3 };\nvar query = list.Where(x => x > 1);\nlist.Add(4);\nConsole.WriteLine(query.Count());',
          options: ['3', '2', '4', '1'],
          correctAnswerIndex: 0
        },
        {
          question: 'What access modifier do you use to create a method that derived classes can use or override?',
          options: ['protected virtual', 'public override', 'protected internal', 'virtual protected'],
          correctAnswerIndex: 0
        }
      ],
      'HTML/CSS': [
        {
          question: 'What is the correct HTML for creating a hyperlink that opens in a new tab?',
          options: ['<a href="url" target="_blank">Link</a>', '<a href="url" new="tab">Link</a>', '<a href="url" window="_blank">Link</a>', '<a href="url" target="new">Link</a>'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which CSS property would you use to create a responsive grid layout?',
          options: ['grid-template-columns', 'flex-direction', 'float', 'display-grid'],
          correctAnswerIndex: 0
        },
        {
          question: 'Which CSS selector has the highest specificity?',
          options: ['#id', '.class', 'element', '[attribute]'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of the HTML <meta name="viewport"> tag?',
          options: [
            'To control the viewport dimensions and scaling on mobile devices',
            'To set the page title in search results',
            'To define metadata for search engines',
            'To specify the character encoding for the HTML document'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which property creates smooth transitions between two states of an element?',
          options: ['transition', 'animation', 'transform', 'display'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of the CSS "z-index" property?',
          options: [
            'To control the stacking order of positioned elements',
            'To set the transparency of elements',
            'To create 3D transformations',
            'To control element visibility'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What does the following CSS selector target? nav > ul > li',
          options: [
            'Direct li children of a ul that is a direct child of nav',
            'All li elements within a nav element',
            'Only the first li in a ul within nav',
            'The nav, ul, and li elements'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which HTML5 semantic element is used for the main content area of a webpage?',
          options: ['<main>', '<content>', '<section>', '<article>'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the CSS box model?',
          options: [
            'A layout design that treats each element as a box with content, padding, border, and margin',
            'A framework for creating modal dialog boxes',
            'A method to create flexbox layouts',
            'A design pattern for product showcases'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What would this CSS do? @media (max-width: 600px) { ... }',
          options: [
            'Apply the styles only when the viewport width is 600px or less',
            'Apply the styles only when the viewport width is exactly 600px',
            'Apply the styles only when the viewport width is 600px or more',
            'Apply the styles to all screens with a resolution of 600 pixels'
          ],
          correctAnswerIndex: 0
        }
      ],
      'Mobile': [
        {
          question: 'What is the key advantage of React Native over native development?',
          options: [
            'Code reusability across iOS and Android platforms',
            'Better performance than native apps',
            'Direct access to all device hardware features',
            'No need for JavaScript knowledge'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'In Android development, which component is NOT considered one of the four main app components?',
          options: ['Fragment', 'Activity', 'Service', 'Content Provider'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of SwiftUI in iOS development?',
          options: [
            'To create user interfaces declaratively',
            'To optimize Swift code compilation',
            'To manage database operations',
            'To handle app permissions'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which tool is used to debug and profile iOS apps?',
          options: ['Xcode Instruments', 'Android Studio', 'Visual Studio', 'Eclipse'],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the key difference between Flutter and React Native?',
          options: [
            'Flutter uses a single UI rendering engine, React Native uses native components',
            'Flutter is for Android only, React Native is cross-platform',
            'Flutter uses JavaScript, React Native uses Dart',
            'Flutter requires more code than React Native'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What Android component would you use to perform long-running operations in the background?',
          options: [
            'Service',
            'Activity',
            'Fragment',
            'Intent'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of Kotlin Coroutines in Android development?',
          options: [
            'To simplify asynchronous programming',
            'To create user interfaces',
            'To manage app permissions',
            'To handle database queries'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of the AppDelegate in iOS development?',
          options: [
            'To handle application lifecycle events',
            'To design the user interface',
            'To connect to remote servers',
            'To manage local databases'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which is NOT a platform-specific mobile UI consideration?',
          options: [
            'File size of the app',
            'Navigation patterns',
            'Button styling',
            'Tab bar positioning'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What technology enables push notifications in iOS apps?',
          options: [
            'Apple Push Notification Service (APNS)',
            'Firebase Cloud Messaging',
            'WebSockets',
            'Background Fetch'
          ],
          correctAnswerIndex: 0
        }
      ],
      'AdvancedJS': [
        {
          question: 'What is a JavaScript WeakMap and how does it differ from Map?',
          options: [
            'WeakMap allows its keys to be garbage collected if there are no other references',
            'WeakMap is a slower but more memory-efficient version of Map',
            'WeakMap can only use strings as keys, unlike Map',
            'WeakMap provides weaker security guarantees than Map'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the output of this code?\nconst obj = { a: 1 };\nconst objClone = { ...obj };\nconsole.log(obj === objClone);',
          options: [
            'false',
            'true',
            'undefined',
            'Error'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What does the "??=" operator do in JavaScript?',
          options: [
            'Assigns the right value to the left only if the left is null or undefined',
            'Checks if both operands are null or undefined',
            'Performs logical OR and assigns the result',
            'Type-checks both sides and raises an error if they don\'t match'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of the "module" pattern in JavaScript?',
          options: [
            'To create private variables and functions',
            'To load external code files',
            'To organize code into reusable components',
            'To prevent memory leaks'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the significance of the "await" keyword in JavaScript?',
          options: [
            'It pauses execution until the promise is resolved',
            'It creates a new Promise object',
            'It immediately returns the value of a Promise',
            'It converts synchronous code to asynchronous code'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which JavaScript approach helps prevent callback hell?',
          options: [
            'Using async/await',
            'Using more global variables',
            'Avoiding function declarations',
            'Using document.ready()'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of JavaScript Web Workers?',
          options: [
            'To run scripts in background threads',
            'To improve CSS rendering performance',
            'To manage service worker caching',
            'To enable WebSocket connections'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the output of the following code?\nfunction* gen() {\n  yield 1;\n  yield 2;\n}\nconst g = gen();\nconsole.log([...g]);',
          options: [
            '[1, 2]',
            '{1, 2}',
            'Error',
            'undefined'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'What is the purpose of Object.freeze() in JavaScript?',
          options: [
            'To make an object immutable',
            'To prevent memory leaks',
            'To optimize object performance',
            'To convert an object to JSON'
          ],
          correctAnswerIndex: 0
        },
        {
          question: 'Which approach makes JavaScript code more functional?',
          options: [
            'Using pure functions without side effects',
            'Using more try/catch blocks',
            'Creating more objects with the "new" keyword',
            'Using more global variables'
          ],
          correctAnswerIndex: 0
        }
      ]
    };
    
    // For each test (70 tests = 7 courses * 10 lessons)
    for (let testIndex = 0; testIndex < createdTests.length; testIndex++) {
      const test = createdTests[testIndex];
      const testQuestionIds = [];
      
      // Find corresponding course for this test
      const courseIndex = Math.floor(testIndex / 10); // Each course has 10 lessons/tests
      const course = createdCourses[courseIndex];
      const language = languages.find(lang => lang._id.toString() === course.languageID.toString());
      const languageName = language ? language.name : 'JavaScript';
      
      // Determine which question set to use
      let questionSet;
      if (languageName === 'JavaScript' && courseIndex === 6) {
        questionSet = questionsBySubject['AdvancedJS'];
      } else if (languageName === 'JavaScript') {
        questionSet = questionsBySubject['JavaScript'];
      } else if (languageName === 'Python') {
        questionSet = questionsBySubject['Python'];
      } else if (languageName === 'Java') {
        questionSet = questionsBySubject['Java'];
      } else if (languageName === 'C#') {
        questionSet = questionsBySubject['C#'];
      } else if (languageName === 'HTML/CSS') {
        questionSet = questionsBySubject['HTML/CSS'];
      } else if (course.infor.includes('Mobile')) {
        questionSet = questionsBySubject['Mobile'];
      } else {
        questionSet = questionsBySubject['JavaScript']; // Default
      }
      
      // Create 5 questions per test (each lesson has its own test)
      for (let i = 0; i < 5; i++) {
        const questionId = new ObjectId();
        testQuestionIds.push(questionId);
        
        const baseQuestion = questionSet[i % 10]; // Cycle through our 10 questions
        const options = [...baseQuestion.options]; // Copy to avoid modifying the original
        
        // For variation, sometimes shuffle the options and adjust the correct answer
        if ((testIndex + i) % 2 === 1) {
          // For half the questions, shuffle options to create variation
          const correctOption = options[baseQuestion.correctAnswerIndex];
          options.sort(() => 0.5 - Math.random());
          const newCorrectIndex = options.indexOf(correctOption);
          
          questions.push({
            _id: questionId,
            idQuestion: `Q${(testIndex * 5 + i + 1).toString().padStart(4, '0')}`, // Ensure unique IDs with 4-digit padding
            idTest: test._id,
            question: baseQuestion.question,
            options: options,
            type: ['multiple-choice'], // Adding type field which was missing
            correctAnswerIndex: newCorrectIndex,
            answer: `${String.fromCharCode(65 + newCorrectIndex)}`
          });
        } else {
          // For the other half, use as is
          questions.push({
            _id: questionId,
            idQuestion: `Q${(testIndex * 5 + i + 1).toString().padStart(4, '0')}`, // Ensure unique IDs with 4-digit padding
            idTest: test._id,
            question: baseQuestion.question,
            options: options,
            type: ['multiple-choice'], // Adding type field which was missing
            correctAnswerIndex: baseQuestion.correctAnswerIndex,
            answer: `${String.fromCharCode(65 + baseQuestion.correctAnswerIndex)}`
          });
        }
      }
      
      // Update the test with its questions
      await Test.findByIdAndUpdate(test._id, { idQuestion: testQuestionIds });
      
      // Debug output to check structure
      if (testIndex === 0) {
        console.log('Sample question structure:', JSON.stringify(questions[0], null, 2));
      }
    }
    
    // Insert questions in batches to avoid potential issues with large arrays
    const batchSize = 100;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      await Question.insertMany(batch);
      console.log(`Batch ${Math.floor(i/batchSize) + 1} of questions created: ${batch.length}`);
    }
    
    console.log('All questions created: ', questions.length);
    
    // ===== CREATE HISTORY RECORDS (students taking lesson tests) =====
    console.log('Creating history records...');
    
    const histories = [];
    
    // For each course
    for (let courseIndex = 0; courseIndex < createdCourses.length; courseIndex++) {
      // Get tests for this course's lessons
      const courseTests = createdTests.filter((test, index) => 
        Math.floor(index / 10) === courseIndex
      );
      
      // Determine how many students will take tests for this course (15-20)
      const numStudents = faker.number.int({ min: 15, max: 20 });
      
      // Shuffle students and select the first numStudents
      const shuffledStudents = [...createdStudents].sort(() => 0.5 - Math.random()).slice(0, numStudents);
      
      // For each selected student
      for (const student of shuffledStudents) {
        // For each test in this course (one per lesson)
        for (const test of courseTests) {
          // Students are more likely to complete earlier lessons
          const testIndex = courseTests.indexOf(test);
          const completionProbability = 1 - (testIndex * 0.08); // Decreasing probability for later lessons
          
          // Only create history if student "completed" this test based on probability
          if (Math.random() < completionProbability) {
            // Generate a random score between 0 and 10
            const score = faker.number.int({ min: 0, max: 10 });
            const passed = score >= 7; // Pass threshold of 7
            
            histories.push({
              studentId: student._id,
              testId: test._id,
              score,
              completedAt: faker.date.recent(30), // Within the last 30 days
              passed
            });
          }
        }
      }
    }
    
    await History.insertMany(histories);
    console.log('History records created: ', histories.length);
    
    // ===== CREATE RATINGS (5-15 students per course) =====
    console.log('Creating ratings...');
    
    const ratings = [];
    
    // For each course
    for (let courseIndex = 0; courseIndex < createdCourses.length; courseIndex++) {
      // Determine how many students will rate this course (5-15)
      const numRaters = faker.number.int({ min: 5, max: 15 });
      
      // Shuffle students and select the first numRaters
      const shuffledStudents = [...createdStudents].sort(() => 0.5 - Math.random()).slice(0, numRaters);
      
      // For each selected student
      for (const student of shuffledStudents) {
        // Generate a random rating between 3 and 5 stars (bias towards positive)
        const stars = faker.number.int({ min: 3, max: 5 });
        
        ratings.push({
          studentId: student._id,
          courseId: createdCourses[courseIndex]._id,
          stars,
          feedback: `This ${stars >= 4 ? 'excellent' : 'good'} course provided ${stars >= 4 ? 'valuable' : 'useful'} insights on ${createdCourses[courseIndex].infor}. ${stars === 5 ? 'Highly recommended!' : stars === 4 ? 'Would recommend to others.' : 'Has room for improvement but still worth taking.'}`
        });
      }
    }
    
    await Rating.insertMany(ratings);
    console.log('Rating records created: ', ratings.length);
    
    // ===== CREATE STUDENT LESSON PROGRESS =====
    console.log('Creating student lesson progress records...');
    
    const progressRecords = [];
    
    // For each history record (students who've taken tests)
    // Track which student-lesson pairs we've already processed to avoid duplicates
    const processedStudentLessonPairs = new Set();
    
    for (const history of histories) {
      // Find corresponding student
      const student = createdStudents.find(s => s._id.toString() === history.studentId.toString());
      
      if (student) {
        // Find corresponding test
        const test = createdTests.find(t => t._id.toString() === history.testId.toString());
        
        if (test) {
          // Find the specific lesson this test belongs to
          const lesson = createdLessons.find(l => l.idTest && l.idTest.toString() === test._id.toString());
          
          if (lesson) {
            // Create a unique key for this student-lesson pair
            const studentLessonKey = `${student._id.toString()}_${lesson._id.toString()}`;
            
            // Only process if we haven't seen this combination before
            if (!processedStudentLessonPairs.has(studentLessonKey)) {
              processedStudentLessonPairs.add(studentLessonKey);
              
              // Set appropriate status based on test result
              const status = history.passed ? 'completed' : 'in_progress';
              
              // Progress percentage based on status
              const progress = status === 'completed' ? 100 : 
                faker.number.int({ min: 50, max: 95 });
              
              // Generate dates based on status
              const startedAt = faker.date.recent(60); // Started within last 60 days
              const completedAt = status === 'completed' ? 
                new Date(startedAt.getTime() + (1000 * 60 * 60 * 24 * faker.number.int({ min: 1, max: 5 }))) : null;
              const lastAccessedAt = completedAt || faker.date.recent(10);
              
              // Create progress record for the specific lesson
              progressRecords.push({
                studentId: student._id,
                lessonId: lesson._id,
                status,
                progress,
                startedAt,
                completedAt,
                lastAccessedAt
              });
              
              // Find earlier lessons in the same course and mark them as completed
              const courseId = lesson.idCourse;
              const lessonTestIndex = createdLessons.findIndex(l => l._id.toString() === lesson._id.toString());
              const courseIndex = Math.floor(lessonTestIndex / 10);
              const lessonIndexInCourse = lessonTestIndex % 10;
              
              // Mark previous lessons as completed
              const earlierLessons = createdLessons.filter((l, index) => {
                const lCourseIndex = Math.floor(index / 10);
                const lLessonIndex = index % 10;
                return lCourseIndex === courseIndex && lLessonIndex < lessonIndexInCourse;
              });
              
              for (const earlierLesson of earlierLessons) {
                const earlierStudentLessonKey = `${student._id.toString()}_${earlierLesson._id.toString()}`;
                
                // Only add if we haven't processed this combination before
                if (!processedStudentLessonPairs.has(earlierStudentLessonKey)) {
                  processedStudentLessonPairs.add(earlierStudentLessonKey);
                  
                  progressRecords.push({
                    studentId: student._id,
                    lessonId: earlierLesson._id,
                    status: 'completed',
                    progress: 100,
                    startedAt: faker.date.recent(90),
                    completedAt: faker.date.recent(60),
                    lastAccessedAt: faker.date.recent(30)
                  });
                }
              }
            }
          }
        }
      }
    }
    
    await StudentLessonProgress.insertMany(progressRecords);
    console.log('Student lesson progress records created: ', progressRecords.length);
    
    // ===== CREATE BLOG RECORDS =====
    console.log('Creating blog records...');
    
    const blogs = [];
    
    // Create 5 blog records
    for (let i = 0; i < 5; i++) {
      const businessUser = businessUsers[i % businessUsers.length]; // Distribute evenly among business users
      
      // Create more meaningful English title and content
      const topics = ['JavaScript', 'Python', 'Web Development', 'Machine Learning', 'Career Growth'];
      const blogTitle = `Top 10 Tips for Mastering ${topics[i % topics.length]} in 2025`;
      const blogContent = `
        In today's rapidly evolving tech landscape, ${topics[i % topics.length]} continues to be a critical skill for developers.
        
        ${faker.commerce.productDescription()}
        
        ## Key Strategies for Success
        
        1. Practice consistently with real-world projects
        2. Join communities and participate in discussions
        3. Stay updated with the latest libraries and frameworks
        4. Contribute to open-source projects
        5. Read documentation thoroughly
        
        ${faker.commerce.productDescription()}
        
        Remember that mastery comes with time and dedication. Keep building and learning!
      `;
      
      // Log first blog to check language
      if (i === 0) {
        console.log('Sample Blog Title:', blogTitle);
        console.log('Sample Blog Content:', blogContent.substring(0, 100) + '...');
      }
      
      blogs.push({
        title: blogTitle,
        content: blogContent,
        image: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/blogs%2Fblog${i+1}.jpg?alt=media`,
        tags: [
          faker.helpers.arrayElement(['Technology', 'Programming', 'Education', 'Career']),
          faker.helpers.arrayElement(['Web', 'Mobile', 'AI', 'Cloud'])
        ],
        userId: businessUser._id,
        views: faker.number.int({ min: 50, max: 500 }),
        status: 'published'
      });
    }
    
    await Blog.insertMany(blogs);
    console.log('Blog records created: ', blogs.length);
    
    console.log('Database seeding completed successfully!');
    console.log('Summary:');
    console.log(`- Roles: ${roles.length}`);
    console.log(`- Languages: ${languages.length}`);
    console.log(`- Accounts: ${accounts.length} (${studentAccounts.length} students, ${businessAccounts.length} businesses)`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Students: ${createdStudents.length}`);
    console.log(`- Businesses: ${createdBusinesses.length}`);
    console.log(`- Courses: ${createdCourses.length}`);
    console.log(`- Lessons: ${createdLessons.length}`);
    console.log(`- Tests: ${createdTests.length}`);
    console.log(`- Questions: ${questions.length}`);
    console.log(`- History Records: ${histories.length}`);
    console.log(`- Rating Records: ${ratings.length}`);
    console.log(`- Student Lesson Progress Records: ${progressRecords.length}`);
    console.log(`- Blog Records: ${blogs.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
