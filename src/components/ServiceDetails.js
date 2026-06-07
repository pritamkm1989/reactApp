import React, { useState } from "react";
import { FiStar, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Modal, Button, Img } from './ui';

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex gap-0.5 text-primary-500">
      {[...Array(full)].map((_, i) => <FiStar key={`f${i}`} className="fill-primary-500" size={16} />)}
      {half && <FiStar className="fill-primary-500" size={16} />}
      {[...Array(empty)].map((_, i) => <FiStar key={`e${i}`} size={16} className="text-surface-200" />)}
    </div>
  );
};

const ServiceDetail = ({ selectedItem, closeModal }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <Modal isOpen={true} onClose={closeModal} title={selectedItem.name} size="lg">
      <div className="space-y-6">
        {/* Image & Basic Info */}
        <div className="flex flex-col md:flex-row gap-6">
          {selectedItem.imageUrl && (
            <div className="md:w-1/2 shrink-0">
              <Img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="w-full aspect-video object-cover rounded-xl"
              />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-2xl font-bold text-surface-900">₹{selectedItem.rate}</p>
              {selectedItem.discount && (
                <p className="text-sm text-success font-medium">{selectedItem.discount}% off</p>
              )}
            </div>
            <div>{renderStars(selectedItem.rattings || 0)}</div>
            <Button variant="primary" className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>

        {/* About Service */}
        {Array.isArray(selectedItem.aboutService) && selectedItem.aboutService.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-surface-900 mb-2">About this service</h3>
            <ul className="space-y-1.5">
              {selectedItem.aboutService.map((s, i) => (
                <li key={i} className="text-sm text-surface-600 flex gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* How It Works */}
        {Array.isArray(selectedItem.howItWorks) && selectedItem.howItWorks.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-surface-900 mb-3">
              How it works ({selectedItem.howItWorks.length} steps)
            </h3>
            <div className="space-y-3">
              {selectedItem.howItWorks.map((step, i) => (
                <div key={i} className="flex gap-4 items-start bg-surface-50 rounded-xl p-4">
                  {step.imageUrl && (
                    <Img src={step.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-surface-900">Step {i + 1}: {step.title}</p>
                    <p className="text-sm text-surface-600 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {Array.isArray(selectedItem.faq) && selectedItem.faq.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-surface-900 mb-3">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {selectedItem.faq.map((faq, i) => (
                <div key={i} className="border border-surface-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(i)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
                  >
                    {faq.question}
                    {openIndex === i ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </button>
                  {openIndex === i && (
                    <div className="px-4 pb-3 text-sm text-surface-600 border-t border-surface-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ServiceDetail;
