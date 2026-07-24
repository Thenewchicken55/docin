export type DocumentFile = {
  path: string;
  name: string;
  content: string;
};

export type WorkspaceState = {
  files: DocumentFile[];
  selectedPath: string | null;
};
