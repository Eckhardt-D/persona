import {initializeApp, cert} from 'firebase-admin/app';
import {App} from 'firebase-admin/app';
import {Storage, getStorage} from 'firebase-admin/storage';
import {v4 as uuid} from 'uuid';
import {UploadedFile} from '../typings/UploadedFile';

export interface FirebaseConstructorOptions {
  privateKeyPath: string;
}

export interface UploadProfileImageOptions {
  file: UploadedFile;
}

export class Firebase {
  private privateKeyPath: string;
  private app: App;
  private storage: Storage;

  constructor(options: FirebaseConstructorOptions) {
    if (!options.privateKeyPath) {
      throw new Error(
        'Failed to initialize Firebase, invalid private key path.'
      );
    }

    this.privateKeyPath = options.privateKeyPath;

    this.app = initializeApp({
      credential: cert(this.privateKeyPath),
    });

    this.storage = getStorage(this.app);
  }

  async uploadProfileImageAndGetPath(options: UploadProfileImageOptions) {
    if (!options.file) {
      throw new Error('No file provided to upload.');
    }

    if (options.file.size > 512000) {
      throw new Error('File too large');
    }

    const fileName = `images/${uuid()}/${options.file.name}`;
    const bucket = this.storage.bucket(process.env.FB_BUCKET_NAME);
    const bucketFile = bucket.file(fileName);
    await bucketFile.save(options.file.data, {
      contentType: options.file.mimetype,
      public: true,
    });

    return bucketFile.publicUrl();
  }
}
