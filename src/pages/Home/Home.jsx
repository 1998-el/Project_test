import React, { useState, useCallback } from 'react';
import StepperBox from '../../common/components/Stepper/Stepper';
import BenneCarousel from '../../common/components/Benne/Benne';
import NavigationControls from '../../common/components/NavigationControls/NavigationControls';
import { 
  FaMapMarkerAlt, 
  FaTrashAlt, 
  FaDumpster,
  FaIdCard, 
  FaCalendarAlt, 
  FaCreditCard 
} from 'react-icons/fa';

const STEPS = [
  { id: 'step1', icon: <FaMapMarkerAlt />, label: 'Postal Code' },
  { id: 'step2', icon: <FaTrashAlt />, label: 'Waste Type' },
  { id: 'step3', icon: <FaDumpster />, label: 'Select Skipper' },
  { id: 'step4', icon: <FaIdCard />, label: 'License Check' },
  { id: 'step5', icon: <FaCalendarAlt />, label: 'Select Date' },
  { id: 'step6', icon: <FaCreditCard />, label: 'Payment' },
];

const BENNES = [
  { id: 17933, size: 4, price_before_vat: 278, allowed_on_road: true, allows_heavy_waste: true },
  { id: 17934, size: 6, price_before_vat: 305, allowed_on_road: true, allows_heavy_waste: true },
  { id: 17935, size: 8, price_before_vat: 375, allowed_on_road: true, allows_heavy_waste: true },
  { id: 17936, size: 10, price_before_vat: 400, allowed_on_road: false, allows_heavy_waste: false },
  { id: 17937, size: 12, price_before_vat: 439, allowed_on_road: false, allows_heavy_waste: false },
  { id: 17938, size: 14, price_before_vat: 470, allowed_on_road: false, allows_heavy_waste: false },
  { id: 17939, size: 16, price_before_vat: 496, allowed_on_road: false, allows_heavy_waste: false },
  { id: 15124, size: 20, price_before_vat: 992, transport_cost: 248, allows_heavy_waste: true },
  { id: 15125, size: 40, price_before_vat: 992, transport_cost: 248, allows_heavy_waste: false },
];

function Home() {
  const [activeStepId, setActiveStepId] = useState('step1');
  const [selectedBenne, setSelectedBenne] = useState(null);

  const isStepCompleted = useCallback(
    (stepId) => (stepId === 'step3' ? selectedBenne !== null : true),
    [selectedBenne]
  );

  const handleContinueFinal = useCallback(() => {
    console.log('Order confirmed:', { selectedBenne });
    // Here you can integrate your API call or submission logic
  }, [selectedBenne]);

  return (
    <div className="App">
      <StepperBox
        steps={STEPS}
        activeStepId={activeStepId}
        onStepClick={setActiveStepId}
      />

      {activeStepId === 'step3' && (
        <BenneCarousel
          bennes={BENNES}
          selectedBenne={selectedBenne}
          onSelectBenne={setSelectedBenne}
        />
      )}

      <NavigationControls
        activeStepId={activeStepId}
        steps={STEPS}
        onStepChange={setActiveStepId}
        selectedBenne={selectedBenne}
        onContinue={handleContinueFinal}
        isStepCompleted={isStepCompleted}
      />
    </div>
  );
}

export default Home;
