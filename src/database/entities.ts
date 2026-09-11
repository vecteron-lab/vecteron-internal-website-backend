import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true }) email!: string;
  @Column({ select: false }) passwordHash!: string;
  @Column({ default: true }) active!: boolean;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
}

export enum ContentKind { Portfolio = 'portfolio', Service = 'services' }
@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar' }) kind!: ContentKind;
  @Column() title!: string;
  @Column({ unique: true }) slug!: string;
  @Column({ type: 'text' }) summary!: string;
  @Column({ type: 'text' }) body!: string;
  @Column({ default: false }) published!: boolean;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}

export enum ContactStatus { New = 'new', InProgress = 'in_progress', Resolved = 'resolved' }
@Entity('contact_requests')
export class ContactRequest {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() name!: string;
  @Column() email!: string;
  @Column() subject!: string;
  @Column({ type: 'text' }) message!: string;
  @Column({ type: 'varchar', default: ContactStatus.New }) status!: ContactStatus;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
