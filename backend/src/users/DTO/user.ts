import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class UsersDefinition {
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
