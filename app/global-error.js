'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{padding: 24, fontFamily: 'ui-sans-serif, system-ui'}}>
        <h1>Global Error</h1>
        <pre style={{whiteSpace:'pre-wrap', background:'#111', color:'#0f0', padding:12, borderRadius:8}}>
{String(error?.stack || error?.message || error)}
        </pre>
        <button onClick={() => reset()}
                style={{marginTop:12, padding:'8px 12px', borderRadius:8}}>
          Reload segment
        </button>
      </body>
    </html>
  );
}
