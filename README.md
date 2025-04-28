# SynerHarvest
  
## AI-driven food supply chain management system

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](http://synerharvest.sor2.online/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Overview

SynerHarvest is a comprehensive platform connecting farmers, distributors, retailers, and consumers through an end-to-end food supply chain management system. The application provides complete traceability of food products from farm to table, enhancing food safety, reducing waste, and building consumer trust through transparency.

**Live Demo:** [http://synerharvest.sor2.online/](http://synerharvest.sor2.online/)



## ✨ Key Features


### Data Entry and Management

Comprehensive tools for farmers, distributors, and retailers to log and manage product information throughout the supply chain.

- Farmers can create and manage food batches with detailed information
- Distributors log transport conditions and track shipments
- Retailers record receipt and sales of products
- Complete audit trail of all food items


### Traceability System

End-to-end tracking of food products from farm to consumer, ensuring transparency and accountability.

- Unique QR codes for each batch
- Complete timeline of product journey
- Environmental condition tracking (temperature, humidity)
- Verification of product authenticity


### Real-time Updates

Live notifications and updates when products move through the supply chain.

- WebSocket integration for instant updates
- Notification system for stakeholders
- Real-time status changes visible to all participants
- Immediate alerts for condition anomalies


### Analytics Dashboard

Comprehensive data visualization and analytics tools for supply chain optimization.

- Key performance metrics for supply chain efficiency
- Environmental impact assessment
- Historical trend analysis
- Custom report generation


### Consumer Interface

Public-facing portal where consumers can trace product origins by scanning QR codes.

- Mobile-friendly QR code scanning
- Detailed product journey visualization
- Information about farming practices and conditions
- Carbon footprint tracking and sustainability metrics


### AI-Driven Features

Intelligent tools powered by machine learning and predictive analytics.

- Demand forecasting based on historical data and market trends
- Anomaly detection for quality assurance
- Predictive maintenance for storage facilities


## 🛠️ Technology Stack

### Backend
- **Framework:** Spring Boot 3.4.4
- **Language:** Java 17
- **Database:** PostgreSQL
- **Security:** JWT, Spring Security
- **APIs:** 
  - RESTful APIs
  - WebSockets for real-time updates
  - OpenAPI/Swagger documentation

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **State Management:** React Context API
- **Data Visualization:** Recharts
- **Libraries:**
  - html5-qrcode
  - qrcode
  - axios
  - jwt-decode
  - react-router-dom

### Deployment
- **Server:** AWS EC2 
- **Database:** AWS RDS (PostgreSQL)
- **Containerization:** Docker

## 📸 Screenshots

<div align="center">
  <img src="docs/screenshots/product_tracing.png" alt="Product Tracing" width="45%"/>
  <img src="docs/screenshots/analytics.png" alt="Analytics Dashboard" width="45%"/>
</div>

<div align="center">
  <img src="docs/screenshots/batch_creation.png" alt="Batch Creation" width="45%"/>
  <img src="docs/screenshots/qr_scanning.png" alt="QR Code Scanning" width="45%"/>
</div>

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Maven 3.8+

### Backend Setup

```bash
git clone https://github.com/yourusername/synerharvest.git
cd synerharvest

# Configure database
createdb foodsupplychain

# Configure application.properties with your database credentials
# Build and run
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```


## 📱 Application Structure

### Backend Structure

```
src/main/java/com/food_supply_chain/
├── config/          # Configuration classes
├── controller/      # REST API controllers
├── exception/       # Exception handling
├── mapper/          # DTO-Entity mappers
├── model/           # Entity models and DTOs
├── repository/      # Database repositories
├── security/        # Security configuration
├── service/         # Business logic services
└── util/            # Utility classes
```

### Frontend Structure

```
src/
├── api/             # API client and configuration
├── components/      # Reusable UI components
├── contexts/        # React context providers
├── pages/           # Application pages
├── services/        # Service layer for API calls
├── styles/          # CSS stylesheets
└── utils/           # Utility functions
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password encryption with BCrypt
- Input validation and sanitization
- Protection against common web vulnerabilities

## 📝 API Documentation

API documentation is available through Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

## 🧪 Testing

### Backend Testing
```bash
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- Shehan Vinod - [shehanvinodwannigama@gmail.com](mailto:shehanvinodwannigama@gmail.com)

## 🔗 Links

- [Live Demo](http://synerharvest.sor2.online/)
- [GitHub Repository](https://github.com/yourusername/synerharvest)


---

<div align="center">
  <p>© 2025 SynerHarvest - Bringing transparency and efficiency to the food supply chain</p>
</div>
