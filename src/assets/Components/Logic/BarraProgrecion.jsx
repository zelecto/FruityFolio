import React, { useState, useEffect } from 'react';

const ProgressBar = ({ isLoading, isSuccess }) => {
    const [showProgressBar, setShowProgressBar] = useState(false);

    useEffect(() => {
        setShowProgressBar(isLoading);
    }, [isLoading]);

    return (
        <div style={{ display: showProgressBar ? 'block' : 'none' }}>
            <div style={{ width: '100%', height: '5px', backgroundColor: 'blue' }} />
            {isSuccess && <p style={{ color: 'green' }}>La solicitud se realizó correctamente.</p>}
        </div>
    );
};

export default ProgressBar;