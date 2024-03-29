import {SearchOutlined} from '@ant-design/icons';
import {Button, Checkbox, Divider, Tooltip} from 'antd';
import {DeleteButton} from 'core/components/DeleteButton';
import {EditButton} from 'core/components/EditButton';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {BlankList} from 'modules/admin/pages/BlankList';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {ERoles} from 'modules/permissions/enums';
import {UsersActions} from 'modules/users/actions/UsersActions';
import {IUserModel} from 'modules/users/models';
import {UsersService} from 'modules/users/service/UsersService';
import React from 'react';
import {connect} from 'react-redux';

const getColumnsConfig = (actions, getColumnSearchProps) => [
    {
        title: () => i18n.t('table.header.fullName'),
        dataIndex: 'fullName',
        key: 'fullName',
        ...getColumnSearchProps('fullName'),
    },
    {
        title: () => i18n.t('table.header.login'),
        dataIndex: 'login',
        key: 'login',
        ...getColumnSearchProps('login'),
    },
    {
        title: () => i18n.t('table.header.email'),
        dataIndex: 'email',
        key: 'email',
        ...getColumnSearchProps('email'),
    },
    {
        title: () => i18n.t('table.header.phone'),
        dataIndex: 'phone',
        key: 'phone',
        ...getColumnSearchProps('phone'),
    },
    {
        title: () => i18n.t('table.header.role'),
        dataIndex: 'role',
        key: 'role',
        filters: [
            {
                text: ERoles.ADMIN,
                value: ERoles.ADMIN,
            },
            {
                text: ERoles.USER,
                value: ERoles.USER,
            },
        ],
        onFilter: (value, record) => record.role === value,
    },
    {
        title: () => i18n.t('table.header.active'),
        dataIndex: 'active',
        key: 'active',
        render: (_, record) => <Checkbox checked={record.active !== false} />,
        filters: [
            {
                text: i18n.t('words.yes'),
                value: true,
            },
            {
                text: i18n.t('words.no'),
                value: false,
            },
        ],
        onFilter: (value, record) => {
            return value ? record.active !== false : record.active === false;
        },
    },
    {
        title: () => i18n.t('table.header.actions'),
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
            <React.Fragment>
                <EditButton
                    to={{
                        pathname: ROUTER.MAIN.ADMIN.USERS.EDIT.FULL_PATH,
                        search: `?id=${record._id}`,
                    }}
                />
                <Divider type="vertical" />
                <DeleteButton ids={[record._id]} actions={actions} />
            </React.Fragment>
        ),
    },
];

interface IStateProps {
    items: IAsyncData<IUserModel[]>;
}

interface IDispatchProps {
    actions: UsersActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    building: IBuildingModel;
}

class UsersList extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            building: null,
        };

        props.actions.clear();
    }

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option,
        });
    };

    handleFind = () => {
        const {actions} = this.props;

        actions.find({
            building: this.state.building._id,
        });
    };

    renderTitle = () => (
        <div className="admin-table__title">
            <BuildingsAutocomplete onSelect={this.handleBuildingSelect} />
            <Tooltip title={i18n.t('Users:admin.selectBuilding')}>
                <Button
                    onClick={this.handleFind}
                    type="primary"
                    icon={<SearchOutlined />}
                    disabled={!this.state.building}
                >
                    {i18n.t('actions.find')}
                </Button>
            </Tooltip>
        </div>
    );

    render() {
        const {actions, items} = this.props;

        return (
            <BlankList
                getConfig={getColumnsConfig}
                actions={actions}
                items={items.data}
                isLoading={items.status === EStatusCodes.PENDING}
                title={this.renderTitle}
            />
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        items: state.users.list,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new UsersActions(new UsersService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(UsersList);

export {connected as UsersList};
