import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './routes/home/Home.tsx';
import RootLayout from './routes/RootLayout.tsx';
import WiseImport from './routes/import/WiseImport.tsx';
import Categorise from './routes/Categorise.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'import/wise',
        element: <WiseImport />,
      },
      {
        path: 'categorise',
        element: <Categorise />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
