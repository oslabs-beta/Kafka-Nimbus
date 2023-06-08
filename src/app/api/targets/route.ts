import * as fs from 'fs';
import * as path from 'path';

type Target = string;

type Labels = {
  job: string;
};

type DataPoint = {
  targets: Target[];
  labels: Labels;
};

type DataPoints = DataPoint[];

export function GET(request: Request) {
    // console.log('here')
  const srcPath = path.join('./src/server/targets.json');

  const targetsData: DataPoints = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

  return new Response(JSON.stringify(targetsData), {
    status: 200,
    headers: { 'Content-Type' : 'application/json' },
  });
}
