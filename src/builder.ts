import { download } from './downloader';

export class Builder {

  build(platform: string) {
    download().then((files) => {
      console.log(files);
    });
    console.log(`Built for platform ${platform}`)
  }
}
