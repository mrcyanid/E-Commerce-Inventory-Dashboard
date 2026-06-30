import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaUser, FaBox, FaShoppingCart, FaChartBar } from 'react-icons/fa';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
                <Container fluid>
                    <Navbar.Brand className="fw-bold" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                        <FaBox className="me-2" />
                        Inventory Dashboard
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => navigate('/dashboard')}>
                                <FaChartBar className="me-1" /> Dashboard
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate('/products')}>
                                <FaBox className="me-1" /> Products
                            </Nav.Link>
                            <Nav.Link onClick={() => navigate('/orders')}>
                                <FaShoppingCart className="me-1" /> Orders
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Navbar.Text className="text-white me-3">
                                <FaUser className="me-1" /> {user?.name}
                            </Navbar.Text>
                            <Button 
                                variant="outline-light" 
                                size="sm" 
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="me-1" /> Logout
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container fluid className="py-3">
                {children}
            </Container>
        </>
    );
};

export default Layout;