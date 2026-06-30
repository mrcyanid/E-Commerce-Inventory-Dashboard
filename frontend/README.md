# Frontend Inventory Dashboard

This is the frontend part of the eCommerce Inventory Dashboard project. It is built using React and TypeScript, providing a user-friendly interface for managing inventory.

## Project Structure

```
frontend
├── src
│   ├── main.tsx          # Entry point of the application
│   ├── App.tsx           # Main application component
│   ├── pages             # Contains different pages of the application
│   │   ├── Dashboard.tsx  # Dashboard page displaying overall statistics
│   │   └── Inventory.tsx  # Inventory page for product management
│   ├── components        # Reusable components
│   │   ├── Header.tsx     # Header component for navigation
│   │   ├── Sidebar.tsx    # Sidebar component with links
│   │   └── ProductTable.tsx # Component displaying product table
│   ├── store             # Redux store configuration
│   │   └── inventory.slice.ts # Slice for managing inventory state
│   ├── services          # API service functions
│   │   └── api.ts        # Functions for making API calls
│   ├── styles            # Styles for the application
│   │   └── globals.css    # Global CSS styles
│   └── types             # TypeScript types and interfaces
│       └── index.ts      # Type definitions for the frontend
├── package.json          # npm configuration for frontend
└── tsconfig.json         # TypeScript configuration for frontend
```

## Getting Started

To get started with the frontend application, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ecommerce-inventory-dashboard/frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Features

- User authentication and authorization
- Inventory management with CRUD operations
- Responsive design with a modern UI
- Real-time updates and state management using Redux

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.