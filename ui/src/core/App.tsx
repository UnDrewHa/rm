import CssBaseline from '@material-ui/core/CssBaseline';
import {SnackbarProvider} from 'notistack';
import React from 'react';
import {Provider} from 'react-redux';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {Notifier} from 'Core/components/Notifier';
import {RouterData} from './router';
import {store} from './store';
import './styles/App.scss';
import {i18nInit} from './translation';

class App extends React.Component<{}, {isLoading: boolean}> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
        };

        i18nInit().then(() => {
            this.setState({
                isLoading: false,
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingOverlay open />;
        }

        return (
            <Provider store={store}>
                <SnackbarProvider maxSnack={3}>
                    <Notifier />
                    <CssBaseline />
                    <RouterData />
                </SnackbarProvider>
            </Provider>
        );
    }
}

export default App;
