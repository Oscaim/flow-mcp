# Guía de Flow y voces — revisión del 7 de noviembre de 2026

Las opciones, precios y modelos pueden cambiar por país, plan e interfaz. Verifica el precio en Flow antes de generar. Este documento reúne funciones investigadas; no significa que todas estén automatizadas por este MCP.

## Proyecto y creación

Abre un proyecto con `flow_open_project`, comprueba `flow_status` y usa `flow_inspect` para observar los controles visibles. El compositor permite imágenes, vídeos, proporciones, modelo y número de resultados. Para vídeo, elige fotogramas o ingredientes según el objetivo; consulta la interfaz para resoluciones y duraciones reales. Imágenes o vídeos generados por herramientas pueden consumir créditos.

Fuentes: https://support.google.com/flow/answer/16353334 y https://support.google.com/flow/answer/16352836

## Personajes y continuidad

`flow_character` ejecuta el flujo completo: crea un retrato con Nano Banana Pro, usa ese mismo retrato como referencia para generar una imagen coincidente de cuerpo entero y guarda ambas imágenes en Portrait y Body. También guarda la personalidad y asigna una voz. Si se omite `body_image`, el cuerpo se genera automáticamente; si el usuario proporciona una imagen de cuerpo, se usa esa. Para mantener la continuidad, usa las mismas referencias y evita instrucciones que contradigan la apariencia.

Si no se indica una voz, el MCP infiere una voz base a partir del género y los rasgos descritos, genera una muestra breve y solicita una voz personalizada con instrucciones de idioma, entrega y pronunciación del nombre. Las voces personalizadas son experimentales en Flow. Si la vista previa o el guardado fallan, inspecciona el personaje parcial antes de volver a intentar para evitar duplicados. La muestra solo es una previsualización, no diálogo para futuros vídeos.

## Voz: muestra y estilo

- `voice`: nombre de la voz base disponible en Flow.
- `voice_sample`: diálogo corto que se utiliza para generar una muestra audible; máximo 120 caracteres en la interfaz observada. No es automáticamente el diálogo de todos los vídeos. Elige una línea representativa en el idioma y registro deseados.
- `voice_performance`: describe las cualidades estables que quieres probar, por ejemplo: «Español peruano, voz tranquila y cercana, ritmo pausado, dicción clara y humor seco; evita la actuación exagerada». Cambiar esto puede crear una voz personalizada separada.
- `voice_custom_name`: nombre distintivo para la nueva voz cuando se usa `voice_performance`. El MCP exige también una voz base y un diálogo de muestra; esta restricción es una decisión preventiva para el flujo experimental, no una condición universal de Google.
- Compara varias bases con la misma muestra. Escucha las previsualizaciones antes de elegir. Prueba pronunciación, ritmo y tono; indica la emoción puntual de una escena en el prompt de esa escena.
- Flow requiere referencias de voz en vídeos que utilicen Ingredients. Para otras modalidades puede rechazarlas. En la interfaz usa la voz como ingrediente o `@Voice` según corresponda.

Google describe selección de voz base, nombre, estilo, vista previa y guardado en https://support.google.com/flow/answer/16353334. La creación de voces personalizadas desde el panel de personaje puede presentar diferencias de interfaz. En una prueba de esta instalación, Flow devolvió «Preview generation failed»; usuarios también han comunicado demoras y errores: https://www.reddit.com/r/GoogleFlow/comments/1w8va0f/is_anyone_else_not_able_to_set_customize/ . Es evidencia anecdótica, no una garantía de comportamiento.

## Voces predefinidas: referencia inicial

Google documenta estas 30 voces de Gemini TTS; Flow puede mostrar un subconjunto o descripciones distintas. Las sugerencias son puntos de partida creativos, no garantías de acento o calidad. Escúchalas en tu idioma. Fuente: https://ai.google.dev/gemini-api/docs/speech-generation

| Voz | Descripción orientativa | Uso que vale la pena probar |
| --- | --- | --- |
| Zephyr | Brillante | Presentación enérgica |
| Puck | Animada | Personaje optimista |
| Charon | Informativa | Narración explicativa |
| Kore | Firme | Liderazgo |
| Fenrir | Excitable | Aventuras dinámicas |
| Leda | Juvenil | Personaje joven |
| Orus | Firme | Autoridad serena |
| Aoede | Desenvuelta | Conversación ligera |
| Callirrhoe | Relajada | Personaje natural |
| Autonoe | Brillante | Presentación optimista |
| Enceladus | Con aire | Misterio íntimo |
| Iapetus | Clara | Explicaciones |
| Umbriel | Relajada | Conversación tranquila |
| Algieba | Suave | Detective calmado |
| Despina | Suave | Narración cercana |
| Erinome | Clara | Presentación informativa |
| Algenib | Áspera | Personaje curtido |
| Rasalgethi | Informativa | Documental |
| Laomedeia | Animada | Contenido entusiasta |
| Achernar | Suave | Personaje delicado |
| Alnilam | Firme | Detective decidido |
| Schedar | Equilibrada | Narración estable |
| Gacrux | Madura | Personaje experimentado |
| Pulcherrima | Directa | Presentación segura |
| Achird | Amistosa | Conversación cálida |
| Zubenelgenubi | Informal | Personaje casual |
| Vindemiatrix | Amable | Relato íntimo |
| Sadachbia | Vivaz | Personaje expresivo |
| Sadaltager | Conocedora | Explicación experta |
| Sulafat | Cálida | Narración acogedora |

## Agent, escenas y herramientas

Agent sirve para planear, generar, editar y organizar contenido; sus consultas pueden tener cuota y la generación puede gastar créditos. Las escenas combinan clips. Tools permite explorar plantillas y crear miniaplicaciones con lenguaje natural; el uso y la creación dependen del plan y del país. El MCP cubre una parte de estos flujos, no la totalidad.

Fuentes: https://support.google.com/flow/answer/17093911 y https://support.google.com/flow/answer/17104535

## Qué hay y qué falta en el MCP

`flow_generate`, `flow_agent_images`, `flow_continue`, `flow_edit`, `flow_assets`, `flow_download`, `flow_character`, `flow_characters`, `flow_character_edit`, `flow_voices`, `flow_narrate`, `flow_assemble`, `flow_transcribe` y `flow_captions` cubren generación y herramientas locales. `flow_voices` muestra voces de Gemini TTS y del sistema; no garantiza el catálogo completo de Flow. No hay cobertura completa verificada para proyectos, colecciones, editor de escenas, Tools, administración de voces existentes o todas las opciones del Agent. La creación de avatar necesita un dispositivo móvil: https://support.google.com/flow/answer/17102997 .
