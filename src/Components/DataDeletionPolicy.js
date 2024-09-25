// src/components/DataDeletionPolicy.js

import React from 'react';

const DataDeletionPolicy = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Data Deletion Policy for Social Manager Pro</h1>
            <p>
                If you would like to delete your data from Social Manager Pro, please follow the steps below:
            </p>
            <ul>
                <li>
                    Send an email to <a href="mailto:datadeletion@gmail.com">datadeletion@yahoomail.com</a>
                    with the subject "Data Deletion Request".
                </li>
                <li>
                    Include your full name, email address, and a brief description of your request.
                </li>
                <li>
                    We will review and process your request within 7 business days and confirm via email once your data
                    has been deleted.
                </li>
            </ul>
            <p>
                If you have any questions or concerns, feel free to contact us at the above email address.
            </p>
        </div>
    );
};

export default DataDeletionPolicy;
