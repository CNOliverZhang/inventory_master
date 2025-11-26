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
  macPackage: File;
  macBlockmap: File;
  macZip: File;
  macZipBlockmap: File;
  macYml: File;
  winPackage: File;
  winBlockmap: File;
  winYml: File;
}
