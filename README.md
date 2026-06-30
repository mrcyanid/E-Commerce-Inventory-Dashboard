# eCommerce Inventory Dashboard

## Overview
The eCommerce Inventory Dashboard is a full-stack application designed to manage product inventory efficiently. It consists of a backend built with TypeScript and a frontend developed using React. This project aims to provide a seamless experience for users to manage their inventory, track product statistics, and perform various inventory-related operations.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
- **src/**: Contains the source code for the backend application.
  - **controllers/**: Includes controllers for handling requests and responses.
    - `auth.controller.ts`: Manages user authentication.
    - `inventory.controller.ts`: Handles inventory-related operations.
  - **routes/**: Defines the routing configuration for the application.
    - `index.ts`: Integrates all routes.
  - **services/**: Contains business logic and interacts with the repository layer.
    - `inventory.service.ts`: Manages product-related logic.
  - **models/**: Defines data structures and validation.
    - `product.model.ts`: Represents the product model.
  - **repositories/**: Handles database operations.
    - `product.repository.ts`: Manages product data persistence.
  - **middlewares/**: Contains middleware functions for request processing.
    - `auth.middleware.ts`: Ensures routes are protected.
  - **utils/**: Utility functions for the application.
    - `logger.ts`: Provides logging functionality.
  - **types/**: TypeScript types and interfaces used throughout the application.
    - `index.ts`: Exports types for the backend.

- **package.json**: Lists dependencies and scripts for the backend.
- **tsconfig.json**: TypeScript configuration for the backend.
- **.env.example**: Example environment variables for configuration.
- **README.md**: Documentation for the backend application.

### Frontend
- **src/**: Contains the source code for the frontend application.
  - **pages/**: Includes different pages of the application.
    - `Dashboard.tsx`: Displays overall inventory statistics.
    - `Inventory.tsx`: Manages product listing and actions.
  - **components/**: Reusable components for the application.
    - `Header.tsx`: Provides navigation and branding.
    - `Sidebar.tsx`: Offers links to different sections.
    - `ProductTable.tsx`: Displays a table of products.
  - **store/**: Manages application state using Redux.
    - `inventory.slice.ts`: Handles inventory-related state.
  - **services/**: Functions for making API calls to the backend.
    - `api.ts`: Contains API interaction logic.
  - **styles/**: Global styles for the application.
    - `globals.css`: Defines global CSS styles.
  - **types/**: TypeScript types and interfaces for the frontend.
    - `index.ts`: Exports types for the frontend.

- **package.json**: Lists dependencies and scripts for the frontend.
- **tsconfig.json**: TypeScript configuration for the frontend.
- **README.md**: Documentation for the frontend application.

## Getting Started
To get started with the eCommerce Inventory Dashboard, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env` and updating the values as needed.

4. Start the backend server:
   ```
   npm run start
   ```

5. Navigate to the frontend directory and install dependencies:
   ```
   cd ../frontend
   npm install
   ```

6. Start the frontend application:
   ```
   npm run start
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.