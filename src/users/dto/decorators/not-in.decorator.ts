import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/**
 * NotIn 유효성 검사 제약 조건
 * 현재 필드의 값이 다른 필드에 포함되어 있는지 확인
 */
@ValidatorConstraint({ name: 'notIn', async: false })
export class NotInConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    // args.constraints[0]: 비교할 필드 이름 (예: 'password')
    // args.object: 전체 DTO 객체
    console.log('args', args);
    const [relatedPropertyName] = args.constraints;
    console.log('relatedPropertyName', relatedPropertyName);
    const relatedValue = (args.object as any)[relatedPropertyName];
    console.log('relatedValue', relatedValue);

    // 비교할 필드가 없거나 값이 없으면 통과
    if (!relatedValue || !value) {
      return true;
    }

    // 현재 필드의 값이 다른 필드의 값에 포함되어 있는지 확인
    // 대소문자 구분 없이 검사
    const currentValue = String(value).toLowerCase();
    const relatedValueStr = String(relatedValue).toLowerCase();
    console.log('currentValue', currentValue);
    console.log('relatedValueStr', relatedValueStr);
    // 포함되어 있으면 false (유효성 검사 실패)
    return !relatedValueStr.includes(currentValue);
  }

  defaultMessage(args: ValidationArguments): string {
    console.log('args', args);
    const [relatedPropertyName] = args.constraints;
    console.log('relatedPropertyName', relatedPropertyName);
    return `${args.property}에 ${relatedPropertyName}와 같은 문자열을 포함할 수 없습니다.`;
  }
}

/**
 * NotIn 데커레이터
 * 현재 필드의 값이 지정된 다른 필드에 포함되어 있는지 검사
 *
 * @param propertyName 비교할 필드 이름
 * @param validationOptions 유효성 검사 옵션
 *
 * @example
 * ```typescript
 * class CreateUserDto {
 *   @NotIn('password', { message: 'password에 name과 같은 문자열을 포함할 수 없습니다.' })
 *   name: string;
 *
 *   password: string;
 * }
 * ```
 */
export function NotIn(
  propertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyNameToValidate: string) {
    registerDecorator({
      name: 'notIn',
      target: object.constructor,
      propertyName: propertyNameToValidate,
      constraints: [propertyName],
      options: validationOptions,
      validator: NotInConstraint,
    });
  };
}
