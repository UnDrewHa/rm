import {Button, Checkbox, Form, Input, Select} from 'antd';
import {FormInstance} from 'antd/lib/form';
import {FormSkeleton} from 'core/components/FormSkeleton';
import {EPageMode} from 'core/enums';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import {defaultValidateMessages, validationConsts} from 'core/validationConsts';
import i18n from 'i18next';
import {isFunction} from 'lodash-es';
import {BuildingsAutocomplete} from 'modules/buildings/components/BuildingsAutocomplete';
import {IBuildingModel} from 'modules/buildings/models';
import {ERoles} from 'modules/permissions/enums';
import {UsersActions} from 'modules/users/actions/UsersActions';
import {IUserModel} from 'modules/users/models';
import {UsersService} from 'modules/users/service/UsersService';
import queryParser from 'query-string';
import React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteChildrenProps} from 'react-router-dom';

interface IState {
    pageMode: EPageMode;
    building: IBuildingModel;
}

interface IStateProps {
    item: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    actions: UsersActions;
}

interface IOwnProps extends RouteChildrenProps {}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class UserEdit extends React.Component<TProps, IState> {
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
        };
    }

    formRef = React.createRef<FormInstance>();

    resetForm = () => {
        isFunction(this?.formRef?.current?.resetFields) &&
            this.formRef.current.resetFields();
    };

    getInitialFormData = (item) => {
        const data = this.state.pageMode === EPageMode.EDIT ? item : null;

        return {
            login: data?.login || '',
            email: data?.email || '',
            role: data?.role || ERoles.USER,
            active: data?.active || true,
            building: data?.building?.address || '',
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
        const {location, actions, item} = this.props;
        const queryParams = queryParser.parse(location.search);
        const method =
            this.state.pageMode === EPageMode.CREATE
                ? actions.create
                : actions.update;

        method({
            _id: queryParams.id as string,
            ...values,
            building: this.state?.building?._id || item.data.building._id,
        }).then(this.resetForm);
    };

    render() {
        const {pageMode} = this.state;
        const {
            item: {status, data},
        } = this.props;
        const isLoading = status === EStatusCodes.PENDING;

        if (isLoading) {
            return <FormSkeleton fields={5} />;
        }

        return (
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
                    name="login"
                    label={i18n.t('Users:edit.loginPlaceholder')}
                    rules={validationConsts.user.login}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label={i18n.t('Users:edit.emailPlaceholder')}
                    rules={validationConsts.user.email as any}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item
                    name="building"
                    rules={validationConsts.common.required}
                >
                    <BuildingsAutocomplete
                        onSelect={this.handleBuildingSelect}
                    />
                </Form.Item>
                <Form.Item
                    name="role"
                    label={i18n.t('Users:edit.rolePlaceholder')}
                >
                    <Select defaultValue={ERoles.USER} style={{width: 120}}>
                        <Select.Option value={ERoles.USER}>
                            {ERoles.USER}
                        </Select.Option>
                        <Select.Option value={ERoles.ADMIN}>
                            {ERoles.ADMIN}
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="active" valuePropName="checked">
                    <Checkbox>
                        {i18n.t('Users:edit.activePlaceholder')}
                    </Checkbox>
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
        item: state.users.details,
    };
};

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    actions: new UsersActions(new UsersService(), dispatch),
});

const connected = withRouter(
    connect<IStateProps, IDispatchProps, IOwnProps>(
        mapStateToProps,
        mapDispatchToProps,
    )(UserEdit),
);

export {connected as UserEdit};
