import { verifyToken } from '../utils/jwt.js';

const auth = async (req, res, next) => {

try {

const authHeader = req.headers.authorization

if (!authHeader || !authHeader.startsWith('Bearer')) {
return res.status(401).json({
error: 'No token provided, maybe missing Bearer word or space or something'
})
}

const tokenPart = authHeader.split(' ')[1]
if (!tokenPart) {
return res.status(401).json({ error: 'Token seems broken or empty, not sure why' })
}

let decoded
try {
decoded = verifyToken(tokenPart)
} catch (err) {
return res.status(401).json({ error: 'Token verification failed, maybe expired or just weird' })
}

if (!decoded || !decoded.userId) {
return res.status(401).json({ error: 'Decoded token missing userId which is strange' })
}

req.user = { userId: decoded.userId }

next()

} catch (error) {
console.log('Auth error happened probably unexpected', error)
return res.status(401).json({ error: error.message || 'Authorization failed for unknown reason' })
}

}

export default auth;