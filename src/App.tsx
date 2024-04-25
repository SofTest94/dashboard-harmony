// // App.tsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/organisms/LoginPage';
// import HomePage from './components/pages/HomePage';
// import FluidTemplate from './components/templates/FluidTemplate';

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route
//           path="/home"
//           element={
//             <FluidTemplate>
//               <HomePage />
//             </FluidTemplate>
//           }
//         />

//         {/* Otros rutas */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/pages/LoginPage';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/organisms/LoginPage';
import AdminTemplate from './components/templates/AdminTemplate';
import EmployeePage from './components/pages/Employees/EmployeePage';
import AppointmentPage from './components/pages/Appointments/AppointmentPage';

import UserList from './components/pages/Users/UserListPage';
// import AppTemplate from './components/templates/AppTemplate'; // Importa la plantilla principal

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el login */}
        <Route path="/" element={<LoginPage />} />
        {/* Ruta para el contenido principal */}
        <Route
          path="/user"
          element={
            // Utiliza la plantilla principal para el contenido principal
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <UserList />
              </div>
            </AdminTemplate>
          }
        />
        <Route
          path="/home"
          element={
            // Utiliza la plantilla principal para el contenido principal
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <HomePage />
              </div>
            </AdminTemplate>
          }
        />

        <Route
          path="/appointments"
          element={
            // Utiliza la plantilla principal para el contenido principal
            <AdminTemplate>
              <div style={{ margin: '0% 5% 10% 5%' }}>
                <AppointmentPage />
              </div>
            </AdminTemplate>
          }
        />
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
};

export default App;
