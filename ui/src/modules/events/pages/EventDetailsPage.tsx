import {Col, PageHeader, Row, Skeleton, Typography} from 'antd';
import {InterfaceAction} from 'core/actions/InterfaceActions';
import {ButtonsRow} from 'core/components/ButtonsRow';
import {DeleteButton} from 'core/components/DeleteButton';
import {EditButton} from 'core/components/EditButton';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {EventsActions} from 'modules/events/actions/EventsActions';
import {EventMembers} from 'modules/events/components/EventMembers';
import {EventOwner} from 'modules/events/components/EventOwner';
import {IEventModel} from 'modules/events/models';
import {EventsService} from 'modules/events/service/EventsService';
import {calculateTimeString} from 'modules/events/utils';
import {RoomTitle} from 'modules/rooms/components/RoomTitle';
import {IUserModel} from 'modules/users/models';
import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteChildrenProps} from 'react-router-dom';

interface IStateProps {
    details: IAsyncData<IEventModel>;
    profile: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    eventsActions: EventsActions;
}

interface IOwnProps extends RouteChildrenProps<{id: string}> {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class EventDetailsPage extends React.Component<TProps> {
    constructor(props: TProps) {
        super(props);

        const {
            match: {params},
            eventsActions,
        } = props;

        eventsActions.getById(params.id);
    }

    handleBack = () => {
        window.history.back();
    };

    handleAfterDelete = () => {
        InterfaceAction.redirect(ROUTER.MAIN.FULL_PATH);
    };

    render() {
        const {details, eventsActions, profile} = this.props;
        const eventData = details.data;
        const isLoading =
            details.status !== EStatusCodes.SUCCESS &&
            details.status !== EStatusCodes.FAIL &&
            !eventData;
        const extra =
            eventData?.owner === profile?.data?._id &&
            moment(eventData.to) > moment() ? (
                <ButtonsRow>
                    <EditButton
                        to={{
                            pathname: ROUTER.MAIN.EVENTS.CREATE.FULL_PATH,
                            state: {
                                id: eventData._id,
                                title: eventData.title,
                                date: moment(eventData.date),
                                from: moment(eventData.from),
                                to: moment(eventData.to),
                                description: eventData.description,
                                members: eventData.members,
                            },
                            search: `?room=${eventData.room}`,
                        }}
                        layout="button"
                    />
                    <DeleteButton
                        ids={[eventData._id]}
                        actions={eventsActions}
                        layout="button"
                        placement="left"
                        afterDelete={this.handleAfterDelete}
                    />
                </ButtonsRow>
            ) : null;

        if (isLoading) {
            return (
                <React.Fragment>
                    <PageHeader
                        className="main-header"
                        title={
                            <Skeleton
                                active
                                paragraph={false}
                                title={{width: 300}}
                            />
                        }
                        onBack={this.handleBack}
                    />
                    <Row gutter={{xs: 8, sm: 16, md: 24}}>
                        <Col span={24}>
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                        </Col>
                    </Row>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Events:details.title', {
                        title: eventData.title,
                    })}
                    extra={extra}
                    onBack={this.handleBack}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={24}>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.owner')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            <EventOwner owner={eventData.owner as any} />
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.date')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            {eventData.date}, {calculateTimeString(eventData)}
                        </Typography.Paragraph>
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.description')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            {eventData.description}
                        </Typography.Paragraph>
                        {eventData.members.length > 0 && (
                            <Typography.Title level={4}>
                                {i18n.t('Events:details.members')}
                            </Typography.Title>
                        )}
                        {eventData.members.length > 0 && (
                            <Typography.Paragraph>
                                <EventMembers event={eventData} />
                            </Typography.Paragraph>
                        )}
                        <Typography.Title level={4}>
                            {i18n.t('Events:details.room')}
                        </Typography.Title>
                        <Typography.Paragraph>
                            <RoomTitle item={eventData.room as any} addLink />
                        </Typography.Paragraph>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    details: state.events.details,
    profile: state.users.profile,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    eventsActions: new EventsActions(new EventsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = withRouter(
    connect<IStateProps, IDispatchProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(EventDetailsPage),
);

export {connected as EventDetailsPage};
