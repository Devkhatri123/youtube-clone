import './App.css';
import MainPage from './Component/MainPage';
import Navbar from './Component/Navbar';
import MiniSideBar from './Component/MiniSideBar';
import Footer from './Component/Footer';
import StateProvider from './Context/HidevideoinfoCard';
import NavbarStateProvider from './Context/NavbarContext';
function App() {
 
  return (
    <div className="App">
      <StateProvider>
        <NavbarStateProvider>
       <Navbar/>
       </NavbarStateProvider>
       <MainPage/>
       <Footer/>
       <MiniSideBar/>
       </StateProvider>
     </div>
  );
}

export default App;
