import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { CreateSpaceUseCase } from './application/use-cases/create-space.use-case';
import { GetSpaceUseCase } from './application/use-cases/get-space.use-case';
import { InviteToSpaceUseCase } from './application/use-cases/invite-to-space.use-case';
import { JoinSpaceUseCase } from './application/use-cases/join-space.use-case';
import { LeaveSpaceUseCase } from './application/use-cases/leave-space.use-case';
import { ListUserSpacesUseCase } from './application/use-cases/list-user-spaces.use-case';
import { RemoveMemberUseCase } from './application/use-cases/remove-member.use-case';
import { RenameSpaceUseCase } from './application/use-cases/rename-space.use-case';
import { SpaceRepository } from './domain/repositories/space.repository';
import { SpacesController } from './http/controllers/spaces.controller';
import { SpaceMemberGuard } from './http/guards/space-member.guard';
import { SpaceInviteOrmEntity } from './infrastructure/persistence/typeorm/space-invite.orm-entity';
import { SpaceMemberOrmEntity } from './infrastructure/persistence/typeorm/space-member.orm-entity';
import { SpaceOrmEntity } from './infrastructure/persistence/typeorm/space.orm-entity';
import { SpaceTypeOrmRepository } from './infrastructure/persistence/typeorm/space-typeorm.repository';
import { UserOrmEntity } from '../users/infrastructure/persistence/typeorm/user.orm-entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      SpaceOrmEntity,
      SpaceMemberOrmEntity,
      SpaceInviteOrmEntity,
      UserOrmEntity,
    ]),
  ],
  controllers: [SpacesController],
  providers: [
    { provide: SpaceRepository, useClass: SpaceTypeOrmRepository },
    SpaceMemberGuard,
    CreateSpaceUseCase,
    ListUserSpacesUseCase,
    GetSpaceUseCase,
    RenameSpaceUseCase,
    InviteToSpaceUseCase,
    JoinSpaceUseCase,
    RemoveMemberUseCase,
    LeaveSpaceUseCase,
  ],
  exports: [SpaceRepository, SpaceMemberGuard, CreateSpaceUseCase],
})
export class SpacesModule {}
