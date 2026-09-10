import { FileSpreadsheet, FileText } from 'lucide-react';
import { extensionFromName } from '../utils/file';

interface FileIconProps {
  name: string;
  small?: boolean;
}

export const FileIcon = ({ name, small = false }: FileIconProps) => {
  const extension = extensionFromName(name);
  const isSpreadsheet = extension === '.xls' || extension === '.xlsx';
  const Icon = isSpreadsheet ? FileSpreadsheet : FileText;
  const tone = extension === '.pdf' ? 'bg-rose-50 text-rose-500' : isSpreadsheet ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-500';
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-2xl ${small ? 'h-11 w-11 rounded-xl' : 'h-14 w-14'} ${tone}`} aria-hidden="true">
      <Icon size={small ? 21 : 26} strokeWidth={1.8} />
    </div>
  );
};
