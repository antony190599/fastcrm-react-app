# FastCRM - Gestor de Plantillas y Comunicaciones

FastCRM es una aplicación web diseñada para gestionar relaciones con clientes, enfocada específicamente en la creación de plantillas y comunicaciones con contactos. La aplicación permite administrar empresas, contactos y optimizar la comunicación a través de plantillas personalizadas.

![FastCRM](https://via.placeholder.com/800x400?text=FastCRM+Dashboard)

## Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca principal para construcción de interfaces
- **Vite**: Herramienta de construcción y desarrollo
- **React Router 6**: Navegación y enrutamiento
- **Tailwind CSS**: Framework de estilos utilitarios
- **Axios**: Cliente HTTP para comunicación con el backend
- **Heroicons**: Iconografía moderna
- **Recharts**: Biblioteca para visualización de datos
- **Yup**: Validación de formularios

### Integración y Despliegue
- **GitHub Actions**: CI/CD automatizado
- **Netlify/Vercel**: Despliegue de frontend

## Instrucciones de Instalación Local

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Pasos para Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd fastcrm-react-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o con yarn
   yarn install
   ```

3. **Configurar variables de entorno**
   - Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   # o con yarn
   yarn dev
   ```

5. **Acceder a la aplicación**
   - Navegar a `http://localhost:5173` en su navegador

## Funcionalidades Principales

### Dashboard
- Visualización de métricas clave
- Gráficos de distribución de plantillas y mensajes
- Actividad reciente

### Gestión de Empresas
- Registro y administración de empresas
- Visualización detallada de información de empresa
- Vinculación con contactos asociados

### Gestión de Contactos
- CRUD completo de contactos
- Historial de interacciones por contacto
- Registro de comunicaciones

### Sistema de Plantillas
- Creación y edición de plantillas para diversos tipos de comunicación
- Categorización por etiquetas
- Editor con formato de texto

### Comunicación con Clientes
- Envío de mensajes individuales y masivos
- Integración con Email y WhatsApp
- Seguimiento del estado de los mensajes enviados

### Historial de Interacciones
- Registro cronológico de todas las interacciones
- Filtros avanzados por tipo, estado y fecha
- Métricas de efectividad

## Funcionalidades Extra Implementadas

1. **Sistema de Mensajería Masiva**
   - Envío de mensajes a múltiples contactos simultáneamente
   - Opciones de descarte automático
   - Seguimiento de estado por contacto

2. **Filtrado Avanzado de Plantillas**
   - Búsqueda por tipo y contenido
   - Categorización mediante etiquetas personalizables

3. **Integración con Múltiples Canales**
   - Soporte para Email y WhatsApp
   - Interfaces adaptadas a cada canal

4. **Historial Detallado de Interacciones**
   - Visualización cronológica de todas las comunicaciones
   - Filtros por método, estado y fecha

5. **Diseño Responsivo**
   - Experiencia optimizada para dispositivos móviles, tablets y escritorio
   - Componentes adaptativos según el tamaño de pantalla

## Decisiones Técnicas Clave

1. **Arquitectura Basada en Componentes**
   - Estructura modular para facilitar el mantenimiento y la escalabilidad
   - Separación clara entre lógica de negocio y presentación

2. **Estado Global Minimalista**
   - Uso de props y context API para estados compartidos
   - Evitando la sobre-ingeniería con soluciones complejas de estado

3. **Optimización de Rendimiento**
   - Implementación de React.memo para componentes pesados
   - Lazy loading para rutas secundarias

4. **Validación en Cliente y Servidor**
   - Esquemas Yup para validación en frontend
   - Validación duplicada en backend para seguridad

5. **Estrategia de Estilos**
   - Uso de Tailwind CSS para desarrollo rápido y consistente
   - Componentes de UI reutilizables con estilos configurables

6. **Gestión de Errores**
   - Manejo centralizado de errores de API
   - Feedback visual claro para el usuario

## Estructura del Proyecto

```
fastcrm-react-app/
├── public/              # Archivos públicos y estáticos
├── src/                 # Código fuente
│   ├── components/      # Componentes React
│   │   ├── common/      # Componentes compartidos (botones, modales, etc.)
│   │   ├── companies/   # Componentes relacionados con empresas
│   │   ├── contacts/    # Componentes relacionados con contactos
│   │   ├── dashboard/   # Componentes del dashboard
│   │   ├── history/     # Componentes de historial
│   │   ├── layout/      # Componentes de estructura (navbar, sidebar)
│   │   └── templates/   # Componentes de plantillas y mensajes
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios de API
│   ├── App.jsx          # Componente principal
│   ├── index.css        # Estilos globales
│   └── main.jsx         # Punto de entrada
└── ...
```