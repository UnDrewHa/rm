import {LoadingOutlined, UploadOutlined} from '@ant-design/icons';
import {
    message,
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Typography,
    Upload,
} from 'antd';
import {FormInstance} from 'antd/lib/form';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {uuid} from 'uuidv4';
import {FormSkeleton} from 'Core/components/FormSkeleton';
import {EPageMode, EUploadingStatus} from 'Core/enums';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {defaultValidateMessages, validationConsts} from 'Core/validationConsts';
import {BuildingsAutocomplete} from 'Modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'Modules/buildings/models';
import {RoomsActions} from 'Modules/rooms/actions/RoomsActions';
import {IRoomFullModel} from 'Modules/rooms/models';
import {RoomsService} from 'Modules/rooms/service/RoomsService';

interface IState {
    pageMode: EPageMode;
    building: IBuildingModel;
    uploadingStatus: EUploadingStatus;
    fileList: any[];
    previewVisible: boolean;
    previewImage: string;
}

interface IStateProps {
    item: IAsyncData<IRoomFullModel>;
}

interface IDispatchProps {
    actions: RoomsActions;
}

interface IOwnProps {
    location: any;
    match: any;
    history: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class RoomEdit extends React.Component<TProps, IState> {
    constructor(props: TProps) {
        super(props);

        const {location} = props;
        const queryParams = queryParser.parse(location.search);
        let pageMode = EPageMode.CREATE;

        if (queryParams.id) {
            pageMode = EPageMode.EDIT;
            props.actions.getById(queryParams.id as string);
        }

        this.state = {
            pageMode,
            building: null,
            uploadingStatus: EUploadingStatus.NONE,
            fileList: [],
            previewVisible: false,
            previewImage: '',
        };
    }

    componentDidUpdate(prev) {
        const {item} = this.props;

        if (item.data && item.data !== prev.item.data) {
            this.setState({
                fileList: item.data.photos.map((src) => ({
                    uid: uuid(),
                    name: 'image',
                    status: 'done',
                    url: src,
                })),
            });
        }
    }

    formRef = React.createRef<FormInstance>();

    resetForm = () => {
        isFunction(this?.formRef?.current?.resetFields) &&
            this.formRef.current.resetFields();
    };

    getInitialFormData = (item) => {
        const data = this.state.pageMode === EPageMode.EDIT ? item : null;

        return {
            name: data?.name || '',
            description: data?.description || '',
            seats: data?.seats || 1,
            floor: data?.floor || 1,
            building: data?.building?.address || '',
            tv: data?.tv || false,
            projector: data?.projector || false,
            whiteboard: data?.whiteboard || false,
            flipchart: data?.flipchart || false,
        };
    };

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option,
        });
    };

    handleFinish = (values) => {
        const {building, fileList} = this.state;
        const {location, actions, item} = this.props;
        const queryParams = queryParser.parse(location.search);
        const method =
            this.state.pageMode === EPageMode.CREATE
                ? actions.create
                : actions.update;

        method({
            _id: queryParams.id as string,
            ...values,
            building: building?._id || item.data.building._id,
            photos: fileList.map((file) => file?.response?.data || file.url),
        }).then(this.resetForm);
    };

    handleBeforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Можно загрузить фото следующих форматов: JPG, PNG');
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            message.error('Размер загружаемого файла не должен превышать 1Мб');
        }

        return isJpgOrPng && isLt2M;
    };

    handleUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState((prev) => ({
                uploadingStatus: EUploadingStatus.UPLOADING,
            }));
        } else if (info.file.status === 'done') {
            this.setState(
                (prev) => ({
                    uploadingStatus: EUploadingStatus.DONE,
                }),
                () => {
                    message.success(i18n.t('Users:upload.success'));
                },
            );
        } else if (info.file.status === 'error') {
            this.setState({
                uploadingStatus: EUploadingStatus.ERROR,
            });
            message.error(i18n.t('Users:upload.error'));
        }

        this.setState({
            fileList: info.fileList,
        });
    };

    handlePreview = (file) => {
        this.setState({
            previewImage: file?.response?.data || file.url,
            previewVisible: true,
        });
    };

    handleCancel = () => this.setState({previewVisible: false});

    render() {
        const {
            pageMode,
            uploadingStatus,
            fileList,
            previewVisible,
            previewImage,
        } = this.state;
        const {
            item: {status, data},
        } = this.props;
        const isLoading = status === EStatusCodes.PENDING;
        const isUploading = uploadingStatus === EUploadingStatus.UPLOADING;
        const UploadButton = () => (
            <React.Fragment>
                {isUploading ? <LoadingOutlined /> : <UploadOutlined />}
                <br />
                {i18n.t('Rooms:edit.upload')}
            </React.Fragment>
        );

        if (isLoading) {
            return <FormSkeleton fields={10} />;
        }

        return (
            <Row gutter={{xs: 8, sm: 16, md: 24}}>
                <Col span={12}>
                    <Typography.Title level={4}>
                        {i18n.t('Rooms:edit.title')}
                    </Typography.Title>
                    <Form
                        validateMessages={defaultValidateMessages}
                        ref={this.formRef}
                        className="admin-form"
                        initialValues={{
                            ...this.getInitialFormData(data),
                        }}
                        onFinish={this.handleFinish}
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        layout="vertical"
                    >
                        <Form.Item
                            name="building"
                            rules={validationConsts.common.required}
                            label={i18n.t('Rooms:edit.buildingPlaceholder')}
                        >
                            <BuildingsAutocomplete
                                onSelect={this.handleBuildingSelect}
                            />
                        </Form.Item>
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
                        <Form.Item
                            name="floor"
                            label={i18n.t('Rooms:edit.floorPlaceholder')}
                            rules={validationConsts.room.floor}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item name="tv" valuePropName="checked">
                            <Checkbox>{i18n.t('Rooms:common.tv')}</Checkbox>
                        </Form.Item>
                        <Form.Item name="projector" valuePropName="checked">
                            <Checkbox>
                                {i18n.t('Rooms:common.projector')}
                            </Checkbox>
                        </Form.Item>
                        <Form.Item name="whiteboard" valuePropName="checked">
                            <Checkbox>
                                {i18n.t('Rooms:common.whiteboard')}
                            </Checkbox>
                        </Form.Item>
                        <Form.Item name="flipchart" valuePropName="checked">
                            <Checkbox>
                                {i18n.t('Rooms:common.flipchart')}
                            </Checkbox>
                        </Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                        >
                            {pageMode === EPageMode.CREATE
                                ? i18n.t('actions.create')
                                : i18n.t('actions.save')}
                        </Button>
                    </Form>
                </Col>
                <Col span={12}>
                    <Typography.Title level={4}>
                        {i18n.t('Rooms:edit.photoTitle')}
                    </Typography.Title>
                    <Upload
                        action="rooms/upload"
                        withCredentials
                        name="photo"
                        beforeUpload={this.handleBeforeUpload}
                        onChange={this.handleUploadChange}
                        onPreview={this.handlePreview}
                        fileList={fileList}
                        listType="picture-card"
                        iconRender={() => null}
                        disabled={isLoading}
                    >
                        {fileList.length === 3 ? null : <UploadButton />}
                    </Upload>
                    <Modal
                        visible={previewVisible}
                        title={null}
                        footer={null}
                        onCancel={this.handleCancel}
                        closable={false}
                    >
                        <img
                            alt="example"
                            style={{width: '100%'}}
                            src={previewImage}
                        />
                    </Modal>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        item: state.rooms.details,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new RoomsActions(new RoomsService(), dispatch),
});

const connected = withRouter(
    connect<IStateProps, IDispatchProps, IOwnProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(RoomEdit),
);

export {connected as RoomEdit};
