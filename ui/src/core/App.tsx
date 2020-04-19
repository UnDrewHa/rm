import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import './styles/App.scss';
import {Provider} from 'react-redux';
import {LoadingOverlay} from 'src/core/components/LoadingOverlay';
import {Notifier} from 'src/core/components/Notifier';
import {RouterData} from './router';
import {store} from './store';
import {i18nInit} from './translation';
import {SnackbarProvider} from 'notistack';

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
