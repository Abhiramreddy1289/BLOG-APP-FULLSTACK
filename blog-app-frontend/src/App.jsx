import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import RootLayout from "./components/RootLayout"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import UserDashboard from "./components/UserDashboard"
import AuthorDashboard from "./components/AuthorDashboard"
import AdminDashboard from "./components/AdminDashboard"
import ArticleDetails from "./components/ArticleDetails"
import AddArticle from "./components/AddArticle"
import DeletedArticles from "./components/DeletedArticles"

const router = createBrowserRouter([
 {
  path:"/",
  element:<RootLayout/>,
  children:[
   { index:true, element:<Home/> },
   { path:"login", element:<Login/> },
   { path:"register", element:<Register/> },
   { path:"user-dashboard", element:<UserDashboard/> },
   { path:"author-dashboard", element:<AuthorDashboard/> },
   { path:"admin-dashboard", element:<AdminDashboard/> },
   { path:"add-article", element:<AddArticle/> },
   { path:"deleted-articles", element:<DeletedArticles/> },

   // 🔹 NEW ROUTE
   { path:"article/:articleId", element:<ArticleDetails/> }
  ]
 }
])

function App(){
 return (
   <>
    <Toaster position="top-right"/>
    <RouterProvider router={router}/>
   </>
 )
}

export default App