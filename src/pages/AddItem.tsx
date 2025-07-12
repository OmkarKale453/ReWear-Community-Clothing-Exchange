import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Camera } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useApp();
  const { state: authState } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
    points: 50,
  });
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Activewear', 'Formal'
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', 'One Size'];
  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];
  const mockImageUrls = [
    'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg',
    'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
    'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
    'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const handleImageUpload = () => {
    if (images.length < 5) {
      const randomImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
      setImages(prev => [...prev, randomImage]);
    }
  };
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.type.trim()) newErrors.type = 'Type is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    if (formData.points < 10 || formData.points > 200) newErrors.points = 'Points must be between 10 and 200';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      addItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        size: formData.size,
        condition: formData.condition,
        tags: tagsArray,
        images,
        uploaderId: authState.user!.id,
        uploaderName: authState.user!.name,
        status: 'under_review',
        points: formData.points,
      });
      navigate('/dashboard', { state: { message: 'Item submitted successfully! It will be reviewed by our team.' } });
    } catch (error) {
      setErrors({ general: 'Failed to submit item. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Item</h1>
          <p className="text-gray-600 text-sm mb-6">Share your pre-loved clothing with the ReWear community.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600 mb-2">{errors.general}</div>
            )}
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photos <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-3">Upload up to 5 photos. The first photo will be your main image.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-xl border border-gray-100" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"><X className="h-4 w-4" /></button>
                    {index === 0 && (<div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">Main</div>)}
                  </div>
                ))}
                {images.length < 5 && (
                  <button type="button" onClick={handleImageUpload} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                    <Camera className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-600">Add Photo</span>
                  </button>
                )}
              </div>
              {errors.images && <p className="mt-1 text-xs text-red-600">{errors.images}</p>}
            </div>
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Vintage Denim Jacket" className={`w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${errors.title ? 'border-red-300' : 'border-gray-300'}`} />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Describe the item's style, fit, materials, and any notable features..." className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${errors.description ? 'border-red-300' : 'border-gray-300'}`}></textarea>
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>
            {/* Category and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${errors.category ? 'border-red-300' : 'border-gray-300'}`}>
                  <option value="">Select category</option>
                  {categories.map(category => (<option key={category} value={category}>{category}</option>))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
                <input type="text" id="type" name="type" value={formData.type} onChange={handleInputChange} placeholder="e.g., Jacket, Dress, Sneakers" className={`w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${errors.type ? 'border-red-300' : 'border-gray-300'}`} />
                {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
              </div>
            </div>
            {/* Size and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Size <span className="text-red-500">*</span></label>
                <select id="size" name="size" value={formData.size} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${errors.size ? 'border-red-300' : 'border-gray-300'}`}>
                  <option value="">Select size</option>
                  {sizes.map(size => (<option key={size} value={size}>{size}</option>))}
                </select>
                {errors.size && <p className="mt-1 text-xs text-red-600">{errors.size}</p>}
              </div>
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Condition <span className="text-red-500">*</span></label>
                <select id="condition" name="condition" value={formData.condition} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${errors.condition ? 'border-red-300' : 'border-gray-300'}`}>
                  <option value="">Select condition</option>
                  {conditions.map(condition => (<option key={condition} value={condition}>{condition}</option>))}
                </select>
                {errors.condition && <p className="mt-1 text-xs text-red-600">{errors.condition}</p>}
              </div>
            </div>
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g., vintage, summer, casual" className="w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm border-gray-300" />
            </div>
            {/* Points */}
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">Points <span className="text-red-500">*</span></label>
              <input type="number" id="points" name="points" value={formData.points} onChange={handleInputChange} min={10} max={200} className={`w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${errors.points ? 'border-red-300' : 'border-gray-300'}`} />
              {errors.points && <p className="mt-1 text-xs text-red-600">{errors.points}</p>}
            </div>
            {/* Submit */}
            <button type="submit" disabled={isSubmitting} className="w-full py-2 rounded-full bg-emerald-600 text-white font-semibold text-base hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Submitting...' : 'Submit Item'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;