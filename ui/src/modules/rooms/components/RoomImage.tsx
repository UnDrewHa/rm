import {Carousel} from 'antd';
import {filter, isEmpty} from 'lodash-es';
import React from 'react';
import {PlaceholderImage} from 'core/components/PlaceholderImage';
import {IRoomProp} from 'modules/rooms/models';

export const RoomImage = ({item}: IRoomProp) => {
    let content = null;
    const photos = filter(item.photos, (item) => item);

    if (isEmpty(photos)) {
        content = <PlaceholderImage />;
    } else {
        content =
            photos.length > 1 ? (
                <Carousel className="room-carousel" draggable infinite={false}>
                    {item.photos.map((item) => (
                        <div className="room-image" key={item}>
                            <img src={item} alt="" />
                        </div>
                    ))}
                </Carousel>
            ) : (
                <div className="room-image">
                    <img src={item.photos[0]} alt="" />
                </div>
            );
    }

    return content;
};
