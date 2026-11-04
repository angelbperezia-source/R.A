<?php
require 'seguridad.php';
exigir_login();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_respuesta(405, ['error'=>'Método no permitido']);
}
exigir_csrf();
require 'conexion.php';
[$nombre, $precio, $stock] = datos_producto();
$stmt = $conexion->prepare(
    'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)'
);
$stmt->bind_param('sii', $nombre, $precio, $stock);
$stmt->execute();
json_respuesta(201, ['ok'=>true]);