# eCommerce Inventory Dashboard Backend

This is the backend for the eCommerce Inventory Dashboard project. It is built using TypeScript and Node.js, providing a RESTful API for managing inventory and user authentication.

## Project Structure

- **src/**: Contains the source code for the backend application.
  - **controllers/**: Contains the controllers that handle incoming requests and responses.
    - `auth.controller.ts`: Manages user authentication.
    - `inventory.controller.ts`: Manages inventory operations.
  - **routes/**: Contains the routing configuration for the application.
    - `index.ts`: Integrates all routes.
  - **services/**: Contains business logic and interacts with the repository layer.
    - `inventory.service.ts`: Manages product-related logic.
  - **models/**: Contains data models and validation.
    - `product.model.ts`: Defines the structure of product data.
  - **repositories/**: Handles database operations.
    - `product.repository.ts`: Manages product data persistence.
  - **middlewares/**: Contains middleware functions for request processing.
    - `auth.middleware.ts`: Protects routes with authentication.
  - **utils/**: Contains utility functions.
    - `logger.ts`: Provides logging functionality.
  - **types/**: Contains TypeScript types and interfaces used throughout the application.
    - `index.ts`: Exports types and interfaces.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ecommerce-inventory-dashboard/backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   Copy the `.env.example` file to `.env` and fill in the required values.

4. **Run the application**:
   ```
   npm start
   ```

## API Endpoints

- **Authentication**
  - `POST /api/auth/login`: Log in a user.
  - `POST /api/auth/register`: Register a new user.

- **Inventory Management**
  - `GET /api/inventory`: Retrieve all products.
  - `POST /api/inventory`: Add a new product.
  - `PUT /api/inventory/:id`: Update an existing product.
  - `DELETE /api/inventory/:id`: Delete a product.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.