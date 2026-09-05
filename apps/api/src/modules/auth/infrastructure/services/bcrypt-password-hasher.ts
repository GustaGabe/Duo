import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { PasswordHasher } from '../../domain/services/password-hasher';

const ROUNDS = 12;

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
  hash(plain: string): Promise<string> {
    return hash(plain, ROUNDS);
  }

  compare(plain: string, digest: string): Promise<boolean> {
    return compare(plain, digest);
  }
}
