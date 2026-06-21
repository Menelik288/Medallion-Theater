# Medallion Theater 🎭🎬

A modern, full-stack theater management and ticketing system built to streamline operations and enhance the moviegoer experience.

### 🌐 Live Demo
**[https://medallion-theater-ewel0cjyu-menelik.vercel.app](https://medallion-theater-ewel0cjyu-menelik.vercel.app)**

### 🔐 Demo Access
To explore the different roles in the live demo, use these credentials:

**Clerk Accounts:**
- Username: `clerk1` | Password: `clerk123`
- Username: `clerk2` | Password: `clerk123`
- Username: `clerk3` | Password: `clerk123`
- Username: `clerk4` | Password: `clerk123`

**Manager Account:**
- Username: `manager` | Password: `manager123`

---

## ✨ Features
* **Ticketing System:** Seamless ticket booking, generation, and printing.
* **Admin Dashboard:** Comprehensive analytics and charts for sales and operations.
* **Authentication:** Secure user authentication and authorization using Supabase.
* **Email Notifications:** Automated email confirmations via EmailJS.
* **Export & Print:** Built-in PDF generation and print-ready tickets.
* **Responsive UI:** A sleek, fully responsive interface powered by Tailwind CSS and Lucide React icons.
* **State Management:** Fast and predictable state management using Zustand.

---

## 🛠️ Tech Stack
* **Frontend:** React 19, Vite, Tailwind CSS
* **Routing:** React Router DOM
* **Database & Auth:** Supabase (PostgreSQL)
* **State Management:** Zustand
* **Charts & Analytics:** Recharts
* **PDF & Printing:** jsPDF, html2canvas, React-to-Print
* **Email Services:** EmailJS

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- Supabase Project & Credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Menelik288/Medallion-Theater.git
   cd Medallion-Theater
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` or `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📄 License
This project is for educational and portfolio purposes.
