import {LinearProgress, TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import i18n from 'i18next';
import {find} from 'lodash-es';
import {isFunction} from 'lodash-es';
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
    onSelect: (building: IBuildingModel) => void;
    userBuildingSelected?: boolean;
}

interface IStateProps {
    buildingsData: IAsyncData<IBuildingModel[]>;
    userInfo: IAsyncData<IUserModel>;
}

interface IDispatchProps {
    buildingsActions: BuildingsActions;
}

type TProps = IOwnProps & IStateProps & IDispatchProps;

interface IState {
    building: IBuildingModel;
}

class BuildingsAutocomplete extends React.Component<TProps, IState> {
    constructor(props) {
        super(props);
        const {buildingsActions, buildingsData} = this.props;

        this.state = {
            building: null,
        };

        if (buildingsData.status === EStatusCodes.IDLE) {
            buildingsActions.getAll();
        }
    }

    /**
     * Обработчик выбора здания.
     *
     * @param event Объект события.
     * @param {IBuildingModel} building Выбранное здание.
     */
    handleBuildingSelect = (event, building: IBuildingModel) => {
        const {onSelect} = this.props;

        this.setState(
            {
                building,
            },
            () => {
                isFunction(onSelect) && onSelect(building);
            },
        );
    };

    render() {
        const {building} = this.state;
        const {buildingsData, userInfo, userBuildingSelected} = this.props;
        const buildingsIsLoading =
            buildingsData.status === EStatusCodes.PENDING;
        const userBuilding = userBuildingSelected //TODO: перенести на уровень выше
            ? find(
                  buildingsData.data,
                  (item) => item._id === userInfo?.data?.building,
              ) || null
            : null;

        return (
            <div>
                <Autocomplete
                    id="building"
                    options={buildingsData.data}
                    getOptionLabel={(item) => item.address}
                    onChange={this.handleBuildingSelect}
                    value={building || userBuilding}
                    disabled={buildingsIsLoading}
                    disabledItemsFocusable={buildingsIsLoading}
                    disableClearable
                    renderInput={(params) => {
                        return (
                            <TextField
                                {...params}
                                label={i18n.t(
                                    'Auth:signup.buildingPlaceholder',
                                )}
                                variant="outlined"
                            />
                        );
                    }}
                />
                {buildingsIsLoading && <LinearProgress />}
            </div>
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
 * Страница регистрации.
 */
const connected = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BuildingsAutocomplete);

export {connected as BuildingsAutocomplete};
