import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AdminsService } from "../admins/admins.service";
import { JwtService } from "@nestjs/jwt";
import { Admin } from "../admins/models/admin.models";
import { SignInDto } from "./dto/sign-in.dto";
import * as bcrypt from "bcrypt";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService
  ) {}

  async generateTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const admin = await this.adminsService.findByEmail(signInDto.email);
    if (!admin) {
      throw new BadRequestException("Email yoki parol xato!");
    }
    if (!admin.is_active) {
      throw new BadRequestException("Avval emailni tasdiqlang");
    }
    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      admin.password
    );
    const { accessToken, refreshToken } = await this.generateTokens(admin);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_TIME),
    });

    admin.refresh_token = refreshToken;
    await admin.save();
    return {
      message: "Tizimga xush kelibsiz!",
      accessToken,
    };
  }

  async signOut(refreshToken: string, res: Response) {
    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!adminData) {
      throw new ForbiddenException("Rucsat etilmagan foydalanuvchi");
    }
    await this.adminsService.updateRefreshToken(adminData.id, refreshToken);
    const admin = await this.adminsService.findByEmail(adminData.email)
    admin!.refresh_token = "";
    await admin!.save()

    res.clearCookie("refresh_token");
    return {
      message: "User logged out succesfully!",
    };
  }

  async refreshTokenAdmin(
    adminId: number,
    refresh_token: string,
    res: Response
  ) {
    const decodedToken = await this.jwtService.decode(refresh_token);

    if (adminId !== decodedToken["id"]) {
      throw new ForbiddenException("Ruxsat etilmagan foydalanuvchi!");
    }
    const admin = await this.adminsService.findOne(adminId);
    if (!admin && !admin!.refresh_token) {
      throw new NotFoundException("User not found");
    }

    const { accessToken, refreshToken } = await this.generateTokens(admin!);
    await this.adminsService.updateRefreshToken(admin!.id, refreshToken);

    res.cookie("refresh_token", refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    return {
      message: "Admin refreshed",
      userId: admin!.id,
      access_token: accessToken,
    };
  }
}
