import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';

export class ValidationFailException extends HttpException {
  constructor(public readonly errors: ValidationError[]) {
    super('Unprocessable Entity', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  getResponse() {
    return {
      timestamp: new Date().toISOString(),
      message: this.message,
      errors: this.flatten(this.errors, '.').reduce(
        (errors, { property, constraints }) => {
          return {
            ...errors,
            [property]: constraints,
          };
        },
        {},
      ),
    };
  }

  private flatten(
    validationErrors: ValidationError[],
    delimiter: string,
  ): ValidationError[] {
    return validationErrors.flatMap((error) => {
      if (!error.children || error.children.length === 0) {
        return [error];
      }

      const flattenedChildren = this.flatten(error.children, delimiter);
      return flattenedChildren.map((child: ValidationError) => {
        return {
          ...child,
          property: error.property + delimiter + child.property,
        };
      });
    });
  }
}
