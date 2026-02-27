import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Index from './Index.jsx';
import Reg from './components/Reg.jsx';
import Auto from './components/Auto.jsx';
import Cabinet from './components/Cabinet.jsx';
import Admin from './components/Admin.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Index />}></Route>
        <Route path="/registration" exact element={<Reg />}></Route>
        <Route path="/login" exact element={<Auto />}></Route>
        <Route path="/cabinet" exact element={<Cabinet />}></Route>
        <Route path="/admin" exact element={<Admin />}></Route>
      </Routes>
    </>
  )
}

export default App
