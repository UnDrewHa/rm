import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import './styles/App.scss';
import {Provider} from 'react-redux';
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
            return <div>Loading...</div>;
        }

        return (
            <Provider store={store}>
                <CssBaseline />
                <RouterData />
            </Provider>
        );
    }
}

export default App;
