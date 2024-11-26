
# Aerobotix Birthday Challenge Platform

Welcome to the **Aerobotix Birthday Challenge Platform**, an application developed to host competitive robotics challenges. This platform was used for the **Aerobotix Birthday Challenge**, an 8-hour event that brought together teams to solve a series of problems under a competitive setting. 

The platform is built using **Next.js** and **shadcn/ui components**, offering a robust and dynamic user experience for both participants and administrators. It remains live, and you can view the problems [here](https://dashboard-challenge-aero.vercel.app/view-problems).

---

## Features

### Team's Point of View
- **Dashboard for Team Standings**  
  Teams can monitor their ranking in real-time as scores are updated. The standings are sorted by points to highlight the most successful teams.

- **Problem Dashboard**  
  Problems are posted incrementally, with a new problem added every hour. Teams can access all available problems directly from their dashboard and strategize accordingly.

---

### Admin's Point of View
- **Authentication with Cookie Management**  
  Admins can securely log in to the platform. Authentication uses cookies stored in the browser for session management.

- **Admin Features**  
  Admins have access to forms that enable them to:
  - Add teams to the competition.
  - Add new problems that are displayed to participants.
  - Update team scores as they solve problems.

---

## Technical Overview

- **Framework:** [Next.js](https://nextjs.org/)  
- **UI Components:** [shadcn/ui](https://shadcn.dev/)  
- **Data Storage:** Google Sheets  
- **Environment Variables:** `.env.local`  
- **Deployment:** [Vercel](https://vercel.com/)  
- **Live Problems Directory:** [View Problems](https://dashboard-challenge-aero.vercel.app/view-problems)  

---

## How to Use This Project

### Prerequisites
1. Install [Node.js](https://nodejs.org/) and npm (Node Package Manager).
2. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/fayezzouari/aerobotix_challenge_aero.git
   ```
3. Navigate to the project directory:
   ```bash
   cd aerobotix_challenge_aero
   ```

### Environment Setup
1. Create a `.env.local` file in the root directory.
2. Add the following environment variables:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google-credentials.json
   SHEET_ID=your-google-sheet-id
   ```

### Run the Application
1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.

---

### Data Management
- **Data Storage:**  
  All data for teams, problems, and scores is stored in and retrieved from a Google Sheet. The sheet is identified using the `SHEET_ID` environment variable.
- **Google Sheets Integration:**  
  Ensure that the Google service account JSON file is downloaded and its path is set in the `GOOGLE_APPLICATION_CREDENTIALS` variable.

---

### Project Structure

The core source files are located in the `src/app` directory. Here’s a brief overview:
- `src/app/dashboard/`: Contains components for the team standings dashboard.
- `src/app/problems/`: Handles the display and logic for the problems dashboard.
- `src/app/admin/`: Includes forms and functionality for administrators to manage teams, problems, and scores.
- `src/app/api/`: Handles server-side logic for interacting with the Google Sheet.

Feel free to explore the directory to understand the implementation in detail.

---

## Highlights of Aerobotix Birthday Challenge

The competition was an 8-hour intense challenge, fostering innovation and teamwork among participants. The problems designed for the event remain available in the `/view-problems` directory on the platform, serving as a resource for future challenges or practice.

---

## Contribution and Feedback

If you’d like to contribute to this platform or have feedback, feel free to get in touch. Let's continue to innovate and inspire in the robotics community!

---

Thank you for participating or exploring the Aerobotix Birthday Challenge Platform!
