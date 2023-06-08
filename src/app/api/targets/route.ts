import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { headers } from 'next/headers';

export function GET(request: Request) {
    // console.log('here')
  const srcPath = path.join('./src/server/targets.json');

  const targetsData = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

  return new Response(JSON.stringify(targetsData), {
    status: 200,
    headers: { 'Content-Type' : 'application/json' },
  });
}
