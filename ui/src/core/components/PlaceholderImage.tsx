import {FileImageOutlined} from '@ant-design/icons';
import React from 'react';
import '../styles/placeholderImage.scss';

export const PlaceholderImage = () => (
    <div className="placeholder-image">
        <FileImageOutlined width={64} height={64} />
    </div>
);
