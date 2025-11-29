# Clinic Management System - Backend

A Node.js/Express backend API for the Clinic Management System.

## Features

- User authentication (JWT)
- Role-based access control (Patient/Doctor)
- Appointment management
- Medical records management
- Clinic types management

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Navigate to the backend folder:

   ```bash
   cd "clinic  React backend"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Copy `.env` file and update the values:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/clinic_management
     JWT_SECRET=your_super_secret_jwt_key_change_in_production
     JWT_EXPIRE=7d
     NODE_ENV=development
     ```

4. Seed the database (optional):

   ```bash
   npm run seed
   ```

5. Start the server:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint             | Description       | Access  |
| ------ | -------------------- | ----------------- | ------- |
| POST   | `/api/auth/register` | Register new user | Public  |
| POST   | `/api/auth/login`    | Login user        | Public  |
| GET    | `/api/auth/me`       | Get current user  | Private |
| GET    | `/api/auth/logout`   | Logout user       | Private |

### Users

| Method | Endpoint                  | Description         | Access      |
| ------ | ------------------------- | ------------------- | ----------- |
| GET    | `/api/users/profile`      | Get user profile    | Private     |
| PUT    | `/api/users/profile`      | Update user profile | Private     |
| GET    | `/api/users/doctors`      | Get all doctors     | Private     |
| GET    | `/api/users/patients`     | Get all patients    | Doctor only |
| GET    | `/api/users/patients/:id` | Get patient by ID   | Doctor only |

### Appointments

| Method | Endpoint                               | Description                | Access       |
| ------ | -------------------------------------- | -------------------------- | ------------ |
| POST   | `/api/appointments`                    | Create appointment         | Patient only |
| GET    | `/api/appointments`                    | Get user's appointments    | Private      |
| GET    | `/api/appointments/:id`                | Get single appointment     | Private      |
| PUT    | `/api/appointments/:id`                | Update appointment         | Private      |
| DELETE | `/api/appointments/:id`                | Cancel appointment         | Private      |
| GET    | `/api/appointments/date/:date`         | Get appointments by date   | Doctor only  |
| GET    | `/api/appointments/patient/:patientId` | Get patient's appointments | Doctor only  |

### Medical Records

| Method | Endpoint                                  | Description           | Access      |
| ------ | ----------------------------------------- | --------------------- | ----------- |
| POST   | `/api/medical-records`                    | Create medical record | Doctor only |
| GET    | `/api/medical-records`                    | Get medical records   | Private     |
| GET    | `/api/medical-records/:id`                | Get single record     | Private     |
| PUT    | `/api/medical-records/:id`                | Update record         | Doctor only |
| DELETE | `/api/medical-records/:id`                | Delete record         | Doctor only |
| GET    | `/api/medical-records/patient/:patientId` | Get patient's records | Doctor only |

### Clinic Types

| Method | Endpoint                | Description          | Access      |
| ------ | ----------------------- | -------------------- | ----------- |
| GET    | `/api/clinic-types`     | Get all clinic types | Public      |
| POST   | `/api/clinic-types`     | Create clinic type   | Doctor only |
| PUT    | `/api/clinic-types/:id` | Update clinic type   | Doctor only |
| DELETE | `/api/clinic-types/:id` | Delete clinic type   | Doctor only |

## Test Accounts

After running the seed script:

- **Doctor:** doctor@example.com / password
- **Patient:** patient@example.com / password

## Project Structure

```
src/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── appointment.controller.js
│   ├── medicalRecord.controller.js
│   └── clinicType.controller.js
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js
│   ├── Appointment.js
│   ├── MedicalRecord.js
│   └── ClinicType.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── appointment.routes.js
│   ├── medicalRecord.routes.js
│   └── clinicType.routes.js
├── seeders/
│   └── seed.js            # Database seeder
└── server.js              # Entry point
```
