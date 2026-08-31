import './globals.css';
import 'react-datepicker/dist/react-datepicker.css';

export const metadata = {
  title: 'Developer Platform',
  description: 'Manage your Workspaces, Projects, and API Keys.',
}

import { AppContextProvider } from '@/context/AppContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', position: 'relative' }}>
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </main>
      </body>
    </html>
  )
}
