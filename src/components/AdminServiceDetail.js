import React, { useState, useEffect } from "react";
import { FiUpload, FiPlus, FiTrash2 } from "react-icons/fi";
import { uploadImage } from '../services/ImageUpload';
import { Modal, Button, Input, Badge, Spinner } from './ui';

const AdminServiceDetail = ({ serviceDetail, closeModal, serviceId }) => {
  const [uploadedImages, setUploadedImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", imageUrl: "", rate: "", discount: "",
    aboutService: [], howItWorks: [], faq: []
  });

  useEffect(() => {
    if (serviceDetail) setForm(serviceDetail);
  }, [serviceDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (event, key) => {
    const file = event.target.files[0];
    if (!file) return;
    const validFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!validFormats.includes(file.type)) {
      return alert("Invalid file type. Only PNG and JPEG are allowed.");
    }
    const imagePath = await uploadImage(file);
    if (imagePath) setUploadedImages(prev => ({ ...prev, [key]: imagePath }));
  };

  const addAboutService = () => setForm(prev => ({ ...prev, aboutService: [...(prev.aboutService || []), ""] }));
  const updateAboutService = (i, value) => {
    const updated = [...form.aboutService];
    updated[i] = value;
    setForm(prev => ({ ...prev, aboutService: updated }));
  };
  const removeAboutService = (i) => {
    setForm(prev => ({ ...prev, aboutService: prev.aboutService.filter((_, idx) => idx !== i) }));
  };

  const addFAQ = () => setForm(prev => ({ ...prev, faq: [...(prev.faq || []), { question: "", answer: "" }] }));
  const updateFAQ = (i, field, value) => {
    const updated = [...form.faq];
    updated[i][field] = value;
    setForm(prev => ({ ...prev, faq: updated }));
  };
  const removeFAQ = (i) => {
    setForm(prev => ({ ...prev, faq: prev.faq.filter((_, idx) => idx !== i) }));
  };

  const addHowItWorks = () => setForm(prev => ({ ...prev, howItWorks: [...(prev.howItWorks || []), { title: "", description: "", imageUrl: "" }] }));
  const updateHowItWorks = (i, field, value) => {
    const updated = [...(form.howItWorks || [])];
    updated[i][field] = value;
    setForm(prev => ({ ...prev, howItWorks: updated }));
  };
  const removeHowItWorks = (i) => {
    setForm(prev => ({ ...prev, howItWorks: prev.howItWorks.filter((_, idx) => idx !== i) }));
  };

  const submitDetail = async () => {
    setLoading(true);
    if (uploadedImages.details) form.imageUrl = uploadedImages.details;
    Object.keys(uploadedImages).forEach(key => {
      if (key.startsWith('hiw')) {
        const index = parseInt(key.replace('hiw', ''));
        if (form.howItWorks[index]) form.howItWorks[index].imageUrl = uploadedImages[key];
      }
    });
    form.serviceId = serviceId;
    form.isActive = true;

    try {
      await fetch(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/service/${serviceId}/saveOrUpdatedetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      closeModal();
    } catch (error) {
      console.error("Error saving service detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (sid, status) => {
    setLoading(true);
    try {
      await fetch(`${process.env.REACT_APP_BE_APP_API_BASE_URL}/api/product/saveOrUpdateServicType`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: sid, isActive: !status }),
      });
      closeModal();
    } catch (error) {
      console.error("Error changing status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={closeModal} title="Manage Service Details" size="lg">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
          <Spinner size="lg" />
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Service Name" name="name" value={form.name || ''} onChange={handleChange} placeholder="Service name" />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input label="Status" value="" disabled />
            </div>
            <Badge variant={form.isActive ? 'active' : 'inactive'}>
              {form.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => changeStatus(serviceId, form.isActive)}>
              Toggle
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Rate (₹)" name="rate" type="number" value={form.rate || ''} onChange={handleChange} placeholder="0" />
          <Input label="Discount (%)" name="discount" type="number" value={form.discount || ''} onChange={handleChange} placeholder="0" />
        </div>

        {/* Image upload */}
        <div>
          <p className="text-sm font-medium text-surface-700 mb-2">Display Image</p>
          <div className="flex items-center gap-3">
            {(form.imageUrl || uploadedImages.details) && (
              <img src={uploadedImages.details || form.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover border border-surface-200" />
            )}
            <label className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-xl cursor-pointer hover:bg-primary-100 transition-colors border border-primary-200">
              <FiUpload size={14} />
              Upload
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'details')} />
            </label>
          </div>
        </div>

        {/* About Service */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-surface-900">About Service</h3>
            <Button size="sm" variant="outline" onClick={addAboutService}>
              <FiPlus size={14} /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {form.aboutService?.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input value={item} onChange={(e) => updateAboutService(i, e.target.value)} placeholder="Describe a feature..." className="flex-1" />
                <button onClick={() => removeAboutService(i)} className="p-2 text-surface-400 hover:text-error transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-surface-900">How It Works</h3>
            <Button size="sm" variant="outline" onClick={addHowItWorks}>
              <FiPlus size={14} /> Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {form.howItWorks?.map((step, i) => (
              <div key={i} className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-surface-500 uppercase">Step {i + 1}</span>
                  <button onClick={() => removeHowItWorks(i)} className="p-1 text-surface-400 hover:text-error transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input value={step.title} onChange={(e) => updateHowItWorks(i, 'title', e.target.value)} placeholder="Title" />
                  <Input value={step.description} onChange={(e) => updateHowItWorks(i, 'description', e.target.value)} placeholder="Description" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {(step.imageUrl || uploadedImages['hiw' + i]) && (
                    <img src={uploadedImages['hiw' + i] || step.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-surface-200" />
                  )}
                  <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-surface-600 text-xs font-medium rounded-lg cursor-pointer hover:bg-surface-100 transition-colors border border-surface-200">
                    <FiUpload size={12} />
                    Image
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'hiw' + i)} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-surface-900">FAQ</h3>
            <Button size="sm" variant="outline" onClick={addFAQ}>
              <FiPlus size={14} /> Add FAQ
            </Button>
          </div>
          <div className="space-y-3">
            {form.faq?.map((faq, i) => (
              <div key={i} className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-surface-500 uppercase">Q{i + 1}</span>
                  <button onClick={() => removeFAQ(i)} className="p-1 text-surface-400 hover:text-error transition-colors">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input value={faq.question} onChange={(e) => updateFAQ(i, 'question', e.target.value)} placeholder="Question" />
                  <Input value={faq.answer} onChange={(e) => updateFAQ(i, 'answer', e.target.value)} placeholder="Answer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" className="flex-1" onClick={submitDetail}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminServiceDetail;
