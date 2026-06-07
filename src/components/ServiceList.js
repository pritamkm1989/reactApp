import React from "react";
import { FiEye, FiStar } from "react-icons/fi";
import { Card, Button, Img } from './ui';

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex gap-0.5 text-primary-500">
      {[...Array(full)].map((_, i) => <FiStar key={`f${i}`} className="fill-primary-500" size={14} />)}
      {half && <FiStar className="fill-primary-500" size={14} />}
      {[...Array(empty)].map((_, i) => <FiStar key={`e${i}`} size={14} className="text-surface-200" />)}
    </div>
  );
};

const ServiceList = ({ serviceDetail, serviceDetails, openModal }) => {
  if (!Array.isArray(serviceDetails) || serviceDetails.length === 0) return null;

  return (
    <Card>
      <div className="flex flex-col lg:flex-row gap-6">
        {serviceDetail && (
          <div className="lg:w-1/3 shrink-0">
            <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 h-full">
              <div className="flex items-start gap-3 mb-3">
                {serviceDetail.imageUrl && (
                  <Img src={serviceDetail.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-surface-900 dark:text-surface-100 text-sm">{serviceDetail.name}</p>
                  <p className="text-primary-600 font-medium text-sm mt-0.5">₹{serviceDetail.rate}</p>
                  <div className="mt-1">{renderStars(serviceDetail.rattings)}</div>
                </div>
              </div>
              {serviceDetail?.aboutService?.length > 0 && (
                <ul className="space-y-1 mt-3">
                  {serviceDetail.aboutService.slice(0, 3).map((s, i) => (
                    <li key={i} className="text-xs text-surface-600 dark:text-surface-400 flex gap-2">
                      <span className="text-primary-500 mt-0.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => openModal(serviceDetail)}>
                <FiEye size={14} />
                View Details
              </Button>
            </div>
          </div>
        )}

        <div className={`flex-1 ${serviceDetail ? '' : 'w-full'}`}>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {serviceDetails.map((item, i) => (
              <Card key={i} hover padding={false} className="min-w-[200px] w-[200px] shrink-0 cursor-pointer" onClick={() => openModal(item)}>
                {item.imageUrl && (
                  <div className="aspect-[4/3] overflow-hidden rounded-t-2xl bg-surface-100 dark:bg-surface-700">
                    <Img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{item.name}</p>
                  <p className="text-primary-600 font-medium text-xs mt-0.5">₹{item.rate}</p>
                  <div className="mt-1">{renderStars(item.rattings)}</div>
                  {item?.aboutService?.length > 0 && (
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 line-clamp-2">{item.aboutService[0]}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceList;
