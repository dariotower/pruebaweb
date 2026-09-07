# FCPyS · IR — MVP

Primer prototipo del feed clickeable para FCPyS Maps.

## Qué hace esta etapa

- Lee como máximo los últimos 10 registros de `data/posts.json`.
- Oculta publicaciones clasificadas como `photo`.
- Muestra únicamente publicaciones `flyer` que tengan al menos un dato útil de actividad.
- Abre una ficha clickeable con título, fecha, hora, lugar y botón `Cómo llegar`.
- Si todavía no hay imagen real, genera una portada visual de respaldo.

## Estructura esperada por publicación

```json
{
  "id": "instagram-media-id",
  "kind": "flyer",
  "title": "Nombre de la actividad",
  "date": "2026-09-10",
  "time": "15 h",
  "place": "Aula 20 · BACT",
  "image": "https://...",
  "instagram_url": "https://instagram.com/p/...",
  "map_url": "/map/aula-20-bact"
}
```

## Próxima etapa: Instagram real

El frontend ya está preparado. La automatización deberá:

1. Obtener los últimos 10 contenidos de `@fcpysuncuyo`.
2. Descargar o guardar una copia de la imagen/primera placa del carrusel.
3. Analizar visualmente la pieza.
4. Si es una fotografía sin información gráfica de actividad: `kind = photo`.
5. Si es flyer: `kind = flyer` y extraer `title`, `date`, `time`, `place`.
6. Escribir los 10 resultados en `data/posts.json`.

La clasificación visual debe hacerse antes de publicar los datos para evitar que el navegador tenga que usar IA.

## Publicación

El workflow `.github/workflows/pages.yml` deja preparado el proyecto para GitHub Pages. Si Pages todavía no está activado en el repositorio, seleccionar `GitHub Actions` como fuente desde Settings → Pages.
