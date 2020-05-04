import {DeleteOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {EventsActions} from 'modules/events/actions/EventsActions';
import {EventsService} from 'modules/events/service/EventsService';

interface IOwnProps {
    ids: string[];
    layout?: 'text' | 'icon' | 'button';
    placement?: any;
    afterDelete?: () => void;
}

interface IDispatchProps {
    actions: EventsActions;
}

type TProps = IOwnProps & IDispatchProps;

const EventDeleteButton = (props: TProps) => {
    const {actions, ids, layout, placement = 'top', afterDelete} = props;
    const handleDelete = (e) => {
        e.preventDefault();
        return actions.delete(ids).then(afterDelete);
    };
    const title =
        ids.length > 1
            ? i18n.t('Events:cancel.titleN')
            : i18n.t('Events:cancel.title');
    let content = <a href="#delete">{i18n.t('actions.cancel')}</a>;

    if (layout === 'icon') {
        content = <DeleteOutlined title={i18n.t('actions.cancel')} />;
    } else if (layout === 'button') {
        content = <Button>{i18n.t('actions.cancel')}</Button>;
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

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new EventsActions(new EventsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect<null, IDispatchProps, IOwnProps>(
    null,
    mapDispatchToProps,
)(EventDeleteButton);

export {connected as EventDeleteButton};
