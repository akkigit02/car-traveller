import ReactDOM from 'react-dom/client';
import App from './App';
import './configs/axios.config.js'
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import store from './services/store/index.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
