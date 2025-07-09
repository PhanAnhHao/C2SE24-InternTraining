Hướng dẫn cài đặt và chạy chương trình:
  Bước 1: Clone repository từ git.
    - Mở terminal và chạy lệnh sau để clone repository về máy:
      git clone <link repository>

  Bước 2: Tạo tệp .env trong thư mục server
    - Chuyển vào mục server và tạo một tệp mới tên là .env
    - sao chép nội dung dưới đây và dán vào tệp .env:

  Bước 3: Cài đặt dependencies cho server
    - Mở terminal, chuyển đến thư mục server:
        cd server
    - Cài đặt dependencies:
        npm install

  Bước 4: Cài đặt dependencies cho client
    - Mở một terminal mới, chuyển đến thư mục client:
        cd client
    - Cài đặt dependencies:
        npm install

  Bước 5: Chạy chương trình
    - Sau khi hoàn tất cài đặt ở bước 3 và bước 4
      + Trong terminal của server chạy lệnh:
          npm run dev
      + trong terminal của client chạy lệnh:
          npm run dev
Chú ý:
  - đảm bảo bạn đã cài đặt Node.js và npm trên máy trước khi thực hiện.
  - Nếu có lỗi xảy ra, vui lòng kiểm tra kết nối internet và tệp .env đã được cấu hình đúng hay chưa.
   
Hướng dẫn đăng nhập theo từng vai trò
1. Đăng nhập với vai trò học sinh(Student)
  - URL đăng nhập: http://localhost:5173/login
  - Tài khoản đăng nhập:
      Email: hocsinh
      Mật khẩu: 112233
2. Đăng nhập với vai trò doanh nghiệp
  - URL đăng nhập: http://localhost:5173/login
  - Tài khoản đăng nhập:
    Email: business
    Mật khẩu: 112233
3. Đăng nhập với vai trò Quản trị viên(Admin)
  - URL đăng nhập: http://localhost:5173/login
  - Tài khoản đăng nhập:
    Email: admin
    Mật khẩu: 112233

Lưu ý:
  - Đảm bảo hệ thống đã được chạy trên máy chủ và đúng địa chỉ URL của từng vai trò.
  - Nếu lỗi đăng nhập hãy kiểm tra lại email và mật khẩu.
