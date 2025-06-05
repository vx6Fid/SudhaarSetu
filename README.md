# SudhaarSetu

SudhaarSetu is a full-stack civic engagement platform designed to streamline the reporting, assignment, and resolution of municipal issues. It enables citizens to submit complaints with minimal effort, while automating workflows for field officers, call center agents, and administrators. The platform ensures accountability, traceability, and efficient service delivery across municipal operations.


## Table of Contents

* [Project Overview](#project-overview)
* [Architecture and Tech Stack](#architecture-and-tech-stack)
* [Core Features](#core-features)
* [API Overview](#api-overview)
* [System Design Highlights](#system-design-highlights)
* [Setup and Configuration](#setup-and-configuration)
* [Challenges and Engineering Decisions](#challenges-and-engineering-decisions)
* [Future Enhancements](#future-enhancements)
* [Contact](#contact)


## Project Overview

In many urban areas, civic grievances such as broken streetlights, potholes, or unattended garbage often go unresolved due to inefficient reporting channels, lack of transparency, and disjointed communication among municipal roles.

**SudhaarSetu** addresses these challenges through:

* A simplified citizen interface for submitting complaints using images and location metadata.
* A backend system that routes and tracks complaints across roles and organizations.
* Role-based access control to enforce permissions and responsibilities.
* Real-time feedback and resolution tracking mechanisms to enhance trust and efficiency.


## Architecture and Tech Stack

**Frontend:**

* Next.js, React.js
* TailwindCSS for utility-first responsive UI

**Backend:**

* Node.js, Express.js
* RESTful architecture

**Database & Hosting:**

* PostgreSQL via Supabase (self-hosted)
* Hosting: Vercel (Frontend), Supabase/PostgreSQL (Backend and DB)

**Authentication & Security:**

* JSON Web Tokens (JWT) for secure session handling
* Bcrypt for password hashing
* Helmet and CORS for basic HTTP hardening

**External Services:**

* FreeImage.host API for uploading complaint and resolution images


## Core Features

### Citizen Experience

* Submit complaints using a photo and location; no need for typed descriptions.
* View and track all personal complaint submissions.
* Like and comment on others' complaints to signal priority.
* Provide feedback and rate resolution quality.

### Field Officer Experience

* Accept complaints routed by the system or manually assigned.
* Update complaint status with optional resolution image.
* View complaints by ward, category, or personal assignment.

### Call Center Agent Experience

* Log complaints on behalf of citizens who report via phone.
* Access citizen information and previous submissions.

### Administrator Experience

* Create and manage local organizations, wards, and categories.
* Register officers and agents under specific organizations.
* Manually assign complaints when required.
* View analytics (to be implemented) on resolution efficiency.


## API Overview

Below is a summarized view of available core endpoints. Full REST API documentation can be prepared in Swagger or Postman format on request.

### Authentication & User Management

| Method | Endpoint             | Description                                 |
| ------ | -------------------- | ------------------------------------------- |
| POST   | `/api/user/signup`   | Register a new citizen                      |
| POST   | `/api/user/login`    | Login as a citizen                          |
| POST   | `/api/admin/signup`  | Register a new admin                        |
| POST   | `/api/admin/login`   | Login as an admin                           |
| POST   | `/api/officer/login` | Login as field officer or call center staff |

### Complaints Management

| Method | Endpoint                      | Description                                 |
| ------ | ----------------------------- | ------------------------------------------- |
| POST   | `/api/complaint`              | File a new complaint                        |
| GET    | `/api/complaints`             | Get complaints filtered by ward, city, etc. |
| GET    | `/api/complaint/:id`          | Get details of a single complaint           |
| PUT    | `/api/complaints/:id/status`  | Officer updates complaint status            |
| PUT    | `/api/complaints/:id/accept`  | Officer accepts and is assigned a complaint |
| POST   | `/api/complaints/:id/comment` | Add a public comment                        |
| POST   | `/api/complaints/:id/like`    | Like/upvote a complaint                     |
| POST   | `/api/complaint/:id/feedback` | Submit user feedback and rating             |

### Administration & Organizational Management

| Method | Endpoint                          | Description                                |
| ------ | --------------------------------- | ------------------------------------------ |
| POST   | `/api/admin/create-organization`  | Register new organization with wards       |
| POST   | `/api/admin/create-officer`       | Add field officers or call center staff    |
| DELETE | `/api/admin/remove-user/:id`      | Remove officers from the organization      |
| POST   | `/api/admin/assign-field-officer` | Admin assigns complaint to a field officer |


## System Design Highlights

* **Modular Routing Structure**: The application maintains clear separation of concerns with distinct routing modules for authentication, complaints, admin tasks, and user utilities.
* **Secure File Uploads**: Uses `multer` and `freeimage.host` API to handle and store complaint and resolution images.
* **Transactional Integrity**: PostgreSQL transactions used for operations involving multiple table updates (e.g., complaint creation + organization linkage).
* **Access Control**: All protected routes are gated via JWTs and role-based middleware checks.
* **Scalable Query Filters**: Supports multi-param filtering for listing complaints (e.g., by status, ward, city, etc.).


## Setup and Configuration

**This project is not publicly deployable without access to the underlying database and API keys.**
However, the source code can be referenced for architectural or development insights.

### Environment Variables

The backend requires the following environment variables:

* `JWT_SECRET` – Secret key for signing JWTs
* `FREEIMAGE_API_KEY` – Key for uploading images
* `DATABASE_URL` – PostgreSQL connection string (managed via Supabase)

## Challenges and Engineering Decisions

* Implemented secure JWT handling and token-based route protection using custom middleware.
* Resolved edge cases around complaint duplication by enforcing logical uniqueness constraints (location + category + ward).
* Designed a hybrid model where complaints can be automatically assigned or manually routed by admins.
* Utilized image-hosting APIs to avoid the overhead and compliance complexity of managing file storage servers.

## Future Enhancements

* Implement role-specific dashboards with analytics (e.g., resolution time, ward-wise issue heatmap).
* Add support for multilingual complaint input and interface rendering.
* Enable SMS and email notifications for complaint updates and reminders.
* Migrate to a microservices architecture for horizontal scaling under load.
* Develop a React Native mobile app for real-time location tagging and push notifications.

