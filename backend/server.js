import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


app.get('/productos', async (_, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio, estado, categoria, url_fotografia } = req.body;

    if (!nombre || !descripcion || !precio || !estado || !categoria) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    let fotoURL = null;

    if (url_fotografia && typeof url_fotografia === 'string' && url_fotografia.startsWith('data:image')) {
      const base64 = url_fotografia.split(',')[1];
      const buff = Buffer.from(base64, 'base64');
      const filename = `f_${Date.now()}.jpg`;
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, buff);
      fotoURL = `/uploads/${filename}`;
    } else if (url_fotografia) {
      fotoURL = url_fotografia; 
    }

    const [result] = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, estado, categoria, url_fotografia)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, Number(precio), estado, categoria, fotoURL]
    );

    const [nuevo] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    res.status(201).json(nuevo[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

app.delete('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend listo en http://localhost:${PORT}`);
});
