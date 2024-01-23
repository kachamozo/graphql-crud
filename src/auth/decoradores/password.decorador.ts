import { BadRequestException } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function PasswordValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'PasswordValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any) {
          //regex que tenga un numero, una minuscula y una mayuscula
          if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/.test(value)) {
            throw new BadRequestException(
              'Contraseña Incorrecta Tiene que tener una mayúscula, minúscula y un número',
            );
          }

          return true;
        },
      },
    });
  };
}
