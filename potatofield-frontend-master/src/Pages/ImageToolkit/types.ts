export interface Version {
  code: string;
  features: string;
  pubDate: Date;
  winPackage: string;
  macPackage: string;
}

export interface VersionForm {
  code: string;
  features: string;
  winPackage: File;
  macPackage: File;
  winBlockmap: File;
  macBlockmap: File;
  winYml: File;
  macYml: File;
}

export interface ImageToolkitMessage {
  id?: number;
  title: string;
  text: string;
  pubDate: Date;
}

export interface Tool {
  id?: number;
  name: string;
  introduction: string;
  image: string;
}

export interface ToolForm {
  id?: number;
  name: string;
  introduction: string;
  image: File;
}
