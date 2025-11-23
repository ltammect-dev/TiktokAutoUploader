import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { host, port, username, password } = await request.json();

    if (!host) {
      return NextResponse.json({ country: 'No host provided' });
    }

    // Use ip-api.com to get IP geolocation info
    // This is a free service that doesn't require API key
    try {
      const ipToCheck = host;
      const geoRes = await fetch(`http://ip-api.com/json/${ipToCheck}?fields=status,country,countryCode,city,isp`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (geoRes.ok) {
        const geoData = await geoRes.json();
        
        if (geoData.status === 'success') {
          return NextResponse.json({
            country: `${geoData.countryCode} - ${geoData.country}${geoData.city ? ' (' + geoData.city + ')' : ''}`,
            success: true,
          });
        }
      }
    } catch (error) {
      console.error('Geo lookup error:', error);
    }

    // Fallback: just indicate proxy is configured
    return NextResponse.json({
      country: 'Proxy configured',
      success: false,
    });
  } catch (error) {
    console.error('Proxy check error:', error);
    return NextResponse.json(
      { country: 'Check failed', success: false },
      { status: 500 }
    );
  }
}
