import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import { Op } from 'sequelize';

const FactionTerritory = sequelize.define('FactionTerritory', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  factionId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'Factions',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startX: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startY: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  endX: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  endY: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: false,
    defaultValue: '#000000',
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'FactionTerritories',
  indexes: [
    {
      fields: ['factionId']
    },
    {
      fields: ['startX', 'startY', 'endX', 'endY']
    }
  ]
});

// İlişkileri tanımla
FactionTerritory.associate = (models) => {
  FactionTerritory.belongsTo(models.Faction, {
    foreignKey: 'factionId',
    as: 'faction',
    onDelete: 'CASCADE' // Faksiyon silinirse bölge de silinsin
  });
};

// Bölge sınırlarını kontrol eden metod
FactionTerritory.prototype.isValidTerritory = function() {
  return (
    this.startX <= this.endX &&
    this.startY <= this.endY &&
    Math.abs(this.endX - this.startX) <= 1000 && // Maksimum genişlik
    Math.abs(this.endY - this.startY) <= 1000    // Maksimum yükseklik
  );
};

// Bölge çakışmasını kontrol eden metod
FactionTerritory.prototype.hasOverlap = async function() {
  const overlappingTerritory = await FactionTerritory.findOne({
    where: {
      [Op.or]: [
        // Yatay çakışma
        {
          startX: { [Op.lte]: this.endX },
          endX: { [Op.gte]: this.startX },
          startY: { [Op.lte]: this.endY },
          endY: { [Op.gte]: this.startY }
        }
      ],
      id: { [Op.ne]: this.id } // Kendisi hariç
    }
  });
  return !!overlappingTerritory;
};

export default FactionTerritory; 