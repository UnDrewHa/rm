import {Col, PageHeader, Row, Table, Tabs} from 'antd';
import {DeleteButton} from 'core/components/DeleteButton';
import {commonTableProps} from 'core/consts';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {isEmpty} from 'lodash-es';
import {EventsActions} from 'modules/events/actions/EventsActions';
import {
    columnsWithoutOwner,
    getColumnsWithActions,
} from 'modules/events/components/utils';
import {IEventModel, IUserEventsFilter} from 'modules/events/models';
import {EventsService} from 'modules/events/service/EventsService';
import {IUserModel} from 'modules/users/models';
import moment from 'moment';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

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
        return {
            owner: user._id,
            tab,
            now: moment().utc().format(),
        };
    }

    render() {
        const {events, eventsActions} = this.props;
        const {currentTab, selectedRowKeys} = this.state;
        const isLoading = events.status === EStatusCodes.PENDING;
        const columnsConfig =
            currentTab === ETabNames.ACTIVE
                ? getColumnsWithActions(eventsActions)
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
            <DeleteButton
                ids={selectedRowKeys}
                actions={eventsActions}
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
                            {...commonTableProps}
                            rowSelection={rowSelection}
                            columns={columnsConfig}
                            dataSource={events.data}
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
    userInfo: state.users.profile,
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
