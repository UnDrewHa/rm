import {notification, Button} from 'antd';
import i18n from 'i18next';
import React from 'react';

interface IOwnProps {
    ids: string[];
    layout?: 'text' | 'button';
    actions: any;
}

type TProps = IOwnProps;

export const QrButton = (props: TProps) => {
    const {actions, ids, layout} = props;
    const showMessage = (data) => {
        notification.success({
            message: 'Файл готов для скачивания',
            description: (
                <React.Fragment>
                    Файл, с QR-кодами переговорных комнат готов для скачивания.
                    Нажмите <a href={data.data}>ссылку</a>, чтобы скачать
                </React.Fragment>
            ),
            duration: 10,
        });
    };
    const handleDelete = (e) => {
        e.preventDefault();
        return actions.getQrCodes(ids, showMessage);
    };

    let content = (
        <a onClick={handleDelete} href="#getQrCode">
            {i18n.t('actions.getQrCode')}
        </a>
    );

    if (layout === 'button') {
        content = (
            <Button onClick={handleDelete}>
                {i18n.t('actions.getQrCode')}
            </Button>
        );
    }

    return content;
};
