# Home Library System

### Hierarchical Relationship

**Home Library** -> **Book** -> **Comment**

---

### Project Goal

The project's goal is to create a web platform that allows users to efficiently create and manage personal book libraries, share them with others, and write comments about books.

---

### Operating Principle

The platform consists of two parts: a **web interface** that users, personal library managers, or guests will use, and an **application programming interface (API)** that will be used to connect the web interface with the server.

---

## How to Run the Application

### Prerequisites

- Docker and Docker Compose
- Java 21 or higher
- Maven
- Node.js (v18 or higher) and npm
- Firebase project with service account credentials

---

### Firebase Configuration

The application uses Firebase for authentication. Before running the backend:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Generate a service account key (Project Settings → Service Accounts → Generate New Private Key)
3. Save the JSON file as `firebase-adminsdk.json` in `library-system-be/src/main/resources/`
4. Update `application.yml` with your Firebase Web API Key if needed

---

### 1. Database (PostgreSQL with Docker)

In the `library-system-be` directory:
```bash
docker-compose up -d
```

Stop the database:
```bash
docker-compose down
```

---

### 2. Backend (Spring Boot)

In the `library-system-be` directory:
```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

Swagger UI: `http://localhost:8080/swagger-ui.html`

---

### 3. Frontend (React with Vite)

In the `library-system-fe` directory:
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

---

### Full Application Startup

1. Start the database: `docker-compose up -d` (in `library-system-be`)
2. Start the backend: `./mvnw spring-boot:run` (in `library-system-be`)
3. Start the frontend: `npm run dev` (in `library-system-fe`)

Access the application at `http://localhost:5173`