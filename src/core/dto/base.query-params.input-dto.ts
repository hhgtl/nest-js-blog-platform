import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

//базовый класс для query параметров с пагинацией
//значения по-умолчанию применятся автоматически при настройке глобального ValidationPipe в main.ts
export class BaseQueryParams {
  //для трансформации в number
  @IsOptional()
  @Transform((params: TransformFnParams): number => {
    const value: unknown = params.value;
    return value === undefined || value === '' ? 1 : Number(value);
  })
  @Type(() => Number)
  @IsNumber()
  pageNumber: number = 1;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' ? 10 : Number(value),
  )
  @Type(() => Number)
  @IsNumber()
  pageSize: number = 10;

  @IsOptional()
  @Transform((params: TransformFnParams): SortDirection => {
    const value: unknown = params.value;
    if (value === undefined || value === '') return SortDirection.Desc;
    return value as SortDirection;
  })
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
