// seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb+srv://PhanAnhHao:anhhao1234567@clustertandinh.ass8o.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(uri)
  .then(() => console.log('✅ Đã kết nối MongoDB'))
  .catch(err => console.error('❌ Kết nối MongoDB thất bại:', err));

const ObjectId = mongoose.Types.ObjectId;

const Role = mongoose.model('Role', new mongoose.Schema({ name: String, description: String }));
const Account = mongoose.model('Account', new mongoose.Schema({ username: String, password: String, email: String, role: ObjectId }));
const User = mongoose.model('User', new mongoose.Schema({ userName: String, email: String, location: String, phone: String, account: ObjectId }));
const Student = mongoose.model('Student', new mongoose.Schema({ idStudent: String, age: Number, school: String, course: String, englishSkill: String, userId: ObjectId }));
const Business = mongoose.model('Business', new mongoose.Schema({ idBusiness: String, type: String, detail: String, userId: ObjectId }));
const Language = mongoose.model('Language', new mongoose.Schema({ languageId: String, name: String }));
const Course = mongoose.model('Course', new mongoose.Schema({ idCourse: String, info: String, languageID: ObjectId, rating: Number }));
const Lesson = mongoose.model('Lesson', new mongoose.Schema({ idLesson: String, idCourse: ObjectId, name: String, content: String, linkVideo: String, status: String, idTest: ObjectId }));
const Test = mongoose.model('Test', new mongoose.Schema({ idTest: String, idLesson: ObjectId, content: String, idQuestion: [ObjectId] }));
const Question = mongoose.model('Question', new mongoose.Schema({ idQuestion: String, idTest: ObjectId, question: String, answer: String }));

async function seed() {
  try {
    await mongoose.connection.dropDatabase();

    const roles = await Role.insertMany([
      { _id: new ObjectId('660edabc12eac0f2fc123401'), name: 'Admin', description: 'Quản trị hệ thống' },
      { _id: new ObjectId('660edabc12eac0f2fc123402'), name: 'Student', description: 'Thực tập sinh ngành CNTT' },
      { _id: new ObjectId('660edabc12eac0f2fc123403'), name: 'Business', description: 'Doanh nghiệp tuyển dụng' },
    ]);

    const accounts = await Account.insertMany([
      { _id: new ObjectId(), username: 'admin01', password: 'admin123', email: 'admin01@gmail.com', role: roles[0]._id },
      { _id: new ObjectId(), username: 'student01', password: 'student123', email: 'student01@gmail.com', role: roles[1]._id },
      { _id: new ObjectId(), username: 'student02', password: 'student456', email: 'student02@gmail.com', role: roles[1]._id },
      { _id: new ObjectId(), username: 'business01', password: 'business123', email: 'biz01@gmail.com', role: roles[2]._id },
      { _id: new ObjectId(), username: 'business02', password: 'business456', email: 'biz02@gmail.com', role: roles[2]._id },
    ]);

    const users = await User.insertMany([
      { userName: 'Lê Văn A', email: 'a@gmail.com', location: 'Hà Nội', phone: '0901111111', account: accounts[0]._id },
      { userName: 'Trần Thị B', email: 'b@gmail.com', location: 'Hồ Chí Minh', phone: '0902222222', account: accounts[1]._id },
      { userName: 'Phạm Văn C', email: 'c@gmail.com', location: 'Đà Nẵng', phone: '0903333333', account: accounts[2]._id },
      { userName: 'Nguyễn Văn D', email: 'd@gmail.com', location: 'Huế', phone: '0904444444', account: accounts[3]._id },
      { userName: 'Đặng Thị E', email: 'e@gmail.com', location: 'Cần Thơ', phone: '0905555555', account: accounts[4]._id },
    ]);

    await Student.insertMany([
      { idStudent: 'S1001', age: 20, school: 'ĐH Bách Khoa', course: 'Công nghệ phần mềm', englishSkill: 'Intermediate', userId: users[1]._id },
      { idStudent: 'S1002', age: 21, school: 'ĐH Công nghệ', course: 'Hệ thống thông tin', englishSkill: 'Fluent', userId: users[2]._id },
    ]);

    await Business.insertMany([
      { idBusiness: 'B1001', type: 'Công nghệ', detail: 'Công ty phần mềm tuyển thực tập sinh web', userId: users[3]._id },
      { idBusiness: 'B1002', type: 'Giáo dục', detail: 'Doanh nghiệp đào tạo lập trình viên', userId: users[4]._id },
    ]);

    const languages = await Language.insertMany([
      { _id: new ObjectId(), languageId: 'JS', name: 'JavaScript' },
      { _id: new ObjectId(), languageId: 'PY', name: 'Python' },
      { _id: new ObjectId(), languageId: 'JAVA', name: 'Java' },
      { _id: new ObjectId(), languageId: 'C#', name: 'C Sharp' },
      { _id: new ObjectId(), languageId: 'HTML', name: 'HTML/CSS' },
    ]);

    const courses = await Course.insertMany([
      { _id: new ObjectId(), idCourse: 'C001', info: 'Lập trình frontend với JavaScript', languageID: languages[0]._id, rating: 4.5 },
      { _id: new ObjectId(), idCourse: 'C002', info: 'Lập trình Python cho AI cơ bản', languageID: languages[1]._id, rating: 4.7 },
      { _id: new ObjectId(), idCourse: 'C003', info: 'OOP với Java', languageID: languages[2]._id, rating: 4.3 },
      { _id: new ObjectId(), idCourse: 'C004', info: 'Phát triển ứng dụng với C#', languageID: languages[3]._id, rating: 4.6 },
      { _id: new ObjectId(), idCourse: 'C005', info: 'Thiết kế web với HTML/CSS', languageID: languages[4]._id, rating: 4.4 },
    ]);

    const testIds = Array.from({ length: 10 }, () => new ObjectId());
    const lessonIds = Array.from({ length: 10 }, () => new ObjectId());
    const questionIds = Array.from({ length: 10 }, () => new ObjectId());

    const tests = await Test.insertMany([
      { _id: testIds[0], idTest: 'JS101', idLesson: lessonIds[0], content: 'Kiểm tra kiến thức cơ bản về biến trong JS', idQuestion: [] },
      { _id: testIds[1], idTest: 'PY101', idLesson: lessonIds[1], content: 'Kiểm tra kiến thức về hàm và module trong Python', idQuestion: [] },
      { _id: testIds[2], idTest: 'JAVA101', idLesson: lessonIds[2], content: 'Kiểm tra kiến thức OOP trong Java', idQuestion: [] },
      { _id: testIds[3], idTest: 'HTML101', idLesson: lessonIds[3], content: 'Kiểm tra kiến thức thẻ HTML cơ bản', idQuestion: [] },
      { _id: testIds[4], idTest: 'C#101', idLesson: lessonIds[4], content: 'Kiểm tra kiến thức cơ bản C#', idQuestion: [] },
      { _id: testIds[5], idTest: 'JS201', idLesson: lessonIds[5], content: 'Kiểm tra vòng lặp và điều kiện trong JS', idQuestion: [] },
      { _id: testIds[6], idTest: 'PY201', idLesson: lessonIds[6], content: 'Kiểm tra cấu trúc điều khiển trong Python', idQuestion: [] },
      { _id: testIds[7], idTest: 'JAVA201', idLesson: lessonIds[7], content: 'Kiểm tra kế thừa và đa hình trong Java', idQuestion: [] },
      { _id: testIds[8], idTest: 'HTML201', idLesson: lessonIds[8], content: 'Kiểm tra CSS cơ bản cho HTML', idQuestion: [] },
      { _id: testIds[9], idTest: 'C#201', idLesson: lessonIds[9], content: 'Kiểm tra biến, hàm và class trong C#', idQuestion: [] },
    ]);

    const lessons = await Lesson.insertMany([
      { _id: lessonIds[0], idLesson: 'L001', idCourse: courses[0]._id, name: 'Khai báo biến trong JavaScript', content: 'let, const, var là gì và khi nào dùng', linkVideo: 'https://youtu.be/js-vars', status: 'published', idTest: testIds[0] },
      { _id: lessonIds[1], idLesson: 'L002', idCourse: courses[1]._id, name: 'Hàm và module trong Python', content: 'def, import và cấu trúc module', linkVideo: 'https://youtu.be/py-functions', status: 'published', idTest: testIds[1] },
      { _id: lessonIds[2], idLesson: 'L003', idCourse: courses[2]._id, name: 'Lập trình hướng đối tượng với Java', content: 'class, object, inheritance, polymorphism', linkVideo: 'https://youtu.be/java-oop', status: 'published', idTest: testIds[2] },
      { _id: lessonIds[3], idLesson: 'L004', idCourse: courses[4]._id, name: 'Các thẻ HTML cơ bản', content: 'html, head, body, div, p, h1-h6', linkVideo: 'https://youtu.be/html-tags', status: 'published', idTest: testIds[3] },
      { _id: lessonIds[4], idLesson: 'L005', idCourse: courses[3]._id, name: 'Biến và kiểu dữ liệu trong C#', content: 'string, int, bool, var, dynamic', linkVideo: 'https://youtu.be/csharp-vars', status: 'published', idTest: testIds[4] },
      { _id: lessonIds[5], idLesson: 'L006', idCourse: courses[0]._id, name: 'Cấu trúc điều kiện và vòng lặp trong JS', content: 'if, else, for, while, do-while', linkVideo: 'https://youtu.be/js-loops', status: 'published', idTest: testIds[5] },
      { _id: lessonIds[6], idLesson: 'L007', idCourse: courses[1]._id, name: 'Điều kiện và vòng lặp trong Python', content: 'if-elif-else, for, while', linkVideo: 'https://youtu.be/py-control', status: 'published', idTest: testIds[6] },
      { _id: lessonIds[7], idLesson: 'L008', idCourse: courses[2]._id, name: 'Kế thừa và đa hình trong Java', content: 'extends, override, interface', linkVideo: 'https://youtu.be/java-inheritance', status: 'published', idTest: testIds[7] },
      { _id: lessonIds[8], idLesson: 'L009', idCourse: courses[4]._id, name: 'Giới thiệu CSS cơ bản', content: 'selector, color, font-size, box model', linkVideo: 'https://youtu.be/css-basics', status: 'published', idTest: testIds[8] },
      { _id: lessonIds[9], idLesson: 'L010', idCourse: courses[3]._id, name: 'Class và phương thức trong C#', content: 'Tạo class, constructor, method', linkVideo: 'https://youtu.be/csharp-class', status: 'published', idTest: testIds[9] },
    ]);

    const questions = await Question.insertMany([
      { _id: questionIds[0], idQuestion: 'Q001', idTest: testIds[0], question: 'Từ khóa nào dùng để khai báo biến không đổi trong JavaScript?', answer: 'const' },
      { _id: questionIds[1], idQuestion: 'Q002', idTest: testIds[1], question: 'Câu lệnh nào dùng để định nghĩa hàm trong Python?', answer: 'def' },
      { _id: questionIds[2], idQuestion: 'Q003', idTest: testIds[2], question: 'Trong Java, tính đa hình là gì?', answer: 'Khả năng đối tượng phản hồi khác nhau cho cùng 1 phương thức' },
      { _id: questionIds[3], idQuestion: 'Q004', idTest: testIds[3], question: 'Thẻ HTML nào dùng để hiển thị tiêu đề lớn nhất?', answer: '<h1>' },
      { _id: questionIds[4], idQuestion: 'Q005', idTest: testIds[4], question: 'Kiểu dữ liệu nào lưu chuỗi ký tự trong C#?', answer: 'string' },
      { _id: questionIds[5], idQuestion: 'Q006', idTest: testIds[5], question: 'Lệnh nào lặp cho đến khi điều kiện sai trong JavaScript?', answer: 'while' },
      { _id: questionIds[6], idQuestion: 'Q007', idTest: testIds[6], question: 'Cấu trúc điều kiện nào phổ biến nhất trong Python?', answer: 'if-elif-else' },
      { _id: questionIds[7], idQuestion: 'Q008', idTest: testIds[7], question: 'Từ khóa nào dùng để kế thừa lớp trong Java?', answer: 'extends' },
      { _id: questionIds[8], idQuestion: 'Q009', idTest: testIds[8], question: 'Thuộc tính CSS nào thay đổi màu chữ?', answer: 'color' },
      { _id: questionIds[9], idQuestion: 'Q010', idTest: testIds[9], question: 'Từ khóa tạo phương thức trong class C# là gì?', answer: 'void hoặc kiểu trả về khác' },
    ]);

    for (let i = 0; i < testIds.length; i++) {
      await Test.findByIdAndUpdate(testIds[i], { idQuestion: [questionIds[i]] });
    }

    console.log('✅ Seed Intern Training Data thành công!');
    process.exit();
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

seed();
