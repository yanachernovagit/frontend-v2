export type ExerciseCatalog = {
  id: string;
  name: string;
  description?: string | null;
  bodyPart?: string | null;
  videoUrl?: string | null;
  videoCoverUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RoutineCatalog = {
  id: string;
  title: string;
  order: number;
  iconUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string;
  createdAt?: string | null;
  lastSignInAt?: string | null;
};

export type MediaAssociation = {
  entity: "evaluation" | "exercise" | "routine";
  id: string;
  field: string;
  label: string;
};

export type MediaAsset = {
  id: string;
  key: string;
  url: string;
  size: number;
  lastModified?: string;
  associations: MediaAssociation[];
};

export type MediaUploadResponse = {
  key: string;
  url: string;
  bucket: string;
  contentType?: string;
  size: number;
};

export type MediaRenameResponse = {
  oldKey: string;
  newKey: string;
  oldUrl: string;
  newUrl: string;
  associationsUpdated: number;
};

export type MediaDeleteResponse = {
  key: string;
  deleted: boolean;
};
