import {AppstoreOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';
import {Col, Menu, PageHeader, Row} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {withRouter, Link, Switch} from 'react-router-dom';
import {RouteWrap} from 'Core/components/RouteWrap';
import {ROUTER} from 'Core/router/consts';
import {BuildingsList} from 'Modules/admin/pages/buildings/BuildingsList';
import {BuildingEdit} from 'Modules/admin/pages/buildings/BuildingEdit';
import {RoomsList} from 'Modules/admin/pages/rooms/RoomsList';
import {RoomEdit} from 'Modules/admin/pages/rooms/RoomEdit';
import {UsersList} from 'Modules/admin/pages/users/UsersList';
import {UserEdit} from 'Modules/admin/pages/users/UserEdit';
import {AdminMainPage} from 'Modules/admin/pages/AdminMainPage';
import {ERoles} from 'Modules/permissions/enums';
import '../styles/adminTable.scss';

const {FULL_PATH, BUILDINGS, USERS, ROOMS} = ROUTER.MAIN.ADMIN;

const menuConfig = [
    {
        key: FULL_PATH,
        label: () => i18n.t('Admin:menu.main.title'),
    },
    {
        key: USERS.FULL_PATH,
        title: () => (
            <div>
                <UserOutlined /> {i18n.t('Admin:menu.users.title')}
            </div>
        ),
        items: [
            {
                key: USERS.FULL_PATH,
                label: () => i18n.t('Admin:menu.common.list'),
            },
            {
                key: USERS.EDIT.FULL_PATH,
                label: () => i18n.t('Admin:menu.common.create'),
            },
        ],
    },
    {
        key: BUILDINGS.FULL_PATH,
        title: () => (
            <div>
                <HomeOutlined /> {i18n.t('Admin:menu.buildings.title')}
            </div>
        ),
        items: [
            {
                key: BUILDINGS.FULL_PATH,
                label: () => i18n.t('Admin:menu.common.list'),
            },
            {
                key: BUILDINGS.EDIT.FULL_PATH,
                label: () => i18n.t('Admin:menu.common.create'),
            },
        ],
    },
    {
        key: ROOMS.FULL_PATH,
        title: () => (
            <div>
                <AppstoreOutlined /> {i18n.t('Admin:menu.rooms.title')}
            </div>
        ),
        items: [
            {
                key: ROOMS.FULL_PATH,
                label: () => i18n.t('Admin:menu.common.list'),
            },
            {
                key: ROOMS.EDIT.FULL_PATH,
                label: () => i18n.t('Admin:menu.common.create'),
            },
        ],
    },
];

const getOpenKeys = (pathname) => {
    if (pathname.includes('/edit')) {
        return pathname.replace('/edit', '');
    }

    return pathname;
};

interface IProps {
    history: any;
    location: any;
    match: any;
}

interface IState {
    titleKey: string;
}

class AdminLayoutPage extends React.Component<IProps, IState> {
    state = {
        titleKey: null,
    };

    handleTitleClick = ({key}) => {
        this.setState({
            titleKey: key,
        });
    };

    getMenuItems = (items) => {
        return items.map((item) => {
            return item.label ? (
                <Menu.Item key={item.key}>
                    <Link to={item.key}>{item.label()}</Link>
                </Menu.Item>
            ) : (
                <Menu.SubMenu
                    key={item.key}
                    title={item.title()}
                    onTitleClick={this.handleTitleClick}
                >
                    {this.getMenuItems(item.items)}
                </Menu.SubMenu>
            );
        });
    };

    render() {
        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Admin:main.title')}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={4}>
                        <Menu
                            selectedKeys={[this.props.location.pathname]}
                            openKeys={[
                                this.state.titleKey ||
                                    getOpenKeys(this.props.location.pathname),
                            ]}
                            mode="inline"
                        >
                            {this.getMenuItems(menuConfig)}
                        </Menu>
                    </Col>
                    <Col span={20}>
                        <Switch>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROUTER.MAIN.ADMIN.USERS.EDIT.FULL_PATH}
                            >
                                <UserEdit />
                            </RouteWrap>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROUTER.MAIN.ADMIN.USERS.FULL_PATH}
                            >
                                <UsersList />
                            </RouteWrap>

                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROUTER.MAIN.ADMIN.ROOMS.EDIT.FULL_PATH}
                            >
                                <RoomEdit />
                            </RouteWrap>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROUTER.MAIN.ADMIN.ROOMS.FULL_PATH}
                            >
                                <RoomsList />
                            </RouteWrap>

                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={
                                    ROUTER.MAIN.ADMIN.BUILDINGS.EDIT.FULL_PATH
                                }
                            >
                                <BuildingEdit />
                            </RouteWrap>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROUTER.MAIN.ADMIN.BUILDINGS.FULL_PATH}
                            >
                                <BuildingsList />
                            </RouteWrap>

                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROUTER.MAIN.ADMIN.FULL_PATH}
                            >
                                <AdminMainPage />
                            </RouteWrap>
                        </Switch>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const withRouterComponent = withRouter(AdminLayoutPage);

export {withRouterComponent as AdminLayoutPage};
