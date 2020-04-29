import {Spin} from 'antd';
import React from 'react';

/**
 * Оверлей на весь экран.
 */
export const LoadingOverlay = () => {
    return (
        <div className="loading-overlay">
            <Spin size="large" />
        </div>
    );
};
