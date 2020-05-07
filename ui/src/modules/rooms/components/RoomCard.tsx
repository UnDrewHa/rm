import {Card, Skeleton} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {RoomsActions} from 'modules/rooms/actions/RoomsActions';
import {RoomDescription} from 'modules/rooms/components/RoomDescription';
import {RoomImage} from 'modules/rooms/components/RoomImage';
import {RoomTitle} from 'modules/rooms/components/RoomTitle';
import {IRoomFullModel} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
import React from 'react';
import {connect} from 'react-redux';
import '../styles/roomCard.scss';

interface IOwnProps {
    id: string;
    bordered?: boolean;
}

interface IStateProps {
    details: IAsyncData<IRoomFullModel>;
}

interface IDispatchProps {
    roomsActions: RoomsActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class RoomCard extends React.Component<TProps> {
    constructor(props: TProps) {
        super(props);

        const {id, roomsActions} = props;

        roomsActions.clearDetails();
        roomsActions.getById(id);
    }

    render() {
        const {details, bordered = true} = this.props;
        const room = details.data;
        const isLoading =
            details.status !== EStatusCodes.SUCCESS &&
            details.status !== EStatusCodes.FAIL &&
            !room;

        if (isLoading || !room) {
            return (
                <Card className="room-card" bordered={bordered}>
                    <Skeleton active />
                </Card>
            );
        }

        return (
            <Card
                bordered={bordered}
                cover={<RoomImage item={room} />}
                className="room-card"
            >
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
