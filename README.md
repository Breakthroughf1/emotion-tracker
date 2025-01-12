# EmotionTracker

**EmotionTracker** is a cutting-edge web application developed by the Breakthrough team, leveraging AI to analyze user emotions through facial expressions. Designed with secure authentication, EmotionTracker provides an intuitive dashboard for users and administrators to manage and review emotional data effectively.

---

## Table of contents

- Features
- Technology Stack
- Installation
- Usage
- Contribution Guidelines
- License
- Maintainers
- Contact

## Features

### **User Features**

- **Secure Login and Registration**: Users can register with their email and log in securely using advanced authentication mechanisms.
- **Emotion Recording**: Analyze and record facial expressions to capture emotions.
- **Profile Management**: Update profile details, including name, email, and profile picture. Users can also delete their accounts if needed.
- **Help and Support**: Access assistance for troubleshooting and guidance.

### **Admin Features**

- **All-User Emotion Records**: View and analyze emotional data for all registered users.
- **User Management**: Manage user accounts and access user details.
- **Administrative Power**: Includes all features available to regular users.

---

## Technology Stack

### **Frontend**

- **React.js** with **Tailwind CSS**: For a modern, responsive, and user-friendly interface.

### **Backend**

- **Python FastAPI**: To handle API requests and business logic efficiently.

### **Database**

- **MySQL**: For robust storage and management of user and emotional data.

### **AI Integration**

- **Pre-trained Models**: Utilizes advanced AI models for facial emotion recognition.

### **Authentication**

- **JWT (JSON Web Tokens)**: Ensures secure and reliable user authentication.

---

## Installation

### **Prerequisites**

- [Node.js](https://nodejs.org/en)
- [Python 3.8+](https://www.python.org/downloads/)
- [MySQL](https://www.mysql.com/downloads/)
- [Git](https://git-scm.com/)

### **Setup Instructions**

1. Clone the repository:

   ```bash
   git clone https://github.com/Breakthrough-pvt-ltd/emotion-tracker.git
   cd emotion-tracker
   ```

2. Frontend Setup:

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

4. Environment Configuration:
   To set up the environment variables required for the backend, follow these steps:

   1. **Navigate** to the backend directory of the project.

   2. Create a .env file in the backend directory.

   3. Populate the .env file with the required variables. Below is an example structure for reference:

   ```bash
   # Example .env file structure

   # Secret key for JWT token generation

   SECRET_KEY=<your-secret-key>

   # Database connection URL

   DATABASE_URL=mysql+aiomysql://<username>:<password>@<host>/<database_name>
   ```

   4. Replace `<your-secret-key>`, `<username>`, `<password>`, `<host>`, and `<database_name>` with your specific values.

5. Database Setup:

   - Create a MySQL database (e.g., `emotion_tracker`).

6. Run the Application:
   - Start the backend server: `uvicorn main:app --reload`
   - Start the frontend: `npm run dev`

---

## Usage

1. **User Registration**:

   - Register by providing your email and basic details.

2. **Emotion Recording**:

   - Log in and navigate to the dashboard.
   - Use the **"Record Emotion"** feature to analyze and save facial expressions.

3. **Profile Management**:

   - Update your **name**, **email**, or **profile picture**. Delete your account if necessary.

4. **Admin Panel**:
   - Access and manage user data, and review emotion records for insights.

---

## Contribution Guidelines

This project was developed by the talented team at **Breakthrough**, with significant contributions from our lead developer, **Noeal Rajeev**. The collective effort reflects our commitment to building impactful and innovative solutions for modern challenges. We take pride in delivering high-quality, user-centric software that aligns with industry standards.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add feature-name"
   ```

4. Push the branch:

   ```bash
   git push origin feature-name
   ```

5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. Copyright ©️ 2025 **Breakthrough**. All rights reserved.

---

## Maintainers

- Noeal Rajeev Thaleeparambil - [@NoealRajeev](https://github.com/NoealRajeev)
- Abiya Biju - [@abiya005](https://github.com/abiya005)
- Alfred Shaju - [@alfredshaju7](https://github.com/alfredshaju7)

## Contact

For questions or support, please reach out at:

- **Email**: info@breakthrough.ind.in
- **GitHub**: [Breakthrough](https://github.com/Breakthrough-pvt-ltd)
