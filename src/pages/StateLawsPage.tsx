
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStateByCode } from '@/hooks/useStateRules';
import StateSelector from '@/components/learning/StateSelector';

const StateLawsPage: React.FC = () => {
  // This is a placeholder page that will be removed
  return <Navigate to="/" replace />;
};

export default StateLawsPage;
