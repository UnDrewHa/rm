import React from 'react';
import {connect} from 'react-redux';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {ROUTER} from 'src/core/router/consts';
import {Route, Switch, Link} from 'react-router-dom';
import i18n from 'i18next';
import {IAsyncData} from 'src/core/reducer/model';
import {TAppStore} from 'src/core/store/model';
import {PermissionActions} from 'src/modules/permissions/actions/PermissionActions';
import {TPermissionsList} from 'src/modules/permissions/models';
import {PermissionService} from 'src/modules/permissions/service/PermissionService';

function Home() {
    return <div>дом</div>;
}

function Links() {
    return (
        <ul>
            <li>
                <Link to={ROUTER.MAIN.FULL_PATH}>{i18n.t('links.home')}</Link>
            </li>
            <li>
                <Link to={ROUTER.AUTH.LOGIN.FULL_PATH}>
                    {i18n.t('links.login')}
                </Link>
            </li>
        </ul>
    );
}

interface IStateProps {
    permissions: IAsyncData<TPermissionsList>;
}

interface IDispatchProps {
    permissionActions: PermissionActions;
}

type TProps = IStateProps & IDispatchProps;

interface IState {
    isLoading: boolean;
}

class MainLayout extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        };

        props.permissionActions.getAll().then(() => {
            this.setState({
                isLoading: false,
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingOverlay open />;
        }

        return (
            <React.Fragment>
                <Links />
                <Switch>
                    <Route path={ROUTER.MAIN.FULL_PATH}>
                        <Home />
                    </Route>
                </Switch>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    permissions: state.permissions,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    permissionActions: new PermissionActions(new PermissionService(), dispatch),
});

/**
 * Основной лэйаут авторизованных пользователей.
 */
const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(MainLayout);

export {connected as MainLayout};
