# citizenVoice-frontend

🌐 Frontend - React App

🛠 Tech Stack

React (Vite)

TypeScript

Tailwind CSS

Axios

Chart.js / Recharts

🌍 Live Site

👉 https://citizenvoice-gamma.vercel.app/

📂 Structure

src/
├── components/
├── pages/
├── services/
├── routes/
├── contexts/
└── utils/

⚙️ Setup & Run

Install Dependencies

npm install

Run Locally

npm run dev

Deployment Config

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}

🖥️ Dashboard Features

👨‍💼 Admin

Total users

Create leaders & admins

Complaint stats by status

Graphs & filterable user lists

🧑‍⚖️ Leader

Total citizens in jurisdiction

Assigned administrative scope

Complaint status summaries

Pie chart of complaint distribution

3 most recent complaints

👤 Citizen

Submit new complaints

View & delete their complaints

View responses from leaders

📌 Notes

Supabase provides hosted Postgres with Prisma integration

Image uploads managed via Cloudinary

Auth flow securely implemented with refresh token rotation

Frontend connected to live backend for real-time operations

