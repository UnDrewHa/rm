import {isEmpty} from 'lodash-es';
import {
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
} from '@material-ui/core';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {ROUTER} from 'src/core/router/consts';
import {TAppStore} from 'src/core/store/model';
import {EventsActions} from 'src/modules/events/actions/EventsActions';
import {IEventModel, IUserEventsFilter} from 'src/modules/events/models';
import {EventsService} from 'src/modules/events/service/EventsService';
import {calculateTimeString} from 'src/modules/events/utils';
import {IUserModel} from 'src/modules/users/models';
import i18n from 'i18next';
import moment from 'moment';

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
    }

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
                    {!isEmpty(events.data) && (
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {i18n.t('Events:common.id')}
                                        </TableCell>
                                        <TableCell>
                                            {i18n.t('Events:common.time')}
                                        </TableCell>
                                        <TableCell>
                                            {i18n.t('Events:common.name')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {events.data.map((row) => (
                                        <TableRow key={row._id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                <Link
                                                    to={
                                                        ROUTER.MAIN.EVENTS
                                                            .DETAILS.PATH +
                                                        row._id
                                                    }
                                                >
                                                    {row._id}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {calculateTimeString(row)}
                                            </TableCell>
                                            <TableCell>{row.title}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
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
