const fs = require('fs');
const path = require('path');

// README content
const readmeContent = `# SynerHarvest: AI-Driven Food Supply Chain Management System

<div align="center">
  <img src="frontend/public/logo.svg" alt="SynerHarvest Logo" width="200"/>
  <h3>Transparency from Farm to Fork</h3>
</div>

## 📋 Overview

SynerHarvest is a comprehensive solution for managing and tracking food products throughout the supply chain. The platform connects farmers, distributors, retailers, and consumers, providing end-to-end visibility and traceability for food products from their origin to the consumer's table.

Using blockchain-inspired technology, AI-driven analytics, and IoT integration, SynerHarvest ensures food safety, reduces waste, optimizes logistics, and builds consumer trust through transparency.

## ✨ Key Features

### 🧑‍🌾 Role-Based Functionality

- **Farmers**: Create and manage food batches, record harvests, and monitor products
- **Distributors**: Track shipments, record transport conditions, and optimize routes
- **Retailers**: Manage inventory, record sales, and verify product authenticity
- **Consumers**: Trace product origins and journey by scanning QR codes

### 🔄 Complete Traceability

- Unique QR codes for each batch
- Complete product journey tracking
- Immutable record of all supply chain events
- Environmental condition monitoring (temperature, humidity)

### 📊 Analytics & Insights

- Supply chain efficiency metrics
- Product journey visualization
- Environmental impact assessment
- AI-driven demand forecasting

### 📱 User-Friendly Interfaces

- Responsive web application
- Public product tracking portal
- Mobile-friendly QR code scanning
- Role-specific dashboards

### 🧠 AI & Advanced Features

- Predictive analytics for product demand
- Anomaly detection for quality assurance
- Supply chain optimization algorithms
- Carbon footprint tracking

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.4.4
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: JWT Authentication
- **API Documentation**: OpenAPI/Swagger

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API
- **UI Components**: Custom components
- **Data Visualization**: Recharts
- **QR Code Handling**: qrcode, html5-qrcode

### DevOps & Deployment
- **Version Control**: Git
- **Build Tool**: Maven (backend), npm (frontend)
- **Database Migration**: Flyway

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Backend Setup

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/synerharvest.git
   cd synerharvest
   \`\`\`

2. Configure the database
   \`\`\`bash
   # Create PostgreSQL database
   createdb foodsupplychain
   \`\`\`

3. Configure application properties
   \`\`\`bash
   # Update src/main/resources/application.properties with your database credentials
   spring.datasource.url=jdbc:postgresql://localhost:5432/foodsupplychain
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   \`\`\`

4. Build and run the backend
   \`\`\`bash
   mvn clean install
   mvn spring-boot:run
   \`\`\`
   The backend server will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Configure environment variables
   \`\`\`bash
   # Create .env file
   echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env
   \`\`\`

4. Start the development server
   \`\`\`bash
   npm run dev
   \`\`\`
   The frontend will be available at http://localhost:5173

### Initial Login

After starting both backend and frontend, you can log in with the following demo accounts:

- **Farmer**: 
  - Username: farmer_demo
  - Password: Farm@2023

- **Distributor**: 
  - Username: dist_demo
  - Password: Dist@2023

- **Retailer**: 
  - Username: retail_demo
  - Password: Retail@2023

- **Consumer**: 
  - Username: consumer_demo
  - Password: Consumer@2023

## 📱 Application Structure

### Backend Structure

\`\`\`
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
\`\`\`

### Frontend Structure

\`\`\`
src/
├── api/             # API client and configuration
├── components/      # Reusable UI components
├── contexts/        # React context providers
├── pages/           # Application pages
├── services/        # Service layer for API calls
├── styles/          # CSS stylesheets
└── utils/           # Utility functions
\`\`\`

## 📝 API Documentation

API documentation is available through Swagger UI at:
\`\`\`
http://localhost:8080/swagger-ui.html
\`\`\`

## 🔒 Security

- **Authentication**: JWT-based token authentication
- **Password Security**: BCrypt password hashing
- **Authorization**: Role-based access control
- **API Security**: CORS configuration and request validation

## 🧪 Testing

### Backend Testing
\`\`\`bash
mvn test
\`\`\`

### Frontend Testing
\`\`\`bash
cd frontend
npm test
\`\`\`

## 📚 Documentation

Additional documentation:

- [User Guide](docs/user-guide.md)
- [API Documentation](docs/api-docs.md)
- [Development Guide](docs/dev-guide.md)
- [Deployment Guide](docs/deployment.md)

## 📊 Screenshots

<div align="center">
  <img src="docs/screenshots/dashboard.png" alt="Dashboard" width="45%"/>
  <img src="docs/screenshots/traceability.png" alt="Traceability" width="45%"/>
</div>

<div align="center">
  <img src="docs/screenshots/batch_detail.png" alt="Batch Details" width="45%"/>
  <img src="docs/screenshots/qr_code.png" alt="QR Code Tracking" width="45%"/>
</div>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Project Lead - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/yourusername/synerharvest](https://github.com/yourusername/synerharvest)

---

<div align="center">
  <p>SynerHarvest - Bringing transparency and efficiency to the food supply chain</p>
</div>`;

// Function to create README file
function createReadmeFile() {
  try {
    // Get the project root directory
    const projectRoot = process.cwd();
    
    // Create README.md file
    fs.writeFileSync(path.join(projectRoot, 'README.md'), readmeContent);
    
    console.log('README.md file created successfully!');
  } catch (error) {
    console.error('Error creating README.md file:', error);
  }
}

// Create docs directory and placeholder files
function createDocsFolders() {
  try {
    const projectRoot = process.cwd();
    const docsDir = path.join(projectRoot, 'docs');
    const screenshotsDir = path.join(docsDir, 'screenshots');
    
    // Create directories if they don't exist
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
    }
    
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    }
    
    // Create placeholder documentation files
    const docs = [
      { name: 'user-guide.md', content: '# User Guide\n\nThis document provides instructions for using the SynerHarvest application.' },
      { name: 'api-docs.md', content: '# API Documentation\n\nThis document describes the SynerHarvest API endpoints and usage.' },
      { name: 'dev-guide.md', content: '# Development Guide\n\nThis document provides guidelines for developers working on the SynerHarvest project.' },
      { name: 'deployment.md', content: '# Deployment Guide\n\nThis document provides instructions for deploying the SynerHarvest application.' }
    ];
    
    docs.forEach(doc => {
      fs.writeFileSync(path.join(docsDir, doc.name), doc.content);
    });
    
    console.log('Documentation placeholder files created successfully!');
  } catch (error) {
    console.error('Error creating documentation files:', error);
  }
}

// Create LICENSE file
function createLicenseFile() {
  try {
    const projectRoot = process.cwd();
    const currentYear = new Date().getFullYear();
    
    const licenseContent = `MIT License

Copyright (c) ${currentYear} SynerHarvest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
    
    fs.writeFileSync(path.join(projectRoot, 'LICENSE'), licenseContent);
    
    console.log('LICENSE file created successfully!');
  } catch (error) {
    console.error('Error creating LICENSE file:', error);
  }
}

// Run the script
createReadmeFile();
createDocsFolders();
createLicenseFile();

console.log('All files created successfully!');
