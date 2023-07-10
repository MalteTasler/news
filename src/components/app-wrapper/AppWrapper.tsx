import React from 'react'
import { Provider } from 'react-redux'
import { ChaynsProvider } from 'chayns-api'
import App from './app/App'
import store from '../../redux-modules'

const AppWrapper = () => 
    <ChaynsProvider>
        <Provider store={store}>
            <App/>
        </Provider>
    </ChaynsProvider>

AppWrapper.DisplayName = "AppWrapper"

export default AppWrapper