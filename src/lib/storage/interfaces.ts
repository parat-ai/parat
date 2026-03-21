export interface StorageProvider {
  upload(file: Buffer, path: string, mimeType: string): Promise<string>
  download(path: string): Promise<Buffer>
  getSignedUrl(path: string, expiresIn: number): Promise<string>
}
