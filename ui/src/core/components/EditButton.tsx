import {EditOutlined} from '@ant-design/icons';
import i18n from 'i18next';
import React from 'react';
import {Link} from 'react-router-dom';
import {ROUTER} from 'Core/router/consts';

interface IOwnProps {
    id: string;
    pathname: string;
    layout?: 'text' | 'icon';
}

export const EditButton = (props: IOwnProps) => {
    const {id, layout, pathname} = props;

    return (
        <Link
            to={{
                pathname: ROUTER.MAIN.ADMIN[pathname].EDIT.FULL_PATH,
                search: `?id=${id}`,
            }}
        >
            {layout === 'icon' ? (
                <EditOutlined title={i18n.t('actions.edit')} />
            ) : (
                i18n.t('actions.edit')
            )}
        </Link>
    );
};
