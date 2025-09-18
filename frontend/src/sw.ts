const CACHE = 'microcreditos-cache-v1'
const ASSETS = [
	'/',
	'/app/home',
	'/manifest.webmanifest',
]

self.addEventListener('install', (event: any) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)))
})

self.addEventListener('activate', (event: any) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
	)
})

self.addEventListener('fetch', (event: any) => {
	const req = event.request
	event.respondWith(
		caches.match(req).then((cached) => cached || fetch(req))
	)
}) 