import "./App.css";
import Layout from "./components/layout/layout";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <>
      <Sidebar />
      <Layout
        title="Dashboard"
        description="En este apoartado podras ver las Comparar el rendimiento día a día, Identificar picos y caídas de actividad Tomar decisiones informadas al instante"
      >
        <p>Sucursales Incidencias</p>
      </Layout>
    </>
  );
}

export default App;
