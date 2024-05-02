import React from 'react';

const Loading = ({ message }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-gray-100 p-8 rounded-lg flex flex-col items-end relative">
                <img src="https://www.superiorlawncareusa.com/wp-content/uploads/2020/05/loading-gif-png-5.gif" alt="Loading..." className="w-24 h-24 animate-pulse mx-auto" />
                <p className={`text-xl font-bold text-gray-800`}>{message}</p>
            </div>
        </div>
    );
};

export default Loading;

