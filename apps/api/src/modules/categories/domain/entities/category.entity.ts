import { TransactionKind } from '../../../transactions/domain/enums/transaction-kind.enum';
import { CategoryColor } from '../enums/category-color.enum';
import { CategoryScope } from '../enums/category-scope.enum';

export class Category {
  constructor(
    public readonly id: string,
    public readonly spaceId: string,
    public name: string,
    public tag: string,
    public description: string,
    public kind: TransactionKind,
    public color: CategoryColor,
    public monthlyLimitCents: number | null,
    public scope: CategoryScope,
    public ownerId: string | null,
  ) {}

  isVisibleTo(userId: string): boolean {
    return this.scope === CategoryScope.SHARED || this.ownerId === userId;
  }
}
