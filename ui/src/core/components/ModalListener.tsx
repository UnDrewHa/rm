import {Modal} from 'antd';
import {EEventNames} from 'core/EventEmitter/enums';
import {EventEmiter} from 'core/EventEmitter/EventEmitter';
import React from 'react';

export interface IModalProps {
    title: () => JSX.Element;
    renderFooter: () => JSX.Element;
    renderBody: () => JSX.Element;
}

interface IState {
    opened: boolean;
    data: IModalProps;
}

export class ModalListener extends React.Component<{}, IState> {
    constructor(props) {
        super(props);

        EventEmiter.subscribe(EEventNames.SHOW_MODAL, this.handleShowModal);

        this.state = {
            opened: false,
            data: null,
        };
    }

    handleShowModal = (data: IModalProps) => {
        this.setState({
            data,
            opened: true,
        });
    };

    handleClose = () => {
        this.setState({
            opened: false,
        });
    };

    render() {
        const {data, opened} = this.state;

        return (
            <Modal
                title={data?.title()}
                visible={opened}
                footer={data?.renderFooter()}
                onCancel={this.handleClose}
            >
                {data?.renderBody()}
            </Modal>
        );
    }
}
