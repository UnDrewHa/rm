import React from 'react';
import {Link} from 'react-router-dom';
import {ROUTER} from 'Core/router/consts';
import {FavouriteRoomIcon} from 'Modules/rooms/components/FavouriteRoomIcon';
import {IRoomProp} from 'Modules/rooms/models';

interface ITitleProps extends IRoomProp {
    addLink?: boolean;
}

export const RoomTitle = ({item, addLink}: ITitleProps) => {
    const text = addLink ? (
        <Link to={ROUTER.MAIN.ROOMS.DETAILS.PATH + item._id}>
            {item.name}
        </Link>
    ) : (
        item.name
    );
    return (
        <div className="room-title">
            <FavouriteRoomIcon roomId={item._id} /> {text}
        </div>
    );
};
