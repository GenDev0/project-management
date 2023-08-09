import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createAuthDto: CreateAuthDto): Promise<void> {
    return this.userRepository.signUp(createAuthDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const userToken = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!userToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: userToken.email,
      first_name: userToken.first_name,
      last_name: userToken.last_name,
      // roles: userToken.roles,
    };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async findAll(page: number) {
    const query = await this.userRepository.createQueryBuilder('user');
    const pageSize = 10;
    const [data, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    console.log(data);
    console.log(total);
    const totalPages = Math.ceil(total / pageSize);
    return { data, total, totalPages };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async updateUser(id: number, updateAuthDto: UpdateAuthDto) {
    return await this.userRepository.updateUser(id, updateAuthDto);
  }

  async remove(id: number) {
    const found = await this.userRepository.delete({ id });
    if (found.affected === 0) {
      throw new NotFoundException(`User with ID "${id} is Not Found"`);
    }
    return { message: `User with ID "${id} has been removed successfully"` };
  }
}
