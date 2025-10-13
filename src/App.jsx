import { PublicPage, PrivatePage } from './Pages'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import OAuth2RedirectHandler from './service/OAuth2RedirectHandler';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  
  const allPages = [...PublicPage, ...PrivatePage];

  return (
    <Router>
      <div>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {
            allPages.map((page, index) => {
              const Page = page.component;
              const Layout = page.layout;
              
              return (
                <Route
                  key={index} 
                  path={page.path} 
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  } 
                />
              )
            })
          }
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
      </div>
    </Router>
  )
}
export default App
