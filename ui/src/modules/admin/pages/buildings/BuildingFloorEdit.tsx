import {UploadOutlined} from '@ant-design/icons';
import {message, Button, Form, Result, Select, Upload} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import {FloorPlan} from 'modules/admin/pages/buildings/FloorPlan';
import {BuildingsActions} from 'modules/buildings/actions/BuildingsActions';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel, IFloorData} from 'modules/buildings/models';
import {BuildingsService} from 'modules/buildings/service/BuildingsService';
import React from 'react';
import {connect} from 'react-redux';

interface IState {
    building: IBuildingModel;
    floor: number;
}

interface IStateProps {
    floorData: IAsyncData<IFloorData>;
}

interface IDispatchProps {
    actions: BuildingsActions;
}

interface IOwnProps {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class BuildingFloorEdit extends React.Component<TProps, IState> {
    state = {
        building: null,
        floor: null,
    };

    formRef = React.createRef<FormInstance>();

    resetForm = () => {
        isFunction(this?.formRef?.current?.resetFields) &&
            this.formRef.current.resetFields();
    };

    /**
     * Обработчик выбора здания.
     */
    handleBuildingSelect = (value, option) => {
        this.setState({
            building: option,
        });
    };

    handleValuesChange = ({floor}) => {
        if (floor) {
            this.setState({
                floor,
            });
        }
    };

    handleFinish = (values) => {
        this.props.actions.getFloorData({
            ...values,
            building: this.state.building._id,
        });
    };

    getFloorList(): {value: number; label: string}[] {
        const {building} = this.state;
        const FLOOR_SELECT_DISABLED = !building;
        if (FLOOR_SELECT_DISABLED) {
            return [];
        }

        let list = [];

        for (let i = 1; i <= building.floors; i++) {
            list.push({value: i, label: i18n.t('Buildings:floor', {n: i})});
        }

        return list;
    }

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
            const {building, floor} = this.state;
            const {floorData} = this.props;
            const formData = new FormData();

            formData.set('building', building._id);
            formData.set('floor', floor);
            formData.set('file', file);

            if (floorData?.data?._id) {
                formData.set('_id', floorData.data._id);
            }

            this.props.actions.uploadPlan(formData);
        }

        return false;
    };

    render() {
        const {building} = this.state;
        const {
            floorData: {status, data},
            actions,
        } = this.props;
        const isLoading = status === EStatusCodes.PENDING;
        const floorSelectDisabled = !building;
        const emptyResultIsVisible =
            status === EStatusCodes.SUCCESS && data === null;
        const planIsVisible = status === EStatusCodes.SUCCESS && data;

        return (
            <React.Fragment>
                <Form
                    validateMessages={defaultValidateMessages}
                    ref={this.formRef}
                    className="admin-form"
                    initialValues={{}}
                    onFinish={this.handleFinish}
                    onValuesChange={this.handleValuesChange}
                    layout="inline"
                >
                    <Form.Item
                        name="building"
                        rules={validationConsts.common.required}
                        style={{width: 300}}
                    >
                        <BuildingsAutocomplete
                            onSelect={this.handleBuildingSelect}
                        />
                    </Form.Item>
                    {!floorSelectDisabled && ( //TODO в независимый компонент
                        <Form.Item
                            name="floor"
                            rules={validationConsts.common.required}
                            style={{width: 150}}
                        >
                            <Select
                                placeholder={i18n.t(
                                    'Buildings:filter.selectFloor',
                                )}
                            >
                                {this.getFloorList().map((item) => (
                                    <Select.Option
                                        key={item.label}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                    >
                        {i18n.t('actions.show')}
                    </Button>
                </Form>
                {emptyResultIsVisible && (
                    <Result
                        status="404"
                        title={i18n.t('Buildings:floorData.noData.title')}
                        subTitle={i18n.t('Buildings:floorData.noData.subtitle')}
                        extra={
                            <Upload
                                showUploadList={false}
                                beforeUpload={this.handleBeforeUpload}
                            >
                                <Button>
                                    <UploadOutlined />{' '}
                                    {i18n.t('Buildings:floorData.button')}
                                </Button>
                            </Upload>
                        }
                    />
                )}
                {planIsVisible && (
                    <FloorPlan
                        data={data}
                        buildingId={building._id}
                        beforeUpload={this.handleBeforeUpload}
                        actions={actions}
                    />
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        floorData: state.buildings.floorData,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new BuildingsActions(new BuildingsService(), dispatch),
});

const connected = connect<IStateProps, IDispatchProps, IOwnProps>(
    mapStateToProps,
    mapDispatchToProps,
)(BuildingFloorEdit);

export {connected as BuildingFloorEdit};
