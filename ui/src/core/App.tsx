import {ConfigProvider} from 'antd';
import ru_RU from 'antd/es/locale/ru_RU';
import {SnackbarProvider} from 'notistack';
import React from 'react';
import {Provider} from 'react-redux';
import {LoadingOverlay} from 'Core/components/LoadingOverlay';
import {Notifier} from 'Core/components/Notifier';
import {RouterData} from './router';
import {store} from './store';
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
                    <ConfigProvider locale={ru_RU}>
                        <RouterData />
                    </ConfigProvider>
                </SnackbarProvider>
            </Provider>
        );
    }
}

export default App;
