import { MIME_TYPE } from '@/Constants/mimeType';

export interface MediaFileTag {
  id: number;
  name: string;
}

export interface MediaFile {
  id: number;
  name?: string;
  url: string;
  thumbnail?: string;
  uploadTime: Date;
  mimeType: MIME_TYPE;
  tags: MediaFileTag[];
}

export interface MediaFileForm {
  name?: string;
  file: File;
}

export interface MediaFileNameForm {
  id: number;
  name: string;
}

export interface MediaFileTagForm {
  name: string;
}
