import {
    CheckSquareOutlined,
    MinusSquareOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Carousel, List, Skeleton, Typography} from 'antd';
import i18n from 'i18next';
import {filter, isEmpty} from 'lodash-es';
import React from 'react';
import {PlaceholderImage} from 'Core/components/PlaceholderImage';
import {FavouriteRoomIcon} from 'Modules/rooms/components/FavouriteRoomIcon';
import {IRoomModel} from 'Modules/rooms/models';
import '../styles/roomsList.scss';

interface IOwnProps {
    rooms: IRoomModel[];
    isLoading: boolean;
    renderActions: (item: IRoomModel) => JSX.Element;
}

const renderDescription = (item: IRoomModel) => {
    return (
        <React.Fragment>
            <Typography.Paragraph className="rooms-list__description">
                {item.description}
            </Typography.Paragraph>
            <Typography.Paragraph className="rooms-list__options">
                <Typography.Text>
                    <UserOutlined /> {item.seats} {i18n.t('Rooms:common.seats')}
                </Typography.Text>
                <Typography.Text>
                    {item.tv ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.tv')}
                </Typography.Text>
                <Typography.Text>
                    {item.projector ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.projector')}
                </Typography.Text>
                <Typography.Text>
                    {item.whiteboard ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.whiteboard')}
                </Typography.Text>
                <Typography.Text>
                    {item.flipchart ? (
                        <CheckSquareOutlined />
                    ) : (
                        <MinusSquareOutlined />
                    )}{' '}
                    {i18n.t('Rooms:common.flipchart')}
                </Typography.Text>
            </Typography.Paragraph>
        </React.Fragment>
    );
};

const renderExtra = (item: IRoomModel) => {
    let extra = null;
    const photos = filter(item.photos, (item) => item);

    if (isEmpty(photos)) {
        extra = (
            <div className="rooms-list__extra">
                <PlaceholderImage />
            </div>
        );
    } else {
        extra =
            photos.length > 1 ? (
                <Carousel
                    className="rooms-list__carousel"
                    draggable
                    infinite={false}
                >
                    {item.photos.map((item) => (
                        <div className="rooms-list__image">
                            <img src={item} />
                        </div>
                    ))}
                </Carousel>
            ) : (
                <div className="rooms-list__image">
                    <img src={item.photos[0]} />
                </div>
            );
    }

    return extra;
};

const renderTitle = (item: IRoomModel) => {
    return (
        <div className="rooms-list__title">
            <FavouriteRoomIcon roomId={item._id} /> {item.name}
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
                        title={renderTitle(item)}
                        description={renderDescription(item)}
                    />
                    <div className="rooms-list__actions">
                        {renderActions(item)}
                    </div>
                </List.Item>
            )}
        />
    );
};
