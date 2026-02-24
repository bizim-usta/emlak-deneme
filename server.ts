import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const db = new Database('realestate.db');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    price REAL,
    squareMeters INTEGER,
    roomCount TEXT,
    floor INTEGER,
    buildingAge INTEGER,
    type TEXT, -- SALE | RENT
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE | PASSIVE
    location TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    propertyId INTEGER,
    url TEXT,
    FOREIGN KEY(propertyId) REFERENCES properties(id) ON DELETE CASCADE
  );
`);

// Seed Admin if not exists
const adminCount = db.prepare('SELECT count(*) as count FROM admins').get() as { count: number };
if (adminCount.count === 0) {
  const email = process.env.ADMIN_EMAIL || 'admin@numanemlak.com';
  const password = process.env.ADMIN_PASSWORD || 'admin_password_123';
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admins (email, password) VALUES (?, ?)').run(email, hashedPassword);
}

// Seed Properties if not exists
const propertyCount = db.prepare('SELECT count(*) as count FROM properties').get() as { count: number };
if (propertyCount.count === 0) {
  const seedProperties = [
    {
      title: 'Kadıköy Moda\'da Deniz Manzaralı 3+1',
      description: 'Moda\'nın en nezih sokağında, panoramik deniz manzaralı, geniş balkonlu, lüks tadilatlı daire.',
      price: 12500000,
      squareMeters: 145,
      roomCount: '3+1',
      floor: 4,
      buildingAge: 15,
      type: 'SALE',
      location: 'Moda, Kadıköy, İstanbul',
      images: ['https://picsum.photos/id/1031/1200/800', 'https://picsum.photos/id/1032/1200/800']
    },
    {
      title: 'Beşiktaş Çarşı\'da Kiralık 1+1 Eşyalı',
      description: 'Çarşı merkezinde, ulaşım araçlarına yürüme mesafesinde, modern eşyalı, temiz daire.',
      price: 25000,
      squareMeters: 65,
      roomCount: '1+1',
      floor: 2,
      buildingAge: 10,
      type: 'RENT',
      location: 'Beşiktaş, İstanbul',
      images: ['https://picsum.photos/id/1040/1200/800', 'https://picsum.photos/id/1041/1200/800']
    },
    {
      title: 'Bodrum Yalıkavak\'ta Müstakil Havuzlu Villa',
      description: 'Yalıkavak Marina manzaralı, 500m2 bahçe içerisinde, özel havuzlu, 4 yatak odalı lüks villa.',
      price: 45000000,
      squareMeters: 320,
      roomCount: '4+1',
      floor: 0,
      buildingAge: 2,
      type: 'SALE',
      location: 'Yalıkavak, Bodrum, Muğla',
      images: ['https://picsum.photos/id/1043/1200/800', 'https://picsum.photos/id/1044/1200/800']
    }
  ];

  seedProperties.forEach(p => {
    const info = db.prepare(`
      INSERT INTO properties (title, description, price, squareMeters, roomCount, floor, buildingAge, type, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(p.title, p.description, p.price, p.squareMeters, p.roomCount, p.floor, p.buildingAge, p.type, p.location);
    
    const propertyId = info.lastInsertRowid;
    const insertImage = db.prepare('INSERT INTO images (propertyId, url) VALUES (?, ?)');
    p.images.forEach(url => insertImage.run(propertyId, url));
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email) as any;
    
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token });
    }
    res.status(401).json({ error: 'Geçersiz e-posta veya şifre' });
  });

  // Properties (Public)
  app.get('/api/properties', (req, res) => {
    const { type, minPrice, maxPrice, status } = req.query;
    let query = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    } else {
      query += " AND status = 'ACTIVE'";
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }

    query += ' ORDER BY createdAt DESC';
    const properties = db.prepare(query).all(...params) as any[];
    
    // Attach images
    const propertiesWithImages = properties.map(p => {
      const images = db.prepare('SELECT url FROM images WHERE propertyId = ?').all(p.id) as any[];
      return { ...p, images: images.map(img => img.url) };
    });

    res.json(propertiesWithImages);
  });

  app.get('/api/properties/:id', (req, res) => {
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id) as any;
    if (!property) return res.status(404).json({ error: 'İlan bulunamadı' });
    
    const images = db.prepare('SELECT url FROM images WHERE propertyId = ?').all(property.id) as any[];
    res.json({ ...property, images: images.map(img => img.url) });
  });

  // Admin Protected Routes Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Yetkisiz erişim' });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: 'Oturum süresi dolmuş' });
    }
  };

  app.post('/api/admin/properties', authenticate, (req, res) => {
    const { title, description, price, squareMeters, roomCount, floor, buildingAge, type, location, images } = req.body;
    
    const info = db.prepare(`
      INSERT INTO properties (title, description, price, squareMeters, roomCount, floor, buildingAge, type, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, price, squareMeters, roomCount, floor, buildingAge, type, location);

    const propertyId = info.lastInsertRowid;

    if (images && Array.isArray(images)) {
      const insertImage = db.prepare('INSERT INTO images (propertyId, url) VALUES (?, ?)');
      images.forEach(url => insertImage.run(propertyId, url));
    }

    res.status(201).json({ id: propertyId });
  });

  app.put('/api/admin/properties/:id', authenticate, (req, res) => {
    const { title, description, price, squareMeters, roomCount, floor, buildingAge, type, location, status, images } = req.body;
    
    db.prepare(`
      UPDATE properties SET 
        title = ?, description = ?, price = ?, squareMeters = ?, 
        roomCount = ?, floor = ?, buildingAge = ?, type = ?, 
        location = ?, status = ?
      WHERE id = ?
    `).run(title, description, price, squareMeters, roomCount, floor, buildingAge, type, location, status, req.params.id);

    // Simple image sync: delete old, add new
    db.prepare('DELETE FROM images WHERE propertyId = ?').run(req.params.id);
    if (images && Array.isArray(images)) {
      const insertImage = db.prepare('INSERT INTO images (propertyId, url) VALUES (?, ?)');
      images.forEach(url => insertImage.run(req.params.id, url));
    }

    res.json({ success: true });
  });

  app.delete('/api/admin/properties/:id', authenticate, (req, res) => {
    db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
