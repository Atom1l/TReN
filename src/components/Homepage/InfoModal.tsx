import React from 'react';
import { Link } from 'react-router-dom';

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  fullLinkUrl: string;
  fullLinkText: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, title, content, fullLinkUrl, fullLinkText, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 md:px-8 py-5 md:py-6 border-b border-slate-100 shrink-0 bg-[#1e3a8a]">
          <h3 className="text-2xl md:text-3xl font-bold text-white pr-4">{title}</h3>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors p-2 rounded-full hover:bg-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 md:p-10 overflow-y-auto flex-1">
          {content}
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <Link 
            to={fullLinkUrl}
            onClick={onClose}
            className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm"
          >
            {fullLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;