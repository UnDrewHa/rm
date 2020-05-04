import {List, Skeleton} from 'antd';
import React from 'react';
import {RoomDescription} from 'Modules/rooms/components/RoomDescription';
import {RoomImage} from 'Modules/rooms/components/RoomImage';
import {RoomTitle} from 'Modules/rooms/components/RoomTitle';
import {IRoomModel} from 'Modules/rooms/models';
import '../styles/roomsList.scss';

interface IOwnProps {
    rooms: IRoomModel[];
    isLoading: boolean;
    renderActions: (item: IRoomModel) => JSX.Element;
}

const renderExtra = (item: IRoomModel) => {
    return (
        <div className="rooms-list__extra">
            <RoomImage item={item} />
        </div>
    );
};

export const RoomsList = ({
    isLoading,
    rooms = [{} as any, {} as any, {} as any],
    renderActions,
}: IOwnProps) => {
    return isLoading ? (
        <List
            className="rooms-list"
            itemLayout="horizontal"
            dataSource={[1, 2, 3]}
            renderItem={() => (
                <List.Item>
                    <Skeleton active />
                </List.Item>
            )}
        />
    ) : (
        <List
            className="rooms-list"
            itemLayout="horizontal"
            dataSource={rooms}
            renderItem={(item: IRoomModel) => (
                <List.Item extra={renderExtra(item)}>
                    <List.Item.Meta
                        className="rooms-list__meta"
                        title={<RoomTitle item={item} />}
                        description={<RoomDescription item={item} />}
                    />
                    <div className="rooms-list__actions">
                        {renderActions(item)}
                    </div>
                </List.Item>
            )}
        />
    );
};
