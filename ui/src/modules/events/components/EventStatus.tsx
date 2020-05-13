import {Tag} from 'antd';
import i18n from 'i18next';
import {EApproveStatuses} from 'modules/events/enums';
import React from 'react';

interface IOwnProps {
    status: EApproveStatuses;
}

export const EventStatus = ({status}: IOwnProps) => {
    const text = i18n.t('Events:status.' + status);

    if (status === EApproveStatuses.REFUSED) {
        return <Tag color="error">{text}</Tag>;
    }

    if (status === EApproveStatuses.NEED_APPROVE) {
        return <Tag color="processing">{text}</Tag>;
    }

    return <Tag color="success">{text}</Tag>;
};
