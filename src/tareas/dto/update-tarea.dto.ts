import { InputType, PartialType } from '@nestjs/graphql';

import { CreateTareaDto } from './create-tarea.dto';

@InputType()
// export class UpdateTareaDto {
//   //{ nullable: true } Graphql-> el nombre no es requrido es opcional
//   @Field(() => String, { nullable: true })
//   @IsString()
//   @IsOptional()
//   nombre?: string;

//   @Field(() => String, { nullable: true })
//   @IsString()
//   @IsOptional()
//   descripcion?: string;
// }

//esta una mejor forma (PartialType) para que extienda y que los campos sean opcionales
export class UpdateTareaDto extends PartialType(CreateTareaDto) {}
