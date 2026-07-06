import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      }}
    >
      <span style={{ fontSize: 96, fontWeight: 800, color: 'white', letterSpacing: -2 }}>
        DukiTools
      </span>
      <span style={{ fontSize: 32, color: 'rgba(255,255,255,0.85)', marginTop: 16 }}>
        All Your Online Tools in One Place
      </span>
      <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', marginTop: 32 }}>
        Gratis · Tanpa Login · 49+ Tools · 9 Kategori
      </span>
    </div>,
    size,
  );
}
