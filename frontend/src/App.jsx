import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import NoteEditor from "./pages/NoteEditor";
import Search from "./pages/Search";
import AskBrain from "./pages/AskBrain";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/notes" element={<Notes/>}/>
          <Route path="/notes/:id" element={<NoteEditor/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/ask" element={<AskBrain/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
