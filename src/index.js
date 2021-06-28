import React from 'react';
import ReactDOM from 'react-dom';
import '../public/App.css';
import App from './App';
import { Provider } from 'react-redux'
import { store } from './Logic/redux/store'

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
	, document.getElementById('root')
);
