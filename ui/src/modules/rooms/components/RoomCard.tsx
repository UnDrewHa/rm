import {Card, Skeleton} from 'antd';
import React from 'react';
import {connect} from 'react-redux';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {RoomsActions} from 'Modules/rooms/actions/RoomsActions';
import {RoomDescription} from 'Modules/rooms/components/RoomDescription';
import {RoomImage} from 'Modules/rooms/components/RoomImage';
import {RoomTitle} from 'Modules/rooms/components/RoomTitle';
import {IRoomFullModel} from 'Modules/rooms/models';
import {RoomsService} from 'Modules/rooms/service/RoomsService';
import '../styles/roomCard.scss';

interface IOwnProps {
    id: string;
}

interface IStateProps {
    details: IAsyncData<IRoomFullModel>;
}

interface IDispatchProps {
    roomsActions: RoomsActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class RoomCard extends React.Component<TProps> {
    constructor(props) {
        super(props);

        const {id, roomsActions} = props;

        roomsActions.getById(id);
    }

    render() {
        const {details} = this.props;
        const room = details.data;
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
