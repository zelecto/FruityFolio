import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

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

ProgressBar.propTypes = {
  isLoading: PropTypes.bool,
  isSuccess: PropTypes.bool,
};

ProgressBar.defaultProps = {
  isLoading: false,
  isSuccess: false,
};

export default ProgressBar;