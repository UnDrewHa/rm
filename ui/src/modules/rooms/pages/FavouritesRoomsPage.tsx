import {Col, Divider, PageHeader, Row} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {ROUTER} from 'core/router/consts';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {filter, includes} from 'lodash-es';
import {RoomsActions} from 'modules/rooms/actions/RoomsActions';
import {RoomsList} from 'modules/rooms/components/RoomsList';
import {IRoomModel} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
import {IUserModel} from 'modules/users/models';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

interface IStateProps {
    profile: IAsyncData<IUserModel>;
    roomsList: IAsyncData<IRoomModel[]>;
    roomsDataIsLoading: boolean;
}

interface IDispatchProps {
    roomsActions: RoomsActions;
}

type TProps = IStateProps & IDispatchProps;

class FavouritesRoomsPage extends React.Component<TProps> {
    constructor(props) {
        super(props);

        this.props.roomsActions.getFavourite();
    }

    render() {
        const {roomsDataIsLoading, roomsList, profile} = this.props;
        const rooms = filter(roomsList.data, (item) =>
            includes(profile.data.favouriteRooms, item._id),
        );

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Rooms:favourites.title')}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={24}>
                        <RoomsList
                            rooms={rooms}
                            isLoading={roomsDataIsLoading}
                            renderActions={(item) => (
                                <React.Fragment>
                                    <Link
                                        to={{
                                            pathname:
                                                ROUTER.MAIN.EVENTS.CREATE
                                                    .FULL_PATH,
                                            search: `?room=${item._id}`,
                                        }}
                                    >
                                        {i18n.t('Rooms:common.reserve')}
                                    </Link>
                                    <Divider type="vertical" />
                                    <Link
                                        to={
                                            ROUTER.MAIN.ROOMS.DETAILS.PATH +
                                            item._id
                                        }
                                    >
                                        {i18n.t('Rooms:common.schedule')}
                                    </Link>
                                </React.Fragment>
                            )}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        roomsList: state.rooms.list,
        roomsDataIsLoading: state.rooms.list.status === EStatusCodes.PENDING,
        profile: state.users.profile,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    roomsActions: new RoomsActions(new RoomsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect<IStateProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(FavouritesRoomsPage);

export {connected as FavouritesRoomsPage};
