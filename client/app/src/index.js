import ReactDOM from 'react-dom/client';
import App from './App';
import './configs/axios.config.js'
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
console.log(process.env.REACT_APP_SERVER_BASE_URL)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
