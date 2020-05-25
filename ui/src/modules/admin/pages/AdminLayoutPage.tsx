import {
    AppstoreOutlined,
    CalendarOutlined,
    HomeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Col, Menu, PageHeader, Row} from 'antd';
import {RouteWrap} from 'core/components/RouteWrap';
import {rowGutters} from 'core/consts';
import {getErrorPage} from 'core/pages/404';
import {ROUTER} from 'core/router/consts';
import i18n from 'i18next';
import {BuildingsList} from 'modules/admin/pages/buildings/BuildingsList';
import {BuildingEdit} from 'modules/admin/pages/buildings/BuildingEdit';
import {BuildingFloorEdit} from 'modules/admin/pages/buildings/BuildingFloorEdit';
import {EventsList} from 'modules/admin/pages/events/EventsList';
import {RoomsList} from 'modules/admin/pages/rooms/RoomsList';
import {RoomEdit} from 'modules/admin/pages/rooms/RoomEdit';
import {UsersList} from 'modules/admin/pages/users/UsersList';
import {UserEdit} from 'modules/admin/pages/users/UserEdit';
import {AdminMainPage} from 'modules/admin/pages/AdminMainPage';
import {ERoles} from 'modules/permissions/enums';
import React from 'react';
import {
    withRouter,
    Link,
    Route,
    RouteChildrenProps,
    Switch,
} from 'react-router-dom';
import '../styles/adminTable.scss';

const {FULL_PATH, BUILDINGS, USERS, ROOMS, EVENTS} = ROUTER.MAIN.ADMIN;

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
            {
                key: BUILDINGS.FLOOR.FULL_PATH,
                label: () => i18n.t('Admin:menu.floor.title'),
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
    {
        key: EVENTS.FULL_PATH,
        label: () => (
            <div>
                <CalendarOutlined /> {i18n.t('Admin:menu.events.title')}
            </div>
        ),
    },
];

const getOpenKeys = (pathname) => {
    if (pathname.includes('/edit')) {
        return pathname.replace('/edit', '');
    }

    return pathname;
};

interface IProps extends RouteChildrenProps {}

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
                <Row gutter={rowGutters}>
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
                                path={USERS.EDIT.FULL_PATH}
                            >
                                <UserEdit />
                            </RouteWrap>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={USERS.FULL_PATH}
                            >
                                <UsersList />
                            </RouteWrap>

                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROOMS.EDIT.FULL_PATH}
                            >
                                <RoomEdit />
                            </RouteWrap>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={ROOMS.FULL_PATH}
                            >
                                <RoomsList />
                            </RouteWrap>

                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={BUILDINGS.FLOOR.FULL_PATH}
                            >
                                <BuildingFloorEdit />
                            </RouteWrap>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={BUILDINGS.EDIT.FULL_PATH}
                            >
                                <BuildingEdit />
                            </RouteWrap>
                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={BUILDINGS.FULL_PATH}
                            >
                                <BuildingsList />
                            </RouteWrap>

                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={EVENTS.FULL_PATH}
                            >
                                <EventsList />
                            </RouteWrap>

                            <RouteWrap
                                role={ERoles.ADMIN}
                                path={FULL_PATH}
                                exact
                            >
                                <AdminMainPage />
                            </RouteWrap>
                            <Route component={getErrorPage(FULL_PATH, 404)} />
                        </Switch>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const withRouterComponent = withRouter(AdminLayoutPage);

export {withRouterComponent as AdminLayoutPage};
