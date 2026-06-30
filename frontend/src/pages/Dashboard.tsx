import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ProductTable from '../components/ProductTable';

const Dashboard: React.FC = () => {
    const inventory = useSelector((state: RootState) => state.inventory.items);
    const totalProducts = inventory.length;

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Total Products: {totalProducts}</h2>
            <ProductTable products={inventory} />
        </div>
    );
};

export default Dashboard;