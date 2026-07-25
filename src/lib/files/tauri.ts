import { invoke } from '@tauri-apps/api/core';

export async function createFile(path: string, content: string): Promise<void> {
  await invoke('create_file', { path, content });
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  await invoke('rename_file', { oldPath: oldPath, newPath: newPath });
}

export async function deleteFile(path: string): Promise<void> {
  await invoke('delete_file', { path });
}

export async function readFile(path: string): Promise<string> {
  return await invoke('read_file', { path });
}
