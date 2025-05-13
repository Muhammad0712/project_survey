import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
    first_name: string;
    last_name: string;
    username: string;
    phone: string;
    role: string;
    email: string;
    password: string;
    refresh_token: string;
    is_active: boolean;
}

@Table({ tableName: "admins", timestamps: false })
export class Admin extends Model<Admin, IAdminCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  declare phone: string;

  @Column({
    type: DataType.ENUM("admin", "superadmin"),
    defaultValue: "admin",
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "",
  })
  declare refresh_token: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_active: boolean;
}
