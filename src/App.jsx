import './index.css';
import Templates from './pages/Templates';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 shadow-md">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-wide">ContactCenter CRM</h1>
          <nav className="space-x-4">
            <a href="#dashboard" className="hover:underline">Dashboard</a>
            <a href="#templates" className="hover:underline">Templates</a>
            <a href="#history" className="hover:underline">Historial</a>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <section id="dashboard" className="p-6 bg-white shadow-md">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-100 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Templates</h3>
                <p className="text-2xl font-bold">15</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Mensajes Enviados</h3>
                <p className="text-2xl font-bold">120</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Usuarios Activos</h3>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
        </section>
        <section id="templates" className="p-6 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <Templates />
          </div>
        </section>
        <section id="history" className="p-6 bg-white shadow-md">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl font-bold mb-4">Historial de Mensajes</h2>
            <ul className="space-y-4">
              <li className="p-4 bg-gray-100 rounded-lg shadow">
                <p className="text-sm text-gray-600">Enviado a: +123456789</p>
                <p className="text-gray-800">"Hola, este es un mensaje de prueba."</p>
                <p className="text-sm text-gray-500">Fecha: 2023-10-01</p>
              </li>
              {/* Agregar más mensajes aquí */}
            </ul>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-gray-300 py-4 text-center text-sm">
        © {new Date().getFullYear()} ContactCenter CRM. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default App;