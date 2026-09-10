const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'];

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1);
  const value = bytes / 1024 ** unitIndex;
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${BYTE_UNITS[unitIndex]}`;
};

export const extensionFromName = (name: string): string => name.slice(name.lastIndexOf('.')).toLowerCase();

export const formatRelativeTime = (value: string): string => {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const formatCountdown = (target: string, now = Date.now()): string => {
  const remaining = Math.max(0, new Date(target).getTime() - now);
  const totalSeconds = Math.floor(remaining / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const isPast = (target: string, now = Date.now()): boolean => new Date(target).getTime() <= now;

export const isSupportedFile = (file: File): boolean =>
  ['.pdf', '.xls', '.xlsx', '.doc', '.docx'].includes(extensionFromName(file.name));
