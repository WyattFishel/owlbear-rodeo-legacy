# Deployment Settings
### Preface
These are the deployment settings for running this on a sub-path on a Linux cloud vm. I'm using Linode/debian, but it shouldn't matter. This guide assumes you've already installed nginx, you're running the owlbear backend on Docker or PM2 (I'm using PM2), and that you have a domain name configured for it.
**NOTE:** My motivation for deploying it on a subpath is because I'm incorporating it into another site. If you just want to deploy it to a base site, then you can remove a good amount of this config.
**PS:** The readme still applies here, but I removed yarn. Build both the backend and frontend with `npm run build`.
**PPS:** This runs on Node 18, not Node LTS! The frontend will work on Node LTS, but not the backend (at the moment). If you're using a Linux VM, just install `nvm` and run `nvm install 18` and then `nvm use 18` for your machine. 

- **Nginx settings:**
	- Note: You'll need to serve the frontend, the backend, the websocket connection, and the ice servers.
	- The url for each, given these settings, will look like:
		- **frontend:** your-site-for-ob.com/owlbear
		- **backend:** your-site-for-ob.com/ob-broker
		- **websocket:** your-site-for-ob.com/ob-broker/socket.io
		- **ice server:** your-site-for-ob.com/ob-broker/iceserver
```
server {

    set $forward_scheme http;
    set $server "localhost";
    set $port 9000;

    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-site-for-ob.com;

	# Serve the frontend build
    location /owlbear {
        alias /var/www/your-site-for-ob.com/owlbear-rodeo-legacy/dist;
        try_files $uri $uri/ /owlbear/index.html;
    }

	# Make sure any non-matching game urls go redirect to the owlbear homepage
    location = /owlbear/game {
        return 301 /owlbear;
    }

	# Proxy to your PM2 or Docker instance of the owlbear backend
    location /ob-broker {
        proxy_http_version 1.1;
        proxy_pass http://localhost:9000/;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

	# Proxy the websocket as well
    location /ob-broker/socket.io/ {
        proxy_pass http://localhost:9000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

	# Serve the ice servers as a static asset
    location /ob-broker/iceservers {
        alias /var/www/your-site-for-ob.com/owlbear-rodeo-legacy/backend/build/ice.json;
        default_type application/json;
        try_files $uri =404;
    }

    ssl_certificate /etc/letsencrypt/live/your-site-for-ob.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/your-site-for-ob.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = your-site-for-ob.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    listen [::]:80;
    server_name your-site-for-ob.com;
    return 404; # managed by Certbot
}
```

- **.env**
	- You need to set both the broker url and broker base url because the websocket connection doesn't work properly when you pass in the url with a subpath; it needs to go in the  `path` section of the instantiation.
```
VITE_APP_BROKER_URL=https://your-site-for-ob.com/ob-broker
VITE_APP_BROKER_BASE_URL=https://your-site-for-ob.com
VITE_APP_VERSION=$npm_package_version
VITE_APP_MAINTENANCE=false
```

- **App.tsx**
	- Whatever route you're serving the frontend on should be the basename on the Router
```
 <Router basename="/owlbear">
	...
 </Router>
```

- **Session.ts**
	- Pass in the **base** broker url to the websocket, and the path in the `path` field
```
      this.socket = io(import.meta.env.VITE_APP_BROKER_BASE_URL!, {
        withCredentials: true,
        parser: msgParser,
        transports: ["websocket"],
        path: "ob-broker/socket.io" //<-- Here!
      });
```

- **package.json (start scripts):**
	- Depending on your VM, you may need extra memory. If you're VM's default memory is too small, try using a swap file (it'll take forever, but you won't have to upgrade). Notice that the `tsc` command is removed; OB has a ton of type errors that don't necessarily impact it's functionality, so just remove that for now.
```
  "scripts": {
    "start": "vite",
    "build": "NODE_OPTIONS='--max-old-space-size=4096' vite build", // <- may need extra memory
    "preview": "vite preview"
  },
```

- **vite.config.ts**
	- Vite needs to know the base url so that it knows how to serve the static assets.
```
export default defineConfig({
    define: {
        global: 'globalThis',
    },
    base: '/owlbear', // <-- set the base url
    plugins: [
        nodePolyfills(),
        react({
            babel: {
                plugins: ["babel-plugin-macros"],
            },
        }),
        macros(),
    ],
    assetsInclude: ['**/*.bin', '**/*.glb', "**/*.dds"],
    server: {
        open: true,
        port: 3000,
    },
    worker: {
        format: 'es',
    },
})
```