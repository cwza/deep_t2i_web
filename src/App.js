import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import Alert from 'react-bootstrap/Alert'
import { AnimeHeads, Birds } from './components'

function App() {
  return (
    <div>
      <h1>Deep_t2i simple demo site</h1>
      <Alert variant='warning'>
        Note: The first request may be slow due to the start up of the server. (Maybe 1 min)
      </Alert>
      <hr />
      <AnimeHeads />
      <hr />
      <Birds />
    </div>
  );
}

export default App;
