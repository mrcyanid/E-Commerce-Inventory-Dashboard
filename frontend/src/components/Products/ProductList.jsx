import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSync } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ProductList = () => {
    // Get user info for role-based access
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        sku: '',
        categoryId: 1
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            setLoading(false);
        }
    };

    // Function to refresh dashboard data
    const refreshDashboard = async () => {
        try {
            const statsResponse = await api.get('/dashboard/stats');
            localStorage.setItem('dashboardStats', JSON.stringify(statsResponse.data.data));
            window.dispatchEvent(new Event('productUpdated'));
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products?search=${search}`);
            setProducts(response.data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Search error:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted successfully!');
                await fetchProducts();
                await refreshDashboard();
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Failed to delete product');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
                toast.success('Product updated successfully!');
            } else {
                await api.post('/products', formData);
                toast.success('Product created successfully!');
            }
            setShowModal(false);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stockQuantity: '', sku: '', categoryId: 1 });
            await fetchProducts();
            await refreshDashboard();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stockQuantity: product.stockQuantity,
            sku: product.sku,
            categoryId: product.categoryId
        });
        setShowModal(true);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading products...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">📦 Products</h2>
                <div>
                    <Button variant="outline-secondary" className="me-2" onClick={fetchProducts}>
                        <FaSync className="me-1" /> Refresh
                    </Button>
                    {/* ✅ Only show Add Product button for Admin */}
                    {isAdmin && (
                        <Button 
                            variant="primary" 
                            onClick={() => { 
                                setEditingProduct(null); 
                                setFormData({ name: '', description: '', price: '', stockQuantity: '', sku: '', categoryId: 1 }); 
                                setShowModal(true); 
                            }}
                        >
                            <FaPlus className="me-2" /> Add Product
                        </Button>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <Row className="mb-4">
                <Col md={6}>
                    <div className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button variant="outline-primary" className="ms-2" onClick={handleSearch}>
                            <FaSearch />
                        </Button>
                    </div>
                </Col>
                {!isAdmin && (
                    <Col md={6} className="d-flex justify-content-end align-items-center">
                        <Badge bg="secondary" className="p-2">
                            👁️ View Only Mode (Staff)
                        </Badge>
                    </Col>
                )}
            </Row>

            {/* Products Table */}
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Table responsive hover>
                        <thead className="bg-light">
                            <tr>
                                <th>SKU</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="fw-bold">{product.sku}</td>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>
                                            <Badge bg={product.stockQuantity <= product.lowStockThreshold ? 'danger' : 'success'}>
                                                {product.stockQuantity}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={product.isActive ? 'success' : 'secondary'}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td>
                                            {/* ✅ Only show Edit/Delete buttons for Admin */}
                                            {isAdmin ? (
                                                <>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        className="me-2" 
                                                        onClick={() => openEditModal(product)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Badge bg="secondary">View Only</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        No products found.
                                        {isAdmin && ' Click "Add Product" to create one.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Add/Edit Modal - Only shown for Admin */}
            {isAdmin && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price ($)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Stock Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.stockQuantity}
                                            onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>SKU</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                            <Button variant="primary" type="submit">
                                {editingProduct ? 'Update' : 'Create'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}
        </Container>
    );
};

export default ProductList;