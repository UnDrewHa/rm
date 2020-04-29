import {Col, PageHeader, Row, Table, Tabs} from 'antd';
import i18n from 'i18next';
import {isEmpty} from 'lodash-es';
import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {EventsActions} from 'Modules/events/actions/EventsActions';
import {
    columnsWithoutOwner,
    columnsWithActions,
} from 'Modules/events/components/utils';
import {EventDeleteButton} from 'Modules/events/components/EventDeleteButton';
import {IEventModel, IUserEventsFilter} from 'Modules/events/models';
import {EventsService} from 'Modules/events/service/EventsService';
import {IUserModel} from 'Modules/users/models';

enum ETabNames {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

interface IState {
    currentTab: ETabNames;
    selectedRowKeys: string[];
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
            selectedRowKeys: [],
        };

        eventsActions.find({
            filter: this.getEventsFilterByTab(
                this.state.currentTab,
                userInfo.data,
            ),
        });
    }

    handleTabChange = (currentTab: ETabNames) => {
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

    handleTableCheck = (selectedRowKeys: string[]) => {
        this.setState({
            selectedRowKeys,
        });
    };

    handleAfterDelete = () => {
        this.setState({
            selectedRowKeys: [],
        });
    };

    getEventsFilterByTab(tab: ETabNames, user: IUserModel): IUserEventsFilter {
        if (tab === ETabNames.ACTIVE) {
            return {
                owner: user._id,
                to: {$gt: moment().utc().format()},
                canceled: {$ne: true},
            };
        }

        if (tab === ETabNames.COMPLETED) {
            return {
                owner: user._id,
                to: {$lte: moment().utc().format()},
                canceled: {$ne: true},
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
        const {currentTab, selectedRowKeys} = this.state;
        const isLoading = events.status === EStatusCodes.PENDING;
        const columnsConfig =
            currentTab === ETabNames.ACTIVE
                ? columnsWithActions
                : columnsWithoutOwner;
        const rowSelection =
            currentTab === ETabNames.ACTIVE
                ? {
                      onChange: this.handleTableCheck,
                  }
                : null;
        const footerIsVisible =
            currentTab === ETabNames.ACTIVE && !isEmpty(selectedRowKeys);
        const footer = footerIsVisible ? (
            <EventDeleteButton
                ids={selectedRowKeys}
                layout="button"
                placement="right"
                afterDelete={this.handleAfterDelete}
            />
        ) : null;

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Events:userEvents.title')}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={24}>
                        <Tabs
                            defaultActiveKey={ETabNames.ACTIVE}
                            onChange={this.handleTabChange}
                        >
                            <Tabs.TabPane
                                tab={i18n.t('Events:userEvents.ACTIVE')}
                                key={ETabNames.ACTIVE}
                            />
                            <Tabs.TabPane
                                tab={i18n.t('Events:userEvents.COMPLETED')}
                                key={ETabNames.COMPLETED}
                            />
                            <Tabs.TabPane
                                tab={i18n.t('Events:userEvents.CANCELED')}
                                key={ETabNames.CANCELED}
                            />
                        </Tabs>
                        <Table
                            rowSelection={rowSelection}
                            columns={columnsConfig}
                            dataSource={events.data}
                            pagination={false}
                            rowKey="_id"
                            loading={isLoading}
                            footer={() => footer}
                            className="events-table"
                        />
                    </Col>
                </Row>
            </React.Fragment>
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
