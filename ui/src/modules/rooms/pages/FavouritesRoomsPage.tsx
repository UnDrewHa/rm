import {Col, Divider, PageHeader, Row} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {ROUTER} from 'Core/router/consts';
import {TAppStore} from 'Core/store/model';
import {RoomsActions} from 'Modules/rooms/actions/RoomsActions';
import {RoomsList} from 'Modules/rooms/components/RoomsList';
import {IRoomModel} from 'Modules/rooms/models';
import {RoomsService} from 'Modules/rooms/service/RoomsService';

interface IStateProps {
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
        const {roomsDataIsLoading, roomsList} = this.props;

        return (
            <React.Fragment>
                <PageHeader
                    className="main-header"
                    title={i18n.t('Rooms:favourites.title')}
                />
                <Row gutter={{xs: 8, sm: 16, md: 24}}>
                    <Col span={24}>
                        <RoomsList
                            rooms={roomsList.data}
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
