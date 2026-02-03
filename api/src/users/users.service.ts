import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    user.passwordHash = hash;

    user = await this.usersRepository.save(user);

    const { passwordHash, ...result } = user; // Retire le hash du mot de passe de l'objet pour ne pas l'envoyer dans la requête

    return result;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByName(name: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { name: name } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByIdWithOrganizedTournaments(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: {
        id: true,
        organizedTournaments: {
          id: true,
          brackets: { id: true, matches: { id: true } },
        },
      },
      relations: { organizedTournaments: { brackets: { matches: true } } },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    const newName = updateUserDto.name;
    if (newName) {
      user.name = newName;
    }
    const newEmail = updateUserDto.email;
    if (newEmail) {
      user.email = newEmail;
    }
    await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
