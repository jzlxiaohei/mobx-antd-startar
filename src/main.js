import React from 'react';
import { render } from 'react-dom';
import { useStrict } from 'mobx'
import { AppContainer } from 'react-hot-loader';
import App from './App';
import './models/globals'

useStrict(true);

const rootEl = document.getElementById('root');

render(<AppContainer>
  <App/>
</AppContainer>, rootEl);

if (module.hot) {
  module.hot.accept('./App', () => {
    require('./App');
    render(<AppContainer>
      <App/>
    </AppContainer>, rootEl);
  });
}
