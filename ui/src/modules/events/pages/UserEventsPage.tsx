import {
    Container,
    Link as Links,
    Paper,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import i18n from 'i18next';
import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {ITableConfig} from 'Core/components/models';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {EventsActions} from 'Modules/events/actions/EventsActions';
import {EventsTable} from 'Modules/events/components/EventsTable';
import {IEventModel, IUserEventsFilter} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';
import {calculateTimeString} from 'Modules/events/utils';
import {IUserModel} from 'Modules/users/models';

enum ETabNames {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

interface IState {
    currentTab: ETabNames;
}

interface IStateProps {
    events: IAsyncData<IEventModel[]>;
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    eventsActions: EventsActions;
}

interface IOwnProps {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class UserEventsPage extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {eventsActions, userInfo} = props;

        this.state = {
            currentTab: ETabNames.ACTIVE,
        };

        eventsActions.find({
            filter: this.getEventsFilterByTab(
                this.state.currentTab,
                userInfo.data,
            ),
        });

        this.tableConfig = {
            keys: ['id', 'time', 'name', 'actions'],
            getItems: function (items: IEventModel[]) {
                return items.map((item) => ({
                    id: (
                        <Link to={ROUTER.MAIN.EVENTS.DETAILS.PATH + item._id}>
                            {item._id}
                        </Link>
                    ),
                    time: calculateTimeString(item),
                    name: item.title,
                    actions: (
                        <div>
                            <Link
                                to={{
                                    pathname:
                                        ROUTER.MAIN.EVENTS.CREATE.FULL_PATH,
                                    state: {
                                        id: item._id,
                                        title: item.title,
                                        date: moment(item.date),
                                        from: moment(item.from),
                                        to: moment(item.to),
                                        description: item.description,
                                    },
                                    search: `?room=${item.room}`,
                                }}
                            >
                                {i18n.t('actions.edit')}
                            </Link>
                            <br />
                            <Links
                                onClick={() => eventsActions.delete([item._id])}
                            >
                                {i18n.t('actions.delete')}
                            </Links>
                        </div>
                    ),
                }));
            },
        };
    }

    tableConfig: ITableConfig;

    handleTabChange = (_, currentTab: ETabNames) => {
        this.setState(
            {
                currentTab,
            },
            () => {
                const {eventsActions, userInfo} = this.props;
                eventsActions.find({
                    filter: this.getEventsFilterByTab(
                        this.state.currentTab,
                        userInfo.data,
                    ),
                });
            },
        );
    };

    getEventsFilterByTab(tab: ETabNames, user: IUserModel): IUserEventsFilter {
        if (tab === ETabNames.ACTIVE) {
            return {
                owner: user._id,
                to: {$gt: moment().utc().format()},
            };
        }

        if (tab === ETabNames.COMPLETED) {
            return {
                owner: user._id,
                to: {$lte: moment().utc().format()},
            };
        }

        if (tab === ETabNames.CANCELED) {
            return {
                owner: user._id,
                canceled: true,
            };
        }

        return {
            owner: user._id,
        };
    }

    render() {
        const {events} = this.props;
        const {currentTab} = this.state;
        const isLoading = events.status === EStatusCodes.PENDING;

        if (isLoading) return <LoadingOverlay open />;

        return (
            <Container>
                <Paper>
                    <Typography>{i18n.t('Events:userEvents.title')}</Typography>
                    <Tabs
                        value={currentTab}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab
                            label={i18n.t('Events:userEvents.ACTIVE')}
                            value={ETabNames.ACTIVE}
                        />
                        <Tab
                            label={i18n.t('Events:userEvents.COMPLETED')}
                            value={ETabNames.COMPLETED}
                        />
                        <Tab
                            label={i18n.t('Events:userEvents.CANCELED')}
                            value={ETabNames.CANCELED}
                        />
                    </Tabs>
                    <EventsTable
                        events={events.data}
                        config={this.tableConfig}
                    />
                </Paper>
            </Container>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    events: state.events.list,
    userInfo: state.user,
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
    )(UserEventsPage),
);

export {connected as UserEventsPage};
