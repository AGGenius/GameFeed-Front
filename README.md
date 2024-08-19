# Proyecto final: Web de social para compartir información sobre videojuegos - FRONT.

El objetivo ha sido crear una web en la que los usuarios puedan crear entradas con sus videojuegos favoritos, y añadir entradas respecto a los mismos, que pueden ser valoradas por el resto de usuarios, así como los propios juegos. 

## Índice

  - [Funcionamiento](#funcionamiento)
  - [Creación de contenido y registro](#creación_de_contenido_y_registro)
  - [Edición de contenido](#edición_de_contenido)
  - [Valoración de contenido](#valoración_de_contenido)
  - [Base de Datos](#base_de_datos)
  - [Back](#back)
  - [Mejoras](#mejoras)

## Funcionamiento

Cualquiera que acceda a la web puede ver los juegos y sus entradas, pero no pueden interactuar con ello sin estar registrados. Se limita a su vez el poder crear juegos o entradas.
Los usuarios registrados podrán crear entradas de juegos, siempre que el titulo no exista previamente, así como cualquier tipo de entrada en los mismos. Podrán también interactuar con los botones de "Like" para valorar los contenidos que les gusten.
El registro está abierto a cualquiera que acceda a la web, pero por control no se podrá iniciar sesión hasta que un administrador apruebe la cuenta. A su vez los post de juegos, por su importancia, deben ser aprobados por un administrador o moderador.
Existe el rol de moderador, que podrá editar los juegos y sus entradas para llevar un correcto control del contenido en la web.
El rol de administrador puede editar también los usuarios, para concederles acceso o modificar cualquier dato que sea necesario.

- Los juegos constan de titulo, genero principal, desarrollador, y fecha de salida original.
- Las entradas de los juegos incluyen campos para el tipo (opinión, critica, spoiler, etc...), contenido (únicamente texto), y la fecha de creación que se asigna en el momento de crear la entrada. Una entrada categorizada como spoiler no será visible hasta que el usuario coloque el cursor sobre el campo de texto. A su vez se mostrará el Nick del usuario que ha creado la entrada.
- Los usuarios cuentan con el email, nombre, Nick, contraseña y tipo. El email y contraseña son las claves para iniciar sesión, y el tipo solo puede ser modificado por el administrador de la web, ya que por defecto es "user" para todos, con el nivel normal de acceso.

## Creación de contenido y registro

- Al crear un juego se deberán introducir los campos de titulo, género, desarrollador y la fecha de salida. 
- Para crear una entrada en un juego se deberá acceder desde el propio juego, y se deberán introducir los campos de tipo y el contenido en texto del mismo. 
- En el registro se debe introducir el email, contraseña, repetición de la contraseña, nombre, y el Nick.

- Todos los campos serán validados antes de poder enviar la información al back end, respondiendo al usuario en el propio formulario con los campos que no cumplan las condiciones. Para los juegos y entradas se usa react-hook-form para detectar campos vacios a falta de implementar una mayor validación. En el registro se usan validadores personalizados que responden según las condiciones del propio campo.

## Edición de contenido

- El administrador podrá manipular los campos según sea conveniente para los juegos, posts y usuarios, para ello además de los campos ya mencionados, tienen acceso al campo de estado del contenido, para habilitarlo o deshabilitarlo. El moderador podrá realizar estos mismos cambios salvo lo que respecta a usuarios.

- Para acceder a estas funciones cuentan con un modo propio independiente a cada tipo de usuario, donde pueden acceder a los formularios de edición correspondientes. También pueden acceder directamente al contenido con botones que se generan únicamente para este tipo de usuarios, dando acceso directo al juego, post o usuario requerido.

## Valoración de contenido

- Tanto los juegos como las entradas podrán ser valoradas al clicar el botón de "Like" que corresponde a cada entrada. Este botón mostrará la cantidad sin indicar a que usuario corresponde. Los likes se podrán quitar volviendo a clicar en el mismo botón.

## Base de Datos

- Todos los datos se almacenan en una base de datos relacional usando PostgreSQL que se encuentra activa en un servidor externo.

## Back

- Todas las peticiones se manejan con solicitudes del front end al back end, que actuara de forma correspondiente a las necesidades de la petición, accediendo este a la base de datos si es el caso.

## Mejoras

Mi intención es seguir mejorando esta web para añadir más funcionalidades:
- Control responsive de la web.(Completado el 14/08/2024)
- Icono para poder ver la contraseña introducida por el usuario en el campo asignado.(Completado el 16/08/2024)
- Ver los post y juegos a los que el usuario da Like en su perfil.
- Modificar los datos del usuario por parte del propio usuario en su perfil (Nombre, Nick, Contraseña, Email) así como desactivar temporalmente la cuenta o borrarla.
- Asignar varios géneros a un juego.
- Asignar plataformas a un juego.
- Imágenes para el perfil de los usuarios.
- Rendimiento.
- Refactorización de código.
- Unificación de validadores.

Y mucho más.
