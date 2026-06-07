import React, { useMemo } from 'react';
import { FiCheck } from 'react-icons/fi';

const Stepper = ({ currentKey, hideTypeStep }) => {
  const steps = useMemo(() => {
    const allSteps = [
      { key: 'category', label: 'Category' },
      { key: 'subcategory', label: 'Subcategory' },
      { key: 'type', label: 'Service Type' },
      { key: 'details', label: 'Details' },
      { key: 'cart', label: 'Cart' },
    ];
    return hideTypeStep
      ? allSteps.filter(s => s.key !== 'type')
      : allSteps;
  }, [hideTypeStep]);

  const currentIndex = steps.findIndex(s => s.key === currentKey);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < activeIndex;
        const isCurrent = i === activeIndex;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary-500 text-white'
                    : isCurrent
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/50'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-400 dark:text-surface-500'
                }`}
              >
                {isCompleted ? <FiCheck size={14} /> : i + 1}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-medium whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-primary-600 dark:text-primary-400'
                    : isCompleted
                    ? 'text-surface-500 dark:text-surface-400'
                    : 'text-surface-400 dark:text-surface-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-2 mt-[-1.25rem] transition-colors duration-300 ${
                  isCompleted ? 'bg-primary-500' : 'bg-surface-200 dark:bg-surface-700'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
