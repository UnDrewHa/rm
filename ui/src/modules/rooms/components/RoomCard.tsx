import {Card, Skeleton} from 'antd';
import {find} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {RoomsActions} from 'Modules/rooms/actions/RoomsActions';
import {RoomDescription} from 'Modules/rooms/components/RoomDescription';
import {RoomImage} from 'Modules/rooms/components/RoomImage';
import {RoomTitle} from 'Modules/rooms/components/RoomTitle';
import {IRoomModel} from 'Modules/rooms/models';
import {RoomsService} from 'Modules/rooms/service/RoomsService';
import '../styles/roomCard.scss';

interface IOwnProps {
    id: string;
}

interface IStateProps {
    roomsList: IAsyncData<IRoomModel[]>;
    details: IAsyncData<IRoomModel>;
}

interface IDispatchProps {
    roomsActions: RoomsActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

interface IState {
    roomData: IRoomModel;
}

class RoomCard extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);

        const {roomsList, id, roomsActions} = props;
        const roomFromList = find(roomsList.data, (room) => room._id === id);

        if (!roomFromList) {
            roomsActions.getById(id);
        }

        this.state = {
            roomData: roomFromList,
        };
    }

    render() {
        const {details} = this.props;
        const room = this.state.roomData || details.data;
        const isLoading =
            details.status !== EStatusCodes.SUCCESS &&
            details.status !== EStatusCodes.FAIL &&
            !room;

        if (isLoading || !room) {
            return (
                <Card className="room-card">
                    <Skeleton active />
                </Card>
            );
        }

        return (
            <Card cover={<RoomImage item={room} />} className="room-card">
                <Card.Meta
                    title={<RoomTitle item={room} />}
                    description={<RoomDescription item={room} />}
                />
            </Card>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    roomsList: state.rooms.list,
    details: state.rooms.details,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    roomsActions: new RoomsActions(new RoomsService(), dispatch),
});

/**
 * Страница регистрации.
 */
const connected = connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(RoomCard);

export {connected as RoomCard};
