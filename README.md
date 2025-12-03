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
## Photos
<img width="1910" height="1137" alt="clinic-system1" src="https://github.com/user-attachments/assets/3145e312-14e4-4f52-8145-8cadfd8e23a3" />
<img width="1910" height="1010" alt="clinic-system2" src="https://github.com/user-attachments/assets/8de1054d-045b-436c-a336-8317a23ecd7a" />
<img width="1910" height="945" alt="clinic-system3" src="https://github.com/user-attachments/assets/4b72374e-061c-4493-af53-44b18ef47054" />
<img width="1910" height="945" alt="clinic-system4" src="https://github.com/user-attachments/assets/cebff397-b90d-4696-947a-df45023f8450" />
<img width="1910" height="1387" alt="clinic-system5" src="https://github.com/user-attachments/assets/67735803-5084-4980-950b-157f160af0ab" />
<img width="1910" height="1382" alt="clinic-system6" src="https://github.com/user-attachments/assets/65e96710-b13a-4e05-a6d4-75937e47a6c7" />
<img width="1910" height="1063" alt="clinic-system7" src="https://github.com/user-attachments/assets/f7ade5fd-465b-456a-a813-3b42d5b12814" />
<img width="1910" height="1060" alt="clinic-system8" src="https://github.com/user-attachments/assets/f6d024cb-53e0-48a8-8c20-c6e05e8e5540" />
<img width="1910" height="1602" alt="clinic-system9" src="https://github.com/user-attachments/assets/63677039-8a38-4dce-b038-4375d09a487c" />
<img width="1910" height="1548" alt="clinic-system10" src="https://github.com/user-attachments/assets/f5502354-c9ef-4024-b31a-5ed193978699" />

