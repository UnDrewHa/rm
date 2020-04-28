import {BuildOutlined} from '@ant-design/icons';
import {AutoComplete, Input} from 'antd';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {EStatusCodes} from 'Core/reducer/enums';
import {IAsyncData} from 'Core/reducer/model';
import {TAppStore} from 'Core/store/model';
import {BuildingsActions} from 'Modules/buildings/actions/BuildingsActions';
import {IBuildingModel} from 'Modules/buildings/models';
import {BuildingsService} from 'Modules/buildings/service/BuildingsService';
import {IUserModel} from 'Modules/users/models';

interface IOwnProps {
    onSelect: (value, option) => void;
}

interface IStateProps {
    buildingsData: IAsyncData<IBuildingModel[]>;
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    buildingsActions: BuildingsActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

class BuildingsAutocomplete extends React.Component<TProps> {
    constructor(props) {
        super(props);
        const {buildingsActions, buildingsData} = this.props;

        if (buildingsData.status === EStatusCodes.IDLE) {
            buildingsActions.getAll();
        }
    }

    getOptions = (buildings: IBuildingModel[]) => {
        return buildings.map((item) => ({
            value: item.address,
            fullValue: item.address + item.name,
            ...item,
        }));
    };

    render() {
        const {buildingsData, userInfo, ...restProps} = this.props;
        const buildingsIsLoading =
            buildingsData.status === EStatusCodes.PENDING;

        return (
            <AutoComplete
                {...restProps}
                options={this.getOptions(buildingsData.data)}
                filterOption={(inputValue, option) =>
                    option.fullValue
                        .toUpperCase()
                        .includes(inputValue.toUpperCase())
                }
                disabled={buildingsIsLoading}
                onSelect={this.props.onSelect}
            >
                <Input.Search
                    prefix={<BuildOutlined className="site-form-item-icon" />}
                    placeholder={i18n.t('Auth:signup.buildingPlaceholder')}
                />
            </AutoComplete>
        );
    }
}

const mapStateToProps = (state: TAppStore): IStateProps => ({
    buildingsData: state.buildings,
    userInfo: state.user,
});

const mapDispatchToProps = (dispatch): IDispatchProps => ({
    buildingsActions: new BuildingsActions(new BuildingsService(), dispatch),
});

/**
 * Компонент выборы здания.
 */
const connected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BuildingsAutocomplete);

export {connected as BuildingsAutocomplete};
