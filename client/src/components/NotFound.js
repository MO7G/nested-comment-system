import React from 'react';
import './NotFound.css'; // Import your CSS file for styling
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Check if the pressed key is the "Enter" key
            if (event.key !== null) {
                navigate('/posts');

                // Your logic for handling the Enter key press
            }
        };

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyPress);

        // Remove event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <div className='container-notFound'>
            <div className="notfound" tabIndex="0">
                <div className="centered">
                    <span className="inverted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;
                </div>
                <div className="centered">
                    <span className="inverted">&nbsp;4&nbsp;0&nbsp;4&nbsp;</span>
                    <span className="shadow">&nbsp;</span>
                </div>
                <div className="centered">
                    <span className="inverted">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span className="shadow">&nbsp;</span>
                </div>
                <div className="centered">
                    &nbsp;<span className="shadow">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
                <div className="row">&nbsp;</div>
                <div className="row">A fatal exception 404 has occurred at C0DE:ABAD1DEA in 0xC0DEBA5E.</div>
                <div className="row">The current request will be terminated.</div>
                <div className="row">&nbsp;</div>
                <div className="row">* Press any key to return to the previous page.</div>
                <div className="row">
                    * Press CTRL+ALT+DEL to restart your computer. You will
                </div>
                <div className="row">&nbsp;&nbsp;lose any unsaved information in all applications.</div>
                <div className="row">&nbsp;</div>
                <div className="centered">
                    Press any key to continue...<span className="blink">&#9608;</span>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
