import {StarOutlined, StarTwoTone} from '@ant-design/icons';
import {Tooltip} from 'antd';
import i18n from 'i18next';
import {find} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {TAppStore} from 'Core/store/model';
import {UsersActions} from 'Modules/users/actions/UsersActions';
import {UsersService} from 'Modules/users/service/UsersService';

interface IOwnProps {
    roomId: string;
}

interface IStateProps {
    isFavourite: boolean;
}

interface IDispatchProps {
    userActions: UsersActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class FavouriteRoomIcon extends React.Component<TProps> {
    handleToggleFavourite = (e) => {
        e.preventDefault();
        const {roomId, userActions, isFavourite} = this.props;

        userActions.toggleFavourite(roomId, isFavourite ? 'off' : 'on');
    };

    render() {
        const {isFavourite} = this.props;
        return (
            <Tooltip
                title={i18n.t(`Users:favourite.${isFavourite ? 'off' : 'on'}`)}
            >
                {isFavourite ? (
                    <StarTwoTone onClick={this.handleToggleFavourite} />
                ) : (
                    <StarOutlined onClick={this.handleToggleFavourite} />
                )}
            </Tooltip>
        );
    }
}

const mapStateToProps = (
    state: TAppStore,
    ownProps: IOwnProps,
): IStateProps => {
    return {
        isFavourite: find(
            state.users.profile?.data?.favouriteRooms,
            (roomId) => {
                return roomId === ownProps?.roomId;
            },
        ),
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    userActions: new UsersActions(new UsersService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(FavouriteRoomIcon);

export {connected as FavouriteRoomIcon};
