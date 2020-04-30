import {Button, Form, Input, InputNumber} from 'antd';
import {FormInstance} from 'antd/lib/form';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {FormSkeleton} from 'Core/components/FormSkeleton';
import {EPageMode} from 'Core/enums';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {BuildingsActions} from 'Modules/buildings/actions/BuildingsActions';
import {IBuildingModel} from 'Modules/buildings/models';
import {BuildingsService} from 'Modules/buildings/service/BuildingsService';

interface IState {
    pageMode: EPageMode;
}

interface IStateProps {
    item: IAsyncData<IBuildingModel>;
}

interface IDispatchProps {
    actions: BuildingsActions;
}

interface IOwnProps {
    location: any;
    match: any;
    history: any;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class BuildingEdit extends React.Component<TProps, IState> {
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
        };
    }

    formRef = React.createRef<FormInstance>();

    resetForm = () => {
        isFunction(this?.formRef?.current?.resetFields) &&
            this.formRef.current.resetFields();
    };

    getInitialFormData = (item) => {
        console.log(item);
        return {
            name: item?.name || '',
            address: item?.address || '',
            floors: item?.floors || 1,
        };
    };

    handleFinish = (values) => {
        const {location, actions} = this.props;
        const queryParams = queryParser.parse(location.search);
        const method =
            this.state.pageMode === EPageMode.CREATE
                ? actions.create
                : actions.update;

        method({
            _id: queryParams.id as string,
            ...values,
        }).then(this.resetForm);
    };

    render() {
        const {pageMode} = this.state;
        const {
            item: {status, data},
        } = this.props;
        const isLoading = status === EStatusCodes.PENDING;

        if (isLoading) {
            return <FormSkeleton fields={3} />;
        }

        return (
            <Form
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
                    name="name"
                    label={i18n.t('Buildings:edit.namePlaceholder')}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label={i18n.t('Buildings:edit.addressPlaceholder')}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="floors"
                    label={i18n.t('Buildings:edit.floorsPlaceholder')}
                >
                    <InputNumber />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    {pageMode === EPageMode.CREATE
                        ? i18n.t('actions.create')
                        : i18n.t('actions.save')}
                </Button>
            </Form>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => {
    return {
        item: state.buildings.details,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new BuildingsActions(new BuildingsService(), dispatch),
});

const connected = withRouter(
    connect<IStateProps, IDispatchProps, IOwnProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(BuildingEdit),
);

export {connected as BuildingEdit};
