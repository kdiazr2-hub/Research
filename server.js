#!/usr/bin/env node
/**
 * Lo mismo que server.py, pero con Node.js (por si no tienes Python a mano).
 *
 *   node server.js
 *   node server.js --puerto 8080
 *   node server.js --ia http://localhost:1234/v1
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { URL } = require('url');

const RAIZ = __dirname;
const PREFIJO = '/api/ia/';

const argumentos = process.argv.slice(2);
function opcion(nombre, porDefecto) {
  const i = argumentos.indexOf(`--${nombre}`);
  return i >= 0 && argumentos[i + 1] ? argumentos[i + 1] : porDefecto;
}
const PUERTO = Number(opcion('puerto', process.env.PUERTO || 8000));
const DESTINO_IA = opcion('ia', process.env.IA_URL || 'http://localhost:11434/v1');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function error(res, codigo, mensaje) {
  const cuerpo = JSON.stringify({ error: { message: mensaje } });
  res.writeHead(codigo, { 'Content-Type': 'application/json' });
  res.end(cuerpo);
}

function proxy(req, res) {
  let ruta = req.url.slice(PREFIJO.length);
  if (ruta.startsWith('v1/')) ruta = ruta.slice(3);
  const destino = new URL(DESTINO_IA.replace(/\/+$/, '') + '/' + ruta.replace(/^\/+/, ''));
  const cliente = destino.protocol === 'https:' ? https : http;

  const cabeceras = { 'Content-Type': req.headers['content-type'] || 'application/json' };
  if (req.headers.authorization) cabeceras.Authorization = req.headers.authorization;

  const peticion = cliente.request(
    { hostname: destino.hostname, port: destino.port, path: destino.pathname + destino.search, method: req.method, headers: cabeceras },
    (respuesta) => {
      res.writeHead(respuesta.statusCode, { 'Content-Type': respuesta.headers['content-type'] || 'application/json' });
      respuesta.pipe(res);   // streaming: llega token a token
    }
  );
  peticion.on('error', (e) => {
    error(res, 502, `No pude conectar con ${destino.href} (${e.message}). ¿Está arrancado tu servidor de modelos?`);
  });
  req.pipe(peticion);
}

function servirArchivo(req, res) {
  let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (ruta === '/') ruta = '/index.html';
  const destino = path.join(RAIZ, path.normalize(ruta).replace(/^(\.\.[/\\])+/, ''));
  if (!destino.startsWith(RAIZ)) return error(res, 403, 'Ruta no permitida');

  fs.stat(destino, (err, datos) => {
    if (err || !datos.isFile()) return error(res, 404, 'No encontrado');
    res.writeHead(200, {
      'Content-Type': TIPOS[path.extname(destino).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(destino).pipe(res);
  });
}

const servidor = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }
  if (req.url.startsWith(PREFIJO)) return proxy(req, res);
  if (req.method !== 'GET') return error(res, 405, 'Método no permitido');
  return servirArchivo(req, res);
});

function ipLocal() {
  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const i of interfaces || []) {
      if (i.family === 'IPv4' && !i.internal) return i.address;
    }
  }
  return '127.0.0.1';
}

servidor.listen(PUERTO, '0.0.0.0', () => {
  console.log('\n  Русский — app para aprender ruso');
  console.log('  ' + '─'.repeat(44));
  console.log(`  En este equipo:   http://localhost:${PUERTO}`);
  console.log(`  Desde el móvil:   http://${ipLocal()}:${PUERTO}`);
  console.log(`  Puente hacia IA:  ${DESTINO_IA}  (preset «Proxy de esta app»)`);
  console.log('  ' + '─'.repeat(44));
  console.log('  Ctrl+C para parar.\n');
});
