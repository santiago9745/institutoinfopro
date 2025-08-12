<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bienvenido</title>
</head>
<body>
    <h2>Hola {{ $usuario->name }},</h2>
    <p>Te damos la bienvenida a nuestra plataforma.</p>
    <p>Estos son tus datos de acceso:</p>
    <ul>
        <li><strong>Email:</strong> {{ $usuario->email }}</li>
        <li><strong>Contraseña:</strong> {{ $passwordPlano }}</li>
    </ul>
    <p>Te recomendamos cambiar la contraseña una vez que inicies sesión.</p>
</body>
</html>
