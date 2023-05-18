import { Routes, Route, BrowserRouter } from 'react-router-dom';

import AdminRoutes from './routes/AdminRoutes';
import HomeRoutes from './routes/HomeRoutes';
import Layout from './components/Home/Layout/Layout'
import AdminLayout from './components/Admin/AdminLayout/AdminLayout'

import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<Layout><HomeRoutes /></Layout>} />
        <Route path="/admin/*" element={<AdminLayout><AdminRoutes /></AdminLayout>} />
        <Route path="/admin/login" element={<AdminLayout>This is admin login page</AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
