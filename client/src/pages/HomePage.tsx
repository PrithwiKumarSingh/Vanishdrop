import { useState } from 'react';
import { DeleteModal } from '../components/DeleteModal';
import { FileBoard } from '../components/FileBoard';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';
import { Navbar } from '../components/Navbar';
import { PrivacyNotice } from '../components/PrivacyNotice';
import { Toast } from '../components/Toast';
import { useFiles } from '../hooks/useFiles';
import type { SharedFile } from '../types/file';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export const HomePage = () => {
  const { files, owned, loading, refreshing, error, refresh, upload, remove } = useFiles();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedForDelete, setSelectedForDelete] = useState<SharedFile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4500);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    try {
      await upload(file, setProgress);
      showToast('Upload complete — your file is ready on every device.');
    } catch (uploadError) {
      showToast(uploadError instanceof Error ? uploadError.message : 'Upload failed. Please try again.', 'error');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!selectedForDelete) return;
    setDeleting(true);
    try {
      await remove(selectedForDelete);
      setSelectedForDelete(null);
      showToast('File deleted successfully.');
    } catch (deleteError) {
      showToast(deleteError instanceof Error ? deleteError.message : 'Unable to delete this file.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-mist text-ink">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"><div className="mesh-bg absolute inset-x-0 top-0 h-[42rem]" /><div className="absolute -left-32 top-24 h-80 w-80 animate-drift rounded-full bg-[#dce6ff] blur-3xl" /><div className="absolute -right-36 top-[30rem] h-96 w-96 animate-drift rounded-full bg-[#d7f7f0] blur-3xl" /></div>
      <Navbar />
      <main className="relative z-0">
        <HeroSection uploading={uploading} progress={progress} onFile={handleUpload} />
        <PrivacyNotice />
        <FileBoard files={files} owned={owned} loading={loading} refreshing={refreshing} error={error} onRefresh={() => void refresh()} onDelete={setSelectedForDelete} />
        <div id="how-it-works"><HowItWorks /></div>
      </main>
      <Footer />
      {selectedForDelete && <DeleteModal file={selectedForDelete} deleting={deleting} onCancel={() => setSelectedForDelete(null)} onConfirm={() => void handleDelete()} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
