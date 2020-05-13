import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {Link} from 'react-router-dom';

interface IOwnProps {
    layout?: 'text' | 'icon' | 'button';
    to: any;
}

export const EditButton = (props: IOwnProps) => {
    const {layout, to} = props;
    const text = i18n.t('actions.edit');
    const link = (
        <Link to={to}>
            {layout === 'icon' ? <EditOutlined title={text} /> : text}
        </Link>
    );

    return layout === 'button' ? <Button>{link}</Button> : link;
};
