import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
  ) {}

  async findOneById(id: string) {
    const match = await this.matchesRepository.findOne({
      where: { id: id },
      relations: { players: true },
    });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }
}
