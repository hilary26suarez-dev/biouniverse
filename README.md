# BioUniverse — Plataforma de Divulgación Científica
**Creadora:** Hilary Suárez

## Estructura del proyecto
```
biouniverse/
├── index.html       → Estructura completa de la plataforma
├── styles.css       → Todos los estilos y diseño visual
├── app.js           → Toda la lógica interactiva
└── netlify.toml     → Configuración de despliegue
```

## Cómo subir a Netlify (5 minutos)

### Opción 1 — Arrastrar y soltar (más fácil)
1. Ir a https://netlify.com → Login → "Add new site"
2. Elegir "Deploy manually"
3. Arrastrar la carpeta `biouniverse/` completa
4. ¡Listo! El sitio queda en una URL tipo `random-name.netlify.app`
5. En Site settings → Domain management → podés cambiar el nombre

### Opción 2 — Conectar con GitHub (recomendado para mantenimiento)
1. Subir la carpeta a un repositorio GitHub
2. En Netlify: "Add new site" → "Import from Git"
3. Seleccionar el repo
4. Build command: (vacío)
5. Publish directory: `/` (raíz)
6. Deploy!

### Dominio personalizado
- Comprar en: namecheap.com (~$12/año para `.com`)
- Configurar DNS en Netlify Settings → Domain management → Add custom domain

## Cambiar la contraseña de curadora
En `app.js`, línea que dice:
```js
const ADMIN_PASS = 'biotech2025';
```
Cambiar `'biotech2025'` por la contraseña que quieras.

## Para la Fase 2 (base de datos real con Supabase)
Cuando quieras que los artículos se guarden en la nube:
1. Crear cuenta gratuita en https://supabase.com
2. Crear tabla `posts` con campos: id, title, tag, level, content, author, date, published
3. Crear tabla `submissions` con campos: id, name, title, tag, content, status, date
4. Reemplazar las funciones `loadPosts()`/`savePosts()` en app.js con llamadas a la API de Supabase

## Tecnologías usadas
- HTML5 / CSS3 / JavaScript puro (vanilla)
- Fuentes: Google Fonts (Fraunces + Plus Jakarta Sans)
- Animaciones: CSS + Canvas API
- Almacenamiento: localStorage (temporal hasta Fase 2)
- Despliegue: Netlify (CDN global, HTTPS automático, gratis)

## Secciones de la plataforma
1. **Mode Gate** — Selector inicial Explorador / Científico
2. **Hero** — Animación de partículas con contadores animados
3. **¿Qué es?** — Definición + niveles de conocimiento (1/2/3)
4. **Arcoíris** — 7 colores interactivos con panel de información
5. **Simulación** — 3 escenarios de toma de decisiones científica
6. **Conexión humana** — Sección de impacto emocional
7. **¿Por qué estudiarla?** — 4 razones con modo dual
8. **Hitos históricos** — Timeline animado
9. **Blog** — Con panel de curadora y sistema de envíos
10. **Base científica** — Referencias y papers
11. **Contribuir** — Formulario de envío de artículos
12. **Footer** — Con crédito a Hilary Suárez

---
*"La ciencia es para todos… solo hay que saber cómo explicarla."*
*— Hilary Suárez*
