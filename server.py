#!/usr/bin/env python3
"""
Servidor de la app de ruso. No necesita instalar NADA: solo Python 3.

Hace dos cosas:
  1. Sirve la aplicación (los archivos de esta carpeta).
  2. Actúa de puente hacia tu modelo de IA local, para que el navegador
     no se queje de CORS. La app lo usa en la URL /api/ia/v1

Uso:
    python3 server.py                       # http://localhost:8000
    python3 server.py --puerto 8080
    python3 server.py --ia http://localhost:1234/v1     # LM Studio
    python3 server.py --ia http://192.168.1.50:11434/v1 # Ollama de otro equipo

Para estudiar desde el iPhone: abre en el móvil la dirección de red que
te muestra el programa al arrancar (los dos aparatos en la misma wifi).
"""

import argparse
import json
import os
import socket
import sys
import urllib.error
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RAIZ = os.path.dirname(os.path.abspath(__file__))
DESTINO_IA = 'http://localhost:11434/v1'
PREFIJO = '/api/ia/'


class Manejador(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=RAIZ, **kwargs)

    # --- utilidades -------------------------------------------------------
    def log_message(self, formato, *args):
        if '/api/ia/' in (self.path or ''):
            sys.stderr.write('  → IA: %s %s\n' % (self.command, self.path))

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def _error(self, codigo, mensaje):
        cuerpo = json.dumps({'error': {'message': mensaje}}).encode()
        self.send_response(codigo)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)

    # --- proxy hacia el modelo -------------------------------------------
    def _proxy(self, metodo):
        ruta = self.path[len(PREFIJO):]           # p.ej. "v1/chat/completions"
        if ruta.startswith('v1/'):
            ruta = ruta[3:]                        # el destino ya incluye /v1
        destino = DESTINO_IA.rstrip('/') + '/' + ruta.lstrip('/')

        longitud = int(self.headers.get('Content-Length') or 0)
        cuerpo = self.rfile.read(longitud) if longitud else None

        cabeceras = {'Content-Type': self.headers.get('Content-Type', 'application/json')}
        if self.headers.get('Authorization'):
            cabeceras['Authorization'] = self.headers['Authorization']

        peticion = urllib.request.Request(destino, data=cuerpo, headers=cabeceras, method=metodo)
        try:
            with urllib.request.urlopen(peticion, timeout=600) as respuesta:
                self.send_response(respuesta.status)
                tipo = respuesta.headers.get('Content-Type', 'application/json')
                self.send_header('Content-Type', tipo)
                self.end_headers()
                # Reenvía en trozos para que el streaming llegue palabra a palabra.
                while True:
                    trozo = respuesta.read(1024)
                    if not trozo:
                        break
                    self.wfile.write(trozo)
                    self.wfile.flush()
        except urllib.error.HTTPError as e:
            detalle = e.read().decode('utf-8', 'replace')[:500]
            self._error(e.code, f'El servidor de IA devolvió {e.code}: {detalle}')
        except urllib.error.URLError as e:
            self._error(502, f'No pude conectar con {destino} ({e.reason}). '
                             '¿Está arrancado Ollama / tu servidor de modelos?')
        except BrokenPipeError:
            pass  # el navegador cerró la pestaña a mitad de respuesta

    def do_GET(self):
        if self.path.startswith(PREFIJO):
            return self._proxy('GET')
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith(PREFIJO):
            return self._proxy('POST')
        return self._error(405, 'Método no permitido')

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()


def ip_local():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))          # no envía nada, solo elige la interfaz
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'


def main():
    global DESTINO_IA
    p = argparse.ArgumentParser(description='Servidor de la app para aprender ruso')
    p.add_argument('--puerto', type=int, default=8000)
    p.add_argument('--ia', default=os.environ.get('IA_URL', DESTINO_IA),
                   help='URL del servidor de modelos (por defecto Ollama en este equipo)')
    args = p.parse_args()
    DESTINO_IA = args.ia

    servidor = ThreadingHTTPServer(('0.0.0.0', args.puerto), Manejador)
    ip = ip_local()
    print('\n  Русский — app para aprender ruso')
    print('  ' + '─' * 44)
    print(f'  En este equipo:   http://localhost:{args.puerto}')
    print(f'  Desde el móvil:   http://{ip}:{args.puerto}')
    print(f'  Puente hacia IA:  {DESTINO_IA}  (preset «Proxy de esta app»)')
    print('  ' + '─' * 44)
    print('  Ctrl+C para parar.\n')
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print('\n  Пока! 👋\n')


if __name__ == '__main__':
    main()
