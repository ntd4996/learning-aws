- Tạo tài khoản aws và Tạo IAM với quyền  `AmazonEC2FullAccess` bao gồm các quyền liên quan đến:
ec2, elasticloadbalancing, cloudwatch, autoscaling
- Tạo instance ec2 với AMI(Amazon Machine Image) là ubuntu  chip arm với instance type là:
t2.micro (1vCPU và 1G memory) chọn vì nó đang được free .
- Setting ``Security Groups`` cho nó có quyền truy cập qua PORT 80, 443, 22
- Sau khi cài đặt instance xong thì tiến hành ssh vào và cài đặt nginx
 ```bash
sudo apt install nginx
```
- Kiểm tra Uncomplicated Firewall
```bash
sudo ufw status
```
- Uncomplicated Firewall được bật thì cho truy cập qua máy chủ nginx 2 cổng 80 và 443
```bash
sudo ufw allow 'Nginx Full'
```
- khởi động nginx 
```bash
sudo systemctl enable nginx
```
- Chỉnh sửa file config cho nginx.
```bash
sudo nano /etc/nginx/sites-available/default
```
- Thêm nội dùng sau vào file; ``/etc/nginx/sites-available/default``
```bash
server {
    listen 80;
    server_name aws.datnt.dev;
    return 301 https://$host$request_uri;
}

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
- Tạo 2 file cho cài đặt ssl: ``/etc/nginx/ssl/fullchain.pem và /etc/nginx/ssl/privkey.pem``
- Source để tại thư mục : ``/var/www/html/learning-aws/lab-2``

- Kiểm tra xem file config đúng chưa 
```bash
sudo nginx -t 
```

- reload lại file config:```bash
  sudo systemctl restart nginx
```

- chạy trên trình duyệt để thấy kết quả: `https://aws.datnt.dev`