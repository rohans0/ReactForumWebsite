import { Auth0Provider } from '@auth0/auth0-react';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev-8empq0wkhv38y5d8.us.auth0.com"
			clientId="SIf2chI6cPdh8yrusKEhvgohZ10qoYaa"
			authorizationParams={{
				redirect_uri: window.location.origin
			}}
		>
			<App />
		</Auth0Provider>,
  </React.StrictMode>
);
