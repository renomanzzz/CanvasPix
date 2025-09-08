import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'ttag';
import { FaShoppingBag, FaClock, FaCalendarAlt, FaBox, FaGift, FaCoins } from 'react-icons/fa';
import CaseOpening from './CaseOpening';

const styles = {
  container: {
    padding: '20px',
    color: 'var(--text-color, #000000)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--heading-color, #000000)',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    background: 'var(--tab-bg, rgba(0, 0, 0, 0.1))',
    border: 'none',
    borderRadius: '5px',
    color: 'var(--text-color, #000000)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    background: 'var(--tab-active-bg, rgba(0, 0, 0, 0.2))',
    boxShadow: 'var(--tab-shadow, 0 0 10px rgba(0, 0, 0, 0.1))',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'var(--card-bg, #ffffff)',
    borderRadius: '10px',
    padding: '20px',
    transition: 'all 0.3s ease',
    border: '1px solid var(--border-color, rgba(0, 0, 0, 0.1))',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 'var(--card-shadow, 0 5px 15px rgba(0, 0, 0, 0.1))',
      border: '1px solid var(--border-hover-color, rgba(0, 0, 0, 0.2))',
    },
  },
  itemName: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: 'var(--heading-color, #000000)',
  },
  itemDescription: {
    fontSize: '14px',
    color: 'var(--text-secondary, #666666)',
    marginBottom: '15px',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--text-secondary, #666666)',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-secondary, #666666)',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--error-color, #ff4444)',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-secondary, #666666)',
  },
  itemDetailsModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'var(--modal-overlay, rgba(0, 0, 0, 0.8))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'var(--modal-bg, #ffffff)',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: 'var(--modal-shadow, 0 4px 20px rgba(0, 0, 0, 0.1))',
  },
  modalContentH3: {
    margin: '0 0 16px 0',
    color: 'var(--heading-color, #000000)',
    fontSize: '1.4em',
  },
  modalContentP: {
    margin: '8px 0',
    color: 'var(--text-secondary, #666666)',
    lineHeight: '1.5',
  },
  modalContentButton: {
    background: 'var(--accent-color, #4a90e2)',
    color: 'var(--text-on-accent, #ffffff)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '16px',
    fontSize: '1em',
    transition: 'background 0.2s ease',
  },
};

const themeStyles = `
  /* Light Theme Variables */
  :global(.light-theme) {
    --text-color: #000000;
    --text-secondary: #666666;
    --heading-color: #000000;
    --card-bg: #ffffff;
    --card-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    --border-color: rgba(0, 0, 0, 0.1);
    --border-hover-color: rgba(0, 0, 0, 0.2);
    --tab-bg: rgba(0, 0, 0, 0.1);
    --tab-active-bg: rgba(0, 0, 0, 0.2);
    --tab-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    --modal-bg: #ffffff;
    --modal-overlay: rgba(0, 0, 0, 0.5);
    --modal-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    --accent-color: #4a90e2;
    --text-on-accent: #ffffff;
    --error-color: #ff4444;
  }

  /* Dark Theme Variables */
  :global(.dark-theme) {
    --text-color: #ffffff;
    --text-secondary: #b9bbbe;
    --heading-color: #ffffff;
    --card-bg: #2f3136;
    --card-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    --border-color: rgba(255, 255, 255, 0.1);
    --border-hover-color: rgba(255, 255, 255, 0.2);
    --tab-bg: rgba(255, 255, 255, 0.1);
    --tab-active-bg: rgba(255, 255, 255, 0.2);
    --tab-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    --modal-bg: #2f3136;
    --modal-overlay: rgba(0, 0, 0, 0.8);
    --modal-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    --accent-color: #5865f2;
    --text-on-accent: #ffffff;
    --error-color: #ed4245;
  }
`;

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'gifts'
  const userId = useSelector(state => state.user?.id);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCaseOpening, setShowCaseOpening] = useState(false);
  const [openedItem, setOpenedItem] = useState(null);
  const [openedCaseName, setOpenedCaseName] = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/inventory');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }
        const data = await response.json();
        
        console.log('Raw inventory data:', data);

        // Handle different response formats
        let inventoryData = [];
        if (data.success && data.inventory) {
          inventoryData = data.inventory;
        } else if (data.success && data.items) {
          inventoryData = data.items;
        } else if (Array.isArray(data)) {
          inventoryData = data;
        }

        // Process inventory items to ensure correct structure
        inventoryData = inventoryData.map(item => {
          // Directly use item.item.name and item.item.description if available
          const name = item.item?.name || 'Bilinmeyen Item';
          const description = item.item?.description || 'Açıklama bulunamadı';
          // Use item.itemId to determine if it's a case
          const isCaseItem = item.itemId === 'case_1' || item.itemId === 'case_2';

          return {
            id: item.id || Math.random().toString(36).substr(2, 9),
            itemId: item.itemId,
            name: name,
            description: description,
            purchasedAt: item.metadata?.purchasedAt || item.purchasedAt || new Date().toISOString(),
            expiresAt: item.expiresAt || null,
            isGift: item.isGift || false,
            metadata: item.metadata,
            isCase: isCaseItem // Assign the correct isCase value
          };
        });

        setInventory(inventoryData);
        
        console.log('Processed inventory:', inventoryData);
      } catch (err) {
        console.error('Failed to fetch inventory:', err);
        setError(err.message);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [userId]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const handleCloseDetails = () => {
    setShowItemDetails(false);
    setSelectedItem(null);
    setShowCaseOpening(false); // Close case opening animation
    fetchInventory(); // Re-fetch inventory after closing modal
  };

  const handleOpenCase = async (inventoryItemId, caseName) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch('/api/inventory/open-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ inventoryItemId }),
      });
      const data = await response.json();

      if (data.success) {
        setOpenedCaseName(caseName);
        setOpenedItem(data.item); // Kasadan çıkan item
        console.log('Opened Item Data from API:', data.item);
        setShowCaseOpening(true); // Animasyonu göster
        // Envanter otomatik olarak handleCloseDetails içinde güncellenecek
      } else {
        setError(data.message || 'Failed to open case.');
      }
    } catch (error) {
      console.error('Error opening case:', error);
      setError('An error occurred while opening the case.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Süresiz';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ensure inventory is an array before filtering
  const filteredInventory = Array.isArray(inventory) 
    ? inventory.filter(item => activeTab === 'items' ? !item.isGift : item.isGift)
    : [];

  if (loading) {
    return <div style={styles.loading}>{t`Loading inventory...`}</div>;
  }

  if (error) {
    return <div style={styles.error}>{t`Error: ${error}`}</div>;
  }

  return (
    <div style={styles.container}>
      <style>{themeStyles}</style>
      <div style={styles.header}>
        <FaShoppingBag size={24} />
        <h1 style={styles.title}>{t`Inventory`}</h1>
      </div>

      <div style={styles.tabs}>
        <button 
          style={{...styles.tab, ...(activeTab === 'items' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('items')}
        >
          <FaBox style={{ marginRight: '8px' }} />
          {t`Items`}
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'gifts' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('gifts')}
        >
          <FaGift style={{ marginRight: '8px' }} />
          {t`Gifts`}
        </button>
      </div>

      {filteredInventory.length === 0 ? (
        <div style={styles.empty}>
          {activeTab === 'items' 
            ? t`No items in your inventory`
            : t`No gifts in your inventory`
          }
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredInventory.map((item) => (
            <div 
              key={item.id}
              style={styles.card}
            >
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemDescription}>{item.description}</p>
              {item.isCase ? (
                <button 
                  onClick={() => handleOpenCase(item.id, item.name)}
                  style={{
                    marginTop: '15px',
                    padding: '10px 15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1em',
                    fontWeight: 'bold',
                  }}
                >
                  Kasayı Aç
                </button>
              ) : (
                <button 
                  onClick={() => handleItemClick(item)}
                  style={{
                    marginTop: '15px',
                    padding: '10px 15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '1em',
                    fontWeight: 'bold',
                  }}
                >
                  Detayları Gör
                </button>
              )}
              <div style={{ ...styles.itemDetails, marginTop: '15px' }}>
                <div style={styles.detailRow}>
                  <FaCalendarAlt />
                  <span>Satın Alınma: {formatDate(item.purchasedAt)}</span>
                </div>
                {item.expiresAt && (
                  <div style={styles.detailRow}>
                    <FaClock />
                    <span>Bitiş: {formatDate(item.expiresAt)}</span>
                  </div>
                )}
                {item.metadata?.price !== undefined && (
                <div style={styles.detailRow}>
                    <FaCoins />
                    <span>Fiyat: {item.metadata.price} PXR</span>
                </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showItemDetails && selectedItem && !showCaseOpening && (
        <div style={styles.itemDetailsModalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalContentH3}>{selectedItem.name}</h3>
            <p style={styles.modalContentP}>{selectedItem.description}</p>
            <p style={styles.modalContentP}>Satın Alınma: {formatDate(selectedItem.purchasedAt)}</p>
            {selectedItem.expiresAt && (
              <p style={styles.modalContentP}>Bitiş Tarihi: {formatDate(selectedItem.expiresAt)}</p>
            )}
            {selectedItem.metadata?.price !== undefined && (
              <p style={styles.modalContentP}>Fiyat: {selectedItem.metadata.price} PXR</p>
            )}
            {selectedItem.metadata?.benefits && (
              <div style={{marginTop: '10px'}}>
                <h4 style={{ color: '#fff', marginBottom: '5px' }}>Avantajlar:</h4>
                <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                  {selectedItem.metadata.benefits.cooldown && (
                    <li style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Cooldown: {selectedItem.metadata.benefits.cooldown}x</li>
                  )}
                  {selectedItem.metadata.benefits.pixelBonus && (
                    <li style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Pixel Bonus: {selectedItem.metadata.benefits.pixelBonus}x</li>
                  )}
                </ul>
              </div>
            )}
            <button
              onClick={handleCloseDetails}
              style={styles.modalContentButton}
              onMouseOver={(e) => e.target.style.background = '#357abd'}
              onMouseOut={(e) => e.target.style.background = '#4a90e2'}
            >Kapat</button>
          </div>
        </div>
      )}

      <CaseOpening
        isOpen={showCaseOpening}
        onClose={handleCloseDetails}
        item={openedItem}
        caseName={openedCaseName}
      />
    </div>
  );
};

export default Inventory; 