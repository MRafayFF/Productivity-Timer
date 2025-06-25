import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import archiver from "archiver";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Download project as zip
  app.get("/api/download-project", (req, res) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    res.attachment('interval-timer-project.zip');
    archive.pipe(res);

    // Add project files to zip
    const projectRoot = path.resolve(process.cwd());
    
    // Add key directories and files
    archive.directory(path.join(projectRoot, 'client'), 'client');
    archive.directory(path.join(projectRoot, 'server'), 'server');
    archive.directory(path.join(projectRoot, 'shared'), 'shared');
    
    // Add config files
    const configFiles = [
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'tailwind.config.ts',
      'vite.config.ts',
      'vite.config.frontend.ts',
      'postcss.config.js',
      'drizzle.config.ts',
      'replit.md',
      'DEPLOYMENT-GUIDE.md'
    ];

    configFiles.forEach(file => {
      const filePath = path.join(projectRoot, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).send({ error: err.message });
    });

    archive.finalize();
  });

  const httpServer = createServer(app);

  return httpServer;
}
