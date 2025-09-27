# Mini Pokédex - Proyecto de Programación Web

**Universidad:** Universidad Da Vinci de Guatemala
**Curso:** Programación Web
**Catedrático:** Ing. Brandon Antony Chitay Coutiño
**Estudiante:** José Manuel Jolón Perez.

---

## 🎯 Objetivo del Proyecto

Desarrollar una aplicación web funcional que consume la PokéAPI para mostrar información detallada de Pokémon. El proyecto está construido desde cero usando exclusivamente HTML, CSS (con metodología BEM) y JavaScript puro, cumpliendo con todos los requisitos de la asignación.

---

## ✨ Características Implementadas

La aplicación cumple con todos los requisitos funcionales solicitados:

* **Búsqueda Dinámica:** Un formulario permite al usuario buscar un Pokémon específico por su **nombre** o **ID**.
* **Carga Inicial:** Un botón carga una lista de los primeros 20 Pokémon de la Pokédex.
* **Tarjeta de Pokémon:** Al buscar o cargar, cada Pokémon se muestra en una tarjeta con:
    * Nombre, ID e Imagen (sprite oficial).
    * Tipos (con colores temáticos para cada tipo).
    * Altura y Peso.
    * Estadísticas Base (HP, Ataque, Defensa, Velocidad, etc.).
* **Sistema de Favoritos:**
    * Permite marcar y desmarcar Pokémon como favoritos usando un botón (estrella) en cada tarjeta.
    * Los favoritos se guardan en el `localStorage` del navegador para que la selección persista entre sesiones.
    * Una sección dedicada de "Mis Favoritos" muestra todos los Pokémon que han sido guardados.

---

## 💻 Diseño y Tecnología

* **Diseño Temático:** La interfaz ha sido estilizada para crear una experiencia inmersiva, utilizando la paleta de colores oficial de Pokémon (azul, amarillo y rojo), el logo internacional, iconos temáticos y un fondo de pantalla.
* **HTML5:** Se utilizó para la estructura semántica de la aplicación.
* **CSS3 (Metodología BEM):** Todos los estilos siguen la metodología BEM (Block, Element, Modifier) para un código CSS limpio y escalable.
* **Diseño Responsivo:** La aplicación se adapta fluidamente a pantallas de escritorio y dispositivos móviles.
* **JavaScript (Puro / Vanilla JS):**
    * **Fetch API:** Se usa para todas las llamadas asíncronas y el consumo de datos desde la `pokeapi.co`.
    * **Manipulación del DOM:** Todo el contenido de Pokémon se renderiza dinámicamente.
    * **localStorage API:** Se utiliza para implementar la persistencia de los favoritos.