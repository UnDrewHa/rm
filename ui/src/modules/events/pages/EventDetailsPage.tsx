import {find} from 'lodash-es';
import {Container, Typography} from '@material-ui/core';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {TAppStore} from 'src/core/store/model';
import {EventsActions} from 'src/modules/events/actions/EventsActions';
import {IEventModel} from 'src/modules/events/models';
import {EventsService} from 'src/modules/events/service/EventsService';
import {calculateTimeString} from 'src/modules/events/utils';

interface IState {
    eventData: IEventModel;
}

interface IStateProps {
    events: IAsyncData<IEventModel[]>;
    details: IAsyncData<IEventModel>;
}

interface IDispatchProps {
    eventsActions: EventsActions;
}

interface IOwnProps {
    match: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class EventDetailsPage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {
            events,
            match: {params},
            eventsActions,
        } = props;
        const eventFromList = find(
            events.data,
            (event) => event._id === params.id,
        );

        if (!eventFromList) {
            eventsActions.getById(params.id);
        }

        this.state = {
            eventData: eventFromList,
        };
    }

    render() {
        const {details} = this.props;
        const eventData = this.state.eventData || details.data;
        const isLoading =
            details.status !== EStatusCodes.SUCCESS &&
            details.status !== EStatusCodes.FAIL &&
            !eventData;

        if (isLoading) return <LoadingOverlay open />;

        return (
            <Container>
                <Typography>{eventData.title}</Typography>
                <Typography>
                    {eventData.date}, {calculateTimeString(eventData)}
                </Typography>
                <Typography>Комната - {eventData.room}</Typography>
                <Typography>{eventData.description}</Typography>
                <Typography>Статус отмены - {eventData.canceled}</Typography>
                <Typography>Участники - {eventData.members}</Typography>
            </Container>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    events: state.events.list,
    details: state.events.details,
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
