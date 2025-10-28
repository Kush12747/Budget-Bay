import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import SearchResultsPage from './pages/SearchResultsPage/SearchResultsPage';
import ProductCreatePage from './pages/ProductCreatePage/ProductCreatePage';
import ProductDetailsPage from './pages/ProductDetailsPage/ProductDetailsPage';
import ProductEditPage from './pages/ProductEditPage/ProductEditPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CheckoutButton from './components/common/CheckoutButton';
import Success from './pages/StripePage/Success';
import Cancel from './pages/StripePage/Cancel';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/checkout" element={<CheckoutButton productName="" amount={0} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/create" 
          element={
            <ProtectedRoute>
              <ProductCreatePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/edit/:productId" 
          element={
            <ProtectedRoute>
              <ProductEditPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App;