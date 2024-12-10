/* Sevidor HTTP con Node */

import * as http from 'node:http'
import { router} from './routes.js'

const port = process.argv[2] || 3001

const server = http.createServer(router)

server.listen(port,() => {console.log(`Servidor en el puerto ${port}`)})
