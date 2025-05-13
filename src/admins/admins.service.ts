import { Injectable } from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Admin } from "./models/admin.models";

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin) private readonly adminModel: typeof Admin) {}
  create(createAdminDto: CreateAdminDto) {
    return this.adminModel.create(createAdminDto);
  }

  findAll() {
    return this.adminModel.findAll({ include: { all: true } });
  }

  findByEmail(email: string) {
    return this.adminModel.findOne({ where: { email: email } });
  }

  findOne(id: number) {
    return this.adminModel.findByPk(id, { include: { all: true } });
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.adminModel.update(updateAdminDto, { where: { id } });
  }

  remove(id: number) {
    return this.adminModel.destroy({ where: { id } });
  }

  async updateRefreshToken(id: number, refresh_token: string) {
    const updatedAdmin = await this.adminModel.update(
      { refresh_token },
      { where: { id } }
    );
    return updatedAdmin;
  }

  async updateIsActive(id: number, is_active: boolean) {
    return this.adminModel.update({ is_active }, { where: { id } });
  }
}
