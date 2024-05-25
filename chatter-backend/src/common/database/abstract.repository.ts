import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  FilterQuery,
  Model,
  ProjectionType,
  Types,
  UpdateQuery,
} from 'mongoose';

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) {}

  async create(document: Partial<Omit<T, '_id'>>): Promise<T> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    const newDocument = (await createdDocument.save()).toJSON() as unknown as T;
    return { ...newDocument, __v: undefined };
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    populateField: string = null,
    projection: ProjectionType<T> = {},
  ): Promise<T> {
    let query = this.model
      .findOne(filterQuery, projection)
      .lean<T>()
      .select('-__v');

    if (populateField) query = query.populate(populateField, '-__v');

    const document = await query;

    if (!document) {
      this.logger.warn('Document not found with filterQuery ', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async find(
    filterQuery: FilterQuery<T>,
    populateField: string = null,
    projection: ProjectionType<T> = {},
  ): Promise<T[]> {
    let query = this.model
      .find(filterQuery, projection)
      .lean<T[]>()
      .select('-__v');

    if (populateField) query = query.populate(populateField, '-__v');

    return query;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<T>()
      .select('-__v');

    if (!document) {
      this.logger.warn('Document was not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    return this.model.findOneAndDelete(filterQuery).lean<T>();
  }
}
