# Automatización Instagram → FCPyS · IR

Objetivo: que el único paso manual sea publicar en Instagram. El flujo toma los últimos 10 posts, descarta fotos comunes y convierte flyers en fichas clickeables.

## Escenario recomendado en Make

1. **Instagram for Business — Watch Media**
   - Cuenta: FCPyS UNCuyo.
   - Disparo: nueva publicación.
   - Al iniciar el escenario por primera vez, consultar también los últimos 10 medios.

2. **Instagram for Business — Get Media / Carousel Children**
   - Obtener `id`, `caption`, `media_type`, `media_url`, `thumbnail_url`, `permalink`, `timestamp`.
   - Si es `CAROUSEL_ALBUM`, obtener todas las placas.
   - La primera placa se usa como miniatura.

3. **Clasificador visual con IA**
   - Enviar caption + todas las imágenes al modelo con el prompt de `automation/make-classifier-prompt.txt`.
   - La respuesta debe ser JSON estricto.

4. **Filtro Make**
   - Continuar sólo cuando `is_flyer = true`.
   - Si `is_flyer = false`, no crear ficha.

5. **Normalizar registro**
   - `id` = instagram_id
   - `kind` = `flyer`
   - `title` = title
   - `date` = date
   - `time` = time
   - `place` = place
   - `image` = primera placa/thumbnail
   - `instagram_url` = permalink
   - `map_url` = vacío por ahora
   - `source` = `instagram`
   - `confidence` = confidence
   - `notes` = notes

6. **Mantener máximo 10 publicaciones originales**
   - El universo a analizar son los 10 medios más recientes de Instagram.
   - `data/posts.json` contiene solamente los flyers detectados dentro de esos 10.
   - Si entre los últimos 10 hay 6 fotos y 4 flyers, el clon muestra 4 tarjetas.

7. **GitHub — actualizar `data/posts.json`**
   - Reemplazar el archivo completo con el array normalizado de flyers.
   - Cada cambio dispara el despliegue de GitHub Pages.

## Regla importante

No usar OCR aislado como clasificador. La IA debe mirar visualmente cada placa y el caption. OCR puede perder jerarquía, interpretar mal fondos fotográficos o confundir una cobertura con un flyer.

## Resultado esperado

Instagram → últimos 10 posts → análisis visual → fotos descartadas → flyers extraídos → `posts.json` → FCPyS · IR actualizado.
