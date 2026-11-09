# Auditoría parcial de Flow — 7 de noviembre de 2026

## Alcance y evidencia

Inspección en Brave mediante integración de navegador, cuenta PLUS. Proyecto de auditoría vacío. No se ejecutaron generaciones ni se gastaron créditos. Esta revisión no demuestra que todas las opciones sean automatizables.

Código base: 84b548f (23 de octubre de 2026). Antes de esta revisión package.json declaraba 0.1.0 y el servidor anunciaba 0.2.0. Ahora ambos declaran 0.2.1. Cambios locales, no publicados ni activados en los procesos que ya estaban abiertos.

## Matriz de cobertura

| Área | Observado en interfaz | Cobertura MCP / pendiente |
| --- | --- | --- |
| Imágenes | Nano Banana Pro, 2 Lite, 2.1; cinco proporciones; 1–4 resultados | flow_generate y flow_agent_images existentes. Sin nueva prueba de generación |
| Video | Omni 1.2 Flash, Omni 1.1 Flash, Veo 3.1 Lite/Fast/Quality | Nombre de modelo libre ya permite solicitar 1.2. Precio y ejecución de 1.2 pendientes |
| Retirada de modelos | 1.1 Flash, Veo Fast/Quality indican Leaving Dec 5 | Catálogo estático marcado como histórico; no asumir disponibilidad futura |
| Parámetros video | Frames/Ingredients, 16:9/9:16, 360p/720p, 4/6/8/10s, x1–x4 | La API existente cubre estos parámetros; no se verificaron todas las combinaciones |
| Retrato | Portrait separado de Create body | Guía corregida: retrato de rostro/hombros para humanos |
| Cuerpo | Create body abre Describe body and outfit…, Upload y Add from project | Nuevo body_image para carga local. Controles observados; carga completa aún no probada. Generación de cuerpo pendiente |
| Voz | Select a voice, búsqueda, preview, Sample dialogue, Customize performance, Add to character | Selección básica existente. Edición de voz posterior, preview y performance faltan |
| Personaje existente | Nombre, personalidad, favorito, papelera, historial, edición | MCP edita retrato; resto necesita herramientas y pruebas específicas |
| Herramientas personalizadas | My Tools/Community/Templates; constructor por descripción; Voice over/Style morph/Time stretcher; mensaje de creación gratis | Sin herramientas MCP. Crear y ejecutar herramientas no probado |
| Biblioteca | Upload, New collection, Create character, New scene | Personajes y carga de referencias cubiertos parcialmente; colecciones/escenas sin gestión dedicada |
| Búsqueda/filtros | Tipo, proporción, generado/subido/favoritos, duración, resolución, Newest/Oldest | MCP lista medios con filtros limitados; faltan búsqueda y filtros completos |
| Papelera | Enlace visible | flow_trash existente; restauración y vaciado no revisados |
| Edición de medios | Proyecto de auditoría vacío | Editar video, continuar, descargar existen en código; faltan pruebas actuales y revisión del editor con medios |
| Proyectos | Lista, nuevo, nombre, borrar | Sin herramientas dedicadas de gestión de proyectos |
| Montaje/narración/subtítulos | Funciones locales del MCP | No equivalen al editor de escenas de Flow. No probadas en esta auditoría |

## Cambios implementados

- flow_inspect devuelve URL, fecha de observación y controles visibles. No abre menús ni ejecuta controles. Utiliza el Chrome dedicado del MCP, no la pestaña Brave de inspección.
- body_image incorpora una imagen local al campo Body; valida ruta absoluta y archivo antes de generar el retrato. Implementación preliminar: requiere prueba de carga/guardado real.
- Resultado de personaje incluye configuration.body y configuration.voice. `requested:` indica solicitud de voz, no verificación independiente después de guardar.
- Playbook aclara límites del catálogo estático y separación entre retrato/cuerpo/voz.
- Versiones unificadas en 0.2.1.

## Verificación ejecutada

- npm run build: correcto.
- Validación del esquema de body_image, rechazo de ruta relativa antes de abrir navegador y coincidencia de versiones: correctos.
- git diff --check: correcto; avisos normales de conversión CRLF/LF.
- No se probó el nuevo inspector por MCP ni la carga corporal de extremo a extremo. No afirmar soporte completo.

## Continuación necesaria

Reiniciar los procesos de Flow MCP/Studio para cargar dist actualizado y reconectar el cliente para descubrir flow_inspect. Probar personaje desechable con retrato, body_image y voz; verificar persistencia al reabrir. Después implementar y probar por separado proyectos, colecciones, escenas, herramientas, edición de voz y restauración. Las pruebas de video necesitan presupuesto de créditos explícito. No publicar, borrar permanentemente ni alterar personajes existentes como parte de pruebas implícitas.
