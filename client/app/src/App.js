import { useEffect } from 'react';
import Route from './routes/Index';
import { Provider } from 'react-redux'
import store from './store';
function App() {

  return (
    <Provider store={store}>
      <Route />
    </Provider>
  );
}

export default App;
