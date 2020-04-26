import React from 'react';
import {FavouriteRoomIcon} from 'Modules/rooms/components/FavouriteRoomIcon';
import {IRoomProp} from 'Modules/rooms/models';

export const RoomTitle = ({item}: IRoomProp) => {
    return (
        <div className="room-title">
            <FavouriteRoomIcon roomId={item._id} /> {item.name}
        </div>
    );
};
