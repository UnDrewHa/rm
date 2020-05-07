import {Modal} from 'antd';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import {RoomCard} from 'modules/rooms/components/RoomCard';
import React from 'react';

interface IOwnProps {
    visible: boolean;
    onCancel: () => void;
    footer?: any;
    roomId: string;
}

export class RoomDetailsModal extends React.Component<IOwnProps> {
    handleHideRoomModal = () => {
        const {onCancel} = this.props;

        isFunction(onCancel) && onCancel();
    };

    render() {
        const {visible, roomId, footer = null} = this.props;

        return (
            <Modal
                title={i18n.t('Rooms:modal.detailsTitle')}
                visible={visible}
                onCancel={this.handleHideRoomModal}
                footer={footer}
            >
                <RoomCard id={roomId} bordered={false} />
            </Modal>
        );
    }
}
