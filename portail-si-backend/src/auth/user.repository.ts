import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AbilityFactory } from 'src/ability/ability.factory/ability.factory';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtPayload } from './jwt-payload.interface';

export class UserRepository extends Repository<User> {
  constructor(
    // private abilityFactory: AbilityFactory,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  // Custom methods in the repo...

  // Get all users
  // async getUsers(): Promise<User[]> {
  //   const query = this.userRepository.createQueryBuilder('user');

  //   const users = await query.getMany();
  //   return users;
  // }

  //Sign Up new user
  async signUp(createAuthDto: CreateAuthDto): Promise<void> {
    const {
      first_name,
      last_name,
      password,
      email,
      profilPicture,
      matricule,
      fonction,
      deleted,
      role_id,
    } = createAuthDto;
    // initiate new User entity
    const user = new User();
    // isert username
    user.first_name = first_name;
    user.last_name = last_name;
    user.profilPicture = profilPicture;
    user.matricule = matricule;
    user.fonction = fonction;
    user.deleted = deleted;
    if (role_id) {
      user.role_id = role_id;
    }
    // isert username
    user.email = email;
    // prepare unique salt per user
    user.salt = await bcrypt.genSalt();
    // hash password with unique salt
    user.password = await this.hashPassword(password, user.salt);
    console.log(user);

    try {
      // insert user into DB
      await user.save();
    } catch (error) {
      // throw error in case of duplicate or else...
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists !');
      } else {
        console.log(error);

        throw new InternalServerErrorException();
      }
    }
  }

  //Password Validation for user
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ email: string; first_name: string; last_name: string }> {
    //roles: Role[]
    const { password, email } = authCredentialsDto;
    // find user from DB
    const user = await this.userRepository.findOneBy({ email });
    // check if user exist and the password is valid
    if (user && (await user.validatePassword(password))) {
      // Get User roles

      return {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };
    } else {
      return null;
    }
  }

  // Update a user
  async updateUser(
    id: number,
    updateCredentialsDto: UpdateAuthDto,
  ): Promise<{ accessToken: string }> {
    const {
      first_name,
      last_name,
      profilPicture,
      password,
      email,
      fonction,
      matricule,
      deleted,
      role_id,
    } = updateCredentialsDto;
    // find user from DB
    const user = await this.userRepository.findOneBy({ id });
    if (first_name) {
      user.first_name = first_name;
    }
    if (last_name) {
      user.last_name = last_name;
    }
    if (profilPicture) {
      user.profilPicture = profilPicture;
    }
    if (password) {
      // prepare unique salt per user
      user.salt = await bcrypt.genSalt();
      // hash password with unique salt
      user.password = await this.hashPassword(password, user.salt);
    }
    if (email) {
      user.email = email;
    }
    if (fonction) {
      user.fonction = fonction;
    }
    if (matricule) {
      user.matricule = matricule;
    }
    if (deleted) {
      user.deleted = deleted;
    }
    if (role_id) {
      user.role_id = role_id;
    }

    await user.save();
    // payload for token
    const payload: JwtPayload = { email, first_name, last_name };
    // create an access token for user
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  // Hash user Password
  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
