// RequestModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Request } from './AdminView';

interface RequestModalProps {
  request: Request | null;
  onClose: () => void;
  onSave: (data: Request) => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ request, onClose, onSave }) => {
  const [formData, setFormData] = useState<Request>({
    user_id: request?.user_id || 0,
    request: request?.request || '',
    type: request?.type || 'supply',
    order_id: request?.order_id || 0,
    created_at: request?.created_at || new Date().toISOString().split('T')[0],
    updated_at: request?.updated_at || new Date().toISOString().split('T')[0],
    comments: request?.comments || '',
    is_anonymous: request?.is_anonymous || false,
    user_name: request?.user_name || '',
    id: request?.id
  });

  useEffect(() => {
    if (request) {
      setFormData(request);
    }
  }, [request]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">{request ? 'Edit Request' : 'New Request'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Request</label>
              <input
                type="text"
                name="request"
                value={formData.request}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Submit anonymously</label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={formData.is_anonymous}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="supply">Supply Request</option>
                <option value="maintenance">Maintenance Request</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#E31937] hover:bg-[#c01731] text-white font-medium rounded-md">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
