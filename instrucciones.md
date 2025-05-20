## API blog

## Recupera todos los autores

Method: GET
Url : /api/autores
Headers: XXX
Body: XXX

Response: Un array con todos los autores

## Recupera un autor a partir de su ID

METHOD: GET
Url: /api/autores/<AUTORID>
Headers: XXX
Body: XXX

Response: Un objeto con el autor pedido
Error Response: status404 + mensaje

## Crear un nuevo autor

METHOD: POST
Url: /api/autores
Headers: XXX
Body: nombre, email, imagen

Response: El objeto creado con los datos del nuevo autor

## Actualizacion completa de un autor

METHOD: PUT
Url: /api/autores/<AUTORID>
Header: XXX
Body:nombre,email,imagen

Response: Un objeto con los datos del autor actualizados

### Borrado de un autor

METHOD: DELETE
Url: /api/autores<AUTORID>
Headers: XXX
Body: XXX

Response: Un array con los autores actualizados

### Recuperar todos los autores con sus posts

Method: GET
Url: /api/autores/posts
Headers: XXX
Body: XXX

Response: 
Json
[
    { "id":1 , "nombre": "juan", "posts":[{ "nombre":  , "descripcion": }]},
    { "id":2 , "nombre": "pedro", "posts":[{ "nombre":  , "descripcion": }]},


]


