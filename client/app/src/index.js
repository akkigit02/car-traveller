import ReactDOM from 'react-dom/client';
import App from './App';
import './configs/axios.config.js'
import './assets/css/style.css';
import './assets/css/button.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'react-toastify/dist/ReactToastify.css';
console.log(process.env.REACT_APP_SERVER_BASE_URL)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
