# EmotionTracker

  

**EmotionTracker** is an advanced web application that captures and analyzes user emotions through facial expressions using AI. The application is designed with secure authentication and an intuitive dashboard for users and admins to manage and review emotional data effectively.

  

---

  

## Features

  

### **User Features**

-  **Secure Registration & Login**: Users can register with their email and facial data.

-  **Emotion Detection**: Analyze current facial expressions and record emotions.

-  **Emotion History**: View previously recorded emotions with timestamps.

  

### **Admin Features**

-  **User Management**: View and manage all registered users.

-  **Emotion Overview**: Access and analyze all user emotion data.

  

---

  

## Technology Stack

  

### **Frontend**

-  **React.js** with **Tailwind CSS**: For a responsive and modern user interface.

  

### **Backend**

-  **Python FastAPI**: To handle API requests and application logic.

  

### **Database**

-  **MySQL**: For efficient storage and management of user and emotion data.

  

### **AI Integration**

-  **Pre-trained Models**: Leverages advanced AI models for facial emotion recognition.

  

### **Authentication**

-  **JWT (JSON Web Tokens)**: Ensures secure user authentication.

  

---

  

## Installation

  

### **Prerequisites**

- Node.js

- Python 3.8+

- MySQL

- Git

  

### **Setup Instructions**

1. Clone the repository:

```bash

git clone https://github.com/Breakthrough-pvt-ltd/emotion-tracker.git

cd emotion-tracker

```
2. Frontend Setup :

```bash

cd frontend
npm install
npm run dev

```
3. Backend Setup:
```bash

cd backend
python -m venv venv
source venv/bin/activate  # For Linux/MacOS
venv\Scripts\activate     # For Windows
pip install -r requirements.txt
uvicorn main:app --reload

```
4. Database Setup:
    
    -   Create a MySQL database named `emotion_trackr`.
    -   Run the provided SQL migration script (located in `/backend/migrations`).
5. Run the Application:
    
    -   Start the backend server: `uvicorn main:app --reload`
    -   Start the frontend: `npm run dev`
---
  ## Usage

1.  **User Registration**:
    
    -   Register by providing basic details and allowing the application to capture facial data.
2.  **Emotion Detection**:
    
    -   Log in and navigate to the dashboard.
    -   Click "Record Emotion" to analyze your current facial expression.
3.  **Admin Panel**:
    
    -   Access user data and emotion trends through the admin interface.
  ---
  ## Contribution Guidelines

1.  Fork the repository.
2.  Create a feature branch:
    
    ```bash
    git checkout -b feature-name
    ```
    
3.  Commit your changes:
    
    ``` bash
    git commit -m "Add feature-name"
    ``` 
    
4.  Push the branch:
    
    ```bash
    git push origin feature-name
    ```
    
5.  Open a pull request.

----------

## License

This project is licensed under the MIT License.

----------

## Contact

For any questions or support, please reach out at:

-   **Email**: noealrajeev987@gmail.com
-   **GitHub**: [Noeal Rajeev](https://github.com/NoealRajeev)
