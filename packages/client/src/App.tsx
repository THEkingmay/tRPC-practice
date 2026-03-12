import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

// นำเข้า Type ชนิดข้อมูลจากฝั่ง Server ตรงๆ (ตรงนี้ชื่อแพ็กเกจต้องตรงกับใน package.json ของ server)
import type { AppRouter } from '@myapp/server'

const trpc = createTRPCReact<AppRouter>();

function Dashboard() {
  const query = trpc.getSystemStatus.useQuery({ user: 'Mathee' });

  if (query.isLoading) return <p>Fetching data from server...</p>;
  if (query.isError) return <p>Error connecting to server.</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>System Monitor</h2>
      <p>แสดงผลข้อมูล JSON จาก Backend ด้วยฟอนต์ Monospace:</p>
      
      {/* ใช้ <pre> และ <code> เพื่อบังคับการแสดงผลแบบ Monospace สำหรับข้อมูลทางเทคนิค */}
      <pre style={{
        backgroundColor: '#1e1e1e',
        color: '#4af626',
        padding: '15px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '14px',
        overflowX: 'auto'
      }}> 
        <code>{JSON.stringify(query.data, null, 2)}</code>
      </pre>
    </div>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_API_URL || 'http://localhost:4000/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </trpc.Provider>
  );
}