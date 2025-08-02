# Componentes de Autenticación Reutilizables

Este conjunto de componentes proporciona una interfaz de autenticación OAuth2 limpia y moderna que puedes usar en cualquier proyecto React.

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── auth/
│       ├── Login.tsx          # Componente de login
│       └── AuthCallback.tsx   # Componente de callback
├── styles/
│   └── auth.css              # Estilos CSS globales
└── examples/
    └── AuthExample.tsx       # Ejemplo de implementación
```

## 🚀 Instalación

### 1. Dependencias Requeridas

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons
```

### 2. Copiar Archivos

Copia los siguientes archivos a tu proyecto:

- `src/components/auth/Login.tsx`
- `src/components/auth/AuthCallback.tsx`
- `src/styles/auth.css`

### 3. Importar CSS

En tu `App.tsx` o archivo principal:

```tsx
import './styles/auth.css';
```

## 📖 Uso

### Componente Login

```tsx
import Login from './components/auth/Login';

const MyLoginPage = () => {
  const handleLogin = async () => {
    // Tu lógica de OAuth2 aquí
    await AuthService.initiateLogin();
  };

  return (
    <Login 
      onLogin={handleLogin}
      title="Mi Aplicación"
      subtitle="Sistema de Gestión"
      buttonText="Iniciar Sesión"
      loadingText="Conectando..."
      infoText="Usa tus credenciales corporativas"
      footerText="© 2024 Mi Empresa"
    />
  );
};
```

### Componente AuthCallback

```tsx
import AuthCallback from './components/auth/AuthCallback';

const MyCallbackPage = () => {
  const handleCallback = async () => {
    // Tu lógica de procesamiento del callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    // Intercambiar código por token
    const response = await fetch('/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, grant_type: 'authorization_code' })
    });
    
    const tokenData = await response.json();
    localStorage.setItem('access_token', tokenData.access_token);
  };

  return (
    <AuthCallback 
      onAuthCallback={handleCallback}
      title="Mi Aplicación"
      subtitle="Sistema de Gestión"
      loadingText="Verificando credenciales..."
      successText="¡Bienvenido!"
      errorText="Error en la autenticación"
      retryText="🔄 Intentar de nuevo"
      footerText="© 2024 Mi Empresa"
      redirectDelay={1500}
    />
  );
};
```

## 🎨 Personalización

### Props Disponibles

#### Login Component
- `onLogin: () => Promise<void>` - Función de login (requerida)
- `title?: string` - Título de la aplicación
- `subtitle?: string` - Subtítulo
- `buttonText?: string` - Texto del botón
- `loadingText?: string` - Texto durante carga
- `infoText?: string` - Texto informativo
- `footerText?: string` - Texto del footer

#### AuthCallback Component
- `onAuthCallback: () => Promise<void>` - Función de callback (requerida)
- `onRetry?: () => void` - Función de reintento
- `title?: string` - Título de la aplicación
- `subtitle?: string` - Subtítulo
- `loadingText?: string` - Texto durante carga
- `successText?: string` - Texto de éxito
- `errorText?: string` - Texto de error
- `retryText?: string` - Texto del botón de reintento
- `footerText?: string` - Texto del footer
- `redirectDelay?: number` - Delay antes de redirigir (ms)

### Estilos CSS

El archivo `auth.css` incluye:

- **Reset global** para eliminar márgenes/padding no deseados
- **Fondo gris claro** (`#f5f5f5`) en lugar del gris oscuro
- **Centrado perfecto** de los componentes
- **Responsive design** para móviles
- **Estilos consistentes** para botones, títulos, etc.

## 🔧 Solución de Problemas

### Fondo Gris Oscuro

Si aparece un fondo gris oscuro, asegúrate de:

1. **Importar el CSS**: `import './styles/auth.css'`
2. **Verificar CSS global**: Revisa si hay estilos en `index.css` que sobrescriban
3. **Reset completo**: El CSS incluye un reset global

### Componente No Centrado

Si el componente no está centrado:

1. **Verificar contenedor**: Asegúrate de que el contenedor padre tenga `height: 100vh`
2. **CSS conflictivo**: Revisa si hay estilos que interfieran
3. **Flexbox**: El componente usa flexbox para centrado

### Fuente Barlow

Para usar la fuente Barlow:

```html
<!-- En tu index.html -->
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
```

## 📱 Responsive Design

Los componentes son completamente responsivos:

- **Desktop**: Máximo 400px de ancho
- **Tablet**: Padding reducido
- **Mobile**: Ancho completo, padding mínimo

## 🎯 Características

- ✅ **Diseño limpio y moderno**
- ✅ **Completamente personalizable**
- ✅ **Responsive design**
- ✅ **Sin fondo gris oscuro**
- ✅ **Centrado perfecto**
- ✅ **Estados de carga, éxito y error**
- ✅ **TypeScript support**
- ✅ **Material-UI integration**
- ✅ **FontAwesome icons**

## 🔄 Migración desde Componentes Antiguos

Si tienes componentes de login antiguos:

1. **Reemplazar imports**:
   ```tsx
   // Antes
   import Login from './containers/Login';
   
   // Después
   import Login from './components/auth/Login';
   ```

2. **Adaptar props**:
   ```tsx
   // Antes
   <Login />
   
   // Después
   <Login onLogin={handleLogin} title="Mi App" />
   ```

3. **Importar CSS**:
   ```tsx
   import './styles/auth.css';
   ```

## 📄 Licencia

Estos componentes son de uso libre para cualquier proyecto. 