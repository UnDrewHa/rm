import {isFunction} from 'lodash-es';
import {TextField, LinearProgress} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import i18n from 'i18next';
import React from 'react';
import {connect} from 'react-redux';
import {EStatusCodes} from 'src/core/reducer/enums';
import {IAsyncData} from 'src/core/reducer/model';
import {TAppStore} from 'src/core/store/model';
import {BuildingsActions} from 'src/modules/buildings/actions/BuildingsActions';
import {IBuildingModel} from 'src/modules/buildings/models';
import {BuildingsService} from 'src/modules/buildings/service/BuildingsService';

interface IOwnProps {
    onSelect: (building: IBuildingModel) => void;
}

interface IStateProps {
    buildingsData: IAsyncData<IBuildingModel[]>;
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
        const {buildingsData} = this.props;
        const buildingsIsLoading =
            buildingsData.status === EStatusCodes.PENDING;

        return (
            <div>
                <Autocomplete
                    id="building"
                    options={buildingsData.data}
                    getOptionLabel={(item) => item.address}
                    onChange={this.handleBuildingSelect}
                    value={building} //TODO: Добавить выбор здания, в котором работает чувак.
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
