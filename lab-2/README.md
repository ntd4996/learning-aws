# Yêu cầu: Lab 2: AWS Set up

Tạo tài khoản AWS, thêm người dùng, phân quyền cơ bản
Tạo EC2
Cấu hình web server (nginx hoặc apache) sau đó host 1 trang web tĩnh

---

## Hướng dẫn cài đặt EC2 instance trên AWS, thiết lập NGINX, và cấu hình SSL.

---

### Bước 1: Tạo tài khoản AWS và cấu hình IAM Role

1. **Đăng ký tài khoản AWS**:

   - Truy cập trang [AWS](https://aws.amazon.com/) để tạo tài khoản mới. Bạn cần cung cấp thông tin thanh toán nhưng sẽ có nhiều dịch vụ miễn phí (Free Tier) trong 12 tháng đầu.

2. **Tạo IAM Role với quyền `AmazonEC2FullAccess`**:

   - Sau khi tạo tài khoản, truy cập **AWS Management Console** và vào **IAM (Identity and Access Management)** để tạo một IAM Role.
   - Chọn quyền **`AmazonEC2FullAccess`**, giúp bạn quản lý các dịch vụ liên quan như EC2, CloudWatch, Auto Scaling, Elastic Load Balancing. Đây là những dịch vụ cần thiết để quản lý EC2 instances.

   **Lý do**: IAM Role này cung cấp quyền truy cập đầy đủ vào EC2, cho phép bạn thực hiện các thao tác quản lý instance mà không cần dùng quyền root (mức quyền cao nhất).

---

### Bước 2: Khởi tạo EC2 Instance

1. **Truy cập EC2 Dashboard**:

   - Từ AWS Console, đi tới **EC2 Dashboard** để bắt đầu tạo một instance (máy chủ ảo).

2. **Chọn AMI (Amazon Machine Image)**:

   - Chọn AMI là **Ubuntu** với chip ARM.
   - Phiên bản đề xuất là **Ubuntu 20.04** hoặc **22.04 LTS**.

   **Lý do**: Ubuntu là hệ điều hành phổ biến, hỗ trợ nhiều gói phần mềm và dễ dàng cho việc triển khai ứng dụng.

3. **Chọn Instance Type**:
   - Chọn loại instance **t2.micro**:
     - **1 vCPU** (1 lõi xử lý ảo).
     - **1GB RAM**.
     - **Lý do**: Đây là loại instance miễn phí (Free Tier), phù hợp cho các ứng dụng nhỏ và có chi phí thấp.

---

### Bước 3: Thiết lập Security Group cho EC2

1. **Tạo Security Group**:

   - Security Group là bộ quy tắc tường lửa bảo vệ EC2 instance của bạn.
   - Bạn cần mở các cổng sau:
     - **Port 22 (SSH)**: Kết nối qua SSH để quản trị máy chủ.
     - **Port 80 (HTTP)**: Cho phép truy cập website qua giao thức HTTP.
     - **Port 443 (HTTPS)**: Cho phép truy cập website qua giao thức HTTPS.

   **Lý do**: Các cổng này cần mở để bạn có thể truy cập và quản lý máy chủ từ xa, cũng như cho phép người dùng truy cập website của bạn.

---

### Bước 4: SSH vào EC2 Instance

1. **Kết nối SSH vào instance**:
   - Sau khi instance đã khởi tạo thành công, sử dụng lệnh sau để kết nối SSH từ máy tính cá nhân:
   ```bash
   ssh -i "path-to-your-private-key.pem" ubuntu@your-instance-public-ip
   ```
   - **Giải thích**:
     - `"path-to-your-private-key.pem"`: Là đường dẫn tới file khóa bảo mật (private key) mà bạn đã tải về khi tạo instance.
     - **`ubuntu`**: Tên người dùng mặc định cho các phiên bản Ubuntu trên AWS.
     - **`your-instance-public-ip`**: Địa chỉ IP công khai của instance (có thể tìm thấy trên AWS Console).

---

### Bước 5: Cài đặt NGINX

1. **Cập nhật hệ thống**:

   - Trước khi cài đặt phần mềm, bạn nên cập nhật hệ thống để đảm bảo có các gói phần mềm mới nhất:

   ```bash
   sudo apt update
   ```

2. **Cài đặt NGINX**:

   - Cài đặt NGINX bằng lệnh sau:

   ```bash
   sudo apt install nginx
   ```

   **Lý do**: NGINX là một web server hiệu quả, được sử dụng rộng rãi cho việc phục vụ các ứng dụng web, hỗ trợ cả HTTP và HTTPS.

---

### Bước 6: Cấu hình UFW (Uncomplicated Firewall)

1. **Kiểm tra trạng thái UFW**:

   - Kiểm tra xem tường lửa UFW đã được bật chưa:

   ```bash
   sudo ufw status
   ```

2. **Cho phép NGINX nhận kết nối**:

   - Nếu UFW đang được bật, cho phép kết nối qua các cổng HTTP và HTTPS của NGINX bằng lệnh sau:

   ```bash
   sudo ufw allow 'Nginx Full'
   ```

   **Lý do**: Quy tắc này cho phép truy cập qua cổng 80 và 443, giúp người dùng có thể truy cập website qua cả HTTP và HTTPS.

---

### Bước 7: Cấu hình NGINX cho HTTP trước khi thêm SSL

1. **Mở file cấu hình NGINX**:

   - Trước khi cấu hình SSL, bạn cần thiết lập cấu hình cơ bản cho NGINX để phục vụ trang web qua HTTP. Mở file cấu hình NGINX mặc định:

   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. **Thêm đoạn cấu hình sau**:

   ```bash
   server {
       listen 80;
       server_name aws.datnt.dev www.aws.datnt.dev;

       location /  {
           root /var/www/html/learning-aws/lab-2;
           index index.html index.htm;
           try_files $uri $uri/ =404;
       }
   }
   ```

   **Giải thích**:

   - **`listen 80;`**: Lắng nghe các yêu cầu trên cổng 80 (HTTP).
   - **`server_name aws.datnt.dev www.aws.datnt.dev;`**: Định nghĩa tên miền của server. Thay thế `aws.datnt.dev` bằng tên miền thực tế của bạn.
   - **`root /var/www/html/learning-aws/lab-2;`**: Định nghĩa đường dẫn thư mục gốc của website, nơi chứa các file HTML tĩnh.
   - **`try_files $uri $uri/ =404;`**: Kiểm tra xem file hoặc thư mục được yêu cầu có tồn tại không, nếu không, trả về lỗi 404.

3. **Kiểm tra cấu hình**:

   - Sau khi chỉnh sửa file cấu hình, kiểm tra xem cấu hình có chính xác không:

   ```bash
   sudo nginx -t
   ```

4. **Khởi động lại NGINX**:

   - Nếu không có lỗi, khởi động lại NGINX để áp dụng thay đổi:

   ```bash
   sudo systemctl restart nginx
   ```

   **Lý do**: Trước khi thêm SSL, bạn cần đảm bảo rằng trang web của bạn đã hoạt động ổn định qua HTTP.

---

### Bước 8: Cấu hình SSL cho NGINX

1. **Mở lại file cấu hình NGINX**:

   - Sau khi xác nhận trang web đã chạy trên HTTP, bạn thêm cấu hình SSL vào file cấu hình NGINX:

   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. **Thêm đoạn cấu hình sau để sử dụng SSL**:

   ```bash
   server {
       listen 443 ssl;
       server_name aws.datnt.dev www.aws.datnt.dev;

       ssl_certificate /etc/nginx/ssl/fullchain.pem;
       ssl_certificate_key /etc/nginx/ssl/privkey.pem;

       location /  {
           root /var/www/html/learning-aws/lab-2;
           index index.html index.htm;
           try_files $uri $uri/ =404;
       }
   }
   ```

   **Giải thích**:

   - **`listen 443 ssl;`**: Lắng nghe các yêu cầu HTTPS trên cổng 443.
   - **`ssl_certificate` và `ssl_certificate_key`**: Chỉ định vị trí của chứng chỉ SSL và khóa riêng.

3. **Redirect HTTP sang HTTPS**:

   - Thêm một server block nữa để chuyển hướng các kết nối HTTP sang HTTPS:

   ```bash
   server {
       listen 80;
       server_name aws.datnt.dev;
       return 301 https://$host$request_uri;
   }
   ```

   **Giải thích**: Phần này đảm bảo rằng mọi yêu cầu HTTP sẽ được tự động chuyển sang HTTPS.

---

### Bước 9: Tạo chứng chỉ SSL

1. **Tạo thư mục SSL**:

   - Tạo thư mục để chứa các tệp chứng chỉ SSL:

   ```bash
   sudo mkdir -p /etc/nginx/ssl
   ```

2. **Tạo file chứng chỉ và khóa**:

   - Mở file để dán nội dung chứng chỉ SSL:

   ```bash
   sudo nano /etc/nginx/ssl/fullchain.pem
   ```

   - Dán nội dung của chứng chỉ SSL vào file này.

   - Mở file khóa riêng:

   ```bash
   sudo nano /etc/nginx/ssl/privkey.pem
   ```

- Dán nội dung khóa riêng vào file này.

---

### Bước 10: Kiểm tra và khởi động lại NGINX

1. **Kiểm tra cấu hình NGINX**:

- Trước khi khởi động lại NGINX, kiểm tra lại cấu hình để đảm bảo không có lỗi cú pháp:

```bash
sudo nginx -t
```

2. **Khởi động lại NGINX**:

- Nếu mọi thứ đều ổn, khởi động lại NGINX:

```bash
sudo systemctl restart nginx
```

---

### Bước 11: Kiểm tra kết quả

1. **Kiểm tra trên trình duyệt**:
   - Mở trình duyệt và truy cập vào `https://aws.datnt.dev`. Nếu mọi thứ được cấu hình chính xác, trang web của bạn sẽ hoạt động trên HTTPS với SSL bảo mật.

---

Trên đây là toàn bộ quy trình từng bước, từ việc khởi tạo EC2 instance cho đến cài đặt NGINX và cấu hình SSL để trang web chạy an toàn qua HTTPS.
