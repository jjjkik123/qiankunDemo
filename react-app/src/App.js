import logo from './logo.svg';
import './App.css';
import { Link, Routes, Route } from 'react-router-dom'
import List from './pages/List.tsx';
import Detail from './pages/Detail.jsx';

function App() {
  return (
    <div className="App">
     <h2>react 子应用</h2>
      <div className='menu'>
        <Link to={'/'}>list</Link>
        <Link to={'/detail'}>detail</Link>
      </div>
      <Routes>
        <Route path='/' element={<List />} />
        <Route path='/detail' element={<Detail />} />
      </Routes>
    </div>
  );
}

export default App;
