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
import {FormSkeleton} from 'core/components/FormSkeleton';
import {EPageMode, EUploadingStatus} from 'core/enums';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {RoomsActions} from 'modules/rooms/actions/RoomsActions';
import {IRoomFullModel} from 'modules/rooms/models';
import {RoomsService} from 'modules/rooms/service/RoomsService';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteChildrenProps} from 'react-router-dom';
import {uuid} from 'uuidv4';

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

interface IOwnProps extends RouteChildrenProps {}

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
        this.setState({
            uploadingStatus: EUploadingStatus.NONE,
            fileList: [],
            previewVisible: false,
            previewImage: '',
        });

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
            needApprove: data?.needApprove || false,
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
        const fullData = {
            _id: queryParams.id as string,
            ...values,
            building: building?._id || item.data.building._id,
        };

        const formData = new FormData();

        fileList.forEach((file) => {
            const key = file.url ? 'uploadedFiles' : 'files';
            formData.append(key, file.url || file);
        });

        Object.keys(fullData).forEach((key) => {
            formData.set(key, fullData[key]);
        });

        method(formData).then(this.resetForm);
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

        if (isJpgOrPng && isLt2M) {
            this.setState((state) => ({
                fileList: [...state.fileList, file],
            }));
        }

        return false;
    };

    handleRemove = (file) => {
        this.setState((state) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();

            newFileList.splice(index, 1);

            return {
                fileList: newFileList,
            };
        });
    };

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url,
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
                        <Form.Item name="needApprove" valuePropName="checked">
                            <Checkbox>
                                {i18n.t('Rooms:common.needApprove')}
                            </Checkbox>
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
                        beforeUpload={this.handleBeforeUpload as any}
                        onRemove={this.handleRemove}
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
