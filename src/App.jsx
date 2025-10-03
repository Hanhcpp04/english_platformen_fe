import { PublicPage, PrivatePage } from './Pages'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {
  // Combine all pages for routing
  const allPages = [...PublicPage, ...PrivatePage];

  return (
    <Router>
      <div>
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
        </Routes>
      </div>
    </Router>
  )
}
export default App
