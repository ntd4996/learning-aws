# Giới thiệu về Docker, Dockerfile và Docker Compose

**Docker** là một nền tảng mã nguồn mở cho phép lập trình viên phát triển, vận chuyển, và chạy ứng dụng trong các **container**. Container là các gói nhỏ gọn chứa mọi thứ cần thiết để chạy ứng dụng, bao gồm mã nguồn, thư viện và các phụ thuộc. Docker giúp đảm bảo rằng ứng dụng chạy nhất quán trên các môi trường khác nhau (ví dụ như từ môi trường phát triển trên máy local đến môi trường production).

**Dockerfile** là một file cấu hình chứa các lệnh cần thiết để Docker xây dựng một image. Trong file Dockerfile, bạn định nghĩa cách cài đặt các phụ thuộc, sao chép mã nguồn, build, và khởi động ứng dụng. Từ đó, Docker sử dụng Dockerfile để tạo ra image chứa mọi thứ ứng dụng cần để chạy.

**Docker Compose** là một công cụ giúp dễ dàng định nghĩa và quản lý nhiều container cùng một lúc. Thay vì phải chạy từng container riêng lẻ với các lệnh phức tạp, Docker Compose cho phép bạn sử dụng một file `docker-compose.yml` để cấu hình và khởi chạy toàn bộ hệ thống ứng dụng (ví dụ, frontend, backend và database) bằng một lệnh duy nhất.

### Lợi ích của Docker

1. **Đồng nhất môi trường**: Docker container đóng gói mọi thứ cần thiết để chạy ứng dụng, từ mã nguồn đến các thư viện phụ thuộc. Điều này đảm bảo ứng dụng sẽ hoạt động tương tự trên máy tính local, server staging, và server production mà không cần lo lắng về sự khác biệt môi trường.
  
2. **Dễ dàng triển khai**: Docker giúp cho việc triển khai ứng dụng lên nhiều môi trường khác nhau trở nên nhanh chóng và đáng tin cậy. Bạn có thể đóng gói và triển khai container ở bất kỳ đâu có cài Docker.

3. **Isolated Dependencies (Phụ thuộc cô lập)**: Mỗi container có môi trường độc lập, do đó các ứng dụng trong các container khác nhau có thể sử dụng các phiên bản thư viện hoặc công cụ khác nhau mà không xảy ra xung đột.

4. **Khả năng mở rộng**: Docker cho phép dễ dàng mở rộng các ứng dụng bằng cách triển khai nhiều instance (phiên bản) của cùng một container và quản lý chúng bằng các công cụ như Kubernetes hoặc Docker Swarm.

5. **Tiết kiệm tài nguyên**: So với máy ảo (VM), Docker sử dụng tài nguyên hệ thống hiệu quả hơn vì nó chia sẻ kernel (nhân hệ điều hành) với hệ thống host, giúp giảm mức tiêu thụ tài nguyên.

### Điểm bất lợi của Docker

1. **Bảo mật**: Do Docker sử dụng chung kernel với hệ điều hành host, nên nếu một container bị xâm phạm, có thể xảy ra nguy cơ rò rỉ hoặc tấn công từ container này sang hệ thống host.

2. **Quản lý phức tạp**: Mặc dù Docker giúp triển khai và quản lý ứng dụng dễ dàng hơn, việc quản lý nhiều container, cấu hình mạng, và volume có thể trở nên phức tạp, đặc biệt khi số lượng dịch vụ tăng.

3. **Hiệu suất**: Docker chạy với hiệu suất tốt hơn so với máy ảo, nhưng với những ứng dụng yêu cầu tài nguyên lớn hoặc có tính phụ thuộc phức tạp (ví dụ như các ứng dụng phụ thuộc vào các drivers hoặc kernel modules), Docker có thể gặp một số hạn chế về hiệu suất so với việc chạy trực tiếp trên hệ điều hành.

4. **Đòi hỏi kiến thức mới**: Sử dụng Docker yêu cầu lập trình viên học thêm về cách sử dụng container, Dockerfile, Docker Compose, và các công cụ liên quan, điều này có thể là rào cản cho những người mới bắt đầu.

### Tại sao khi đẩy lên môi trường production phải **build** mà không chạy `run dev`?

Khi đẩy ứng dụng lên môi trường production, việc **build** ứng dụng thay vì chạy trong chế độ **dev** (phát triển) là cực kỳ quan trọng vì những lý do sau:

1. **Tối ưu hiệu suất**: Ở chế độ `dev`, ứng dụng thường được chạy với các công cụ hỗ trợ lập trình viên như hot-reloading, detailed logging, và debugging tools. Những tính năng này tiêu tốn tài nguyên không cần thiết trong môi trường production và có thể làm chậm ứng dụng. Trong chế độ **production**, các công cụ này được tắt, và mã nguồn thường được tối ưu hóa để chạy nhanh hơn.

2. **Bảo mật**: Ở chế độ `dev`, các thông tin nhạy cảm như debug logs hoặc stack traces có thể được hiển thị để giúp lập trình viên phát hiện lỗi. Tuy nhiên, những thông tin này không nên có trong môi trường production vì có thể bị kẻ xấu khai thác.

3. **Kích thước file nhỏ gọn hơn**: Trong quá trình **build**, mã nguồn có thể được minify (giảm kích thước), loại bỏ những đoạn code không cần thiết như comments và debug code. Điều này giúp giảm dung lượng của ứng dụng, tăng tốc độ tải trang và giảm băng thông.

4. **Stability (Tính ổn định)**: Ở chế độ production, ứng dụng đã được build và kiểm thử, đảm bảo tính ổn định khi vận hành. Trong khi đó, chế độ dev thường dùng cho việc phát triển và thử nghiệm, do đó không đảm bảo tính ổn định và có thể gây ra lỗi hoặc hành vi không mong muốn.

5. **Quản lý tài nguyên**: Khi chạy ứng dụng ở chế độ dev, ứng dụng có thể không được tối ưu để sử dụng tài nguyên một cách hiệu quả. Việc build và chạy ở chế độ production giúp ứng dụng sử dụng tài nguyên một cách hiệu quả hơn, giảm thiểu mức tiêu thụ CPU, RAM và các tài nguyên hệ thống khác.

### Kết luận

Sử dụng Docker và Docker Compose giúp đơn giản hóa quy trình phát triển, đóng gói và triển khai ứng dụng, đồng thời đảm bảo tính đồng nhất giữa các môi trường khác nhau. Tuy nhiên, Docker cũng có một số hạn chế, và việc build ứng dụng trước khi triển khai lên môi trường production là cần thiết để đảm bảo hiệu suất, bảo mật và tính ổn định.

# Hướng dẫn sử dụng Docker cho dự án

## 1. Dockerfile trong thư mục `frontend`

### Giới thiệu:

`Dockerfile` dùng để tạo một image cho ứng dụng Next.js. Nó xây dựng và tối ưu hóa ứng dụng cho môi trường production bằng cách tách các bước cài đặt dependencies, build code và chạy ứng dụng thành nhiều giai đoạn (multi-stage build) để giảm kích thước image và tối ưu hóa hiệu suất.

### Nội dung Dockerfile

```Dockerfile
# Sử dụng image Node.js chính thức
FROM node:14

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Expose cổng 3000
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]
```

### Giải thích

#### 1. **Base Image**

```dockerfile
FROM node:18-alpine AS base
```

- `FROM node:18-alpine AS base`: Sử dụng image Node.js phiên bản 18 dựa trên `alpine`, một bản Linux nhỏ gọn và nhanh chóng, làm base cho các bước tiếp theo. Việc sử dụng Alpine giúp giảm kích thước image tổng thể.

#### 2. **Stage 1: Dependencies Installation**

```dockerfile
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
```

- `FROM base AS deps`: Tạo một giai đoạn (stage) có tên là `deps` dựa trên image `base`.
- `RUN apk add --no-cache libc6-compat`: Cài đặt `libc6-compat`, thư viện cần thiết để đảm bảo sự tương thích giữa các phiên bản thư viện C (glibc) trong Alpine.
- `WORKDIR /app`: Đặt thư mục làm việc là `/app`.
- `COPY package.json package-lock.json* ./`: Sao chép các file `package.json` và `package-lock.json` (nếu có) vào container.
- `RUN npm install`: Chạy lệnh `npm install` để cài đặt các dependencies cần thiết cho dự án. Tất cả dependencies sẽ được cài đặt trong thư mục `node_modules`.

#### 3. **Stage 2: Build Application**

```dockerfile
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
```

- `FROM base AS builder`: Tạo một giai đoạn mới có tên là `builder`, sử dụng lại image `base`.
- `WORKDIR /app`: Đặt thư mục làm việc là `/app`.
- `COPY --from=deps /app/node_modules ./node_modules`: Sao chép thư mục `node_modules` từ giai đoạn `deps` để tận dụng dependencies đã cài đặt trước đó.
- `COPY . .`: Sao chép toàn bộ mã nguồn của dự án vào thư mục `/app` trong container.
- `ENV NEXT_TELEMETRY_DISABLED 1`: Tắt tính năng telemetry của Next.js trong quá trình build để tránh gửi dữ liệu về cho Next.js.
- `RUN npm run build`: Thực hiện lệnh build Next.js để tạo ra phiên bản tối ưu hóa cho production.

#### 4. **Stage 3: Production Image**

```dockerfile
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

- `FROM base AS runner`: Tạo một giai đoạn cuối cùng là `runner`, cũng dựa trên image `base`.
- `WORKDIR /app`: Đặt thư mục làm việc là `/app`.
- `ENV NODE_ENV production`: Đặt biến môi trường `NODE_ENV` thành `production` để chạy ứng dụng trong môi trường production.
- `ENV NEXT_TELEMETRY_DISABLED 1`: Tắt telemetry cho Next.js.
- `RUN addgroup --system --gid 1001 nodejs`: Tạo nhóm hệ thống với ID 1001 cho Node.js.
- `RUN adduser --system --uid 1001 nextjs`: Tạo user hệ thống với ID 1001 cho Next.js để chạy ứng dụng với quyền hạn hạn chế.
- `COPY --from=builder /app/public ./public`: Sao chép thư mục `public` từ giai đoạn `builder` sang giai đoạn `runner`.
- `COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./`: Sao chép mã nguồn đã build (`standalone`) từ giai đoạn `builder` sang giai đoạn `runner`, đồng thời thiết lập quyền sở hữu cho `nextjs` và `nodejs`.
- `COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static`: Sao chép các file tĩnh của Next.js từ giai đoạn `builder`.
- `USER nextjs`: Chạy container dưới quyền của user `nextjs` (bảo mật tốt hơn khi chạy dưới tài khoản hạn chế thay vì root).
- `EXPOSE 3000`: Mở cổng 3000 cho container, nơi ứng dụng sẽ chạy.
- `ENV PORT 3000` và `ENV HOSTNAME "0.0.0.0"`: Thiết lập biến môi trường cho ứng dụng chạy ở cổng 3000 và trên tất cả các địa chỉ IP.
- `CMD ["node", "server.js"]`: Khởi động ứng dụng bằng lệnh `node server.js`. Đây là entry point của ứng dụng trong container.

## 2. Dockerfile trong thư mục `backend`

### Nội dung Dockerfile

```Dockerfile
# Sử dụng image Node.js chính thức
FROM node:14

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Expose cổng 3001
EXPOSE 3001

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "start:prod"]
```

### Giải thích

Đoạn `Dockerfile` này sử dụng phương pháp **multi-stage build** để tối ưu hóa quá trình xây dựng và triển khai ứng dụng Node.js, giúp giảm kích thước image sản phẩm cuối cùng bằng cách chỉ giữ lại những phần cần thiết cho môi trường **production**. Cụ thể, nó có ba giai đoạn (stage): **development dependencies**, **production dependencies**, và **final production image**. Sau đây là giải thích chi tiết cho từng phần:

#### 1. **Base Image**

```dockerfile
FROM node:18-alpine AS base
```

- `FROM node:18-alpine AS base`: Sử dụng image Node.js phiên bản 18 dựa trên `alpine`. `Alpine` là một phiên bản Linux nhẹ, giúp giảm kích thước image tổng thể. Giai đoạn này là base cho cả hai giai đoạn phát triển và sản xuất.

#### 2. **Stage 1: Development Dependencies**

```dockerfile
FROM base AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```

- `FROM base AS development`: Tạo một giai đoạn xây dựng có tên là `development` dựa trên base image ở trên.
- `WORKDIR /usr/src/app`: Đặt thư mục làm việc là `/usr/src/app` trong container. Đây là nơi mã nguồn và các dependencies sẽ được sao chép và cài đặt.
- `COPY package*.json ./`: Sao chép các file `package.json` và `package-lock.json` (nếu có) từ máy local vào thư mục làm việc trong container.
- `RUN npm install`: Cài đặt tất cả các dependencies bao gồm cả development dependencies.
- `COPY . .`: Sao chép toàn bộ mã nguồn từ máy local vào container.
- `RUN npm run build`: Thực hiện lệnh build ứng dụng. Kết quả build sẽ được lưu trong thư mục `dist`.

#### 3. **Stage 2: Production Dependencies**

```dockerfile
FROM base AS prod-deps
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
RUN npm install --omit=dev
```

- `FROM base AS prod-deps`: Giai đoạn này sẽ tập trung vào việc chỉ cài đặt các **production dependencies**. Giai đoạn này được đặt tên là `prod-deps`.
- `ENV NODE_ENV production`: Thiết lập biến môi trường `NODE_ENV` là `production`. Điều này giúp xác định môi trường đang chạy là production, và nhiều package quản lý bằng npm có thể tối ưu hóa ứng dụng dựa trên giá trị này.
- `WORKDIR /usr/src/app`: Đặt lại thư mục làm việc là `/usr/src/app`.
- `COPY package*.json ./`: Sao chép lại các file `package.json` và `package-lock.json` vào container.
- `COPY --from=development /usr/src/app/node_modules ./node_modules`: Sao chép toàn bộ thư mục `node_modules` đã cài đặt trong giai đoạn `development` sang giai đoạn `prod-deps`.
- `RUN npm install --omit=dev`: Chạy lệnh `npm install`, nhưng với tùy chọn `--omit=dev`, chỉ cài đặt các production dependencies và bỏ qua development dependencies (không cần thiết cho môi trường production).

#### 4. **Stage 3: Final Production Image**

```dockerfile
FROM base
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . .
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist ./dist

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["npm", "run", "start:prod"]
```

- `FROM base`: Tạo image cuối cùng dựa trên `base`.
- `ENV NODE_ENV production`: Đặt biến môi trường `NODE_ENV` là `production`.
- `WORKDIR /usr/src/app`: Đặt thư mục làm việc là `/usr/src/app`.
- `COPY . .`: Sao chép toàn bộ mã nguồn từ máy local vào container (ngoại trừ thư mục `node_modules` và `dist`).
- `COPY --from=prod-deps /usr/src/app/node_modules ./node_modules`: Sao chép thư mục `node_modules` từ giai đoạn `prod-deps`. Thư mục này chứa các production dependencies.
- `COPY --from=development /usr/src/app/dist ./dist`: Sao chép thư mục `dist` chứa mã nguồn đã được build từ giai đoạn `development` sang giai đoạn cuối cùng.
- `COPY entrypoint.sh /usr/src/app/entrypoint.sh`: Sao chép file `entrypoint.sh` vào container.
- `RUN chmod +x /usr/src/app/entrypoint.sh`: Thay đổi quyền của file `entrypoint.sh` để có thể thực thi (`+x`).
- `ENTRYPOINT ["/usr/src/app/entrypoint.sh"]`: Đặt lệnh `entrypoint.sh` làm điểm đầu vào khi container chạy. File này thường chứa các lệnh cấu hình hoặc khởi tạo trước khi chạy ứng dụng chính.
- `CMD ["npm", "run", "start:prod"]`: Sau khi `entrypoint.sh` được thực thi, lệnh `npm run start:prod` sẽ được chạy để khởi động ứng dụng trong chế độ production.

## 3. Giải thích `docker-compose.yml`

### Nội dung `docker-compose.yml`

```yml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./frontend/.env
    command: node server.js
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env.production
    command: npm run start:prod
    depends_on:
      - postgres
  postgres:
    image: postgres:13
    ports:
      - "5432:5432"
    env_file:
      - ./backend/.env
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

### Giải thích

Đoạn YAML này là một file cấu hình `docker-compose.yml`, sử dụng Docker Compose để quản lý và chạy nhiều container. Nó bao gồm ba dịch vụ chính: `frontend` (giao diện người dùng), `backend` (dịch vụ API hoặc máy chủ ứng dụng), và `postgres` (cơ sở dữ liệu). Mỗi dịch vụ sẽ được xây dựng từ một `Dockerfile` riêng biệt hoặc từ một image có sẵn. Dưới đây là giải thích chi tiết cho từng phần:

#### 1. **Dịch vụ `frontend`**

```yml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
  env_file:
    - ./frontend/.env
  command: node server.js
```

- `frontend`: Tên của dịch vụ frontend. Đây có thể là ứng dụng giao diện người dùng, có thể là một ứng dụng React hoặc Next.js.
- `build`: Định nghĩa cách xây dựng container cho dịch vụ này.
  - `context: ./frontend`: Thư mục chứa mã nguồn của frontend, được Docker sử dụng làm "context" để xây dựng image.
  - `dockerfile: Dockerfile`: Sử dụng file `Dockerfile` trong thư mục `frontend` để xây dựng image cho dịch vụ này.
- `ports: "3000:3000"`: Chuyển tiếp cổng 3000 của container sang cổng 3000 của máy host. Điều này giúp bạn truy cập dịch vụ frontend tại `localhost:3000` từ bên ngoài container.
- `environment`: Thiết lập biến môi trường cho container.
  - `NODE_ENV=production`: Chỉ định rằng ứng dụng sẽ chạy trong môi trường production.
- `env_file`: Sử dụng file `.env` chứa các biến môi trường cụ thể cho frontend.
  - `./frontend/.env`: File `.env` nằm trong thư mục `frontend` và chứa các thông tin cấu hình, như API keys hoặc các tham số môi trường khác.
- `command: node server.js`: Chạy lệnh `node server.js` để khởi động ứng dụng frontend khi container chạy.

#### 2. **Dịch vụ `backend`**

```yml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  ports:
    - "3001:3001"
  environment:
    - NODE_ENV=production
  env_file:
    - ./backend/.env.production
  command: npm run start:prod
  depends_on:
    - postgres
```

- `backend`: Dịch vụ backend, có thể là API hoặc máy chủ xử lý logic.
- `build`: Định nghĩa cách xây dựng container cho dịch vụ này.
  - `context: ./backend`: Thư mục chứa mã nguồn backend.
  - `dockerfile: Dockerfile`: Sử dụng file `Dockerfile` trong thư mục `backend` để xây dựng image cho backend.
- `ports: "3001:3001"`: Chuyển tiếp cổng 3001 của container sang cổng 3001 của máy host. Điều này cho phép bạn truy cập dịch vụ backend tại `localhost:3001`.
- `environment`: Thiết lập biến môi trường cho container backend.
  - `NODE_ENV=production`: Chạy ứng dụng backend trong môi trường production.
- `env_file`: Chỉ định file chứa các biến môi trường.
  - `./backend/.env.production`: File `.env.production` chứa các biến môi trường cụ thể cho môi trường production của backend.
- `command: npm run start:prod`: Chạy lệnh `npm run start:prod` để khởi động ứng dụng backend trong môi trường production.
- `depends_on`: Đảm bảo rằng dịch vụ `postgres` (cơ sở dữ liệu) sẽ được khởi động trước khi khởi động dịch vụ `backend`.

#### 3. **Dịch vụ `postgres`**

```yml
postgres:
  image: postgres:13
  ports:
    - "5432:5432"
  env_file:
    - ./backend/.env
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

- `postgres`: Dịch vụ cơ sở dữ liệu PostgreSQL.
- `image: postgres:13`: Sử dụng image chính thức của PostgreSQL phiên bản 13 từ Docker Hub.
- `ports: "5432:5432"`: Chuyển tiếp cổng 5432 của container sang cổng 5432 của máy host để có thể truy cập vào PostgreSQL từ bên ngoài container (ví dụ, thông qua công cụ quản lý cơ sở dữ liệu như pgAdmin hoặc trực tiếp từ ứng dụng backend).
- `env_file`: Sử dụng file chứa các biến môi trường cần thiết cho PostgreSQL.
  - `./backend/.env`: File `.env` này có thể chứa thông tin như `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, và các biến cấu hình khác.
- `volumes`: Tạo volume để lưu trữ dữ liệu của PostgreSQL.
  - `postgres_data:/var/lib/postgresql/data`: Volume này đảm bảo dữ liệu của PostgreSQL được lưu trữ ở thư mục `/var/lib/postgresql/data` trong container và sẽ được giữ lại ngay cả khi container bị xóa.

#### 4. **Volumes**

```yml
volumes:
  postgres_data:
```

- `postgres_data`: Định nghĩa một volume với tên là `postgres_data`. Docker sẽ quản lý volume này, giúp lưu trữ dữ liệu của PostgreSQL để dữ liệu không bị mất khi container bị xóa hoặc dừng.

#### Tổng quan:

File `docker-compose.yml` này được cấu hình để chạy ba dịch vụ:

1. **Frontend**: Một ứng dụng giao diện người dùng (có thể là React hoặc Next.js), chạy trên cổng `3000`.
2. **Backend**: Một dịch vụ API (có thể là NestJS hoặc Express), chạy trên cổng `3001` và phụ thuộc vào dịch vụ PostgreSQL.
3. **PostgreSQL**: Cơ sở dữ liệu PostgreSQL, chạy trên cổng `5432`, với dữ liệu được lưu trữ trong volume `postgres_data`.

Các dịch vụ này có thể giao tiếp với nhau thông qua mạng nội bộ của Docker, và toàn bộ ứng dụng được chạy trên cùng một file cấu hình.
