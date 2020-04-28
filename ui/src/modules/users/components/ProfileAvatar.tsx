import {UserOutlined} from '@ant-design/icons';
import {Avatar, Skeleton} from 'antd';
import {includes} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Dispatch} from 'redux';
import {END_STATUSES} from 'Core/consts';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {IUserModel} from 'Modules/users/models';
import {UsersService} from 'Modules/users/service/UsersService';
import '../styles/profileAvatar.scss';

interface IStateProps {
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    usersActions: UsersActions;
}

interface IOwnProps {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

const ProfileAvatar = ({userInfo}: TProps) => {
    if (!includes(END_STATUSES, userInfo.status)) {
        return (
            <div className="profile-avatar">
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    className="profile-avatar__avatar"
                />
                <Skeleton active title={{width: 125}} paragraph={false} />
            </div>
        );
    }

    return (
        <Link to={ROUTER.MAIN.PROFILE.FULL_PATH} className="profile-avatar">
            <Avatar
                size="large"
                icon={<UserOutlined />}
                src={userInfo.data.photo}
                className="profile-avatar__avatar"
            />
            {userInfo.data.login}
        </Link>
    );
};

const mapState = (state: TAppStore): IStateProps => ({
    userInfo: state.user,
});

const mapDispatch = (dispatch: Dispatch): IDispatchProps => ({
    usersActions: new UsersActions(new UsersService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps, IOwnProps>(
    mapState,
    mapDispatch,
)(ProfileAvatar);

export {connected as ProfileAvatar};
