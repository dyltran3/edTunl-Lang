# 🎓 edTunl-Lang — Nền Tảng Học Ngoại Ngữ Thông Minh Tích Hợp AI & Canvas 3D

[![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-8E44AD?logo=google)](https://deepmind.google/technologies/gemini/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Canvas-black?logo=threedotjs)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**edTunl-Lang** là nền tảng học ngoại ngữ thế hệ mới được xây dựng trên nền tảng **Next.js 16 (App Router)** và **React 19**, kết hợp với trí tuệ nhân tạo **Google Gemini AI** và giao diện đồ họa **3D Canvas (Three.js)**. Nền tảng mang đến trải nghiệm học tập tương tác cao, lộ trình cá nhân hóa, thi thử chứng chỉ quốc tế và học nhóm thi đua theo thời gian thực.

---

## 🌟 Tính Năng Nổi Bật

### 🌐 1. Hỗ Trợ Đa Ngôn Ngữ & Khung Trình Độ Quốc Tế
* **🇬🇧 Tiếng Anh (English):** Khung tham chiếu CEFR (A1, A2, B1, B2, C1).
* **🇨🇳 Tiếng Trung - Giản thể (简体中文):** Chuẩn HSK (HSK 1 đến HSK 6).
* **🇹🇼 Tiếng Trung - Phồn thể (繁體中文):** Chuẩn TOCFL (TOCFL 1 đến TOCFL 5).
* **🇯🇵 Tiếng Nhật (日本語):** Chuẩn JLPT (N5 đến N1) với bảng chữ cái Kana & Kanji.
* **🇰🇷 Tiếng Hàn (한국어):** Chuẩn TOPIK (TOPIK I & TOPIK II) với chữ viết Hangul.
* **🇹🇭 Tiếng Thái (ไทย):** Các cấp độ từ Cơ bản đến Nâng cao.

---

### 🤖 2. Trợ Lý AI Google Gemini Thông Minh
* **Tự động khởi tạo bài học:** Tạo nội dung bài học, từ vựng, phiên âm (Pinyin/Romaji/IPA), nghĩa và câu ví dụ theo chủ đề yêu cầu.
* **Giải thích bài tập tức thì:** Đưa ra phản hồi chi tiết lý do đúng/sai cho các dạng câu hỏi trắc nghiệm, điền từ và sắp xếp câu.
* **Phân tích tài liệu học tập:** Tải lên tài liệu dạng văn bản/tệp tin để AI phân tích và trích xuất từ vựng chính kèm bài luyện tập.

---

### 📝 3. Bài Học & Luyện Tập Tương Tác
* **Từ vựng phong phú:** Hỗ trợ thẻ từ vựng (Flashcard), audio phát âm chuẩn, phiên âm chi tiết và câu ví dụ song ngữ.
* **Hệ thống bài tập đa dạng:**
  * Trắc nghiệm chọn đáp án đúng (`multiple_choice`).
  * Điền từ thích hợp vào chỗ trống (`fill_blank`).
  * Sắp xếp từ thành câu hoàn chỉnh (`sentence_ordering`).
* **Trích dẫn nguồn tài liệu (Citations):** Hiển thị nguồn trích dẫn uy tín cho từng bài học.

---

### 🏆 4. Hệ Thống Thi Thử (Mock Exams)
* Các bộ đề thi mô phỏng định dạng chứng chỉ quốc tế (**IELTS, HSK, JLPT, TOPIK**).
* Đồng hồ đếm ngược thời gian thực, giao diện chia phần kỹ năng (**Listening, Reading, Grammar, Vocabulary**).
* Chấm điểm tự động, lưu lịch sử làm bài (`ExamAttempt`) và hiển thị bảng phân tích chi tiết sau khi nộp bài.

---

### 👥 5. Nhóm Học Tập & Thi Đua (Learning Groups)
* Tạo nhóm học tập (từ 2 đến 50 thành viên) với mã mời riêng biệt (`Invite Code`).
* Theo dõi tiến độ học tập của các thành viên trong nhóm.
* Tạo động lực duy trì chuỗi ngày học liên tục (**Streak Count**).

---

### 📊 6. Bảng Xếp Hạng & Thống Kê Tiến Độ
* Bảng xếp hạng (**Leaderboard**) theo Tuần / Tháng / Quý dựa trên tổng điểm, thời gian học và số từ vựng tích lũy.
* Biểu đồ theo dõi tiến độ thời gian thực (sử dụng **Recharts**).
* Hệ thống điểm thưởng và hiệu ứng chúc mừng (**Canvas Confetti**).

---

### 🎨 7. Giao Diện 3D Canvas & UI Hiện Đại
* Nền đồ họa không gian 3D tương tác mượt mà tạo bởi **Three.js** & **React Three Fiber**.
* Thiết kế Responsive toàn diện với **Tailwind CSS v4** và bộ icon **Lucide React**.
* Animate mượt mà với **Framer Motion**.

---

### 🛡️ 8. Quản Trị Hệ Thống (Admin Portal)
* Quản lý danh sách bài học, kiểm duyệt bài đóng góp (`published`, `pending_review`, `rejected`).
* Công cụ Seeding dữ liệu bài học mẫu và đề thi tự động (`admin-seed`).
* Phân quyền người dùng rõ ràng (`UserRole: 'user' | 'admin'`).

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Phân loại | Công nghệ / Thư viện |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Đồ họa 3D Canvas** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://drei.docs.pmnd.rs/) |
| **Backend & Database** | [Firebase Authentication](https://firebase.google.com/docs/auth), [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup), [Firestore](https://firebase.google.com/docs/firestore) |
| **Trí Tuệ Nhân Tạo (AI)** | [Google Gemini API (`@google/genai`)](https://github.com/google/generative-ai-js) |
| **Biểu đồ & Hiệu ứng** | [Recharts](https://recharts.org/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
edTunl-Lang/
├── public/                     # Tệp tĩnh (Icons, Logos, SVG)
├── src/
│   ├── app/                    # Next.js App Router (Pages & API Routes)
│   │   ├── admin/              # Trang quản trị Admin & duyệt bài
│   │   ├── api/                # API Endpoints (Gemini AI, Seed Data)
│   │   ├── auth/               # Trang Đăng nhập, Đăng ký, Quên mật khẩu
│   │   ├── courses/            # Danh sách khóa học theo ngôn ngữ & trình độ
│   │   ├── dashboard/          # Tổng quan tiến độ cá nhân & thống kê
│   │   ├── groups/             # Quản lý & tham gia nhóm học tập
│   │   ├── languages/          # Danh mục chọn ngôn ngữ mục tiêu
│   │   ├── lessons/            # Bài học & bài tập tương tác
│   │   ├── library/            # Thư viện cá nhân & tài liệu đã lưu
│   │   ├── live-room/          # Phòng học trực tuyến thời gian thực
│   │   ├── mock-exams/         # Hệ thống thi thử chứng chỉ
│   │   ├── onboarding/         # Khảo sát ban đầu & thiết lập mục tiêu
│   │   ├── profile/            # Trang cá nhân & hồ sơ học viên
│   │   ├── ranking/            # Bảng xếp hạng tuần / tháng / quý
│   │   ├── settings/           # Cài đặt tài khoản & giao diện
│   │   ├── upload/             # Tải lên tài liệu & AI phân tích
│   │   ├── globals.css         # Cấu hình Tailwind CSS & Styles toàn cục
│   │   ├── layout.tsx          # Root Layout (Navbar, Footer, Auth Provider)
│   │   └── page.tsx            # Landing Page giới thiệu edTunl-Lang
│   ├── components/             # React Components tái sử dụng
│   │   ├── canvas/             # Nền 3D Canvas (Background3D.tsx)
│   │   ├── layout/             # Navbar, Footer
│   │   └── ui/                 # Component UI dùng chung (EmptyState, LoadingSpinner)
│   ├── context/                # React Context (AuthContext.tsx)
│   ├── lib/                    # Cấu hình & Utility Modules
│   │   ├── config/             # Danh mục ngôn ngữ & cấp độ (languages.ts)
│   │   ├── firebase/           # Cấu hình Firebase Client & Admin SDK
│   │   ├── gemini/             # Client tích hợp Google Gemini AI
│   │   └── seed/               # Khởi tạo dữ liệu mẫu bài học & đề thi
│   └── types/                  # TypeScript Interfaces & Types
├── eslint.config.mjs           # Cấu hình ESLint
├── next.config.ts              # Cấu hình Next.js
├── package.json                # Danh sách Dependencies & Scripts
├── postcss.config.mjs          # Cấu hình PostCSS & Tailwind
├── tsconfig.json               # Cấu hình TypeScript
└── README.md                   # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 📋 Yêu Cầu Tiền Đề
* **Node.js**: phiên bản `>= 18.0.0`
* **npm**, **pnpm** hoặc **yarn**

### 1️⃣ Clone Dự Án & Cài Đặt Dependencies

```bash
# Clone repository
git clone https://github.com/dyltran3/edTunl-Lang.git

# Di chuyển vào thư mục dự án
cd edTunl-Lang

# Cài đặt gói phụ thuộc
npm install
```

---

### 2️⃣ Cấu Hình Biến Môi Trường (`.env.local`)

Tạo tệp `.env.local` ở thư mục gốc của dự án và điền các thông số cấu hình:

```env
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (cho Server Side / API Routes)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key
```

---

### 3️⃣ Khởi Chạy Môi Trường Phát Triển (Development)

```bash
npm run dev
```

Truy cập đường dẫn [http://localhost:3000](http://localhost:3000) trên trình duyệt để trải nghiệm ứng dụng.

---

### 4️⃣ Biên Dịch & Chạy Production

```bash
# Biên dịch dự án
npm run build

# Khởi chạy bản build
npm start
```

---

## 📜 Giấy Phép (License)

Dự án được phân phối dưới giấy phép **MIT License**. Xem thêm thông tin chi tiết tại tệp [LICENSE](LICENSE).

---

<p center align="center">
  Made with ❤️ by <b>dyltran3</b> & <b>edTunl Team</b>
</p>
