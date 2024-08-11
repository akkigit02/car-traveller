import { useEffect } from 'react';
import Route from './routes/Index';
import { Provider } from 'react-redux'
import store from './store';
import { ToastContainer, toast } from 'react-toastify';
function App() {

  return (
    <Provider store={store}>
      <ToastContainer limit={5}
        autoClose={3000}
        newestOnTop={true}
      />
      <Route />

    </Provider>
  );
}

export default App;
