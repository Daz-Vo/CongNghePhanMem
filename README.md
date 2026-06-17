
---

# Medical Chatbot

Ứng dụng `Medical Chatbot` là dự án web quản lý dữ liệu thuốc - bệnh - tương tác, gồm:

* Backend Python với FastAPI.
* Lưu trữ người dùng và dữ liệu quan hệ bằng PostgreSQL.
* Cơ sở dữ liệu đồ thị Neo4j để lưu bệnh, thuốc, triệu chứng, nhà sản xuất và quan hệ giữa chúng.
* Frontend React + Vite cho giao diện người dùng.
* Docker Compose để chạy toàn bộ stack nhanh và nhất quán.

## Giới thiệu dự án

Dự án này xây dựng một hệ thống backend + frontend cho:

* Tìm kiếm thuốc và bệnh.
* Xây dựng đồ thị Neo4j cho các quan hệ: thuốc điều trị bệnh, bệnh có triệu chứng, thuốc chứa thành phần, thuốc do nhà sản xuất nào sản xuất, thuốc tương tác với thuốc khác.
* Xác thực người dùng và quản lý quyền.
* Chạy thử nhanh bằng Docker Compose.

## Yêu cầu

* Docker và Docker Compose
* Git để clone code

## Cấu hình môi trường (`.env`)

File `.env` nằm ở thư mục gốc dự án và chứa cấu hình cho cả Backend, PostgreSQL và Neo4j. Mặc định bạn có thể sử dụng file `.env.example` để làm mẫu.

```bash
cp .env.example .env

```

**Các biến quan trọng cần kiểm tra:**

* `DOMAIN`: Tên miền môi trường. Mặc định `localhost`.
* `FRONTEND_HOST`: URL frontend. Mặc định `http://localhost:5173`.
* `ENVIRONMENT`: Môi trường chạy, thường là `local`.

**Backend:**

* `SECRET_KEY`: Khóa bí mật cho JWT và bảo mật (Nên thay đổi).
* `FIRST_SUPERUSER`: Email tài khoản quản trị mặc định.
* `FIRST_SUPERUSER_PASSWORD`: Mật khẩu tài khoản quản trị mặc định.

**Emails (SMTP / Gửi link quên mật khẩu):**

Để hệ thống gửi được email thật chứa link đặt lại mật khẩu cho người dùng khi họ nhấn quên mật khẩu trên giao diện Frontend:
* `SMTP_HOST`: Địa chỉ máy chủ SMTP (Ví dụ Gmail: `smtp.gmail.com`).
* `SMTP_PORT`: Cổng máy chủ SMTP (Ví dụ Gmail: `587`).
* `SMTP_TLS`: Kích hoạt TLS (Ví dụ Gmail: `True`).
* `SMTP_SSL`: Kích hoạt SSL (Ví dụ Gmail: `False`).
* `SMTP_USER`: Tài khoản email gửi (Ví dụ Gmail: `email-cua-ban@gmail.com`).
* `SMTP_PASSWORD`: Mật khẩu hoặc Mật khẩu ứng dụng (App Password 16 ký tự của Google) dùng để đăng nhập gửi mail.
* `EMAILS_FROM_EMAIL`: Địa chỉ email hiển thị ở người gửi (Trùng với `SMTP_USER`).

*Lưu ý: Backend của ứng dụng đã được cấu hình tự động tìm và đọc file `.env` ở thư mục gốc của dự án này.*

**PostgreSQL:**

* `POSTGRES_SERVER`: Tên service DB, mặc định `db`.
* `POSTGRES_DB`: Tên database, mặc định `app`.
* `POSTGRES_USER`: Tên user DB, mặc định `postgres`.
* `POSTGRES_PASSWORD`: Mật khẩu DB.

**Neo4j:**

* `NEO4J_URI`: URI kết nối Neo4j, mặc định `bolt://neo4j:7687`.
* `NEO4J_USERNAME`: User Neo4j, mặc định `neo4j`.
* `NEO4J_PASSWORD`: Mật khẩu Neo4j.

> **Quan trọng:** Thay `SECRET_KEY`, `FIRST_SUPERUSER_PASSWORD`, `POSTGRES_PASSWORD`, `NEO4J_PASSWORD` bằng giá trị an toàn trước khi chạy trên môi trường thực tế.

## Khởi động dự án

1. Clone repository về máy và di chuyển vào thư mục dự án:

```bash
git clone <url-cua-repo> medical-chatbot
cd medical-chatbot

```

2. Đảm bảo bạn đã cấu hình xong file `.env`. Sau đó chạy lệnh sau để khởi tạo stack:

```bash
docker compose build
docker compose up -d

```

> **Lưu ý:** Bạn không cần chạy trực tiếp các lệnh Python thủ công để khởi tạo ban đầu. Phần `prestart` trong `backend/scripts/prestart.sh` sẽ tự động chờ DB khởi động, chạy migration (`alembic upgrade head`) và tạo user mặc định.

## Nạp dữ liệu đồ thị Neo4j từ CSV

Trong dự án có sẵn script nạp dữ liệu Neo4j từ CSV tại `backend/app/scripts/seed_from_csv.py`. Sau khi stack đã khởi động thành công ở bước trên, hãy chạy lệnh sau để tạo các node và quan hệ (từ các file CSV trong `backend/app/data/`):

```bash
docker compose exec backend python app/scripts/seed_from_csv.py

```

## Chạy lại từ đầu (Reset toàn bộ dữ liệu)

Nếu bạn muốn xóa sạch cơ sở dữ liệu hiện tại và khởi tạo lại dự án từ đầu, hãy chạy chuỗi lệnh sau:

```bash
# 1. Dừng và xóa toàn bộ stack cùng volumes dữ liệu cũ
docker compose down --volumes --rmi all

# 2. Xây dựng lại và khởi động lại
docker compose build
docker compose up -d

# 3. Nạp lại dữ liệu đồ thị
docker compose exec backend python app/scripts/seed_from_csv.py

```

## Chạy lệnh thủ công bên trong Backend

Nếu bạn cần debug hoặc chạy lệnh thủ công, hãy truy cập vào bên trong container backend:

```bash
docker compose exec backend bash

```

Một số lệnh hữu ích có thể chạy bên trong:

```bash
python -m alembic current
python app/initial_data.py

```

## Truy cập dịch vụ

Sau khi dự án chạy thành công, bạn có thể truy cập các dịch vụ qua các địa chỉ sau:

* **Frontend:** `http://localhost:3000`
* **Backend API (Docs):** `http://localhost:8000/docs`
* **Kiểm tra sức khỏe Backend:** `http://localhost:8000/health`
* **Neo4j Browser:** `http://localhost:7474`
* **Adminer (Postgres UI):** `http://localhost:8080`

## Cấu hình IDE (Gợi ý code & Sửa lỗi gạch đỏ)

Mặc dù dự án đã chạy hoàn hảo trong Docker, nhưng nếu bạn dùng **VS Code** để code ở máy thật, IDE sẽ báo lỗi gạch đỏ (ví dụ: `Cannot find module`) do thiếu file thư viện nội bộ. 

Để khắc phục và bật tính năng gợi ý code (IntelliSense) mượt mà nhất, bạn hãy cài đặt thư viện ảo cho cả Backend và Frontend:

### 1. Dành cho Backend (Python)
Chạy lệnh sau tại thư mục gốc của dự án để tạo môi trường ảo:
```bash
python3 -m venv .venv
source .venv/bin/activate    # Hoặc .venv\Scripts\activate trên Windows
pip install -r requirements.txt
```
> **Tip:** Sau khi cài xong, trong VS Code nhấn `Ctrl + Shift + P` -> Gõ **Python: Select Interpreter** -> Chọn `./.venv/bin/python`. Các lỗi đỏ ở file Python sẽ biến mất!

### 2. Dành cho Frontend (React/Vite)
Chạy lệnh sau để tải thư viện Node.js cục bộ giúp VS Code nhận diện được React, Tailwind và các component:
```bash
cd frontend
bun install   # Hoặc npm install nếu bạn không dùng bun
```

## Tài liệu liên quan

* Backend: [backend/README.md](https://www.google.com/search?q=./backend/README.md)
* Frontend: [frontend/README.md](https://www.google.com/search?q=./frontend/README.md)
* Docker Compose: [compose.yml](https://www.google.com/search?q=./compose.yml)

## License

Dự án này sử dụng giấy phép MIT.