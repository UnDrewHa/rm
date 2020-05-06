import {BuildOutlined} from '@ant-design/icons';
import {AutoComplete, Input} from 'antd';
import {EStatusCodes} from 'core/reducer/enums';
import {IAsyncData} from 'core/reducer/model';
import {TAppStore} from 'core/store/model';
import i18n from 'i18next';
import {BuildingsActions} from 'modules/buildings/actions/BuildingsActions';
import {IBuildingModel} from 'modules/buildings/models';
import {BuildingsService} from 'modules/buildings/service/BuildingsService';
import {IUserModel} from 'modules/users/models';
import React from 'react';
import {connect} from 'react-redux';

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
                className="building-autocomplete"
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
    buildingsData: state.buildings.list,
    userInfo: state.users.profile,
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
