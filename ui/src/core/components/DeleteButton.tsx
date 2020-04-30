import {DeleteOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';
import i18n from 'i18next';
import React from 'react';

interface IOwnProps {
    ids: string[];
    layout?: 'text' | 'icon' | 'button';
    placement?: any;
    afterDelete?: () => void;
    actions: any;
}

type TProps = IOwnProps;

export const DeleteButton = (props: TProps) => {
    const {actions, ids, placement = 'left', afterDelete, layout} = props;
    const handleDelete = (e) => {
        e.preventDefault();
        return actions.delete(ids).then(afterDelete);
    };

    const title =
        ids.length > 1 ? i18n.t('delete.titleN') : i18n.t('delete.title');
    let content = <a href="#delete">{i18n.t('actions.delete')}</a>;

    if (layout === 'icon') {
        content = <DeleteOutlined title={i18n.t('actions.delete')} />;
    } else if (layout === 'button') {
        content = <Button>{i18n.t('actions.delete')}</Button>;
    }

    return (
        <Popconfirm
            title={title}
            onConfirm={handleDelete}
            okText={i18n.t('words.yes')}
            cancelText={i18n.t('words.no')}
            placement={placement}
        >
            {content}
        </Popconfirm>
    );
};
