import {Typography} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {IUserModel} from 'src/Modules/users/models';

interface IOwnProps {
    owner: IUserModel;
}

export const EventOwner = ({owner}: IOwnProps) => {
    return (
        <React.Fragment>
            {!!owner.fullName && (
                <Typography.Paragraph>
                    {i18n.t('Events:ownerModal.name', {name: owner.fullName})}
                </Typography.Paragraph>
            )}
            <Typography.Paragraph>
                {i18n.t('Events:ownerModal.email', {email: owner.email})}
            </Typography.Paragraph>
            <Typography.Paragraph>
                {i18n.t('Events:ownerModal.phone', {phone: owner.phone})}
            </Typography.Paragraph>
        </React.Fragment>
    );
};
