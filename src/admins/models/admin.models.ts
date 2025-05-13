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
    activation_link: string;
    is_active: boolean;
}

@Table({ tableName: "admins", timestamps: false })
export class Admin extends Model<Admin, IAdminCreationAttr> {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare first_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare last_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare role: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare refresh_token: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare activation_link: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare is_active: boolean;
}
