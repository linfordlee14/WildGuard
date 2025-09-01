# WildGuard

WildGuard is an AI-powered wildlife protection system that uses machine learning to predict poaching hotspots and help rangers protect endangered species.

## Features

- **Poaching Hotspot Prediction:** Uses a machine learning model to predict areas at high risk of poaching.
- **Interactive Map:** Visualizes poaching hotspots on an interactive map.
- **CSV Data Upload:** Allows users to upload their own poaching data in CSV format for analysis.
- **User Authentication:** Secure user registration and login.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Leaflet
- **Backend:** Flask, Python
- **Database:** Supabase

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.11
- A Supabase account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/wildguard.git
    cd wildguard
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Frontend Setup:**

    ```bash
    cd ../frontend
    npm install
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following environment variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SECRET_KEY=a_strong_secret_key
```

### Database Setup

1.  In your Supabase project, go to the SQL Editor and run the queries from `backend/schema.sql` to create the `users` and `datasets` tables.

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    flask run --port 5001
    ```

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## Deployment

This project is configured for deployment on Render. Simply connect your GitHub repository to Render and create a new Web Service, pointing to the `render.yaml` file. Make sure to set the required environment variables in the Render dashboard.