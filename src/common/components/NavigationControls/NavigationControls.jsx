import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import styles from './NavigationControls.module.scss';

const NavigationControls = ({ 
  activeStepId, 
  steps, 
  onStepChange,
  selectedBenne,
  onContinue,
  isStepCompleted,
  onClearSelection
}) => {
  const currentStepIndex = steps.findIndex(step => step.id === activeStepId);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleBack = () => {
    if (!isFirstStep) {
      onClearSelection && onClearSelection();
      onStepChange(steps[currentStepIndex - 1].id);
    }
  };

  const handleContinue = () => {
    if (!isStepCompleted(activeStepId)) return;
    
    if (!isLastStep) {
      onStepChange(steps[currentStepIndex + 1].id);
    } else {
      onContinue();
    }
  };

  const isCurrentStepComplete = isStepCompleted(activeStepId);

  if (!selectedBenne) {
    return null;
  }

  const calculateTotalPrice = () => {
    if (!selectedBenne) return '£0';
    const priceBeforeVat = parseFloat(selectedBenne.price_before_vat) || 0;
    const vatRate = parseFloat(selectedBenne.vat) || 0;
    return `£${Math.round(priceBeforeVat * (1 + vatRate / 100))}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectedBenne}>
        <h3 className={styles.title}>Your Selection</h3>
        
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Size</span>
            <span className={styles.detailValue}>
              {selectedBenne.size || 'N/A'} yd³
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Hire Period</span>
            <span className={styles.detailValue}>
              {selectedBenne.hire_period_days || 'N/A'} days
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Price (incl. VAT)</span>
            <span className={`${styles.detailValue} ${styles.highlight}`}>
              {calculateTotalPrice()}
            </span>
          </div>
        </div>
        
        <div className={styles.disclaimer}>
          Images are for illustration purposes only. Specifications and availability may vary.
        </div>
      </div>

      <div className={styles.navButtons}>
        <button
          type="button"
          className={`${styles.button} ${styles.back} ${isFirstStep ? styles.disabled : ''}`}
          onClick={handleBack}
          disabled={isFirstStep}
          aria-label="Previous step"
        >
          <FaArrowLeft className={styles.icon} /> Back
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.continue} ${!isCurrentStepComplete ? styles.disabled : ''}`}
          onClick={handleContinue}
          disabled={!isCurrentStepComplete}
          aria-label={isLastStep ? "Confirm order" : "Next step"}
        >
          {isLastStep ? 'Place Order' : 'Continue'} 
          <FaArrowRight className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

NavigationControls.propTypes = {
  activeStepId: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onStepChange: PropTypes.func.isRequired,
  selectedBenne: PropTypes.shape({
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hire_period_days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price_before_vat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vat: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onContinue: PropTypes.func.isRequired,
  isStepCompleted: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func 
};

NavigationControls.defaultProps = {
  selectedBenne: null,
  onClearSelection: () => {} 
};

export default NavigationControls;