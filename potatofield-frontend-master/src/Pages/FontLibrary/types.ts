export interface FontStyle {
  id: number;
  name: string;
}

export interface Font {
  id: number;
  fontFile: string;
  fontStyle: FontStyle;
  previewImage: string;
  fontStyleId: number;
  fontFamilyId: number;
}

export interface FontForm {
  id?: number;
  font?: File;
  fontStyleId?: number;
  fontFamilyId?: number;
}

export interface FontFamily {
  id: number;
  name: string;
  language: number;
  fonts: Font[];
}

export interface FontFamilyForm {
  id?: number;
  name?: string;
  language?: number;
}

export interface EditOptions {
  create: boolean;
}
