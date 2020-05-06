import {
    Checkbox,
    Empty,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Skeleton,
    Tabs,
} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import {isEmpty} from 'lodash-es';
import {RoomsActions} from 'modules/rooms/actions/RoomsActions';
import {IRoomFullModel, IRoomModel} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

enum ERoomTabs {
    SELECT = 'SELECT',
    CREATE = 'CREATE',
}

interface IState {
    currentTab: ERoomTabs;
    room: string;
    confirmLoading: boolean;
    form: {
        name: string;
        description: string;
        seats: number;
        tv: boolean;
        projector: boolean;
        whiteboard: boolean;
        flipchart: boolean;
    };
}

interface IStateProps {
    item: IAsyncData<IRoomFullModel>;
    rooms: IAsyncData<IRoomModel[]>;
}

interface IDispatchProps {
    actions: RoomsActions;
}

interface IOwnProps {
    onCancel: (e) => void;
    onRoomSelect: (roomId) => void;
    visible: boolean;
    building: string;
    floor: number;
    location: any;
    match: any;
    history: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class RoomModal extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            currentTab: ERoomTabs.SELECT,
            confirmLoading: false,
            room: null,
            form: {
                name: '',
                description: '',
                seats: 1,
                tv: false,
                projector: false,
                whiteboard: false,
                flipchart: false,
            },
        };
    }

    handleTabChange = (currentTab: ERoomTabs) => {
        this.setState({
            currentTab,
        });
    };

    handleCancel = (e) => {
        const {actions, onCancel} = this.props;

        isFunction(onCancel) && onCancel(e);
        actions.clear();
    };

    handleCreated = (data) => {
        this.setState(
            {
                confirmLoading: false,
            },
            () => {
                isFunction(this.props.onRoomSelect) &&
                    this.props.onRoomSelect(data.data._id);
            },
        );
    };

    handleOk = () => {
        const {currentTab, room, form} = this.state;
        const {onRoomSelect, actions, building, floor} = this.props;

        if (currentTab === ERoomTabs.SELECT) {
            return isFunction(onRoomSelect) && onRoomSelect(room);
        }

        this.setState({
            confirmLoading: true,
        });

        const formData = new FormData();

        formData.set('building', building);
        formData.set('floor', floor.toString());

        Object.keys(form).forEach((key) => {
            formData.set(key, form[key]);
        });

        actions.create(formData, this.handleCreated);
    };

    handleValuesChange = (changedValues) => {
        this.setState((prev) => ({
            form: {
                ...prev.form,
                ...changedValues,
            },
        }));
    };

    handleRoomSelect = (room) => {
        this.setState({
            room,
        });
    };

    renderSelect = () => {
        const {actions, building, floor, rooms, visible} = this.props;
        const needsToLoad =
            visible === true && rooms.status === EStatusCodes.IDLE;
        const roomsLoading = rooms.status === EStatusCodes.PENDING;
        const emptyData = isEmpty(rooms.data);

        needsToLoad &&
            actions.find({
                filter: {
                    building,
                    floors: [floor],
                },
            });

        if (roomsLoading) {
            return <Skeleton active />;
        }

        if (emptyData) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description='Нет переговорных комнат в данном здании на выбранном этаже. Перейдите на вкладку "Создать", чтобы создать новую'
                />
            );
        }

        return (
            <Select onChange={this.handleRoomSelect} style={{width: 300}}>
                {rooms.data.map((item) => (
                    <Select.Option value={item._id}>{item.name}</Select.Option>
                ))}
            </Select>
        );
    };

    renderCreate = () => {
        return (
            <Form
                validateMessages={defaultValidateMessages}
                className="admin-form"
                layout="vertical"
                onValuesChange={this.handleValuesChange}
                initialValues={this.state.form}
            >
                <Form.Item
                    name="name"
                    label={i18n.t('Rooms:edit.namePlaceholder')}
                    rules={validationConsts.room.name}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label={i18n.t('Rooms:edit.descriptionPlaceholder')}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="seats"
                    label={i18n.t('Rooms:edit.seatsPlaceholder')}
                    rules={validationConsts.room.seats}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item name="tv" valuePropName="checked">
                    <Checkbox>{i18n.t('Rooms:common.tv')}</Checkbox>
                </Form.Item>
                <Form.Item name="projector" valuePropName="checked">
                    <Checkbox>{i18n.t('Rooms:common.projector')}</Checkbox>
                </Form.Item>
                <Form.Item name="whiteboard" valuePropName="checked">
                    <Checkbox>{i18n.t('Rooms:common.whiteboard')}</Checkbox>
                </Form.Item>
                <Form.Item name="flipchart" valuePropName="checked">
                    <Checkbox>{i18n.t('Rooms:common.flipchart')}</Checkbox>
                </Form.Item>
            </Form>
        );
    };

    renderModalContent = () => {
        const {currentTab} = this.state;
        return (
            <React.Fragment>
                <Tabs
                    defaultActiveKey={ERoomTabs.SELECT}
                    onChange={this.handleTabChange}
                >
                    <Tabs.TabPane
                        tab={i18n.t('Rooms:modal.SELECT')}
                        key={ERoomTabs.SELECT}
                    />
                    <Tabs.TabPane
                        tab={i18n.t('Rooms:modal.CREATE')}
                        key={ERoomTabs.CREATE}
                    />
                </Tabs>
                {currentTab === ERoomTabs.SELECT && this.renderSelect()}
                {currentTab === ERoomTabs.CREATE && this.renderCreate()}
            </React.Fragment>
        );
    };

    render() {
        const {currentTab, confirmLoading} = this.state;

        return (
            <Modal
                title={i18n.t('Rooms:modal.title')}
                visible={this.props.visible}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                okText={
                    currentTab === ERoomTabs.SELECT
                        ? i18n.t('Rooms:modal.select')
                        : i18n.t('Rooms:modal.createSelect')
                }
                confirmLoading={confirmLoading}
            >
                {this.renderModalContent()}
            </Modal>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        item: state.rooms.details,
        rooms: state.rooms.list,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new RoomsActions(new RoomsService(), dispatch),
});

const connected = withRouter(
    connect<IStateProps, IDispatchProps, IOwnProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(RoomModal),
);

export {connected as RoomModal};
