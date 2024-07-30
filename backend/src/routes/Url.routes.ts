import { Router } from 'express';
import {
  shortenUrl,
  getAnalytics,
  updateUrl,
  redirectUrl,
  deleteUrl,
  getUserShortLinks,
} from '../controllers/URL.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Url
 *   description: URL API endpoints
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     UrlRequest:
 *       type: object
 *       required:
 *         - originalUrl
 *       properties:
 *         originalUrl:
 *           type: string
 *           format: uri
 *           example: https://www.example.com/long-url
 *         alias:
 *           type: string
 *           example: example2024
 *     UrlUpdateRequest:
 *       type: object
 *       properties:
 *         originalUrl:
 *           type: string
 *           format: uri
 *           example: https://www.newexample.com/updated-url
 *         alias:
 *           type: string
 *           example: newAlias2024
 *     AnalyticsResponse:
 *       type: object
 *       properties:
 *         originalUrl:
 *           type: string
 *           format: uri
 *           example: https://www.example.com/long-url
 *         clicks:
 *           type: integer
 *           example: 150
 *         geoData:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *                 example: USA
 *               clicks:
 *                 type: integer
 *                 example: 50
 */

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Shorten a URL
 *     tags: [Url]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: URL to shorten
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UrlRequest'
 *     responses:
 *       201:
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: shorturl.com/example2024
 *       400:
 *         description: Invalid input or alias already in use
 *       500:
 *         description: Internal server error
 */
router.post('/shorten', authenticateToken, shortenUrl);

/**
 * @swagger
 * /api/{shortUrl}:
 *   get:
 *     summary: Redirect to the original URL
 *     tags: [Url]
 *     parameters:
 *       - name: shortUrl
 *         in: path
 *         required: true
 *         description: The short URL to redirect
 *         schema:
 *           type: string
 *           example: example2024
 *     responses:
 *       302:
 *         description: Redirected to original URL
 *       404:
 *         description: URL not found
 *       500:
 *         description: Internal server error
 */
router.get('/:shortUrl', redirectUrl);

/**
 * @swagger
 * /api/analytics/{shortUrl}:
 *   get:
 *     summary: Get analytics for a short URL
 *     tags: [Url]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The URL id to get analytics for
 *         schema:
 *           type: string
 *           example: example2024
 *     responses:
 *       200:
 *         description: Analytics data for the URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       404:
 *         description: URL not found
 *       500:
 *         description: Internal server error
 */
router.get('/analytics/:id', getAnalytics);

/**
 * @swagger
 * /api/update/{shortUrl}:
 *   put:
 *     summary: Update a short URL
 *     tags: [Url]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The URL id to update
 *         schema:
 *           type: string
 *           example: example2024
 *     requestBody:
 *       description: Updated URL information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UrlUpdateRequest'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Invalid input or alias already in use
 *       404:
 *         description: URL not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:id', authenticateToken, updateUrl);

/**
 * @swagger
 * /api/delete/{shortUrl}:
 *   delete:
 *     summary: Delete a short URL
 *     tags: [Url]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The URL id to delete
 *         schema:
 *           type: string
 *           example: example2024
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: URL not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', authenticateToken, deleteUrl);

/**
 * @swagger
 * /api/user/links:
 *   get:
 *     summary: Get all short links for the authenticated user
 *     tags: [Url]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of short links created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   shortUrl:
 *                     type: string
 *                     example: shorturl.com/example2024
 *                   originalUrl:
 *                     type: string
 *                     format: uri
 *                     example: https://www.example.com/long-url
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-07-28T12:34:56.789Z
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/user/links', authenticateToken, getUserShortLinks);

export default router;
