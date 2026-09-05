import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { CurrentUser } from '../../../auth/http/decorators/current-user.decorator';
import { User } from '../../../users/domain/entities/user.entity';
import {
  CreateSpaceDto,
  InviteToSpaceDto,
  JoinSpaceDto,
  RenameSpaceDto,
} from '../../application/dto/space.dto';
import { CreateSpaceUseCase } from '../../application/use-cases/create-space.use-case';
import { GetSpaceUseCase } from '../../application/use-cases/get-space.use-case';
import { InviteToSpaceUseCase } from '../../application/use-cases/invite-to-space.use-case';
import { JoinSpaceUseCase } from '../../application/use-cases/join-space.use-case';
import { LeaveSpaceUseCase } from '../../application/use-cases/leave-space.use-case';
import { ListUserSpacesUseCase } from '../../application/use-cases/list-user-spaces.use-case';
import { RemoveMemberUseCase } from '../../application/use-cases/remove-member.use-case';
import { RenameSpaceUseCase } from '../../application/use-cases/rename-space.use-case';
import { presentSpace } from './space.presenter';

@Controller('spaces')
export class SpacesController {
  constructor(
    private readonly createSpace: CreateSpaceUseCase,
    private readonly listUserSpaces: ListUserSpacesUseCase,
    private readonly getSpace: GetSpaceUseCase,
    private readonly renameSpace: RenameSpaceUseCase,
    private readonly inviteToSpace: InviteToSpaceUseCase,
    private readonly joinSpace: JoinSpaceUseCase,
    private readonly removeMember: RemoveMemberUseCase,
    private readonly leaveSpace: LeaveSpaceUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: User) {
    const spaces = await this.listUserSpaces.execute(user.id);

    return spaces.map((space) => presentSpace(space));
  }

  @Post()
  async create(@CurrentUser() user: User, @Body() dto: CreateSpaceDto) {
    return presentSpace(await this.createSpace.execute(user, dto.name));
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  async join(@CurrentUser() user: User, @Body() dto: JoinSpaceDto) {
    return presentSpace(await this.joinSpace.execute(user, dto.code));
  }

  @Get(':id')
  async detail(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return presentSpace(await this.getSpace.execute(id, user.id));
  }

  @Patch(':id')
  async rename(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: RenameSpaceDto,
  ) {
    return presentSpace(await this.renameSpace.execute(id, user.id, dto.name));
  }

  @Post(':id/invites')
  async invite(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: InviteToSpaceDto,
  ) {
    return presentSpace(
      await this.inviteToSpace.execute(id, user.id, dto.email),
    );
  }

  @Delete(':id/members/:userId')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: User,
  ) {
    return presentSpace(await this.removeMember.execute(id, user.id, userId));
  }

  @Delete(':id/members/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.leaveSpace.execute(id, user.id);
  }
}
