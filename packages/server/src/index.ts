import express from 'express';
import cors from 'cors';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';

const t = initTRPC.create();

// สร้าง Router เพื่อส่งข้อมูลกลับไป
const appRouter = t.router({
  getSystemStatus: t.procedure
    .input(z.object({ user: z.string() }))
    .query(({ input }) => {
      // ข้อมูลที่จำลองการตอบกลับจากเซิร์ฟเวอร์
      return {
        message: `Connection established for ${input.user}`,
        status: 'Online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      };
    }),
});

// ส่งออก Type ไปให้ฝั่ง Client ใช้
export type AppRouter = typeof appRouter;

const app = express();
app.use(cors()); // สำคัญมาก ป้องกันปัญหา Cross-Origin

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({ router: appRouter })
);
app.get('/api/public-status', (req, res) => {
   res.json({ status: 'Online', forPublic: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});