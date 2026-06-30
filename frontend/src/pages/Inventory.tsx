import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/inventory.slice';
import ProductTable from '../components/ProductTable';

const Inventory: React.FC = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: any) => state.inventory.products);
    const loading = useSelector((state: any) => state.inventory.loading);
    const error = useSelector((state: any) => state.inventory.error);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Inventory</h1>
            <ProductTable products={products} />
        </div>
    );
};

export default Inventory;