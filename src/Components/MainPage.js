import React from 'react';
import fypImage from '../pictures/fyp.jpg'; // Adjust the path to your image
import '../Components/MainPage.css'; // Ensure the CSS file is correctly referenced
import Card from './Card';
import f1Image from '../pictures/f1.jpeg';
import f2Image from '../pictures/f2.png';
import f3Image from '../pictures/f3.jpeg';
const MainPage = () => {
    return (
        <div className="main-page">
            <img src={fypImage} alt="Background" className="background-image" />
            <h1>Welcome to Social Manager Pro</h1>
            <p>Manage your social media accounts with ease.</p>
            <div className="card-container">
                <Card
                    title="Schedule Posts Ahead of Time"
                    description="Plan and schedule your social media posts in advance. Ensure your content reaches your audience at the optimal times, even when you're not online."
                    image={f1Image} // Update with your image path
                />
                <Card
                    title="Track Your Engagement"
                    description="Get detailed analytics on your social media performance. Monitor likes, shares, comments, and more to understand what works best for your audience."
                    image={f2Image} // Update with your image path
                />
                <Card
                    title="Manage Multiple Accounts"
                    description="Easily manage and switch between multiple social media accounts from one platform. Streamline your workflow and save time."
                    image={f3Image} // Update with your image path
                />
                <Card
                    title="Manage Multiple Accounts"
                    description="Easily manage and switch between multiple social media accounts from one platform. Streamline your workflow and save time."
                    image={f3Image} // Update with your image path
                />
                <Card
                    title="Manage Multiple Accounts"
                    description="Easily manage and switch between multiple social media accounts from one platform. Streamline your workflow and save time."
                    image={f3Image} // Update with your image path
                />
                <Card
                    title="Manage Multiple Accounts"
                    description="Easily manage and switch between multiple social media accounts from one platform. Streamline your workflow and save time."
                    image={f3Image} // Update with your image path
                />
                <Card
                    title="Manage Multiple Accounts"
                    description="Easily manage and switch between multiple social media accounts from one platform. Streamline your workflow and save time."
                    image={f3Image} // Update with your image path
                />
            </div>
        </div>
    );
};

export default MainPage;
