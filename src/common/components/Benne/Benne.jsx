import React from 'react';
import { 
  FaRuler, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCheck,
  FaImage, FaRoad, FaWeightHanging
} from 'react-icons/fa';
import { useCarousel } from '../../../app/hooks/useCarousel';
import styles from './Benne.module.scss';

const BenneCarousel = ({ bennes, selectedBenne, onSelectBenne }) => {
  const getBenneImage = (size) => {
    const sizes = {
      4: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/4-yarder-skip.jpg',
      6: 'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/6-yarder-skip.jpg',
    };
    return sizes[size] || `https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/${size}-yarder-skip.jpg`;
  };

  const formatBenneData = (benne) => ({
    ...benne,
    type: `Skip ${benne.size} yd³`,
    dimensions: `${benne.size} cubic yards`,
    period: `${benne.hire_period_days ?? 14} days`,
    priceInclVAT: Math.round(benne.price_before_vat * (1 + (benne.vat ?? 20) / 100)),
    vat: benne.vat ?? 20,
    image: getBenneImage(benne.size),
    transportCost: benne.transport_cost != null ? `£${benne.transport_cost}` : 'Included',
    features: [
      {
        icon: <FaRoad />,
        label: benne.allowed_on_road ? 'Allowed on public roads' : 'Not for public roads',
        className: benne.allowed_on_road ? 'allowed' : 'forbidden',
      },
      {
        icon: <FaWeightHanging />,
        label: benne.allows_heavy_waste ? 'Heavy waste allowed' : 'Light waste only',
        className: benne.allows_heavy_waste ? 'allowed' : 'forbidden',
      },
    ],
  });

  const formattedBennes = bennes.map(formatBenneData);

  const {
    currentIndex,
    next,
    prev,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    goToIndex,
    getVisibleIndices,
  } = useCarousel(formattedBennes);

  const visibleIndices = getVisibleIndices();
  const currentBenne = formattedBennes[currentIndex];

  const handleSelectBenne = () => {
    if (onSelectBenne) {
      onSelectBenne(selectedBenne?.id === bennes[currentIndex].id ? null : bennes[currentIndex]);
    }
  };

  const renderBenneCard = (benne, indexInTrack) => {
    const positionClass = indexInTrack === 0
      ? styles.prevCard
      : indexInTrack === 1
        ? styles.centerCard
        : styles.nextCard;

    const isSelected = selectedBenne?.id === benne.id;

    return (
      <div
        key={benne.id}
        className={`${styles.benneCard} ${positionClass} ${isSelected ? styles.selected : ''}`}
        onClick={() => {
          if (indexInTrack !== 1) {
            goToIndex(visibleIndices[indexInTrack]);
          } else {
            handleSelectBenne();
          }
        }}
      >
        {benne.image ? (
          <img
            src={benne.image}
            alt={benne.type}
            className={styles.cardThumbnail}
          />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <FaImage />
          </div>
        )}

        {!benne.allowed_on_road && (
          <div className={styles.roadWarningBadge}>
            <FaRoad /> Not road legal
          </div>
        )}

        <h3>{benne.type}</h3>

        <div className={styles.cardDetails}>
          <div className={styles.detailItem}>
            <FaRuler />
            <span>{benne.dimensions}</span>
          </div>
          <div className={styles.detailItem}>
            <FaCalendarAlt />
            <span>{benne.period}</span>
          </div>
          {benne.features.map(({ icon, label, className }, i) => (
            <div key={i} className={`${styles.detailItem} ${styles[className]}`}>
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>

        {indexInTrack === 1 && (
          <button 
            className={`${styles.selectButton} ${isSelected ? styles.selected : ''}`} 
            onClick={(e) => {
              e.stopPropagation();
              handleSelectBenne();
            }}
          >
            <FaCheck /> {isSelected ? 'Deselect' : 'Select'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.benneCarouselContainer}>
      <header className={styles.carouselHeader}>
        <h1>Skip Hire</h1>
        <p>Choose the right skip for your needs</p>
      </header>

      <div className={styles.benneDetails}>
        <div className={styles.priceDisplay}>
          <span className={styles.price}>£{currentBenne.priceInclVAT} incl. VAT</span>
          <span className={styles.vat}>({currentBenne.vat}% VAT)</span>
        </div>
        <div className={styles.transportCost}>
          Delivery: {currentBenne.transportCost}
          {currentBenne.per_tonne_cost && ` | Cost per tonne: £${currentBenne.per_tonne_cost}`}
        </div>
      </div>

      {formattedBennes.length > 1 ? (
        <>
          <div
            className={styles.carouselWrapper}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button className={styles.navButton} onClick={prev} aria-label="Previous">
              <FaChevronLeft />
            </button>

            <div className={styles.carouselTrack}>
              {visibleIndices.map((index, idx) =>
                renderBenneCard(formattedBennes[index], idx)
              )}
            </div>

            <button className={styles.navButton} onClick={next} aria-label="Next">
              <FaChevronRight />
            </button>
          </div>

          <div className={styles.carouselDots}>
            {formattedBennes.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => goToIndex(index)}
                aria-label={`Go to skip ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className={`${styles.benneCard} ${styles.centerCard}`}>
          <img src={currentBenne.image} alt={currentBenne.type} className={styles.cardThumbnail} />
          <h3>{currentBenne.type}</h3>
          <div className={styles.cardDetails}>
            <div className={styles.detailItem}>
              <FaRuler />
              <span>{currentBenne.dimensions}</span>
            </div>
            <div className={styles.detailItem}>
              <FaCalendarAlt />
              <span>{currentBenne.period}</span>
            </div>
            {currentBenne.features.map(({ icon, label, className }, i) => (
              <div key={i} className={`${styles.detailItem} ${styles[className]}`}>
                {/* {icon} */}
                <span>{label}</span>
              </div>
            ))}
          </div>
          <button 
            className={`${styles.selectButton} ${selectedBenne?.id === currentBenne.id ? styles.selected : ''}`}
            onClick={handleSelectBenne}
          >
            <FaCheck /> {selectedBenne?.id === currentBenne.id ? 'Deselect' : 'Select'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BenneCarousel;