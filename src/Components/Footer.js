import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Footer = () => {
    return (
        <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f1f1f1' }}>
            <p>© 2024 Your Company Name. All rights reserved.</p>

            {/* Privacy Policy Button */}
            <Link to="/privacy-policy" style={{ textDecoration: 'none' }}>
                <button
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        marginTop: '10px'
                    }}
                >
                    Privacy Policy
                </button>
            </Link>
        </footer>
    );
};

export default Footer;
