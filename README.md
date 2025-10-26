# ENEM Essay Corrector: AI-Powered Writing Assistant

An AI-powered web application that helps Brazilian high school students prepare for the ENEM exam by providing instant, detailed feedback on practice essays. Users can upload handwritten or digital essays, receive an accurate transcription via OCR, and get a comprehensive evaluation based on official ENEM criteria, powered by Google's Gemini Pro.

## Live Demo & Screenshots

**[Live Demo](https://enem.octacity.org)**

### Landing Page
![Landing Page 1](./screenshots/png-small/landing/landing-1.png)
![Landing Page 2](./screenshots/png-small/landing/landing-2.png)
![Landing Page 3](./screenshots/png-small/landing/landing-3.png)

### Sign-in Page
![Sign-in Page](./screenshots/png-small/signin/signin-1.png)

### Dashboard
![Dashboard 1](./screenshots/png-small/dashboard/dashboard-1.png)
![Dashboard 2](./screenshots/png-small/dashboard/dashboard-2.png)

### Essay Upload
![Essay Upload](./screenshots/png-small/upload/upload-1.png)

### Evaluation Results
![Evaluation Results 1](./screenshots/png-small/essay/essay-1.png)
![Evaluation Results 2](./screenshots/png-small/essay/essay-2.png)
![Evaluation Results 3](./screenshots/png-small/essay/essay-3.png)
![Evaluation Results 4](./screenshots/png-small/essay/essay-4.png)
![Evaluation Results 5](./screenshots/png-small/essay/essay-5.png)
![Evaluation Results 6](./screenshots/png-small/essay/essay-6.png)

## How It Works

1.  **Upload Your Essay:** Users can drag and drop or select image files (JPG, PNG) or PDFs of their handwritten or typed essays.
2.  **AI-Powered Transcription:** The system uses Google Vision API to perform Optical Character Recognition (OCR) on the uploaded image, converting it into digital text.
3.  **AI-Powered Evaluation:** The transcribed text is sent to Google's Gemini Pro, which analyzes the essay based on the 5 official ENEM competencies and generates a detailed evaluation with scores and feedback.
4.  **View Your Results:** The user receives a comprehensive report with an overall score, a breakdown of each competency, and actionable feedback for improvement.

## Key Features

- **Secure Authentication:** Google OAuth 2.0 for safe and easy user access, with data protected by Supabase's Row Level Security.
- **Drag-and-Drop Upload:** A user-friendly interface that supports images (JPG, PNG) and PDFs, with previews and validation.
- **AI-Powered OCR:** Utilizes Google Vision API to accurately transcribe handwritten or typed text, achieving high accuracy with language hints.
- **AI-Powered Evaluation:** Leverages Google Gemini Pro with a custom prompt to analyze essays based on the 5 official ENEM competencies, providing scores and detailed, constructive feedback.
- **Interactive Dashboard:** Allows users to manage their essays, track their progress with statistics (total essays, average score), and view their evaluation history.
- **Detailed Results Page:** Presents the evaluation in a clear and organized manner, with color-coded scores and collapsible sections for detailed feedback on each competency.
- **Responsive Design:** Fully functional and visually appealing on desktops, tablets, and mobile devices, built with Tailwind CSS.

## System Architecture

The application is built on a modern, serverless architecture that is scalable, secure, and cost-effective.

- **Frontend:** A Next.js 14+ application deployed on Vercel, utilizing the App Router for server-side rendering and API routes.
- **Backend:** Supabase provides the backend-as-a-service, handling the PostgreSQL database, user authentication, and file storage.
- **AI Services:** Google Cloud Vision API and Gemini Pro are integrated via API routes to handle the heavy lifting of OCR and essay evaluation.

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend]
    end

    subgraph "API Layer - Next.js"
        B[/api/upload]
        C[/api/ocr]
        D[/api/evaluate]
    end

    subgraph "External Services"
        F[Google Vision API]
        G[Gemini 1.5 Pro API]
    end

    subgraph "Supabase"
        H[(PostgreSQL)]
        I[Storage Bucket]
        J[Auth Service]
    end

    A --> B
    A --> C
    A --> D
    B --> I
    B --> H
    C --> F
    C --> H
    D --> G
    D --> H
    A --> J
```

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **AI Services:** Google Vision API (OCR), Gemini 1.5 Pro (Evaluation)
- **Deployment:** Vercel

## Project Status

This project was developed in distinct phases, with the core functionality now complete.

- [x] **Phase 1: Project Setup** - Initial configuration and project structure.
- [x] **Phase 2: Supabase Integration** - Database schema, storage, and RLS policies.
- [x] **Phase 3: Authentication** - Secure user login with Google OAuth.
- [x] **Phase 4: File Upload System** - Essay submission with drag-and-drop.
- [x] **Phase 5: OCR Integration** - Text extraction from images using Google Vision API.
- [x] **Phase 6: AI Evaluation Engine** - Essay analysis and feedback generation with Gemini Pro.

### Future Enhancements

- [ ] **Phase 7: UI/UX Polish** - Further improvements to the user interface.
- [ ] **Phase 8: Testing & QA** - Implementation of a comprehensive testing suite.
- [ ] **Phase 9: Deployment** - Final preparations for a production environment.

## Getting Started

### Prerequisites

- Node.js >= 18.x
- pnpm package manager
- A Supabase account
- A Google Cloud account (for Vision API and Gemini API)

### Setup Instructions

1.  **Clone and Install Dependencies:**
    ```bash
    git clone https://github.com/your-repo/enem-essay-corrector.git
    cd enem-essay-corrector
    pnpm install
    ```

2.  **Configure Environment Variables:**
    Copy `.env.local.example` to `.env.local` and add your credentials from Supabase and Google Cloud.
    ```bash
    cp .env.local.example .env.local
    ```

3.  **Set Up Supabase:**
    Follow the detailed instructions in the [Supabase Setup Guide](./docs/SUPABASE_SETUP_GUIDE.md).

4.  **Run the Development Server:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## License

This project is licensed under the MIT License.
