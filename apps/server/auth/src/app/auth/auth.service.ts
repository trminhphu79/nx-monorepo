import { BadRequestException, Injectable } from '@nestjs/common';
import { from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Account } from '@server/shared/entity/account';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateAccountDto,
  SignInAccountDto,
} from '@server/shared/dtos/account';
import { Profile } from '@server/shared/entity/profile';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account)
    private userModel: typeof Account,
    @InjectModel(Profile)
    private profileModel: typeof Profile
  ) {}

  createOne(payload: CreateAccountDto): Observable<any> {
    return from(
      this.userModel.findOrCreate({
        where: { username: payload.username },
        defaults: {
          username: payload.username,
          password: payload.password, // Make sure to hash the password before saving
        },
      })
    ).pipe(
      switchMap(async ([account, isCreated]) => {
        if (!isCreated) {
          return {
            message: 'User already exists!',
            data: payload,
          };
        }

        // Create a profile for the newly created account
        const profile = await this.profileModel.create({
          accountId: account.id,
          fullName: account.username || 'default-name',
          avatarUrl: this.randomImg(),
          bio: 'Chat with me',
        });

        const result = account.toJSON();
        delete result.password;

        return {
          message: 'Account and profile created successfully!',
          account: result,
          profile,
        };
      })
    );
  }

  signIn(payload: SignInAccountDto) {
    return from(
      this.userModel.findOne({
        where: {
          username: payload.username,
          password: payload.password,
        },
      })
    ).pipe(
      switchMap((response) => {
        if (!response) {
          return throwError(
            () => new BadRequestException('Invalid credentials')
          );
        }
        return of(response);
      }),
      tap((response) => {
        console.log('response: ', response);
      })
    );
  }

  randomImg(): string {
    const images = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpTxZYsXlSi3QjP1ourPWa0ceS1-3qMP2yGw&s',
      'https://wallpapershome.com/images/pages/pic_v/25654.jpg',
      'https://imgcdn.stablediffusionweb.com/2024/9/19/c86d2133-6b44-4892-a830-a2b403df5798.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTynVaVrlGzFHaL33Qx5QVLGdNiT1bB2IgS-g&s',
    ];

    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }
}
