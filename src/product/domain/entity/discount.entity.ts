import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Expose } from 'class-transformer';
  import { BadRequestException } from '@nestjs/common';
  
  @Entity()
  export class Discount {
    @PrimaryGeneratedColumn()
    @Expose({ groups: ['group_promotions'] })
    id?: string;
  
    @Column()
    @Expose({ groups: ['group_promotions'] })
    nom: string;
  
    @Column()
    @Expose({ groups: ['group_promotions'] })
    code: string;
  
    @Column({ default: 1500 })
    @Expose({ groups: ['group_promotions'] })
    amount: number;
  
    constructor(nom: string, code: string, amount?: number) {
      this.nom = nom;
      this.code = code;
      this.amount = amount ?? 1500; 
      this.validatePromotion();
    }
  
    private validatePromotion() {
      if (!this.nom || !this.code) {
        throw new BadRequestException('Promotion must have a name and code.');
      }
    }
  }
  