import { PartialType } from '@nestjs/swagger';
import { CreateBracketDto } from './create-bracket.dto';

export class UpdateBracketDto extends PartialType(CreateBracketDto) {}
