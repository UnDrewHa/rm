import {Card, CardContent, CardMedia, Typography} from '@material-ui/core';
import {CheckBoxOutlineBlank, CheckBoxOutlined} from '@material-ui/icons';
import i18n from 'i18next';
import {find} from 'lodash-es';
import React from 'react';
import {connect} from 'react-redux';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {TAppStore} from 'src/core/store/model';
import {RoomsActions} from 'src/modules/rooms/actions/RoomsActions';
import {IRoomModel} from 'src/modules/rooms/models';
import {RoomsService} from 'src/modules/rooms/service/RoomsService';

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
        const roomData = this.state.roomData || this.props.details.data;
        const isLoading = this.props.details.status === EStatusCodes.PENDING;

        if (isLoading) {
            return 'Loading...';
        }

        if (!roomData) return null;

        return (
            <Card>
                <CardMedia
                    component="img"
                    src="http://localhost:5000/img/hiex-moscow-sheremetyevo-Europe.jpg"
                />
                <CardContent>
                    <Typography>{roomData.name}</Typography>
                    <Typography>
                        {i18n.t('Buildings:floor', {
                            n: roomData.floor,
                        })}
                    </Typography>
                    <Typography>
                        {roomData.tv ? (
                            <CheckBoxOutlined />
                        ) : (
                            <CheckBoxOutlineBlank />
                        )}{' '}
                        {i18n.t('Rooms:common.tv')}
                    </Typography>
                    <Typography>
                        {roomData.projector ? (
                            <CheckBoxOutlined />
                        ) : (
                            <CheckBoxOutlineBlank />
                        )}{' '}
                        {i18n.t('Rooms:common.projector')}
                    </Typography>
                    <Typography>
                        {roomData.whiteboard ? (
                            <CheckBoxOutlined />
                        ) : (
                            <CheckBoxOutlineBlank />
                        )}{' '}
                        {i18n.t('Rooms:common.whiteboard')}
                    </Typography>
                    <Typography>
                        {roomData.flipchart ? (
                            <CheckBoxOutlined />
                        ) : (
                            <CheckBoxOutlineBlank />
                        )}{' '}
                        {i18n.t('Rooms:common.flipchart')}
                    </Typography>
                    <Typography>{roomData.description}</Typography>
                </CardContent>
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
