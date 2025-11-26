/*
 * @Author: CNOliverZhang cnoliverzhang@gmail.com
 * @Date: 2024-01-22 20:18:47
 * @LastEditors: CNOliverZhang cnoliverzhang@gmail.com
 * @LastEditTime: 2024-01-22 20:20:50
 * @FilePath: /potatofield-frontend/src/Pages/ImageNotebook/types.ts
 * @Description: 
 */
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
  macYml: File;
  winPackage: File;
  winBlockmap: File;
  winYml: File;
}
