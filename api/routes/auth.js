import { Router } from 'express'
import { register, login, logout, getProfile, authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticateToken, logout)
router.get('/profile', authenticateToken, getProfile)

export default router
