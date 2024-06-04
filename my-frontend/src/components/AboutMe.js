import React from 'react';
import { useAuth } from '../AuthContext';

const AboutMe = () => {
    const { msg } = useAuth();

    return (
        <div>
            {/* Display any messages from the context */}
            {msg.message && <div className={`alert alert-${msg.type}`}>{msg.message}</div>}
            <h1>About Me</h1>
            <p>
                Hello! I'm glad you're here. I love building web apps and exploring new technologies. One of my projects is Trip Check, a handy tool
                to help you manage your trips more efficiently.
            </p>
            <p>You can check out Trip Check by clicking the link at the top. I hope you find it useful!</p>
        </div>
    );
};

export default AboutMe;
