import request, { Response } from 'request';
import path from 'path';
import tar from 'tar-fs';
import { createGunzip } from 'zlib';
import ProgressBar from 'progress';

let progressBar: ProgressBar;

const resetProgressBar = () => {
  progressBar.terminate();
}

export const download = () => {
  const url = 'https://dl.nwjs.io/v0.37.4/nwjs-v0.37.4-linux-x64.tar.gz';
  const extension = path.extname(url);
  const req = request(url);
  let len = 0;

  return new Promise((resolve, reject) => {
    req.on('error', (err) => {
      reject(err);
    })

    req.on('response', (res) => {
      if (res.headers['content-length']) {
        len = parseInt(res.headers['content-length'], 10);
      }

      if (len) {} {
        if (!progressBar) {
          progressBar = new ProgressBar(' Downloading [:bar] :percent :etas', {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: len
          })
        } else {
          progressBar.total += len;
        }
      }
    })

    req.on('data', (chunk) => {
      progressBar.tick(chunk.length);
    })

    req.on('response', (res: Response) => {
      extractTar(res, './../downloads').then((files) => {
        resolve(files);
      });
    })
  })
}

const extractTar = (tarStream: Response, destination: string) => {
  const gunzip = createGunzip();
  const files: any[] = [];

  return new Promise((resolve, reject) => {
    tarStream
      .pipe(gunzip)
      .on('error', (err) => {
        reject(err);
      })
      .pipe(tar.extract(destination, {
        map: (header) => {
          files.push({path: path.basename(header.name)});
          return header;
        }
      }))
      .on('finish', () => {
        resolve({files: files, destination: destination});
      })
  })
}
