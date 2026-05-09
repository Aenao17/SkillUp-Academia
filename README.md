# SkillUp Academia

SkillUp Academia is a learning platform where users can complete educational modules, read lessons, take tests, and track their progress.

---

# Tech Stack

## Backend
- Java 17
- Spring Boot
- Spring Security + JWT
- PostgreSQL
- Docker
- Swagger / OpenAPI

## Frontend
- Ionic Angular
- TypeScript

---

# ▶ How to run

## 1. Clone the repository

```bash
git clone <repository-url>
```

---

## 2. Install Docker Desktop

Download and install Docker Desktop:

https://docs.docker.com/get-started/get-docker

---

## 3. Start Backend

Run the following command inside the `Backend` folder:

```bash
docker compose up --build
```

Backend will run on:

```text
http://localhost:8080
```

---

## 4. Install Frontend dependencies

Go to the `Frontend` folder and run:

```bash
npm install
```

Make sure you have Ionic CLI installed:

```bash
npm install -g @ionic/cli
```

Documentation:

https://ionicframework.com/docs/intro/cli

---

## 5. Start Frontend

Run inside the `Frontend` folder:

```bash
ionic serve
```

Frontend will run on:

```text
http://localhost:8100
```

---

# Default Accounts

## Admin

```json
{
  "username": "admin",
  "password": "admin"
}
```

## Student

```json
{
  "username": "student",
  "password": "student"
}
```

---

# Authentication

Authentication is done using JWT tokens.

After login, include the token in requests:

```http
Authorization: Bearer <your_token>
```

---

# Swagger

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI Docs:

```text
http://localhost:8080/v3/api-docs
```

---

# API Routes

---

# Auth Routes

Base URL:

```text
/api/auth
```

---

## Register

### Request

```http
POST /api/auth/register
```

### Body

```json
{
  "username": "john",
  "password": "1234",
  "role": "USER"
}
```

### Response

```json
{
  "id": 3,
  "username": "john",
  "role": "USER"
}
```

---

## Login

### Request

```http
POST /api/auth/login
```

### Body

```json
{
  "username": "student",
  "password": "student"
}
```

### Response

```json
{
  "accessToken": "jwt-token",
  "refreshToken": "",
  "tokenType": "Bearer"
}
```

---

# User Routes

Base URL:

```text
/api/user
```

Authentication required.

---

## Get Current User

### Request

```http
GET /api/user/me
```

### Response

```json
{
  "id": 2,
  "username": "student",
  "role": "USER"
}
```

---

## Get User Progress

### Request

```http
GET /api/user/progress
```

### Response

```json
[
  {
    "lessonId": 1,
    "lessonTitle": "Communication Basics",
    "score": 90,
    "completed": true
  }
]
```

---

## Get User Modules

### Request

```http
GET /api/user/modules
```

### Response

```json
[
  {
    "id": 1,
    "title": "Communication Skills",
    "description": "Master essential communication skills.",
    "completed": true,
    "lessons": [
      {
        "id": 1,
        "title": "Communication Basics",
        "description": "Learn how to communicate effectively.",
        "score": 90,
        "completed": true
      }
    ]
  }
]
```

---

# Lesson Routes

Base URL:

```text
/api/lessons
```

Authentication required.

---

## Get All Lessons

### Request

```http
GET /api/lessons
```

### Response

```json
[
  {
    "id": 1,
    "title": "Communication Basics",
    "description": "Learn how to communicate effectively.",
    "score": null,
    "completed": false
  }
]
```

---

## Get Lesson By ID

### Request

```http
GET /api/lessons/1
```

### Response

```json
{
  "id": 1,
  "title": "Communication Basics",
  "description": "Learn how to communicate effectively.",
  "content": "Communication is the process of exchanging information...",
  "completed": true,
  "score": 90,
  "test": {
    "id": 1,
    "title": "Communication Test",
    "passingScore": 75
  }
}
```

---

# Module Routes

Base URL:

```text
/api/modules
```

Authentication required.

---

## Get All Modules

### Request

```http
GET /api/modules
```

### Response

```json
[
  {
    "id": 1,
    "title": "Communication Skills",
    "description": "Master essential communication skills.",
    "completed": true,
    "lessons": [
      {
        "id": 1,
        "title": "Communication Basics",
        "description": "Learn how to communicate effectively.",
        "score": 90,
        "completed": true
      }
    ]
  }
]
```

---

## Get Module By ID

### Request

```http
GET /api/modules/1
```

### Response

```json
{
  "id": 1,
  "title": "Communication Skills",
  "description": "Master essential communication skills.",
  "completed": true,
  "lessons": [
    {
      "id": 1,
      "title": "Communication Basics",
      "description": "Learn how to communicate effectively.",
      "score": 90,
      "completed": true
    }
  ]
}
```

---

# Progress Routes

Base URL:

```text
/api/progress
```

Authentication required.

---

## Submit Lesson Test

### Request

```http
POST /api/progress/submit-test
```

### Body

```json
{
  "lessonId": 1,
  "score": 85
}
```

### Response

```json
{
  "lessonId": 1,
  "lessonTitle": "Communication Basics",
  "score": 85,
  "completed": true
}
```

---

## Get User Progress

### Request

```http
GET /api/progress
```

### Response

```json
[
  {
    "lessonId": 1,
    "lessonTitle": "Communication Basics",
    "score": 85,
    "completed": true
  }
]
```

---

# Admin Routes

Base URL:

```text
/api/admin
```

Admin authentication required.

---

## Get All Users

### Request

```http
GET /api/admin/users
```

### Response

```json
[
  {
    "id": 1,
    "username": "admin",
    "role": "ADMIN"
  },
  {
    "id": 2,
    "username": "student",
    "role": "USER"
  }
]
```

---

## Create Lesson

### Request

```http
POST /api/admin/lessons
```

### Body

```json
{
  "title": "Teamwork",
  "description": "Learn teamwork basics.",
  "content": "Teamwork is essential in modern organizations.",
  "test": {
    "title": "Teamwork Test",
    "passingScore": 75
  }
}
```

---

## Create Module

### Request

```http
POST /api/admin/modules
```

### Body

```json
{
  "title": "Soft Skills",
  "description": "Essential soft skills for students.",
  "lessonIds": [1, 2]
}
```

---

# Reset Database

```bash
docker compose down -v
docker compose up --build
```
