export default function ModalWrapper({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className='modal modal-open'>
      <div className='modal-box px-8 py-6 max-w-4xl w-full'>
        <button
          onClick={onClose}
          className='btn btn-sm btn-circle absolute right-2 top-2 text-gray-500 hover:text-error'>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
