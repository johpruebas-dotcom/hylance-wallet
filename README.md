# 💖 Hylance Wallet (HYW)

Aplicación web de control de ingresos y gastos con diseño de colores pasteles, perfecta para gestionar tus finanzas personales de forma visual e intuitiva.

## ✨ Características principales

### 📊 Dashboard
- **Tarjetas de resumen**: Visualización rápida de ingresos totales, gastos totales y balance general
- **Proyección mensual**: Calcula automáticamente los ingresos y gastos para el mes seleccionado, incluyendo transacciones recurrentes
- **Calendario interactivo**: Visualiza tus transacciones por día y registra nuevas directamente desde el calendario
- **Historial completo**: Lista de todas las transacciones registradas

### 🔄 Transacciones recurrentes
- Soporte para ingresos y gastos que se repiten:
  - **Mensualmente**
  - **Quincenalmente**
- Opción para establecer fecha de finalización de la recurrencia
- Pestaña dedicada exclusivamente para ver y gestionar todas tus transacciones recurrentes
- Resumen de ingresos mensuales, gastos mensuales y disponible neto mensual

### 📝 Registro de transacciones
- Formulario intuitivo para agregar nuevas transacciones
- Registrar desde el calendario: Haz clic en cualquier día y abre un modal pre-cargado con la fecha seleccionada
- Opción para marcar transacciones como recurrentes al momento de registrarlas

### 📱 Responsive Design
- Diseño completamente adaptable para cualquier tamaño de pantalla
- Perfecto para usar desde tu teléfono celular, tablet o computadora

## 🛠️ Tecnologías utilizadas

- **React 19**: Biblioteca de JavaScript para construir interfaces de usuario
- **Vite**: Herramienta de compilación y desarrollo extremadamente rápida
- **Firebase Firestore**: Base de datos en tiempo real gratuita (opcional)
- **LocalStorage**: Almacenamiento local en el navegador (alternativa a Firebase)
- **CSS3**: Estilos con variables para colores personalizables

## 🚀 Primeros pasos

### 1. Clonar o descargar el proyecto
Si tienes el código en tu máquina, continúa. Si no, obtén el código de la fuente donde lo tienes almacenado.

### 2. Instalar dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
npm install
```

### 3. Ejecutar la aplicación en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en:
- **Local**: http://localhost:3000/
- **Red local (para acceder desde celular)**: Verás una dirección similar a `http://192.168.x.x:3000/`

## 📱 Acceder desde tu teléfono celular

Para usar la app desde tu teléfono:

1. Asegúrate de que tu computadora y tu teléfono estén conectados a la misma red Wi-Fi
2. Ejecuta la app con el comando:
   ```bash
   npm run dev -- --host
   ```
3. Ve la dirección que aparece en la consola como "Network", por ejemplo: `http://192.168.101.13:3000/`
4. Abre ese enlace en el navegador de tu teléfono

## 🔧 Configurar Firebase (opcional pero recomendado)

Para guardar tus datos en la nube y acceder a ellos desde cualquier dispositivo:

### 1. Crea un proyecto en Firebase
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en "Add project" y sigue los pasos para crear tu proyecto
3. Cuando el proyecto esté listo, ve a **Project Settings**

### 2. Habilita Firestore Database
1. En el menú izquierdo, selecciona **Firestore Database**
2. Haz clic en "Create Database"
3. Selecciona "Start in test mode" (solo para desarrollo, cambia las reglas después para seguridad)
4. Selecciona tu región y haz clic en "Enable"

### 3. Obtén las credenciales
1. En **Project Settings**, desplázate hasta "Your apps"
2. Haz clic en "Add app" > selecciona "Web"
3. Registra la app (nombre: Hylance Wallet) y haz clic en "Register app"
4. Copia la configuración que se muestra, similar a:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 4. Actualiza las credenciales en el código
Abre el archivo `src/App.jsx` y reemplaza el objeto `firebaseConfig` con tus credenciales.

## 📂 Estructura del proyecto

```
Proyect finanza/
├── v1/                        # Versión original HTML/CSS/JS
├── src/
│   ├── components/
│   │   ├── SummaryCards.jsx  # Tarjetas de resumen principal
│   │   ├── TransactionForm.jsx # Formulario para registrar transacciones
│   │   ├── Calendar.jsx       # Calendario interactivo
│   │   ├── TransactionsList.jsx # Historial de transacciones
│   │   ├── MonthlyProjection.jsx # Proyección mensual
│   │   ├── TransactionModal.jsx # Modal para registrar desde calendario
│   │   └── RecurringTransactions.jsx # Pestaña de transacciones recurrentes
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos globales
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Variables CSS y estilos base
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Personalización de colores

Puedes cambiar los colores de la app editando las variables CSS en `src/index.css`:

```css
:root {
  --primary: #FFB6C1;           /* Rosa pastel principal */
  --primary-dark: #FF91A4;     /* Rosa más oscuro */
  --secondary: #B5EAD7;        /* Verde menta */
  --accent: #FFDAC1;           /* Durazno claro */
  --background: #FFF0F5;       /* Fondo rosado claro */
  --card-bg: #FFFFFF;          /* Fondo de tarjetas */
  --text: #5A5A5A;             /* Texto principal */
  --text-light: #8A8A8A;       /* Texto secundario */
  --income: #98D8AA;           /* Color para ingresos */
  --expense: #FFB3B3;          /* Color para gastos */
  --balance: #C9B1FF;          /* Color para balance */
}
```

## 📖 Guía de uso rápida

1. **Dashboard**: Ve tu resumen general, proyección mensual y registra transacciones desde el calendario
2. **Recurrentes**: Gestiona todos tus ingresos y gastos que se repiten automáticamente
3. **Registrar**: Agrega una transacción nueva desde el formulario completo

Para agregar una transacción recurrente:
1. Haz clic en cualquier día del calendario
2. Llena la descripción y monto
3. Selecciona la frecuencia (Mensual/Quincenal)
4. Asegúrate de que la opción "Repetir automáticamente" esté marcada
5. Opcionalmente, establece una fecha de finalización
6. ¡Guarda!

## 📦 Compilar para producción

Para generar una versión optimizada para publicar:

```bash
npm run build
```

Esto creará una carpeta `dist/` con los archivos listos para ser alojados en cualquier servicio de hosting web.

## 🎯 Próximas mejoras (ideas)

- [ ] Autenticación de usuarios para acceder desde cualquier dispositivo
- [ ] Categorías para ingresos y gastos
- [ ] Gráficos y estadísticas visuales
- [ ] Exportar datos a Excel/CSV
- [ ] Notificaciones para gastos próximos

## 📝 Notas importantes

- **Sin Firebase**: La app funciona perfectamente usando `localStorage`, pero los datos se guardan solo en el navegador que usaste.
- **Con Firebase**: Tus datos se guardan en la nube y puedes acceder desde cualquier dispositivo.
- **Responsividad**: La app está diseñada para verse genial en teléfonos, tablets y computadoras.

¡Espero que disfrutes usando Hylance Wallet! 💖
