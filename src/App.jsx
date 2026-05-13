import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CustomCursor from './components/CustomCursor';

import ManagePerformances from './pages/ManagePerformances';
import ProductionDetails from './pages/ProductionDetails';
import PerformanceDetails from './pages/PerformanceDetails';
import ClerkDashboard from './pages/ClerkDashboard';
import SearchPatron from './pages/SearchPatron';
import LoginMedallionTheatre from './pages/LoginMedallionTheatre';
import RegisterPatron from './pages/RegisterPatron';
import PatronDetails from './pages/PatronDetails';
import ReserveTicketsAdjustedBoxSeating from './pages/ReserveTicketsAdjustedBoxSeating';
import ReservationConfirmation from './pages/ReservationConfirmation';
import CancelReschedule from './pages/CancelReschedule';
import ManageProductions from './pages/ManageProductions';
import ManageReservations from './pages/ManageReservations';
import Reports from './pages/Reports';

import Modal from './components/Modal';

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Modal />
      <Routes>
        {/* Public Routes */}
        <Route path="/login-medallion-theatre" element={<LoginMedallionTheatre />} />
        
        {/* Root Redirect to Login or Dashboard */}
        <Route path="/" element={<Navigate to="/clerk-dashboard" replace />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
          {/* Shared Routes (Both Clerk & Manager) */}
          <Route path="/clerk-dashboard" element={<ClerkDashboard />} />
          <Route path="/search-patron" element={<SearchPatron />} />
          <Route path="/register-patron" element={<RegisterPatron />} />
          <Route path="/patron/:id" element={<PatronDetails />} />
          <Route path="/reserve-tickets" element={<ReserveTicketsAdjustedBoxSeating />} />
          <Route path="/reserve-tickets/:id" element={<ReserveTicketsAdjustedBoxSeating />} />
          <Route path="/manage-reservations" element={<ManageReservations />} />
          <Route path="/reservation-confirmation" element={<ReservationConfirmation />} />
          <Route path="/reservation/:id/manage" element={<CancelReschedule />} />

          {/* Manager Only Routes */}
          <Route 
            path="/manage-productions" 
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <ManageProductions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/production/:id" 
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <ProductionDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manage-performances" 
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <ManagePerformances />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/performance/:id" 
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <PerformanceDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <Reports />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all for protected area */}
          <Route path="*" element={<Navigate to="/clerk-dashboard" replace />} />
        </Route>

        {/* Global Catch-all */}
        <Route path="*" element={<Navigate to="/login-medallion-theatre" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
