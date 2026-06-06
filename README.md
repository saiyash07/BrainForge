# BrainForge 🧠⚡

BrainForge is an AI-powered, all-in-one student productivity and learning platform. Built with Next.js, Firebase, and the Google Gemini API, it helps students automatically generate course materials from PDFs, track their energy-based tasks, manage their automated college timetables, and monitor their overall wellbeing.

## 🌟 Key Features

* **🤖 AI Subject Generator**: Upload a PDF syllabus or textbook, and our Gemini 1.5 Flash integration automatically extracts the topics, structures them into detailed modules, and generates 10 practice questions with hidden solutions!
* **📅 Automated Timetable Calendar**: Syncs your weekly college timetable directly from your university emails via Google Apps Script. Highlights automated lectures distinctively from personal tasks.
* **⚡ Energy-Based Task Scheduler**: Manage your daily tasks not just by priority, but by the energy required (High, Medium, Low). 
* **🍅 Focus Pomodoro Timer**: Built-in Pomodoro tracker to help you power through your Forge Blocks.
* **🇩🇪 Language Practice Module**: Dedicated German language practice section with interactive exercises and progress tracking.
* **🧘‍♂️ Wellbeing Tracker**: Monitor your daily mood, sleep, and stress levels to ensure you don't burn out during heavy academic sprints.

## 🛠 Tech Stack

* **Frontend**: Next.js (React), framer-motion (animations), Chart.js (statistics)
* **Backend**: Next.js API Routes (Node.js)
* **Database**: Firebase Firestore
* **Authentication**: Firebase Auth
* **AI Model**: Google Generative AI (`gemini-1.5-flash`)
* **Styling**: Vanilla CSS with Glassmorphism & Modern Mesh Gradients

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* A Firebase Project (with Firestore and Auth enabled)
* A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saiyash07/BrainForge.git
   cd BrainForge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables by creating a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
