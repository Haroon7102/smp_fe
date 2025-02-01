import React, { useState } from 'react';
import FacebookLoginCheck from './FacebookLoginCheck';
import TotalPosts from './TotalPosts';

const ParentComponent = () => {
    const [email, setEmail] = useState(null); // State to store the email

    return (
        <div>
            <FacebookLoginCheck setEmail={setEmail} /> {/* Pass setEmail to facebookLoginCheck */}
            <TotalPosts email={email} /> {/* Pass email to Dashboard */}
        </div>
    );
};

export default ParentComponent;
