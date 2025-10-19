import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Take Civic Action - Contact Your Representatives';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation (same as OG image for consistency)
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2563eb',
          backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          padding: '80px 100px',
        }}
      >
        {/* Capitol Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 32 32"
              style={{
                fill: '#2563eb',
              }}
            >
              <path d="M16 6L12 10H20L16 6Z" />
              <rect x="14" y="10" width="4" height="2" />
              <rect x="9" y="12" width="2" height="10" />
              <rect x="13" y="12" width="2" height="10" />
              <rect x="17" y="12" width="2" height="10" />
              <rect x="21" y="12" width="2" height="10" />
              <rect x="8" y="22" width="16" height="3" />
            </svg>
          </div>
        </div>

        {/* Main Heading */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.1,
            maxWidth: '900px',
          }}
        >
          Take Civic Action
        </div>

        {/* Subheading */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '800px',
          }}
        >
          Contact Your Representatives with AI-Powered Email Drafts
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            color: 'white',
            fontSize: 22,
            marginTop: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✓
            </div>
            <span>Free Forever</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✓
            </div>
            <span>Nonpartisan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✓
            </div>
            <span>Privacy-First</span>
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500,
          }}
        >
          takecivicaction.org
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
