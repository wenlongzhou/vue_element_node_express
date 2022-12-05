import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { AdminRole } from "./adminRole"

@Entity()
export class AdminUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user: string

  @Column()
  password: string

  @Column()
  role_ids: string

  @Column()
  create_time: string

  @OneToMany(() => AdminRole, role => role.id)
  role: AdminRole[]
}