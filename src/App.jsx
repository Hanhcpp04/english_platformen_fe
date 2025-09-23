import { PublicPage } from './Pages'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
function App() {
  return (
    <Router>
      <div>
        <Routes>
          {
            PublicPage.map((page,index)=>{
              const Page =page.component;
              const Layout =page.layout;
              if(Layout==null){
                return(
                  <Route
                  key={index} path={page.path} element={<Page/>}
                  />
                )
              }
              else{
                return(
                  <Route
                  key={index} path={page.path} element={
                    <Layout>
                        <Page/>
                    </Layout>
                  } 
                  />
                )
              }
            })
          }
        </Routes>
      </div>
    </Router>
  )
}
export default App
