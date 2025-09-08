import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaGift } from 'react-icons/fa';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    background: '#1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '800px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  title: {
    color: '#fff',
    marginBottom: '24px',
    fontSize: '1.8em',
  },
  reelContainer: {
    position: 'relative',
    width: '100%',
    height: '120px',
    overflow: 'hidden',
    border: '2px solid #333',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  reelInner: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    willChange: 'transform',
  },
  reelItem: {
    minWidth: '100px',
    height: '100px',
    margin: '0 10px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9em',
    color: '#fff',
    textAlign: 'center',
    padding: '5px',
    flexShrink: 0,
    border: '2px solid transparent',
  },
  reelItemActive: {
    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
    borderColor: '#FFD700',
    transform: 'scale(1.2)',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
    zIndex: 1,
  },
  reelItemName: {
    marginTop: '5px',
    fontWeight: 'bold',
  },
  resultItem: {
    textAlign: 'center',
    padding: '20px',
  },
  giftIcon: {
    fontSize: '64px',
    color: '#FFD700',
    marginBottom: '16px',
  },
  itemName: {
    color: '#fff',
    fontSize: '1.4em',
    marginBottom: '8px',
  },
  itemDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.1em',
  },
  closeButton: {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1.1em',
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'background 0.2s ease',
  },
  centerPointer: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '4px',
    backgroundColor: '#FFD700',
    transform: 'translateX(-50%)',
    zIndex: 2,
  }
};

const CaseOpening = ({ isOpen, onClose, item, caseName }) => {
  const [animationState, setAnimationState] = useState('idle'); // 'idle', 'spinning', 'landing', 'result'
  const reelRef = useRef(null);
  const itemWidth = 120; // minWidth + margin (100px + 10px left + 10px right)

  const winnableItems = [
    { id: 'vip', name: 'VIP Status', icon: '👑' },
    { id: 'vip_plus', name: 'VIP+ Status', icon: '🌟' },
    { id: 'vip_premium', name: 'VIP Premium', icon: '💎' },
    { id: 'cooldown_boost_1h', name: '1 Hour Cooldown Boost', icon: '⏳' },
    { id: 'cooldown_boost_24h', name: '24 Hour Cooldown Boost', icon: '⌛' },
    { id: 'pixel_boost_1h', name: '1 Hour Pixel Boost', icon: '⚡' },
    { id: 'pixel_boost_24h', name: '24 Hour Pixel Boost', icon: '✨' },
    { id: 'rainbow_color', name: 'Rainbow Color', icon: '🌈' },
  ];

  const fillerItems = [
    { id: 'filler_common', name: 'Common Item', icon: '📦' },
    { id: 'filler_rare', name: 'Rare Drop', icon: '🌠' },
    { id: 'filler_unique', name: 'Unique Loot', icon: '💫' },
    { id: 'filler_lucky', name: 'Lucky Charm', icon: '🍀' },
  ];

  const [spinningItems, setSpinningItems] = useState([]);
  const [finalWinningIndex, setFinalWinningIndex] = useState(-1);
  const [currentOpenedItem, setCurrentOpenedItem] = useState(null); // Added state to store the item prop

  useEffect(() => {
    if (isOpen) {
      if (!reelRef.current || !item) {
        setAnimationState('result');
        console.log('CaseOpening: Skipping animation due to missing ref or item.', { reelRef: reelRef.current, item });
        return;
      }

      // Store the item data when animation starts
      setCurrentOpenedItem(item);
      console.log('CaseOpening: Item prop received and stored:', item);

      const generatedItems = [];
      const minReelLength = 100; // Minimum items for a good spin
      const preWinItemsCount = 50; // How many items to show before the winning item on the reel

      // Fill the reel with a mix of winnable and filler items before the winning item
      for (let i = 0; i < preWinItemsCount; i++) {
        const randomPool = Math.random() < 0.3 ? fillerItems : winnableItems; 
        const randomItem = randomPool[Math.floor(Math.random() * randomPool.length)];
        generatedItems.push(randomItem);
        console.log(`CaseOpening: Pushed pre-winning item ${i}:`, randomItem.name);
      }

      // Add the actual winning item, directly using its name and icon from the prop
      const actualWinningItemInReel = { 
        id: item.id,
        name: item.name, 
        icon: getIconForItem(item.id)
      };
      generatedItems.push(actualWinningItemInReel);
      const winningIndexInGenerated = generatedItems.length - 1;
      console.log('CaseOpening: Pushed winning item:', actualWinningItemInReel.name, 'at index', winningIndexInGenerated);

      // Fill the rest of the reel with random items (mix of winnable and filler) to reach minReelLength
      for (let i = generatedItems.length; i < minReelLength; i++) {
        const randomPool = Math.random() < 0.3 ? fillerItems : winnableItems; 
        const randomItem = randomPool[Math.floor(Math.random() * randomPool.length)];
        generatedItems.push(randomItem);
        console.log(`CaseOpening: Pushed post-winning item ${i}:`, randomItem.name);
      }

      setSpinningItems(generatedItems);
      setFinalWinningIndex(winningIndexInGenerated);

      console.log('CaseOpening: Generated spinning items (first 10):', generatedItems.slice(0, 10).map(item => item.name));
      console.log('CaseOpening: Generated spinning items (around winning index):', generatedItems.slice(Math.max(0, winningIndexInGenerated - 5), winningIndexInGenerated + 6).map(item => item.name));
      console.log('CaseOpening: Final winning index:', winningIndexInGenerated);
      console.log('CaseOpening: Winning item details (from generated list):', generatedItems[winningIndexInGenerated]);

      setAnimationState('spinning');
      
      const spinDuration = 4; 
      const landingDuration = 3; 

      const timer1 = setTimeout(() => {
        setAnimationState('landing');
      }, spinDuration * 1000);

      const timer2 = setTimeout(() => {
        setAnimationState('result');
      }, (spinDuration + landingDuration) * 1000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setAnimationState('idle');
      setFinalWinningIndex(-1);
      setSpinningItems([]); 
      setCurrentOpenedItem(null); // Clear stored item on close
    }
  }, [isOpen, item, reelRef.current?.offsetWidth, currentOpenedItem]);

  const getIconForItem = (itemId) => {
    // First, check winnable items for a match
    const foundWinnableItem = winnableItems.find(mock => mock.id === itemId);
    if (foundWinnableItem) return foundWinnableItem.icon;

    // If not found in winnable, check filler items
    const foundFillerItem = fillerItems.find(mock => mock.id === itemId);
    if (foundFillerItem) return foundFillerItem.icon;

    return '❓'; // Default unknown icon
  };

  const calculateCenteredX = () => {
    if (!reelRef.current || finalWinningIndex === -1 || spinningItems.length === 0) return 0;

    const reelContainerWidth = reelRef.current.offsetWidth;
    const targetItemCenterOffset = (finalWinningIndex * itemWidth) + (itemWidth / 2);
    return (reelContainerWidth / 2) - targetItemCenterOffset;
  };


  let animateProps = {};
  let transitionProps = {};

  if (animationState === 'spinning') {
    const numFullSpins = 5; 
    const totalSpinDistance = (spinningItems.length * itemWidth * numFullSpins) + calculateCenteredX();

    animateProps = { x: -totalSpinDistance };
    transitionProps = { duration: 25, ease: "linear" }; 
  } else if (animationState === 'landing') {
    animateProps = { x: calculateCenteredX() };
    transitionProps = { type: "spring", stiffness: 70, damping: 20, mass: 1.5 }; 
  } else if (animationState === 'result') {
    animateProps = { x: calculateCenteredX() };
    transitionProps = { duration: 0 }; 
  }


  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2 style={styles.title}>{caseName}</h2>

        <div style={styles.reelContainer} ref={reelRef}>
          <motion.div
            style={styles.reelInner}
            animate={animateProps}
            transition={transitionProps}
          >
            {spinningItems.map((mockItem, index) => (
              <div
                key={index} 
                style={{
                  ...styles.reelItem,
                  // Apply active style only during landing for visual effect on the reel
                  ...(animationState === 'landing' && index === finalWinningIndex ? styles.reelItemActive : {}),
                  ...(animationState === 'result' && index === finalWinningIndex ? styles.reelItemActive : {}), // Keep active for final state
                }}
              >
                <span>{mockItem.icon}</span>
                <span style={styles.reelItemName}>{mockItem.name}</span>
              </div>
            ))}
          </motion.div>
          <div style={styles.centerPointer}></div>
        </div>

        {/* Separate display for the winning item after animation */}
        {animationState === 'result' && currentOpenedItem && (
          <motion.div
            style={styles.resultItem}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
          >
            <FaGift style={styles.giftIcon} />
            <h3 style={styles.itemName}>{currentOpenedItem.name}</h3>
            <p style={styles.itemDescription}>{currentOpenedItem.description}</p>
          </motion.div>
        )}

        {(animationState === 'result') && (
          <motion.button
            style={styles.closeButton}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onMouseOver={(e) => e.target.style.background = '#45a049'}
            onMouseOut={(e) => e.target.style.background = '#4CAF50'}
          >
            Kapat
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CaseOpening; 