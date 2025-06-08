import React from 'react';
import styles from './Stepper.module.scss';

const StepperBox = ({ steps, activeStepId, onStepClick }) => {
  const activeStepIndex = steps.findIndex(step => step.id === activeStepId);

  return (
    <div className={`${styles.stepperContainer} fog-effect`}>
      <div className={styles.stepperArrow}>
        {steps.map((step, index) => {
          const isActive = step.id === activeStepId;
          const isCompleted = index < activeStepIndex;
          const isClickable = !step.disabled && typeof onStepClick === 'function';

          return (
            <div
              key={step.id}
              className={[
                styles.stepperArrowStep,
                isActive && styles.stepperArrowStepActive,
                isCompleted && styles.stepperArrowStepCompleted,
                step.disabled && styles.stepperArrowStepDisabled
              ].filter(Boolean).join(' ')}
              onClick={() => isClickable && onStepClick(step.id)}
              role="button"
              tabIndex={step.disabled ? -1 : 0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isClickable) {
                  onStepClick(step.id);
                }
              }}
            >
              <div className={styles.stepperArrowContent}>
                {step.icon && (
                  <div className={styles.stepperArrowIcon}>
                    {React.cloneElement(step.icon, {
                      className: [
                        styles.stepIcon,
                        isActive && styles.activeIcon,
                        isCompleted && styles.completedIcon
                      ].filter(Boolean).join(' ')
                    })}
                  </div>
                )}
                <div className={styles.stepperArrowLabel}>{step.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperBox;
