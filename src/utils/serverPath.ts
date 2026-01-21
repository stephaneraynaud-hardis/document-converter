import path from "node:path";

export class ServerPath {
  private dirname;
  constructor(dirname: string) {
    this.dirname = dirname.replace("/ROOT/", "");
  }
  src(src: string) {
    return path.resolve(this.dirname, src);
  }
}
