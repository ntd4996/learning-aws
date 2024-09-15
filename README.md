# Requirement: Tạo 1 cron job chạy mỗi 10p sử dụng bash shell script. Job có nhiệm vụ tạo ra 5 file với nội dung là 1 chuỗi bất kì gồm 32 ký tự.

## I. Cài đặt và chạy tự động

### 1. Tạo thư mục dự án

```bash
mkdir ubuntu-cron-job-auto
cd ubuntu-cron-job-auto
```

_Giải thích câu lệnh_

- `mkdir` (make directory): được sử dụng để tạo mới các thư mục
- `cd` (change directory): được ứng dụng trong việc di chuyển các thư mục. Dòng lệnh cho phép bạn điều hướng hệ thống file và truy cập giữa các file và thư mục khác nhau

---

### 2. Tạo `Dockerfile`

Tạo file `Dockerfile` bằng lệnh:

```bash
touch Dockerfile
```

_Giải thích câu lệnh_

- `touch`: được dùng để cập nhật thời gian truy cập (access time) hoặc thời gian sửa đổi (modification time) của một file mà không làm thay đổi nội dung trong file đó. Đặc biệt, nếu file chưa tồn tại, lệnh touch sẽ tự động tạo ra file đó.

Mở file Dockerfile và thêm các dòng sau:

```bash
# Sử dụng Ubuntu image từ Docker Hub
FROM ubuntu:latest

# Cập nhật danh sách package và cài đặt các gói cần thiết: cron và bash
RUN apt-get update && apt-get install -y cron bash vim

# Tạo thư mục /scripts để chứa script
RUN mkdir /scripts

# Sao chép file bash script từ máy host vào container
COPY create_random_files.sh /scripts/create_random_files.sh

# Cấp quyền thực thi cho script
RUN chmod +x /scripts/create_random_files.sh

# Thêm cron job vào crontab của người dùng root
RUN (crontab -l 2>/dev/null; echo "*/1 * * * * /scripts/create_random_files.sh") | crontab -

# Chạy script ngay lập tức và sau đó khởi động cron và giữ cho container chạy bằng cách sử dụng 'tail -f /dev/null'
CMD /scripts/create_random_files.sh && cron && tail -f /dev/null


```

_Giải thích thư viện và câu lệnh_

- `FROM ubuntu`: Dòng này tải image Ubuntu mới nhất từ Docker Hub làm nền tảng cho container.

- `RUN apt-get update && apt-get install -y cron bash vim`: Cập nhật danh sách gói và cài đặt hai gói cần thiết là cron để chạy cron job, bash và vim để chạy script.

- `cron`:

  - Cron là một tiện ích giúp lập lịch chạy những dòng lệnh bên phía server để thực thi một hoặc nhiều công việc nào đó theo thời gian được lập sẵn. Một số người gọi những công việc đó là Cron job hoặc Cron task.

  - Cron là một chương trình deamon, tức là nó được chạy ngầm mãi mãi một khi nó được khởi động lên. Như các deamon khác thì bạn cần khởi động lại nó nếu như có thay đổi thiết lập gì đó. Chương trình này nhìn vào file thiết lập có tên là crontab để thực thi những task được mô tả ở bên trong.

- `bash`:

  - Bash (Bourne-Again SHell) là giao diện dòng lệnh (CLI) mặc định mà bạn sẽ sử dụng trong hầu hết các bản phân phối Linux. Đó là trình thông dịch được sử dụng trong Terminal. Bạn có thể sử dụng nó để cài đặt ứng dụng, chạy các chương trình dòng lệnh và thêm chức năng mới thông qua script.

  - Shell script cho phép thực hiện mọi việc trong Bash có thể thực hiện với các ngôn ngữ lập trình cơ bản khác, tất cả đều có quyền truy cập thuận tiện vào hệ điều hành và file của bạn. Các lệnh trong Terminal thường là những đoạn script rất đơn giản. Bạn có thể đưa việc sử dụng Terminal lên một tầm cao mới bằng cách viết các script Bash riêng.

- `vim`: là một trình soạn thảo văn bản

  Câu lệnh sau:

- `COPY create_random_files.sh /scripts/create_random_files.sh`

  1. **`COPY`**: Đây là một lệnh trong Dockerfile dùng để sao chép tệp hoặc thư mục từ máy host (máy cục bộ nơi Docker đang chạy) vào Docker image.

  2. **`create_random_files.sh`**: Đây là tệp shell script (tệp `.sh`) từ máy host mà bạn muốn sao chép. Tệp này có thể nằm ở thư mục hiện tại (thư mục gốc của dự án nơi Dockerfile đang được build).

  3. **`/scripts/create_random_files.sh`**: Đây là đích đến trong Docker container, nơi bạn muốn sao chép tệp. `/scripts/` là một thư mục bên trong Docker image, và bạn đang sao chép tệp `create_random_files.sh` vào thư mục này.

  #### Ý nghĩa tổng thể:

  Lệnh này sao chép tệp `create_random_files.sh` từ máy cục bộ vào thư mục `/scripts/` trong Docker image khi image được build. Sau đó, bạn có thể thực thi file này trong container (như đã cấp quyền thực thi trong câu lệnh trước).

- `RUN chmod +x /scripts/create_random_files.sh`

  1. **`RUN`**: Là một lệnh trong Dockerfile dùng để thực thi một lệnh trong quá trình build image Docker. Kết quả của lệnh sẽ được lưu vào image.

  2. **`chmod +x`**: Lệnh `chmod` được sử dụng để thay đổi quyền truy cập của một tệp. `+x` là tùy chọn để thêm quyền "thực thi" (execute). Cụ thể, lệnh này cho phép file được chỉ định có thể chạy như một chương trình hoặc script.

  3. **`/scripts/create_random_files.sh`**: Đây là đường dẫn đến một tệp script `.sh` (shell script). Lệnh này đang thiết lập cho file này có thể được thực thi.

  #### Ý nghĩa tổng thể:

  Lệnh này đảm bảo rằng tệp script `/scripts/create_random_files.sh` có quyền thực thi và có thể được chạy trong quá trình build của Docker image.

- `RUN (crontab -l 2>/dev/null; echo "*/1 * * * * /scripts/create_random_files.sh") | crontab -`

  1. **`RUN`**: Lệnh để thực thi các câu lệnh trong quá trình build Docker image.

  2. **`(crontab -l 2>/dev/null; echo "*/1 * * * * /scripts/create_random_files.sh")`**:

  - **`crontab -l`**: Lệnh này hiển thị các cron jobs hiện tại của người dùng.
  - **`2>/dev/null`**: Chuyển hướng thông báo lỗi (nếu không có cron job nào) vào `/dev/null`, để ngăn không hiển thị lỗi nếu crontab trống.
  - **`echo "*/1 * * * * /scripts/create_random_files.sh"`**: Thêm dòng này vào danh sách các cron jobs hiện có. Đây là một cron job được đặt để chạy script `/scripts/create_random_files.sh` mỗi phút.

  3. **`| crontab -`**: Dùng để ghi đè hoặc thêm cron job vào danh sách cron job của người dùng. Dấu `-` chỉ định rằng crontab sẽ đọc từ đầu vào tiêu chuẩn (output từ lệnh `echo`).

  #### Ý nghĩa tổng thể:

  Lệnh này sẽ thêm một cron job vào crontab mà không làm mất đi các cron jobs hiện có. Cron job này được thiết lập để chạy script `/scripts/create_random_files.sh` mỗi phút.

- `CMD /scripts/create_random_files.sh && cron && tail -f /dev/null`

  1. **`CMD`**: Dùng trong Dockerfile để chỉ định lệnh được thực thi khi container khởi động. Chỉ có thể có một lệnh `CMD` trong Dockerfile, và nếu có nhiều lệnh, chỉ lệnh cuối cùng sẽ được thực thi.

  2. **`/scripts/create_random_files.sh`**: Đây là lệnh đầu tiên được chạy trong container. Nó sẽ thực thi script `/scripts/create_random_files.sh`, có thể là một script để tạo ra 5 file chứa chuỗi ký tự ngẫu nhiên như bạn đã mô tả.

  3. **`&&`**: Toán tử logic nối các lệnh. Lệnh tiếp theo (`cron`) chỉ chạy nếu lệnh trước đó (`/scripts/create_random_files.sh`) thành công.

  4. **`cron`**: Khởi động **cron daemon** để quản lý các cron jobs đã được thiết lập. Cron sẽ chạy các tác vụ định kỳ trong nền.

  5. **`tail -f /dev/null`**: Giữ container hoạt động bằng cách chạy `tail -f /dev/null`, lệnh này theo dõi file `/dev/null` và không bao giờ kết thúc. Điều này giúp container không bị dừng ngay sau khi khởi động cron, vì `cron` chạy dưới dạng service nền và không giữ container ở trạng thái chạy foreground.

  #### Ý nghĩa tổng thể:

  1. Thực thi script `create_random_files.sh` khi container khởi động.
  2. Khởi động cron daemon để thực hiện các cron jobs.
  3. Giữ cho container tiếp tục chạy bằng cách sử dụng lệnh `tail -f /dev/null`.

  Tuy nhiên, việc chạy script ngay lập tức và cron cùng nhau có thể gây ra sự chồng chéo nếu cron cũng được thiết lập để chạy script đó. Cần kiểm tra sự hợp lý của quy trình này.

---

### 3. Tạo Bash Script

Tạo file `create_random_files.sh`:

```bash
touch create_random_files.sh
```

Thêm nội dung sau vào file `create_random_files.sh`:

```bash
#!/bin/bash

# Vòng lặp để tạo 5 file với chuỗi ngẫu nhiên
for i in {1..5}
do
  filename="file_$i.txt"
  # Tạo chuỗi ngẫu nhiên 32 ký tự sử dụng /dev/urandom và tr để loại bỏ các ký tự không mong muốn
  random_string=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  # Ghi chuỗi ngẫu nhiên vào file
  echo $random_string > "/scripts/$filename"
done
```

#### Giải thích các dòng trong `create_random_files.sh`:

1. **for i in {1..5}**  
   Đây là một vòng lặp sẽ chạy 5 lần để tạo ra 5 file.
2. **filename="file\_$i.txt"**  
   Tạo tên file từ số thứ tự của vòng lặp (ví dụ: `file_1.txt`, `file_2.txt`,...).
3. **random_string=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)**  
   Dòng này sử dụng `/dev/urandom` để tạo chuỗi ngẫu nhiên gồm 32 ký tự chỉ chứa các chữ cái và số.
4. **echo $random_string > "/scripts/$filename"**  
   Ghi chuỗi ngẫu nhiên vừa tạo vào file có tên tương ứng.

### 4. Build Docker Image

Khi bạn đã tạo `Dockerfile` và `create_random_files.sh`, bạn có thể build Docker image bằng lệnh:

```bash
docker build -t ubuntu-cron-job-auto .
```

Lệnh này sẽ tạo một image tên là `ubuntu-cron-job` dựa trên các chỉ dẫn trong `Dockerfile`.

### 5. Chạy Docker Container

Sau khi build xong, bạn có thể chạy container từ image vừa tạo:

```bash
docker run -d --name my-ubuntu-cron-auto ubuntu-cron-job-auto
```

- **-d**: Chạy container trong chế độ detached (chạy ngầm).
- **--name my-ubuntu-cron-auto**: Đặt tên cho container là `my-ubuntu-cron-auto`.

### 6. Kiểm tra các file được tạo

Bạn có thể kiểm tra các file được tạo bởi cron job trong container bằng cách truy cập vào container:

```bash
docker exec -it my-ubuntu-cron-auto bash
```

Sau đó kiểm tra thư mục `/scripts`:

```bash
ls /scripts
cat /scripts/file_1.txt
```

### Tóm lại, toàn bộ quá trình từ đầu đến cuối bao gồm:

1. Tạo thư mục làm việc: `ubuntu-cron-job-auto`.
2. Tạo file `Dockerfile` và nội dung.
3. Tạo file `create_random_files.sh` để tạo các file ngẫu nhiên.
4. Build Docker image bằng lệnh `docker build`.
5. Chạy container bằng lệnh `docker run`.
6. Kiểm tra kết quả bằng cách vào container và xem các file trong thư mục `/scripts`.

---

## II. Cài đặt và chạy thủ công

### 1. Tạo thư mục dự án

```bash
mkdir ubuntu-cron-job-manual
cd ubuntu-cron-job-manual
```

_Giải thích câu lệnh_

- `mkdir` (make directory): được sử dụng để tạo mới các thư mục
- `cd` (change directory): được ứng dụng trong việc di chuyển các thư mục. Dòng lệnh cho phép bạn điều hướng hệ thống file và truy cập giữa các file và thư mục khác nhau

---

### 2. Tạo `Dockerfile`

Tạo file `Dockerfile` bằng lệnh:

```bash
touch Dockerfile
```

_Giải thích câu lệnh_

- `touch`: được dùng để cập nhật thời gian truy cập (access time) hoặc thời gian sửa đổi (modification time) của một file mà không làm thay đổi nội dung trong file đó. Đặc biệt, nếu file chưa tồn tại, lệnh touch sẽ tự động tạo ra file đó.

Mở file Dockerfile và thêm các dòng sau:

```bash
# Sử dụng Ubuntu làm image nền
FROM ubuntu:latest

# Cập nhật các gói và cài đặt cron, bash
RUN apt-get update && apt-get install -y cron bash vim

# Đảm bảo cron có thể chạy trong container
CMD cron -f

```

_Giải thích thư viện và câu lệnh_

- `FROM ubuntu`: Dòng này tải image Ubuntu mới nhất từ Docker Hub làm nền tảng cho container.

- `RUN apt-get update && apt-get install -y cron bash`: Cập nhật danh sách gói và cài đặt cron để hỗ trợ chạy các tác vụ định kỳ và bash để sử dụng các shell script.

- `CMD cron -f`: Thiết lập để khởi động cron trong chế độ foreground khi container khởi động.

---

### 3.Build và chạy Docker container

Sau khi có Dockerfile, sử dụng các lệnh sau trong terminal để build và chạy container:

```bash
# Build Docker image từ Dockerfile
docker build -t ubuntu-cron-manual .

# Chạy container với quyền tương tác để truy cập vào shell
docker run -it ubuntu-cron-manual /bin/bash

```

_Giải thích thư viện và câu lệnh_

- `docker build -t ubuntu-cron-manual .`: Build Docker image với tên ubuntu-cron-manual.

- `docker run -it ubuntu-cron-manual /bin/bash`: Chạy container và truy cập vào terminal của container (với bash shell).

---

### 4.Tạo shell script bên trong container

Khi đã truy cập vào container Ubuntu, có thể tạo shell script để thực hiện tác vụ yêu cầu. Trong container, tạo một file shell script để tạo 5 file chứa chuỗi ký tự ngẫu nhiên:

```bash
# Tạo file script
vi /usr/local/bin/generate_files.sh
```

Nội dung của file `generate_files.sh`:

```bash
#!/bin/bash

# Đường dẫn lưu file
DIRECTORY="/tmp/random_files"

# Tạo thư mục nếu chưa tồn tại
mkdir -p $DIRECTORY

# Vòng lặp tạo 5 file
for i in {1..5}
do
  # Tạo chuỗi ngẫu nhiên 32 ký tự
  RANDOM_STRING=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

  # Ghi chuỗi ngẫu nhiên vào file
  echo $RANDOM_STRING > "$DIRECTORY/file_$i.txt"
done

```

Sau đó, lưu và thoát khỏi trình soạn thảo.

Chạy lệnh sau để cấp quyền thực thi cho script:

```bash
chmod +x /usr/local/bin/generate_files.sh
```

_Giải thích thư viện và câu lệnh_

- `/dev/urandom`: Tạo chuỗi ngẫu nhiên từ nguồn ngẫu nhiên.

- `tr -dc 'a-zA-Z0-9'`: Lọc ra các ký tự chữ và số.

- `fold -w 32`: Giới hạn chuỗi ngẫu nhiên thành 32 ký tự.

- `echo $RANDOM_STRING > "file_$i.txt"`: Ghi chuỗi ngẫu nhiên vào file.

---

### 5. Tạo cron job để chạy mỗi 10 phút

Tiếp theo, cần tạo cron job để chạy shell script mỗi 10 phút. Mở file cấu hình cron bằng lệnh sau:

```bash
crontab -e
```

Thêm dòng sau vào file:

```bash
*/10 * * * * /usr/local/bin/generate_files.sh
```

_Giải thích thư viện và câu lệnh_

`*/10 * * * *`: Biểu thức để chạy mỗi 10 phút.
`/usr/local/bin/generate_files.sh`: Đường dẫn tới file shell script sẽ được thực thi.

### 6. Khởi động cron trong container

Cron sẽ tự động chạy trong container sau khi thiết lập. Có thể kiểm tra các job cron đang hoạt động bằng lệnh:

```bash
ps aux | grep cron
```

_Giải thích thư viện và câu lệnh_

1. **`ps aux`**: Hiển thị thông tin về tất cả các tiến trình đang chạy trên hệ thống.

   - `a`: Hiển thị tất cả các tiến trình của người dùng khác và không gắn với terminal.
   - `u`: Hiển thị thông tin chi tiết về người dùng, CPU, và bộ nhớ cho các tiến trình.
   - `x`: Bao gồm các tiến trình không gắn với terminal (background processes).

2. **`| grep cron`**: Bộ lọc kết quả của lệnh `ps aux` để chỉ hiển thị những tiến trình có chứa từ "cron".

### Mục đích:

Lệnh này sẽ hiển thị các tiến trình liên quan đến `cron`, cho biết liệu dịch vụ cron có đang chạy hay không trên hệ thống hoặc container.

---

### Tóm tắt:

- Tạo Dockerfile để khởi chạy container Ubuntu với cron.

- Truy cập container bằng lệnh docker run.

- Tạo shell script để tạo 5 file chứa chuỗi ký tự ngẫu nhiên.

- Thiết lập cron job để chạy script mỗi 10 phút.

---

## Tìm hiểu thêm về các câu lệnh: Truy cập vào website để tham khảo

[https://explainshell.com/](https://explainshell.com/)
