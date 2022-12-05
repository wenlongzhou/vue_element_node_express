import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class AdminRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  permissions: string
  routes: Array<string>

  @Column()
  remark: string

  @Column()
  create_time: string
}