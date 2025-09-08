import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Faction from './Faction.js';
import RegUser from './User.js';

const FactionMember = sequelize.define('FactionMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  factionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Factions',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('MEMBER', 'OFFICER', 'LEADER'),
    defaultValue: 'MEMBER'
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  totalPixels: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dailyPixels: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'FactionMembers',
  timestamps: true
});

// İlişkileri tanımla
FactionMember.associate = (models) => {
  FactionMember.belongsTo(models.Faction, {
    foreignKey: 'factionId',
    as: 'faction'
  });

  FactionMember.belongsTo(models.RegUser, {
    foreignKey: 'userId',
    as: 'user'
  });
};

export default FactionMember; 